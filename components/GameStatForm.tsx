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
import { GameStatType, TeamResponse } from '@/entities';
import { useTranslation } from 'react-i18next';

type GameStatFormProps = {
    homeTeam: TeamResponse;
    awayTeam: TeamResponse;
    onCancel(): void;
    onSubmit(data: GameStatFormData): void;
    style?: ViewStyle;
}

export interface GameStatFormData {
    gameStatType: string;
    playerId: string;
}

const gameStatValues = Object.values(GameStatType);

export default function GameStatForm({ homeTeam, awayTeam, onCancel, onSubmit }: GameStatFormProps) {
    const { t } = useTranslation(['home', 'common']);
    const GameStatTypeDisplay: Record<GameStatType, string> = {
        'GOAL': t('game.goal_option'),
        'YELLOW_CARD': t('game.yellow_card_option'),
        'RED_CARD': t('game.red_card_option'),
    };

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
                    <Text style={styles.pickerLabel}>{t('game.select_game_stat_label')}</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={value}
                        onValueChange={onChange}>
                        <Picker.Item label={t('game.select_game_stat_picker_label')} value={""} />
                        {gameStatValues.map((type) => (
                            <Picker.Item key={type} label={GameStatTypeDisplay[type]} value={type} />
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
                    <Text style={styles.pickerLabel}>{t('game.select_player_label')}</Text>
                    <Picker
                        style={styles.picker}
                        selectedValue={value}
                        onValueChange={onChange}>
                        <Picker.Item label={t('game.select_player_picker_label')} value="" />
                        <Picker.Item label="--- Home Team ---" value="category_home_team" enabled={false} />
                        {homeTeam.playerDTOs.map((player) => (
                            <Picker.Item key={player.email} label={`${player.firstName} ${player.lastName}`} value={player.email} />
                        ))}
                        <Picker.Item label="--- Away Team ---" value="category_away_team" enabled={false} />
                        {awayTeam.playerDTOs.map((player) => (
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
                <Text style={styles.pickerButtonText}>{t('game.save_button')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.pickerButton}
                onPress={onCancel}
            >
                <Text style={styles.pickerButtonText}>{t('common:cancel_button')}</Text>
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