import { View, StyleSheet } from "react-native";
import { AppHeader } from "../../components/AppHeader";
import { PlaceholderScreenBody } from "../../components/PlaceholderScreenBody";
import { theme } from "../../constants/theme";

export default function SavedResumesScreen() {
    return (
        <View style={styles.shell}>
            <AppHeader title="Saved Resumes" />
            <PlaceholderScreenBody title="Saved Resumes" />
        </View>
    );
}

const styles = StyleSheet.create({
    shell: {
        flex: 1,
        backgroundColor: theme.colors.bgRoot,
    },
});
