import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ENDPOINTS } from "../../constants/api";
import { theme } from "../../constants/theme";
import { useAuth } from "../../hooks/useAuth";

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, visible }) {
    const translateY = useRef(new Animated.Value(-80)).current;
    const opacity    = useRef(new Animated.Value(0)).current;

    Animated.parallel([
        Animated.timing(translateY, {
            toValue: visible ? 0 : -80,
            duration: visible ? 360 : 280,
            useNativeDriver: true,
        }),
        Animated.timing(opacity, {
            toValue: visible ? 1 : 0,
            duration: visible ? 300 : 240,
            useNativeDriver: true,
        }),
    ]).start();

    return (
        <Animated.View
            pointerEvents="none"
            style={[
                toastStyles.wrap,
                type === "success" ? toastStyles.success : toastStyles.error,
                { transform: [{ translateY }], opacity },
            ]}
        >
            <Ionicons
                name={type === "success" ? "checkmark-circle" : "alert-circle"}
                size={18}
                color={type === "success" ? "#4ADE80" : "#EF5350"}
            />
            <Text style={toastStyles.text}>{message}</Text>
        </Animated.View>
    );
}

const toastStyles = StyleSheet.create({
    wrap: {
        position: "absolute",
        top: Platform.OS === "android" ? 48 : 56,
        left: 24, right: 24, zIndex: 999,
        flexDirection: "row", alignItems: "center", gap: 10,
        paddingVertical: 14, paddingHorizontal: 16,
        borderRadius: 14, borderWidth: 1,
    },
    success: { backgroundColor: "rgba(74,222,128,0.08)", borderColor: "rgba(74,222,128,0.25)" },
    error:   { backgroundColor: "rgba(239,83,80,0.08)",  borderColor: "rgba(239,83,80,0.25)"  },
    text: { flex: 1, fontSize: 13, fontWeight: "600", color: "#fff", letterSpacing: 0.2 },
});

// ─── Input Field ──────────────────────────────────────────────────────────────
function InputField({ label, value, onChangeText, placeholder, secureTextEntry, keyboardType, error, autoCapitalize }) {
    const [focused, setFocused] = useState(false);
    const [visible, setVisible] = useState(false);
    const isPassword = secureTextEntry;

    return (
        <View style={inputStyles.group}>
            <Text style={inputStyles.label}>{label}</Text>
            <View style={[
                inputStyles.wrap,
                focused && inputStyles.wrapFocused,
                error  && inputStyles.wrapError,
            ]}>
                <TextInput
                    style={inputStyles.input}
                    placeholder={placeholder}
                    placeholderTextColor="#3A3A3A"
                    value={value}
                    onChangeText={onChangeText}
                    onFocus={() => setFocused(true)}
                    onBlur={() => setFocused(false)}
                    secureTextEntry={isPassword && !visible}
                    keyboardType={keyboardType || "default"}
                    autoCapitalize={autoCapitalize || "none"}
                    autoCorrect={false}
                />
                {isPassword && (
                    <Pressable onPress={() => setVisible(v => !v)} hitSlop={8}>
                        <Ionicons name={visible ? "eye-outline" : "eye-off-outline"} size={18} color="#555" />
                    </Pressable>
                )}
            </View>
            {error ? <Text style={inputStyles.error}>{error}</Text> : null}
        </View>
    );
}

const inputStyles = StyleSheet.create({
    group: { gap: 6 },
    label: { fontSize: 13, fontWeight: "600", color: theme.colors.textWhite60, letterSpacing: 0.2 },
    wrap: {
        flexDirection: "row", alignItems: "center",
        backgroundColor: theme.colors.inputBg05,
        borderRadius: theme.radii.sm,
        borderWidth: 1, borderColor: theme.colors.inputBorder08,
        paddingHorizontal: theme.spacing.lg, height: 50,
    },
    wrapFocused: { borderColor: theme.colors.inputFocusBorder45, backgroundColor: theme.colors.inputFocusBg04 },
    wrapError:   { borderColor: "rgba(239,83,80,0.5)", backgroundColor: "rgba(239,83,80,0.04)" },
    input: { flex: 1, fontSize: 14, color: theme.colors.white, letterSpacing: 0.2 },
    error: { fontSize: 11.5, color: "#EF5350", letterSpacing: 0.2, marginTop: 2 },
});

