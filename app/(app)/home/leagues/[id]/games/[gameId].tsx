import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react'; 
import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useNavigation } from '@react-navigation/native'; 
import { useLocalSearchParams } from 'expo-router';
import { useAppSelector } from '@/hooks/useStore';
import { selectGameById, selectLeagueById } from '@/store/leagues/leaguesSlice';
import { getStorageItemAsync, USER_KEY } from '@/store/auth/authStorage';
import { format } from 'date-fns';
import { GameStatType, filterStatsForTeam, countStatsForTeam, getGoalScorersForTeam } from '@/entities';
import { User } from '@/entities/auth';

const screenHeight = Dimensions.get('window').height; 

export default function Game() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoadingAdminStatus, setIsLoadingAdminStatus] = useState(true);
    const navigation = useNavigation(); 
    const { id, gameId } = useLocalSearchParams();
    const leagueId = Number(id);
    const gameID = Number(gameId);
    const league = useAppSelector(state => selectLeagueById(state, leagueId));
    const game = useAppSelector(state => selectGameById(league, gameID))!
    const homeTeam = game.homeTeam
    const awayTeam = game.awayTeam
    const date = Date.parse(game.date);
    const formattedDate = format(date, 'eee, MMM i');
    const homeTeamGoalStats = filterStatsForTeam(game.stats, GameStatType.goal, homeTeam)
    const homeTeamGoalScorers = getGoalScorersForTeam(homeTeamGoalStats)
    const awayTeamGoalStats = filterStatsForTeam(game.stats, GameStatType.goal, awayTeam)
    const awayTeamGoalScorers = getGoalScorersForTeam(awayTeamGoalStats)
    const homeTeamYellowCards = countStatsForTeam(game.stats, GameStatType.yellowCard, homeTeam)
    const awayTeamYellowCards = countStatsForTeam(game.stats, GameStatType.yellowCard, awayTeam)
    const homeTeamRedCards = countStatsForTeam(game.stats, GameStatType.redCard, homeTeam)
    const awayTeamRedCards = countStatsForTeam(game.stats, GameStatType.redCard, awayTeam)
    
    const checkAdminStatus = useCallback(async () => {
        try {
            setIsLoadingAdminStatus(true);
            const userJSON = await getStorageItemAsync(USER_KEY);
            if (userJSON) {
                const user = JSON.parse(userJSON) as User;
                setIsAdmin(user.role === 'admin');
            } else {
                setIsAdmin(false); // No user found
            }
        } catch (error) {
            console.error("Failed to get user role from storage:", error);
            setIsAdmin(false); // Assume not admin on error
        } finally {
            setIsLoadingAdminStatus(false);
        }
    }, []);

    useEffect(() => {
        checkAdminStatus();
    }, [checkAdminStatus]);

    useLayoutEffect(() => { 
        navigation.setOptions({
            title: `${homeTeam.name} vs ${awayTeam.name}`,
            headerTitleAlign: 'center'
        });
    }, [navigation, homeTeam, awayTeam]);

    useLayoutEffect(() => {
        if (!isLoadingAdminStatus && isAdmin) {
            navigation.setOptions({
                headerRight: () => (
                    <TouchableOpacity
                        style={styles.rightNavButton}
                        onPress={() => { console.log('edit button pressed'); }}
                    >
                        <Text style={styles.rightNavButtonText}>Edit</Text>
                    </TouchableOpacity>
                )
            });
        } else if (!isLoadingAdminStatus && !isAdmin) {
            navigation.setOptions({
                headerRight: undefined
            });
        }
    }, [navigation, isAdmin, isLoadingAdminStatus])

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
    },
    rightNavButton: {
        marginHorizontal: 20,
    },
    rightNavButtonText: {
        color: 'black',
        fontSize: 16
    }
})