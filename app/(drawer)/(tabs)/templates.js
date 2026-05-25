import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Modal,
    Pressable,
    StatusBar,
    StyleSheet,
    Text,
    View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { getTemplate } from "../../../constants/resumeTemplates";
import { theme } from "../../../constants/theme";
import { saveActiveResumeToBackend } from "../../../services/resumeSyncService";
import { useResumeStore } from "../../../store/resumeStore";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = (SCREEN_WIDTH - 48 - 12) / 2;
const CARD_HEIGHT = CARD_WIDTH * 1.41;

// ─── Sample Resume Data ───────────────────────────────────────────────────────
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
        summary: "Passionate software engineer with 4+ years building scalable web and mobile applications. Strong background in full-stack development, cloud infrastructure, and agile methodologies.",
    },
    experience: [
        {
            id: "1", company: "Google", role: "Software Engineer",
            location: "New York", startDate: "2022", endDate: "",
            current: true,
            description: "Built scalable REST APIs serving 10M+ users\nLed a team of 5 engineers on core platform\nReduced load time by 40% through optimization",
        },
        {
            id: "2", company: "Startup Inc", role: "Junior Developer",
            location: "Remote", startDate: "2020", endDate: "2022",
            current: false,
            description: "Developed React Native mobile app with 50K downloads\nIntegrated third-party payment systems",
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
        { id: "7", name: "TypeScript" }, { id: "8", name: "GraphQL" },
    ],
    projects: [
        {
            id: "1", title: "CVPilot App", role: "Lead Developer",
            technologies: "React Native, Node.js, MongoDB",
            startDate: "2024", endDate: "", current: true,
            description: "AI-powered resume builder for Android and iOS\nBuilt full backend API with JWT authentication",
            url: "github.com/john/cvpilot",
        },
    ],
    certifications: [
        { id: "1", name: "AWS Solutions Architect", issuer: "Amazon", issueDate: "2023" },
        { id: "2", name: "Google Cloud Professional", issuer: "Google", issueDate: "2022" },
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

// ─── Template Definitions ─────────────────────────────────────────────────────
const CATEGORIES = ["Classic", "Modern", "Creative"];

const TEMPLATES = [
    // Classic
    {
        id: "classic-clean", category: "Classic", name: "Classic Clean",
        description: "Left-aligned, grey headers, 2-col skills",
        tag: "ATS Friendly",
    },
    {
        id: "classic-bold", category: "Classic", name: "Classic Bold",
        description: "Centered name, bold caps, full divider",
        tag: "Professional",
    },
    {
        id: "classic-pro", category: "Classic", name: "Classic Pro",
        description: "Inline company+role, pipe skills, dashes",
        tag: "Clean",
    },
    {
        id: "classic-compact", category: "Classic", name: "Classic Compact",
        description: "Dense layout, icon contacts, fits more",
        tag: "Compact",
    },
    {
        id: "classic-ats", category: "Classic", name: "Classic ATS",
        description: "Ultra-minimal, zero design, max ATS score",
        tag: "Max ATS",
    },
    // Modern (coming soon)
    {
        id: "modern-sidebar", category: "Modern", name: "Modern Sidebar",
        description: "Two-column, color sidebar, photo ready",
        tag: "Coming Soon", comingSoon: true,
    },
    {
        id: "modern-top", category: "Modern", name: "Modern Top",
        description: "Bold color header band, single column",
        tag: "Coming Soon", comingSoon: true,
    },
    {
        id: "modern-card", category: "Modern", name: "Modern Card",
        description: "Sections in subtle cards, clean spacing",
        tag: "Coming Soon", comingSoon: true,
    },
    {
        id: "modern-minimal", category: "Modern", name: "Modern Minimal",
        description: "Lots of whitespace, elegant typography",
        tag: "Coming Soon", comingSoon: true,
    },
    {
        id: "modern-bold", category: "Modern", name: "Modern Bold",
        description: "Strong color accents, section icons",
        tag: "Coming Soon", comingSoon: true,
    },
    // Creative (coming soon)
    {
        id: "creative-splash", category: "Creative", name: "Creative Splash",
        description: "Full color header, bold personality",
        tag: "Coming Soon", comingSoon: true,
    },
    {
        id: "creative-timeline", category: "Creative", name: "Creative Timeline",
        description: "Timeline-style experience section",
        tag: "Coming Soon", comingSoon: true,
    },
    {
        id: "creative-grid", category: "Creative", name: "Creative Grid",
        description: "Grid-based skills, two-column layout",
        tag: "Coming Soon", comingSoon: true,
    },
    {
        id: "creative-dark", category: "Creative", name: "Creative Dark",
        description: "Dark header background, light body",
        tag: "Coming Soon", comingSoon: true,
    },
    {
        id: "creative-portfolio", category: "Creative", name: "Creative Portfolio",
        description: "Portfolio-style, project-first layout",
        tag: "Coming Soon", comingSoon: true,
    },
];

// ─── Mini Preview Card ────────────────────────────────────────────────────────
function TemplateCard({ template, isSelected, isActive, onPress }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const html = template.comingSoon ? "" : getTemplate(template.id, sampleResume);

    const handlePress = () => {
        Animated.sequence([
            Animated.timing(scaleAnim, { toValue: 0.96, duration: 80, useNativeDriver: true }),
            Animated.timing(scaleAnim, { toValue: 1, duration: 80, useNativeDriver: true }),
        ]).start();
        onPress(template);
    };

    return (
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Pressable onPress={handlePress} style={[
                styles.card,
                isSelected && styles.cardSelected,
            ]}>
                {/* Mini WebView or Coming Soon */}
                <View style={styles.cardPreview}>
                    {template.comingSoon ? (
                        <View style={styles.comingSoonBox}>
                            <Ionicons name="time-outline" size={22} color={theme.colors.textWhite30} />
                            <Text style={styles.comingSoonText}>Coming Soon</Text>
                        </View>
                    ) : (
                        <WebView
                            source={{ html }}
                            style={styles.miniWebView}
                            scrollEnabled={false}
                            pointerEvents="none"
                            showsVerticalScrollIndicator={false}
                            originWhitelist={["*"]}
                            scalesPageToFit={true}
                        />
                    )}

                    {/* Active badge */}
                    {isActive && (
                        <View style={styles.activeBadge}>
                            <Ionicons name="checkmark-circle" size={16} color={theme.colors.accentGreen} />
                        </View>
                    )}

                    {/* Tag pill */}
                    <View style={[
                        styles.tagPill,
                        template.comingSoon && styles.tagPillDim,
                    ]}>
                        <Text style={styles.tagText}>{template.tag}</Text>
                    </View>
                </View>

                {/* Card Info */}
                <View style={styles.cardInfo}>
                    <Text style={styles.cardName} numberOfLines={1}>{template.name}</Text>
                    <Text style={styles.cardDesc} numberOfLines={2}>{template.description}</Text>
                </View>

                {/* Selected border overlay */}
                {isSelected && <View style={styles.selectedOverlay} />}
            </Pressable>
        </Animated.View>
    );
}

// ─── Full Preview Modal ───────────────────────────────────────────────────────
function PreviewModal({ template, visible, onClose, onUse, isActive }) {
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(true);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(60)).current;

    const html = template ? getTemplate(template.id, sampleResume) : "";

    useEffect(() => {
        if (visible) {
            setLoading(true);
            fadeAnim.setValue(0);
            slideAnim.setValue(60);
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
                Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 10, useNativeDriver: true }),
            ]).start();
        }
    }, [visible]);

    const onLoaded = () => {
        setLoading(false);
    };

    if (!template) return null;

    return (
        <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <Animated.View style={[
                    styles.modalContainer,
                    { paddingBottom: insets.bottom + 16 },
                    { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                ]}>
                    {/* Modal Header */}
                    <View style={styles.modalHeader}>
                        <Pressable onPress={onClose} style={styles.modalCloseBtn} hitSlop={12}>
                            <Ionicons name="close" size={20} color={theme.colors.white} />
                        </Pressable>
                        <View style={styles.modalTitleWrap}>
                            <Text style={styles.modalTitle}>{template.name}</Text>
                            <Text style={styles.modalSubtitle}>{template.description}</Text>
                        </View>
                        <View style={[styles.modalTagPill]}>
                            <Text style={styles.modalTagText}>{template.tag}</Text>
                        </View>
                    </View>

                    {/* WebView Preview */}
                    <View style={styles.modalWebWrap}>
                        {loading && (
                            <View style={styles.modalLoading}>
                                <Animated.View style={{ opacity: fadeAnim }}>
                                    <Ionicons name="document-text-outline" size={32} color={theme.colors.accentGreen} />
                                </Animated.View>
                                <Text style={styles.modalLoadingText}>Rendering preview…</Text>
                            </View>
                        )}
                        <WebView
                            source={{ html }}
                            style={styles.modalWebView}
                            onLoad={onLoaded}
                            scrollEnabled
                            showsVerticalScrollIndicator={false}
                            originWhitelist={["*"]}
                        />
                    </View>

                    {/* Use Button */}
                    <View style={styles.modalFooter}>
                        {isActive ? (
                            <View style={styles.activeTemplateBanner}>
                                <Ionicons name="checkmark-circle" size={18} color={theme.colors.accentGreen} />
                                <Text style={styles.activeTemplateText}>Currently Active Template</Text>
                            </View>
                        ) : (
                            <Pressable style={styles.useBtn} onPress={() => onUse(template)}>
                                <Ionicons name="checkmark-outline" size={18} color={theme.colors.bgRoot} />
                                <Text style={styles.useBtnText}>Use This Template</Text>
                            </Pressable>
                        )}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function TemplatesScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { activeResume, updateMeta, markSaved } = useResumeStore();

    const [activeCategory, setActiveCategory] = useState("Classic");
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [previewTemplate, setPreviewTemplate] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [successVisible, setSuccessVisible] = useState(false);
    const successAnim = useRef(new Animated.Value(0)).current;

    const currentTemplateId = activeResume?.meta?.templateId || "classic-clean";

    const filtered = TEMPLATES.filter(t => t.category === activeCategory);

    const handleCardPress = (template) => {
        if (template.comingSoon) return;
        setPreviewTemplate(template);
        setModalVisible(true);
    };

    const handleUseTemplate = (template) => {
        setModalVisible(false);
        updateMeta({ templateId: template.id });
        markSaved();
        saveActiveResumeToBackend();

        // Show success toast
        successAnim.setValue(0);
        setSuccessVisible(true);
        Animated.sequence([
            Animated.spring(successAnim, { toValue: 1, tension: 65, friction: 10, useNativeDriver: true }),
            Animated.delay(1800),
            Animated.timing(successAnim, { toValue: 0, duration: 250, useNativeDriver: true }),
        ]).start(() => setSuccessVisible(false));
    };

    return (
        <View style={[styles.root, { paddingTop: insets.top }]}>
            <StatusBar barStyle="light-content" />

            {/* ── Header ── */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Resume Templates</Text>
                    <Text style={styles.headerSub}>Tap any template to preview</Text>
                </View>
                <Pressable
                    style={styles.previewBtn}
                    onPress={() => router.push("/(drawer)/(tabs)/builder/preview")}
                >
                    <Ionicons name="eye-outline" size={15} color={theme.colors.accentGreen} />
                    <Text style={styles.previewBtnText}>My Resume</Text>
                </Pressable>
            </View>

            {/* ── Active Template Banner ── */}
            <View style={styles.activeBanner}>
                <View style={styles.activeBannerLeft}>
                    <View style={styles.activeDot} />
                    <Text style={styles.activeBannerText}>
                        Active: <Text style={styles.activeBannerName}>
                            {TEMPLATES.find(t => t.id === currentTemplateId)?.name || "Classic Clean"}
                        </Text>
                    </Text>
                </View>
                <Ionicons name="checkmark-circle" size={16} color={theme.colors.accentGreen} />
            </View>

            {/* ── Category Tabs ── */}
            <View style={styles.tabsRow}>
                {CATEGORIES.map((cat) => (
                    <Pressable
                        key={cat}
                        style={[styles.tab, activeCategory === cat && styles.tabActive]}
                        onPress={() => setActiveCategory(cat)}
                    >
                        <Text style={[styles.tabText, activeCategory === cat && styles.tabTextActive]}>
                            {cat}
                        </Text>
                        {activeCategory === cat && <View style={styles.tabUnderline} />}
                    </Pressable>
                ))}
            </View>

            {/* ── Category Description ── */}
            <View style={styles.catDescRow}>
                <Text style={styles.catDesc}>
                    {activeCategory === "Classic" && "ATS-optimized layouts for CS, IT & Engineering"}
                    {activeCategory === "Modern" && "Color-accent designs for MBA, BBA & Marketing"}
                    {activeCategory === "Creative" && "Bold layouts for Design, Arts & Media"}
                </Text>
            </View>

            {/* ── Template Grid ── */}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.grid}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => (
                    <TemplateCard
                        template={item}
                        isSelected={previewTemplate?.id === item.id}
                        isActive={currentTemplateId === item.id}
                        onPress={handleCardPress}
                    />
                )}
            />

            {/* ── Preview Modal ── */}
            <PreviewModal
                template={previewTemplate}
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                onUse={handleUseTemplate}
                isActive={previewTemplate?.id === currentTemplateId}
            />

            {/* ── Success Toast ── */}
            {successVisible && (
                <Animated.View style={[
                    styles.toast,
                    { bottom: insets.bottom + 90 },
                    {
                        opacity: successAnim,
                        transform: [{
                            translateY: successAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [20, 0],
                            }),
                        }],
                    },
                ]}>
                    <Ionicons name="checkmark-circle" size={18} color={theme.colors.accentGreen} />
                    <Text style={styles.toastText}>Template applied successfully!</Text>
                </Animated.View>
            )}
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: theme.colors.bgRoot,
        marginTop: -40,
    },

    // Header
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingTop: 16,
        paddingBottom: 12,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: "800",
        color: theme.colors.white,
        letterSpacing: 0.3,
    },
    headerSub: {
        fontSize: 12,
        color: theme.colors.textWhite40,
        marginTop: 2,
    },
    previewBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: theme.radii.sm,
        borderWidth: 1,
        borderColor: theme.colors.inputFocusBorder45,
        backgroundColor: theme.colors.cardBg04,
    },
    previewBtnText: {
        fontSize: 12,
        fontWeight: "700",
        color: theme.colors.accentGreen,
    },

    // Active Banner
    activeBanner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginHorizontal: 20,
        marginBottom: 16,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: theme.radii.sm,
        backgroundColor: "rgba(74,222,128,0.06)",
        borderWidth: 1,
        borderColor: "rgba(74,222,128,0.15)",
    },
    activeBannerLeft: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    activeDot: {
        width: 7,
        height: 7,
        borderRadius: 4,
        backgroundColor: theme.colors.accentGreen,
    },
    activeBannerText: {
        fontSize: 12,
        color: theme.colors.textWhite55,
    },
    activeBannerName: {
        color: theme.colors.accentGreen,
        fontWeight: "700",
    },

    // Category Tabs
    tabsRow: {
        flexDirection: "row",
        paddingHorizontal: 20,
        marginBottom: 4,
        gap: 4,
    },
    tab: {
        flex: 1,
        alignItems: "center",
        paddingVertical: 10,
        position: "relative",
    },
    tabActive: {},
    tabText: {
        fontSize: 13,
        fontWeight: "600",
        color: theme.colors.textWhite40,
    },
    tabTextActive: {
        color: theme.colors.white,
        fontWeight: "800",
    },
    tabUnderline: {
        position: "absolute",
        bottom: 0,
        left: "20%",
        right: "20%",
        height: 2,
        borderRadius: 2,
        backgroundColor: theme.colors.accentGreen,
    },

    // Category description
    catDescRow: {
        paddingHorizontal: 20,
        marginBottom: 14,
    },
    catDesc: {
        fontSize: 11.5,
        color: theme.colors.textWhite40,
    },

    // Grid
    grid: {
        paddingHorizontal: 20,
        paddingBottom: 32,
    },
    row: {
        gap: 12,
        marginBottom: 12,
    },

    // Card
    card: {
        width: CARD_WIDTH,
        borderRadius: theme.radii.md,
        backgroundColor: theme.colors.cardBg04,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
        overflow: "hidden",
    },
    cardSelected: {
        borderColor: theme.colors.accentGreen,
        borderWidth: 1.5,
    },
    cardPreview: {
        width: "100%",
        height: CARD_HEIGHT,
        backgroundColor: "#ffffff",
        overflow: "hidden",
        position: "relative",
    },
    miniWebView: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    comingSoonBox: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f5f5",
        gap: 6,
    },
    comingSoonText: {
        fontSize: 10,
        color: "#999",
        fontWeight: "600",
    },
    activeBadge: {
        position: "absolute",
        top: 7,
        right: 7,
        backgroundColor: theme.colors.bgRoot,
        borderRadius: 10,
        padding: 1,
    },
    tagPill: {
        position: "absolute",
        bottom: 7,
        left: 7,
        backgroundColor: "rgba(74,222,128,0.9)",
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
    },
    tagPillDim: {
        backgroundColor: "rgba(255,255,255,0.15)",
    },
    tagText: {
        fontSize: 8.5,
        fontWeight: "800",
        color: "#050608",
        letterSpacing: 0.3,
    },
    selectedOverlay: {
        ...StyleSheet.absoluteFillObject,
        borderRadius: theme.radii.md,
        borderWidth: 2,
        borderColor: theme.colors.accentGreen,
    },
    cardInfo: {
        padding: 10,
        gap: 3,
    },
    cardName: {
        fontSize: 12,
        fontWeight: "700",
        color: theme.colors.white,
    },
    cardDesc: {
        fontSize: 10,
        color: theme.colors.textWhite40,
        lineHeight: 13,
    },

    // Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.85)",
        justifyContent: "flex-end",
    },
    modalContainer: {
        height: "92%",
        backgroundColor: theme.colors.bgBase,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        overflow: "hidden",
        borderTopWidth: 1,
        borderColor: theme.colors.cardBorder07,
    },
    modalHeader: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.cardBorder07,
        gap: 12,
    },
    modalCloseBtn: {
        width: 34,
        height: 34,
        borderRadius: theme.radii.sm,
        backgroundColor: theme.colors.cardBg04,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
        alignItems: "center",
        justifyContent: "center",
    },
    modalTitleWrap: {
        flex: 1,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: "800",
        color: theme.colors.white,
    },
    modalSubtitle: {
        fontSize: 11,
        color: theme.colors.textWhite40,
        marginTop: 1,
    },
    modalTagPill: {
        backgroundColor: "rgba(74,222,128,0.15)",
        borderRadius: 6,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: "rgba(74,222,128,0.3)",
    },
    modalTagText: {
        fontSize: 10,
        fontWeight: "700",
        color: theme.colors.accentGreen,
    },
    modalWebWrap: {
        flex: 1,
        backgroundColor: "#e5e5e5",
        position: "relative",
    },
    modalLoading: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.colors.bgRoot,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        zIndex: 10,
    },
    modalLoadingText: {
        fontSize: 13,
        color: theme.colors.textWhite40,
    },
    modalWebView: {
        flex: 1,
        backgroundColor: "#ffffff",
    },
    modalFooter: {
        paddingHorizontal: 20,
        paddingTop: 14,
    },
    useBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: 50,
        borderRadius: theme.radii.md,
        backgroundColor: theme.colors.accentGreen,
        ...theme.shadows.greenButtonCompact,
    },
    useBtnText: {
        fontSize: 15,
        fontWeight: "800",
        color: theme.colors.bgRoot,
        letterSpacing: 0.3,
    },
    activeTemplateBanner: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: 50,
        borderRadius: theme.radii.md,
        backgroundColor: "rgba(74,222,128,0.08)",
        borderWidth: 1,
        borderColor: "rgba(74,222,128,0.25)",
    },
    activeTemplateText: {
        fontSize: 14,
        fontWeight: "700",
        color: theme.colors.accentGreen,
    },

    // Toast
    toast: {
        position: "absolute",
        alignSelf: "center",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 50,
        backgroundColor: "rgba(5,6,8,0.95)",
        borderWidth: 1,
        borderColor: "rgba(74,222,128,0.3)",
    },
    toastText: {
        fontSize: 13,
        fontWeight: "600",
        color: theme.colors.white,
    },
});