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

const { width } = Dimensions.get("window");

// ─── Sample Resume Data (for template previews) ───────────────────────────────
const sampleResume = {
    meta: { title: "Sample", templateId: "classic-clean", themeColor: "#4ADE80", fontFamily: "default" },
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
        { id: "1", name: "React Native" }, { id: "2", name: "Node.js" },
        { id: "3", name: "MongoDB" }, { id: "4", name: "Python" },
        { id: "5", name: "AWS" }, { id: "6", name: "Docker" },
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
        { id: "1", title: "Hackathon Winner", issuer: "TechFest 2023", date: "2023", description: "Won first place among 200 teams" },
    ],
    extracurricular: [], volunteer: [], publications: [],
    training: [
        { id: "1", title: "Advanced React Patterns", organization: "Frontend Masters", date: "2023" },
    ],
    interests: [
        { id: "1", name: "Open Source" }, { id: "2", name: "AI/ML" },
        { id: "3", name: "Photography" },
    ],
};

// ─── Greeting Helper ──────────────────────────────────────────────────────────
function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
}

// ─── Avatar Component ─────────────────────────────────────────────────────────
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

// ─── Resume Card ──────────────────────────────────────────────────────────────
function ResumeCard({ resume, onPress, onCreateNew }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

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

    if (!resume) {
        return (
            <Animated.View style={[styles.resumeCard, { transform: [{ scale: scaleAnim }] }]}>
                <View style={styles.resumeCardEmpty}>
                    <View style={styles.resumeCardIconWrap}>
                        <Ionicons name="document-text-outline" size={32} color={theme.colors.accentGreen} />
                    </View>
                    <Text style={styles.resumeCardEmptyTitle}>Build your first resume</Text>
                    <Text style={styles.resumeCardEmptySub}>
                        Create a professional resume in minutes with AI-powered suggestions
                    </Text>
                    <Pressable
                        onPressIn={handlePressIn}
                        onPressOut={handlePressOut}
                        onPress={onPress}
                        style={styles.resumeCardBtn}
                    >
                        <Ionicons name="add" size={18} color={theme.colors.bgRoot} />
                        <Text style={styles.resumeCardBtnText}>Build My Resume</Text>
                    </Pressable>
                </View>
            </Animated.View>
        );
    }

    const progress = resume.completion ?? 0;
    const progressWidth = `${progress}%`;

    return (
        <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut} onPress={onPress}>
            <Animated.View style={[styles.resumeCard, { transform: [{ scale: scaleAnim }] }]}>
                <View style={styles.resumeCardHeader}>
                    <View style={styles.resumeCardIconSmall}>
                        <Ionicons name="document-text" size={20} color={theme.colors.accentGreen} />
                    </View>
                    <View style={styles.resumeCardMeta}>
                        <Text style={styles.resumeCardTitle} numberOfLines={1}>{resume.title}</Text>
                        <Text style={styles.resumeCardSub}>Last edited {resume.lastEdited}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={theme.colors.textWhite30} />
                </View>
                <View style={styles.progressBarWrap}>
                    <View style={styles.progressBarBg}>
                        <View style={[styles.progressBarFill, { width: progressWidth }]} />
                    </View>
                    <Text style={styles.progressText}>{progress}% complete</Text>
                </View>
                <View style={styles.resumeCardFooter}>
                    <Pressable style={styles.continueBtnWrap} onPress={onPress}>
                        <Text style={styles.continueBtn}>Continue Building</Text>
                        <Ionicons name="arrow-forward" size={14} color={theme.colors.accentGreen} />
                    </Pressable>
                    <Pressable onPress={onCreateNew} style={styles.newResumeBtnSmall}>
                        <Ionicons name="add" size={14} color={theme.colors.textWhite40} />
                        <Text style={styles.newResumeBtnSmallText}>New</Text>
                    </Pressable>
                </View>
            </Animated.View>
        </Pressable>
    );
}

// ─── AI Tool Card ─────────────────────────────────────────────────────────────
function AIToolCard({ icon, label, color, badge, onPress, masterAnim }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    const cardOpacity = masterAnim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });
    const cardTranslateY = masterAnim.interpolate({ inputRange: [0, 1], outputRange: [20, 0] });

    const handlePressIn = () => Animated.spring(scaleAnim, { toValue: 0.94, useNativeDriver: true, speed: 30, bounciness: 4 }).start();
    const handlePressOut = () => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 24, bounciness: 6 }).start();

    return (
        <Animated.View style={{ opacity: cardOpacity, transform: [{ translateY: cardTranslateY }, { scale: scaleAnim }] }}>
            <Pressable
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
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

// ─── Quick Action Button ──────────────────────────────────────────────────────
function QuickAction({ icon, label, onPress }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    return (
        <Pressable
            onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.93, useNativeDriver: true, speed: 30, bounciness: 4 }).start()}
            onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 24, bounciness: 6 }).start()}
            onPress={onPress}
        >
            <Animated.View style={[styles.quickActionCard, { transform: [{ scale: scaleAnim }] }]}>
                <Ionicons name={icon} size={20} color={theme.colors.accentGreen} />
                <Text style={styles.quickActionLabel}>{label}</Text>
            </Animated.View>
        </Pressable>
    );
}

