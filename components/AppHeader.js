import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../constants/theme";

/**
 * Premium dark app bar: menu • centered title • optional right action placeholder.
 */
export function AppHeader({ title, rightAction }) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer());
    };

    const right =
        rightAction ?? (
            <Pressable hitSlop={12} accessibilityRole="button" accessibilityLabel="Profile">
                {/* <Ionicons
                    name="person-circle-outline"
                    size={26}
                    color={theme.colors.textWhite55}
                /> */}
            </Pressable>
        );

    return (
        <View style={[styles.wrap, { paddingTop: Math.max(insets.top, theme.spacing.sm) }]}>
            <View style={styles.row}>
                <View style={styles.side}>
                    <Pressable
                        hitSlop={12}
                        onPress={openDrawer}
                        accessibilityRole="button"
                        accessibilityLabel="Open menu"
                    >
                        <Ionicons name="menu" size={24} color={theme.colors.white} />
                    </Pressable>
                </View>
                <View style={styles.titleWrap} pointerEvents="none">
                    <Text style={styles.title} numberOfLines={1}>
                        {title}
                    </Text>
                </View>
                <View style={[styles.side, styles.sideRight]}>{right}</View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrap: {
        backgroundColor: theme.colors.bgRoot,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: theme.navigation.headerUnderline,
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 48,
        paddingHorizontal: theme.spacing["3xl"],
        paddingBottom: theme.spacing.sm,
    },
    side: {
        width: 44,
        justifyContent: "center",
        alignItems: "flex-start",
    },
    sideRight: {
        alignItems: "flex-end",
    },
    titleWrap: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: theme.typography.lg,
        fontWeight: "700",
        color: theme.colors.white,
        letterSpacing: theme.typography.letterSpacingMd,
    },
});
