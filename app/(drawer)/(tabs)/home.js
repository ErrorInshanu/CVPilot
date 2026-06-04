import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Easing,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { getTemplate } from "../../../constants/resumeTemplates";
import { theme } from "../../../constants/theme";
import { useAuth } from "../../../hooks/useAuth";
import { useResumeStore } from "../../../store/resumeStore";

const { width } = Dimensions.get("window");

// Scale factor for template card previews — renders full CV then scales down
const TEMPLATE_CARD_W = 130;
const TEMPLATE_CARD_H = 155;
const TEMPLATE_SCALE  = 0.38;
const WEBVIEW_W = TEMPLATE_CARD_W / TEMPLATE_SCALE;
const WEBVIEW_H = TEMPLATE_CARD_H / TEMPLATE_SCALE;

// ─── Sample Resume Data (for template previews) ───────────────────────────────
const sampleResume = {
    meta: { title: "Sample", templateId: "classic-clean", themeColor: "#1E3A5F", fontFamily: "default" },
    personal: {
        fullName: "John Anderson",
        jobTitle: "Software Engineer",
        email: "john@email.com",
        phone: "+1 234 567 8901",
        location: "New York, USA",
        linkedin: "linkedin.com/in/john",
        github: "github.com/john",
        website: "",
        summary: "Passionate software engineer with 4+ years building scalable web and mobile applications.",
    },
    experience: [
        {
            id: "1", company: "Google", role: "Software Engineer",
            location: "New York", startDate: "2022", endDate: "",
            current: true,
            description: "Built scalable REST APIs serving 10M+ users\nLed a team of 5 engineers on core platform",
        },
        {
            id: "2", company: "Startup Inc", role: "Junior Developer",
            location: "Remote", startDate: "2020", endDate: "2022",
            current: false,
            description: "Developed React Native mobile app with 50K downloads",
        },
    ],
    education: [
        {
            id: "1", institution: "MIT", degree: "B.Sc",
            field: "Computer Science", startDate: "2016", endDate: "2020",
            current: false, grade: "3.9 GPA",
        },
    ],
    skills: [
        { id: "1", name: "React Native", level: "expert" },
        { id: "2", name: "Node.js",      level: "expert" },
        { id: "3", name: "MongoDB",      level: "intermediate" },
        { id: "4", name: "Python",       level: "intermediate" },
        { id: "5", name: "AWS",          level: "intermediate" },
        { id: "6", name: "Docker",       level: "beginner" },
    ],
    projects: [
        {
            id: "1", title: "CVPilot App", role: "Lead Developer",
            technologies: "React Native, Node.js, MongoDB",
            startDate: "2024", endDate: "", current: true,
            description: "AI-powered resume builder for Android and iOS",
            url: "github.com/john/cvpilot",
        },
    ],
    certifications: [
        { id: "1", name: "AWS Solutions Architect", issuer: "Amazon", issueDate: "2023" },
    ],
    languages: [
        { id: "1", name: "English", proficiency: "fluent" },
        { id: "2", name: "Spanish", proficiency: "conversational" },
    ],
    achievements: [
        { id: "1", title: "Hackathon Winner", issuer: "TechFest 2023", date: "2023", description: "Won first place" },
    ],
    extracurricular: [], volunteer: [], publications: [],
    training: [
        { id: "1", title: "Advanced React Patterns", organization: "Frontend Masters", date: "2023" },
    ],
    interests: [
        { id: "1", name: "Open Source" },
        { id: "2", name: "AI/ML" },
        { id: "3", name: "Photography" },
    ],
};

