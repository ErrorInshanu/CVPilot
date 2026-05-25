import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  UIManager,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../../../constants/theme";
import { useResumeStore } from "../../../../store/resumeStore";

// Enable LayoutAnimation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function readCertificationsFromStore() {
  return useResumeStore.getState().activeResume.certifications ?? [];
}

function newCertificationItem() {
  return {
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    name: "",
    organization: "",
    issueDate: "",
    url: "",
  };
}

// ─── Reusable Input Component ─────────────────────────────────────────────────
function CertInput({ label, value, onChangeText, placeholder, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.inputWrapOuter}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputWrap, focused && styles.inputWrapFocused]}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.inputPlaceholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          selectionColor={theme.colors.accentGreen}
          {...props}
        />
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function CertificationsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Zustand Bindings
  const addCertification = useResumeStore((s) => s.addCertification);
  const updateCertification = useResumeStore((s) => s.updateCertification);
 // Assumes you use standard update logic or have updateCertification
  const removeCertification = useResumeStore((s) => s.removeCertification);
  const markSaved = useResumeStore((s) => s.markSaved);

  // Local State
  const [certifications, setCertifications] = useState(readCertificationsFromStore);
  const [expandedId, setExpandedId] = useState(null);

  // Animation Refs
  const saveScale = useRef(new Animated.Value(1)).current;
  const savedOpacity = useRef(new Animated.Value(0)).current;
  const screenEnter = useRef(new Animated.Value(0)).current;

  // Sync state on focus
  useFocusEffect(
    useCallback(() => {
      const storeCerts = readCertificationsFromStore();
      setCertifications(storeCerts);
      if (storeCerts.length === 0) {
        handleAddCert();
      }
    }, [])
  );

  // Entry Animation
  useEffect(() => {
    screenEnter.setValue(0);
    Animated.timing(screenEnter, {
      toValue: 1,
      duration: 480,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [screenEnter]);

  const enterOpacity = screenEnter;
  const enterTranslateY = screenEnter.interpolate({
    inputRange: [0, 1],
    outputRange: [20, 0],
  });

  // ─── Actions ────────────────────────────────────────────────────────────────
  const handleAddCert = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newItem = newCertificationItem();
    setCertifications((prev) => [...prev, newItem]);
    setExpandedId(newItem.id);
  };

  const handleUpdate = (id, field, value) => {
    setCertifications((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  // ✅ Fixed
const handleRemove = (id) => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  const updated = certifications.filter((item) => item.id !== id);
  setCertifications(updated);
  if (expandedId === id) setExpandedId(null);
  removeCertification(id);  // ← sync to store
  markSaved();               // ← mark dirty
};

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSave = () => {
    const storeIds = readCertificationsFromStore().map((item) => item.id);
    
    certifications.forEach((item) => {
      if (storeIds.includes(item.id)) {
        // Fallback to updating entire store array if you don't have updateCertification yet
        const state = useResumeStore.getState();
        if (state.updateCertification) {
            state.updateCertification(item.id, item);
        }
      } else {
        addCertification(item);
      }
    });

    const currentIds = certifications.map((item) => item.id);
    readCertificationsFromStore().forEach((item) => {
      if (!currentIds.includes(item.id)) {
        removeCertification(item.id);
      }
    });

    // Manual full array update if individual update isn't working perfectly
    useResumeStore.setState((state) => ({
      activeResume: { ...state.activeResume, certifications: certifications },
      isDirty: true
    }));

    markSaved();

    savedOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(savedOpacity, { toValue: 1, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(savedOpacity, { toValue: 0, duration: 240, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
    ]).start();
  };

  // Button interaction springs
  const springIn = (anim) => Animated.spring(anim, { toValue: 0.96, useNativeDriver: true, speed: 30, bounciness: 4 }).start();
  const springOut = (anim) => Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 24, bounciness: 6 }).start();

  return (
    <View style={styles.root}>
      <View style={styles.bgBase} />
      <View style={styles.glowA} />
      <View style={styles.vignette} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            { paddingTop: Math.max(insets.top, 16), paddingBottom: insets.bottom + 60 },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={{ opacity: enterOpacity, transform: [{ translateY: enterTranslateY }], gap: theme.spacing.xl }}>
            
            {/* ── Top bar ── */}
            <View style={styles.topBar}>
              <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
                <Ionicons name="chevron-back" size={22} color={theme.colors.white} />
              </Pressable>
              <Text style={styles.screenTitle}>Certifications</Text>
              <Pressable onPress={() => router.back()} style={styles.skipBtn} hitSlop={12}>
                <Text style={styles.skipText}>{certifications.length > 0 ? "Done" : "Skip"}</Text>
              </Pressable>
            </View>

            {/* ── Subtitle & Badge ── */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.screenSub}>Highlight your verified credentials</Text>
              {certifications.length > 0 && (
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{certifications.length} added</Text>
                </View>
              )}
            </View>

            {/* ── Empty State ── */}
            {certifications.length === 0 && (
              <View style={styles.emptyWrap}>
                <Ionicons name="ribbon-outline" size={36} color={theme.colors.textWhite30} />
                <Text style={styles.emptyText}>No certifications yet</Text>
                <Text style={styles.emptySubtext}>Add verified licenses and courses to stand out.</Text>
              </View>
            )}

            {/* ── Cards ── */}
            <View style={styles.cardsFlow}>
              {certifications.map((cert, index) => {
                const isExpanded = expandedId === cert.id;

                return (
                  <View key={cert.id} style={[styles.card, isExpanded && styles.cardExpanded]}>
                    <Pressable 
                      style={styles.cardHeader} 
                      onPress={() => toggleExpand(cert.id)}
                    >
                      <View style={styles.cardHeaderLeft}>
                        <View style={styles.indexDot}>
                          <Text style={styles.indexDotText}>{index + 1}</Text>
                        </View>
                        <View style={styles.cardTitleBox}>
                          <Text style={styles.cardTitle} numberOfLines={1}>
                            {cert.name || "Untitled Certification"}
                          </Text>
                          <Text style={styles.cardSubtitle} numberOfLines={1}>
                            {cert.organization ? `${cert.organization} • ` : ""}{cert.issueDate || "No date"}
                          </Text>
                        </View>
                      </View>
                      <Ionicons 
                        name={isExpanded ? "chevron-up" : "chevron-down"} 
                        size={20} 
                        color={theme.colors.textWhite40} 
                      />
                    </Pressable>

                    {isExpanded && (
                      <View style={styles.cardBody}>
                        <CertInput 
                          label="CERTIFICATION NAME" 
                          placeholder="e.g. AWS Solutions Architect"
                          value={cert.name}
                          onChangeText={(v) => handleUpdate(cert.id, "name", v)}
                        />
                        <CertInput 
                          label="ISSUING ORGANIZATION" 
                          placeholder="e.g. Amazon Web Services"
                          value={cert.organization}
                          onChangeText={(v) => handleUpdate(cert.id, "organization", v)}
                        />
                        
                        <View style={styles.row}>
                          <View style={styles.flex1}>
                            <CertInput 
                              label="ISSUE DATE" 
                              placeholder="MM/YYYY"
                              value={cert.issueDate}
                              onChangeText={(v) => handleUpdate(cert.id, "issueDate", v)}
                            />
                          </View>
                          <View style={styles.spacer} />
                          <View style={styles.flex1} />
                        </View>

                        <CertInput 
                          label="CREDENTIAL URL" 
                          placeholder="https://coursera.org/verify/..."
                          keyboardType="url"
                          autoCapitalize="none"
                          value={cert.url}
                          onChangeText={(v) => handleUpdate(cert.id, "url", v)}
                        />

                        <Pressable 
                          onPress={() => handleRemove(cert.id)} 
                          style={({ pressed }) => [styles.deleteBtn, pressed && styles.deleteBtnPressed]}
                        >
                          <Ionicons name="trash-outline" size={16} color={theme.colors.dotRed} />
                          <Text style={styles.deleteBtnText}>Remove Certification</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* ── Add Button ── */}
            <Pressable onPress={handleAddCert} style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}>
              <Ionicons name="add" size={18} color={theme.colors.brandMint} />
              <Text style={styles.addBtnText}>Add Another Certification</Text>
            </Pressable>

            {/* ── Saved indicator ── */}
            {certifications.length > 0 && (
              <Animated.View style={[styles.savedRow, { opacity: savedOpacity }]} pointerEvents="none">
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.accentGreen} />
                <Text style={styles.savedText}>Saved</Text>
              </Animated.View>
            )}

            {/* ── Save button ── */}
            {certifications.length > 0 && (
              <Pressable
                onPressIn={() => springIn(saveScale)}
                onPressOut={() => springOut(saveScale)}
                onPress={handleSave}
              >
                <Animated.View style={[styles.saveBtn, { transform: [{ scale: saveScale }] }]}>
                  <Ionicons name="checkmark-outline" size={20} color={theme.colors.bgRoot} />
                  <Text style={styles.saveBtnText}>Save Certifications</Text>
                </Animated.View>
              </Pressable>
            )}

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgRoot },
  flex: { flex: 1 },
  bgBase: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.colors.bgBase },
  glowA: {
    position: "absolute", right: -100, top: -80,
    width: 280, height: 280, borderRadius: 140,
    backgroundColor: theme.colors.accentGreenGlow, opacity: 0.08,
  },
  vignette: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.colors.vignette, opacity: 0.3 },
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: theme.spacing["3xl"] },

  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  backBtn: {
    width: 38, height: 38, borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.cardBg04, borderWidth: 1, borderColor: theme.colors.cardBorder07,
    alignItems: "center", justifyContent: "center",
  },
  skipBtn: { width: 38, alignItems: "center", justifyContent: "center" },
  skipText: { fontSize: theme.typography.sm, fontWeight: "600", color: theme.colors.textWhite40, letterSpacing: theme.typography.letterSpacingMd },
  screenTitle: { fontSize: theme.typography.lg, fontWeight: "800", color: theme.colors.white, letterSpacing: theme.typography.letterSpacingMd },
  
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingRight: 4 },
  screenSub: { flex: 1, fontSize: theme.typography.md, color: theme.colors.textWhite40, letterSpacing: theme.typography.letterSpacingMd },
  countBadge: {
    paddingVertical: 3, paddingHorizontal: theme.spacing.md, borderRadius: theme.radii.round,
    backgroundColor: theme.colors.cardBg04, borderWidth: 1, borderColor: theme.colors.inputFocusBorder45,
  },
  countBadgeText: { fontSize: theme.typography.xs, fontWeight: "700", color: theme.colors.accentGreen, letterSpacing: theme.typography.letterSpacingMd },

  emptyWrap: {
    alignItems: "center", paddingVertical: theme.spacing["4xl"], gap: theme.spacing.sm,
    backgroundColor: theme.colors.cardBg04, borderRadius: theme.radii.md, borderWidth: 1,
    borderColor: theme.colors.cardBorder07, borderStyle: "dashed", marginTop: theme.spacing.md,
  },
  emptyText: { fontSize: theme.typography.base, fontWeight: "600", color: theme.colors.textWhite45 },
  emptySubtext: { fontSize: theme.typography.sm, color: theme.colors.textWhite30, textAlign: "center", paddingHorizontal: theme.spacing.xl },

  cardsFlow: { gap: theme.spacing.lg },
  card: { backgroundColor: theme.colors.cardBg04, borderRadius: theme.radii.md, borderWidth: 1, borderColor: theme.colors.cardBorder07, overflow: "hidden" },
  cardExpanded: { borderColor: theme.colors.mintBorder24, backgroundColor: "rgba(255,255,255,0.06)" },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: theme.spacing.lg },
  cardHeaderLeft: { flexDirection: "row", alignItems: "center", flex: 1, gap: theme.spacing.md },
  indexDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: theme.colors.inputBg05, alignItems: "center", justifyContent: "center" },
  indexDotText: { fontSize: theme.typography.sm, fontWeight: "700", color: theme.colors.brandMint },
  cardTitleBox: { flex: 1 },
  cardTitle: { fontSize: theme.typography.base, fontWeight: "700", color: theme.colors.white, letterSpacing: theme.typography.letterSpacingMd, marginBottom: 2 },
  cardSubtitle: { fontSize: theme.typography.xs, color: theme.colors.textWhite40 },
  cardBody: { paddingHorizontal: theme.spacing.lg, paddingBottom: theme.spacing.lg, paddingTop: theme.spacing.xs, gap: theme.spacing.md },

  inputWrapOuter: { gap: 6 },
  inputLabel: { fontSize: 10, fontWeight: "700", color: theme.colors.textWhite30, letterSpacing: 1 },
  inputWrap: {
    backgroundColor: theme.colors.inputBg05, borderRadius: theme.radii.sm, borderWidth: 1,
    borderColor: theme.colors.inputBorder08, paddingHorizontal: theme.spacing.md, height: 48, justifyContent: "center",
  },
  inputWrapFocused: { borderColor: theme.colors.inputFocusBorder45, backgroundColor: theme.colors.inputFocusBg04 },
  input: { fontSize: theme.typography.sm, color: theme.colors.white, letterSpacing: theme.typography.letterSpacingMd, paddingVertical: 0, width: "100%" },
  row: { flexDirection: "row" }, flex1: { flex: 1 }, spacer: { width: theme.spacing.md },

  deleteBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6,
    paddingVertical: theme.spacing.md, marginTop: theme.spacing.xs,
    backgroundColor: "rgba(255, 59, 48, 0.08)", borderRadius: theme.radii.sm,
  },
  deleteBtnPressed: { backgroundColor: "rgba(255, 59, 48, 0.15)" },
  deleteBtnText: { fontSize: theme.typography.sm, fontWeight: "700", color: theme.colors.dotRed },

  addBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, paddingVertical: 14,
    borderRadius: theme.radii.md, borderWidth: 1, borderColor: theme.colors.mintBorder28,
    backgroundColor: theme.colors.mintBg09, borderStyle: "dashed", marginTop: theme.spacing.sm,
  },
  addBtnPressed: { backgroundColor: theme.colors.mintBg10 },
  addBtnText: { fontSize: theme.typography.sm, fontWeight: "700", color: theme.colors.brandMint, letterSpacing: theme.typography.letterSpacingMd },

  savedRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: theme.spacing.sm, paddingVertical: theme.spacing.xs },
  savedText: { fontSize: theme.typography.md, fontWeight: "700", color: theme.colors.accentGreen },
  saveBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: theme.spacing.sm,
    height: 52, borderRadius: theme.radii.md, backgroundColor: theme.colors.accentGreen, ...theme.shadows.greenButtonCompact,
  },
  saveBtnText: { fontSize: theme.typography.lg, fontWeight: "700", color: theme.colors.bgRoot, letterSpacing: theme.typography.letterSpacingXl },
});