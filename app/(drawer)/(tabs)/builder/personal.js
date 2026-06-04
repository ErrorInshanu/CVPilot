import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { theme } from "../../../../constants/theme";
import { saveActiveResumeToBackend } from "../../../../services/resumeSyncService";
import { useResumeStore } from "../../../../store/resumeStore";

function readPersonalFromStore() {
  const p = useResumeStore.getState().activeResume.personal;
  return {
    fullName: p.fullName ?? "",
    jobTitle: p.jobTitle ?? "",
    email: p.email ?? "",
    phone: p.phone ?? "",
    location: p.location ?? "",
    linkedin: p.linkedin ?? "",
    github: p.github ?? "",
    website: p.website ?? "",
    summary: p.summary ?? "",
  };
}

function LabeledInput({
  label,
  icon,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  autoCapitalize = "sentences",
  multiline = false,
  focused,
  onFocus,
  onBlur,
}) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View
        style={[
          styles.inputWrap,
          multiline && styles.inputWrapMultiline,
          focused && styles.inputWrapFocused,
        ]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={
            focused ? theme.colors.accentGreen : theme.colors.inputIconDefault
          }
          style={[styles.inputIcon, multiline && styles.inputIconMultiline]}
        />
        <TextInput
          style={[styles.input, multiline && styles.inputMultiline]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.colors.inputPlaceholder}
          onFocus={onFocus}
          onBlur={onBlur}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={!multiline}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          selectionColor={theme.colors.accentGreen}
        />
      </View>
    </View>
  );
}

