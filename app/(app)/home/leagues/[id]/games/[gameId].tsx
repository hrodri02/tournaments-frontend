import React, { useLayoutEffect, useState } from 'react'; 
import { StyleSheet, View, Text, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useNavigation } from '@react-navigation/native'; 
import { useLocalSearchParams } from 'expo-router';
import { useAppSelector } from '@/hooks/useStore';
import { selectGameById, selectLeagueById } from '@/store/leagues/leaguesSlice';
import { format } from 'date-fns';
import { GameStatType } from '@/entities';

const screenHeight = Dimensions.get('window').height; 

export default function Game() {
    const { id, gameId } = useLocalSearchParams();
    const leagueId = Number(id);
    const gameID = Number(gameId);
    const league = useAppSelector(state => selectLeagueById(state, leagueId));
    const game = useAppSelector(state => selectGameById(league, gameID))!
    const homeTeam = game.homeTeam
    const awayTeam = game.awayTeam
    const date = Date.parse(game.date);
    const formattedDate = format(date, 'eee, MMM i');
    const goalStats = game.stats.filter((gameStat) => gameStat.type === GameStatType.goal)
    const homeTeamGoalStats = goalStats.filter((stat) => homeTeam.players.includes(stat.player) );
    const homeTeamGoalScorers = homeTeamGoalStats.reduce((accumulator, stat) => {
        return (accumulator === '')? stat.player.name : accumulator + ', ' + stat.player.name
    }, '')
    const awayTeamGoalStats = goalStats.filter((stat) => awayTeam.players.includes(stat.player) );
    const awayTeamGoalScorers = awayTeamGoalStats.reduce((accumulator, stat) => {
        return (accumulator === '')? stat.player.name : accumulator + ', ' + stat.player.name
    }, '')
    const homeTeamYellowCards = game.stats.reduce((numCards, stat) => {
        if (stat.type === GameStatType.yellowCard && homeTeam.players.includes(stat.player))
            return numCards += 1
        return numCards
    }, 0)
    const awayTeamYellowCards = game.stats.reduce((numCards, stat) => {
        if (stat.type === GameStatType.yellowCard && awayTeam.players.includes(stat.player))
            return numCards += 1
        return numCards
    }, 0)
    const homeTeamRedCards = game.stats.reduce((numCards, stat) => {
        if (stat.type === GameStatType.redCard && homeTeam.players.includes(stat.player))
            return numCards += 1
        return numCards
    }, 0)
    const awayTeamRedCards = game.stats.reduce((numCards, stat) => {
        if (stat.type === GameStatType.redCard && awayTeam.players.includes(stat.player))
            return numCards += 1
        return numCards
    }, 0)
    
    const navigation = useNavigation(); 
    useLayoutEffect(() => { 
        navigation.setOptions({
            title: `${homeTeam.name} vs ${awayTeam.name}`,
            headerTitleAlign: 'center'
        }); 
    }, [navigation]);

    return (
        <SafeAreaView>
            <Text style={styles.date}>{formattedDate} at {game.address}</Text>
            
            <View style={styles.gameStatView}> 
                <View style={styles.teamLogo}> 
                    <Image 
                        style={styles.teamLogoImage} 
                        source={require('@/assets/images/liga_mx_logo.jpeg')}
                        resizeMode='contain'
                    />
                    <Text style={styles.text}>{homeTeam.name}</Text>
                </View>

                <View style={styles.equalWidth}>
                    <Text style={styles.score}> {homeTeamGoalStats.length} - {awayTeamGoalStats.length} </Text>
                </View>

                <View style={styles.teamLogo}> 
                    <Image 
                        style={styles.teamLogoImage} 
                        source={require('@/assets/images/liga_mx_logo.jpeg')}
                        resizeMode='contain'
                    />
                    <Text style={styles.text}>{awayTeam.name}</Text>
                </View>
            </View>

            <View style={styles.gameStatView}>
                <Text style={[styles.text, styles.goalsViewItem]}>{homeTeamGoalScorers}</Text>
                <Image 
                    style={[styles.goalsViewItem, styles.soccerBallImage]} 
                    source={require('@/assets/images/soccerBall.png')}
                    resizeMode='contain'
                />
                <Text style={[styles.text, styles.goalsViewItem]}>{awayTeamGoalScorers}</Text>
            </View>

            <View style={styles.gameStatView} >
                <Text style={[styles.text, styles.equalWidth]}>{homeTeamYellowCards}</Text>
                <Text style={[styles.text, styles.equalWidth]}> Yellow Cards </Text>
                <Text style={[styles.text, styles.equalWidth]}>{awayTeamYellowCards}</Text>
            </View>

            <View style={styles.gameStatView}> 
                <Text style={[styles.text, styles.equalWidth]}>{homeTeamRedCards}</Text>
                <Text style={[styles.text, styles.equalWidth]}> Red Cards </Text>
                <Text style={[styles.text, styles.equalWidth]}>{awayTeamRedCards}</Text>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    soccerBallImage: {
        width: screenHeight * 0.04,
        height: screenHeight * 0.04,
    }, 
    teamLogoImage: { 
        width: screenHeight * 0.1,
        height: screenHeight * 0.1
    }, 
    text: { 
        fontSize: 16,
        textAlign: 'center'
    }, 
    date: { 
        fontSize: 18,
        textAlign: 'center',
        padding: 10
    }, 
    score: { 
        textAlign: 'center',
        fontSize: 48,
    }, 
    gameStatView: { 
        marginTop: 20,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center'
    },
    goalsViewItem: {
        marginTop: 20,
        marginBottom: 20,
        flex: 1
    },
    teamLogo: { 
        flex: 1,
        alignItems: 'center',  
    },
    equalWidth: { 
        flex: 1
    }
})