// ─── Template showcase definitions ───────────────────────────────────────────
const HOME_TEMPLATES = [
    { name: "Classic",   tag: "ATS Friendly", templateId: "classic-clean",   showcaseColor: "#1E3A5F" },
    { name: "Modern",    tag: "Executive",    templateId: "modern-executive", showcaseColor: "#1E3A5F" },
    { name: "Analytical",tag: "Data",         templateId: "modern-analytical",showcaseColor: "#2563EB" },
    { name: "Dynamic",   tag: "Marketing",    templateId: "modern-dynamic",   showcaseColor: "#6D28D9" },
    { name: "Creative",  tag: "Portfolio",    templateId: "creative-portfolio",showcaseColor: "#374151" },
    { name: "Splash",    tag: "Personality",  templateId: "creative-splash",  showcaseColor: "#2563EB" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
}

function getFirstName(user) {
    if (!user) return "there";
    const full = user.name || user.fullName || user.firstName || user.email || "";
    return full.split(" ")[0] || "there";
}

function timeAgo(dateStr) {
    if (!dateStr) return "";
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins  = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days  = Math.floor(diff / 86400000);
    if (mins < 2)   return "just now";
    if (mins < 60)  return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7)   return `${days}d ago`;
    return `${Math.floor(days / 7)}w ago`;
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
function Avatar({ name, onPress }) {
    const initial = name ? name.charAt(0).toUpperCase() : "U";
    return (
        <Pressable onPress={onPress} style={styles.avatarWrap}>
            <Text style={styles.avatarText}>{initial}</Text>
        </Pressable>
    );
}

// ─── Section Title ────────────────────────────────────────────────────────────
function SectionTitle({ title, actionLabel, onAction }) {
    return (
        <View style={styles.sectionTitleRow}>
            <Text style={styles.sectionTitle}>{title}</Text>
            {actionLabel && (
                <Pressable onPress={onAction}>
                    <Text style={styles.sectionAction}>{actionLabel}</Text>
                </Pressable>
            )}
        </View>
    );
}

// ─── Hero Card ────────────────────────────────────────────────────────────────
function HeroCard({ activeResume, resumeCount, onBuild, onContinue, onCreateNew }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const handleIn  = () => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 30, bounciness: 4 }).start();
    const handleOut = () => Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true, speed: 24, bounciness: 6 }).start();

    const hasResume = !!activeResume?.personal?.fullName;

    if (!hasResume) {
        return (
            <Animated.View style={[styles.heroCard, { transform: [{ scale: scaleAnim }] }]}>
                <View style={styles.heroEmpty}>
                    <View style={styles.heroIconWrap}>
                        <Ionicons name="document-text-outline" size={32} color={theme.colors.accentGreen} />
                    </View>
                    <Text style={styles.heroEmptyTitle}>Build your first resume</Text>
                    <Text style={styles.heroEmptySub}>
                        Create a professional resume in minutes with AI-powered suggestions
                    </Text>
                    <Pressable
                        onPressIn={handleIn}
                        onPressOut={handleOut}
                        onPress={onBuild}
                        style={styles.heroBuildBtn}
                    >
                        <Ionicons name="add" size={18} color={theme.colors.bgRoot} />
                        <Text style={styles.heroBuildBtnText}>Build My Resume</Text>
                    </Pressable>
                </View>
            </Animated.View>
        );
    }

    // ── Has resume state ──
    const name     = activeResume.personal?.fullName || "My Resume";
    const title    = activeResume.meta?.title || "My Resume";
    const lastEdit = timeAgo(activeResume.updatedAt);
    const atsScore = activeResume.atsScore;
    const scoreColor =
        atsScore >= 80 ? theme.colors.accentGreen :
        atsScore >= 50 ? "#FFA726" : "#EF5350";

    return (
        <Pressable onPressIn={handleIn} onPressOut={handleOut} onPress={onContinue}>
            <Animated.View style={[styles.heroCard, { transform: [{ scale: scaleAnim }] }]}>
                {/* Top row */}
                <View style={styles.heroCardHeader}>
                    <View style={styles.heroCardIconSmall}>
                        <Ionicons name="document-text" size={20} color={theme.colors.accentGreen} />
                    </View>
                    <View style={styles.heroCardMeta}>
                        <Text style={styles.heroCardTitle} numberOfLines={1}>{title}</Text>
                        <Text style={styles.heroCardSub}>
                            {name}{lastEdit ? ` · ${lastEdit}` : ""}
                        </Text>
                    </View>
                    {atsScore != null && (
                        <View style={styles.atsBadge}>
                            <Text style={[styles.atsBadgeScore, { color: scoreColor }]}>{atsScore}</Text>
                            <Text style={styles.atsBadgeLabel}>ATS</Text>
                        </View>
                    )}
                </View>

                {/* Resume count row */}
                <View style={styles.heroStatsRow}>
                    <View style={styles.heroStat}>
                        <Text style={styles.heroStatValue}>{resumeCount}</Text>
                        <Text style={styles.heroStatLabel}>{resumeCount === 1 ? "Resume" : "Resumes"}</Text>
                    </View>
                    <View style={styles.heroStatDivider} />
                    <View style={styles.heroStat}>
                        <Text style={styles.heroStatValue}>
                            {activeResume.experience?.length || 0}
                        </Text>
                        <Text style={styles.heroStatLabel}>Jobs</Text>
                    </View>
                    <View style={styles.heroStatDivider} />
                    <View style={styles.heroStat}>
                        <Text style={styles.heroStatValue}>
                            {activeResume.skills?.length || 0}
                        </Text>
                        <Text style={styles.heroStatLabel}>Skills</Text>
                    </View>
                </View>

                {/* Footer buttons */}
                <View style={styles.heroCardFooter}>
                    <Pressable style={styles.heroContinueBtn} onPress={onContinue}>
                        <Text style={styles.herocontinueBtnText}>Continue Editing</Text>
                        <Ionicons name="arrow-forward" size={14} color={theme.colors.accentGreen} />
                    </Pressable>
                    <Pressable onPress={onCreateNew} style={styles.heroNewBtn}>
                        <Ionicons name="add" size={14} color={theme.colors.textWhite40} />
                        <Text style={styles.heroNewBtnText}>New</Text>
                    </Pressable>
                </View>
            </Animated.View>
        </Pressable>
    );
}

