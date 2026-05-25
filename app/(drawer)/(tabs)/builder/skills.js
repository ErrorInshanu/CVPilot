import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../../../constants/theme";
import { useResumeStore } from "../../../../store/resumeStore";

// ─── Skill suggestions for ALL student types ─────────────────────────────────
const SKILL_CATEGORIES = [
  {
    label: "Technical",
    color: "#4ADE80",
    skills: ["Python", "JavaScript", "Java", "C++", "SQL", "HTML/CSS", "React", "Node.js", "Git", "Excel", "PowerPoint", "Word", "Photoshop", "AutoCAD", "MATLAB"],
  },
  {
    label: "Business & Management",
    color: "#60A5FA",
    skills: ["Project Management", "Business Analysis", "Market Research", "Financial Modeling", "Accounting", "Budgeting", "Sales", "CRM", "Tally", "MS Office"],
  },
  {
    label: "Marketing & Creative",
    color: "#F472B6",
    skills: ["Digital Marketing", "SEO", "Content Writing", "Social Media", "Canva", "Video Editing", "Copywriting", "Brand Management", "Adobe Premiere", "Figma"],
  },
  {
    label: "Soft Skills",
    color: "#FBBF24",
    skills: ["Leadership", "Communication", "Teamwork", "Problem Solving", "Time Management", "Critical Thinking", "Adaptability", "Public Speaking", "Negotiation", "Creativity"],
  },
  {
    label: "Languages",
    color: "#A78BFA",
    skills: ["English", "Hindi", "Marathi", "Tamil", "Telugu", "Bengali", "Gujarati", "Kannada", "French", "German", "Spanish", "Japanese"],
  },
  {
    label: "Finance & Accounting",
    color: "#34D399",
    skills: ["Financial Analysis", "Taxation", "Auditing", "Cost Accounting", "GST", "Tally ERP", "Zoho Books", "QuickBooks", "Investment Analysis", "Risk Management"],
  },
  {
    label: "Arts & Design",
    color: "#FB923C",
    skills: ["Illustration", "UI/UX Design", "Typography", "Photography", "Sketching", "3D Modeling", "After Effects", "InDesign", "Blender", "Color Theory"],
  },
  {
    label: "Science & Research",
    color: "#38BDF8",
    skills: ["Research Methodology", "Data Analysis", "Lab Techniques", "Statistics", "R Programming", "SPSS", "Scientific Writing", "Literature Review", "Hypothesis Testing"],
  },
];

const SKILL_LEVELS = [
  { label: "Beginner", value: "beginner", color: "#FB923C" },
  { label: "Intermediate", value: "intermediate", color: "#FBBF24" },
  { label: "Expert", value: "expert", color: "#4ADE80" },
];

function readSkillsFromStore() {
  return useResumeStore.getState().activeResume.skills ?? [];
}

function newSkillItem(name = "") {
  return {
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    name,
    level: "intermediate",
  };
}

// ─── Skill Chip (added skill) ─────────────────────────────────────────────────
function SkillChip({ skill, onRemove, onLevelChange }) {
  const levelInfo = SKILL_LEVELS.find((l) => l.value === skill.level) || SKILL_LEVELS[1];
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const cycleLevel = () => {
    const idx = SKILL_LEVELS.findIndex((l) => l.value === skill.level);
    const next = SKILL_LEVELS[(idx + 1) % SKILL_LEVELS.length];
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.9, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 120, useNativeDriver: true }),
    ]).start();
    onLevelChange(next.value);
  };

  return (
    <Animated.View style={[styles.skillChip, { transform: [{ scale: scaleAnim }], borderColor: `${levelInfo.color}40` }]}>
      <Pressable onPress={cycleLevel} style={styles.skillChipLevel}>
        <View style={[styles.levelDot, { backgroundColor: levelInfo.color }]} />
        <Text style={styles.skillChipName}>{skill.name}</Text>
      </Pressable>
      <Pressable onPress={onRemove} hitSlop={8} style={styles.skillChipRemove}>
        <Ionicons name="close" size={14} color={theme.colors.textWhite40} />
      </Pressable>
    </Animated.View>
  );
}

