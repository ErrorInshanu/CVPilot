import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../../../constants/theme";
import { useResumeStore } from "../../../../store/resumeStore";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function normalizeExperienceList(list) {
  return (list ?? []).map((e, index) => ({
    id: String(e.id ?? `${Date.now()}-${index}`),
    company: e.company ?? e.companyName ?? e.organization ?? "",
    role: e.role ?? e.jobTitle ?? e.title ?? e.position ?? "",
    location: e.location ?? e.place ?? "",
    startDate: e.startDate ?? e.start ?? "",
    endDate: e.endDate ?? e.end ?? "",
    current: Boolean(e.current ?? e.isCurrent ?? e.currentlyWorking ?? false),
    description: e.description ?? e.bullets?.join("\n") ?? e.summary ?? "",
  }));
}

function readExperienceFromStore() {
  return normalizeExperienceList(
    useResumeStore.getState().activeResume.experience
  );
}

function newExperienceItem() {
  return {
    id: Date.now().toString(),
    company: "",
    role: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  };
}

// ─── Labeled Input ────────────────────────────────────────────────────────────
function LabeledInput({ label, icon, value, onChangeText, placeholder, keyboardType = "default", autoCapitalize = "sentences", multiline = false, focused, onFocus, onBlur }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={[styles.inputWrap, multiline && styles.inputWrapMultiline, focused && styles.inputWrapFocused]}>
        <Ionicons
          name={icon}
          size={18}
          color={focused ? theme.colors.accentGreen : theme.colors.inputIconDefault}
          style={[styles.inputIcon, multiline && styles.inputIconMultiline]}
        />
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.inputPlaceholder}
          onFocus={onFocus}
          onBlur={onBlur}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          selectionColor={theme.colors.accentGreen}
        />
      </View>
    </View>
  );
}

