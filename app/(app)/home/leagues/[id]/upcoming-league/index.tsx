import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function UpcomingLeaguePage() {
    return (
        <View style={[styles.container, styles.perfectCentering]}>
            <Text>Teams in league</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    perfectCentering: {
        justifyContent: 'center',
        alignItems: 'center'
    }
});