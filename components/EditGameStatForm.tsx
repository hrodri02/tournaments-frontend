import React, { useEffect } from 'react';
import { View, SectionList, ViewStyle, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { GameStatType, GameStat, Team, filterStats } from '@/entities';
import { deleteGameStatFromStore, resetDeleteGameStatStatus, selectGameStatsDeleteError, selectGameStatsDeleteStatus } from '@/store/gamestats/gameStatsSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';

type EditGameStatFormProps = {
    stats: GameStat[],
    homeTeam: Team,
    awayTeam: Team,
    onCancel(): void;
    style?: ViewStyle;
}

export default function EditGameStatForm({ stats, homeTeam, awayTeam, onCancel }: EditGameStatFormProps) {
    const dispatch = useAppDispatch();
    const goalStats = filterStats(stats, GameStatType.goal)
    const yellowCardStats = filterStats(stats, GameStatType.yellowCard)
    const redCardStats = filterStats(stats, GameStatType.redCard)
    const deleteStatus = useAppSelector(selectGameStatsDeleteStatus)
    const deleteError = useAppSelector(selectGameStatsDeleteError)

    const handleDeleteStatButtonPressed = (stat: GameStat) => {
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

    let view: JSX.Element = <></>;
    if (deleteStatus === 'loading') {
        view = <ActivityIndicator size="large" color="#0000ff" />
    }
    else if (deleteStatus === 'failed') {
        view = <Text>{deleteError}</Text>
    }
    else if (deleteStatus === 'succeeded' || deleteStatus === 'idle') {
        view = <>
            <SectionList
                style={styles.sectionList}
                sections={[
                    { title: 'Goals', data: goalStats },
                    { title: 'Yellow Cards', data: yellowCardStats },
                    { title: 'Red Cards', data: redCardStats },
                ]}
                renderItem={({ item }) =>
                    <View style={styles.item}>

                        <Picker
                            style={styles.picker}
                            onValueChange={() => {}}>
                            <Picker.Item label="--- Home Team ---" value="category_home_team" enabled={false} />
                            {homeTeam.players.map((player) => (
                                <Picker.Item key={player.email} label={`${player.firstName} ${player.lastName}`} value={player.email} />
                            ))}
                            <Picker.Item label="--- Away Team ---" value="category_away_team" enabled={false} />
                            {awayTeam.players.map((player) => (
                                <Picker.Item key={player.email} label={`${player.firstName} ${player.lastName}`} value={player.email} />
                            ))}
                        </Picker>

                        <TouchableOpacity
                            style={styles.deleteButton}
                            onPress={() => handleDeleteStatButtonPressed(item)}
                        >
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    </View>
                }
                renderSectionHeader={({ section }) => (
                    <Text style={styles.sectionHeader}>{section.title}</Text>
                )}
            />
            
            <TouchableOpacity
                style={styles.modalButton}
                onPress={onCancel}
            >
                <Text style={styles.modalButtonText}>Dismiss</Text>
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
        justifyContent: 'center',
        alignContent: 'center',
        columnGap: '0.5em',
        padding: 10,
        marginVertical: 5,
    },
    picker: {
        textAlign: 'center'
    },
    buttonContainer: {
        flexDirection: 'row',
        columnGap: 10
    },
    modalButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 5,
        marginBottom: 10
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    deleteButton: {
        backgroundColor: 'red',
        borderRadius: 8,
        justifyContent: 'center',
        padding: 10
    },
    deleteButtonText: {
        color: '#fff'
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 5,
    },
});