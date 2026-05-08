import { StyleSheet, View } from "react-native";
import { AppHeader } from "../../components/AppHeader";
import { PlaceholderScreenBody } from "../../components/PlaceholderScreenBody";
import { theme } from "../../constants/theme";

export default function TermsOfServiceScreen() {
    return (
        <View style={styles.shell}>
            <AppHeader title="Terms of Service" />
            <PlaceholderScreenBody title="Terms of Service" hint="Coming soon." />
        </View>
    );
}

const styles = StyleSheet.create({
    shell: {
        flex: 1,
        backgroundColor: theme.colors.bgRoot,
    },
});