// ─── Section Header ───────────────────────────────────────────────────────────
function SectionHeader({ title }) {
    return <Text style={styles.sectionHeader}>{title}</Text>;
}

// ─── Settings Row ─────────────────────────────────────────────────────────────
function SettingsRow({ icon, iconColor, label, sublabel, onPress, rightElement, destructive }) {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    return (
        <Pressable
            onPressIn={() => Animated.spring(scaleAnim, { toValue: 0.98, useNativeDriver: true, speed: 30, bounciness: 4 }).start()}
            onPressOut={() => Animated.spring(scaleAnim, { toValue: 1,    useNativeDriver: true, speed: 24, bounciness: 6 }).start()}
            onPress={onPress}
        >
            <Animated.View style={[styles.settingsRow, { transform: [{ scale: scaleAnim }] }]}>
                <View style={[styles.rowIcon, { backgroundColor: `${iconColor}18` }]}>
                    <Ionicons name={icon} size={18} color={iconColor} />
                </View>
                <View style={styles.rowText}>
                    <Text style={[styles.rowLabel, destructive && styles.rowLabelDestructive]}>{label}</Text>
                    {sublabel ? <Text style={styles.rowSublabel}>{sublabel}</Text> : null}
                </View>
                {rightElement ?? (
                    <Ionicons name="chevron-forward" size={16} color={theme.colors.textWhite30} />
                )}
            </Animated.View>
        </Pressable>
    );
}

// ─── Bottom Sheet Modal ───────────────────────────────────────────────────────
function BottomSheet({ visible, onClose, title, children }) {
    const slideAnim = useRef(new Animated.Value(400)).current;
    const fadeAnim  = useRef(new Animated.Value(0)).current;

    if (visible) {
        Animated.parallel([
            Animated.spring(slideAnim, { toValue: 0, tension: 65, friction: 11, useNativeDriver: true }),
            Animated.timing(fadeAnim,  { toValue: 1, duration: 250, useNativeDriver: true }),
        ]).start();
    } else {
        Animated.parallel([
            Animated.timing(slideAnim, { toValue: 400, duration: 260, useNativeDriver: true }),
            Animated.timing(fadeAnim,  { toValue: 0,   duration: 200, useNativeDriver: true }),
        ]).start();
    }

    return (
        <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
            <Animated.View style={[sheetStyles.overlay, { opacity: fadeAnim }]}>
                <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
            </Animated.View>
            <Animated.View style={[sheetStyles.sheet, { transform: [{ translateY: slideAnim }] }]}>
                <View style={sheetStyles.handle} />
                <View style={sheetStyles.header}>
                    <Text style={sheetStyles.title}>{title}</Text>
                    <Pressable onPress={onClose} style={sheetStyles.closeBtn} hitSlop={12}>
                        <Ionicons name="close" size={20} color={theme.colors.white} />
                    </Pressable>
                </View>
                {children}
            </Animated.View>
        </Modal>
    );
}

const sheetStyles = StyleSheet.create({
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: "rgba(0,0,0,0.75)",
    },
    sheet: {
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        backgroundColor: theme.colors.bgBase,
        borderTopLeftRadius: 24, borderTopRightRadius: 24,
        borderTopWidth: 1, borderColor: theme.colors.cardBorder07,
        paddingHorizontal: 24, paddingBottom: 40,
    },
    handle: {
        width: 36, height: 4,
        backgroundColor: theme.colors.cardBorder07,
        borderRadius: 2, alignSelf: "center",
        marginTop: 12, marginBottom: 4,
    },
    header: {
        flexDirection: "row", alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 16,
        borderBottomWidth: 1, borderBottomColor: theme.colors.cardBorder07,
        marginBottom: 20,
    },
    title: { fontSize: 17, fontWeight: "800", color: theme.colors.white },
    closeBtn: {
        width: 32, height: 32, borderRadius: 10,
        backgroundColor: theme.colors.cardBg04,
        borderWidth: 1, borderColor: theme.colors.cardBorder07,
        alignItems: "center", justifyContent: "center",
    },
});

