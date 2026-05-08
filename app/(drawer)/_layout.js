import { Drawer } from "expo-router/drawer";
import { MainDrawerContent } from "../../components/MainDrawerContent";
import { theme } from "../../constants/theme";

/**
 * Signed-in shell: drawer + `(tabs)` for bottom navigation.
 * Custom drawer content lists only CVPilot drawer destinations (tabs stay off the menu).
 */
export default function DrawerLayout() {
    return (
        <Drawer
            drawerContent={(props) => <MainDrawerContent {...props} />}
            screenOptions={{
                headerShown: false,
                drawerType: "front",
                swipeEnabled: true,
                swipeEdgeWidth: 48,
                drawerStyle: {
                    backgroundColor: theme.colors.bgRoot,
                    width: 300,
                },
                drawerActiveTintColor: theme.navigation.drawerTintActive,
                drawerInactiveTintColor: theme.navigation.drawerTintInactive,
            }}
        />
    );
}
