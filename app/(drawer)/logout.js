import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { AppHeader } from "../../components/AppHeader";
import { theme } from "../../constants/theme";
import { useAuth } from "../../hooks/useAuth";

export default function LogoutScreen() {
    const { signOut } = useAuth();
    return (
        <View style={styles.shell}>
            <AppHeader title="Logout" />
            <View style={styles.body}>
                <View style={styles.card}>
                    <Text style={styles.title}>Sign out</Text>
                    <Text style={styles.desc}>
                        You’ll need to sign in again to sync your resumes.
                    </Text>
                    <Pressable
                        style={({ pressed }) => [
                            styles.btn,
                            pressed && styles.btnPressed,
                        ]}
                        onPress={async () => {
                            await signOut();
                            router.replace("/sign-in");
                        }}
                        accessibilityRole="button"
                        accessibilityLabel="Confirm sign out"
                    >
                        <Text style={styles.btnLabel}>Log out</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    shell: {
        flex: 1,
        backgroundColor: theme.colors.bgRoot,
    },
    body: {
        flex: 1,
        justifyContent: "center",
        paddingHorizontal: theme.spacing["3xl"],
    },
    card: {
        borderRadius: theme.radii.lg,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
        backgroundColor: theme.colors.cardBg04,
        paddingVertical: theme.spacing["5xl"],
        paddingHorizontal: theme.spacing["2xl"],
        alignItems: "center",
        gap: theme.spacing.md,
    },
    title: {
        fontSize: theme.typography.xl,
        fontWeight: "700",
        color: theme.colors.brandMintText,
    },
    desc: {
        fontSize: theme.typography.md,
        color: theme.colors.textWhite45,
        textAlign: "center",
        letterSpacing: theme.typography.letterSpacingMd,
        lineHeight: 20,
    },
    btn: {
        marginTop: theme.spacing.lg,
        minWidth: 200,
        height: 48,
        borderRadius: theme.radii.md,
        backgroundColor: theme.colors.dotRed,
        alignItems: "center",
        justifyContent: "center",
    },
    btnPressed: {
        opacity: 0.88,
    },
    btnLabel: {
        fontSize: theme.typography.lg,
        fontWeight: "700",
        color: theme.colors.white,
        letterSpacing: theme.typography.letterSpacingMd,
    },
});
