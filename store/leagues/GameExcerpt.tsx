import React from 'react'; 
import { View, ViewStyle, Text, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import { Link } from 'expo-router';
import { GameResponse } from '@/entities/index';
import { format } from 'date-fns';
import { useLocalSearchParams } from 'expo-router';

const screenHeight = Dimensions.get('window').height;

type GameExcerptProps = {
    game: GameResponse;
    style?: ViewStyle;
}

const styles = StyleSheet.create({
    text: {
        textAlign: 'center',
        alignContent: 'center',
        fontWeight: 'bold',
        fontSize: 16,
    },
    image: { 
        width: screenHeight * 0.1,
        height: screenHeight * 0.1,
    },
    teamViews: {
        flex: 3,
    },
    teamView: { 
        columnGap: 5,
        padding: 10,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'   
    },
    date: { 
        fontSize: 14,
        fontWeight: 'bold',
    },
    dateContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderLeftWidth: 1,
        paddingHorizontal: 10
    }
})

export function GameExcerpt({ game, style }: GameExcerptProps) {
    const date = Date.parse(game.gameDateTime);
    const formattedDate = format(date, 'eee, MMM d pp');
    const { id } = useLocalSearchParams();
    const leagueId = Number(id);

    return (
        <Link href={{
            pathname: '/(app)/home/leagues/[leagueId]/games/[gameId]',
            params: {leagueId: leagueId, gameId: game.id}
        }} asChild>
            <Pressable>
            <View style={style}>
                <View style={styles.teamViews}>
                <View style={styles.teamView}>
                    <Image style={styles.image} source={require('@/assets/images/liga_mx_logo.jpeg')}/>
                    <Text style={styles.text}>{game.homeTeam.name}</Text>
                </View>

                <View style={styles.teamView}>
                    <Image style={styles.image} source={require('@/assets/images/liga_mx_logo.jpeg')}/>
                    <Text style={styles.text}>{game.awayTeam.name}</Text>
                    </View>
                </View>

                <View style={styles.dateContainer}>
                    <Text style={styles.date}>{formattedDate}</Text>
                </View>
            </View>
            </Pressable>
        </Link>
    )
}   