// ─── Recent Resume Row ────────────────────────────────────────────────────────
function RecentResumeRow({ resume, onPress }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const progress = resume.completion ?? 0;
    const scoreColor =
        progress >= 80 ? theme.colors.accentGreen :
        progress >= 50 ? "#FFA726" : "#EF5350";

    return (
        <Pressable
            onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.97, useNativeDriver: true, speed: 30, bounciness: 4 }).start()}
            onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 24, bounciness: 6 }).start()}
            onPress={onPress}
        >
            <Animated.View style={[styles.recentResumeRow, { transform: [{ scale: scaleAnim }] }]}>
                <View style={styles.recentResumeIcon}>
                    <Ionicons name="document-text-outline" size={18} color={theme.colors.accentGreen} />
                </View>
                <View style={styles.recentResumeMeta}>
                    <Text style={styles.recentResumeTitle} numberOfLines={1}>{resume.title}</Text>
                    <Text style={styles.recentResumeSub}>{resume.lastEdited}</Text>
                </View>
                <Text style={[styles.recentResumeScore, { color: scoreColor }]}>{progress}%</Text>
                <Ionicons name="chevron-forward" size={16} color={theme.colors.textWhite30} />
            </Animated.View>
        </Pressable>
    );
}

// ─── Template Card (with real WebView preview) ────────────────────────────────
function TemplateCard({ name, tag, color, templateId, onPress }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const html = templateId ? getTemplate(templateId, sampleResume) : null;

    return (
        <Pressable
            onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.95, useNativeDriver: true, speed: 30, bounciness: 4 }).start()}
            onPressOut={() => Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true, speed: 24, bounciness: 6 }).start()}
            onPress={onPress}
        >
            <Animated.View style={[styles.templateCard, { transform: [{ scale: scaleAnim }] }]}>
                {/* Mini WebView Preview */}
                <View style={styles.templatePreview}>
                    {html ? (
                        <WebView
                            source={{ html }}
                            style={styles.templateWebView}
                            scrollEnabled={false}
                            pointerEvents="none"
                            showsVerticalScrollIndicator={false}
                            originWhitelist={["*"]}
                            scalesPageToFit={true}
                        />
                    ) : (
                        <View style={[styles.templateComingSoon, { backgroundColor: `${color}10` }]}>
                            <Ionicons name="time-outline" size={20} color={`${color}80`} />
                            <Text style={[styles.templateComingSoonText, { color: `${color}80` }]}>Soon</Text>
                        </View>
                    )}
                </View>

                <Text style={styles.templateName}>{name}</Text>
                <View style={[styles.templateTag, { backgroundColor: `${color}18` }]}>
                    <Text style={[styles.templateTagText, { color }]}>{tag}</Text>
                </View>
            </Animated.View>
        </Pressable>
    );
}

