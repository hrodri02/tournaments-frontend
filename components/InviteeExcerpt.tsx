import React from 'react';
import { 
    View, 
    ViewStyle, 
    Text, 
    StyleSheet } from 'react-native';
import { 
    Player, 
    TeamInvite, 
    TeamInviteStatus 
} from '@/entities/index';
import { useTranslation } from 'react-i18next';

type InviteeExcerptProps = {
    invite: TeamInvite;
    player: Player;
    style?: ViewStyle;
}

export function InviteeExcerpt({ invite, player, style }: InviteeExcerptProps) {
    const { t } = useTranslation('teams');
    const TeamInviteStatusDisplay: Record<TeamInviteStatus, string> = {
        'PENDING': t('pending_invites.pending_label'),
        'ACCEPTED': t('pending_invites.accepted_label'),
        'DECLINED': t('pending_invites.declined_label'),
        'REVOKED': t('pending_invites.revoked_label'),
    };
    return (
        <View style={style}>
            <Text style={styles.title}>{player.firstName} {player.lastName}</Text>
            <Text>{TeamInviteStatusDisplay[invite.status]}</Text>
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