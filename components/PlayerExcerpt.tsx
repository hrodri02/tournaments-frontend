import React from 'react';
import { View, ViewStyle, Text, StyleSheet } from 'react-native';
import { Player } from '@/entities/index';

type PlayerExcerptProps = {
    player: Player;
    style?: ViewStyle;
}

export function PlayerExcerpt({ player, style }: PlayerExcerptProps) {
    return (
        <View style={style}>
            <Text style={styles.title}>{player.firstName} {player.lastName}</Text>
            <Text style={styles.subtitle}>{player.position}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
    },
    subtitle: {
        fontSize: 14
    }
});