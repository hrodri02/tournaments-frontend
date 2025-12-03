import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import RadioButton from '@/components/RadioButton';
import { useTranslation } from 'react-i18next';

interface Option { value: string; label: string; }

export default function LanguagePreferencePage() {
    const { t, i18n } = useTranslation('settings');
    const languageOptions: Option[] = [
      { value: 'en', label: t('language_preference.en_option') },
      { value: 'es', label: t('language_preference.es_option') },
    ];
    const currentLanguage = i18n.language;
    const [selectedOption, setSelectedOption] = useState<string>(currentLanguage);
    const changeLanguage = (lng: string) => {
        setSelectedOption(lng);
        i18n.changeLanguage(lng);
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.groupTitle}>{t('language_preference.choose_preferred_language_label')}</Text>
            {languageOptions.map((option) => (
            <RadioButton<string>
                key={option.value}
                label={option.label}
                value={option.value}
                selectedValue={selectedOption}
                onSelect={changeLanguage}
            />
            ))}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  groupTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingBottom: 10,
  },
});