import { Ionicons } from "@expo/vector-icons";
import * as AuthSession from "expo-auth-session";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Easing,
    Image,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { ENDPOINTS } from "../../constants/api";
import { theme } from "../../constants/theme";
import { useAuth } from "../../hooks/useAuth";

// ─── Required for expo-auth-session on Android ───────────────────────────────
WebBrowser.maybeCompleteAuthSession();

// ─── Google OAuth Config ──────────────────────────────────────────────────────
const ANDROID_CLIENT_ID = "528611987830-o2lmcm413o5j7666497ef26shg21kufk.apps.googleusercontent.com";
const discovery = {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
};

// ─── Toast Component ──────────────────────────────────────────────────────────
function Toast({ message, type, visible }) {
    const translateY = useRef(new Animated.Value(-80)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: 0,
                    duration: 380,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(translateY, {
                    toValue: -80,
                    duration: 300,
                    easing: Easing.in(Easing.cubic),
                    useNativeDriver: true,
                }),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    const isSuccess = type === "success";

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                toastStyles.wrap,
                isSuccess ? toastStyles.success : toastStyles.error,
                { transform: [{ translateY }], opacity },
            ]}
        >
            <Ionicons
                name={isSuccess ? "checkmark-circle" : "alert-circle"}
                size={18}
                color={isSuccess ? "#4ADE80" : "#EF5350"}
            />
            <Text style={toastStyles.text}>{message}</Text>
        </Animated.View>
    );
}