// ─── Suggestion Chip ──────────────────────────────────────────────────────────
function SuggestionChip({ label, onPress, alreadyAdded }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={alreadyAdded}
      style={({ pressed }) => [
        styles.suggestionChip,
        alreadyAdded && styles.suggestionChipAdded,
        pressed && !alreadyAdded && styles.suggestionChipPressed,
      ]}
    >
      {alreadyAdded && (
        <Ionicons name="checkmark" size={11} color={theme.colors.accentGreen} />
      )}
      <Text style={[styles.suggestionChipText, alreadyAdded && styles.suggestionChipTextAdded]}>
        {label}
      </Text>
    </Pressable>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SkillsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const addSkill = useResumeStore((s) => s.addSkill);
  const removeSkill = useResumeStore((s) => s.removeSkill);
  const markSaved = useResumeStore((s) => s.markSaved);

  const [skills, setSkills] = useState(readSkillsFromStore);
  const [inputValue, setInputValue] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  const saveScale = useRef(new Animated.Value(1)).current;
  const savedOpacity = useRef(new Animated.Value(0)).current;
  const screenEnter = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      setSkills(readSkillsFromStore());
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

  const addSkillByName = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const alreadyExists = skills.some((s) => s.name.toLowerCase() === trimmed.toLowerCase());
    if (alreadyExists) return;
    const skill = newSkillItem(trimmed);
    setSkills((prev) => [...prev, skill]);
    setInputValue("");
  };

  const handleInputSubmit = () => {
    addSkillByName(inputValue);
  };

  const handleRemoveSkill = (id) => {
    const updated = skills.filter((s) => s.id !== id);
    setSkills(updated);
    removeSkill(id);  // ← sync to store immediately
    markSaved();       // ← mark dirty
  };

  const handleLevelChange = (id, level) => {
    setSkills((prev) => prev.map((s) => s.id === id ? { ...s, level } : s));
  };

  const handleSave = () => {
    // Clear store skills and re-add all
    skills.forEach((skill) => {
      const exists = (useResumeStore.getState().activeResume.skills ?? []).some((s) => s.id === skill.id);
      if (!exists) { addSkill({ id: skill.id, name: skill.name, level: skill.level }); }
    });
    // Remove deleted ones
    const currentIds = skills.map((s) => s.id);
    useResumeStore.getState().activeResume.skills.forEach((s) => {
      if (!currentIds.includes(s.id)) { removeSkill(s.id); }
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

  const activeAddedNames = skills.map((s) => s.name.toLowerCase());
  const currentCategory = SKILL_CATEGORIES[activeCategory];

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
              <Text style={styles.screenTitle}>Skills</Text>
              <Pressable onPress={() => router.back()} style={styles.skipBtn} hitSlop={12}>
                <Text style={styles.skipText}>Skip</Text>
              </Pressable>
            </View>

            {/* ── Subtitle ── */}
            <Text style={styles.screenSub}>Add skills relevant to your field</Text>

            {/* ── Level legend ── */}
            <View style={styles.legendRow}>
              {SKILL_LEVELS.map((l) => (
                <View key={l.value} style={styles.legendItem}>
                  <View style={[styles.levelDot, { backgroundColor: l.color }]} />
                  <Text style={styles.legendText}>{l.label}</Text>
                </View>
              ))}
              <Text style={styles.legendHint}>Tap skill to cycle level</Text>
            </View>

            {/* ── Added skills ── */}
            {skills.length > 0 ? (
              <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionLabel}>YOUR SKILLS</Text>
                  <View style={styles.countBadge}>
                    <Text style={styles.countBadgeText}>{skills.length} added</Text>
                  </View>
                </View>
                <View style={styles.chipsFlow}>
                  {skills.map((skill) => (
                    <SkillChip
                      key={skill.id}
                      skill={skill}
                      onRemove={() => handleRemoveSkill(skill.id)}
                      onLevelChange={(level) => handleLevelChange(skill.id, level)}
                    />
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.emptySkillsWrap}>
                <Ionicons name="flash-outline" size={36} color={theme.colors.textWhite30} />
                <Text style={styles.emptySkillsText}>No skills added yet</Text>
                <Text style={styles.emptySkillsSubtext}>
                  Type a skill below or pick from suggestions
                </Text>
              </View>
            )}

            {/* ── Custom input ── */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>ADD CUSTOM SKILL</Text>
              <View style={[styles.inputWrap, inputFocused && styles.inputWrapFocused]}>
                <Ionicons
                  name="flash-outline"
                  size={18}
                  color={inputFocused ? theme.colors.accentGreen : theme.colors.inputIconDefault}
                  style={styles.inputIcon}
                />
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  value={inputValue}
                  onChangeText={setInputValue}
                  placeholder="Type any skill and press Add…"
                  placeholderTextColor={theme.colors.inputPlaceholder}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  onSubmitEditing={handleInputSubmit}
                  returnKeyType="done"
                  autoCapitalize="words"
                  autoCorrect={false}
                  selectionColor={theme.colors.accentGreen}
                />
                {inputValue.trim().length > 0 && (
                  <Pressable
                    onPress={handleInputSubmit}
                    style={styles.addInlineBtn}
                  >
                    <Text style={styles.addInlineBtnText}>Add</Text>
                  </Pressable>
                )}
              </View>
            </View>

            {/* ── Category tabs ── */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>BROWSE BY CATEGORY</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryTabsRow}
              >
                {SKILL_CATEGORIES.map((cat, idx) => (
                  <Pressable
                    key={cat.label}
                    onPress={() => setActiveCategory(idx)}
                    style={[
                      styles.categoryTab,
                      activeCategory === idx && { borderColor: `${cat.color}60`, backgroundColor: `${cat.color}12` },
                    ]}
                  >
                    <Text style={[
                      styles.categoryTabText,
                      activeCategory === idx && { color: cat.color },
                    ]}>
                      {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* ── Suggestion chips ── */}
            <View style={styles.suggestionSection}>
              <View style={styles.chipsFlow}>
                {currentCategory.skills.map((skillName) => (
                  <SuggestionChip
                    key={skillName}
                    label={skillName}
                    alreadyAdded={activeAddedNames.includes(skillName.toLowerCase())}
                    onPress={() => addSkillByName(skillName)}
                  />
                ))}
              </View>
            </View>

            {/* ── Saved indicator ── */}
            {skills.length > 0 && (
              <Animated.View style={[styles.savedRow, { opacity: savedOpacity }]} pointerEvents="none">
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.accentGreen} />
                <Text style={styles.savedText}>Saved</Text>
              </Animated.View>
            )}

            {/* ── Save button ── */}
            {skills.length > 0 && (
              <Pressable
                onPressIn={() => springIn(saveScale)}
                onPressOut={() => springOut(saveScale)}
                onPress={handleSave}
                style={styles.saveBtnWrap}
              >
                <Animated.View style={[styles.saveBtn, { transform: [{ scale: saveScale }] }]}>
                  <Ionicons name="checkmark-outline" size={20} color={theme.colors.bgRoot} />
                  <Text style={styles.saveBtnText}>Save Skills</Text>
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
    gap: theme.spacing.xl,
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

  // Level legend
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.md,
    flexWrap: "wrap",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  levelDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: theme.typography.sm,
    color: theme.colors.textWhite40,
    letterSpacing: theme.typography.letterSpacingMd,
  },
  legendHint: {
    fontSize: theme.typography.xs,
    color: theme.colors.textWhite30,
    fontStyle: "italic",
  },

  // Section
  section: { gap: theme.spacing.md },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: theme.colors.textWhite30,
    letterSpacing: 1,
  },
  countBadge: {
    paddingVertical: 3,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.round,
    backgroundColor: theme.colors.cardBg04,
    borderWidth: 1,
    borderColor: theme.colors.inputFocusBorder45,
  },
  countBadgeText: {
    fontSize: theme.typography.xs,
    fontWeight: "700",
    color: theme.colors.accentGreen,
    letterSpacing: theme.typography.letterSpacingMd,
  },

  // Added skills chips
  chipsFlow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: theme.spacing.sm,
  },
  skillChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.cardBg04,
    borderRadius: theme.radii.round,
    borderWidth: 1,
    paddingVertical: 6,
    paddingLeft: theme.spacing.md,
    paddingRight: 6,
    gap: 6,
  },
  skillChipLevel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  skillChipName: {
    fontSize: theme.typography.sm,
    fontWeight: "600",
    color: theme.colors.white,
    letterSpacing: theme.typography.letterSpacingMd,
  },
  skillChipRemove: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  // Empty skills
  emptySkillsWrap: {
    alignItems: "center",
    paddingVertical: theme.spacing["4xl"],
    gap: theme.spacing.sm,
  },
  emptySkillsText: {
    fontSize: theme.typography.base,
    fontWeight: "600",
    color: theme.colors.textWhite45,
    textAlign: "center",
  },
  emptySkillsSubtext: {
    fontSize: theme.typography.md,
    color: theme.colors.textWhite30,
    textAlign: "center",
    letterSpacing: theme.typography.letterSpacingMd,
  },

  // Custom input
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.inputBg05,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder08,
    paddingHorizontal: theme.spacing.lg,
    height: 50,
  },
  inputWrapFocused: {
    borderColor: theme.colors.inputFocusBorder45,
    backgroundColor: theme.colors.inputFocusBg04,
  },
  inputIcon: { marginRight: theme.spacing.sm },
  input: {
    flex: 1,
    fontSize: theme.typography.base,
    color: theme.colors.white,
    letterSpacing: theme.typography.letterSpacingMd,
    paddingVertical: 0,
  },
  addInlineBtn: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.accentGreen,
  },
  addInlineBtnText: {
    fontSize: theme.typography.sm,
    fontWeight: "700",
    color: theme.colors.bgRoot,
    letterSpacing: theme.typography.letterSpacingMd,
  },

  // Category tabs
  categoryTabsRow: {
    gap: theme.spacing.sm,
    paddingRight: theme.spacing.md,
  },
  categoryTab: {
    paddingVertical: 7,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.round,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder07,
    backgroundColor: theme.colors.cardBg04,
  },
  categoryTabText: {
    fontSize: theme.typography.sm,
    fontWeight: "600",
    color: theme.colors.textWhite40,
    letterSpacing: theme.typography.letterSpacingMd,
  },

  // Suggestion chips
  suggestionSection: {
    backgroundColor: theme.colors.cardBg04,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder07,
    padding: theme.spacing.lg,
  },
  suggestionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 6,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.round,
    backgroundColor: theme.colors.inputBg05,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder07,
  },
  suggestionChipAdded: {
    borderColor: "rgba(74,222,128,0.3)",
    backgroundColor: "rgba(74,222,128,0.08)",
  },
  suggestionChipPressed: {
    borderColor: theme.colors.inputFocusBorder45,
    backgroundColor: theme.colors.inputFocusBg04,
  },
  suggestionChipText: {
    fontSize: theme.typography.sm,
    fontWeight: "600",
    color: theme.colors.textWhite60,
    letterSpacing: theme.typography.letterSpacingMd,
  },
  suggestionChipTextAdded: {
    color: theme.colors.accentGreen,
  },

  // Save
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

  // Fields
  fieldGroup: { gap: theme.spacing.sm },
  fieldLabel: {
    fontSize: theme.typography.md,
    fontWeight: "600",
    color: theme.colors.textWhite60,
    letterSpacing: theme.typography.letterSpacingMd,
  },
});