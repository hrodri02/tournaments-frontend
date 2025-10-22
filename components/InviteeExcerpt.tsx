import React, { useMemo } from 'react';
import { View, ViewStyle, Text, StyleSheet } from 'react-native';
import { Player, TeamInvite } from '@/entities/index';

type InviteeExcerptProps = {
    invite: TeamInvite;
    player: Player;
    style?: ViewStyle;
}

export function InviteeExcerpt({ invite, player, style }: InviteeExcerptProps) {
    return (
        <View style={style}>
            <Text style={styles.title}>{player.firstName} {player.lastName}</Text>
            <Text>{invite.status}</Text>
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