import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import { ENDPOINTS } from "../../constants/api";
import { colors, radii, shadows, spacing, typography } from "../../constants/theme";

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
export default function SignUp() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);

  // Inline errors
  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Toast
  const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  };

  const clearError = (field) => {
    if (errors[field]) setErrors((e) => ({ ...e, [field]: "" }));
  };

  // Entrance animations
  const logoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const footerAnim = useRef(new Animated.Value(0)).current;
  const createScale = useRef(new Animated.Value(1)).current;
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

  const isFocused = (field) => focusedField === field;

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = { fullName: "", email: "", password: "", confirmPassword: "" };
    let valid = true;

    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
      valid = false;
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
      valid = false;
    }

    if (!email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Enter a valid email address";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      valid = false;
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // ── Signup API Call ─────────────────────────────────────────────────────────
  const handleSignUp = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const response = await fetch(ENDPOINTS.signup, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        showToast(data.message || "Signup failed", "error");
        return;
      }

      // TODO: Save token to AsyncStorage here
      // await AsyncStorage.setItem("token", data.token);

      showToast("Account created! Please sign in.", "success");
setTimeout(() => router.replace("/sign-in"), 1000);
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
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />

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
            <Text style={styles.welcomeText}>Create Account</Text>
            <Text style={styles.subtitleText}>
              Start building your professional resume
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
            <Field
              label="Full Name"
              icon="person-outline"
              placeholder="John Doe"
              value={fullName}
              onChangeText={(v) => { setFullName(v); clearError("fullName"); }}
              focused={isFocused("name")}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="words"
              error={errors.fullName}
            />

            <Field
              label="Email"
              icon="mail-outline"
              placeholder="you@example.com"
              value={email}
              onChangeText={(v) => { setEmail(v); clearError("email"); }}
              focused={isFocused("email")}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
            />

            <Field
              label="Password"
              icon="lock-closed-outline"
              placeholder="••••••••"
              value={password}
              onChangeText={(v) => { setPassword(v); clearError("password"); }}
              focused={isFocused("password")}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              secureTextEntry={!passwordVisible}
              autoCapitalize="none"
              error={errors.password}
              rightIcon={
                <Pressable onPress={() => setPasswordVisible((v) => !v)} hitSlop={8}>
                  <Ionicons
                    name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                    size={18}
                    color={colors.inputIconDefault}
                  />
                </Pressable>
              }
            />

            <Field
              label="Confirm Password"
              icon="shield-checkmark-outline"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={(v) => { setConfirmPassword(v); clearError("confirmPassword"); }}
              focused={isFocused("confirm")}
              onFocus={() => setFocusedField("confirm")}
              onBlur={() => setFocusedField(null)}
              secureTextEntry={!confirmVisible}
              autoCapitalize="none"
              error={errors.confirmPassword}
              rightIcon={
                <Pressable onPress={() => setConfirmVisible((v) => !v)} hitSlop={8}>
                  <Ionicons
                    name={confirmVisible ? "eye-outline" : "eye-off-outline"}
                    size={18}
                    color={colors.inputIconDefault}
                  />
                </Pressable>
              }
            />

            {/* Create Account button */}
            <Pressable
              onPressIn={() => handlePressIn(createScale)}
              onPressOut={() => handlePressOut(createScale)}
              onPress={handleSignUp}
              disabled={loading}
              accessibilityRole="button"
              accessibilityLabel="Create Account"
            >
              <Animated.View
                style={[
                  styles.createBtn,
                  { transform: [{ scale: createScale }] },
                  loading && styles.createBtnDisabled,
                ]}
              >
                <Text style={styles.createBtnText}>
                  {loading ? "Creating Account..." : "Create Account"}
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
              onPress={() => {}}
              accessibilityRole="button"
              accessibilityLabel="Continue with Google"
            >
             
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
            <View style={styles.signInRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Pressable onPress={() => router.push("/sign-in")}>
                <Text style={styles.footerLink}>Sign In</Text>
              </Pressable>
            </View>
            <Text style={styles.termsText}>
              By continuing, you agree to our{" "}
              <Text style={styles.termsLink}>Terms of Service</Text>
              {" "}and{" "}
              <Text style={styles.termsLink}>Privacy Policy</Text>
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SafeAreaView style={styles.safeBottom} />
    </View>
  );
}

