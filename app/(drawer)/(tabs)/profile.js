import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useRef } from "react";
import {
    Alert,
    Animated,
    Linking,
    Pressable,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../hooks/useAuth";
import { useResumeStore } from "../../../store/resumeStore";

const APP_VERSION = "1.0.0";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getInitials(name) {
    if (!name) return "?";
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(dateString) {
    if (!dateString) return "—";
    try {
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric", month: "short", year: "numeric",
        });
    } catch { return "—"; }
}

function getCompletionStats(resume) {
    if (!resume) return { completed: 0, total: 8, percent: 0 };
    const sections = [
        resume.personal?.fullName,
        resume.personal?.summary,
        resume.experience?.length > 0,
        resume.education?.length > 0,
        resume.skills?.length > 0,
        resume.projects?.length > 0,
        resume.certifications?.length > 0,
        resume.languages?.length > 0,
    ];
    const completed = sections.filter(Boolean).length;
    return { completed, total: 8, percent: Math.round((completed / 8) * 100) };
}

// ─── Row Item ─────────────────────────────────────────────────────────────────
function RowItem({ icon, iconColor = theme.colors.textWhite55, label, value, onPress, danger, rightIcon = "chevron-forward" }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 30 }).start();
    const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 24 }).start();

    return (
        <Pressable onPress={onPress} onPressIn={handlePressIn} onPressOut={handlePressOut} disabled={!onPress}>
            <Animated.View style={[styles.rowItem, { transform: [{ scale: scaleAnim }] }]}>
                <View style={[styles.rowIconWrap, danger && styles.rowIconWrapDanger]}>
                    <Ionicons name={icon} size={17} color={danger ? theme.colors.dotRed : iconColor} />
                </View>
                <Text style={[styles.rowLabel, danger && styles.rowLabelDanger]}>{label}</Text>
                {value ? <Text style={styles.rowValue}>{value}</Text> : null}
                {onPress && (
                    <Ionicons
                        name={rightIcon}
                        size={15}
                        color={danger ? theme.colors.dotRed : theme.colors.textWhite30}
                    />
                )}
            </Animated.View>
        </Pressable>
    );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function SectionCard({ title, children }) {
    return (
        <View style={styles.sectionCard}>
            {title && <Text style={styles.sectionTitle}>{title}</Text>}
            <View style={styles.sectionContent}>{children}</View>
        </View>
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProfileScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { user, signOut } = useAuth();
    const { resumes, activeResume } = useResumeStore();

    const stats = getCompletionStats(activeResume);
    const userName = user?.name || user?.fullName || "User";
    const userEmail = user?.email || "—";
    const memberSince = formatDate(user?.createdAt);

    const handleLogout = useCallback(() => {
        Alert.alert(
            "Logout",
            "Are you sure you want to logout?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Logout",
                    style: "destructive",
                    onPress: async () => {
                        await signOut();
                        router.replace("/sign-in");
                    },
                },
            ]
        );
    }, [signOut, router]);

    const handleShareApp = useCallback(async () => {
        try {
            await Share.share({
                message: "Check out CVPilot — AI-powered Resume Builder! Build professional resumes in minutes. 🚀",
                title: "CVPilot — Resume Builder",
            });
        } catch (e) {
            console.error(e);
        }
    }, []);

    const handleRateApp = useCallback(() => {
        // Replace with your Play Store link after publishing
        Linking.openURL("https://play.google.com/store/apps/details?id=com.cvpilot");
    }, []);

    return (
        <View style={[styles.root, { paddingTop: insets.top }]}>
            {/* ── Glow ── */}
            <View style={styles.glowA} />

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 80 }]}
            >
                {/* ── Avatar + Name ── */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatarRing}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>{getInitials(userName)}</Text>
                        </View>
                    </View>
                    <Text style={styles.userName}>{userName}</Text>
                    <Text style={styles.userEmail}>{userEmail}</Text>
                    {memberSince !== "—" && (
                        <View style={styles.memberBadge}>
                            <Ionicons name="calendar-outline" size={11} color={theme.colors.textWhite40} />
                            <Text style={styles.memberText}>Member since {memberSince}</Text>
                        </View>
                    )}
                </View>

                {/* ── Resume Stats ── */}
                <View style={styles.statsRow}>
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{resumes.length}</Text>
                        <Text style={styles.statLabel}>Resumes</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{stats.percent}%</Text>
                        <Text style={styles.statLabel}>Complete</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statCard}>
                        <Text style={styles.statNumber}>{stats.completed}/{stats.total}</Text>
                        <Text style={styles.statLabel}>Sections</Text>
                    </View>
                </View>

                {/* ── Active Resume Progress ── */}
                {activeResume && (
                    <SectionCard title="Active Resume">
                        <View style={styles.resumeProgressWrap}>
                            <View style={styles.resumeProgressTop}>
                                <Text style={styles.resumeTitle} numberOfLines={1}>
                                    {activeResume.meta?.title || "My Resume"}
                                </Text>
                                <Text style={styles.resumePercent}>{stats.percent}%</Text>
                            </View>
                            <View style={styles.progressBg}>
                                <View style={[styles.progressFill, { width: `${stats.percent}%` }]} />
                            </View>
                            <Text style={styles.progressHint}>
                                {stats.completed} of {stats.total} key sections filled
                            </Text>
                        </View>
                        <RowItem
                            icon="create-outline"
                            label="Edit Resume"
                            onPress={() => router.push("/(drawer)/(tabs)/builder")}
                        />
                        <RowItem
                            icon="eye-outline"
                            label="Preview Resume"
                            onPress={() => router.push("/(drawer)/(tabs)/builder/preview")}
                        />
                    </SectionCard>
                )}

                {/* ── App ── */}
                <SectionCard title="App">
                    <RowItem
                        icon="star-outline"
                        iconColor="#FBBF24"
                        label="Rate CVPilot"
                        onPress={handleRateApp}
                    />
                    <RowItem
                        icon="share-social-outline"
                        iconColor="#60A5FA"
                        label="Share with Friends"
                        onPress={handleShareApp}
                    />
                    <RowItem
                        icon="document-text-outline"
                        label="Terms of Service"
                        onPress={() => router.push("/(drawer)/terms-of-service")}
                    />
                    <RowItem
                        icon="shield-checkmark-outline"
                        label="Privacy Policy"
                        onPress={() => router.push("/(drawer)/privacy-policy")}
                    />
                    <RowItem
                        icon="information-circle-outline"
                        label="Version"
                        value={`v${APP_VERSION}`}
                    />
                </SectionCard>

                {/* ── Account ── */}
                <SectionCard title="Account">
                    <RowItem
                        icon="log-out-outline"
                        label="Logout"
                        onPress={handleLogout}
                        danger
                        rightIcon="chevron-forward"
                    />
                </SectionCard>

                {/* ── Footer ── */}
                <Text style={styles.footer}>CVPilot v{APP_VERSION} · Made with ❤️ in India</Text>
            </ScrollView>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: theme.colors.bgRoot,
    },
    glowA: {
        position: "absolute",
        top: -60, right: -80,
        width: 260, height: 260,
        borderRadius: 130,
        backgroundColor: theme.colors.accentGreenGlow,
        opacity: 0.07,
    },
    scroll: {
        paddingHorizontal: 20,
        paddingTop: 8,
        gap: 16,
    },

    // ── Avatar ──
    avatarSection: {
        alignItems: "center",
        paddingVertical: 24,
        gap: 6,
    },
    avatarRing: {
        padding: 3,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "rgba(74,222,128,0.4)",
        marginBottom: 4,
    },
    avatar: {
        width: 76,
        height: 76,
        borderRadius: 38,
        backgroundColor: "rgba(74,222,128,0.12)",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
        borderColor: "rgba(74,222,128,0.2)",
    },
    avatarText: {
        fontSize: 28,
        fontWeight: "800",
        color: theme.colors.accentGreen,
        letterSpacing: 1,
    },
    userName: {
        fontSize: 20,
        fontWeight: "800",
        color: theme.colors.white,
        letterSpacing: 0.3,
    },
    userEmail: {
        fontSize: 13,
        color: theme.colors.textWhite55,
    },
    memberBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        marginTop: 4,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 20,
        backgroundColor: theme.colors.cardBg04,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
    },
    memberText: {
        fontSize: 11,
        color: theme.colors.textWhite40,
    },

    // ── Stats ──
    statsRow: {
        flexDirection: "row",
        backgroundColor: theme.colors.cardBg04,
        borderRadius: theme.radii.md,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
        paddingVertical: 16,
    },
    statCard: {
        flex: 1,
        alignItems: "center",
        gap: 4,
    },
    statNumber: {
        fontSize: 20,
        fontWeight: "800",
        color: theme.colors.accentGreen,
    },
    statLabel: {
        fontSize: 11,
        color: theme.colors.textWhite40,
        fontWeight: "600",
    },
    statDivider: {
        width: 1,
        backgroundColor: theme.colors.cardBorder07,
        marginVertical: 4,
    },

    // ── Section Card ──
    sectionCard: {
        backgroundColor: theme.colors.cardBg04,
        borderRadius: theme.radii.md,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
        overflow: "hidden",
    },
    sectionTitle: {
        fontSize: 11,
        fontWeight: "700",
        color: theme.colors.textWhite40,
        letterSpacing: 1,
        textTransform: "uppercase",
        paddingHorizontal: 16,
        paddingTop: 14,
        paddingBottom: 8,
    },
    sectionContent: {
        paddingBottom: 6,
    },

    // ── Row Item ──
    rowItem: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 13,
        gap: 12,
        borderTopWidth: 1,
        borderTopColor: theme.colors.cardBorder07,
    },
    rowIconWrap: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: theme.colors.inputBg05,
        alignItems: "center",
        justifyContent: "center",
    },
    rowIconWrapDanger: {
        backgroundColor: "rgba(255,59,48,0.08)",
    },
    rowLabel: {
        flex: 1,
        fontSize: 14,
        fontWeight: "600",
        color: theme.colors.white,
    },
    rowLabelDanger: {
        color: theme.colors.dotRed,
    },
    rowValue: {
        fontSize: 13,
        color: theme.colors.textWhite40,
        marginRight: 4,
    },

    // ── Resume Progress ──
    resumeProgressWrap: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 8,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.cardBorder07,
    },
    resumeProgressTop: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    resumeTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: theme.colors.white,
        flex: 1,
    },
    resumePercent: {
        fontSize: 14,
        fontWeight: "800",
        color: theme.colors.accentGreen,
    },
    progressBg: {
        height: 4,
        borderRadius: 2,
        backgroundColor: "rgba(255,255,255,0.07)",
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 2,
        backgroundColor: theme.colors.accentGreen,
    },
    progressHint: {
        fontSize: 11,
        color: theme.colors.textWhite40,
    },

    // ── Footer ──
    footer: {
        textAlign: "center",
        fontSize: 11,
        color: theme.colors.textWhite30,
        paddingVertical: 8,
    },
});