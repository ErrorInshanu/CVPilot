import { Stack, usePathname, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider } from "../context/AuthContext";
import { useAuth } from "../hooks/useAuth";
import { loadResumesFromBackend } from "../services/resumeSyncService";

SplashScreen.preventAutoHideAsync().catch(() => {});

function AuthGate() {
    const { isAuthenticated, isLoading } = useAuth();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        SplashScreen.hideAsync().catch(() => {});

        const isPublic =
            pathname === "/" ||
            pathname === "/sign-in" ||
            pathname === "/signup";

        if (isAuthenticated) {
            if (isPublic) router.replace("/home");
            return;
        }

        if (!isPublic) router.replace("/sign-in");
    }, [isAuthenticated, isLoading, pathname, router]);

    useEffect(() => {
        if (isAuthenticated) {
            loadResumesFromBackend();
        }
    }, [isAuthenticated]);

    return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
                <AuthProvider>
                    <AuthGate />
                </AuthProvider>
            </SafeAreaProvider>
        </GestureHandlerRootView>
    );
}