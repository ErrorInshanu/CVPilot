import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import {
    Animated,
    Dimensions,
    Easing,
    Image,
    Platform,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { theme } from "../constants/theme";

export default function Home() {
    const router = useRouter();
    const { width, height } = Dimensions.get("window");

    const dots = useMemo(
        () => [
            { x: width * 0.28, y: height * 0.34, size: 7, delay: 0 },
            { x: width * 0.66, y: height * 0.44, size: 6, delay: 220 },
            { x: width * 0.52, y: height * 0.63, size: 8, delay: 420 },
        ],
        [width, height]
    );

    const dotAnims = useRef(dots.map(() => new Animated.Value(0))).current;

    // Entrance anims
    const logoAnim   = useRef(new Animated.Value(0)).current;
    const titleAnim  = useRef(new Animated.Value(0)).current;
    const taglineAnim = useRef(new Animated.Value(0)).current;
    const buttonAnim = useRef(new Animated.Value(0)).current;

    // Continuous anims
    const pressScale  = useRef(new Animated.Value(1)).current;
    const glowPulse   = useRef(new Animated.Value(0)).current;
    const logoFloat   = useRef(new Animated.Value(0)).current;

    // Dot float loop
    useEffect(() => {
        const loops = dotAnims.map((v, i) =>
            Animated.loop(
                Animated.sequence([
                    Animated.delay(dots[i]?.delay ?? 0),
                    Animated.timing(v, { toValue: 1, duration: 1800, useNativeDriver: true }),
                    Animated.timing(v, { toValue: 0, duration: 1800, useNativeDriver: true }),
                ])
            )
        );
        loops.forEach((l) => l.start());
        return () => loops.forEach((l) => l.stop());
    }, [dotAnims, dots]);

    // Entrance sequence + continuous loops
    useEffect(() => {
        logoAnim.setValue(0);
        titleAnim.setValue(0);
        taglineAnim.setValue(0);
        buttonAnim.setValue(0);
        glowPulse.setValue(0);
        logoFloat.setValue(0);

        // Logo drops in with bounce
        const logoEntrance = Animated.sequence([
            Animated.timing(logoAnim, {
                toValue: 1,
                duration: 750,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true,
            }),
        ]);

        // Title fades up
        const titleEntrance = Animated.timing(titleAnim, {
            toValue: 1,
            duration: 480,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        });

        // Tagline fades up
        const taglineEntrance = Animated.timing(taglineAnim, {
            toValue: 1,
            duration: 480,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        });

        // Button fades up
        const buttonEntrance = Animated.timing(buttonAnim, {
            toValue: 1,
            duration: 480,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
        });

        // Glow pulse loop
        const glowLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(glowPulse, {
                    toValue: 1,
                    duration: 2200,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(glowPulse, {
                    toValue: 0,
                    duration: 2200,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        );

        // Subtle float loop on logo
        const floatLoop = Animated.loop(
            Animated.sequence([
                Animated.timing(logoFloat, {
                    toValue: 1,
                    duration: 2800,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
                Animated.timing(logoFloat, {
                    toValue: 0,
                    duration: 2800,
                    easing: Easing.inOut(Easing.sin),
                    useNativeDriver: true,
                }),
            ])
        );

        Animated.parallel([
            logoEntrance,
            Animated.sequence([Animated.delay(600),  titleEntrance]),
            Animated.sequence([Animated.delay(780),  taglineEntrance]),
            Animated.sequence([Animated.delay(1000), buttonEntrance]),
            Animated.sequence([Animated.delay(900),  glowLoop]),
            Animated.sequence([Animated.delay(900),  floatLoop]),
        ]).start();
    }, [logoAnim, titleAnim, taglineAnim, buttonAnim, glowPulse, logoFloat]);

    // Logo entrance interpolations
    const logoOpacity = logoAnim.interpolate({
        inputRange: [0, 0.3, 1],
        outputRange: [0, 1, 1],
    });
    const logoScale = logoAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.6, 1],
    });
    const logoTranslateY = logoAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-30, 0],
    });

    // Float offset (runs after entrance)
    const floatY = logoFloat.interpolate({
        inputRange: [0, 1],
        outputRange: [0, -10],
    });

    // Glow ring
    const glowOpacity = glowPulse.interpolate({
        inputRange: [0, 1],
        outputRange: [0.15, 0.45],
    });
    const glowScale = glowPulse.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 1.18],
    });

    // Title
    const titleOpacity = titleAnim;
    const titleY = titleAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [14, 0],
    });

    // Tagline
    const taglineOpacity = taglineAnim;
    const taglineY = taglineAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [14, 0],
    });

    // Button
    const buttonOpacity = buttonAnim;
    const buttonY = buttonAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0],
    });

    const handlePressIn = () => {
        Animated.spring(pressScale, {
            toValue: 0.955,
            useNativeDriver: true,
            speed: 30,
            bounciness: 4,
        }).start();
    };

    const handlePressOut = () => {
        Animated.spring(pressScale, {
            toValue: 1,
            useNativeDriver: true,
            speed: 24,
            bounciness: 6,
        }).start();
    };

    return (
        <View style={styles.root}>
            {/* Background layers */}
            <View style={styles.background}>
                <View style={styles.bgBase} />
                <View style={styles.glowA} />
                <View style={styles.glowB} />
                <View style={styles.vignette} />
            </View>

            {/* Floating dots */}
            {dots.map((d, idx) => {
                const t = dotAnims[idx] ?? new Animated.Value(0);
                const translateY = t.interpolate({ inputRange: [0, 1], outputRange: [0, -14] });
                const scale = t.interpolate({ inputRange: [0, 1], outputRange: [1, 1.25] });
                const opacity = t.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.55, 1, 0.6] });
                return (
                    <Animated.View
                        key={`dot-${idx}`}
                        pointerEvents="none"
                        style={[
                            styles.dot,
                            {
                                left: d.x, top: d.y,
                                width: d.size, height: d.size,
                                borderRadius: d.size / 2,
                                opacity,
                                transform: [{ translateY }, { scale }],
                            },
                        ]}
                    />
                );
            })}

            <SafeAreaView style={styles.safe} />

            {/* Center content */}
            <View style={styles.content}>
                <View style={styles.centerBlock}>

                    {/* Glow ring behind logo */}
                    <Animated.View
                        pointerEvents="none"
                        style={[
                            styles.glowRing,
                            {
                                opacity: glowOpacity,
                                transform: [{ scale: glowScale }],
                            },
                        ]}
                    />

                    {/* Logo — big, centered */}
                    <Animated.View
                        style={[
                            styles.logoWrap,
                            {
                                opacity: logoOpacity,
                                transform: [
                                    { translateY: logoTranslateY },
                                    { scale: logoScale },
                                ],
                            },
                        ]}
                    >
                        {/* Float wrapper — separate so entrance and float don't conflict */}
                        <Animated.View style={{ transform: [{ translateY: floatY }] }}>
                            <Image
                                source={require("../assets/images/cvlogoo.png")}
                                style={styles.logoImage}
                                resizeMode="contain"
                            />
                        </Animated.View>
                    </Animated.View>

                    {/* CVPilot title */}
                    <Animated.Text
                        style={[
                            styles.brandText,
                            {
                                opacity: titleOpacity,
                                transform: [{ translateY: titleY }],
                            },
                        ]}
                    >
                        CVPilot
                    </Animated.Text>

                    {/* Tagline */}
                    <Animated.Text
                        style={[
                            styles.tagline,
                            {
                                opacity: taglineOpacity,
                                transform: [{ translateY: taglineY }],
                            },
                        ]}
                    >
                        Build Smarter Resumes with AI
                    </Animated.Text>
                </View>
            </View>

            {/* Get Started button */}
            <Animated.View
                style={[
                    styles.buttonWrapper,
                    {
                        opacity: buttonOpacity,
                        transform: [{ translateY: buttonY }],
                    },
                ]}
            >
                <Pressable
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                    onPress={() => router.push("/sign-in")}
                    accessibilityRole="button"
                    accessibilityLabel="Get Started"
                >
                    <Animated.View
                        style={[styles.button, { transform: [{ scale: pressScale }] }]}
                    >
                        <Text style={styles.buttonLabel}>Get Started</Text>
                        <View style={styles.buttonIconWrap}>
                            <Ionicons
                                name="arrow-forward"
                                size={16}
                                color={theme.colors.bgRoot}
                            />
                        </View>
                    </Animated.View>
                </Pressable>
                <Text style={styles.buttonSubtext}>No account needed to begin</Text>
            </Animated.View>

            <SafeAreaView style={styles.safeBottom} />
        </View>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: theme.colors.bgRoot,
    },
    background: {
        ...StyleSheet.absoluteFillObject,
    },
    bgBase: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.colors.bgBase,
    },
    glowA: {
        position: "absolute",
        left: -120,
        top: -160,
        width: 420,
        height: 420,
        borderRadius: 210,
        backgroundColor: theme.colors.accentGreenGlow,
        opacity: 0.16,
    },
    glowB: {
        position: "absolute",
        right: -140,
        bottom: -180,
        width: 520,
        height: 520,
        borderRadius: 260,
        backgroundColor: theme.colors.accentTealGlow,
        opacity: 0.12,
    },
    vignette: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: theme.colors.vignette,
        opacity: 0.35,
    },
    safe: {
        height: Platform.OS === "android" ? 8 : 0,
    },
    safeBottom: {
        height: Platform.OS === "android" ? 20 : 0,
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: theme.spacing["3xl"],
    },
    centerBlock: {
        alignItems: "center",
    },

    // Glow ring
    glowRing: {
        position: "absolute",
        width: 160,
        height: 160,
        borderRadius: 40,
        backgroundColor: theme.colors.accentGreenGlow,
    },

    // Logo
    logoWrap: {
        alignItems: "center",
        justifyContent: "center",
        marginBottom: theme.spacing["2xl"],
        marginTop: 30,   // 👈 increase or decrease this number

    },
    logoImage: {
        width: 120,
        height: 120,
    },

    // Text
    brandText: {
        fontSize: theme.typography.brandHome,
        fontWeight: "800",
        letterSpacing: theme.typography.letterSpacingMd,
        color: theme.colors.brandMintText,
        marginBottom: theme.spacing.xs,
    },
    tagline: {
        fontSize: theme.typography.md,
        letterSpacing: theme.typography.letterSpacingLg,
        color: theme.colors.textWhite70,
        textAlign: "center",
    },

    // Dots
    dot: {
        position: "absolute",
        backgroundColor: theme.colors.dotRed,
        ...theme.shadows.redDot,
    },

    // Button
    buttonWrapper: {
        alignItems: "center",
        paddingHorizontal: theme.spacing["5xl"],
        paddingBottom: Platform.OS === "android" ? 28 : 36,
        gap: theme.spacing.md,
    },
    button: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: theme.spacing.sm,
        paddingVertical: 15,
        paddingHorizontal: 36,
        borderRadius: theme.radii.xl,
        backgroundColor: theme.colors.accentGreen,
        ...theme.shadows.greenButton,
        minWidth: 220,
    },
    buttonLabel: {
        fontSize: theme.typography.lg,
        fontWeight: "700",
        letterSpacing: theme.typography.letterSpacingXl,
        color: theme.colors.bgRoot,
    },
    buttonIconWrap: {
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: theme.colors.buttonIconBg15,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonSubtext: {
        fontSize: theme.typography.xs,
        color: theme.colors.textWhite32,
        letterSpacing: theme.typography.letterSpacingMd,
    },
});