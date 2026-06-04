import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { getTemplate } from "../../../../constants/resumeTemplates";
import { theme } from "../../../../constants/theme";
import { useResumeStore } from "../../../../store/resumeStore";

// ─── Customization Options ────────────────────────────────────────────────────

const THEME_COLORS = [
    { label: "Midnight Blue", value: "#1E3A5F" },
    { label: "Ocean Blue",    value: "#2563EB" },
    { label: "Charcoal",      value: "#374151" },
    { label: "Deep Purple",   value: "#6D28D9" },
    { label: "Forest Green",  value: "#065F46" },
    { label: "Crimson",       value: "#991B1B" },
];

const FONT_OPTIONS = [
    { label: "Sans",  value: "sans",  display: "Aa", family: "Arial, Helvetica, sans-serif" },
    { label: "Serif", value: "serif", display: "Aa", family: "Georgia, Times New Roman, serif" },
    { label: "Mono",  value: "mono",  display: "Aa", family: "Courier New, monospace" },
];

const SIZE_OPTIONS = [
    { label: "S", value: "small",  scale: "0.92" },
    { label: "M", value: "medium", scale: "1.00" },
    { label: "L", value: "large",  scale: "1.08" },
];

// Classic templates don't support color/font customization
const CLASSIC_TEMPLATES = ["classic-clean", "classic-bold", "classic-pro", "classic-compact", "classic-ats"];

// ─── Inject font + size overrides into HTML ───────────────────────────────────
function injectCustomization(html, fontFamily, fontSize) {
    const injection = `
    <style>
      body {
        font-family: ${fontFamily} !important;
        font-size: calc(11px * ${fontSize}) !important;
      }
    </style>`;
    return html.replace("</head>", `${injection}</head>`);
}

