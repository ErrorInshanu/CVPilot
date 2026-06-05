import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../../components/AppHeader";
import { theme } from "../../constants/theme";

const SECTIONS = [
  {
    title: "1. Information We Collect",
    content: "When you sign up, we collect your name and email address.\n\nWe store the resume content you create, including personal details, work experience, education, skills, and other sections you fill in.\n\nWe may collect basic usage information such as app crashes and error logs to improve the app.",
  },
  {
    title: "2. How We Use Your Information",
    content: "• To create and manage your account\n• To store and sync your resumes across devices\n• To generate PDF resumes\n• To provide AI-powered resume analysis features\n• To improve the app experience",
  },
  {
    title: "3. Data Storage",
    content: "Your data is stored securely on our servers. We use JWT authentication to protect your account. Passwords are encrypted and never stored in plain text.",
  },
  {
    title: "4. Data Sharing",
    content: "We do not sell, trade, or share your personal data with third parties except:\n\n• Groq AI — used only for resume analysis. Only resume text is sent, never your credentials.\n• Legal requirements — if required by law.",
  },
  {
    title: "5. Data Deletion",
    content: "You can delete your account and all associated data at any time by contacting us at support@cvpilot.app. We will permanently delete your data within 30 days.",
  },
  {
    title: "6. Children's Privacy",
    content: "CVPilot is not intended for children under 13. We do not knowingly collect data from children under 13.",
  },
  {
    title: "7. Security",
    content: "We use industry-standard security measures including encrypted storage, HTTPS, and JWT authentication to protect your data.",
  },
  {
    title: "8. Changes to This Policy",
    content: "We may update this Privacy Policy from time to time. We will notify you of changes by updating the date at the top of this page.",
  },
  {
    title: "9. Contact Us",
    content: "If you have any questions about this Privacy Policy, contact us at:\n\nsupport@cvpilot.app",
  },
];

export default function PrivacyPolicyScreen() {
  return (
    <View style={styles.shell}>
      <AppHeader title="Privacy Policy" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last updated: June 5, 2026</Text>
        <Text style={styles.intro}>
          CVPilot is committed to protecting your privacy. This policy explains how we collect, use, and store your information.
        </Text>

        {SECTIONS.map((section) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <Text style={styles.sectionContent}>{section.content}</Text>
          </View>
        ))}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: theme.colors.bgRoot },
  scroll: { flex: 1 },
  content: {
    paddingHorizontal: theme.spacing["3xl"],
    paddingTop: theme.spacing["2xl"],
    paddingBottom: theme.spacing["5xl"],
    gap: theme.spacing.lg,
  },
  lastUpdated: {
    fontSize: theme.typography.sm,
    color: theme.colors.textWhite40,
    letterSpacing: theme.typography.letterSpacingMd,
  },
  intro: {
    fontSize: theme.typography.md,
    color: theme.colors.textWhite55,
    lineHeight: 22,
    letterSpacing: theme.typography.letterSpacingMd,
    marginBottom: theme.spacing.xs,
  },
  section: {
    backgroundColor: theme.colors.cardBg04,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder07,
    padding: theme.spacing["2xl"],
    gap: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.typography.base,
    fontWeight: "700",
    color: theme.colors.white,
    letterSpacing: theme.typography.letterSpacingMd,
  },
  sectionContent: {
    fontSize: theme.typography.md,
    color: theme.colors.textWhite55,
    lineHeight: 22,
    letterSpacing: theme.typography.letterSpacingMd,
  },
  bottomSpacer: { height: theme.spacing["3xl"] },
});