// ─── Experience Card ──────────────────────────────────────────────────────────
function ExperienceCard({ item, expanded, onToggleExpand, onChange, onRequestDelete, focusedKey, setFocusedKey }) {
  const fk = (field) => `${item.id}:${field}`;

  return (
    <View style={styles.cardOuter}>
      {/* Green left accent */}
      <View style={styles.cardAccent} />

      <View style={styles.cardInner}>
        {/* Card header */}
        <View style={styles.cardHeaderRow}>
          <Pressable onPress={onToggleExpand} style={styles.cardHeaderMain}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.company?.trim() || "Company name"}
            </Text>
            <Text style={styles.cardSubtitle} numberOfLines={1}>
              {item.role?.trim() || "Job title / Role"}
            </Text>
          </Pressable>

          <Pressable onPress={onRequestDelete} hitSlop={12} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={18} color={theme.colors.dotRed} />
          </Pressable>

          <Pressable onPress={onToggleExpand} hitSlop={8} style={styles.chevronBtn}>
            <Ionicons
              name={expanded ? "chevron-up" : "chevron-down"}
              size={20}
              color={theme.colors.textWhite40}
            />
          </Pressable>
        </View>

        {/* Expanded fields — conditional render, no clipping */}
        {expanded && (
          <View style={styles.cardFields}>
            <LabeledInput
              label="Company Name"
              icon="business-outline"
              value={item.company}
              onChangeText={(t) => onChange("company", t)}
              placeholder="Google, Infosys, Startup…"
              focused={focusedKey === fk("company")}
              onFocus={() => setFocusedKey(fk("company"))}
              onBlur={() => setFocusedKey(null)}
            />
            <LabeledInput
              label="Job Title / Role"
              icon="briefcase-outline"
              value={item.role}
              onChangeText={(t) => onChange("role", t)}
              placeholder="Software Engineer, Intern…"
              focused={focusedKey === fk("role")}
              onFocus={() => setFocusedKey(fk("role"))}
              onBlur={() => setFocusedKey(null)}
            />
            <LabeledInput
              label="Location"
              icon="location-outline"
              value={item.location}
              onChangeText={(t) => onChange("location", t)}
              placeholder="Mumbai, India / Remote"
              focused={focusedKey === fk("location")}
              onFocus={() => setFocusedKey(fk("location"))}
              onBlur={() => setFocusedKey(null)}
            />
            <LabeledInput
              label="Start Date"
              icon="calendar-outline"
              value={item.startDate}
              onChangeText={(t) => onChange("startDate", t)}
              placeholder="Jan 2023"
              focused={focusedKey === fk("startDate")}
              onFocus={() => setFocusedKey(fk("startDate"))}
              onBlur={() => setFocusedKey(null)}
            />
            {!item.current && (
              <LabeledInput
                label="End Date"
                icon="calendar-outline"
                value={item.endDate}
                onChangeText={(t) => onChange("endDate", t)}
                placeholder="Dec 2023"
                focused={focusedKey === fk("endDate")}
                onFocus={() => setFocusedKey(fk("endDate"))}
                onBlur={() => setFocusedKey(null)}
              />
            )}
            <View style={styles.toggleRow}>
              <Text style={styles.fieldLabel}>Currently working here</Text>
              <Switch
                value={item.current}
                onValueChange={(v) => onChange("current", v)}
                trackColor={{ false: theme.colors.inputBorder08, true: theme.colors.mintBg10 }}
                thumbColor={item.current ? theme.colors.accentGreen : theme.colors.textWhite40}
                ios_backgroundColor={theme.colors.inputBorder08}
              />
            </View>
            <LabeledInput
              label="Description / Key Achievements"
              icon="document-text-outline"
              value={item.description}
              onChangeText={(t) => onChange("description", t)}
              placeholder={"• Built a feature that improved performance by 40%\n• Led a team of 3 developers\n• Managed client requirements"}
              multiline
              autoCapitalize="sentences"
              focused={focusedKey === fk("description")}
              onFocus={() => setFocusedKey(fk("description"))}
              onBlur={() => setFocusedKey(null)}
            />
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ExperienceScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const addExperience = useResumeStore((s) => s.addExperience);
  const updateExperience = useResumeStore((s) => s.updateExperience);
  const removeExperience = useResumeStore((s) => s.removeExperience);
  const markSaved = useResumeStore((s) => s.markSaved);

  const [items, setItems] = useState(readExperienceFromStore);
  const [expandedById, setExpandedById] = useState({});
  const [focusedKey, setFocusedKey] = useState(null);

  const saveScale = useRef(new Animated.Value(1)).current;
  const addScaleEmpty = useRef(new Animated.Value(1)).current;
  const addScaleList = useRef(new Animated.Value(1)).current;
  const savedOpacity = useRef(new Animated.Value(0)).current;
  const screenEnter = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      const next = readExperienceFromStore();
      setItems(next);
      setExpandedById((prev) => {
        const nextMap = {};
        next.forEach((row) => { nextMap[row.id] = prev[row.id] ?? false; });
        return nextMap;
      });
    }, [])
  );

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

  const patchItem = (id, key, value) => {
    setItems((prev) => prev.map((row) => {
      if (row.id !== id) return row;
      if (key === "current") return { ...row, current: value, endDate: value ? "" : row.endDate };
      return { ...row, [key]: value };
    }));
  };

  const toggleExpanded = (id) => {
    setExpandedById((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleAdd = () => {
    const row = newExperienceItem();
    setItems((prev) => [...prev, row]);
    setExpandedById((prev) => ({ ...prev, [row.id]: true }));
  };

  const confirmDelete = (row) => {
    Alert.alert("Remove experience?", "This will remove this entry from your resume.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: () => {
          removeExperience(row.id);
          markSaved();
          setItems((prev) => prev.filter((x) => x.id !== row.id));
          setExpandedById((prev) => { const n = { ...prev }; delete n[row.id]; return n; });
        },
      },
    ]);
  };

  const handleSave = () => {
    items.forEach((item) => {
      const exists = useResumeStore.getState().activeResume.experience.some((e) => e.id === item.id);
      const payload = {
        company: item.company.trim(),
        role: item.role.trim(),
        location: item.location.trim(),
        startDate: item.startDate.trim(),
        endDate: item.current ? "" : item.endDate.trim(),
        current: item.current,
        description: item.description.trim(),
        bullets: item.description.trim().split("\n").filter((l) => l.trim().length > 0),
      };
      if (exists) { updateExperience(item.id, payload); }
      else { addExperience({ id: item.id, ...payload }); }
    });
    markSaved();
    savedOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(savedOpacity, { toValue: 1, duration: 280, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
      Animated.delay(2000),
      Animated.timing(savedOpacity, { toValue: 0, duration: 240, easing: Easing.in(Easing.cubic), useNativeDriver: true }),
    ]).start();
  };

  const springIn = (anim) => Animated.spring(anim, { toValue: 0.96, useNativeDriver: true, speed: 30, bounciness: 4 }).start();
  const springOut = (anim) => Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 24, bounciness: 6 }).start();

  const count = items.length;

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
          <Animated.View style={{ opacity: enterOpacity, transform: [{ translateY: enterTranslateY }] }}>

            {/* ── Top bar ── */}
            <View style={styles.topBar}>
              <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
                <Ionicons name="chevron-back" size={22} color={theme.colors.white} />
              </Pressable>
              <Text style={styles.screenTitle}>Work Experience</Text>
              <Pressable onPress={() => router.back()} style={styles.skipBtn} hitSlop={12}>
                <Text style={styles.skipText}>Skip</Text>
              </Pressable>
            </View>

            {/* ── Subtitle ── */}
            <Text style={styles.screenSub}>Add your work history</Text>

            {/* ── Badge ── */}
            <View style={styles.badgeRow}>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{count} {count === 1 ? "item" : "items"}</Text>
              </View>
            </View>

            {/* ── Empty state ── */}
            {items.length === 0 && (
              <View style={styles.emptyWrap}>
                <Ionicons name="briefcase-outline" size={40} color={theme.colors.textWhite30} />
                <Text style={styles.emptyTitle}>No experience added yet</Text>
                <Text style={styles.emptySubtitle}>
                  Add your internships, jobs, or freelance work
                </Text>
                <Pressable
                  onPressIn={() => springIn(addScaleEmpty)}
                  onPressOut={() => springOut(addScaleEmpty)}
                  onPress={handleAdd}
                >
                  <Animated.View style={[styles.emptyAddBtn, { transform: [{ scale: addScaleEmpty }] }]}>
                    <Ionicons name="add" size={20} color={theme.colors.accentGreen} />
                    <Text style={styles.emptyAddBtnText}>Add Experience</Text>
                  </Animated.View>
                </Pressable>
              </View>
            )}

            {/* ── Cards ── */}
            {items.length > 0 && (
              <View style={styles.cardList}>
                {items.map((item) => (
                  <ExperienceCard
                    key={item.id}
                    item={item}
                    expanded={Boolean(expandedById[item.id])}
                    onToggleExpand={() => toggleExpanded(item.id)}
                    onChange={(key, val) => patchItem(item.id, key, val)}
                    onRequestDelete={() => confirmDelete(item)}
                    focusedKey={focusedKey}
                    setFocusedKey={setFocusedKey}
                  />
                ))}
              </View>
            )}

            {/* ── Add more ── */}
            {items.length > 0 && (
              <Pressable
                onPressIn={() => springIn(addScaleList)}
                onPressOut={() => springOut(addScaleList)}
                onPress={handleAdd}
                style={styles.addRowBtnWrap}
              >
                <Animated.View style={[styles.addRowBtn, { transform: [{ scale: addScaleList }] }]}>
                  <Ionicons name="add-circle-outline" size={20} color={theme.colors.accentGreen} />
                  <Text style={styles.addRowBtnText}>Add Another Experience</Text>
                </Animated.View>
              </Pressable>
            )}

            {/* ── Saved indicator ── */}
            {items.length > 0 && (
              <Animated.View style={[styles.savedRow, { opacity: savedOpacity }]} pointerEvents="none">
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.accentGreen} />
                <Text style={styles.savedText}>Saved</Text>
              </Animated.View>
            )}

            {/* ── Save button ── */}
            {items.length > 0 && (
              <Pressable
                onPressIn={() => springIn(saveScale)}
                onPressOut={() => springOut(saveScale)}
                onPress={handleSave}
                style={styles.saveBtnWrap}
              >
                <Animated.View style={[styles.saveBtn, { transform: [{ scale: saveScale }] }]}>
                  <Ionicons name="checkmark-outline" size={20} color={theme.colors.bgRoot} />
                  <Text style={styles.saveBtnText}>Save</Text>
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
  scrollContent: {
    paddingHorizontal: theme.spacing["3xl"],
    gap: theme.spacing.lg,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: 38, height: 38,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.cardBg04,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder07,
    alignItems: "center",
    justifyContent: "center",
  },
  skipBtn: {
    width: 38,
    alignItems: "center",
    justifyContent: "center",
  },
  skipText: {
    fontSize: theme.typography.sm,
    fontWeight: "600",
    color: theme.colors.textWhite40,
    letterSpacing: theme.typography.letterSpacingMd,
  },
  screenTitle: {
    fontSize: theme.typography.lg,
    fontWeight: "800",
    color: theme.colors.white,
    letterSpacing: theme.typography.letterSpacingMd,
  },
  screenSub: {
    fontSize: theme.typography.md,
    color: theme.colors.textWhite40,
    letterSpacing: theme.typography.letterSpacingMd,
  },
  badgeRow: { flexDirection: "row" },
  countBadge: {
    paddingVertical: 4,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.round,
    backgroundColor: theme.colors.cardBg04,
    borderWidth: 1,
    borderColor: theme.colors.inputFocusBorder45,
  },
  countBadgeText: {
    fontSize: theme.typography.sm,
    fontWeight: "700",
    color: theme.colors.textWhite60,
    letterSpacing: theme.typography.letterSpacingMd,
  },
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.typography.base,
    fontWeight: "700",
    color: theme.colors.textWhite60,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: theme.typography.md,
    color: theme.colors.textWhite40,
    textAlign: "center",
    letterSpacing: theme.typography.letterSpacingMd,
  },
  emptyAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing["2xl"],
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.inputFocusBorder45,
    backgroundColor: theme.colors.cardBg04,
  },
  emptyAddBtnText: {
    fontSize: theme.typography.base,
    fontWeight: "700",
    color: theme.colors.accentGreen,
  },
  cardList: { gap: theme.spacing.md },
  cardOuter: {
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.cardBg04,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder07,
  },
  cardAccent: {
    position: "absolute",
    left: 0, top: 0, bottom: 0,
    width: 4,
    backgroundColor: "#60A5FA",
    borderTopLeftRadius: theme.radii.lg,
    borderBottomLeftRadius: theme.radii.lg,
  },
  cardInner: {
    marginLeft: 4,
    padding: theme.spacing.lg,
    gap: theme.spacing.sm,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  cardHeaderMain: { flex: 1 },
  cardTitle: {
    fontSize: theme.typography.base,
    fontWeight: "700",
    color: theme.colors.white,
    letterSpacing: theme.typography.letterSpacingMd,
  },
  cardSubtitle: {
    fontSize: theme.typography.sm,
    color: theme.colors.textWhite40,
    marginTop: 2,
  },
  deleteBtn: {
    padding: theme.spacing.xs,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.cardBg04,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder07,
  },
  chevronBtn: { padding: theme.spacing.xs },
  cardFields: { gap: theme.spacing.lg, paddingTop: theme.spacing.md },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.xs,
  },
  fieldGroup: { gap: theme.spacing.sm },
  fieldLabel: {
    fontSize: theme.typography.md,
    fontWeight: "600",
    color: theme.colors.textWhite60,
    letterSpacing: theme.typography.letterSpacingMd,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.inputBg05,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder08,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 50,
  },
  inputWrapMultiline: {
    alignItems: "flex-start",
    paddingVertical: theme.spacing.md,
    minHeight: 160,
  },
  inputWrapFocused: {
    borderColor: theme.colors.inputFocusBorder45,
    backgroundColor: theme.colors.inputFocusBg04,
  },
  inputIcon: { marginRight: theme.spacing.sm },
  inputIconMultiline: { marginTop: theme.spacing.xs },
  input: {
    flex: 1,
    fontSize: theme.typography.base,
    color: theme.colors.white,
    letterSpacing: theme.typography.letterSpacingMd,
    paddingVertical: 0,
  },
  inputMultiline: { minHeight: 140, paddingTop: theme.spacing.xs },
  addRowBtnWrap: { marginTop: theme.spacing.xs },
  addRowBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.lg,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder07,
    backgroundColor: theme.colors.cardBg04,
  },
  addRowBtnText: {
    fontSize: theme.typography.base,
    fontWeight: "700",
    color: theme.colors.accentGreen,
  },
  savedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
  },
  savedText: {
    fontSize: theme.typography.md,
    fontWeight: "700",
    color: theme.colors.accentGreen,
  },
  saveBtnWrap: { marginTop: theme.spacing.xs },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    height: 52,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.accentGreen,
    ...theme.shadows.greenButtonCompact,
  },
  saveBtnText: {
    fontSize: theme.typography.lg,
    fontWeight: "700",
    color: theme.colors.bgRoot,
    letterSpacing: theme.typography.letterSpacingXl,
  },
});