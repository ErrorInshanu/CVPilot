import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { theme } from "../../../../constants/theme";
import { useResumeStore } from "../../../../store/resumeStore";

// ─── Section config ───────────────────────────────────────────────────────────
const SECTIONS = [
  {
    id: "personal",
    label: "Personal Info",
    sublabel: "Name, contact, summary",
    icon: "person-outline",
    color: "#4ADE80",
    required: true,
  },
  {
    id: "experience",
    label: "Work Experience",
    sublabel: "Jobs, roles, achievements",
    icon: "briefcase-outline",
    color: "#60A5FA",
    required: false,
  },
  {
    id: "education",
    label: "Education",
    sublabel: "Degrees, institutions, grades",
    icon: "school-outline",
    color: "#A78BFA",
    required: true,
  },
  {
    id: "skills",
    label: "Skills",
    sublabel: "Technical and soft skills",
    icon: "flash-outline",
    color: "#FB923C",
    required: false,
  },
  {
    id: "projects",
    label: "Projects",
    sublabel: "Personal and academic projects",
    icon: "code-slash-outline",
    color: "#34D399",
    required: false,
  },
  {
    id: "certifications",
    label: "Certifications",
    sublabel: "Courses, licenses, certificates",
    icon: "ribbon-outline",
    color: "#FBBF24",
    required: false,
  },
  {
    id: "achievements",
    label: "Achievements",
    sublabel: "Awards, recognitions, competitions",
    icon: "trophy-outline",
    color: "#F87171",
    required: false,
  },
  {
    id: "extracurricular",
    label: "Extracurricular",
    sublabel: "Clubs, sports, activities",
    icon: "people-outline",
    color: "#38BDF8",
    required: false,
  },
  {
    id: "volunteer",
    label: "Volunteer Work",
    sublabel: "NGO, community service",
    icon: "heart-outline",
    color: "#F472B6",
    required: false,
  },
  {
    id: "publications",
    label: "Publications",
    sublabel: "Research papers, articles",
    icon: "book-outline",
    color: "#A78BFA",
    required: false,
  },
  {
    id: "languages",
    label: "Languages",
    sublabel: "Languages you speak",
    icon: "language-outline",
    color: "#4ADE80",
    required: false,
  },
  {
    id: "training",
    label: "Training & Workshops",
    sublabel: "Short courses, bootcamps",
    icon: "fitness-outline",
    color: "#FB923C",
    required: false,
  },
  {
    id: "interests",
    label: "Interests & Hobbies",
    sublabel: "Personal interests",
    icon: "star-outline",
    color: "#FBBF24",
    required: false,
  },
];

// ─── Completion helper ────────────────────────────────────────────────────────
function getSectionStatus(sectionId, resume) {
  switch (sectionId) {
    case "personal":
      return resume.personal?.fullName?.trim()?.length > 0;
    case "experience":
      return resume.experience?.length > 0;
    case "education":
      return resume.education?.length > 0;
    case "skills":
      return resume.skills?.length > 0;
    case "projects":
      return resume.projects?.length > 0;
    case "certifications":
      return resume.certifications?.length > 0;
    case "achievements":
      return resume.achievements?.length > 0;
    case "extracurricular":
      return resume.extracurricular?.length > 0;
    case "volunteer":
      return resume.volunteer?.length > 0;
    case "publications":
      return resume.publications?.length > 0;
    case "languages":
      return resume.languages?.length > 0;
    case "training":
      return resume.training?.length > 0;
    case "interests":
      return resume.interests?.length > 0;
    default:
      return false;
  }
}

function getCompletionCount(resume) {
  return SECTIONS.filter((s) => getSectionStatus(s.id, resume)).length;
}

