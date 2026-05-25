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

// ─── Suggestion Categories ────────────────────────────────────────────────────
const INTEREST_CATEGORIES = [
  {
    label: "Sports & Fitness",
    icon: "football-outline",
    color: "#4ADE80",
    items: [
      "Cricket", "Football", "Basketball", "Badminton", "Chess",
      "Swimming", "Cycling", "Yoga", "Gym & Fitness", "Table Tennis",
      "Kabaddi", "Athletics", "Volleyball", "Tennis", "Hiking",
    ],
  },
  {
    label: "Arts & Creative",
    icon: "color-palette-outline",
    color: "#FB923C",
    items: [
      "Drawing & Sketching", "Painting", "Photography", "Videography",
      "Graphic Design", "Pottery", "Origami", "Calligraphy",
      "Sculpting", "Fashion Design", "Interior Design", "Cooking",
    ],
  },
  {
    label: "Music & Performance",
    icon: "musical-notes-outline",
    color: "#F472B6",
    items: [
      "Playing Guitar", "Playing Piano", "Singing", "Dancing",
      "Classical Music", "Music Production", "Theatre & Drama",
      "Stand-up Comedy", "Beatboxing", "Playing Tabla", "Playing Flute",
    ],
  },
  {
    label: "Tech & Gaming",
    icon: "game-controller-outline",
    color: "#60A5FA",
    items: [
      "Open Source Contribution", "Competitive Programming",
      "Game Development", "3D Printing", "Robotics", "Drone Flying",
      "PC Building", "Video Gaming", "Mobile Gaming", "Ethical Hacking",
      "App Development", "Machine Learning Projects",
    ],
  },
  {
    label: "Reading & Writing",
    icon: "book-outline",
    color: "#A78BFA",
    items: [
      "Reading Fiction", "Reading Non-Fiction", "Blogging",
      "Creative Writing", "Poetry", "Journaling", "Book Reviews",
      "Storytelling", "Script Writing", "Newsletter Writing",
    ],
  },
  {
    label: "Travel & Nature",
    icon: "airplane-outline",
    color: "#34D399",
    items: [
      "Travelling", "Trekking", "Backpacking", "Wildlife Photography",
      "Bird Watching", "Gardening", "Stargazing", "Camping",
      "Road Trips", "Exploring Local Culture", "Volunteering Abroad",
    ],
  },
  {
    label: "Social & Community",
    icon: "people-outline",
    color: "#FBBF24",
    items: [
      "Volunteering", "NGO Work", "Event Organising", "Mentoring",
      "Debate & Public Speaking", "Model United Nations (MUN)",
      "Community Service", "Fundraising", "Social Media Content",
      "Podcasting", "Teaching / Tutoring",
    ],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function readInterestsFromStore() {
  return useResumeStore.getState().activeResume.interests ?? [];
}

function newInterestItem(name = "") {
  return {
    id: Date.now().toString() + Math.random().toString(36).slice(2),
    name,
  };
}

// ─── Interest Chip (added) ────────────────────────────────────────────────────
function InterestChip({ name, onRemove }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleRemove = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, { toValue: 0.85, duration: 80, useNativeDriver: true }),
      Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start(() => onRemove());
  };

  return (
    <Animated.View style={[styles.interestChip, { transform: [{ scale: scaleAnim }] }]}>
      <Text style={styles.interestChipText}>{name}</Text>
      <Pressable onPress={handleRemove} hitSlop={8} style={styles.interestChipRemove}>
        <Ionicons name="close" size={13} color={theme.colors.textWhite40} />
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
      {alreadyAdded ? (
        <Ionicons name="checkmark" size={11} color={theme.colors.accentGreen} />
      ) : (
        <Ionicons name="add" size={11} color={theme.colors.textWhite40} />
      )}
      <Text
        style={[
          styles.suggestionChipText,
          alreadyAdded && styles.suggestionChipTextAdded,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function InterestsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // ✅ Correct Zustand bindings
  const updateInterests = useResumeStore((s) => s.updateInterests);
  const markSaved = useResumeStore((s) => s.markSaved);

  // Local State
  const [interests, setInterests] = useState(readInterestsFromStore);
  const [inputValue, setInputValue] = useState("");
  const [inputFocused, setInputFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState(0);

  // Animation Refs
  const saveScale = useRef(new Animated.Value(1)).current;
  const savedOpacity = useRef(new Animated.Value(0)).current;
  const screenEnter = useRef(new Animated.Value(0)).current;
  const inputRef = useRef(null);

  // Sync on focus
  useFocusEffect(
    useCallback(() => {
      setInterests(readInterestsFromStore());
    }, [])
  );

  // Entry animation
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
  const addInterestByName = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const alreadyExists = interests.some(
      (i) => i.name.toLowerCase() === trimmed.toLowerCase()
    );
    if (alreadyExists) return;
    const item = newInterestItem(trimmed);
    setInterests((prev) => [...prev, item]);
    setInputValue("");
  };

  const handleRemoveInterest = (id) => {
    const updated = interests.filter((i) => i.id !== id);
    setInterests(updated);
    updateInterests(updated);  // ← add this line
  };

  // ✅ Fixed save — uses proper Zustand action
  const handleSave = () => {
    updateInterests(interests);
    markSaved();

    savedOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(savedOpacity, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(savedOpacity, {
        toValue: 0,
        duration: 240,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const springIn = (anim) =>
    Animated.spring(anim, { toValue: 0.96, useNativeDriver: true, speed: 30, bounciness: 4 }).start();
  const springOut = (anim) =>
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 24, bounciness: 6 }).start();

  const addedNames = interests.map((i) => i.name.toLowerCase());
  const currentCategory = INTEREST_CATEGORIES[activeCategory];

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
          <Animated.View
            style={{
              opacity: enterOpacity,
              transform: [{ translateY: enterTranslateY }],
              gap: theme.spacing.xl,
            }}
          >
            {/* ── Top Bar ── */}
            <View style={styles.topBar}>
              <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
                <Ionicons name="chevron-back" size={22} color={theme.colors.white} />
              </Pressable>
              <Text style={styles.screenTitle}>Interests & Hobbies</Text>
              <Pressable onPress={() => router.back()} style={styles.skipBtn} hitSlop={12}>
                <Text style={styles.skipText}>
                  {interests.length > 0 ? "Done" : "Skip"}
                </Text>
              </Pressable>
            </View>

            {/* ── Subtitle ── */}
            <View style={styles.subtitleRow}>
              <Text style={styles.screenSub}>
                Show recruiters who you are beyond work
              </Text>
              {interests.length > 0 && (
                <View style={styles.countBadge}>
                  <Text style={styles.countBadgeText}>{interests.length} added</Text>
                </View>
              )}
            </View>

            {/* ── Tip Card ── */}
            <View style={styles.tipCard}>
              <Ionicons name="information-circle-outline" size={16} color="#FBBF24" />
              <Text style={styles.tipText}>
                Keep it to 4–6 interests. Relevant hobbies can spark conversation in interviews.
              </Text>
            </View>

            {/* ── Added Interests ── */}
            {interests.length > 0 ? (
              <View style={styles.section}>
                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionLabel}>YOUR INTERESTS</Text>
                  <Text style={styles.sectionHint}>Tap × to remove</Text>
                </View>
                <View style={styles.chipsFlow}>
                  {interests.map((item) => (
                    <InterestChip
                      key={item.id}
                      name={item.name}
                      onRemove={() => handleRemoveInterest(item.id)}
                    />
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.emptyWrap}>
                <Ionicons name="heart-outline" size={36} color={theme.colors.textWhite30} />
                <Text style={styles.emptyText}>No interests added yet</Text>
                <Text style={styles.emptySubtext}>
                  Type a custom interest or pick from the suggestions below
                </Text>
              </View>
            )}

            {/* ── Custom Input ── */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>ADD CUSTOM INTEREST</Text>
              <View style={[styles.inputWrap, inputFocused && styles.inputWrapFocused]}>
                <Ionicons
                  name="heart-outline"
                  size={18}
                  color={inputFocused ? theme.colors.accentGreen : theme.colors.inputIconDefault}
                  style={styles.inputIcon}
                />
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  value={inputValue}
                  onChangeText={setInputValue}
                  placeholder="e.g. Astrophotography, Cooking…"
                  placeholderTextColor={theme.colors.inputPlaceholder}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  onSubmitEditing={() => addInterestByName(inputValue)}
                  returnKeyType="done"
                  autoCapitalize="words"
                  autoCorrect={false}
                  selectionColor={theme.colors.accentGreen}
                />
                {inputValue.trim().length > 0 && (
                  <Pressable onPress={() => addInterestByName(inputValue)} style={styles.addInlineBtn}>
                    <Text style={styles.addInlineBtnText}>Add</Text>
                  </Pressable>
                )}
              </View>
            </View>

            {/* ── Category Tabs ── */}
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>BROWSE BY CATEGORY</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryTabsRow}
              >
                {INTEREST_CATEGORIES.map((cat, idx) => (
                  <Pressable
                    key={cat.label}
                    onPress={() => setActiveCategory(idx)}
                    style={[
                      styles.categoryTab,
                      activeCategory === idx && {
                        borderColor: `${cat.color}60`,
                        backgroundColor: `${cat.color}12`,
                      },
                    ]}
                  >
                    <Ionicons
                      name={cat.icon}
                      size={13}
                      color={activeCategory === idx ? cat.color : theme.colors.textWhite40}
                    />
                    <Text
                      style={[
                        styles.categoryTabText,
                        activeCategory === idx && { color: cat.color },
                      ]}
                    >
                      {cat.label}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* ── Suggestions Panel ── */}
            <View style={styles.suggestionPanel}>
              <View style={styles.suggestionPanelHeader}>
                <Ionicons name={currentCategory.icon} size={14} color={currentCategory.color} />
                <Text style={[styles.suggestionPanelTitle, { color: currentCategory.color }]}>
                  {currentCategory.label.toUpperCase()}
                </Text>
              </View>
              <View style={styles.chipsFlow}>
                {currentCategory.items.map((itemName) => (
                  <SuggestionChip
                    key={itemName}
                    label={itemName}
                    alreadyAdded={addedNames.includes(itemName.toLowerCase())}
                    onPress={() => addInterestByName(itemName)}
                  />
                ))}
              </View>
            </View>

            {/* ── Saved Indicator ── */}
            {interests.length > 0 && (
              <Animated.View style={[styles.savedRow, { opacity: savedOpacity }]} pointerEvents="none">
                <Ionicons name="checkmark-circle" size={18} color={theme.colors.accentGreen} />
                <Text style={styles.savedText}>Saved</Text>
              </Animated.View>
            )}

            {/* ── Save Button ── */}
            {interests.length > 0 && (
              <Pressable
                onPressIn={() => springIn(saveScale)}
                onPressOut={() => springOut(saveScale)}
                onPress={handleSave}
              >
                <Animated.View style={[styles.saveBtn, { transform: [{ scale: saveScale }] }]}>
                  <Ionicons name="checkmark-outline" size={20} color={theme.colors.bgRoot} />
                  <Text style={styles.saveBtnText}>Save Interests</Text>
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
    backgroundColor: theme.colors.cardBg04, borderWidth: 1,
    borderColor: theme.colors.cardBorder07, alignItems: "center", justifyContent: "center",
  },
  skipBtn: { width: 38, alignItems: "center", justifyContent: "center" },
  skipText: {
    fontSize: theme.typography.sm, fontWeight: "600",
    color: theme.colors.textWhite40, letterSpacing: theme.typography.letterSpacingMd,
  },
  screenTitle: {
    fontSize: theme.typography.lg, fontWeight: "800",
    color: theme.colors.white, letterSpacing: theme.typography.letterSpacingMd,
  },
  subtitleRow: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "space-between", paddingRight: 4,
  },
  screenSub: {
    flex: 1, fontSize: theme.typography.md,
    color: theme.colors.textWhite40, letterSpacing: theme.typography.letterSpacingMd,
  },
  countBadge: {
    paddingVertical: 3, paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.round, backgroundColor: theme.colors.cardBg04,
    borderWidth: 1, borderColor: theme.colors.inputFocusBorder45,
  },
  countBadgeText: {
    fontSize: theme.typography.xs, fontWeight: "700",
    color: theme.colors.accentGreen, letterSpacing: theme.typography.letterSpacingMd,
  },
  tipCard: {
    flexDirection: "row", alignItems: "flex-start", gap: theme.spacing.sm,
    backgroundColor: "rgba(251,191,36,0.07)", borderRadius: theme.radii.sm,
    borderWidth: 1, borderColor: "rgba(251,191,36,0.18)", padding: theme.spacing.md,
  },
  tipText: {
    flex: 1, fontSize: theme.typography.sm, color: "rgba(251,191,36,0.85)",
    lineHeight: 18, letterSpacing: theme.typography.letterSpacingMd,
  },
  section: { gap: theme.spacing.md },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  sectionLabel: { fontSize: 10, fontWeight: "700", color: theme.colors.textWhite30, letterSpacing: 1 },
  sectionHint: { fontSize: theme.typography.xs, color: theme.colors.textWhite30, fontStyle: "italic" },
  chipsFlow: { flexDirection: "row", flexWrap: "wrap", gap: theme.spacing.sm },
  interestChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    paddingVertical: 7, paddingLeft: theme.spacing.md, paddingRight: 8,
    borderRadius: theme.radii.round, backgroundColor: theme.colors.mintBg09,
    borderWidth: 1, borderColor: theme.colors.mintBorder24,
  },
  interestChipText: {
    fontSize: theme.typography.sm, fontWeight: "600",
    color: theme.colors.brandMintText, letterSpacing: theme.typography.letterSpacingMd,
  },
  interestChipRemove: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: "rgba(255,255,255,0.08)", alignItems: "center", justifyContent: "center",
  },
  emptyWrap: {
    alignItems: "center", paddingVertical: theme.spacing["4xl"], gap: theme.spacing.sm,
    backgroundColor: theme.colors.cardBg04, borderRadius: theme.radii.md,
    borderWidth: 1, borderColor: theme.colors.cardBorder07, borderStyle: "dashed",
  },
  emptyText: { fontSize: theme.typography.base, fontWeight: "600", color: theme.colors.textWhite45 },
  emptySubtext: {
    fontSize: theme.typography.sm, color: theme.colors.textWhite30,
    textAlign: "center", paddingHorizontal: theme.spacing.xl,
  },
  inputWrap: {
    flexDirection: "row", alignItems: "center", backgroundColor: theme.colors.inputBg05,
    borderRadius: theme.radii.sm, borderWidth: 1, borderColor: theme.colors.inputBorder08,
    paddingHorizontal: theme.spacing.lg, height: 50,
  },
  inputWrapFocused: { borderColor: theme.colors.inputFocusBorder45, backgroundColor: theme.colors.inputFocusBg04 },
  inputIcon: { marginRight: theme.spacing.sm },
  input: {
    flex: 1, fontSize: theme.typography.base, color: theme.colors.white,
    letterSpacing: theme.typography.letterSpacingMd, paddingVertical: 0,
  },
  addInlineBtn: {
    paddingHorizontal: theme.spacing.md, paddingVertical: 6,
    borderRadius: theme.radii.sm, backgroundColor: theme.colors.accentGreen,
  },
  addInlineBtnText: {
    fontSize: theme.typography.sm, fontWeight: "700",
    color: theme.colors.bgRoot, letterSpacing: theme.typography.letterSpacingMd,
  },
  categoryTabsRow: { gap: theme.spacing.sm, paddingRight: theme.spacing.md },
  categoryTab: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingVertical: 7, paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.round, borderWidth: 1,
    borderColor: theme.colors.cardBorder07, backgroundColor: theme.colors.cardBg04,
  },
  categoryTabText: {
    fontSize: theme.typography.sm, fontWeight: "600",
    color: theme.colors.textWhite40, letterSpacing: theme.typography.letterSpacingMd,
  },
  suggestionPanel: {
    backgroundColor: theme.colors.cardBg04, borderRadius: theme.radii.lg,
    borderWidth: 1, borderColor: theme.colors.cardBorder07,
    padding: theme.spacing.lg, gap: theme.spacing.md,
  },
  suggestionPanelHeader: { flexDirection: "row", alignItems: "center", gap: theme.spacing.sm },
  suggestionPanelTitle: { fontSize: 10, fontWeight: "700", letterSpacing: 1 },
  suggestionChip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingVertical: 6, paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.round, backgroundColor: theme.colors.inputBg05,
    borderWidth: 1, borderColor: theme.colors.cardBorder07,
  },
  suggestionChipAdded: { borderColor: "rgba(74,222,128,0.3)", backgroundColor: "rgba(74,222,128,0.08)" },
  suggestionChipPressed: { borderColor: theme.colors.inputFocusBorder45, backgroundColor: theme.colors.inputFocusBg04 },
  suggestionChipText: {
    fontSize: theme.typography.sm, fontWeight: "600",
    color: theme.colors.textWhite60, letterSpacing: theme.typography.letterSpacingMd,
  },
  suggestionChipTextAdded: { color: theme.colors.accentGreen },
  savedRow: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: theme.spacing.sm, paddingVertical: theme.spacing.xs,
  },
  savedText: { fontSize: theme.typography.md, fontWeight: "700", color: theme.colors.accentGreen },
  saveBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: theme.spacing.sm, height: 52, borderRadius: theme.radii.md,
    backgroundColor: theme.colors.accentGreen, ...theme.shadows.greenButtonCompact,
  },
  saveBtnText: {
    fontSize: theme.typography.lg, fontWeight: "700",
    color: theme.colors.bgRoot, letterSpacing: theme.typography.letterSpacingXl,
  },
});