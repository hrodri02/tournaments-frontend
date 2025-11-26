import React, { 
    useLayoutEffect, 
    useState, 
    useEffect, 
    useMemo } from 'react'; 
import { 
    StyleSheet, 
    View, 
    Text, 
    Image, 
    Dimensions, 
    TouchableOpacity, 
    ActivityIndicator 
} from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useNavigation } from '@react-navigation/native'; 
import { useLocalSearchParams } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useAppSelector, useAppDispatch } from '@/hooks/useStore';
import { selectGameById } from '@/store/games/gamesSlice';
import { 
    fetchGameStats, 
    makeSelectGameStatsByGameId, 
    selectGameStatsFetchStatus, 
    createGameStat, 
    selectGameStatsCreateStatus, 
    resetCreateGameStatStatus 
} from '@/store/gamestats/gameStatsSlice';
import { format } from 'date-fns';
import { 
    GameStatType, 
    filterStats, 
    countStatsForTeam, 
    getGoalScorersForTeam, 
    stringToGameStatType, 
    isGameActive 
} from '@/entities';
import GameStatForm, { GameStatFormData } from '@/components/GameStatForm';
import EditGameStatForm from '@/components/EditGameStatForm';
import { useAuth } from "@/contexts/AuthContext";

const screenHeight = Dimensions.get('window').height; 

export default function Game() {
    const { user, isLoading } = useAuth();
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const dispatch = useAppDispatch()
    const navigation = useNavigation(); 
    const { gameId } = useLocalSearchParams();
    const gameID = Number(gameId);
    const game = useAppSelector(state => selectGameById(state, gameID))!
    const { showActionSheetWithOptions } = useActionSheet();
    const homeTeam = game.homeTeam
    const awayTeam = game.awayTeam
    const formattedDate = format(game.gameDateTime, 'eee, MMM d')
    const gameStatsStatus = useAppSelector(selectGameStatsFetchStatus)
    const createStatus = useAppSelector(selectGameStatsCreateStatus)
    const selectGameStatsOfGame = useMemo(
        () => makeSelectGameStatsByGameId(gameID),
        []
    )
    const gameStatsOfGame = useAppSelector(selectGameStatsOfGame)
    const homeTeamGoalStats = filterStats(gameStatsOfGame, GameStatType.goal, homeTeam)
    const homeTeamGoalScorers = getGoalScorersForTeam(homeTeamGoalStats)
    const awayTeamGoalStats = filterStats(gameStatsOfGame, GameStatType.goal, awayTeam)
    const awayTeamGoalScorers = getGoalScorersForTeam(awayTeamGoalStats)
    const homeTeamYellowCards = countStatsForTeam(gameStatsOfGame, GameStatType.yellowCard, homeTeam)
    const awayTeamYellowCards = countStatsForTeam(gameStatsOfGame, GameStatType.yellowCard, awayTeam)
    const homeTeamRedCards = countStatsForTeam(gameStatsOfGame, GameStatType.redCard, homeTeam)
    const awayTeamRedCards = countStatsForTeam(gameStatsOfGame, GameStatType.redCard, awayTeam)

    useEffect(() => {
        if (gameStatsStatus === 'idle') {
            dispatch(fetchGameStats())
        }
    }, [dispatch, gameStatsStatus]);

    useLayoutEffect(() => { 
        navigation.setOptions({
            title: `${homeTeam.name} vs ${awayTeam.name}`,
            headerTitleAlign: 'center'
        });
    }, [navigation, homeTeam, awayTeam]);

    const handlePress = () => {
        const options = ['Add', 'Edit', 'Cancel'];
        const destructiveButtonIndex = 2;
        const cancelButtonIndex = 3;

        showActionSheetWithOptions(
            {
                options,
                cancelButtonIndex,
                destructiveButtonIndex,
            },
            (buttonIndex) => {
                switch (buttonIndex) {
                    case 0: 
                        setModalVisible(true)
                        break;
                    case 1:
                        setEditModalVisible(true)
                        break;
                    case 2: 
                        break;
                }
            }
        );
    };

    useLayoutEffect(() => {
        if (user && !isLoading) {
            if (user.appUserRole === 'ADMIN' && isGameActive(game)) {
                navigation.setOptions({
                    headerRight: () => (
                        <TouchableOpacity
                            style={styles.rightNavButton}
                            onPress={handlePress}
                        >
                            <FontAwesome6 name="ellipsis-vertical" size={24} color="black" />
                        </TouchableOpacity>
                    )
                });
            }
            else {
                navigation.setOptions({
                    headerRight: undefined
                });
            }
        }
    }, [navigation, user, isLoading, game, handlePress, isGameActive])

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

    const handleCancelButtonPressedForEdit = () => {
        setEditModalVisible(!editModalVisible)
    }

    let view: JSX.Element = <></>;
    if (gameStatsStatus === 'loading' || createStatus === 'loading') {
        view = <ActivityIndicator size="large" color="#0000ff" />
    }
    else if (gameStatsStatus === 'failed') {
        view = <Text>Game stats not found</Text>
    }
    else if (createStatus === 'failed') {
        view = <Text>Could not create stat</Text>
    }
    else if (gameStatsStatus === 'succeeded') {
        view = <View>
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
                isVisible={modalVisible}
                onSwipeComplete={() => { 
                    setModalVisible(!modalVisible);
                }}
                swipeDirection={['down']} // 👈 Set the swipe direction to 'down'
            >
                <GameStatForm 
                    homeTeam={homeTeam} 
                    awayTeam={awayTeam} 
                    onCancel={handleCancelButtonPressed}
                    onSubmit={handleSaveButtonPressed}
                />
            </Modal>
            
            <Modal
                isVisible={editModalVisible}
                onSwipeComplete={() => { 
                    setEditModalVisible(!editModalVisible);
                }}
                swipeDirection={['down']} // 👈 Set the swipe direction to 'down'
            >
                <EditGameStatForm 
                    stats={gameStatsOfGame}
                    homeTeam={homeTeam}
                    awayTeam={awayTeam}
                    onCancel={handleCancelButtonPressedForEdit}
                />
            </Modal>
        </View>
    }

    return (
        <SafeAreaView style={[styles.container, gameStatsStatus !== 'succeeded' && styles.perfectCentering]}>
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
    container: {
        flex: 1,
    },
    perfectCentering: {
        justifyContent: 'center',
        alignItems: 'center',
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