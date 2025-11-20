import React from 'react';
import { 
    StyleSheet,
    View,
    Text,
    Pressable,
    FlatList
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ApplicationsPage() {
    return (
        <SafeAreaView style={[styles.safeAreaContainer, styles.perfectCentering]}>
            <Text>Applications</Text>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1
    },
    container: {
        flex: 1
    },
    perfectCentering: {
        justifyContent: 'center',
        alignItems: 'center'
    },
});