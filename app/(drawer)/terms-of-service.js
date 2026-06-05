import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../../components/AppHeader";
import { theme } from "../../constants/theme";

const SECTIONS = [
  {
    title: "1. Acceptance of Terms",
    content: "By creating an account or using the CVPilot app, you agree to be bound by these Terms. If you do not agree, do not use the app.",
  },
  {
    title: "2. Use of the App",
    content: "CVPilot is a resume builder app. You may use it to create and manage resumes, export as PDFs, and use AI-powered analysis tools.\n\nYou agree not to:\n• Use the app for any illegal purpose\n• Attempt to hack or reverse-engineer the service\n• Upload harmful or misleading content\n• Share your account with others",
  },
  {
    title: "3. Your Account",
    content: "You are responsible for maintaining the security of your account and password. CVPilot is not liable for any loss from your failure to keep your account secure.",
  },
  {
    title: "4. Your Content",
    content: "You own all resume content you create in CVPilot. By using the app, you grant us a limited license to store and process your content solely to provide the service.",
  },
  {
    title: "5. AI Features",
    content: "CVPilot uses AI tools to analyze resumes and suggest improvements. AI suggestions are not guaranteed to be accurate. You are responsible for reviewing all AI-generated content before using it.",
  },
  {
    title: "6. PDF Export",
    content: "CVPilot allows you to export resumes as PDF files. You are solely responsible for the accuracy and content of exported resumes.",
  },
  {
    title: "7. Service Availability",
    content: "We strive to keep CVPilot available at all times but do not guarantee uninterrupted access. We may update, suspend, or discontinue the service at any time.",
  },
  {
    title: "8. Termination",
    content: "We reserve the right to suspend or terminate your account if you violate these Terms.",
  },
  {
    title: "9. Disclaimer of Warranties",
    content: "CVPilot is provided \"as is\" without warranties of any kind. We do not guarantee that resumes created will result in employment.",
  },
  {
    title: "10. Limitation of Liability",
    content: "To the maximum extent permitted by law, CVPilot is not liable for any indirect, incidental, or consequential damages arising from your use of the app.",
  },
  {
    title: "11. Changes to Terms",
    content: "We may update these Terms at any time. Continued use of the app after changes means you accept the new Terms.",
  },
  {
    title: "12. Contact Us",
    content: "If you have any questions about these Terms, contact us at:\n\nsupport@cvpilot.app",
  },
];

export default function TermsOfServiceScreen() {
  return (
    <View style={styles.shell}>
      <AppHeader title="Terms of Service" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last updated: June 5, 2026</Text>
        <Text style={styles.intro}>
          By downloading or using CVPilot, you agree to these Terms of Service. Please read them carefully.
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