import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
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
import { colors, radii, shadows, spacing, typography } from "../constants/theme";

export default function SignUp() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const [focusedField, setFocusedField] = useState(null);

  // Entrance animations
  const logoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const footerAnim = useRef(new Animated.Value(0)).current;

  // Press scales
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

  return (
    <View style={styles.root}>
      {/* Background */}
      <View style={styles.bgBase} />
      <View style={styles.glowA} />
      <View style={styles.glowB} />
      <View style={styles.vignette} />

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
              <Ionicons name="paper-plane" size={28} color={colors.brandMint} />
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
            {/* Full Name */}
            <Field
              label="Full Name"
              icon="person-outline"
              placeholder="John Doe"
              value={fullName}
              onChangeText={setFullName}
              focused={isFocused("name")}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              autoCapitalize="words"
            />

            {/* Email */}
            <Field
              label="Email"
              icon="mail-outline"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              focused={isFocused("email")}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Password */}
            <Field
              label="Password"
              icon="lock-closed-outline"
              placeholder="••••••••"
              value={password}
              onChangeText={setPassword}
              focused={isFocused("password")}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              secureTextEntry={!passwordVisible}
              autoCapitalize="none"
              rightIcon={
                <Pressable
                  onPress={() => setPasswordVisible((v) => !v)}
                  hitSlop={8}
                >
                  <Ionicons
                    name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                    size={18}
                    color={colors.inputIconDefault}
                  />
                </Pressable>
              }
            />

            {/* Confirm Password */}
            <Field
              label="Confirm Password"
              icon="shield-checkmark-outline"
              placeholder="••••••••"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              focused={isFocused("confirm")}
              onFocus={() => setFocusedField("confirm")}
              onBlur={() => setFocusedField(null)}
              secureTextEntry={!confirmVisible}
              autoCapitalize="none"
              rightIcon={
                <Pressable
                  onPress={() => setConfirmVisible((v) => !v)}
                  hitSlop={8}
                >
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
              onPress={() => {}}
              accessibilityRole="button"
              accessibilityLabel="Create Account"
            >
              <Animated.View
                style={[
                  styles.createBtn,
                  { transform: [{ scale: createScale }] },
                ]}
              >
                <Text style={styles.createBtnText}>Create Account</Text>
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
              <Animated.View
                style={[
                  styles.googleBtn,
                  { transform: [{ scale: googleScale }] },
                ]}
              >
                <Svg width="20" height="20" viewBox="0 0 48 48">
                  <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  <Path fill="none" d="M0 0h48v48H0z" />
                </Svg>
                <Text style={styles.googleBtnText}>Continue with Google</Text>
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
            <View style={styles.signInRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Pressable onPress={() => {}}>
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

// ─── Reusable Field Component ───────────────────────────────────────────────
function Field({
  label,
  icon,
  placeholder,
  value,
  onChangeText,
  focused,
  onFocus,
  onBlur,
  secureTextEntry,
  keyboardType,
  autoCapitalize,
  rightIcon,
}) {
  return (
    <View style={fieldStyles.group}>
      <Text style={fieldStyles.label}>{label}</Text>
      <View style={[fieldStyles.inputWrap, focused && fieldStyles.inputWrapFocused]}>
        <Ionicons
          name={icon}
          size={18}
          color={focused ? colors.accentGreen : colors.inputIconDefault}
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
    </View>
  );
}

const fieldStyles = StyleSheet.create({
  group: {
    gap: spacing.xs,
  },
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
  inputIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: typography.base,
    color: colors.white,
    letterSpacing: typography.letterSpacingMd,
  },
});

// ─── Screen Styles ───────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  flex: { flex: 1 },
  root: {
    flex: 1,
    backgroundColor: colors.bgRoot,
  },
  bgBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.bgBase,
  },
  glowA: {
    position: "absolute",
    left: -100,
    top: -120,
    width: 340,
    height: 340,
    borderRadius: 170,
    backgroundColor: colors.accentGreenGlow,
    opacity: 0.13,
  },
  glowB: {
    position: "absolute",
    right: -120,
    bottom: -140,
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: colors.accentTealGlow,
    opacity: 0.09,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.vignette,
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
    paddingHorizontal: spacing["3xl"],
    paddingTop: spacing["7xl"],
    paddingBottom: spacing["5xl"],
  },

  // Logo block
  logoBlock: {
    alignItems: "center",
    marginBottom: spacing["5xl"],
  },
  logoMark: {
    width: 52,
    height: 52,
    borderRadius: radii.sm,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.mintBg09,
    borderWidth: 1,
    borderColor: colors.mintBorder24,
    marginBottom: spacing.lg,
  },
  brandText: {
    fontSize: typography.brandAuth,
    fontWeight: "800",
    letterSpacing: typography.letterSpacingMd,
    color: colors.brandMintText,
    marginBottom: spacing.xs,
  },
  welcomeText: {
    fontSize: typography.xl,
    fontWeight: "700",
    color: colors.white,
    marginBottom: 6,
  },
  subtitleText: {
    fontSize: typography.md,
    color: colors.textWhite45,
    letterSpacing: typography.letterSpacingMd,
    textAlign: "center",
  },

  // Card
  card: {
    backgroundColor: colors.cardBg04,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.cardBorder07,
    padding: spacing["2xl"],
    gap: spacing.xl,
  },

  // Create Account button
  createBtn: {
    height: 52,
    borderRadius: radii.md,
    backgroundColor: colors.accentGreen,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.greenButtonCompact,
  },
  createBtnText: {
    fontSize: typography.lg,
    fontWeight: "700",
    color: colors.bgRoot,
    letterSpacing: typography.letterSpacingXl,
  },

  // Divider
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.cardBorder07,
  },
  dividerText: {
    fontSize: typography.sm,
    color: colors.textWhite30,
    letterSpacing: typography.letterSpacingMd,
  },

  // Google button
  googleBtn: {
    height: 52,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.googleBorder10,
    backgroundColor: colors.cardBg04,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
  },
  googleBtnText: {
    fontSize: typography.base,
    fontWeight: "600",
    color: colors.textWhite75,
    letterSpacing: typography.letterSpacingMd,
  },

  // Footer
  footer: {
    alignItems: "center",
    marginTop: spacing["4xl"],
    gap: spacing.md,
  },
  signInRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  footerText: {
    fontSize: typography.md,
    color: colors.textWhite40,
  },
  footerLink: {
    fontSize: typography.md,
    fontWeight: "700",
    color: colors.accentGreen,
  },
  termsText: {
    fontSize: typography.xs,
    color: colors.textWhite30,
    textAlign: "center",
    lineHeight: 18,
    letterSpacing: typography.letterSpacingMd,
    paddingHorizontal: spacing["3xl"],
  },
  termsLink: {
    color: colors.textWhite55,
    fontWeight: "600",
  },
}); 