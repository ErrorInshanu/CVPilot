import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";
import { AppHeader } from "../../../components/AppHeader";
import { theme } from "../../../constants/theme";

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                header: ({ options }) => <AppHeader title={options.title ?? ""} />,
                tabBarStyle: {
                    backgroundColor: theme.navigation.tabBarBg,
                    borderTopColor: theme.navigation.tabBarBorder,
                    borderTopWidth: StyleSheet.hairlineWidth,
                    paddingTop: 4,
                },
                tabBarActiveTintColor: theme.navigation.tabBarActive,
                tabBarInactiveTintColor: theme.navigation.tabBarInactive,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: "600",
                },
                tabBarItemStyle: { paddingVertical: 4 },
                sceneContainerStyle: { backgroundColor: theme.colors.bgRoot },
            }}
        >
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="home-outline" size={size} color={color} />
                    ),
                    headerShown: false,
                }}
            />
            <Tabs.Screen
                name="builder"
                options={{
                    title: "Builder",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="construct-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="analyzer"
                options={{
                    title: "Analyzer",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="analytics-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="templates"
                options={{
                    title: "Templates",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="document-text-outline" size={size} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons name="person-outline" size={size} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