// ─── Main Settings Screen ─────────────────────────────────────────────────────
export default function SettingsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { user, token, signIn, signOut } = useAuth();

    const [toast, setToast] = useState({ visible: false, message: "", type: "success" });

    // Sheet states
    const [editProfileOpen,   setEditProfileOpen]   = useState(false);
    const [changePasswordOpen, setChangePasswordOpen] = useState(false);
    const [deleteAccountOpen,  setDeleteAccountOpen]  = useState(false);

    // Edit profile fields
    const [newName,  setNewName]  = useState(user?.name  || "");
    const [newEmail, setNewEmail] = useState(user?.email || "");
    const [nameError,  setNameError]  = useState("");
    const [emailError, setEmailError] = useState("");

    // Change password fields
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword,     setNewPassword]     = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentPwError,  setCurrentPwError]  = useState("");
    const [newPwError,      setNewPwError]      = useState("");
    const [confirmPwError,  setConfirmPwError]  = useState("");

    // Delete account fields
    const [deletePassword,      setDeletePassword]      = useState("");
    const [deletePasswordError, setDeletePasswordError] = useState("");

    // Loading states
    const [profileLoading,  setProfileLoading]  = useState(false);
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [deleteLoading,   setDeleteLoading]   = useState(false);

    const showToast = (message, type = "success") => {
        setToast({ visible: true, message, type });
        setTimeout(() => setToast(t => ({ ...t, visible: false })), 3000);
    };

    // ── Update Profile ────────────────────────────────────────────────────────
    const handleUpdateProfile = async () => {
        let valid = true;
        if (!newName.trim()) { setNameError("Name is required"); valid = false; }
        else setNameError("");
        if (!newEmail.trim()) { setEmailError("Email is required"); valid = false; }
        else if (!/^\S+@\S+\.\S+$/.test(newEmail)) { setEmailError("Enter a valid email"); valid = false; }
        else setEmailError("");
        if (!valid) return;

        setProfileLoading(true);
        try {
            const res  = await fetch(ENDPOINTS.updateProfile, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ name: newName.trim(), email: newEmail.trim() }),
            });
            const data = await res.json();
            if (!res.ok) { showToast(data.message || "Update failed", "error"); return; }

            // Update auth context with new name/email
            await signIn(token, { ...user, name: data.name, email: data.email });
            setEditProfileOpen(false);
            showToast("Profile updated successfully");
        } catch {
            showToast("Network error. Please try again.", "error");
        } finally {
            setProfileLoading(false);
        }
    };

    // ── Change Password ───────────────────────────────────────────────────────
    const handleChangePassword = async () => {
        let valid = true;
        if (!currentPassword) { setCurrentPwError("Current password is required"); valid = false; }
        else setCurrentPwError("");
        if (!newPassword) { setNewPwError("New password is required"); valid = false; }
        else if (newPassword.length < 6) { setNewPwError("At least 6 characters"); valid = false; }
        else setNewPwError("");
        if (!confirmPassword) { setConfirmPwError("Please confirm your password"); valid = false; }
        else if (confirmPassword !== newPassword) { setConfirmPwError("Passwords do not match"); valid = false; }
        else setConfirmPwError("");
        if (!valid) return;

        setPasswordLoading(true);
        try {
            const res  = await fetch(ENDPOINTS.changePassword, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) {
                if (res.status === 401) setCurrentPwError("Current password is incorrect");
                else showToast(data.message || "Failed to change password", "error");
                return;
            }
            setChangePasswordOpen(false);
            setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
            showToast("Password changed successfully");
        } catch {
            showToast("Network error. Please try again.", "error");
        } finally {
            setPasswordLoading(false);
        }
    };

    // ── Delete Account ────────────────────────────────────────────────────────
    const handleDeleteAccount = async () => {
        if (!deletePassword) { setDeletePasswordError("Password is required"); return; }
        setDeletePasswordError("");

        setDeleteLoading(true);
        try {
            const res  = await fetch(ENDPOINTS.deleteAccount, {
                method: "DELETE",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ password: deletePassword }),
            });
            const data = await res.json();
            if (!res.ok) {
                if (res.status === 401) setDeletePasswordError("Incorrect password");
                else showToast(data.message || "Failed to delete account", "error");
                return;
            }
            await signOut();
            router.replace("/sign-in");
        } catch {
            showToast("Network error. Please try again.", "error");
        } finally {
            setDeleteLoading(false);
        }
    };

    const confirmDelete = () => {
        Alert.alert(
            "Delete Account",
            "This will permanently delete your account and all your resumes. This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", style: "destructive", onPress: () => setDeleteAccountOpen(true) },
            ]
        );
    };

    const firstName = user?.name?.split(" ")[0] || user?.email || "User";

    return (
        <View style={[styles.root, { paddingTop: insets.top }]}>
            <Toast message={toast.message} type={toast.type} visible={toast.visible} />

            {/* ── Header ── */}
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={12}>
                    <Ionicons name="chevron-back" size={20} color={theme.colors.white} />
                </Pressable>
                <Text style={styles.headerTitle}>Settings</Text>
                <View style={{ width: 36 }} />
            </View>

            <ScrollView
                style={styles.scroll}
                contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 32 }]}
                showsVerticalScrollIndicator={false}
            >
                {/* ── Profile Card ── */}
                <View style={styles.profileCard}>
                    <View style={styles.profileAvatar}>
                        <Text style={styles.profileAvatarText}>
                            {(user?.name || user?.email || "U").charAt(0).toUpperCase()}
                        </Text>
                    </View>
                    <View style={styles.profileInfo}>
                        <Text style={styles.profileName}>{user?.name || "User"}</Text>
                        <Text style={styles.profileEmail}>{user?.email || ""}</Text>
                    </View>
                </View>

                {/* ── Account ── */}
                <SectionHeader title="ACCOUNT" />
                <View style={styles.group}>
                    <SettingsRow
                        icon="person-outline"
                        iconColor="#60A5FA"
                        label="Edit Profile"
                        sublabel="Change your name or email"
                        onPress={() => {
                            setNewName(user?.name || "");
                            setNewEmail(user?.email || "");
                            setNameError(""); setEmailError("");
                            setEditProfileOpen(true);
                        }}
                    />
                    <View style={styles.rowDivider} />
                    <SettingsRow
                        icon="lock-closed-outline"
                        iconColor="#A78BFA"
                        label="Change Password"
                        sublabel="Update your password"
                        onPress={() => {
                            setCurrentPassword(""); setNewPassword(""); setConfirmPassword("");
                            setCurrentPwError(""); setNewPwError(""); setConfirmPwError("");
                            setChangePasswordOpen(true);
                        }}
                    />
                </View>

                {/* ── Support ── */}
                <SectionHeader title="SUPPORT" />
                <View style={styles.group}>
                    <SettingsRow
                        icon="mail-outline"
                        iconColor="#4ADE80"
                        label="Contact Support"
                        sublabel="Get help from our team"
                        onPress={() => {
                            const email = "support@cvpilot.app";
                            const subject = "CVPilot Support Request";
                            const url = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
                            import("react-native").then(({ Linking }) => Linking.openURL(url));
                        }}
                    />
                    <View style={styles.rowDivider} />
                    <SettingsRow
                        icon="information-circle-outline"
                        iconColor="#FB923C"
                        label="App Version"
                        sublabel="CVPilot v1.0.0"
                        onPress={() => {}}
                        rightElement={
                            <Text style={styles.versionText}>1.0.0</Text>
                        }
                    />
                </View>

                {/* ── Danger Zone ── */}
                <SectionHeader title="DANGER ZONE" />
                <View style={styles.group}>
                    <SettingsRow
                        icon="trash-outline"
                        iconColor="#EF5350"
                        label="Delete Account"
                        sublabel="Permanently delete your account and all data"
                        onPress={confirmDelete}
                        destructive
                    />
                </View>
            </ScrollView>

            {/* ── Edit Profile Sheet ── */}
            <BottomSheet
                visible={editProfileOpen}
                onClose={() => setEditProfileOpen(false)}
                title="Edit Profile"
            >
                <View style={styles.sheetBody}>
                    <InputField
                        label="Full Name"
                        value={newName}
                        onChangeText={v => { setNewName(v); if (nameError) setNameError(""); }}
                        placeholder="Your full name"
                        autoCapitalize="words"
                        error={nameError}
                    />
                    <InputField
                        label="Email"
                        value={newEmail}
                        onChangeText={v => { setNewEmail(v); if (emailError) setEmailError(""); }}
                        placeholder="your@email.com"
                        keyboardType="email-address"
                        error={emailError}
                    />
                    <Pressable
                        style={[styles.sheetBtn, profileLoading && styles.sheetBtnDisabled]}
                        onPress={handleUpdateProfile}
                        disabled={profileLoading}
                    >
                        {profileLoading
                            ? <ActivityIndicator size="small" color={theme.colors.bgRoot} />
                            : <Text style={styles.sheetBtnText}>Save Changes</Text>
                        }
                    </Pressable>
                </View>
            </BottomSheet>

            {/* ── Change Password Sheet ── */}
            <BottomSheet
                visible={changePasswordOpen}
                onClose={() => setChangePasswordOpen(false)}
                title="Change Password"
            >
                <View style={styles.sheetBody}>
                    <InputField
                        label="Current Password"
                        value={currentPassword}
                        onChangeText={v => { setCurrentPassword(v); if (currentPwError) setCurrentPwError(""); }}
                        placeholder="Enter current password"
                        secureTextEntry
                        error={currentPwError}
                    />
                    <InputField
                        label="New Password"
                        value={newPassword}
                        onChangeText={v => { setNewPassword(v); if (newPwError) setNewPwError(""); }}
                        placeholder="At least 6 characters"
                        secureTextEntry
                        error={newPwError}
                    />
                    <InputField
                        label="Confirm New Password"
                        value={confirmPassword}
                        onChangeText={v => { setConfirmPassword(v); if (confirmPwError) setConfirmPwError(""); }}
                        placeholder="Repeat new password"
                        secureTextEntry
                        error={confirmPwError}
                    />
                    <Pressable
                        style={[styles.sheetBtn, passwordLoading && styles.sheetBtnDisabled]}
                        onPress={handleChangePassword}
                        disabled={passwordLoading}
                    >
                        {passwordLoading
                            ? <ActivityIndicator size="small" color={theme.colors.bgRoot} />
                            : <Text style={styles.sheetBtnText}>Update Password</Text>
                        }
                    </Pressable>
                </View>
            </BottomSheet>

            {/* ── Delete Account Sheet ── */}
            <BottomSheet
                visible={deleteAccountOpen}
                onClose={() => setDeleteAccountOpen(false)}
                title="Delete Account"
            >
                <View style={styles.sheetBody}>
                    <View style={styles.deleteWarning}>
                        <Ionicons name="warning-outline" size={22} color="#EF5350" />
                        <Text style={styles.deleteWarningText}>
                            This will permanently delete your account and all your resumes. This action cannot be undone.
                        </Text>
                    </View>
                    <InputField
                        label="Enter your password to confirm"
                        value={deletePassword}
                        onChangeText={v => { setDeletePassword(v); if (deletePasswordError) setDeletePasswordError(""); }}
                        placeholder="Your password"
                        secureTextEntry
                        error={deletePasswordError}
                    />
                    <Pressable
                        style={[styles.sheetBtn, styles.sheetBtnDestructive, deleteLoading && styles.sheetBtnDisabled]}
                        onPress={handleDeleteAccount}
                        disabled={deleteLoading}
                    >
                        {deleteLoading
                            ? <ActivityIndicator size="small" color="#fff" />
                            : <Text style={[styles.sheetBtnText, { color: "#fff" }]}>Delete My Account</Text>
                        }
                    </Pressable>
                </View>
            </BottomSheet>
        </View>
    );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: theme.colors.bgRoot },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.cardBorder07,
    },
    backBtn: {
        width: 36, height: 36,
        borderRadius: theme.radii.sm,
        backgroundColor: theme.colors.cardBg04,
        borderWidth: 1, borderColor: theme.colors.cardBorder07,
        alignItems: "center", justifyContent: "center",
    },
    headerTitle: {
        fontSize: 17, fontWeight: "800",
        color: theme.colors.white, letterSpacing: 0.2,
    },
    scroll: { flex: 1 },
    scrollContent: { paddingHorizontal: 20, paddingTop: 20, gap: 8 },

    // Profile card
    profileCard: {
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        backgroundColor: theme.colors.cardBg04,
        borderRadius: theme.radii.md,
        borderWidth: 1, borderColor: theme.colors.cardBorder07,
        padding: 16,
        marginBottom: 8,
    },
    profileAvatar: {
        width: 52, height: 52, borderRadius: 26,
        backgroundColor: "rgba(74,222,128,0.15)",
        borderWidth: 2, borderColor: "rgba(74,222,128,0.35)",
        alignItems: "center", justifyContent: "center",
    },
    profileAvatarText: { fontSize: 20, fontWeight: "800", color: theme.colors.accentGreen },
    profileInfo: { flex: 1 },
    profileName:  { fontSize: 16, fontWeight: "700", color: theme.colors.white },
    profileEmail: { fontSize: 12, color: theme.colors.textWhite40, marginTop: 2 },

    // Section header
    sectionHeader: {
        fontSize: 11, fontWeight: "700",
        color: theme.colors.textWhite30,
        letterSpacing: 1.5,
        marginTop: 12, marginBottom: 4,
        paddingHorizontal: 4,
    },

    // Group
    group: {
        backgroundColor: theme.colors.cardBg04,
        borderRadius: theme.radii.md,
        borderWidth: 1, borderColor: theme.colors.cardBorder07,
        overflow: "hidden",
    },

    // Row
    settingsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    rowIcon: {
        width: 36, height: 36,
        borderRadius: 10,
        alignItems: "center", justifyContent: "center",
    },
    rowText: { flex: 1 },
    rowLabel: { fontSize: 14, fontWeight: "600", color: theme.colors.white },
    rowLabelDestructive: { color: "#EF5350" },
    rowSublabel: { fontSize: 12, color: theme.colors.textWhite40, marginTop: 2 },
    rowDivider: { height: 1, backgroundColor: theme.colors.cardBorder07, marginLeft: 64 },
    versionText: { fontSize: 13, color: theme.colors.textWhite40, fontWeight: "600" },

    // Sheet body
    sheetBody: { gap: 16 },
    sheetBtn: {
        height: 52, borderRadius: theme.radii.md,
        backgroundColor: theme.colors.accentGreen,
        alignItems: "center", justifyContent: "center",
        marginTop: 4,
        ...theme.shadows.greenButtonCompact,
    },
    sheetBtnDestructive: { backgroundColor: "#EF5350", shadowColor: "#EF5350" },
    sheetBtnDisabled: { opacity: 0.6 },
    sheetBtnText: { fontSize: 15, fontWeight: "700", color: theme.colors.bgRoot, letterSpacing: 0.3 },

    // Delete warning
    deleteWarning: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 10,
        backgroundColor: "rgba(239,83,80,0.08)",
        borderRadius: theme.radii.sm,
        borderWidth: 1, borderColor: "rgba(239,83,80,0.2)",
        padding: 12,
    },
    deleteWarningText: { flex: 1, fontSize: 13, color: theme.colors.textWhite60, lineHeight: 19 },
});