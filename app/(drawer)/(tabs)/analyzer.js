import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import { useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ENDPOINTS } from "../../../constants/api";
import { theme } from "../../../constants/theme";

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score }) {
    const color =
        score >= 80 ? "#4ADE80" :
        score >= 60 ? "#FBBF24" :
        score >= 40 ? "#F97316" : "#FF3B30";

    const label =
        score >= 80 ? "Excellent" :
        score >= 60 ? "Good" :
        score >= 40 ? "Needs Work" : "Major Issues";

    return (
        <View style={styles.scoreRingWrap}>
            <View style={[styles.scoreRing, { borderColor: color }]}>
                <Text style={[styles.scoreNumber, { color }]}>{score}</Text>
                <Text style={styles.scoreOutOf}>/100</Text>
            </View>
            <Text style={[styles.scoreLabel, { color }]}>{label}</Text>
            <Text style={styles.scoreSubLabel}>ATS Score</Text>
        </View>
    );
}

// ─── Section Card ─────────────────────────────────────────────────────────────
function ResultSection({ icon, iconColor, title, children }) {
    const [expanded, setExpanded] = useState(true);
    return (
        <View style={styles.resultCard}>
            <Pressable style={styles.resultCardHeader} onPress={() => setExpanded(!expanded)}>
                <View style={[styles.resultIconWrap, { backgroundColor: `${iconColor}15` }]}>
                    <Ionicons name={icon} size={16} color={iconColor} />
                </View>
                <Text style={styles.resultCardTitle}>{title}</Text>
                <Ionicons
                    name={expanded ? "chevron-up" : "chevron-down"}
                    size={16}
                    color={theme.colors.textWhite40}
                />
            </Pressable>
            {expanded && <View style={styles.resultCardBody}>{children}</View>}
        </View>
    );
}

