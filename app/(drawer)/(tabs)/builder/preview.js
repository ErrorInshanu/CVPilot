import { Ionicons } from "@expo/vector-icons";
import * as Print from "expo-print";
import { useRouter } from "expo-router";
import * as Sharing from "expo-sharing";
import { useRef, useState } from "react";
import {
    ActivityIndicator,
    Animated,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import WebView from "react-native-webview";
import { getTemplate } from "../../../../constants/resumeTemplates";
import { theme } from "../../../../constants/theme";
import { useResumeStore } from "../../../../store/resumeStore";

export default function PreviewScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const resume = useResumeStore.getState().activeResume;
  const templateId = resume?.meta?.templateId || "classic-clean";
  const html = getTemplate(templateId, resume);

  const [webLoading, setWebLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const onWebLoaded = () => {
    setWebLoading(false);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
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

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
          <Ionicons name="chevron-back" size={22} color={theme.colors.white} />
        </Pressable>
        <Text style={styles.topTitle}>Resume Preview</Text>
        <Pressable
          onPress={handleExportPDF}
          style={styles.exportBtn}
          disabled={exporting}
        >
          {exporting ? (
            <ActivityIndicator size="small" color={theme.colors.bgRoot} />
          ) : (
            <>
              <Ionicons name="download-outline" size={16} color={theme.colors.bgRoot} />
              <Text style={styles.exportBtnText}>Export PDF</Text>
            </>
          )}
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
          />
        </Animated.View>
      </View>

      {/* ── Bottom Bar ── */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 8 }]}>
        <Pressable style={styles.templateBtn} onPress={() => router.push("/templates")}>
          <Ionicons name="color-palette-outline" size={16} color={theme.colors.accentGreen} />
          <Text style={styles.templateBtnText}>Change Template</Text>
        </Pressable>
        <Pressable
          style={styles.pdfBtn}
          onPress={handleExportPDF}
          disabled={exporting}
        >
          {exporting ? (
            <ActivityIndicator size="small" color={theme.colors.bgRoot} />
          ) : (
            <>
              <Ionicons name="share-outline" size={16} color={theme.colors.bgRoot} />
              <Text style={styles.pdfBtnText}>Share / Save PDF</Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: theme.colors.bgRoot },
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
  backBtn: {
    width: 38, height: 38,
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
    paddingVertical: 7,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.accentGreen,
  },
  exportBtnText: {
    fontSize: theme.typography.sm,
    fontWeight: "700",
    color: theme.colors.bgRoot,
  },
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
  bottomBar: {
    flexDirection: "row",
    gap: theme.spacing.md,
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
    gap: 6,
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
  pdfBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
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