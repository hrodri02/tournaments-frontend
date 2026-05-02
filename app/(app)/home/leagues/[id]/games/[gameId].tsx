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
    ActivityIndicator,
    ImageBackground 
} from 'react-native';
import Modal from 'react-native-modal';
import { useNavigation } from '@react-navigation/native'; 
import { useLocalSearchParams } from 'expo-router';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { ImageFetcher } from '@/components/ImageFetcher';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useAppSelector, useAppDispatch } from '@/hooks/useStore';
import { makeSelectDenormalizedGame } from '@/store/games/gamesSlice';
import { 
    fetchGameStats, 
    makeSelectDenormalizedStats,
    selectGameStatsFetchStatus,
    selectGameStatsFetchError, 
    createGameStat, 
    selectGameStatsCreateStatus, 
    selectGameStatsCreateError,
    resetCreateGameStatStatus 
} from '@/store/gamestats/gameStatsSlice';
import { format } from 'date-fns';
import { enUS, es } from 'date-fns/locale';
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
import { useTranslation } from 'react-i18next';
import { DEFAULT_IMAGES } from '@/constants/Assets';

const screenHeight = Dimensions.get('window').height; 

export default function Game() {
    const { user, isLoading } = useAuth();
    const { t, i18n } = useTranslation(['home', 'common', 'errors']);
    const [modalVisible, setModalVisible] = useState(false);
    const [editModalVisible, setEditModalVisible] = useState(false);
    const dispatch = useAppDispatch()
    const navigation = useNavigation(); 
    const { gameId } = useLocalSearchParams();
    const gameID = Number(gameId);
    const selectDenormalizedGame = useMemo(
        () => makeSelectDenormalizedGame(gameID),
        []
    );
    const game = useAppSelector(selectDenormalizedGame)!
    const { showActionSheetWithOptions } = useActionSheet();
    const homeTeam = game.homeTeam
    const awayTeam = game.awayTeam
    const locale = (['en', 'en-US'].includes(i18n.language))? enUS : es;
    const formattedDate = formatDate(game.gameDateTime);
    const gameStatsStatus = useAppSelector(selectGameStatsFetchStatus)
    const fetchError = useAppSelector(selectGameStatsFetchError);
    const createStatus = useAppSelector(selectGameStatsCreateStatus)
    const createError = useAppSelector(selectGameStatsCreateError);
    const selectGameStatsOfGame = useMemo(
        () => makeSelectDenormalizedStats(gameID),
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

    function formatDate(date: string): string {
        const dateString = format(date, 'eee, MMM d', {locale: locale});
        if (locale === enUS) {
            return dateString;
        }
        // capitalize the first letter of the day and month
        return dateString.charAt(0).toUpperCase() + 
                dateString.slice(1,5) + 
                dateString.charAt(5).toUpperCase() + 
                dateString.slice(6);
    }


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
        const options = [t('game.add_option'), t('common:edit_button'), t('common:cancel_button')];
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
        let selectedPlayer = homeTeam.playerDTOs.find((player) => player.email === selectedPlayerId)
        if (!selectedPlayer) {
            selectedPlayer = awayTeam.playerDTOs.find((player) => player.email === selectedPlayerId)
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

    const getFetchGameStatsErrorMessage = (): string => {
        const error = fetchError!
        const message = t(`errors:${error.errorKey}`);
        return message;
    }

    const getCreateGameStatErrorMessage = (): string => {
        const error = createError!
        const message = t(`errors:${error.errorKey}`);
        return message;
    }

    let view: React.JSX.Element = <></>;
    if (gameStatsStatus === 'loading' || createStatus === 'loading') {
        view = <ActivityIndicator size="large" color="#0000ff" />
    }
    else if (gameStatsStatus === 'failed') {
        view = <Text>{getFetchGameStatsErrorMessage()}</Text>
    }
    else if (createStatus === 'failed') {
        view = <Text>{getCreateGameStatErrorMessage()}</Text>
    }
    else if (gameStatsStatus === 'succeeded') {
        view = <ImageBackground 
                source={DEFAULT_IMAGES.FIELD_BG} 
                resizeMode="cover" 
                style={styles.backgroundImage}
                imageStyle={{opacity: 0.6}}
            >
            <Text style={styles.date}>{formattedDate} {t('game.at_text')} {game.address}</Text>
            
            <View style={styles.gameStatView}> 
                <View style={styles.teamLogo}>
                    <ImageFetcher
                        imageStyle={styles.teamLogoImage}
                        key={homeTeam.logoUrl}
                        imageUrl={homeTeam.logoUrl}
                        defaultImageSource={DEFAULT_IMAGES.TEAM_LOGO}
                    />
                    <Text style={styles.text}>{homeTeam.name}</Text>
                </View>

                <View style={styles.equalWidth}>
                    <Text style={styles.score}> {homeTeamGoalStats.length} - {awayTeamGoalStats.length} </Text>
                </View>

                <View style={styles.teamLogo}> 
                    <ImageFetcher
                        imageStyle={styles.teamLogoImage}
                        key={awayTeam.logoUrl}
                        imageUrl={awayTeam.logoUrl}
                        defaultImageSource={DEFAULT_IMAGES.TEAM_LOGO}
                    />
                    <Text style={styles.text}>{awayTeam.name}</Text>
                </View>
            </View>

            <View style={styles.gameStatView}>
                <Text style={[styles.text, styles.goalsViewItem]}>{homeTeamGoalScorers}</Text>
                <Image 
                    style={[styles.goalsViewItem, styles.soccerBallImage]} 
                    source={DEFAULT_IMAGES.SOCCER_BALL}
                    resizeMode='contain'
                />
                <Text style={[styles.text, styles.goalsViewItem]}>{awayTeamGoalScorers}</Text>
            </View>

            <View style={styles.gameStatView} >
                <Text style={[styles.text, styles.equalWidth]}>{homeTeamYellowCards}</Text>
                <Text style={[styles.text, styles.equalWidth]}>{t('game.yellow_cards_label')}</Text>
                <Text style={[styles.text, styles.equalWidth]}>{awayTeamYellowCards}</Text>
            </View>

            <View style={styles.gameStatView}> 
                <Text style={[styles.text, styles.equalWidth]}>{homeTeamRedCards}</Text>
                <Text style={[styles.text, styles.equalWidth]}>{t('game.red_cards_label')}</Text>
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
        </ImageBackground>
    }

    return (
        <View style={[styles.container, gameStatsStatus !== 'succeeded' && styles.perfectCentering]}>
            {view}
        </View>
    );
}

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        width: '100%',
        height: '100%',
        justifyContent: 'center'
    },
    soccerBallImage: {
        width: screenHeight * 0.04,
        height: screenHeight * 0.04,
    }, 
    teamLogoImage: { 
        borderRadius: 20,
        width: screenHeight * 0.1,
        height: screenHeight * 0.1,
        marginBottom: 10
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