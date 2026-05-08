import { StyleSheet, View } from "react-native";
import { AppHeader } from "../../components/AppHeader";
import { PlaceholderScreenBody } from "../../components/PlaceholderScreenBody";
import { theme } from "../../constants/theme";

export default function SettingsScreen() {
    return (
        <View style={styles.shell}>
            <AppHeader title="Settings" />
            <PlaceholderScreenBody title="Settings" />
        </View>
    );
}

const styles = StyleSheet.create({
    shell: {
        flex: 1,
        backgroundColor: theme.colors.bgRoot,
    },
});
