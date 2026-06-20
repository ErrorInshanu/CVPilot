import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

// This screen exists purely as a safety net.
// WebBrowser.maybeCompleteAuthSession() in sign-in.js should intercept the
// cvpilot://oauth2redirect link before this screen ever meaningfully renders,
// handing control back to the useAuthRequest() promise. If for any reason
// that interception is slow, this avoids showing Expo Router's
// "Unmatched Route" 404 screen to the user.
export default function OAuthRedirect() {
    const router = useRouter();

    useEffect(() => {
        const timeout = setTimeout(() => {
            router.replace("/sign-in");
        }, 800);
        return () => clearTimeout(timeout);
    }, []);

    return (
        <View
            style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#050608",
            }}
        >
            <ActivityIndicator color="#ffffff" />
        </View>
    );
}