import { StyleSheet, Text, View } from "react-native";
import { theme } from "../constants/theme";

/** Centered placeholder copy for authenticated tab/drawer screens. */
export function PlaceholderScreenBody({ title, hint = "Coming soon." }) {
    return (
        <View style={styles.outer}>
            <View style={styles.card}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.hint}>{hint}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    outer: {
        flex: 1,
        backgroundColor: theme.colors.bgRoot,
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: theme.spacing["3xl"],
    },
    card: {
        width: "100%",
        maxWidth: 340,
        borderRadius: theme.radii.lg,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
        backgroundColor: theme.colors.cardBg04,
        paddingVertical: theme.spacing["5xl"],
        paddingHorizontal: theme.spacing["2xl"],
        alignItems: "center",
        gap: theme.spacing.sm,
    },
    title: {
        fontSize: theme.typography.xl,
        fontWeight: "700",
        color: theme.colors.brandMintText,
        letterSpacing: theme.typography.letterSpacingMd,
        textAlign: "center",
    },
    hint: {
        fontSize: theme.typography.md,
        fontWeight: "500",
        color: theme.colors.textWhite45,
        letterSpacing: theme.typography.letterSpacingMd,
        textAlign: "center",
    },
});