// ─── Main Home Screen ─────────────────────────────────────────────────────────
export default function HomeScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    // TODO: Replace with real user data from AuthContext
    const user = { name: "Shanu" };
    const hasResume = false;
    const resume = hasResume ? {
        title: "Software Engineer Resume",
        lastEdited: "2 days ago",
        completion: 72,
    } : null;

    const recentResumes = hasResume ? [
        { id: "1", title: "Software Engineer Resume", lastEdited: "2 days ago", completion: 72 },
        { id: "2", title: "Product Manager Resume", lastEdited: "1 week ago", completion: 45 },
    ] : [];

    // Entrance animations
    const headerAnim = useRef(new Animated.Value(0)).current;
    const cardAnim = useRef(new Animated.Value(0)).current;
    const toolsAnim = useRef(new Animated.Value(0)).current;
    const actionsAnim = useRef(new Animated.Value(0)).current;
    const recentAnim = useRef(new Animated.Value(0)).current;
    const templatesAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.stagger(120, [
            Animated.timing(headerAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(cardAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(toolsAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(actionsAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(recentAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
            Animated.timing(templatesAnim, { toValue: 1, duration: 500, easing: Easing.out(Easing.cubic), useNativeDriver: true }),
        ]).start();
    }, []);

    const animStyle = (anim, offsetY = 20) => ({
        opacity: anim,
        transform: [{
            translateY: anim.interpolate({ inputRange: [0, 1], outputRange: [offsetY, 0] }),
        }],
    });

    const AI_TOOLS = [
        { icon: "scan-outline", label: "ATS Score", color: "#4ADE80", badge: null },
        { icon: "briefcase-outline", label: "Job Match", color: "#60A5FA", badge: "New" },
        { icon: "sparkles-outline", label: "AI Bullets", color: "#A78BFA", badge: null },
        { icon: "checkmark-circle-outline", label: "Grammar", color: "#FB923C", badge: null },
    ];

    // 3 template categories — Classic has a real preview, Modern & Creative coming soon
    const TEMPLATES = [
        { name: "Classic", tag: "ATS Friendly", color: "#60A5FA", templateId: "classic-clean" },
        { name: "Modern", tag: "Coming Soon", color: "#4ADE80", templateId: null },
        { name: "Creative", tag: "Coming Soon", color: "#A78BFA", templateId: null },
    ];

    return (
        <View style={styles.root}>
            {/* Background */}
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
                            <Text style={styles.userName}>{user.name} 👋</Text>
                        </View>
                    </View>
                    <Avatar
                        name={user.name}
                        onPress={() => router.push("/(tabs)/profile")}
                    />
                </Animated.View>

                {/* ── Resume Card ── */}
                <Animated.View style={animStyle(cardAnim)}>
                    <ResumeCard
                        resume={resume}
                        onPress={() => router.push("/(drawer)/(tabs)/builder")}
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
                        {AI_TOOLS.map((tool) => (
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

                {/* ── Recent Resumes (returning users only) ── */}
                {recentResumes.length > 0 && (
                    <Animated.View style={animStyle(recentAnim)}>
                        <SectionTitle
                            title="Recent Resumes"
                            actionLabel="See all"
                            onAction={() => router.push("/(drawer)/saved-resumes")}
                        />
                        <View style={styles.recentResumesWrap}>
                            {recentResumes.map((r) => (
                                <RecentResumeRow
                                    key={r.id}
                                    resume={r}
                                    onPress={() => router.push("/(drawer)/(tabs)/builder")}
                                />
                            ))}
                        </View>
                    </Animated.View>
                )}

                {/* ── Templates Teaser ── */}
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
                        {TEMPLATES.map((t) => (
                            <TemplateCard
                                key={t.name}
                                name={t.name}
                                tag={t.tag}
                                color={t.color}
                                templateId={t.templateId}
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
    root: {
        flex: 1,
        backgroundColor: theme.colors.bgRoot,
    },
    bgBase: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.colors.bgBase,
    },
    glowA: {
        position: "absolute",
        left: -100,
        top: -80,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: theme.colors.accentGreenGlow,
        opacity: 0.1,
    },
    glowB: {
        position: "absolute",
        right: -120,
        bottom: 200,
        width: 350,
        height: 350,
        borderRadius: 175,
        backgroundColor: theme.colors.accentTealGlow,
        opacity: 0.07,
    },
    vignette: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.colors.vignette,
        opacity: 0.3,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: theme.spacing["3xl"],
        paddingTop: theme.spacing.xl,
        paddingBottom: theme.spacing["5xl"],
        gap: theme.spacing["3xl"],
    },

    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: Platform.OS === "android" ? 8 : 0,
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.md,
    },
    menuBtn: {
        width: 38,
        height: 38,
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
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: "rgba(74,222,128,0.15)",
        borderWidth: 1.5,
        borderColor: "rgba(74,222,128,0.35)",
        alignItems: "center",
        justifyContent: "center",
    },
    avatarText: {
        fontSize: 16,
        fontWeight: "800",
        color: theme.colors.accentGreen,
    },

    // Resume Card
    resumeCard: {
        backgroundColor: theme.colors.cardBg04,
        borderRadius: theme.radii.lg,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
        overflow: "hidden",
    },
    resumeCardEmpty: {
        alignItems: "center",
        padding: theme.spacing["3xl"],
        gap: theme.spacing.md,
    },
    resumeCardIconWrap: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: "rgba(74,222,128,0.1)",
        borderWidth: 1,
        borderColor: "rgba(74,222,128,0.2)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: theme.spacing.xs,
    },
    resumeCardEmptyTitle: {
        fontSize: theme.typography.lg,
        fontWeight: "700",
        color: theme.colors.white,
        textAlign: "center",
    },
    resumeCardEmptySub: {
        fontSize: theme.typography.md,
        color: theme.colors.textWhite45,
        textAlign: "center",
        lineHeight: 20,
        letterSpacing: theme.typography.letterSpacingMd,
    },
    resumeCardBtn: {
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
    resumeCardBtnText: {
        fontSize: theme.typography.base,
        fontWeight: "700",
        color: theme.colors.bgRoot,
        letterSpacing: theme.typography.letterSpacingXl,
    },
    resumeCardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.md,
        padding: theme.spacing["2xl"],
        paddingBottom: theme.spacing.md,
    },
    resumeCardIconSmall: {
        width: 38,
        height: 38,
        borderRadius: theme.radii.sm,
        backgroundColor: "rgba(74,222,128,0.1)",
        alignItems: "center",
        justifyContent: "center",
    },
    resumeCardMeta: {
        flex: 1,
    },
    resumeCardTitle: {
        fontSize: theme.typography.base,
        fontWeight: "700",
        color: theme.colors.white,
        letterSpacing: theme.typography.letterSpacingMd,
    },
    resumeCardSub: {
        fontSize: theme.typography.sm,
        color: theme.colors.textWhite40,
        marginTop: 2,
    },
    progressBarWrap: {
        paddingHorizontal: theme.spacing["2xl"],
        gap: 6,
    },
    progressBarBg: {
        height: 5,
        borderRadius: 3,
        backgroundColor: "rgba(255,255,255,0.07)",
        overflow: "hidden",
    },
    progressBarFill: {
        height: "100%",
        borderRadius: 3,
        backgroundColor: theme.colors.accentGreen,
    },
    progressText: {
        fontSize: theme.typography.xs,
        color: theme.colors.textWhite40,
        letterSpacing: theme.typography.letterSpacingMd,
    },
    resumeCardFooter: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: theme.spacing["2xl"],
        paddingTop: theme.spacing.md,
    },
    continueBtnWrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    continueBtn: {
        fontSize: theme.typography.md,
        fontWeight: "700",
        color: theme.colors.accentGreen,
        letterSpacing: theme.typography.letterSpacingMd,
    },
    newResumeBtnSmall: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingVertical: 6,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.radii.sm,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
    },
    newResumeBtnSmallText: {
        fontSize: theme.typography.sm,
        color: theme.colors.textWhite40,
    },

    // Section title
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

    // AI Tools
    aiToolsRow: {
        gap: theme.spacing.md,
        paddingRight: theme.spacing.md,
    },
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
        width: 44,
        height: 44,
        borderRadius: theme.radii.sm,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 2,
    },
    aiToolLabel: {
        fontSize: 11,
        fontWeight: "600",
        color: theme.colors.textWhite60,
        textAlign: "center",
        letterSpacing: 0.1,
    },
    aiBadge: {
        position: "absolute",
        top: 8,
        right: 8,
        backgroundColor: theme.colors.accentGreen,
        borderRadius: 6,
        paddingHorizontal: 5,
        paddingVertical: 1,
    },
    aiBadgeText: {
        fontSize: 8,
        fontWeight: "800",
        color: theme.colors.bgRoot,
        letterSpacing: 0.2,
    },

    // Quick Actions
    quickActionsRow: {
        flexDirection: "row",
        gap: theme.spacing.md,
    },
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
        fontSize: 11,
        fontWeight: "600",
        color: theme.colors.textWhite60,
        letterSpacing: 0.1,
    },

    // Recent Resumes
    recentResumesWrap: {
        gap: theme.spacing.xs,
    },
    recentResumeRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.md,
        backgroundColor: theme.colors.cardBg04,
        borderRadius: theme.radii.md,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
        padding: theme.spacing.lg,
    },
    recentResumeIcon: {
        width: 36,
        height: 36,
        borderRadius: theme.radii.sm,
        backgroundColor: "rgba(74,222,128,0.1)",
        alignItems: "center",
        justifyContent: "center",
    },
    recentResumeMeta: {
        flex: 1,
    },
    recentResumeTitle: {
        fontSize: theme.typography.md,
        fontWeight: "600",
        color: theme.colors.white,
    },
    recentResumeSub: {
        fontSize: theme.typography.sm,
        color: theme.colors.textWhite40,
        marginTop: 2,
    },
    recentResumeScore: {
        fontSize: theme.typography.md,
        fontWeight: "700",
    },

    // Templates
    templatesRow: {
        gap: theme.spacing.md,
        paddingRight: theme.spacing.md,
    },
    templateCard: {
        width: 130,
        backgroundColor: theme.colors.cardBg04,
        borderRadius: theme.radii.md,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
        padding: theme.spacing.md,
        gap: theme.spacing.xs,
    },
    templatePreview: {
        width: "100%",
        height: 155,
        borderRadius: theme.radii.sm,
        overflow: "hidden",
        backgroundColor: "#ffffff",
        marginBottom: 4,
    },
    templateWebView: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    templateComingSoon: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
    },
    templateComingSoonText: {
        fontSize: 10,
        fontWeight: "700",
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
    },
    templateTagText: {
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 0.2,
    },

    bottomSpacer: {
        height: theme.spacing["3xl"],
    },
});