export default function PreviewScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { activeResume, updateMeta } = useResumeStore();

    const templateId  = activeResume?.meta?.templateId  || "classic-clean";
    const themeColor  = activeResume?.meta?.themeColor  || "#1E3A5F";
    const fontFamily  = activeResume?.meta?.fontFamily  || "sans";
    const fontSize    = activeResume?.meta?.fontSize    || "medium";

    const isClassic = CLASSIC_TEMPLATES.includes(templateId);

    const selectedFont = FONT_OPTIONS.find(f => f.value === fontFamily) || FONT_OPTIONS[0];
    const selectedSize = SIZE_OPTIONS.find(s => s.value === fontSize)   || SIZE_OPTIONS[1];

    // Build HTML
    const rawHtml = getTemplate(templateId, activeResume, themeColor);
    const html    = isClassic ? rawHtml : injectCustomization(rawHtml, selectedFont.family, selectedSize.scale);

    const [webLoading, setWebLoading]   = useState(true);
    const [exporting, setExporting]     = useState(false);
    const [panelOpen, setPanelOpen]     = useState(false);
    const fadeAnim  = useRef(new Animated.Value(0)).current;
    const panelAnim = useRef(new Animated.Value(0)).current;

    const onWebLoaded = () => {
        setWebLoading(false);
        Animated.timing(fadeAnim, { toValue: 1, duration: 400, useNativeDriver: true }).start();
    };

    const togglePanel = () => {
        const toValue = panelOpen ? 0 : 1;
        setPanelOpen(!panelOpen);
        Animated.spring(panelAnim, { toValue, tension: 65, friction: 11, useNativeDriver: true }).start();
    };

    const handleColor = (value) => {
        updateMeta({ themeColor: value });
    };

    const handleFont = (value) => {
        updateMeta({ fontFamily: value });
    };

    const handleSize = (value) => {
        updateMeta({ fontSize: value });
    };

    const handleExportPDF = async () => {
        try {
            setExporting(true);
            const { uri } = await Print.printToFileAsync({ html, base64: false });
            await Sharing.shareAsync(uri, {
                mimeType: "application/pdf",
                dialogTitle: "Save or Share your Resume",
                UTI: "com.adobe.pdf",
            });
        } catch (e) {
            console.error("PDF export error:", e);
        } finally {
            setExporting(false);
        }
    };

    const panelTranslate = panelAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [180, 0],
    });

    return (
        <View style={[styles.root, { paddingTop: insets.top }]}>

            {/* ── Top Bar ── */}
            <View style={styles.topBar}>
                <Pressable onPress={() => router.back()} style={styles.iconBtn} hitSlop={12}>
                    <Ionicons name="chevron-back" size={20} color={theme.colors.white} />
                </Pressable>
                <Text style={styles.topTitle}>Resume Preview</Text>
                <Pressable onPress={handleExportPDF} style={styles.exportBtn} disabled={exporting}>
                    {exporting
                        ? <ActivityIndicator size="small" color={theme.colors.bgRoot} />
                        : <>
                            <Ionicons name="download-outline" size={15} color={theme.colors.bgRoot} />
                            <Text style={styles.exportBtnText}>Export PDF</Text>
                          </>
                    }
                </Pressable>
            </View>

            {/* ── WebView ── */}
            <View style={styles.webContainer}>
                {webLoading && (
                    <View style={styles.loadingWrap}>
                        <ActivityIndicator size="large" color={theme.colors.accentGreen} />
                        <Text style={styles.loadingText}>Rendering resume…</Text>
                    </View>
                )}
                <Animated.View style={[styles.webWrap, { opacity: fadeAnim }]}>
                    <WebView
                        source={{ html }}
                        style={styles.webView}
                        onLoad={onWebLoaded}
                        scrollEnabled
                        showsVerticalScrollIndicator={false}
                        originWhitelist={["*"]}
                        key={`${templateId}-${themeColor}-${fontFamily}-${fontSize}`}
                    />
                </Animated.View>
            </View>

            {/* ── Customization Panel (slides up) ── */}
            {!isClassic && (
                <Animated.View style={[
                    styles.customPanel,
                    { transform: [{ translateY: panelTranslate }],
                      opacity: panelAnim,
                      paddingBottom: panelOpen ? 12 : 0 }
                ]}>
                    {panelOpen && (
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={styles.panelScroll}
                        >
                            {/* ── Color Row ── */}
                            <Text style={styles.panelLabel}>COLOUR</Text>
                            <View style={styles.colorRow}>
                                {THEME_COLORS.map(c => {
                                    const active = themeColor === c.value;
                                    return (
                                        <Pressable
                                            key={c.value}
                                            onPress={() => handleColor(c.value)}
                                            style={[
                                                styles.colorSwatch,
                                                { backgroundColor: c.value },
                                                active && styles.colorSwatchActive,
                                            ]}
                                        >
                                            {active && (
                                                <Ionicons name="checkmark" size={13} color="#fff" />
                                            )}
                                        </Pressable>
                                    );
                                })}
                            </View>

                            {/* ── Divider ── */}
                            <View style={styles.panelDivider} />

                            {/* ── Font + Size Row ── */}
                            <View style={styles.fontSizeRow}>
                                {/* Font */}
                                <View style={styles.fontSizeBlock}>
                                    <Text style={styles.panelLabel}>FONT</Text>
                                    <View style={styles.pillRow}>
                                        {FONT_OPTIONS.map(f => {
                                            const active = fontFamily === f.value;
                                            return (
                                                <Pressable
                                                    key={f.value}
                                                    onPress={() => handleFont(f.value)}
                                                    style={[styles.pill, active && styles.pillActive]}
                                                >
                                                    <Text style={[
                                                        styles.pillText,
                                                        { fontFamily: f.value === "serif" ? "Georgia" : f.value === "mono" ? "Courier New" : undefined },
                                                        active && styles.pillTextActive,
                                                    ]}>
                                                        {f.display}
                                                    </Text>
                                                    <Text style={[styles.pillLabel, active && styles.pillLabelActive]}>
                                                        {f.label}
                                                    </Text>
                                                </Pressable>
                                            );
                                        })}
                                    </View>
                                </View>

                                {/* Vertical separator */}
                                <View style={styles.verticalDivider} />

                                {/* Size */}
                                <View style={styles.fontSizeBlock}>
                                    <Text style={styles.panelLabel}>SIZE</Text>
                                    <View style={styles.pillRow}>
                                        {SIZE_OPTIONS.map(s => {
                                            const active = fontSize === s.value;
                                            return (
                                                <Pressable
                                                    key={s.value}
                                                    onPress={() => handleSize(s.value)}
                                                    style={[styles.pill, active && styles.pillActive]}
                                                >
                                                    <Text style={[
                                                        styles.sizeLetter,
                                                        active && styles.sizeLetterActive,
                                                    ]}>
                                                        {s.label}
                                                    </Text>
                                                </Pressable>
                                            );
                                        })}
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    )}
                </Animated.View>
            )}

            {/* ── Bottom Bar ── */}
            <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 8 }]}>

                {/* Change Template */}
                <Pressable
                    style={styles.templateBtn}
                    onPress={() => router.push("/templates")}
                >
                    <Ionicons name="color-palette-outline" size={15} color={theme.colors.accentGreen} />
                    <Text style={styles.templateBtnText}>Template</Text>
                </Pressable>

                {/* Customise — only for non-classic */}
                {!isClassic && (
                    <Pressable
                        style={[styles.customBtn, panelOpen && styles.customBtnActive]}
                        onPress={togglePanel}
                    >
                        <Ionicons
                            name={panelOpen ? "chevron-down" : "options-outline"}
                            size={15}
                            color={panelOpen ? theme.colors.bgRoot : theme.colors.accentGreen}
                        />
                        <Text style={[styles.customBtnText, panelOpen && styles.customBtnTextActive]}>
                            Customise
                        </Text>
                    </Pressable>
                )}

                {/* Share / Save PDF */}
                <Pressable
                    style={styles.pdfBtn}
                    onPress={handleExportPDF}
                    disabled={exporting}
                >
                    {exporting
                        ? <ActivityIndicator size="small" color={theme.colors.bgRoot} />
                        : <>
                            <Ionicons name="share-outline" size={15} color={theme.colors.bgRoot} />
                            <Text style={styles.pdfBtnText}>Share PDF</Text>
                          </>
                    }
                </Pressable>
            </View>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: theme.colors.bgRoot,
    },

    // ── Top Bar ──
    topBar: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: theme.spacing["3xl"],
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.cardBorder07,
        backgroundColor: theme.colors.bgRoot,
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: theme.radii.sm,
        backgroundColor: theme.colors.cardBg04,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
        alignItems: "center",
        justifyContent: "center",
    },
    topTitle: {
        fontSize: theme.typography.lg,
        fontWeight: "800",
        color: theme.colors.white,
        letterSpacing: theme.typography.letterSpacingMd,
    },
    exportBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingVertical: 8,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.radii.sm,
        backgroundColor: theme.colors.accentGreen,
    },
    exportBtnText: {
        fontSize: theme.typography.sm,
        fontWeight: "700",
        color: theme.colors.bgRoot,
    },

    // ── WebView ──
    webContainer: {
        flex: 1,
        backgroundColor: "#e5e5e5",
    },
    loadingWrap: {
        ...StyleSheet.absoluteFillObject,
        alignItems: "center",
        justifyContent: "center",
        gap: 12,
        zIndex: 10,
        backgroundColor: theme.colors.bgRoot,
    },
    loadingText: {
        fontSize: theme.typography.md,
        color: theme.colors.textWhite40,
    },
    webWrap: { flex: 1 },
    webView: {
        flex: 1,
        backgroundColor: "#e5e5e5",
    },

    // ── Customisation Panel ──
    customPanel: {
        backgroundColor: theme.colors.bgBase,
        borderTopWidth: 1,
        borderTopColor: theme.colors.cardBorder07,
        overflow: "hidden",
    },
    panelScroll: {
        paddingHorizontal: theme.spacing["3xl"],
        paddingTop: theme.spacing.lg,
        paddingBottom: theme.spacing.sm,
    },
    panelLabel: {
        fontSize: 10,
        fontWeight: "700",
        letterSpacing: 1.5,
        color: theme.colors.textWhite30,
        marginBottom: theme.spacing.xs,
    },
    panelDivider: {
        height: 1,
        backgroundColor: theme.colors.cardBorder07,
        marginVertical: theme.spacing.md,
    },

    // Color swatches
    colorRow: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    colorSwatch: {
        width: 30,
        height: 30,
        borderRadius: theme.radii.round,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "transparent",
    },
    colorSwatchActive: {
        borderColor: theme.colors.white,
        shadowColor: theme.colors.white,
        shadowOpacity: 0.25,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 0 },
        elevation: 4,
    },

    // Font + Size row
    fontSizeRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 0,
    },
    fontSizeBlock: {
        flex: 1,
    },
    verticalDivider: {
        width: 1,
        backgroundColor: theme.colors.cardBorder07,
        marginHorizontal: theme.spacing.md,
        alignSelf: "stretch",
    },
    pillRow: {
        flexDirection: "row",
        gap: 8,
    },
    pill: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: theme.radii.sm,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
        backgroundColor: theme.colors.cardBg04,
        gap: 2,
    },
    pillActive: {
        backgroundColor: theme.colors.accentGreen,
        borderColor: theme.colors.accentGreen,
    },
    pillText: {
        fontSize: 14,
        fontWeight: "700",
        color: theme.colors.textWhite55,
    },
    pillTextActive: {
        color: theme.colors.bgRoot,
    },
    pillLabel: {
        fontSize: 9,
        fontWeight: "600",
        color: theme.colors.textWhite30,
        letterSpacing: 0.5,
    },
    pillLabelActive: {
        color: theme.colors.bgRoot,
    },
    sizeLetter: {
        fontSize: 15,
        fontWeight: "800",
        color: theme.colors.textWhite55,
        paddingHorizontal: 4,
    },
    sizeLetterActive: {
        color: theme.colors.bgRoot,
    },

    // ── Bottom Bar ──
    bottomBar: {
        flexDirection: "row",
        gap: theme.spacing.sm,
        paddingHorizontal: theme.spacing["3xl"],
        paddingTop: theme.spacing.md,
        borderTopWidth: 1,
        borderTopColor: theme.colors.cardBorder07,
        backgroundColor: theme.colors.bgRoot,
    },
    templateBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        height: 46,
        borderRadius: theme.radii.md,
        borderWidth: 1,
        borderColor: theme.colors.inputFocusBorder45,
        backgroundColor: theme.colors.cardBg04,
    },
    templateBtnText: {
        fontSize: theme.typography.sm,
        fontWeight: "700",
        color: theme.colors.accentGreen,
    },
    customBtn: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        height: 46,
        borderRadius: theme.radii.md,
        borderWidth: 1,
        borderColor: theme.colors.inputFocusBorder45,
        backgroundColor: theme.colors.cardBg04,
    },
    customBtnActive: {
        backgroundColor: theme.colors.accentGreen,
        borderColor: theme.colors.accentGreen,
    },
    customBtnText: {
        fontSize: theme.typography.sm,
        fontWeight: "700",
        color: theme.colors.accentGreen,
    },
    customBtnTextActive: {
        color: theme.colors.bgRoot,
    },
    pdfBtn: {
        flex: 1.4,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 5,
        height: 46,
        borderRadius: theme.radii.md,
        backgroundColor: theme.colors.accentGreen,
        ...theme.shadows.greenButtonCompact,
    },
    pdfBtnText: {
        fontSize: theme.typography.sm,
        fontWeight: "700",
        color: theme.colors.bgRoot,
        letterSpacing: theme.typography.letterSpacingMd,
    },
});