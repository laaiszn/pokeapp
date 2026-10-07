import ListFavorites from "@/components/ListFavorites/ListFavorites";
import { StyleSheet } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Favoritos() {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <ListFavorites />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F7FAFC",
    },
});