// ─── AI Tool Card ─────────────────────────────────────────────────────────────
function AIToolCard({ icon, label, color, badge, onPress, masterAnim }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const opacity    = masterAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
    const translateY = masterAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });

    return (
        <Animated.View style={{ opacity, transform: [{ translateY }, { scale: scaleAnim }] }}>
            <Pressable
                onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.94, useNativeDriver: true, speed: 30, bounciness: 4 }).start()}
                onPressOut={() => Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true, speed: 24, bounciness: 6 }).start()}
                onPress={onPress}
                style={styles.aiToolCard}
            >
                {badge && <View style={styles.aiBadge}><Text style={styles.aiBadgeText}>{badge}</Text></View>}
                <View style={[styles.aiToolIconWrap, { backgroundColor: `${color}18` }]}>
                    <Ionicons name={icon} size={22} color={color} />
                </View>
                <Text style={styles.aiToolLabel}>{label}</Text>
            </Pressable>
        </Animated.View>
    );
}

// ─── Quick Action ─────────────────────────────────────────────────────────────
function QuickAction({ icon, label, onPress }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    return (
        <Pressable
            onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.93, useNativeDriver: true, speed: 30, bounciness: 4 }).start()}
            onPressOut={() => Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true, speed: 24, bounciness: 6 }).start()}
            onPress={onPress}
        >
            <Animated.View style={[styles.quickActionCard, { transform: [{ scale: scaleAnim }] }]}>
                <Ionicons name={icon} size={20} color={theme.colors.accentGreen} />
                <Text style={styles.quickActionLabel}>{label}</Text>
            </Animated.View>
        </Pressable>
    );
}

// ─── Template Card ────────────────────────────────────────────────────────────
function TemplateCard({ name, tag, templateId, showcaseColor, onPress }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const html = getTemplate(templateId, sampleResume, showcaseColor);

    return (
        <Pressable
            onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true, speed: 30, bounciness: 4 }).start()}
            onPressOut={() => Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true, speed: 24, bounciness: 6 }).start()}
            onPress={onPress}
        >
            <Animated.View style={[styles.templateCard, { transform: [{ scale: scaleAnim }] }]}>
                {/* Scaled WebView — full CV visible */}
                <View style={styles.templatePreview}>
                    <View style={styles.templateWebScaleWrap}>
                        <WebView
                            source={{ html }}
                            style={{ width: WEBVIEW_W, height: WEBVIEW_H }}
                            scrollEnabled={false}
                            pointerEvents="none"
                            showsVerticalScrollIndicator={false}
                            originWhitelist={["*"]}
                            scalesPageToFit={false}
                        />
                    </View>
                </View>
                <Text style={styles.templateName}>{name}</Text>
                <View style={styles.templateTag}>
                    <Text style={styles.templateTagText}>{tag}</Text>
                </View>
            </Animated.View>
        </Pressable>
    );
}

