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

const DEGREE_CHIPS = [
  "10th (SSC)", "12th (HSC)", "Diploma", "B.Tech",
  "B.Sc", "BA", "B.Com", "BBA", "MBA", "M.Tech", "MCA", "Other",
];

function normalizeEducationList(list) {
  return (list ?? []).map((e, index) => ({
    id: String(e.id ?? `${Date.now()}-${index}`),
    institution: e.institution ?? e.school ?? e.schoolName ?? e.university ?? e.college ?? "",
    boardUniversity: e.boardUniversity ?? e.board ?? e.boardOrUniversity ?? "",
    degree: e.degree ?? e.degreeName ?? "",
    fieldOfStudy: e.fieldOfStudy ?? e.major ?? e.field ?? "",
    startDate: e.startDate ?? e.start ?? "",
    endDate: e.endDate ?? e.end ?? "",
    current: Boolean(e.current ?? e.isCurrent ?? e.currentlyStudying ?? false),
    grade: e.grade ?? e.cgpa ?? e.gpa ?? "",
    activities: e.activities ?? e.achievements ?? e.description ?? "",
  }));
}

function readEducationFromStore() {
  return normalizeEducationList(useResumeStore.getState().activeResume.education);
}

function newEducationItem() {
  return {
    id: Date.now().toString(),
    institution: "", boardUniversity: "", degree: "",
    fieldOfStudy: "", startDate: "", endDate: "",
    current: false, grade: "", activities: "",
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

// ─── Degree Chips ─────────────────────────────────────────────────────────────
function DegreeChipsRow({ onSelect }) {
  return (
    <View style={styles.chipsWrap}>
      <Text style={styles.chipsHint}>Tap to fill degree</Text>
      <View style={styles.chipsFlow}>
        {DEGREE_CHIPS.map((chip) => (
          <Pressable
            key={chip}
            onPress={() => onSelect(chip)}
            style={({ pressed }) => [styles.chip, pressed && styles.chipPressed]}
          >
            <Text style={styles.chipText}>{chip}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

// ─── Education Card ───────────────────────────────────────────────────────────
// Uses conditional rendering (not maxHeight animation) to avoid overflow issues
function EducationCard({ item, expanded, onToggleExpand, onChange, onRequestDelete, focusedKey, setFocusedKey }) {
  const fk = (field) => `${item.id}:${field}`;

  return (
    <View style={styles.cardOuter}>
      {/* Green left accent */}
      <View style={styles.cardAccent} />

      <View style={styles.cardInner}>
        {/* Card header row */}
        <View style={styles.cardHeaderRow}>
          <Pressable onPress={onToggleExpand} style={styles.cardHeaderMain}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.institution?.trim() || "Institution name"}
            </Text>
            <Text style={styles.cardSubtitle} numberOfLines={1}>
              {item.degree?.trim() || "Degree"}
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

        {/* Expanded fields — conditional render, no maxHeight animation */}
        {expanded && (
          <View style={styles.cardFields}>
            <LabeledInput
              label="Institution Name"
              icon="school-outline"
              value={item.institution}
              onChangeText={(t) => onChange("institution", t)}
              placeholder="University or school name"
              focused={focusedKey === fk("institution")}
              onFocus={() => setFocusedKey(fk("institution"))}
              onBlur={() => setFocusedKey(null)}
            />
            <LabeledInput
              label="Board / University"
              icon="business-outline"
              value={item.boardUniversity}
              onChangeText={(t) => onChange("boardUniversity", t)}
              placeholder="e.g. CBSE, Mumbai University, ICSE"
              focused={focusedKey === fk("boardUniversity")}
              onFocus={() => setFocusedKey(fk("boardUniversity"))}
              onBlur={() => setFocusedKey(null)}
            />
            <LabeledInput
              label="Degree"
              icon="ribbon-outline"
              value={item.degree}
              onChangeText={(t) => onChange("degree", t)}
              placeholder="Bachelor of Technology, MBA…"
              focused={focusedKey === fk("degree")}
              onFocus={() => setFocusedKey(fk("degree"))}
              onBlur={() => setFocusedKey(null)}
            />
            <DegreeChipsRow onSelect={(chip) => onChange("degree", chip)} />
            <LabeledInput
              label="Field of Study"
              icon="book-outline"
              value={item.fieldOfStudy}
              onChangeText={(t) => onChange("fieldOfStudy", t)}
              placeholder="Computer Science, Marketing…"
              focused={focusedKey === fk("fieldOfStudy")}
              onFocus={() => setFocusedKey(fk("fieldOfStudy"))}
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
              <Text style={styles.fieldLabel}>Currently studying here</Text>
              <Switch
                value={item.current}
                onValueChange={(v) => onChange("current", v)}
                trackColor={{ false: theme.colors.inputBorder08, true: theme.colors.mintBg10 }}
                thumbColor={item.current ? theme.colors.accentGreen : theme.colors.textWhite40}
                ios_backgroundColor={theme.colors.inputBorder08}
              />
            </View>
            <LabeledInput
              label="Grade / CGPA / Percentage"
              icon="stats-chart-outline"
              value={item.grade}
              onChangeText={(t) => onChange("grade", t)}
              placeholder="8.5 CGPA, 85%, First Class…"
              focused={focusedKey === fk("grade")}
              onFocus={() => setFocusedKey(fk("grade"))}
              onBlur={() => setFocusedKey(null)}
            />
            <LabeledInput
              label="Activities & Achievements"
              icon="people-outline"
              value={item.activities}
              onChangeText={(t) => onChange("activities", t)}
              placeholder="Clubs, leadership, honors…"
              multiline
              focused={focusedKey === fk("activities")}
              onFocus={() => setFocusedKey(fk("activities"))}
              onBlur={() => setFocusedKey(null)}
            />
          </View>
        )}
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function EducationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const addEducation = useResumeStore((s) => s.addEducation);
  const updateEducation = useResumeStore((s) => s.updateEducation);
  const removeEducation = useResumeStore((s) => s.removeEducation);
  const markSaved = useResumeStore((s) => s.markSaved);

  const [items, setItems] = useState(readEducationFromStore);
  const [expandedById, setExpandedById] = useState({});
  const [focusedKey, setFocusedKey] = useState(null);

  const saveScale = useRef(new Animated.Value(1)).current;
  const addScaleEmpty = useRef(new Animated.Value(1)).current;
  const addScaleList = useRef(new Animated.Value(1)).current;
  const savedOpacity = useRef(new Animated.Value(0)).current;
  const screenEnter = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      const next = readEducationFromStore();
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
  const enterTranslateY = screenEnter.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });

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
    const row = newEducationItem();
    setItems((prev) => [...prev, row]);
    setExpandedById((prev) => ({ ...prev, [row.id]: true }));
  };

  const confirmDelete = (row) => {
    Alert.alert("Remove education?", "This will remove this entry from your resume.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete", style: "destructive",
        onPress: () => {
          removeEducation(row.id);
          setItems((prev) => prev.filter((x) => x.id !== row.id));
          setExpandedById((prev) => { const n = { ...prev }; delete n[row.id]; return n; });
        },
      },
    ]);
  };

  const handleSave = () => {
    items.forEach((item) => {
      const exists = useResumeStore.getState().activeResume.education.some((e) => e.id === item.id);
      const payload = {
        institution: item.institution.trim(),
        boardUniversity: item.boardUniversity.trim(),
        degree: item.degree.trim(),
        fieldOfStudy: item.fieldOfStudy.trim(),
        startDate: item.startDate.trim(),
        endDate: item.current ? "" : item.endDate.trim(),
        current: item.current,
        grade: item.grade.trim(),
        activities: item.activities.trim(),
      };
      if (exists) { updateEducation(item.id, payload); }
      else { addEducation({ id: item.id, ...payload }); }
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
      {/* Background */}
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
              <Text style={styles.screenTitle}>Education</Text>
              <Pressable onPress={() => router.back()} style={styles.skipBtn} hitSlop={12}>
                <Text style={styles.skipText}>Skip</Text>
              </Pressable>
            </View>

            {/* ── Subtitle ── */}
            <Text style={styles.screenSub}>Add your educational background</Text>

            {/* ── Badge ── */}
            <View style={styles.badgeRow}>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{count} {count === 1 ? "item" : "items"}</Text>
              </View>
            </View>

            {/* ── Empty state ── */}
            {items.length === 0 && (
              <View style={styles.emptyWrap}>
                <Ionicons name="school-outline" size={40} color={theme.colors.textWhite30} />
                <Text style={styles.emptyTitle}>No education added yet</Text>
                <Pressable
                  onPressIn={() => springIn(addScaleEmpty)}
                  onPressOut={() => springOut(addScaleEmpty)}
                  onPress={handleAdd}
                >
                  <Animated.View style={[styles.emptyAddBtn, { transform: [{ scale: addScaleEmpty }] }]}>
                    <Ionicons name="add" size={20} color={theme.colors.accentGreen} />
                    <Text style={styles.emptyAddBtnText}>Add Education</Text>
                  </Animated.View>
                </Pressable>
              </View>
            )}

            {/* ── Cards ── */}
            {items.length > 0 && (
              <View style={styles.cardList}>
                {items.map((item) => (
                  <EducationCard
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

            {/* ── Add more button ── */}
            {items.length > 0 && (
              <Pressable
                onPressIn={() => springIn(addScaleList)}
                onPressOut={() => springOut(addScaleList)}
                onPress={handleAdd}
                style={styles.addRowBtnWrap}
              >
                <Animated.View style={[styles.addRowBtn, { transform: [{ scale: addScaleList }] }]}>
                  <Ionicons name="add-circle-outline" size={20} color={theme.colors.accentGreen} />
                  <Text style={styles.addRowBtnText}>Add Another Education</Text>
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

  // Top bar
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

  // Badge
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

  // Empty
  emptyWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    gap: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.typography.base,
    fontWeight: "600",
    color: theme.colors.textWhite45,
    textAlign: "center",
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

  // Card list
  cardList: { gap: theme.spacing.md },

  // Card
  cardOuter: {
    borderRadius: theme.radii.lg,
    backgroundColor: theme.colors.cardBg04,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder07,
    overflow: "visible",
  },
  cardAccent: {
    position: "absolute",
    left: 0, top: 0, bottom: 0,
    width: 4,
    backgroundColor: theme.colors.accentGreen,
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

  // Chips
  chipsWrap: { gap: theme.spacing.xs },
  chipsHint: {
    fontSize: theme.typography.sm,
    fontWeight: "600",
    color: theme.colors.textWhite40,
  },
  chipsFlow: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm },
  chip: {
    paddingVertical: 5,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.round,
    backgroundColor: theme.colors.inputBg05,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder07,
  },
  chipPressed: {
    borderColor: theme.colors.inputFocusBorder45,
    backgroundColor: theme.colors.inputFocusBg04,
  },
  chipText: {
    fontSize: theme.typography.sm,
    fontWeight: "600",
    color: theme.colors.textWhite60,
  },

  // Toggle
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: theme.spacing.xs,
  },

  // Fields
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
    minHeight: 140,
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
  inputMultiline: { minHeight: 120, paddingTop: theme.spacing.xs },

  // Add row
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

  // Saved
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

  // Save button
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