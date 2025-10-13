import React from 'react';
import { 
    View, 
    ViewStyle, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    Platform
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useForm, Controller } from 'react-hook-form';
import { GameStatType, Team } from '@/entities';

type GameStatFormProps = {
    homeTeam: Team;
    awayTeam: Team;
    onCancel(): void;
    onSubmit(data: GameStatFormData): void;
    style?: ViewStyle;
}

export interface GameStatFormData {
    gameStatType: string;
    playerId: string;
}

const gameStatValues = Object.values(GameStatType);

// TODO: fetch players from player slice
export default function GameStatForm({ homeTeam, awayTeam, onCancel, onSubmit }: GameStatFormProps) {
    const { control, handleSubmit } = useForm<GameStatFormData>({
        defaultValues: {
            gameStatType: '',
            playerId: '',
        },
    });

    const onFormSubmitted = async (data: GameStatFormData) => {
        onSubmit(data)
    };

    return (
        <View style={styles.modalView}>
            <Controller
                control={control}
                name="gameStatType"
                rules={{ required: 'Game stat type is required' }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                    <Text style={styles.pickerLabel}>Select Game Stat Type</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={value}
                        onValueChange={onChange}>
                        <Picker.Item label="Select Game Stat..." value={""} />
                        {gameStatValues.map((type) => (
                            <Picker.Item key={type} label={type} value={type} />
                        ))}
                    </Picker>
                    {error && <Text style={styles.errorText}>{error.message}</Text>}
                    </>
                )}
            />

            <Controller
                control={control}
                name="playerId"
                rules={{ required: 'Player is required' }}
                render={({ field: { onChange, value }, fieldState: { error } }) => (
                    <>
                    <Text style={styles.pickerLabel}>Select Player</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={value}
                        onValueChange={onChange}>
                        <Picker.Item label="Select Player..." value="" />
                        <Picker.Item label="--- Home Team ---" value="category_home_team" enabled={false} />
                        {homeTeam.players.map((player) => (
                            <Picker.Item key={player.email} label={`${player.firstName} ${player.lastName}`} value={player.email} />
                        ))}
                        <Picker.Item label="--- Away Team ---" value="category_away_team" enabled={false} />
                        {awayTeam.players.map((player) => (
                            <Picker.Item key={player.email} label={`${player.firstName} ${player.lastName}`} value={player.email} />
                        ))}
                    </Picker>
                    {error && <Text style={styles.errorText}>{error.message}</Text>}
                    </>
                )}
            />
            
            <TouchableOpacity
                style={styles.pickerButton}
                onPress={handleSubmit(onFormSubmitted)}
            >
                <Text style={styles.pickerButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.pickerButton}
                onPress={onCancel}
            >
                <Text style={styles.pickerButtonText}>Cancel</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
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
        width: '100%',
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
        marginBottom: 15,
        textAlign: 'center'
    },
    pickerLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        ...Platform.select({
            web: {
                marginBottom: 10
            },
            default: {

            }
        })
    },
    pickerButton: {
        backgroundColor: '#007AFF',
        height: 50,
        width: '100%',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    pickerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
        fontSize: 12,
        marginBottom: 5,
    },
});