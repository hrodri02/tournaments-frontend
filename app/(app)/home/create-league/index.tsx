import React from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    Pressable,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import UniversalDatePicker from '@/components/UniversalDatePicker';
import DismissKeyboard from '@/components/DismissKeyboard';
import { useForm, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface CreateLeagueFormData {
    leagueName: string;
    leagueDuration: string;
    leagueStartDate: Date;
}

export default function CreateLeague() {
    const { t } = useTranslation(['home', 'errors']);
    const { control, handleSubmit } = useForm<CreateLeagueFormData>({
        defaultValues: {
            leagueName: '',
            leagueDuration: '',
            leagueStartDate: new Date()
        },
    });

    function onCreateLeagueButtonPressed(data: CreateLeagueFormData) {
        console.log(data);
    }

    return (
        <DismissKeyboard>
            <SafeAreaView style={styles.container}>
                <View style={[styles.container, styles.marginAtTop]}>
                    <View style={styles.container}>
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
                                        onChange={onChange}
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
            </SafeAreaView>
        </DismissKeyboard>
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