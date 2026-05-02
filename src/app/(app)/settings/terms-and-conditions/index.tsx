import React from 'react';
import { 
  StyleSheet, 
  Text, 
  ScrollView, 
  View, 
  Linking, 
  TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

const TermsAndConditions = () => {
  const { t } = useTranslation('settings');
  
  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <Text style={styles.mainTitle}>{t('terms_and_conditions.title')}</Text>
        
        <Text style={styles.paragraph}>
          {t('terms_and_conditions.paragraph')}
        </Text>

        <Text style={styles.paragraph}>
          {t('terms_and_conditions.paragraph_two')}
        </Text>

        <Text style={styles.paragraph}>
          {t('terms_and_conditions.paragraph_three')}
        </Text>

        <Text style={styles.heading}>
          {t('terms_and_conditions.third_party_services_title')}
        </Text>
        <Text style={styles.paragraph}>
          {t('terms_and_conditions.third_party_services_paragraph')}
        </Text>
        
        <TouchableOpacity onPress={() => openLink('https://policies.google.com/terms')}>
          <Text style={styles.link}>• Google Play Services</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>
          {t('terms_and_conditions.responsibility_and_usage_title')}
        </Text>
        <Text style={styles.paragraph}>
          {t('terms_and_conditions.responsibility_and_usage_paragraph_one')}
        </Text>

        <Text style={styles.paragraph}>
          {t('terms_and_conditions.responsibility_and_usage_paragraph_two')}
        </Text>

        <Text style={styles.heading}>
          {t('terms_and_conditions.termination_title')}
        </Text>
        <Text style={styles.paragraph}>
          {t('terms_and_conditions.termination_paragraph')}
        </Text>

        <Text style={styles.heading}>{t('contact_us_title')}</Text>
        <Text style={styles.paragraph}>
          {t('contact_us_paragraph')}
        </Text>
        <TouchableOpacity onPress={() => openLink('mailto:hrodriguez1821@gmail.com')}>
          <Text style={styles.link}>hrodriguez1821@gmail.com</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{t('terms_and_conditions.effective_date')}</Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    padding: 10,
    paddingBottom: 40,
  },
  mainTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 20,
  },
  heading: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginTop: 25,
    marginBottom: 10,
  },
  paragraph: {
    fontSize: 12,
    lineHeight: 22,
    color: '#444',
    marginBottom: 15,
  },
  link: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '600',
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  footer: {
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
  footerText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default TermsAndConditions;