// ─── Main Home Screen ─────────────────────────────────────────────────────────
export default function HomeScreen() {
    const router     = useRouter();
    const navigation = useNavigation();
    const insets     = useSafeAreaInsets();

    // ── Real data ──
    const { user } = useAuth();
    const { activeResume, resumes } = useResumeStore();
    const firstName   = getFirstName(user);
    const resumeCount = resumes?.length ?? 0;

    // ── Entrance animations ──
    const headerAnim    = useRef(new Animated.Value(0)).current;
    const cardAnim      = useRef(new Animated.Value(0)).current;
    const toolsAnim     = useRef(new Animated.Value(0)).current;
    const actionsAnim   = useRef(new Animated.Value(0)).current;
    const templatesAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.stagger(100, [
            Animated.timing(headerAnim,    { toValue: 1, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(cardAnim,      { toValue: 1, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(toolsAnim,     { toValue: 1, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(actionsAnim,   { toValue: 1, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(templatesAnim, { toValue: 1, duration: 450, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]).start();
    }, []);

    const animStyle = (anim, offsetY = 20) => ({
        opacity: anim,
        transform: [{ translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [offsetY, 0] }) }],
    });

    const AI_TOOLS = [
        { icon: "scan-outline",           label: "ATS Score", color: "#4ADE80", badge: null  },
        { icon: "briefcase-outline",      label: "Job Match", color: "#60A5FA", badge: "New" },
        { icon: "sparkles-outline",       label: "AI Bullets",color: "#A78BFA", badge: null  },
        { icon: "checkmark-circle-outline",label: "Grammar",  color: "#FB923C", badge: null  },
    ];

    return (
        <View style={styles.root}>
            <View style={styles.bgBase} />
            <View style={styles.glowA} />
            <View style={styles.glowB} />
            <View style={styles.vignette} />

            <View
                pointerEvents="none"
                style={{ height: Math.max(insets.top, Platform.OS === "android" ? 12 : 0) }}
            />

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Header ── */}
                <Animated.View style={[styles.header, animStyle(headerAnim, 16)]}>
                    <View style={styles.headerLeft}>
                        <Pressable
                            style={styles.menuBtn}
                            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                        >
                            <Ionicons name="menu-outline" size={22} color={theme.colors.white} />
                        </Pressable>
                        <View>
                            <Text style={styles.greeting}>{getGreeting()},</Text>
                            <Text style={styles.userName}>{firstName} 👋</Text>
                        </View>
                    </View>
                    <Avatar
                        name={firstName}
                        onPress={() => router.push("/(tabs)/profile")}
                    />
                </Animated.View>

                {/* ── Hero Card ── */}
                <Animated.View style={animStyle(cardAnim)}>
                    <HeroCard
                        activeResume={activeResume}
                        resumeCount={resumeCount}
                        onBuild={() => router.push("/(drawer)/(tabs)/builder")}
                        onContinue={() => router.push("/(drawer)/(tabs)/builder")}
                        onCreateNew={() => router.push("/(drawer)/(tabs)/builder")}
                    />
                </Animated.View>

                {/* ── AI Tools ── */}
                <Animated.View style={animStyle(toolsAnim)}>
                    <SectionTitle
                        title="AI Tools"
                        actionLabel="See all"
                        onAction={() => router.push("/(drawer)/(tabs)/analyzer")}
                    />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.aiToolsRow}
                    >
                        {AI_TOOLS.map(tool => (
                            <AIToolCard
                                key={tool.label}
                                icon={tool.icon}
                                label={tool.label}
                                color={tool.color}
                                badge={tool.badge}
                                onPress={() => router.push("/(drawer)/(tabs)/analyzer")}
                                masterAnim={toolsAnim}
                            />
                        ))}
                    </ScrollView>
                </Animated.View>

                {/* ── Quick Actions ── */}
                <Animated.View style={animStyle(actionsAnim)}>
                    <SectionTitle title="Quick Actions" />
                    <View style={styles.quickActionsRow}>
                        <QuickAction
                            icon="download-outline"
                            label="Export PDF"
                            onPress={() => router.push("/(drawer)/(tabs)/builder/preview")}
                        />
                        <QuickAction
                            icon="eye-outline"
                            label="Preview"
                            onPress={() => router.push("/(drawer)/(tabs)/builder/preview")}
                        />
                        <QuickAction
                            icon="color-palette-outline"
                            label="Templates"
                            onPress={() => router.push("/(drawer)/(tabs)/templates")}
                        />
                    </View>
                </Animated.View>

                {/* ── Resume Templates ── */}
                <Animated.View style={animStyle(templatesAnim)}>
                    <SectionTitle
                        title="Resume Templates"
                        actionLabel="See all"
                        onAction={() => router.push("/(drawer)/(tabs)/templates")}
                    />
                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.templatesRow}
                    >
                        {HOME_TEMPLATES.map(t => (
                            <TemplateCard
                                key={t.templateId}
                                name={t.name}
                                tag={t.tag}
                                templateId={t.templateId}
                                showcaseColor={t.showcaseColor}
                                onPress={() => router.push("/(drawer)/(tabs)/templates")}
                            />
                        ))}
                    </ScrollView>
                </Animated.View>

                <View style={styles.bottomSpacer} />
            </ScrollView>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.colors.bgRoot },
    bgBase: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.colors.bgBase },
    glowA: {
        position: "absolute", left: -100, top: -80,
        width: 300, height: 300, borderRadius: 150,
        backgroundColor: theme.colors.accentGreenGlow, opacity: 0.1,
    },
    glowB: {
        position: "absolute", right: -120, bottom: 200,
        width: 350, height: 350, borderRadius: 175,
        backgroundColor: theme.colors.accentTealGlow, opacity: 0.07,
    },
    vignette: { ...StyleSheet.absoluteFillObject, backgroundColor: theme.colors.vignette, opacity: 0.3 },
    scroll: { flex: 1 },
    scrollContent: {
        paddingHorizontal: theme.spacing["3xl"],
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing["5xl"],
        gap: theme.spacing["3xl"],
    },

    // ── Header ──
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: Platform.OS === "android" ? 8 : 0,
    },
    headerLeft: { flexDirection: "row", alignItems: "center", gap: theme.spacing.md },
    menuBtn: {
        width: 38, height: 38,
        borderRadius: theme.radii.sm,
        backgroundColor: theme.colors.cardBg04,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
        alignItems: "center",
        justifyContent: "center",
    },
    greeting: {
        fontSize: theme.typography.md,
        color: theme.colors.textWhite40,
        letterSpacing: theme.typography.letterSpacingMd,
    },
    userName: {
        fontSize: 22,
        fontWeight: "800",
        color: theme.colors.white,
        letterSpacing: theme.typography.letterSpacingMd,
        marginTop: 2,
    },
    avatarWrap: {
        width: 42, height: 42, borderRadius: 21,
        backgroundColor: "rgba(74,222,128,0.15)",
        borderWidth: 1.5,
        borderColor: "rgba(74,222,128,0.35)",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: { fontSize: 16, fontWeight: "800", color: theme.colors.accentGreen },

    // ── Hero Card ──
    heroCard: {
        backgroundColor: theme.colors.cardBg04,
        borderRadius: theme.radii.lg,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
        overflow: "hidden",
    },
    heroEmpty: {
        alignItems: "center",
        padding: theme.spacing["3xl"],
        gap: theme.spacing.md,
    },
    heroIconWrap: {
        width: 64, height: 64,
        borderRadius: 20,
        backgroundColor: "rgba(74,222,128,0.1)",
        borderWidth: 1,
        borderColor: "rgba(74,222,128,0.2)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: theme.spacing.xs,
    },
    heroEmptyTitle: {
        fontSize: theme.typography.lg,
        fontWeight: "700",
        color: theme.colors.white,
        textAlign: "center",
    },
    heroEmptySub: {
        fontSize: theme.typography.md,
        color: theme.colors.textWhite45,
        textAlign: "center",
        lineHeight: 20,
        letterSpacing: theme.typography.letterSpacingMd,
    },
    heroBuildBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.xs,
        marginTop: theme.spacing.xs,
        backgroundColor: theme.colors.accentGreen,
        paddingVertical: 13,
        paddingHorizontal: theme.spacing["5xl"],
        borderRadius: theme.radii.xl,
        ...theme.shadows.greenButtonCompact,
    },
    heroBuildBtnText: {
        fontSize: theme.typography.base,
        fontWeight: "700",
        color: theme.colors.bgRoot,
        letterSpacing: theme.typography.letterSpacingXl,
    },
    heroCardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.md,
        padding: theme.spacing["2xl"],
        paddingBottom: theme.spacing.md,
    },
    heroCardIconSmall: {
        width: 38, height: 38,
        borderRadius: theme.radii.sm,
        backgroundColor: "rgba(74,222,128,0.1)",
        alignItems: "center",
        justifyContent: "center",
    },
    heroCardMeta: { flex: 1 },
    heroCardTitle: {
        fontSize: theme.typography.base,
        fontWeight: "700",
        color: theme.colors.white,
        letterSpacing: theme.typography.letterSpacingMd,
    },
    heroCardSub: {
        fontSize: theme.typography.sm,
        color: theme.colors.textWhite40,
        marginTop: 2,
    },
    atsBadge: {
        alignItems: "center",
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: theme.radii.sm,
        backgroundColor: theme.colors.cardBg04,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
    },
    atsBadgeScore: { fontSize: 16, fontWeight: "800" },
    atsBadgeLabel: { fontSize: 9, color: theme.colors.textWhite40, fontWeight: "600", letterSpacing: 1 },

    heroStatsRow: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: theme.spacing["2xl"],
        paddingVertical: theme.spacing.md,
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: theme.colors.cardBorder07,
    },
    heroStat: { flex: 1, alignItems: "center" },
    heroStatValue: { fontSize: 18, fontWeight: "800", color: theme.colors.white },
    heroStatLabel: { fontSize: 10, color: theme.colors.textWhite40, marginTop: 2, letterSpacing: 0.5 },
    heroStatDivider: { width: 1, height: 28, backgroundColor: theme.colors.cardBorder07 },

    heroCardFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: theme.spacing["2xl"],
        paddingTop: theme.spacing.md,
    },
    heroContinueBtn: { flexDirection: "row", alignItems: "center", gap: 6 },
    heroontineBtnText: {
        fontSize: theme.typography.md,
        fontWeight: "700",
        color: theme.colors.accentGreen,
        letterSpacing: theme.typography.letterSpacingMd,
    },
    heroNewBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingVertical: 6,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.radii.sm,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
    },
    heroNewBtnText: { fontSize: theme.typography.sm, color: theme.colors.textWhite40 },

    // ── Section Title ──
    sectionTitleRow: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: theme.spacing.md,
    },
    sectionTitle: {
        fontSize: theme.typography.base,
        fontWeight: "700",
        color: theme.colors.white,
        letterSpacing: theme.typography.letterSpacingMd,
    },
    sectionAction: {
        fontSize: theme.typography.sm,
        color: theme.colors.accentGreen,
        fontWeight: "600",
    },

    // ── AI Tools ──
    aiToolsRow: { gap: theme.spacing.md, paddingRight: theme.spacing.md },
    aiToolCard: {
        width: 88,
        backgroundColor: theme.colors.cardBg04,
        borderRadius: theme.radii.md,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
        padding: theme.spacing.md,
        alignItems: "center",
        gap: theme.spacing.xs,
    },
    aiToolIconWrap: {
        width: 44, height: 44,
        borderRadius: theme.radii.sm,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 2,
    },
    aiToolLabel: {
        fontSize: 11, fontWeight: "600",
        color: theme.colors.textWhite60,
        textAlign: "center", letterSpacing: 0.1,
    },
    aiBadge: {
        position: "absolute", top: 8, right: 8,
        backgroundColor: theme.colors.accentGreen,
        borderRadius: 6, paddingHorizontal: 5, paddingVertical: 1,
    },
    aiBadgeText: { fontSize: 8, fontWeight: "800", color: theme.colors.bgRoot, letterSpacing: 0.2 },

    // ── Quick Actions ──
    quickActionsRow: { flexDirection: "row", gap: theme.spacing.md },
    quickActionCard: {
        flex: 1,
        backgroundColor: theme.colors.cardBg04,
        borderRadius: theme.radii.md,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
        paddingVertical: theme.spacing.lg,
        alignItems: "center",
        gap: 6,
    },
    quickActionLabel: {
        fontSize: 11, fontWeight: "600",
        color: theme.colors.textWhite60, letterSpacing: 0.1,
    },

    // ── Templates ──
    templatesRow: { gap: theme.spacing.md, paddingRight: theme.spacing.md },
    templateCard: {
        width: TEMPLATE_CARD_W,
        backgroundColor: theme.colors.cardBg04,
        borderRadius: theme.radii.md,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
        padding: theme.spacing.md,
        gap: theme.spacing.xs,
    },
    templatePreview: {
        width: TEMPLATE_CARD_W - theme.spacing.md * 2,
        height: TEMPLATE_CARD_H,
        borderRadius: theme.radii.sm,
        overflow: "hidden",
        backgroundColor: "#ffffff",
        marginBottom: 4,
    },
    templateWebScaleWrap: {
        width: WEBVIEW_W,
        height: WEBVIEW_H,
        transform: [{ scale: TEMPLATE_SCALE }],
        transformOrigin: "top left",
        position: "absolute",
        top: 0, left: 0,
    },
    templateName: {
        fontSize: theme.typography.md,
        fontWeight: "700",
        color: theme.colors.white,
    },
    templateTag: {
        alignSelf: "flex-start",
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 6,
        backgroundColor: "rgba(74,222,128,0.12)",
    },
    templateTagText: {
        fontSize: 10, fontWeight: "700",
        color: theme.colors.accentGreen, letterSpacing: 0.2,
    },

    bottomSpacer: { height: theme.spacing["3xl"] },
});