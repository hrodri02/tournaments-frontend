import React, { useState } from 'react';
import { 
    StyleSheet, 
    Text, 
    View, 
    TextInput, 
    Pressable,
    TouchableWithoutFeedback, 
    Keyboard,
    ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
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
        
    }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={styles.safeAreaContainer}>
                <View style={styles.container}>
                    <View style={styles.main}>
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
                                    <DateTimePicker
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
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    safeAreaContainer: {
        flex: 1
    },
    container: {
        flex: 1,
        margin: 12
    },
    main: {
        flex: 1
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