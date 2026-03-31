import React from 'react';
import { View, ViewStyle, Text, StyleSheet } from 'react-native';
import { Player, Position } from '@/entities/index';
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';

type PlayerExcerptProps = {
    player: Player;
    style?: ViewStyle;
}

export function PlayerExcerpt({ player, style }: PlayerExcerptProps) {
    const { t } = useTranslation('teams')
    const PositionDisplay: Record<Position, string> = {
        'GOAL_KEEPER': t('goal_keeper_label'),
        'DEFENDER': t('defender_label'),
        'MIDFIELDER': t('midfielder_label'),
        'STRIKER': t('striker_label'),
        'WINGER': t('winger_label')
    };

    return (
        <View style={style}>
            <Ionicons name="person-circle" size={24} color="black"/>
            <View>
                <Text style={styles.title}>{player.firstName} {player.lastName}</Text>
                <Text style={styles.subtitle}>{PositionDisplay[player.position]}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 16,
        fontWeight: 'bold'
    },
    subtitle: {
        fontSize: 14
    }
});