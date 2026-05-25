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
    Switch,
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
function readVolunteerFromStore() {
  return useResumeStore.getState().activeResume.volunteer ?? [];
}

function newVolunteerItem() {
  return {
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    role: "",
    organization: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  };
}

// ─── Reusable Input Component ─────────────────────────────────────────────────
function VolunteerInput({ label, value, onChangeText, placeholder, multiline = false, ...props }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.inputWrapOuter}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.inputWrap, focused && styles.inputWrapFocused, multiline && styles.inputWrapMultiline]}>
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.inputPlaceholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline={multiline}
          selectionColor={theme.colors.accentGreen}
          {...props}
        />
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function VolunteerScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Zustand Bindings (Ensure these are added to resumeStore.js)
  const addVolunteerToStore = useResumeStore((s) => s.addVolunteer);
  const updateVolunteerInStore = useResumeStore((s) => s.updateVolunteer);
  const removeVolunteerFromStore = useResumeStore((s) => s.removeVolunteer);
  const markSaved = useResumeStore((s) => s.markSaved);

  // Local State
  const [volunteerWork, setVolunteerWork] = useState(readVolunteerFromStore);
  const [expandedId, setExpandedId] = useState(null);

  // Animation Refs
  const saveScale = useRef(new Animated.Value(1)).current;
  const savedOpacity = useRef(new Animated.Value(0)).current;
  const screenEnter = useRef(new Animated.Value(0)).current;

  // Sync state on focus
  useFocusEffect(
    useCallback(() => {
      const storeItems = readVolunteerFromStore();
      setVolunteerWork(storeItems);
      if (storeItems.length === 0) {
        handleAddVolunteer();
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
  const handleAddVolunteer = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const newItem = newVolunteerItem();
    setVolunteerWork((prev) => [...prev, newItem]);
    setExpandedId(newItem.id);
  };

  const handleUpdate = (id, field, value) => {
    setVolunteerWork((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const handleRemove = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setVolunteerWork((prev) => prev.filter((item) => item.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedId(expandedId === id ? null : id);
  };

  const handleSave = () => {
    const storeIds = readVolunteerFromStore().map((item) => item.id);
    
    volunteerWork.forEach((item) => {
      if (storeIds.includes(item.id)) {
        const state = useResumeStore.getState();
        if (state.updateVolunteer) {
            state.updateVolunteer(item.id, item);
        }
      } else {
        if (addVolunteerToStore) addVolunteerToStore(item);
      }
    });

    const currentIds = volunteerWork.map((item) => item.id);
    readVolunteerFromStore().forEach((item) => {
      if (!currentIds.includes(item.id)) {
        if (removeVolunteerFromStore) removeVolunteerFromStore(item.id);
      }
    });

    // Manual full array update fallback
    useResumeStore.setState((state) => ({
      activeResume: { ...state.activeResume, volunteer: volunteerWork },
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
              <Text style={styles.screenTitle}>Volunteer Work</Text>
              <Pressable onPress={() => router.back()} style={styles.skipBtn} hitSlop={12}>
                <Text style={styles.skipText}>{volunteerWork.length > 0 ? "Done" : "Skip"}</Text>
              </Pressable>
            </View>

            {/* ── Subtitle & Badge ── */}
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.screenSub}>Highlight community service & causes</Text>
              {volunteerWork.length > 0 && (
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{volunteerWork.length} added</Text>
                </View>
              )}
            </View>

            {/* ── Empty State ── */}
            {volunteerWork.length === 0 && (
              <View style={styles.emptyWrap}>
                <Ionicons name="heart-outline" size={36} color={theme.colors.textWhite30} />
                <Text style={styles.emptyText}>No volunteer work yet</Text>
                <Text style={styles.emptySubtext}>Add causes you've supported or NGOs you've worked with.</Text>
              </View>
            )}

            {/* ── Cards ── */}
            <View style={styles.cardsFlow}>
              {volunteerWork.map((item, index) => {
                const isExpanded = expandedId === item.id;
                const dateText = item.current 
                  ? `${item.startDate || "N/A"} - Present` 
                  : `${item.startDate || "N/A"} - ${item.endDate || "N/A"}`;

                return (
                  <View key={item.id} style={[styles.card, isExpanded && styles.cardExpanded]}>
                    <Pressable 
                      style={styles.cardHeader} 
                      onPress={() => toggleExpand(item.id)}
                    >
                      <View style={styles.cardHeaderLeft}>
                        <View style={styles.indexDot}>
                          <Text style={styles.indexDotText}>{index + 1}</Text>
                        </View>
                        <View style={styles.cardTitleBox}>
                          <Text style={styles.cardTitle} numberOfLines={1}>
                            {item.role || "Untitled Role"}
                          </Text>
                          <Text style={styles.cardSubtitle} numberOfLines={1}>
                            {item.organization ? `${item.organization} • ` : ""}{dateText}
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
                        <VolunteerInput 
                          label="ROLE / TITLE" 
                          placeholder="e.g. Volunteer Teacher, Event Coordinator"
                          value={item.role}
                          onChangeText={(v) => handleUpdate(item.id, "role", v)}
                        />
                        <VolunteerInput 
                          label="ORGANIZATION / NGO NAME" 
                          placeholder="e.g. Red Cross, Local Animal Shelter"
                          value={item.organization}
                          onChangeText={(v) => handleUpdate(item.id, "organization", v)}
                        />
                        
                        <View style={styles.row}>
                          <View style={styles.flex1}>
                            <VolunteerInput 
                              label="START DATE" 
                              placeholder="MM/YYYY"
                              value={item.startDate}
                              onChangeText={(v) => handleUpdate(item.id, "startDate", v)}
                            />
                          </View>
                          <View style={styles.spacer} />
                          {!item.current && (
                            <View style={styles.flex1}>
                              <VolunteerInput 
                                label="END DATE" 
                                placeholder="MM/YYYY"
                                value={item.endDate}
                                onChangeText={(v) => handleUpdate(item.id, "endDate", v)}
                              />
                            </View>
                          )}
                        </View>

                        <View style={styles.switchRow}>
                          <Text style={styles.switchLabel}>I am currently volunteering here</Text>
                          <Switch
                            value={item.current}
                            onValueChange={(v) => handleUpdate(item.id, "current", v)}
                            trackColor={{ false: theme.colors.cardBorder07, true: theme.colors.accentGreen }}
                            thumbColor={theme.colors.white}
                          />
                        </View>

                        <VolunteerInput 
                          label="DESCRIPTION & IMPACT" 
                          placeholder="• Raised $5,000 for local charities&#10;• Tutored 20+ underprivileged students"
                          multiline
                          value={item.description}
                          onChangeText={(v) => handleUpdate(item.id, "description", v)}
                        />

                        <Pressable 
                          onPress={() => handleRemove(item.id)} 
                          style={({ pressed }) => [styles.deleteBtn, pressed && styles.deleteBtnPressed]}
                        >
                          <Ionicons name="trash-outline" size={16} color={theme.colors.dotRed} />
                          <Text style={styles.deleteBtnText}>Remove Volunteer Work</Text>
                        </Pressable>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>

            {/* ── Add Button ── */}
            <Pressable onPress={handleAddVolunteer} style={({ pressed }) => [styles.addBtn, pressed && styles.addBtnPressed]}>
              <Ionicons name="add" size={18} color={theme.colors.brandMint} />
              <Text style={styles.addBtnText}>Add Volunteer Work</Text>
            </Pressable>

            {/* ── Saved indicator ── */}
            {volunteerWork.length > 0 && (
              <Animated.View style={[styles.savedRow, { opacity: savedOpacity }]} pointerEvents="none">
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.accentGreen} />
                <Text style={styles.savedText}>Saved</Text>
              </Animated.View>
            )}

            {/* ── Save button ── */}
            {volunteerWork.length > 0 && (
              <Pressable
                onPressIn={() => springIn(saveScale)}
                onPressOut={() => springOut(saveScale)}
                onPress={handleSave}
              >
                <Animated.View style={[styles.saveBtn, { transform: [{ scale: saveScale }] }]}>
                  <Ionicons name="checkmark-outline" size={20} color={theme.colors.bgRoot} />
                  <Text style={styles.saveBtnText}>Save Volunteer Work</Text>
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
  inputWrapMultiline: { height: 100, alignItems: "flex-start", paddingVertical: theme.spacing.sm },
  input: { fontSize: theme.typography.sm, color: theme.colors.white, letterSpacing: theme.typography.letterSpacingMd, paddingVertical: 0, width: "100%" },
  inputMultiline: { textAlignVertical: "top", height: "100%" },
  row: { flexDirection: "row" }, flex1: { flex: 1 }, spacer: { width: theme.spacing.md },

  switchRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    backgroundColor: theme.colors.inputBg05, borderRadius: theme.radii.sm, borderWidth: 1,
    borderColor: theme.colors.inputBorder08, paddingHorizontal: theme.spacing.md, paddingVertical: 10,
  },
  switchLabel: { fontSize: theme.typography.sm, color: theme.colors.textWhite60 },
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