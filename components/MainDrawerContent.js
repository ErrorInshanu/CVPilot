import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { theme } from "../constants/theme";

function Item({ icon, label, onPress }) {
    return (
        <Pressable
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={label}
        >
            <View style={styles.iconWrap}>
                <Ionicons name={icon} size={22} color={theme.colors.accentGreen} />
            </View>
            <Text style={styles.label}>{label}</Text>
            <Ionicons name="chevron-forward" size={18} color={theme.colors.textWhite30} />
        </Pressable>
    );
}

export function MainDrawerContent(props) {
    const close = () => props.navigation.closeDrawer();

    const go = (href) => {
        close();
        router.push(href);
    };

    const goHome = () => {
        close();
        router.replace("/home");
    };

    return (
        <SafeAreaView style={styles.safeArea} edges={["top", "left", "bottom"]}>
            <DrawerContentScrollView
                {...props}
                style={styles.scroll}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.brand}>
                    <View style={styles.brandIcon}>
                    <Image
    source={require("../assets/images/cvlogoo.png")}
    style={{ width: 34, height: 34 }}
    resizeMode="contain"
/>
                    </View>
                    <View>
                        <Text style={styles.brandTitle}>CVPilot</Text>
                        <Text style={styles.brandSub}>Resume cockpit</Text>
                    </View>
                </View>

                <Item icon="home-outline" label="Home" onPress={goHome} />
                <Item
                    icon="document-text-outline"
                    label="Saved Resumes"
                    onPress={() => go("/saved-resumes")}
                />
                <Item
                    icon="settings-outline"
                    label="Settings"
                    onPress={() => go("/settings")}
                />
                <Item
                    icon="document-outline"
                    label="Terms of Service"
                    onPress={() => go("/terms-of-service")}
                />
                <Item
                    icon="shield-checkmark-outline"
                    label="Privacy Policy"
                    onPress={() => go("/privacy-policy")}
                />

                <View style={styles.divider} />

                <Pressable
                    style={({ pressed }) => [styles.logoutRow, pressed && styles.rowPressed]}
                    onPress={() => {
                        close();
                        router.push("/logout");
                    }}
                    accessibilityRole="button"
                    accessibilityLabel="Logout"
                >
                    <Ionicons name="log-out-outline" size={22} color={theme.colors.dotRed} />
                    <Text style={styles.logoutLabel}>Logout</Text>
                </Pressable>
            </DrawerContentScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: theme.colors.bgRoot,
    },
    scroll: {
        flex: 1,
        backgroundColor: theme.colors.bgRoot,
    },
    content: {
        flexGrow: 1,
        paddingTop: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        paddingBottom: theme.spacing["4xl"],
        gap: 4,
    },
    brand: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        marginBottom: theme.spacing["5xl"],
    },
    brandIcon: {
        width: 48,
        height: 48,
        borderRadius: theme.radii.md,
        backgroundColor: theme.colors.mintBg10,
        borderWidth: 1,
        borderColor: theme.colors.mintBorder28,
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",   // 👈 add this

    },
    brandTitle: {
        fontSize: theme.typography.brandAuth,
        fontWeight: "800",
        color: theme.colors.brandMintText,
        letterSpacing: theme.typography.letterSpacingMd,
    },
    brandSub: {
        fontSize: theme.typography.sm,
        color: theme.colors.textWhite40,
        marginTop: 2,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing.md,
        borderRadius: theme.radii.sm,
    },
    rowPressed: {
        backgroundColor: theme.colors.cardBg04,
    },
    iconWrap: {
        width: 36,
        alignItems: "center",
        marginRight: theme.spacing.sm,
    },
    label: {
        flex: 1,
        fontSize: theme.typography.base,
        fontWeight: "600",
        color: theme.colors.white,
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: theme.colors.cardBorder07,
        marginVertical: theme.spacing.lg,
        marginHorizontal: theme.spacing.sm,
    },
    logoutRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        paddingHorizontal: theme.spacing["2xl"],
    },
    logoutLabel: {
        fontSize: theme.typography.base,
        fontWeight: "700",
        color: theme.colors.dotRed,
    },
});