export default function PersonalInfoScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const updatePersonal = useResumeStore((s) => s.updatePersonal);
  const markSaved = useResumeStore((s) => s.markSaved);

  const [form, setForm] = useState(readPersonalFromStore);
  const [focusedKey, setFocusedKey] = useState(null);
  const saveScale = useRef(new Animated.Value(1)).current;
  const savedOpacity = useRef(new Animated.Value(0)).current;

  const screenEnter = useRef(new Animated.Value(0)).current;

  useFocusEffect(
    useCallback(() => {
      setForm(readPersonalFromStore());
    }, [])
  );

  useEffect(() => {
    screenEnter.setValue(0);
    Animated.timing(screenEnter, {
      toValue: 1,
      duration: 520,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [screenEnter]);

  const enterOpacity = screenEnter;
  const enterTranslateY = screenEnter.interpolate({
    inputRange: [0, 1],
    outputRange: [24, 0],
  });

  const patchField = (key, text) => {
    setForm((prev) => ({ ...prev, [key]: text }));
  };

  const handleSave = async () => {
    updatePersonal({
      fullName: form.fullName.trim(),
      jobTitle: form.jobTitle.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      location: form.location.trim(),
      linkedin: form.linkedin.trim(),
      github: form.github.trim(),
      website: form.website.trim(),
      summary: form.summary.trim(),
    });
    markSaved();
    await saveActiveResumeToBackend();
    savedOpacity.setValue(0);
    Animated.sequence([
      Animated.timing(savedOpacity, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.delay(2000),
      Animated.timing(savedOpacity, {
        toValue: 0,
        duration: 240,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressIn = () => {
    Animated.spring(saveScale, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 30,
      bounciness: 4,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(saveScale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 24,
      bounciness: 6,
    }).start();
  };

  return (
    <View style={styles.root}>
      <View style={styles.bgBase} />
      <View style={styles.glowA} />
      <View style={styles.vignette} />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={[
            styles.scrollContent,
            {
              paddingTop: insets.top + theme.spacing.md,
              paddingBottom: insets.bottom + theme.spacing["5xl"],
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={[
              styles.enterBlock,
              {
                opacity: enterOpacity,
                transform: [{ translateY: enterTranslateY }],
              },
            ]}
          >
            <View style={styles.topBar}>
              <Pressable
                onPress={() => router.back()}
                style={styles.backBtn}
                hitSlop={12}
                accessibilityRole="button"
                accessibilityLabel="Go back"
              >
                <Ionicons
                  name="chevron-back"
                  size={22}
                  color={theme.colors.white}
                />
              </Pressable>
              <Text style={styles.screenTitle}>Personal Info</Text>
              <View style={styles.topBarSpacer} />
            </View>

            <Text style={styles.screenSub}>
              Name, contact details, and professional summary
            </Text>

            <View style={styles.formCard}>
              <LabeledInput
                label="Full Name"
                icon="person-outline"
                value={form.fullName}
                onChangeText={(t) => patchField("fullName", t)}
                placeholder="Jane Doe"
                focused={focusedKey === "fullName"}
                onFocus={() => setFocusedKey("fullName")}
                onBlur={() => setFocusedKey(null)}
              />

              <LabeledInput
                label="Job Title / Profession"
                icon="briefcase-outline"
                value={form.jobTitle}
                onChangeText={(t) => patchField("jobTitle", t)}
                placeholder="Product Designer"
                focused={focusedKey === "jobTitle"}
                onFocus={() => setFocusedKey("jobTitle")}
                onBlur={() => setFocusedKey(null)}
              />

              <LabeledInput
                label="Email"
                icon="mail-outline"
                value={form.email}
                onChangeText={(t) => patchField("email", t)}
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                focused={focusedKey === "email"}
                onFocus={() => setFocusedKey("email")}
                onBlur={() => setFocusedKey(null)}
              />

              <LabeledInput
                label="Phone"
                icon="call-outline"
                value={form.phone}
                onChangeText={(t) => patchField("phone", t)}
                placeholder="+1 555 000 0000"
                keyboardType="phone-pad"
                focused={focusedKey === "phone"}
                onFocus={() => setFocusedKey("phone")}
                onBlur={() => setFocusedKey(null)}
              />

              <LabeledInput
                label="Location (City, Country)"
                icon="location-outline"
                value={form.location}
                onChangeText={(t) => patchField("location", t)}
                placeholder="San Francisco, USA"
                focused={focusedKey === "location"}
                onFocus={() => setFocusedKey("location")}
                onBlur={() => setFocusedKey(null)}
              />

              <LabeledInput
                label="LinkedIn URL"
                icon="logo-linkedin"
                value={form.linkedin}
                onChangeText={(t) => patchField("linkedin", t)}
                placeholder="https://linkedin.com/in/…"
                keyboardType="url"
                autoCapitalize="none"
                focused={focusedKey === "linkedin"}
                onFocus={() => setFocusedKey("linkedin")}
                onBlur={() => setFocusedKey(null)}
              />

              <LabeledInput
                label="GitHub URL"
                icon="logo-github"
                value={form.github}
                onChangeText={(t) => patchField("github", t)}
                placeholder="https://github.com/username"
                keyboardType="url"
                autoCapitalize="none"
                focused={focusedKey === "github"}
                onFocus={() => setFocusedKey("github")}
                onBlur={() => setFocusedKey(null)}
              />

              <LabeledInput
                label="Portfolio / Website URL"
                icon="globe-outline"
                value={form.website}
                onChangeText={(t) => patchField("website", t)}
                placeholder="https://yourportfolio.com"
                keyboardType="url"
                autoCapitalize="none"
                focused={focusedKey === "website"}
                onFocus={() => setFocusedKey("website")}
                onBlur={() => setFocusedKey(null)}
              />

              <LabeledInput
                label="Professional Summary"
                icon="document-text-outline"
                value={form.summary}
                onChangeText={(t) => patchField("summary", t)}
                placeholder="Brief overview of your experience and goals…"
                multiline
                focused={focusedKey === "summary"}
                onFocus={() => setFocusedKey("summary")}
                onBlur={() => setFocusedKey(null)}
              />
            </View>

            <Animated.View
              style={[styles.savedRow, { opacity: savedOpacity }]}
              pointerEvents="none"
            >
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={theme.colors.accentGreen}
              />
              <Text style={styles.savedText}>Saved</Text>
            </Animated.View>

            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleSave}
              accessibilityRole="button"
              accessibilityLabel="Save personal info"
            >
              <Animated.View
                style={[styles.saveBtn, { transform: [{ scale: saveScale }] }]}
              >
                <Ionicons
                  name="checkmark-outline"
                  size={20}
                  color={theme.colors.bgRoot}
                />
                <Text style={styles.saveBtnText}>Save</Text>
              </Animated.View>
            </Pressable>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.bgRoot,
  },
  flex: { flex: 1 },
  bgBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.bgBase,
  },
  glowA: {
    position: "absolute",
    right: -100,
    top: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: theme.colors.accentGreenGlow,
    opacity: 0.08,
  },
  vignette: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: theme.colors.vignette,
    opacity: 0.3,
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: theme.spacing["3xl"],
    gap: theme.spacing.md,
  },
  enterBlock: {
    gap: theme.spacing.md,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backBtn: {
    width: theme.spacing["5xl"],
    height: theme.spacing["5xl"],
    borderRadius: theme.radii.sm,
    backgroundColor: theme.colors.cardBg04,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder07,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarSpacer: {
    width: theme.spacing["5xl"],
  },
  screenTitle: {
    fontSize: theme.typography.lg,
    fontWeight: "800",
    color: theme.colors.white,
    letterSpacing: theme.typography.letterSpacingMd,
  },
  screenSub: {
    fontSize: theme.typography.md,
    color: theme.colors.textWhite40,
    letterSpacing: theme.typography.letterSpacingMd,
    marginTop: -theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  formCard: {
    backgroundColor: theme.colors.cardBg04,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.cardBorder07,
    padding: theme.spacing["2xl"],
    gap: theme.spacing.lg,
  },
  fieldGroup: {
    gap: theme.spacing.sm,
  },
  fieldLabel: {
    fontSize: theme.typography.md,
    fontWeight: "600",
    color: theme.colors.textWhite60,
    letterSpacing: theme.typography.letterSpacingMd,
  },
  inputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.inputBg05,
    borderRadius: theme.radii.sm,
    borderWidth: 1,
    borderColor: theme.colors.inputBorder08,
    paddingHorizontal: theme.spacing.lg,
    minHeight: 50,
  },
  inputWrapMultiline: {
    alignItems: "flex-start",
    paddingVertical: theme.spacing.md,
    minHeight: 140,
  },
  inputWrapFocused: {
    borderColor: theme.colors.inputFocusBorder45,
    backgroundColor: theme.colors.inputFocusBg04,
  },
  inputIcon: {
    marginRight: theme.spacing.sm,
  },
  inputIconMultiline: {
    marginTop: theme.spacing.xs,
  },
  input: {
    flex: 1,
    fontSize: theme.typography.base,
    color: theme.colors.white,
    letterSpacing: theme.typography.letterSpacingMd,
    paddingVertical: 0,
  },
  inputMultiline: {
    minHeight: 120,
    paddingTop: theme.spacing.xs,
  },
  savedRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    minHeight: theme.spacing["2xl"],
  },
  savedText: {
    fontSize: theme.typography.md,
    fontWeight: "700",
    color: theme.colors.accentGreen,
    letterSpacing: theme.typography.letterSpacingMd,
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    height: 52,
    borderRadius: theme.radii.md,
    backgroundColor: theme.colors.accentGreen,
    ...theme.shadows.greenButtonCompact,
  },
  saveBtnText: {
    fontSize: theme.typography.lg,
    fontWeight: "700",
    color: theme.colors.bgRoot,
    letterSpacing: theme.typography.letterSpacingXl,
  },
});
