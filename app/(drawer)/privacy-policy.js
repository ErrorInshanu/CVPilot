import { StyleSheet, View } from "react-native";
import { AppHeader } from "../../components/AppHeader";
import { PlaceholderScreenBody } from "../../components/PlaceholderScreenBody";
import { theme } from "../../constants/theme";

export default function PrivacyPolicyScreen() {
    return (
        <View style={styles.shell}>
            <AppHeader title="Privacy Policy" />
            <PlaceholderScreenBody title="Privacy Policy" hint="Coming soon." />
        </View>
    );
}

const styles = StyleSheet.create({
    shell: {
        flex: 1,
        backgroundColor: theme.colors.bgRoot,
    },
});