// ─── Section Row Component ────────────────────────────────────────────────────
function SectionRow({ section, isComplete, index, masterAnim, onPress }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const rowOpacity = masterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const rowTranslateY = masterAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 24,
      bounciness: 6,
    }).start();
  };

  return (
    <Animated.View
      style={{
        opacity: rowOpacity,
        transform: [{ translateY: rowTranslateY }, { scale: scaleAnim }],
      }}
    >
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <View style={styles.sectionRow}>
          <View style={[styles.sectionIcon, { backgroundColor: `${section.color}18` }]}>
            <Ionicons name={section.icon} size={20} color={section.color} />
          </View>
          <View style={styles.sectionMeta}>
            <View style={styles.sectionLabelRow}>
              <Text style={styles.sectionLabel}>{section.label}</Text>
              {section.required && (
                <View style={styles.requiredBadge}>
                  <Text style={styles.requiredText}>Required</Text>
                </View>
              )}
            </View>
            <Text style={styles.sectionSublabel}>{section.sublabel}</Text>
          </View>
          {isComplete ? (
            <View style={styles.completedIcon}>
              <Ionicons name="checkmark-circle" size={22} color={theme.colors.accentGreen} />
            </View>
          ) : (
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textWhite30} />
          )}
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Main Builder Screen ──────────────────────────────────────────────────────
export default function BuilderScreen() {
  const router = useRouter();
  const { createNewResume } = useResumeStore();

  // ✅ FIX 1 — read fresh from store on every render
  const [, forceUpdate] = useState(0);

  // ✅ FIX 2 — re-read store every time this screen is focused
  useFocusEffect(
    useCallback(() => {
      forceUpdate((n) => n + 1);
    }, [])
  );

  // ✅ FIX 3 — always read fresh activeResume directly from store (not stale hook)
  const activeResume = useResumeStore.getState().activeResume;
  const resumeTitle = activeResume?.meta?.title || "My Resume";

  const completedCount = getCompletionCount(activeResume);
  const totalSections = SECTIONS.length;
  const progressPercent = Math.round((completedCount / totalSections) * 100);

  // Entrance animations
  const headerAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const sectionsAnim = useRef(new Animated.Value(0)).current;
  const sectionAnims = useRef(SECTIONS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(headerAnim, {
        toValue: 1,
        duration: 480,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 420,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.stagger(
        60,
        sectionAnims.map((anim) =>
          Animated.timing(anim, {
            toValue: 1,
            duration: 380,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          })
        )
      ),
    ]).start();
  }, []);

  const handleSectionPress = (sectionId) => {
    router.push(`/(drawer)/(tabs)/builder/${sectionId}`);
  };

  const animStyle = (anim, offsetY = 16) => ({
    opacity: anim,
    transform: [{
      translateY: anim.interpolate({
        inputRange: [0, 1],
        outputRange: [offsetY, 0],
      }),
    }],
  });

  return (
    <View style={styles.root}>
      <View style={styles.bgBase} />
      <View style={styles.glowA} />
      <View style={styles.vignette} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <Animated.View style={[styles.header, animStyle(headerAnim)]}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>Resume Builder</Text>
              <Text style={styles.headerSub}>
                Fill in your details section by section
              </Text>
            </View>
            <Pressable
              style={styles.previewBtn}
              onPress={() => router.push("/builder/preview")}
            >
              <Ionicons name="eye-outline" size={16} color={theme.colors.accentGreen} />
              <Text style={styles.previewBtnText}>Preview</Text>
            </Pressable>
          </View>

          <View style={styles.resumeTitleWrap}>
            <Ionicons name="document-text-outline" size={16} color={theme.colors.textWhite40} />
            <Text style={styles.resumeTitleText}>{resumeTitle}</Text>
            <Pressable hitSlop={8}>
              <Ionicons name="pencil-outline" size={14} color={theme.colors.textWhite40} />
            </Pressable>
          </View>
        </Animated.View>

        {/* ── Progress Card ── */}
        <Animated.View style={[styles.progressCard, animStyle(progressAnim)]}>
          <View style={styles.progressTop}>
            <Text style={styles.progressLabel}>Overall Progress</Text>
            <Text style={styles.progressPercent}>{progressPercent}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, { width: `${progressPercent}%` }]} />
          </View>
          <Text style={styles.progressSub}>
            {completedCount} of {totalSections} sections completed
          </Text>
        </Animated.View>

        {/* ── Required Sections ── */}
        <Animated.View style={animStyle(sectionsAnim)}>
          <Text style={styles.groupLabel}>Required Sections</Text>
        </Animated.View>

        <View style={styles.sectionsWrap}>
          {SECTIONS.filter((s) => s.required).map((section, index) => (
            <SectionRow
              key={section.id}
              section={section}
              isComplete={getSectionStatus(section.id, activeResume)}
              index={index}
              masterAnim={sectionAnims[index] || new Animated.Value(1)}
              onPress={() => handleSectionPress(section.id)}
            />
          ))}
        </View>

        {/* ── Optional Sections ── */}
        <Text style={[styles.groupLabel, { marginTop: theme.spacing.xl }]}>
          Optional Sections
        </Text>

        <View style={styles.sectionsWrap}>
          {SECTIONS.filter((s) => !s.required).map((section) => {
            const globalIndex = SECTIONS.findIndex((s) => s.id === section.id);
            return (
              <SectionRow
                key={section.id}
                section={section}
                isComplete={getSectionStatus(section.id, activeResume)}
                index={globalIndex}
                masterAnim={sectionAnims[globalIndex] || new Animated.Value(1)}
                onPress={() => handleSectionPress(section.id)}
              />
            );
          })}
        </View>

        {/* ── Bottom Actions ── */}
        <View style={styles.bottomActions}>
          <Pressable
            style={styles.previewFullBtn}
            onPress={() => router.push("/builder/preview")}
          >
            <Ionicons name="eye-outline" size={18} color={theme.colors.bgRoot} />
            <Text style={styles.previewFullBtnText}>Preview Resume</Text>
          </Pressable>

          <Pressable
            style={styles.newResumeBtn}
            onPress={() => createNewResume()}
          >
            <Ionicons name="add-outline" size={18} color={theme.colors.textWhite60} />
            <Text style={styles.newResumeBtnText}>New Resume</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgRoot },
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
    paddingTop: theme.spacing.xl,
    paddingBottom: 100,
    gap: theme.spacing.md,
  },
  header: { gap: theme.spacing.md, marginBottom: theme.spacing.xs },
  headerTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  headerTitle: {
    fontSize: 22, fontWeight: "800",
    color: theme.colors.white, letterSpacing: theme.typography.letterSpacingMd,
  },
  headerSub: {
    fontSize: theme.typography.md, color: theme.colors.textWhite40,
    marginTop: 3, letterSpacing: theme.typography.letterSpacingMd,
  },
  previewBtn: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingVertical: 7, paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.sm, borderWidth: 1,
    borderColor: "rgba(74,222,128,0.3)", backgroundColor: "rgba(74,222,128,0.08)",
  },
  previewBtnText: { fontSize: theme.typography.sm, fontWeight: "600", color: theme.colors.accentGreen },
  resumeTitleWrap: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: theme.colors.cardBg04, borderRadius: theme.radii.sm,
    borderWidth: 1, borderColor: theme.colors.cardBorder07,
    paddingVertical: 10, paddingHorizontal: theme.spacing.md,
  },
  resumeTitleText: {
    flex: 1, fontSize: theme.typography.md,
    color: theme.colors.textWhite60, letterSpacing: theme.typography.letterSpacingMd,
  },
  progressCard: {
    backgroundColor: theme.colors.cardBg04, borderRadius: theme.radii.lg,
    borderWidth: 1, borderColor: theme.colors.cardBorder07,
    padding: theme.spacing["2xl"], gap: theme.spacing.xs, marginBottom: theme.spacing.xs,
  },
  progressTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  progressLabel: { fontSize: theme.typography.md, fontWeight: "600", color: theme.colors.textWhite60 },
  progressPercent: { fontSize: theme.typography.lg, fontWeight: "800", color: theme.colors.accentGreen },
  progressBarBg: {
    height: 6, borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.07)",
    overflow: "hidden", marginVertical: 4,
  },
  progressBarFill: { height: "100%", borderRadius: 3, backgroundColor: theme.colors.accentGreen },
  progressSub: {
    fontSize: theme.typography.sm, color: theme.colors.textWhite40,
    letterSpacing: theme.typography.letterSpacingMd,
  },
  groupLabel: {
    fontSize: theme.typography.sm, fontWeight: "700",
    color: theme.colors.textWhite40, letterSpacing: 0.8,
    textTransform: "uppercase", marginBottom: theme.spacing.xs, marginTop: theme.spacing.xs,
  },
  sectionsWrap: { gap: theme.spacing.xs },
  sectionRow: {
    flexDirection: "row", alignItems: "center", gap: theme.spacing.md,
    backgroundColor: theme.colors.cardBg04, borderRadius: theme.radii.md,
    borderWidth: 1, borderColor: theme.colors.cardBorder07, padding: theme.spacing.lg,
  },
  sectionIcon: { width: 40, height: 40, borderRadius: theme.radii.sm, alignItems: "center", justifyContent: "center" },
  sectionMeta: { flex: 1, gap: 3 },
  sectionLabelRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  sectionLabel: {
    fontSize: theme.typography.base, fontWeight: "700",
    color: theme.colors.white, letterSpacing: theme.typography.letterSpacingMd,
  },
  sectionSublabel: {
    fontSize: theme.typography.sm, color: theme.colors.textWhite40,
    letterSpacing: theme.typography.letterSpacingMd,
  },
  requiredBadge: {
    backgroundColor: "rgba(74,222,128,0.12)", borderRadius: 6,
    paddingHorizontal: 6, paddingVertical: 2,
  },
  requiredText: { fontSize: 9, fontWeight: "700", color: theme.colors.accentGreen, letterSpacing: 0.3 },
  completedIcon: { width: 22, height: 22, alignItems: "center", justifyContent: "center" },
  bottomActions: { gap: theme.spacing.md, marginTop: theme.spacing.xl },
  previewFullBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: theme.spacing.xs, height: 52, borderRadius: theme.radii.md,
    backgroundColor: theme.colors.accentGreen, ...theme.shadows.greenButtonCompact,
  },
  previewFullBtnText: {
    fontSize: theme.typography.lg, fontWeight: "700",
    color: theme.colors.bgRoot, letterSpacing: theme.typography.letterSpacingXl,
  },
  newResumeBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: theme.spacing.xs, height: 48, borderRadius: theme.radii.md,
    borderWidth: 1, borderColor: theme.colors.cardBorder07, backgroundColor: theme.colors.cardBg04,
  },
  newResumeBtnText: {
    fontSize: theme.typography.base, fontWeight: "600",
    color: theme.colors.textWhite60, letterSpacing: theme.typography.letterSpacingMd,
  },
});