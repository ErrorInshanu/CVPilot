import { Stack } from "expo-router";

/**
 * Auth flow — stack between Sign In and Sign Up (splash lives at app/index.js).
 */
export default function AuthLayout() {
    return <Stack screenOptions={{ headerShown: false }} />;
}
