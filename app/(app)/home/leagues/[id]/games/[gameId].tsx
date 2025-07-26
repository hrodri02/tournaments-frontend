import React, { useLayoutEffect, useState, useEffect, useCallback, useMemo } from 'react'; 
import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useNavigation } from '@react-navigation/native'; 
import { useLocalSearchParams } from 'expo-router';
import { useAppSelector, useAppDispatch } from '@/hooks/useStore';
import { selectGameById } from '@/store/games/gamesSlice';
import { fetchGameStats, makeSelectGameStatsByGameId, selectGameStatsFetchStatus, createGameStat, selectGameStatsCreateStatus, resetCreateGameStatStatus } from '@/store/gamestats/gameStatsSlice';
import { getStorageItemAsync, USER_KEY } from '@/store/auth/authStorage';
import { format } from 'date-fns';
import { GameStatType, filterStatsForTeam, countStatsForTeam, getGoalScorersForTeam, stringToGameStatType } from '@/entities';
import { User } from '@/entities/auth';
import GameStatForm, { GameStatFormData } from '@/components/GameStatForm';

const screenHeight = Dimensions.get('window').height; 

export default function Game() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoadingAdminStatus, setIsLoadingAdminStatus] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const dispatch = useAppDispatch()
    const navigation = useNavigation(); 
    const { id, gameId } = useLocalSearchParams();
    const leagueId = Number(id);
    const gameID = Number(gameId);
    const game = useAppSelector(state => selectGameById(state, gameID))!
    const homeTeam = game.homeTeam
    const awayTeam = game.awayTeam
    const date = Date.parse(game.gameDateTime)
    const formattedDate = format(date, 'eee, MMM i')
    const gameStatsStatus = useAppSelector(selectGameStatsFetchStatus)
    const createStatus = useAppSelector(selectGameStatsCreateStatus)
    const selectGameStatsOfGame = useMemo(
        () => makeSelectGameStatsByGameId(gameID),
        []
    )
    const gameStatsOfGame = useAppSelector(selectGameStatsOfGame)
    const homeTeamGoalStats = filterStatsForTeam(gameStatsOfGame, GameStatType.goal, homeTeam)
    const homeTeamGoalScorers = getGoalScorersForTeam(homeTeamGoalStats)
    const awayTeamGoalStats = filterStatsForTeam(gameStatsOfGame, GameStatType.goal, awayTeam)
    const awayTeamGoalScorers = getGoalScorersForTeam(awayTeamGoalStats)
    const homeTeamYellowCards = countStatsForTeam(gameStatsOfGame, GameStatType.yellowCard, homeTeam)
    const awayTeamYellowCards = countStatsForTeam(gameStatsOfGame, GameStatType.yellowCard, awayTeam)
    const homeTeamRedCards = countStatsForTeam(gameStatsOfGame, GameStatType.redCard, homeTeam)
    const awayTeamRedCards = countStatsForTeam(gameStatsOfGame, GameStatType.redCard, awayTeam)
    
    const checkAdminStatus = useCallback(async () => {
        try {
            setIsLoadingAdminStatus(true);
            const userJSON = await getStorageItemAsync(USER_KEY);
            if (userJSON) {
                const user = JSON.parse(userJSON) as User;
                setIsAdmin(user.appUserRole === 'ADMIN');
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
        if (gameStatsStatus === 'idle') {
            dispatch(fetchGameStats())
        }
    }, [dispatch, gameStatsStatus]);

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
                        onPress={() => { setModalVisible(true) }}
                    >
                        <Text style={styles.rightNavButtonText}>Add</Text>
                    </TouchableOpacity>
                )
            });
        } else if (!isLoadingAdminStatus && !isAdmin) {
            navigation.setOptions({
                headerRight: undefined
            });
        }
    }, [navigation, isAdmin, isLoadingAdminStatus])

    const handleSaveButtonPressed = async (data: GameStatFormData) => {
        const selectedPlayerId = data.playerId
        const selectedGameStat = data.gameStatType
        let selectedPlayer = homeTeam.players.find((player) => player.email === selectedPlayerId)
        if (!selectedPlayer) {
            selectedPlayer = awayTeam.players.find((player) => player.email === selectedPlayerId)
        }
        const gameStatType: GameStatType | undefined = stringToGameStatType(selectedGameStat);
        const newGameStat = {
            gameId: gameID,
            playerId: selectedPlayer?.id,
            type: gameStatType!,
            createdAt: new Date().toISOString()
        }
        dispatch(createGameStat(newGameStat))
        setModalVisible(!modalVisible)
    }

    useEffect(() => {
        if (createStatus === 'succeeded' || createStatus === 'failed') {
            // You can add a timeout here if you want the message to persist for a few seconds
            const timer = setTimeout(() => {
                dispatch(resetCreateGameStatStatus());
            }, 3000); // Reset after 3 seconds

            return () => clearTimeout(timer); // Cleanup timer
        }
    }, [createStatus, dispatch]);

    const handleCancelButtonPressed = () => {
        setModalVisible(!modalVisible)
    }
    let view: JSX.Element = <></>;
    if (gameStatsStatus === 'loading') {
        view = <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    }
    else if (gameStatsStatus === 'failed') {
        view = <View style={styles.container}>
            <Text>Game stats not found</Text>
        </View>
    }
    else if (gameStatsStatus === 'succeeded') {
        view = <View style={styles.containerWithoutCentering}>
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
            
            <Modal
                animationType="slide" // How the modal appears (slide, fade, none)
                transparent={true}    // Whether the background behind the modal is transparent
                visible={modalVisible} // Controls the visibility of the modal
                onRequestClose={() => { // Required for Android back button and accessibility
                    setModalVisible(!modalVisible);
                }}
            >
                <GameStatForm 
                    homeTeam={homeTeam} 
                    awayTeam={awayTeam} 
                    onCancel={handleCancelButtonPressed}
                    onSubmit={handleSaveButtonPressed}
                />
            </Modal>
        </View>
    }

    return (
        <SafeAreaView style={styles.containerWithoutCentering}>
            {view}
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
    containerWithoutCentering: {
        flex: 1
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
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