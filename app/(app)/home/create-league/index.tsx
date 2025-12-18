import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    Pressable,
    ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons'; 
import { SafeAreaView } from 'react-native-safe-area-context';
import UniversalDatePicker from '@/components/UniversalDatePicker';
import DismissKeyboard from '@/components/DismissKeyboard';
import { useForm, Controller } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/hooks/useStore';
import { 
    selectLeaguesCreateStatus, 
    selectLeaguesCreateError,
    createLeague,
    resetLeaguesCreateState
} from '@/store/leagues/leaguesSlice';
import { useTranslation } from 'react-i18next';
import { CreateLeagueRequest } from '@/entities';

interface CreateLeagueFormData {
    leagueName: string;
    leagueDuration: string;
    leagueStartDate: Date;
}

export default function CreateLeague() {
    const dispatch = useAppDispatch();
    const createStatus = useAppSelector(selectLeaguesCreateStatus);
    const createError = useAppSelector(selectLeaguesCreateError);
    const { t } = useTranslation(['home', 'errors']);
    const { control, handleSubmit } = useForm<CreateLeagueFormData>({
        defaultValues: {
            leagueName: '',
            leagueDuration: '',
            leagueStartDate: new Date()
        },
    });

    function onCreateLeagueButtonPressed(data: CreateLeagueFormData) {
        const createLeagueRequest: CreateLeagueRequest = {
            name: data.leagueName,
            startDate: data.leagueStartDate.toISOString(),
            durationInWeeks: Number(data.leagueDuration)
        };
        dispatch(createLeague(createLeagueRequest));
    }

    useEffect(() => {
        if (createStatus === 'succeeded' || createStatus === 'failed') {
            // slight delay to show success:
            const timer = setTimeout(() => {
                dispatch(resetLeaguesCreateState())
                if (createStatus === 'succeeded') {
                    router.back();
                }
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [createStatus]);

    const getCreateErrorMessage = (): string => {
        const error = createError!
        const message = t(`errors:${error.errorKey}`);
        return message;
    }

    let view: React.JSX.Element = <></>;
    if (createStatus === 'idle' || createStatus === 'failed') {
        view = <DismissKeyboard>
            <View style={[styles.container, styles.marginAtTop]}>
                <View style={styles.container}>
                    {createError && <Text style={styles.errorText}>{getCreateErrorMessage()}</Text>}
                    <Controller
                        control={control}
                        name="leagueName"
                        rules={{ required: 'League name is required' }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <View style={styles.marginAtBottom}>
                                <Text style={styles.label}>{t('create_league.name_label')}</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={onChange}
                                    value={value}
                                    placeholder={t('create_league.name_placeholder')}
                                    placeholderTextColor="#AAAAAA"
                                />
                                {error && <Text style={styles.errorText}>{error.message}</Text>}
                            </View>
                        )}
                    />
                    <Controller
                        control={control}
                        name="leagueDuration"
                        rules={{ required: 'League duration is required' }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <View style={styles.marginAtBottom}>
                                <Text style={styles.label}>{t('create_league.duration_label')}</Text>
                                <TextInput
                                    style={styles.input}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType="numeric" 
                                    placeholder={t('create_league.duration_placeholder')}
                                    placeholderTextColor="#AAAAAA"
                                />
                                {error && <Text style={styles.errorText}>{error.message}</Text>}
                            </View>
                        )}
                    />
                    <Controller
                        control={control}
                        name="leagueStartDate"
                        rules={{ required: 'League duration is required' }}
                        render={({ field: { onChange, value }, fieldState: { error } }) => (
                            <View style={styles.marginAtBottom}>
                                <Text style={styles.label}>{t('create_league.start_date_label')}</Text>
                                <UniversalDatePicker
                                    testID="dateTimePicker"
                                    value={value}
                                    mode={'date'}
                                    is24Hour={true}
                                    onChange={(event, selectedDate) => {
                                        if (selectedDate) {
                                            onChange(selectedDate); 
                                        }
                                    }}
                                />
                            </View>
                        )}
                    />
                </View>
                <Pressable
                    onPress={handleSubmit(onCreateLeagueButtonPressed)}
                    style={styles.buttonContainer}
                >
                    <Text style={styles.buttonText}>{t('create_league.button')}</Text>
                </Pressable>
            </View>
        </DismissKeyboard>
    }
    else if (createStatus === 'loading') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    }
    else if (createStatus === 'succeeded') {
        view = <View style={[styles.container, styles.perfectCentering]}>
            <Text>{t('create_league.success_message')}</Text>
            <Ionicons name="checkmark-circle" size={32} color="green" />
        </View>
    }

    return (
        <SafeAreaView style={styles.container}>
            {view}      
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    marginAtTop: {
        margin: 12
    },
    marginAtBottom: {
        marginBottom: 20
    },
    perfectCentering: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        fontSize: 12,
        marginBottom: 5,
    },
    buttonContainer: {
        marginHorizontal: 20,
        borderRadius: 8,
        backgroundColor: '#007AFF',
        marginBottom: 20,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});