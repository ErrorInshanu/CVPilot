import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useFocusEffect } from "@react-navigation/native";
import { useNavigation, useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
    Alert,
    Animated,
    Easing,
    Pressable,
    RefreshControl,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../constants/theme";
import {
    createNewResumeOnBackend,
    deleteResumeFromBackend,
    loadResumesFromBackend,
} from "../../services/resumeSyncService";
import { useResumeStore } from "../../store/resumeStore";

// ─── Format date ──────────────────────────────────────────────────────────────
function formatDate(dateString) {
  if (!dateString) return "Never saved";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "Unknown date";
  }
}

// ─── Resume Card ──────────────────────────────────────────────────────────────
function ResumeCard({ resume, isActive, onOpen, onDelete, animValue }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const cardOpacity = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const cardTranslateY = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  const completedSections = [
    resume.personal?.fullName,
    resume.experience?.length > 0,
    resume.education?.length > 0,
    resume.skills?.length > 0,
    resume.projects?.length > 0,
  ].filter(Boolean).length;

  const progressPercent = Math.round((completedSections / 5) * 100);

  return (
    <Animated.View
      style={{
        opacity: cardOpacity,
        transform: [{ translateY: cardTranslateY }],
      }}
    >
      <Pressable
        onPressIn={() =>
          Animated.spring(scaleAnim, {
            toValue: 0.98,
            useNativeDriver: true,
            speed: 30,
            bounciness: 4,
          }).start()
        }
        onPressOut={() =>
          Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 24,
            bounciness: 6,
          }).start()
        }
        onPress={onOpen}
      >
        <Animated.View
          style={[
            styles.card,
            isActive && styles.cardActive,
            { transform: [{ scale: scaleAnim }] },
          ]}
        >
          {/* Active left bar */}
          {isActive && <View style={styles.activeBar} />}

          <View style={styles.cardContent}>
            {/* Icon */}
            <View style={[styles.cardIcon, isActive && styles.cardIconActive]}>
              <Ionicons
                name="document-text-outline"
                size={22}
                color={isActive ? theme.colors.accentGreen : theme.colors.textWhite40}
              />
            </View>

            {/* Info */}
            <View style={styles.cardInfo}>
              <View style={styles.cardTitleRow}>
                <Text style={styles.cardTitle} numberOfLines={1}>
                  {resume.meta?.title || "My Resume"}
                </Text>
                {isActive && (
                  <View style={styles.activeBadge}>
                    <Text style={styles.activeBadgeText}>Active</Text>
                  </View>
                )}
              </View>
              <Text style={styles.cardName} numberOfLines={1}>
                {resume.personal?.fullName || "No name added"}
              </Text>
              <View style={styles.cardMeta}>
                <Ionicons name="time-outline" size={11} color={theme.colors.textWhite30} />
                <Text style={styles.cardDate}>
                  {formatDate(resume.updatedAt || resume.createdAt)}
                </Text>
                <Text style={styles.cardDot}>•</Text>
                <Text style={styles.cardProgress}>{progressPercent}% complete</Text>
              </View>

              {/* Progress bar */}
              <View style={styles.progressBarBg}>
                <View
                  style={[
                    styles.progressBarFill,
                    {
                      width: `${progressPercent}%`,
                      backgroundColor: isActive
                        ? theme.colors.accentGreen
                        : theme.colors.textWhite30,
                    },
                  ]}
                />
              </View>
            </View>

            {/* Delete */}
            <Pressable onPress={onDelete} hitSlop={8} style={styles.deleteBtn}>
              <Ionicons name="trash-outline" size={17} color={theme.colors.dotRed} />
            </Pressable>
          </View>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SavedResumesScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { resumes, activeResume, loadResume } = useResumeStore();

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [creating, setCreating] = useState(false);

  const screenEnter = useRef(new Animated.Value(0)).current;
  const cardAnims = useRef([]);

  const runEnterAnimation = useCallback((count) => {
    screenEnter.setValue(0);
    Animated.timing(screenEnter, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    while (cardAnims.current.length < count) {
      cardAnims.current.push(new Animated.Value(0));
    }

    Animated.stagger(
      80,
      cardAnims.current.slice(0, count).map((anim) => {
        anim.setValue(0);
        return Animated.timing(anim, {
          toValue: 1,
          duration: 380,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        });
      })
    ).start();
  }, [screenEnter]);

  const fetchResumes = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    await loadResumesFromBackend();
    if (isRefresh) setRefreshing(false);
    else setLoading(false);
    runEnterAnimation(useResumeStore.getState().resumes.length);
  }, [runEnterAnimation]);

  useFocusEffect(
    useCallback(() => {
      fetchResumes();
    }, [fetchResumes])
  );

  const handleOpen = (resume) => {
    loadResume(resume);
    router.push("/(drawer)/(tabs)/builder");
  };

  const handleDelete = (resume) => {
    Alert.alert(
      "Delete Resume?",
      `"${resume.meta?.title || "My Resume"}" will be permanently deleted.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const result = await deleteResumeFromBackend(resume._id ?? resume.id);
            if (!result.success) {
              Alert.alert("Error", result.error || "Could not delete resume");
            }
            runEnterAnimation(useResumeStore.getState().resumes.length);
          },
        },
      ]
    );
  };

  const handleNewResume = async () => {
    setCreating(true);
    const result = await createNewResumeOnBackend("My Resume");
    setCreating(false);
    if (result.success) {
      router.push("/(drawer)/(tabs)/builder");
    } else {
      Alert.alert("Error", result.error || "Could not create resume");
    }
  };

  const enterOpacity = screenEnter;
  const enterTranslateY = screenEnter.interpolate({
    inputRange: [0, 1],
    outputRange: [16, 0],
  });

  return (
    <View style={styles.root}>
      {/* ── Background ── */}
      <View style={styles.bgBase} />
      <View style={styles.glowA} />
      <View style={styles.vignette} />

      {/* ── Header ── */}
      <View style={[styles.header, { paddingTop: Math.max(insets.top, 16) }]}>
        {/* Hamburger */}
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={styles.hamburgerBtn}
          hitSlop={8}
        >
          <Ionicons name="menu-outline" size={24} color={theme.colors.white} />
        </Pressable>

        {/* Title */}
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Saved Resumes</Text>
          <Text style={styles.headerSub}>
            {resumes.length > 0
              ? `${resumes.length} resume${resumes.length > 1 ? "s" : ""} saved`
              : "No resumes yet"}
          </Text>
        </View>

        {/* New Resume Button */}
        <Pressable
          style={styles.newBtn}
          onPress={handleNewResume}
          disabled={creating}
        >
          <Ionicons name="add" size={18} color={theme.colors.accentGreen} />
          <Text style={styles.newBtnText}>{creating ? "..." : "New"}</Text>
        </Pressable>
      </View>

      {/* ── Divider ── */}
      <View style={styles.headerDivider} />

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 },
        ]}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchResumes(true)}
            tintColor={theme.colors.accentGreen}
          />
        }
      >
        <Animated.View
          style={{
            opacity: enterOpacity,
            transform: [{ translateY: enterTranslateY }],
            gap: theme.spacing.xl,
          }}
        >
          {/* ── Loading State ── */}
          {loading && (
            <View style={styles.loadingWrap}>
              <Text style={styles.loadingText}>Loading resumes…</Text>
            </View>
          )}

          {/* ── Empty State ── */}
          {!loading && resumes.length === 0 && (
            <View style={styles.emptyWrap}>
              <View style={styles.emptyIconWrap}>
                <Ionicons
                  name="document-text-outline"
                  size={40}
                  color={theme.colors.textWhite30}
                />
              </View>
              <Text style={styles.emptyTitle}>No saved resumes</Text>
              <Text style={styles.emptySubtitle}>
                Start building your first resume and save it to see it here.
              </Text>
              <Pressable style={styles.emptyBtn} onPress={handleNewResume}>
                <Ionicons name="add" size={18} color={theme.colors.bgRoot} />
                <Text style={styles.emptyBtnText}>Create New Resume</Text>
              </Pressable>
            </View>
          )}

          {/* ── Resume Cards ── */}
          {!loading && resumes.length > 0 && (
            <View style={styles.cardsList}>
              {resumes.map((resume, index) => {
                if (!cardAnims.current[index]) {
                  cardAnims.current[index] = new Animated.Value(1);
                }
                const resumeId = resume._id ?? resume.id;
                const activeId = activeResume?._id ?? activeResume?.id;
                return (
                  <ResumeCard
                    key={resumeId}
                    resume={resume}
                    isActive={resumeId === activeId}
                    index={index}
                    animValue={cardAnims.current[index]}
                    onOpen={() => handleOpen(resume)}
                    onDelete={() => handleDelete(resume)}
                  />
                );
              })}
            </View>
          )}

          {/* ── Tip Card ── */}
          {!loading && resumes.length > 0 && (
            <View style={styles.tipCard}>
              <Ionicons
                name="information-circle-outline"
                size={15}
                color="#60A5FA"
              />
              <Text style={styles.tipText}>
                Pull down to refresh. Tap a resume to open and edit it.
              </Text>
            </View>
          )}
        </Animated.View>
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
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.vignette, opacity: 0.3,
  },

  // ── Header ──
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: theme.spacing["3xl"],
    paddingBottom: theme.spacing.lg,
    gap: theme.spacing.md,
    backgroundColor: theme.colors.bgRoot,
    zIndex: 10,
  },
  hamburgerBtn: {
    width: 38, height: 38,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.cardBg04,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder07,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: { flex: 1 },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: theme.colors.white,
    letterSpacing: theme.typography.letterSpacingMd,
  },
  headerSub: {
    fontSize: theme.typography.sm,
    color: theme.colors.textWhite40,
    marginTop: 2,
    letterSpacing: theme.typography.letterSpacingMd,
  },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 7,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    borderColor: "rgba(74,222,128,0.3)",
    backgroundColor: "rgba(74,222,128,0.08)",
  },
  newBtnText: {
    fontSize: theme.typography.sm,
    fontWeight: "700",
    color: theme.colors.accentGreen,
  },
  headerDivider: {
    height: 1,
    backgroundColor: theme.colors.cardBorder07,
    marginBottom: theme.spacing.xs,
  },

  // ── Scroll ──
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: theme.spacing["3xl"],
    paddingTop: theme.spacing.xl,
    gap: theme.spacing.md,
  },

  // ── Loading ──
  loadingWrap: {
    alignItems: "center",
    paddingVertical: theme.spacing["4xl"],
  },
  loadingText: {
    fontSize: theme.typography.md,
    color: theme.colors.textWhite40,
  },

  // ── Empty ──
  emptyWrap: {
    alignItems: "center",
    paddingVertical: 60,
    gap: theme.spacing.lg,
  },
  emptyIconWrap: {
    width: 80, height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.cardBg04,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder07,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontSize: theme.typography.lg,
    fontWeight: "700",
    color: theme.colors.textWhite60,
  },
  emptySubtitle: {
    fontSize: theme.typography.md,
    color: theme.colors.textWhite40,
    textAlign: "center",
    letterSpacing: theme.typography.letterSpacingMd,
    paddingHorizontal: theme.spacing.xl,
  },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing["2xl"],
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.accentGreen,
    marginTop: theme.spacing.sm,
    ...theme.shadows.greenButtonCompact,
  },
  emptyBtnText: {
    fontSize: theme.typography.base,
    fontWeight: "700",
    color: theme.colors.bgRoot,
  },

  // ── Cards ──
  cardsList: { gap: theme.spacing.md },
  card: {
    backgroundColor: theme.colors.cardBg04,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder07,
    overflow: "hidden",
  },
  cardActive: {
    borderColor: "rgba(74,222,128,0.3)",
    backgroundColor: "rgba(74,222,128,0.04)",
  },
  activeBar: {
    position: "absolute",
    left: 0, top: 0, bottom: 0,
    width: 3,
    backgroundColor: theme.colors.accentGreen,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  cardIcon: {
    width: 44, height: 44,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.inputBg05,
    alignItems: "center",
    justifyContent: "center",
  },
  cardIconActive: {
    backgroundColor: "rgba(74,222,128,0.1)",
  },
  cardInfo: { flex: 1, gap: 3 },
  cardTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  },
  cardTitle: {
    fontSize: theme.typography.base,
    fontWeight: "700",
    color: theme.colors.white,
    letterSpacing: theme.typography.letterSpacingMd,
    flex: 1,
  },
  activeBadge: {
    paddingVertical: 2,
    paddingHorizontal: 7,
    borderRadius: theme.radii.round,
    backgroundColor: "rgba(74,222,128,0.15)",
    borderWidth: 1,
    borderColor: "rgba(74,222,128,0.3)",
  },
  activeBadgeText: {
    fontSize: 9,
    fontWeight: "700",
    color: theme.colors.accentGreen,
    letterSpacing: 0.5,
  },
  cardName: {
    fontSize: theme.typography.sm,
    color: theme.colors.textWhite60,
  },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 2,
  },
  cardDate: {
    fontSize: theme.typography.xs,
    color: theme.colors.textWhite40,
  },
  cardDot: {
    fontSize: theme.typography.xs,
    color: theme.colors.textWhite30,
  },
  cardProgress: {
    fontSize: theme.typography.xs,
    color: theme.colors.textWhite40,
  },
  progressBarBg: {
    height: 3,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.07)",
    overflow: "hidden",
    marginTop: 5,
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 2,
  },
  deleteBtn: {
    width: 34, height: 34,
    borderRadius: theme.radii.sm,
    backgroundColor: "rgba(255,59,48,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Tip ──
  tipCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
    backgroundColor: "rgba(96,165,250,0.07)",
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    borderColor: "rgba(96,165,250,0.18)",
    padding: theme.spacing.md,
  },
  tipText: {
    flex: 1,
    fontSize: theme.typography.sm,
    color: "rgba(96,165,250,0.85)",
    letterSpacing: theme.typography.letterSpacingMd,
  },
});