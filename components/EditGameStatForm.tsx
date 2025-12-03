import React, { useEffect } from 'react';
import { 
    View, 
    SectionList, 
    ViewStyle, 
    Text, 
    TouchableOpacity, 
    StyleSheet, 
    ActivityIndicator,
    Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { 
    GameStatType, 
    GameStatResponse, 
    GameStat, 
    TeamResponse, 
    filterStats, 
    GameStatUpdateFailure 
} from '@/entities';
import { 
    deleteGameStatFromStore, 
    resetDeleteGameStatStatus, 
    selectGameStatsDeleteError, 
    selectGameStatsDeleteStatus,
    updateGameStats,
    selectBatchUpdateFailures,
    selectGameStatsUpdateStatus,
    selectGameStatsUpdateError,
    resetUpdateGameStatStatus 
} from '@/store/gamestats/gameStatsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { useForm, Controller } from 'react-hook-form';
import { FontAwesome6 } from "@expo/vector-icons";
import { useTranslation } from 'react-i18next';

type EditGameStatFormProps = {
    stats: GameStatResponse[],
    homeTeam: TeamResponse,
    awayTeam: TeamResponse,
    onCancel(): void;
    style?: ViewStyle;
}

export interface EditGameStatFormData {
    statIdToplayerId: {[key: string]: number}
}

export default function EditGameStatForm({ stats, homeTeam, awayTeam, onCancel }: EditGameStatFormProps) {
    const dispatch = useAppDispatch();
    const { t } = useTranslation('home');
    const goalStats = filterStats(stats, GameStatType.goal)
    const yellowCardStats = filterStats(stats, GameStatType.yellowCard)
    const redCardStats = filterStats(stats, GameStatType.redCard)
    const deleteStatus = useAppSelector(selectGameStatsDeleteStatus)
    const deleteError = useAppSelector(selectGameStatsDeleteError)
    const updateStatus = useAppSelector(selectGameStatsUpdateStatus)
    const updateError = useAppSelector(selectGameStatsUpdateError)
    const batchUpdateFailures = useAppSelector(selectBatchUpdateFailures)
    const initialValues: {[key: string]: number} = {};
    stats.forEach(stat => {
        initialValues[stat.id.toString()] = +stat.player.id;
    });
    const { control, handleSubmit } = useForm<EditGameStatFormData>({
        defaultValues: {
            statIdToplayerId: initialValues
        }
    });

    const handleDeleteStatButtonPressed = (stat: GameStatResponse) => {
        dispatch(deleteGameStatFromStore(stat.id))
    }

    useEffect(() => {
        if (deleteStatus === 'succeeded' || deleteStatus === 'failed') {
            // You can add a timeout here if you want the message to persist for a few seconds
            const timer = setTimeout(() => {
                dispatch(resetDeleteGameStatStatus());
            }, 3000); // Reset after 3 seconds

            return () => clearTimeout(timer); // Cleanup timer
        }
    }, [deleteStatus, dispatch]);

    const onFormSubmitted = (data: EditGameStatFormData) => {
        const updatedGameStats: GameStat[] = stats.map(stat => {
            const { player, ...statData } = stat;
            const playerId = data.statIdToplayerId[stat.id.toString()];
            return { playerId, ...statData };
        })
        dispatch(updateGameStats(updatedGameStats))
    };

    useEffect(() => {
        if (updateStatus === 'succeeded' || updateStatus === 'failed') {
            // You can add a timeout here if you want the message to persist for a few seconds
            const timer = setTimeout(() => {
                dispatch(resetUpdateGameStatStatus());
            }, 3000); // Reset after 3 seconds

            return () => clearTimeout(timer); // Cleanup timer
        }
    }, [updateStatus, dispatch]);

    const updateFailed = (stat: GameStatResponse): GameStatUpdateFailure | undefined => {
        const failure = batchUpdateFailures?.filter(failure => failure.gameStatId === stat.id)
        return failure ? failure[0] : undefined
    }

    let view: React.JSX.Element = <></>;
    if (deleteStatus === 'loading' || updateStatus === 'loading') {
        view = <ActivityIndicator size="large" color="#0000ff" />
    }
    else if (
        deleteStatus === 'succeeded' || 
        deleteStatus === 'idle' ||
        updateStatus === 'succeeded' ||
        updateStatus === 'idle'
    ) 
    {
        view = <>
            <SectionList
                style={styles.sectionList}
                scrollEnabled={false}
                sections={[
                    { title: t('game.goals_label'), data: goalStats },
                    { title: t('game.yellow_cards_label'), data: yellowCardStats },
                    { title: t('game.red_cards_label'), data: redCardStats },
                ]}
                renderItem={({ item }) => {
                    const failed = updateFailed(item)
                    return (
                        <View style={styles.item}>
                            <Controller
                                control={control}
                                name={`statIdToplayerId.${item.id.toString()}`}
                                rules={{ required: 'Player is required' }}
                                render={({ field: { onChange, value }, fieldState: { error } }) =>
                                (
                                    <>
                                        <Picker
                                            style={styles.picker}
                                            selectedValue={value}
                                            onValueChange={(selectedPlayerId) => {
                                                onChange(Number(selectedPlayerId))
                                            }}
                                        >
                                            <Picker.Item label="--- Home Team ---" value="category_home_team" enabled={false} />
                                            {homeTeam.playerDTOs.map((player) => (
                                                <Picker.Item key={player.id} label={`${player.firstName} ${player.lastName}`} value={+player.id} />
                                            ))}
                                            <Picker.Item label="--- Away Team ---" value="category_away_team" enabled={false} />
                                            {awayTeam.playerDTOs.map((player) => (
                                                <Picker.Item key={player.id} label={`${player.firstName} ${player.lastName}`} value={+player.id} />
                                            ))}
                                        </Picker>
                                    </>
                                )}
                            />

                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeleteStatButtonPressed(item)}
                            >
                                <Text style={styles.deleteButtonText}>{t('game.delete_button')}</Text>
                            </TouchableOpacity>

                            {updateStatus === 'succeeded' && failed && <Text style={styles.errorText}>{failed.message}</Text>}

                            {updateStatus === 'succeeded' && !failed && <FontAwesome6 name="check" size={24} color="green"/>}
                        </View>
                    )
                }}
                renderSectionHeader={({ section }) => (
                    <Text style={styles.sectionHeader}>{section.title}</Text>
                )}
            />

            <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSubmit(onFormSubmitted)}
            >
                <Text style={styles.modalButtonText}>{t('game.save_button')}</Text>
            </TouchableOpacity>

            {updateError && <Text style={styles.errorText}>{updateError}</Text>}
            
            {deleteError && <Text style={styles.errorText}>{deleteError}</Text>}
            
            <TouchableOpacity
                style={styles.modalButton}
                onPress={onCancel}
            >
                <Text style={styles.modalButtonText}>{t('game.cancel_button')}</Text>
            </TouchableOpacity>
        </>
    }

    return (
        <View style={styles.modalView}>
            {view}
        </View>
    );
}

const styles = StyleSheet.create({
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        marginTop: 44,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 35,
        backgroundColor: '#777',
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
    sectionList: {
        flex: 1,
        paddingTop: 22,
    },
    sectionHeader: {
        paddingTop: 2,
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 2,
        fontSize: 18,
        fontWeight: 'bold',
        backgroundColor: 'rgba(247,247,247,1.0)',
    },
    item: {
        display: 'flex',
        flexDirection: 'row',
        columnGap: 10,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 10,
        paddingBottom: 10,
        marginVertical: 5,
        ...Platform.select({
            ios: {
                height: 250,
            },
            android: {
                height: 250,
            },
            default: {
                height: 50
            }
        }),
    },
    picker: {
        width: '70%',
        height: '100%'
    },
    buttonContainer: {
        flexDirection: 'row',
        columnGap: 10
    },
    modalButton: {
        backgroundColor: '#007AFF',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: 'red',
        height: 40,
        borderRadius: 8,
        justifyContent: 'center',
        padding: 10
    },
    deleteButtonText: {
        color: '#fff'
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        fontSize: 12,
        marginBottom: 5
    },
});