// ─── Keyword Chip ─────────────────────────────────────────────────────────────
function KeywordChip({ text, matched }) {
    return (
        <View style={[styles.chip, matched ? styles.chipMatched : styles.chipMissing]}>
            <Ionicons
                name={matched ? "checkmark-circle" : "close-circle"}
                size={11}
                color={matched ? "#4ADE80" : "#FF3B30"}
            />
            <Text style={[styles.chipText, matched ? styles.chipTextMatched : styles.chipTextMissing]}>
                {text}
            </Text>
        </View>
    );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AnalyzerScreen() {
    const insets = useSafeAreaInsets();
    const [selectedFile, setSelectedFile] = useState(null);
    const [jobDescription, setJobDescription] = useState("");
    const [analyzing, setAnalyzing] = useState(false);
    const [analysis, setAnalysis] = useState(null);
    const [error, setError] = useState(null);
    const scrollRef = useRef(null);
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const handlePickPDF = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/pdf",
                copyToCacheDirectory: true,
            });
            if (!result.canceled && result.assets?.[0]) {
                setSelectedFile(result.assets[0]);
                setAnalysis(null);
                setError(null);
            }
        } catch (e) {
            setError("Could not pick file. Please try again.");
        }
    };

    const handleAnalyze = async () => {
        if (!selectedFile) {
            setError("Please upload a resume PDF first.");
            return;
        }

        try {
            setAnalyzing(true);
            setError(null);
            setAnalysis(null);

            // Read PDF as base64
            const base64 = await FileSystem.readAsStringAsync(selectedFile.uri, {
                encoding: "base64",
            });

            // Send to backend
            const response = await fetch(ENDPOINTS.analyze, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    resumePdfBase64: base64,
                    jobDescription: jobDescription.trim() || null,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "Analysis failed");
            }

            setAnalysis(data.analysis);

            // Animate results in
            fadeAnim.setValue(0);
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }).start();

            // Scroll to results
            setTimeout(() => {
                scrollRef.current?.scrollTo({ y: 400, animated: true });
            }, 300);

        } catch (e) {
            setError(e.message || "Something went wrong. Please try again.");
        } finally {
            setAnalyzing(false);
        }
    };

    const handleReset = () => {
        setSelectedFile(null);
        setJobDescription("");
        setAnalysis(null);
        setError(null);
        scrollRef.current?.scrollTo({ y: 0, animated: true });
    };

    return (
        <View style={[styles.root, { paddingTop: insets.top }]}>
            {/* ── Glow ── */}
            <View style={styles.glowA} />

            {/* ── Header ── */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>ATS Analyzer</Text>
                    <Text style={styles.headerSub}>Upload any resume for instant analysis</Text>
                </View>
                {analysis && (
                    <Pressable style={styles.resetBtn} onPress={handleReset}>
                        <Ionicons name="refresh-outline" size={15} color={theme.colors.textWhite55} />
                        <Text style={styles.resetBtnText}>Reset</Text>
                    </Pressable>
                )}
            </View>

            <ScrollView
                ref={scrollRef}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 80 }]}
                keyboardShouldPersistTaps="handled"
            >
                {/* ── Upload Section ── */}
                <View style={styles.uploadSection}>
                    <Pressable
                        style={[styles.uploadBox, selectedFile && styles.uploadBoxDone]}
                        onPress={handlePickPDF}
                    >
                        {selectedFile ? (
                            <>
                                <View style={styles.uploadDoneIcon}>
                                    <Ionicons name="document-text" size={28} color="#4ADE80" />
                                </View>
                                <Text style={styles.uploadDoneTitle} numberOfLines={1}>
                                    {selectedFile.name}
                                </Text>
                                <Text style={styles.uploadDoneSub}>
                                    {selectedFile.size ? `${(selectedFile.size / 1024).toFixed(1)} KB` : "PDF ready"} · Tap to change
                                </Text>
                            </>
                        ) : (
                            <>
                                <View style={styles.uploadIcon}>
                                    <Ionicons name="cloud-upload-outline" size={32} color={theme.colors.accentGreen} />
                                </View>
                                <Text style={styles.uploadTitle}>Upload Resume PDF</Text>
                                <Text style={styles.uploadSub}>Tap to pick any resume from your phone</Text>
                                <View style={styles.uploadFormats}>
                                    <Text style={styles.uploadFormatText}>PDF only</Text>
                                </View>
                            </>
                        )}
                    </Pressable>
                </View>

                {/* ── Job Description ── */}
                <View style={styles.jdSection}>
                    <View style={styles.jdHeader}>
                        <Ionicons name="briefcase-outline" size={15} color={theme.colors.textWhite55} />
                        <Text style={styles.jdTitle}>Job Description</Text>
                        <View style={styles.optionalBadge}>
                            <Text style={styles.optionalText}>Optional</Text>
                        </View>
                    </View>
                    <TextInput
                        style={styles.jdInput}
                        placeholder="Paste the job description here for better keyword matching..."
                        placeholderTextColor={theme.colors.inputPlaceholder}
                        value={jobDescription}
                        onChangeText={setJobDescription}
                        multiline
                        numberOfLines={5}
                        textAlignVertical="top"
                    />
                    {jobDescription.length > 0 && (
                        <Text style={styles.jdCharCount}>{jobDescription.length} characters</Text>
                    )}
                </View>

                {/* ── Error ── */}
                {error && (
                    <View style={styles.errorBox}>
                        <Ionicons name="alert-circle-outline" size={16} color="#FF3B30" />
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                {/* ── Analyze Button ── */}
                <Pressable
                    style={[styles.analyzeBtn, (!selectedFile || analyzing) && styles.analyzeBtnDisabled]}
                    onPress={handleAnalyze}
                    disabled={!selectedFile || analyzing}
                >
                    {analyzing ? (
                        <View style={styles.analyzingRow}>
                            <ActivityIndicator size="small" color={theme.colors.bgRoot} />
                            <Text style={styles.analyzeBtnText}>Analyzing Resume…</Text>
                        </View>
                    ) : (
                        <View style={styles.analyzingRow}>
                            <Ionicons name="analytics-outline" size={18} color={theme.colors.bgRoot} />
                            <Text style={styles.analyzeBtnText}>Analyze Resume</Text>
                        </View>
                    )}
                </Pressable>

                {/* ── Analyzing Loader ── */}
                {analyzing && (
                    <View style={styles.analyzingCard}>
                        <ActivityIndicator size="large" color={theme.colors.accentGreen} />
                        <Text style={styles.analyzingTitle}>AI is analyzing your resume…</Text>
                        <Text style={styles.analyzingSubtitle}>Checking ATS score, keywords, grammar and more</Text>
                    </View>
                )}

                {/* ── Results ── */}
                {analysis && (
                    <Animated.View style={{ opacity: fadeAnim, gap: 12 }}>

                        {/* Score + Verdict */}
                        <View style={styles.scoreCard}>
                            <ScoreRing score={analysis.atsScore} />
                            <View style={styles.verdictWrap}>
                                <Text style={styles.verdictTitle}>{analysis.verdict}</Text>
                                <Text style={styles.verdictMessage}>{analysis.verdictMessage}</Text>
                            </View>
                        </View>

                        {/* Strengths */}
                        {analysis.strengths?.length > 0 && (
                            <ResultSection icon="checkmark-circle-outline" iconColor="#4ADE80" title="Strengths">
                                {analysis.strengths.map((s, i) => (
                                    <View key={i} style={styles.bulletRow}>
                                        <View style={styles.bulletDot} />
                                        <Text style={styles.bulletText}>{s}</Text>
                                    </View>
                                ))}
                            </ResultSection>
                        )}

                        {/* Keywords */}
                        {(analysis.matchedKeywords?.length > 0 || analysis.missingKeywords?.length > 0) && (
                            <ResultSection icon="key-outline" iconColor="#60A5FA" title="Keywords">
                                {analysis.matchedKeywords?.length > 0 && (
                                    <>
                                        <Text style={styles.keywordGroupLabel}>✅ Matched</Text>
                                        <View style={styles.chipsRow}>
                                            {analysis.matchedKeywords.map((k, i) => (
                                                <KeywordChip key={i} text={k} matched />
                                            ))}
                                        </View>
                                    </>
                                )}
                                {analysis.missingKeywords?.length > 0 && (
                                    <>
                                        <Text style={[styles.keywordGroupLabel, { marginTop: 10 }]}>❌ Missing</Text>
                                        <View style={styles.chipsRow}>
                                            {analysis.missingKeywords.map((k, i) => (
                                                <KeywordChip key={i} text={k} matched={false} />
                                            ))}
                                        </View>
                                    </>
                                )}
                            </ResultSection>
                        )}

                        {/* Section Feedback */}
                        {analysis.sectionFeedback && (
                            <ResultSection icon="layers-outline" iconColor="#A78BFA" title="Section Feedback">
                                {Object.entries(analysis.sectionFeedback).map(([section, feedback], i) => (
                                    <View key={i} style={styles.feedbackRow}>
                                        <Text style={styles.feedbackSection}>
                                            {section.charAt(0).toUpperCase() + section.slice(1)}
                                        </Text>
                                        <Text style={styles.feedbackText}>{feedback}</Text>
                                    </View>
                                ))}
                            </ResultSection>
                        )}

                        {/* Grammar Issues */}
                        {analysis.grammarIssues?.length > 0 && (
                            <ResultSection icon="create-outline" iconColor="#FBBF24" title={`Grammar & Phrasing (${analysis.grammarIssues.length} issues)`}>
                                {analysis.grammarIssues.map((issue, i) => (
                                    <View key={i} style={styles.grammarCard}>
                                        <View style={styles.grammarBefore}>
                                            <Text style={styles.grammarLabel}>❌ Original</Text>
                                            <Text style={styles.grammarOriginal}>{issue.original}</Text>
                                        </View>
                                        <View style={styles.grammarArrow}>
                                            <Ionicons name="arrow-down" size={14} color={theme.colors.textWhite30} />
                                        </View>
                                        <View style={styles.grammarAfter}>
                                            <Text style={styles.grammarLabel}>✅ Suggested</Text>
                                            <Text style={styles.grammarSuggestion}>{issue.suggestion}</Text>
                                        </View>
                                        <Text style={styles.grammarReason}>{issue.reason}</Text>
                                    </View>
                                ))}
                            </ResultSection>
                        )}

                        {/* Improvements */}
                        {analysis.improvements?.length > 0 && (
                            <ResultSection icon="trending-up-outline" iconColor="#F97316" title="What to Add / Improve">
                                {analysis.improvements.map((imp, i) => (
                                    <View key={i} style={styles.bulletRow}>
                                        <View style={[styles.bulletDot, { backgroundColor: "#F97316" }]} />
                                        <Text style={styles.bulletText}>{imp}</Text>
                                    </View>
                                ))}
                            </ResultSection>
                        )}

                        {/* What to Remove */}
                        {analysis.whatToRemove?.length > 0 && (
                            <ResultSection icon="trash-outline" iconColor="#FF3B30" title="What to Remove">
                                {analysis.whatToRemove.map((item, i) => (
                                    <View key={i} style={styles.bulletRow}>
                                        <View style={[styles.bulletDot, { backgroundColor: "#FF3B30" }]} />
                                        <Text style={styles.bulletText}>{item}</Text>
                                    </View>
                                ))}
                            </ResultSection>
                        )}

                        {/* Analyze Again */}
                        <Pressable style={styles.analyzeAgainBtn} onPress={handleReset}>
                            <Ionicons name="refresh-outline" size={16} color={theme.colors.accentGreen} />
                            <Text style={styles.analyzeAgainText}>Analyze Another Resume</Text>
                        </Pressable>

                    </Animated.View>
                )}
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
        top: -60, left: -80,
        width: 260, height: 260,
        borderRadius: 130,
        backgroundColor: "#60A5FA",
        opacity: 0.05,
    },
    scroll: {
        paddingHorizontal: 20,
        paddingTop: 8,
        gap: 14,
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
    resetBtn: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
        paddingVertical: 7,
        paddingHorizontal: 12,
        borderRadius: theme.radii.sm,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
        backgroundColor: theme.colors.cardBg04,
    },
    resetBtnText: {
        fontSize: 12,
        fontWeight: "600",
        color: theme.colors.textWhite55,
    },

    // Upload
    uploadSection: { gap: 8 },
    uploadBox: {
        borderWidth: 1.5,
        borderColor: "rgba(74,222,128,0.25)",
        borderStyle: "dashed",
        borderRadius: theme.radii.lg,
        backgroundColor: "rgba(74,222,128,0.03)",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 32,
        paddingHorizontal: 20,
        gap: 8,
    },
    uploadBoxDone: {
        borderStyle: "solid",
        borderColor: "rgba(74,222,128,0.4)",
        backgroundColor: "rgba(74,222,128,0.05)",
    },
    uploadIcon: {
        width: 60, height: 60,
        borderRadius: 30,
        backgroundColor: "rgba(74,222,128,0.08)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 4,
    },
    uploadDoneIcon: {
        width: 56, height: 56,
        borderRadius: 28,
        backgroundColor: "rgba(74,222,128,0.1)",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 4,
    },
    uploadTitle: {
        fontSize: 16,
        fontWeight: "700",
        color: theme.colors.white,
    },
    uploadSub: {
        fontSize: 12,
        color: theme.colors.textWhite40,
        textAlign: "center",
    },
    uploadFormats: {
        marginTop: 4,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: 20,
        backgroundColor: theme.colors.cardBg04,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
    },
    uploadFormatText: {
        fontSize: 10,
        color: theme.colors.textWhite40,
        fontWeight: "600",
    },
    uploadDoneTitle: {
        fontSize: 14,
        fontWeight: "700",
        color: theme.colors.white,
        maxWidth: "80%",
        textAlign: "center",
    },
    uploadDoneSub: {
        fontSize: 11,
        color: theme.colors.textWhite40,
    },

    // Job Description
    jdSection: { gap: 8 },
    jdHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    jdTitle: {
        fontSize: 13,
        fontWeight: "700",
        color: theme.colors.white,
        flex: 1,
    },
    optionalBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 20,
        backgroundColor: theme.colors.cardBg04,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
    },
    optionalText: {
        fontSize: 10,
        color: theme.colors.textWhite40,
        fontWeight: "600",
    },
    jdInput: {
        backgroundColor: theme.colors.inputBg05,
        borderWidth: 1,
        borderColor: theme.colors.inputBorder08,
        borderRadius: theme.radii.md,
        padding: 14,
        fontSize: 13,
        color: theme.colors.white,
        minHeight: 110,
        lineHeight: 20,
    },
    jdCharCount: {
        fontSize: 10,
        color: theme.colors.textWhite30,
        textAlign: "right",
    },

    // Error
    errorBox: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        padding: 12,
        borderRadius: theme.radii.sm,
        backgroundColor: "rgba(255,59,48,0.08)",
        borderWidth: 1,
        borderColor: "rgba(255,59,48,0.2)",
    },
    errorText: {
        fontSize: 13,
        color: "#FF3B30",
        flex: 1,
    },

    // Analyze Button
    analyzeBtn: {
        height: 52,
        borderRadius: theme.radii.md,
        backgroundColor: theme.colors.accentGreen,
        alignItems: "center",
        justifyContent: "center",
        ...theme.shadows.greenButtonCompact,
    },
    analyzeBtnDisabled: {
        opacity: 0.5,
    },
    analyzingRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    analyzeBtnText: {
        fontSize: 15,
        fontWeight: "800",
        color: theme.colors.bgRoot,
        letterSpacing: 0.3,
    },

    // Analyzing Card
    analyzingCard: {
        alignItems: "center",
        paddingVertical: 28,
        gap: 10,
        borderRadius: theme.radii.md,
        backgroundColor: theme.colors.cardBg04,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
    },
    analyzingTitle: {
        fontSize: 15,
        fontWeight: "700",
        color: theme.colors.white,
    },
    analyzingSubtitle: {
        fontSize: 12,
        color: theme.colors.textWhite40,
        textAlign: "center",
        paddingHorizontal: 20,
    },

    // Score Card
    scoreCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        padding: 20,
        borderRadius: theme.radii.md,
        backgroundColor: theme.colors.cardBg04,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
    },
    scoreRingWrap: {
        alignItems: "center",
        gap: 4,
    },
    scoreRing: {
        width: 80, height: 80,
        borderRadius: 40,
        borderWidth: 4,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        gap: 1,
    },
    scoreNumber: {
        fontSize: 24,
        fontWeight: "900",
    },
    scoreOutOf: {
        fontSize: 11,
        color: theme.colors.textWhite40,
        marginTop: 6,
    },
    scoreLabel: {
        fontSize: 12,
        fontWeight: "800",
    },
    scoreSubLabel: {
        fontSize: 10,
        color: theme.colors.textWhite40,
    },
    verdictWrap: {
        flex: 1,
        gap: 6,
    },
    verdictTitle: {
        fontSize: 18,
        fontWeight: "800",
        color: theme.colors.white,
    },
    verdictMessage: {
        fontSize: 12,
        color: theme.colors.textWhite55,
        lineHeight: 18,
    },

    // Result Cards
    resultCard: {
        borderRadius: theme.radii.md,
        backgroundColor: theme.colors.cardBg04,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
        overflow: "hidden",
    },
    resultCardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        padding: 14,
    },
    resultIconWrap: {
        width: 30, height: 30,
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
    },
    resultCardTitle: {
        flex: 1,
        fontSize: 13,
        fontWeight: "700",
        color: theme.colors.white,
    },
    resultCardBody: {
        paddingHorizontal: 14,
        paddingBottom: 14,
        gap: 8,
        borderTopWidth: 1,
        borderTopColor: theme.colors.cardBorder07,
        paddingTop: 12,
    },

    // Bullets
    bulletRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
    },
    bulletDot: {
        width: 6, height: 6,
        borderRadius: 3,
        backgroundColor: "#4ADE80",
        marginTop: 5,
    },
    bulletText: {
        flex: 1,
        fontSize: 13,
        color: theme.colors.textWhite55,
        lineHeight: 19,
    },

    // Keywords
    keywordGroupLabel: {
        fontSize: 11,
        fontWeight: "700",
        color: theme.colors.textWhite40,
        marginBottom: 4,
    },
    chipsRow: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 6,
    },
    chip: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 20,
        borderWidth: 1,
    },
    chipMatched: {
        backgroundColor: "rgba(74,222,128,0.08)",
        borderColor: "rgba(74,222,128,0.25)",
    },
    chipMissing: {
        backgroundColor: "rgba(255,59,48,0.08)",
        borderColor: "rgba(255,59,48,0.25)",
    },
    chipText: { fontSize: 11, fontWeight: "600" },
    chipTextMatched: { color: "#4ADE80" },
    chipTextMissing: { color: "#FF3B30" },

    // Section Feedback
    feedbackRow: {
        gap: 3,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.cardBorder07,
    },
    feedbackSection: {
        fontSize: 12,
        fontWeight: "700",
        color: theme.colors.white,
    },
    feedbackText: {
        fontSize: 12,
        color: theme.colors.textWhite55,
        lineHeight: 18,
    },

    // Grammar
    grammarCard: {
        borderRadius: theme.radii.sm,
        backgroundColor: theme.colors.inputBg05,
        padding: 12,
        gap: 6,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
    },
    grammarBefore: { gap: 3 },
    grammarAfter: { gap: 3 },
    grammarArrow: { alignItems: "center" },
    grammarLabel: {
        fontSize: 10,
        fontWeight: "700",
        color: theme.colors.textWhite40,
    },
    grammarOriginal: {
        fontSize: 12,
        color: "#FF3B30",
        lineHeight: 18,
    },
    grammarSuggestion: {
        fontSize: 12,
        color: "#4ADE80",
        lineHeight: 18,
    },
    grammarReason: {
        fontSize: 11,
        color: theme.colors.textWhite40,
        fontStyle: "italic",
        lineHeight: 16,
        marginTop: 2,
    },

    // Analyze Again
    analyzeAgainBtn: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: 48,
        borderRadius: theme.radii.md,
        borderWidth: 1,
        borderColor: theme.colors.inputFocusBorder45,
        backgroundColor: theme.colors.cardBg04,
        marginTop: 4,
    },
    analyzeAgainText: {
        fontSize: 14,
        fontWeight: "700",
        color: theme.colors.accentGreen,
    },
});