// ─── Reusable Field Component ─────────────────────────────────────────────────
function Field({
  label, icon, placeholder, value, onChangeText,
  focused, onFocus, onBlur, secureTextEntry,
  keyboardType, autoCapitalize, rightIcon, error,
}) {
  return (
    <View style={fieldStyles.group}>
      <Text style={fieldStyles.label}>{label}</Text>
      <View
        style={[
          fieldStyles.inputWrap,
          focused && fieldStyles.inputWrapFocused,
          error ? fieldStyles.inputWrapError : null,
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={error ? "#EF5350" : focused ? colors.accentGreen : colors.inputIconDefault}
          style={fieldStyles.inputIcon}
        />
        <TextInput
          style={fieldStyles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.inputPlaceholder}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize ?? "none"}
          autoCorrect={false}
        />
        {rightIcon ?? null}
      </View>
      {error ? <Text style={fieldStyles.inlineError}>{error}</Text> : null}
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  group: { gap: 6 },
  label: {
    fontSize: typography.md,
    fontWeight: "600",
    color: colors.textWhite60,
    letterSpacing: typography.letterSpacingMd,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.inputBg05,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.inputBorder08,
    paddingHorizontal: spacing.lg,
    height: 50,
  },
  inputWrapFocused: {
    borderColor: colors.inputFocusBorder45,
    backgroundColor: colors.inputFocusBg04,
  },
  inputWrapError: {
    borderColor: "rgba(239,83,80,0.5)",
    backgroundColor: "rgba(239,83,80,0.04)",
  },
  inputIcon: { marginRight: spacing.sm },
  input: {
    flex: 1,
    fontSize: typography.base,
    color: colors.white,
    letterSpacing: typography.letterSpacingMd,
  },
  inlineError: {
    fontSize: 11.5,
    color: "#EF5350",
    letterSpacing: 0.2,
    marginTop: 2,
  },
});

// ─── Screen Styles ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex: { flex: 1 },
  root: { flex: 1, backgroundColor: colors.bgRoot },
  bgBase: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.bgBase },
  glowA: {
    position: "absolute", left: -100, top: -120,
    width: 340, height: 340, borderRadius: 170,
    backgroundColor: colors.accentGreenGlow, opacity: 0.13,
  },
  glowB: {
    position: "absolute", right: -120, bottom: -140,
    width: 400, height: 400, borderRadius: 200,
    backgroundColor: colors.accentTealGlow, opacity: 0.09,
  },
  vignette: { ...StyleSheet.absoluteFillObject, backgroundColor: colors.vignette, opacity: 0.38 },
  safeTop: { height: Platform.OS === "android" ? 12 : 0 },
  safeBottom: { height: Platform.OS === "android" ? 16 : 0 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: spacing["3xl"],
    paddingTop: spacing["7xl"],
    paddingBottom: spacing["5xl"],
  },
  logoBlock: { alignItems: "center", marginBottom: spacing["5xl"] },
  logoMark: {
    width: 52, height: 52, borderRadius: radii.sm,
    alignItems: "center", justifyContent: "center",
    backgroundColor: colors.mintBg09, borderWidth: 1,
    borderColor: colors.mintBorder24, marginBottom: spacing.lg, overflow: "hidden",
  },
  brandText: {
    fontSize: typography.brandAuth, fontWeight: "800",
    letterSpacing: typography.letterSpacingMd, color: colors.brandMintText, marginBottom: spacing.xs,
  },
  welcomeText: { fontSize: typography.xl, fontWeight: "700", color: colors.white, marginBottom: 6 },
  subtitleText: {
    fontSize: typography.md, color: colors.textWhite45,
    letterSpacing: typography.letterSpacingMd, textAlign: "center",
  },
  card: {
    backgroundColor: colors.cardBg04, borderRadius: radii.lg,
    borderWidth: 1, borderColor: colors.cardBorder07,
    padding: spacing["2xl"], gap: spacing.xl,
  },
  createBtn: {
    height: 52, borderRadius: radii.md, backgroundColor: colors.accentGreen,
    alignItems: "center", justifyContent: "center", ...shadows.greenButtonCompact,
  },
  createBtnDisabled: { opacity: 0.6 },
  createBtnText: {
    fontSize: typography.lg, fontWeight: "700",
    color: colors.bgRoot, letterSpacing: typography.letterSpacingXl,
  },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: spacing.sm },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.cardBorder07 },
  dividerText: { fontSize: typography.sm, color: colors.textWhite30, letterSpacing: typography.letterSpacingMd },
  googleBtn: {
    height: 52, borderRadius: radii.md, borderWidth: 1,
    borderColor: colors.googleBorder10, backgroundColor: colors.cardBg04,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: spacing.sm,
  },
  googleBtnText: {
    fontSize: typography.base, fontWeight: "600",
    color: colors.textWhite75, letterSpacing: typography.letterSpacingMd,
  },
  footer: { alignItems: "center", marginTop: spacing["4xl"], gap: spacing.md },
  signInRow: { flexDirection: "row", alignItems: "center" },
  footerText: { fontSize: typography.md, color: colors.textWhite40 },
  footerLink: { fontSize: typography.md, fontWeight: "700", color: colors.accentGreen },
  termsText: {
    fontSize: typography.xs, color: colors.textWhite30, textAlign: "center",
    lineHeight: 18, letterSpacing: typography.letterSpacingMd, paddingHorizontal: spacing["3xl"],
  },
  termsLink: { color: colors.textWhite55, fontWeight: "600" },
});