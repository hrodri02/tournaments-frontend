import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Dimensions
} from 'react-native';
import { TeamAvatar } from '@/components/TeamAvatar';
import { Link } from 'expo-router';
import { GameResponse } from '@/entities/index';
import { format } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

const screenHeight = Dimensions.get('window').height;

type GameExcerptProps = {
    game: GameResponse;
}

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 12,
        marginVertical: 6,
        borderRadius: 12,
        backgroundColor: '#ffffff',
        paddingVertical: 14,
        paddingHorizontal: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#e8e8e8',
    },
    matchupRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    teamSide: {
        flex: 1,
        alignItems: 'center',
        gap: 6,
    },
    teamName: {
        fontWeight: 'bold',
        fontSize: 14,
        textAlign: 'center',
    },
    vs: {
        fontSize: 14,
        fontWeight: '600',
        color: '#888',
        marginHorizontal: 8,
    },
    dateRow: {
        marginTop: 12,
        alignItems: 'center',
    },
    date: {
        fontSize: 13,
        color: '#555',
    },
})

export function GameExcerpt({ game }: GameExcerptProps) {
    const { t, i18n } = useTranslation('league');
    const locale = (['en-US', 'en'].includes(i18n.language)) ? enUS : es;
    const date = Date.parse(game.gameDateTime);
    const formattedDate = formatDate(date);
    const { id } = useLocalSearchParams();
    const leagueId = Number(id);

    function formatDate(date: number): string {
        const dateString = format(date, 'eee, MMM d pp', { locale });
        if (locale === enUS) {
            return dateString;
        }
        return dateString.charAt(0).toUpperCase() +
               dateString.slice(1, 5) +
               dateString.charAt(5).toUpperCase() +
               dateString.slice(6);
    }

    return (
        <Link href={{
            pathname: '/(app)/home/leagues/[id]/games/[gameId]',
            params: { id: leagueId, gameId: game.id }
        }} asChild>
            <Pressable>
                <View style={styles.card}>
                    <View style={styles.matchupRow}>
                        <View style={styles.teamSide}>
                            <TeamAvatar
                                logoUrl={game.homeTeam.logoUrl}
                                name={game.homeTeam.name}
                                size={screenHeight * 0.07}
                            />
                            <Text style={styles.teamName}>{game.homeTeam.name}</Text>
                        </View>

                        <Text style={styles.vs}>vs</Text>

                        <View style={styles.teamSide}>
                            <TeamAvatar
                                logoUrl={game.awayTeam.logoUrl}
                                name={game.awayTeam.name}
                                size={screenHeight * 0.07}
                            />
                            <Text style={styles.teamName}>{game.awayTeam.name}</Text>
                        </View>
                    </View>

                    <View style={styles.dateRow}>
                        <Text style={styles.date}>{formattedDate}</Text>
                    </View>
                </View>
            </Pressable>
        </Link>
    );
}