const toastStyles = StyleSheet.create({
    wrap: {
        position: "absolute",
        top: Platform.OS === "android" ? 48 : 56,
        left: 24,
        right: 24,
        zIndex: 999,
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 14,
        borderWidth: 1,
    },
    success: {
        backgroundColor: "rgba(74,222,128,0.08)",
        borderColor: "rgba(74,222,128,0.25)",
    },
    error: {
        backgroundColor: "rgba(239,83,80,0.08)",
        borderColor: "rgba(239,83,80,0.25)",
    },
    text: {
        flex: 1,
        fontSize: 13,
        fontWeight: "600",
        color: "#FFFFFF",
        letterSpacing: 0.2,
    },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SignIn() {
    const router = useRouter();
    const { signIn } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [emailFocused, setEmailFocused] = useState(false);
    const [passwordFocused, setPasswordFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);

    // Inline errors
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Toast
    const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

    const showToast = (message, type = "success") => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
    };

    // ── Google OAuth Setup ────────────────────────────────────────────────────
    const redirectUri = AuthSession.makeRedirectUri({
        scheme: "cvpilot",
        path: "oauth2redirect",
    });
    const [request, response, promptAsync] = AuthSession.useAuthRequest(
        {
            clientId: ANDROID_CLIENT_ID,
            redirectUri,
            scopes: ["openid", "profile", "email"],
            responseType: AuthSession.ResponseType.Code,
            usePKCE: true,
        },
        discovery
    );

    // Handle Google OAuth response
    useEffect(() => {
        if (response?.type === "success") {
            const { code } = response.params;
            exchangeCodeForToken(code);
        } else if (response?.type === "error") {
            showToast("Google sign-in failed. Please try again.", "error");
        }
    }, [response]);

    const exchangeCodeForToken = async (code) => {
        try {
            const tokenResult = await AuthSession.exchangeCodeAsync(
                {
                    clientId: ANDROID_CLIENT_ID,
                    code,
                    redirectUri,
                    extraParams: {
                        code_verifier: request?.codeVerifier,
                    },
                },
                discovery
            );
            handleGoogleToken(tokenResult.accessToken);
        } catch (error) {
            showToast("Google sign-in failed. Please try again.", "error");
        }
    };

    const handleGoogleToken = async (accessToken) => {
        setGoogleLoading(true);
        try {
            const res = await fetch(ENDPOINTS.googleAuth, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ accessToken }),
            });

            const data = await res.json();

            if (!res.ok) {
                showToast(data.message || "Google sign-in failed.", "error");
                return;
            }

            const token = data.token ?? null;
            const userPayload = data.user ?? {
                name: data.name,
                email: data.email,
                _id: data._id,
            };

            if (!token) {
                showToast("Invalid server response.", "error");
                return;
            }

            await signIn(token, userPayload);
            showToast("Welcome to CVPilot!", "success");
            setTimeout(() => router.replace("/home"), 1000);

        } catch (error) {
            showToast("Network error. Please try again.", "error");
        } finally {
            setGoogleLoading(false);
        }
    };

    // Entrance animations
    const logoAnim = useRef(new Animated.Value(0)).current;
    const formAnim = useRef(new Animated.Value(0)).current;
    const footerAnim = useRef(new Animated.Value(0)).current;
    const signInScale = useRef(new Animated.Value(1)).current;
    const googleScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        logoAnim.setValue(0);
        formAnim.setValue(0);
        footerAnim.setValue(0);

        Animated.parallel([
            Animated.timing(logoAnim, {
                toValue: 1,
                duration: 520,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
            Animated.sequence([
                Animated.delay(180),
                Animated.timing(formAnim, {
                    toValue: 1,
                    duration: 540,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]),
            Animated.sequence([
                Animated.delay(340),
                Animated.timing(footerAnim, {
                    toValue: 1,
                    duration: 480,
                    easing: Easing.out(Easing.cubic),
                    useNativeDriver: true,
                }),
            ]),
        ]).start();
    }, [logoAnim, formAnim, footerAnim]);

    const logoOpacity = logoAnim;
    const logoTranslateY = logoAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0],
    });
    const formOpacity = formAnim;
    const formTranslateY = formAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [24, 0],
    });
    const footerOpacity = footerAnim;
    const footerTranslateY = footerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [16, 0],
    });

    const handlePressIn = (scale) => {
        Animated.spring(scale, {
            toValue: 0.96,
            useNativeDriver: true,
            speed: 30,
            bounciness: 4,
        }).start();
    };

    const handlePressOut = (scale) => {
        Animated.spring(scale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 24,
            bounciness: 6,
        }).start();
    };

    // ── Validation ────────────────────────────────────────────────────────────
    const validate = () => {
        let valid = true;

        if (!email.trim()) {
            setEmailError("Email is required");
            valid = false;
        } else if (!/^\S+@\S+\.\S+$/.test(email)) {
            setEmailError("Enter a valid email address");
            valid = false;
        } else {
            setEmailError("");
        }

        if (!password) {
            setPasswordError("Password is required");
            valid = false;
        } else if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters");
            valid = false;
        } else {
            setPasswordError("");
        }

        return valid;
    };

    // ── Sign In API Call ──────────────────────────────────────────────────────
    const handleSignIn = async () => {
        if (!validate()) return;

        setLoading(true);
        try {
            const response = await fetch(ENDPOINTS.login, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: email.trim(), password }),
            });

            const data = await response.json();

            if (!response.ok) {
                showToast(data.message || "Sign in failed", "error");
                return;
            }

            const token =
                data.token ??
                data.accessToken ??
                data.access_token ??
                null;
            const userPayload =
                data.user ??
                data.profile ??
                (data.name || data.email
                    ? { name: data.name, email: data.email }
                    : null);

            if (!token) {
                showToast("Invalid server response.", "error");
                return;
            }

            try {
                await signIn(token, userPayload);
            } catch {
                showToast("Could not save your session.", "error");
                return;
            }

            showToast("Welcome back!", "success");
            setTimeout(() => router.replace("/home"), 1000);
        } catch (error) {
            showToast("Network error. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.root}>
            {/* Background */}
            <View style={styles.bgBase} />
            <View style={styles.glowA} />
            <View style={styles.glowB} />
            <View style={styles.vignette} />

            {/* Toast */}
            <Toast
                message={toast.message}
                type={toast.type}
                visible={toast.visible}
            />

            <SafeAreaView style={styles.safeTop} />

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    {/* Logo block */}
                    <Animated.View
                        style={[
                            styles.logoBlock,
                            {
                                opacity: logoOpacity,
                                transform: [{ translateY: logoTranslateY }],
                            },
                        ]}
                    >
                        <View style={styles.logoMark}>
                            <Image
                                source={require("../../assets/images/cvlogoo.png")}
                                style={{ width: 36, height: 36 }}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.brandText}>CVPilot</Text>
                        <Text style={styles.welcomeText}>Welcome back</Text>
                        <Text style={styles.subtitleText}>
                            Sign in to continue building your resume
                        </Text>
                    </Animated.View>

                    {/* Form card */}
                    <Animated.View
                        style={[
                            styles.card,
                            {
                                opacity: formOpacity,
                                transform: [{ translateY: formTranslateY }],
                            },
                        ]}
                    >
                        {/* Email */}
                        <View style={styles.fieldGroup}>
                            <Text style={styles.fieldLabel}>Email</Text>
                            <View
                                style={[
                                    styles.inputWrap,
                                    emailFocused && styles.inputWrapFocused,
                                    emailError ? styles.inputWrapError : null,
                                ]}
                            >
                                <Ionicons
                                    name="mail-outline"
                                    size={18}
                                    color={
                                        emailError
                                            ? "#EF5350"
                                            : emailFocused
                                            ? theme.colors.accentGreen
                                            : "#555"
                                    }
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="you@example.com"
                                    placeholderTextColor="#3A3A3A"
                                    value={email}
                                    onChangeText={(v) => {
                                        setEmail(v);
                                        if (emailError) setEmailError("");
                                    }}
                                    onFocus={() => setEmailFocused(true)}
                                    onBlur={() => setEmailFocused(false)}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                            {emailError ? (
                                <Text style={styles.inlineError}>{emailError}</Text>
                            ) : null}
                        </View>

                        {/* Password */}
                        <View style={styles.fieldGroup}>
                            <View style={styles.fieldLabelRow}>
                                <Text style={styles.fieldLabel}>Password</Text>
                                <Pressable onPress={() => {}}>
                                    <Text style={styles.forgotText}>Forgot password?</Text>
                                </Pressable>
                            </View>
                            <View
                                style={[
                                    styles.inputWrap,
                                    passwordFocused && styles.inputWrapFocused,
                                    passwordError ? styles.inputWrapError : null,
                                ]}
                            >
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={18}
                                    color={
                                        passwordError
                                            ? "#EF5350"
                                            : passwordFocused
                                            ? theme.colors.accentGreen
                                            : "#555"
                                    }
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    placeholderTextColor="#3A3A3A"
                                    value={password}
                                    onChangeText={(v) => {
                                        setPassword(v);
                                        if (passwordError) setPasswordError("");
                                    }}
                                    onFocus={() => setPasswordFocused(true)}
                                    onBlur={() => setPasswordFocused(false)}
                                    secureTextEntry={!passwordVisible}
                                    autoCapitalize="none"
                                />
                                <Pressable
                                    onPress={() => setPasswordVisible((v) => !v)}
                                    hitSlop={8}
                                >
                                    <Ionicons
                                        name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                                        size={18}
                                        color="#555"
                                    />
                                </Pressable>
                            </View>
                            {passwordError ? (
                                <Text style={styles.inlineError}>{passwordError}</Text>
                            ) : null}
                        </View>

                        {/* Sign In button */}
                        <Pressable
                            onPressIn={() => handlePressIn(signInScale)}
                            onPressOut={() => handlePressOut(signInScale)}
                            onPress={handleSignIn}
                            disabled={loading || googleLoading}
                            accessibilityRole="button"
                            accessibilityLabel="Sign In"
                        >
                            <Animated.View
                                style={[
                                    styles.signInBtn,
                                    { transform: [{ scale: signInScale }] },
                                    loading && styles.signInBtnDisabled,
                                ]}
                            >
                                <Text style={styles.signInBtnText}>
                                    {loading ? "Signing in..." : "Sign In"}
                                </Text>
                            </Animated.View>
                        </Pressable>

                        {/* Divider */}
                        <View style={styles.dividerRow}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Google button */}
                        <Pressable
                            onPressIn={() => handlePressIn(googleScale)}
                            onPressOut={() => handlePressOut(googleScale)}
                            onPress={() => promptAsync()}
                            disabled={!request || loading || googleLoading}
                            accessibilityRole="button"
                            accessibilityLabel="Continue with Google"
                        >
                            <Animated.View
                                style={[
                                    styles.googleBtn,
                                    { transform: [{ scale: googleScale }] },
                                    googleLoading && styles.signInBtnDisabled,
                                ]}
                            >
                                {googleLoading ? (
                                    <Text style={styles.googleBtnText}>Signing in...</Text>
                                ) : (
                                    <>
                                        <Svg width="20" height="20" viewBox="0 0 48 48">
                                            <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                            <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                            <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                            <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                            <Path fill="none" d="M0 0h48v48H0z" />
                                        </Svg>
                                        <Text style={styles.googleBtnText}>Continue with Google</Text>
                                    </>
                                )}
                            </Animated.View>
                        </Pressable>
                    </Animated.View>

                    {/* Footer */}
                    <Animated.View
                        style={[
                            styles.footer,
                            {
                                opacity: footerOpacity,
                                transform: [{ translateY: footerTranslateY }],
                            },
                        ]}
                    >
                        <Text style={styles.footerText}>{"Don\u2019t have an account? "}</Text>
                        <Pressable onPress={() => router.push("/signup")}>
                            <Text style={styles.footerLink}>Sign Up</Text>
                        </Pressable>
                    </Animated.View>
                </ScrollView>
            </KeyboardAvoidingView>

            <SafeAreaView style={styles.safeBottom} />
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    root: {
        flex: 1,
        backgroundColor: theme.colors.bgRoot,
    },
    bgBase: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.colors.bgBase,
    },
    glowA: {
        position: "absolute",
        left: -100,
        top: -120,
        width: 340,
        height: 340,
        borderRadius: 170,
        backgroundColor: theme.colors.accentGreenGlow,
        opacity: 0.13,
    },
    glowB: {
        position: "absolute",
        right: -120,
        bottom: -140,
        width: 400,
        height: 400,
        borderRadius: 200,
        backgroundColor: theme.colors.accentTealGlow,
        opacity: 0.09,
    },
    vignette: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.colors.vignette,
        opacity: 0.38,
    },
    safeTop: {
        height: Platform.OS === "android" ? 12 : 0,
    },
    safeBottom: {
        height: Platform.OS === "android" ? 16 : 0,
    },
    scroll: {
        flexGrow: 1,
        paddingHorizontal: theme.spacing["3xl"],
        paddingTop: theme.spacing["7xl"],
        paddingBottom: theme.spacing["5xl"],
    },

    // Logo block
    logoBlock: {
        alignItems: "center",
        marginBottom: theme.spacing["5xl"],
    },
    logoMark: {
        width: 52,
        height: 52,
        borderRadius: theme.radii.md,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: theme.colors.mintBg09,
        borderWidth: 1,
        borderColor: theme.colors.mintBorder24,
        marginBottom: theme.spacing.lg,
        overflow: "hidden",
    },
    brandText: {
        fontSize: theme.typography.brandAuth,
        fontWeight: "800",
        letterSpacing: theme.typography.letterSpacingMd,
        color: theme.colors.brandMintText,
        marginBottom: theme.spacing.xs,
    },
    welcomeText: {
        fontSize: theme.typography.xl,
        fontWeight: "700",
        color: theme.colors.white,
        marginBottom: 6,
    },
    subtitleText: {
        fontSize: theme.typography.md,
        color: theme.colors.textWhite45,
        letterSpacing: theme.typography.letterSpacingMd,
        textAlign: "center",
    },

    // Card
    card: {
        backgroundColor: theme.colors.cardBg04,
        borderRadius: theme.radii.lg,
        borderWidth: 1,
        borderColor: theme.colors.cardBorder07,
        padding: theme.spacing["2xl"],
        gap: 18,
    },

    // Fields
    fieldGroup: {
        gap: 6,
    },
    fieldLabelRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    fieldLabel: {
        fontSize: theme.typography.md,
        fontWeight: "600",
        color: theme.colors.textWhite60,
        letterSpacing: theme.typography.letterSpacingMd,
    },
    forgotText: {
        fontSize: theme.typography.sm,
        color: theme.colors.accentGreen,
        letterSpacing: 0.1,
    },
    inputWrap: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.colors.inputBg05,
        borderRadius: theme.radii.sm,
        borderWidth: 1,
        borderColor: theme.colors.inputBorder08,
        paddingHorizontal: theme.spacing.lg,
        height: 50,
    },
    inputWrapFocused: {
        borderColor: theme.colors.inputFocusBorder45,
        backgroundColor: theme.colors.inputFocusBg04,
    },
    inputWrapError: {
        borderColor: "rgba(239,83,80,0.5)",
        backgroundColor: "rgba(239,83,80,0.04)",
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: theme.typography.base,
        color: theme.colors.white,
        letterSpacing: theme.typography.letterSpacingMd,
    },
    inlineError: {
        fontSize: 11.5,
        color: "#EF5350",
        letterSpacing: 0.2,
        marginTop: 2,
    },

    // Sign In button
    signInBtn: {
        height: 52,
        borderRadius: theme.radii.md,
        backgroundColor: theme.colors.accentGreen,
        alignItems: "center",
        justifyContent: "center",
        ...theme.shadows.greenButtonCompact,
    },
    signInBtnDisabled: {
        opacity: 0.6,
    },
    signInBtnText: {
        fontSize: theme.typography.lg,
        fontWeight: "700",
        color: theme.colors.bgRoot,
        letterSpacing: theme.typography.letterSpacingXl,
    },

    // Divider
    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: theme.colors.cardBorder07,
    },
    dividerText: {
        fontSize: theme.typography.sm,
        color: theme.colors.textWhite30,
        letterSpacing: theme.typography.letterSpacingMd,
    },

    // Google button
    googleBtn: {
        height: 52,
        borderRadius: theme.radii.md,
        borderWidth: 1,
        borderColor: theme.colors.googleBorder10,
        backgroundColor: theme.colors.cardBg04,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
    },
    googleBtnText: {
        fontSize: theme.typography.base,
        fontWeight: "600",
        color: theme.colors.textWhite75,
        letterSpacing: theme.typography.letterSpacingMd,
    },

    // Footer
    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 28,
    },
    footerText: {
        fontSize: theme.typography.md,
        color: theme.colors.textWhite40,
    },
    footerLink: {
        fontSize: theme.typography.md,
        fontWeight: "700",
        color: theme.colors.accentGreen,
    },
});