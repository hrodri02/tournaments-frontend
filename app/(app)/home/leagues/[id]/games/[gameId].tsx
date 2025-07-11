import React, { useLayoutEffect, useState, useEffect, useCallback } from 'react'; 
import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity, Modal } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useNavigation } from '@react-navigation/native'; 
import { useLocalSearchParams } from 'expo-router';
import { useAppSelector, useAppDispatch } from '@/hooks/useStore';
import { selectGameById, selectLeagueById, gameStatAdded } from '@/store/leagues/leaguesSlice';
import { getStorageItemAsync, USER_KEY } from '@/store/auth/authStorage';
import { format } from 'date-fns';
import { GameStatType, filterStatsForTeam, countStatsForTeam, getGoalScorersForTeam, stringToGameStatType, GameStatPayload } from '@/entities';
import { User } from '@/entities/auth';

const screenHeight = Dimensions.get('window').height; 
const gameStatValues = Object.values(GameStatType);

export default function Game() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoadingAdminStatus, setIsLoadingAdminStatus] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedGameStat, setSelectedGameStat] = useState('');
    const [selectedPlayerId, setSelectedPlayerId] = useState('');
    const dispatch = useAppDispatch()
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
                        onPress={() => { setModalVisible(true) }}
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

    const handleGameStatChange = (itemValue: GameStatType) => {
        setSelectedGameStat(itemValue)

    };

    const handlePlayerIdChange = (itemValue: string) => {
        setSelectedPlayerId(itemValue)
    }

    const handleSaveButtonPressed = () => {
        let selectedPlayer = homeTeam.players.find((player) => player.email === selectedPlayerId)
        if (!selectedPlayer) {
            selectedPlayer = awayTeam.players.find((player) => player.email === selectedPlayerId)
        }
        const gameStatType: GameStatType | undefined = stringToGameStatType(selectedGameStat);
        // Note: the game stat needs to be sent to the backend first which will generate the game stat id
        // save the new game stat in redux
        const newGameStat: GameStatPayload = {
            leagueId: leagueId,
            gameId: gameID,
            id: 100,
            type: gameStatType!,
            player: selectedPlayer!,
            time: new Date().toISOString()
        }
        dispatch(gameStatAdded(newGameStat))
        setSelectedGameStat('')
        setSelectedPlayerId('')
        setModalVisible(!modalVisible)
    }

    const handleCancelButtonPressed = () => {
        setSelectedGameStat('')
        setSelectedPlayerId('')
        setModalVisible(!modalVisible)
    }

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

            <Modal
                animationType="slide" // How the modal appears (slide, fade, none)
                transparent={true}    // Whether the background behind the modal is transparent
                visible={modalVisible} // Controls the visibility of the modal
                onRequestClose={() => { // Required for Android back button and accessibility
                    console.log('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalView}>
                    <Picker
                        style={styles.picker}
                        onValueChange={handleGameStatChange}>
                        <Picker.Item label="Select Game Stat..." value="" />
                        {gameStatValues.map((type) => (
                            <Picker.Item key={type} label={type} value={type} />
                        ))}
                    </Picker>
                    <Picker
                        style={styles.picker}
                        onValueChange={handlePlayerIdChange}>
                        <Picker.Item label="Select Player..." value="" />
                        <Picker.Item label="--- Home Team ---" value="category_home_team" enabled={false} />
                        {homeTeam.players.map((player) => (
                            <Picker.Item key={player.email} label={player.name} value={player.email} />
                        ))}
                        <Picker.Item label="--- Away Team ---" value="category_away_team" enabled={false} />
                        {awayTeam.players.map((player) => (
                            <Picker.Item key={player.email} label={player.name} value={player.email} />
                        ))}
                    </Picker>
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.pickerButton}
                            onPress={handleSaveButtonPressed}
                            disabled={selectedGameStat === '' || selectedPlayerId === ''}
                        >
                            <Text style={styles.pickerButtonText}>Save</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.pickerButton}
                            onPress={handleCancelButtonPressed}
                        >
                            <Text style={styles.pickerButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
    },
    modalView: {
        flex: 1,
        marginTop: 44,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 35,
        backgroundColor: '#777',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    picker: {
        marginBottom: 15,
        textAlign: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        columnGap: 10
    },
    pickerButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 5,
    },
    pickerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
})