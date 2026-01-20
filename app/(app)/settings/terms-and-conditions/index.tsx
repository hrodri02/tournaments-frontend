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

const TermsAndConditions = () => {
  
  const openLink = async (url) => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        
        <Text style={styles.mainTitle}>Terms & Conditions</Text>
        
        <Text style={styles.paragraph}>
          These terms and conditions apply to the Tournaments app (hereby referred to as "Application") for mobile devices that was created by Heriberto Rodriguez (hereby referred to as "Service Provider") as a Free service.
        </Text>

        <Text style={styles.paragraph}>
          Upon downloading or utilizing the Application, you are automatically agreeing to the following terms. It is strongly advised that you thoroughly read and understand these terms prior to using the Application.
        </Text>

        <Text style={styles.paragraph}>
          Unauthorized copying, modification of the Application, any part of the Application, or our trademarks is strictly prohibited. All intellectual property rights related to the Application remain the property of the Service Provider.
        </Text>

        <Text style={styles.heading}>Third-Party Services</Text>
        <Text style={styles.paragraph}>
          The Application utilizes third-party services that have their own Terms and Conditions:
        </Text>
        
        <TouchableOpacity onPress={() => openLink('https://policies.google.com/terms')}>
          <Text style={styles.link}>• Google Play Services</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>Responsibility & Usage</Text>
        <Text style={styles.paragraph}>
          Some functions require an active internet connection. The Service Provider cannot be held responsible if the Application does not function at full capacity due to lack of access to Wi-Fi or data allowance.
        </Text>

        <Text style={styles.paragraph}>
          It is your responsibility to ensure that your device remains charged. If your device runs out of battery, the Service Provider cannot be held responsible for your inability to access the Service.
        </Text>

        <Text style={styles.heading}>Termination</Text>
        <Text style={styles.paragraph}>
          The Service Provider may terminate use of the application at any time without notice. Upon termination, the rights and licenses granted to you will end, and you must cease using the application.
        </Text>

        <Text style={styles.heading}>Contact Us</Text>
        <Text style={styles.paragraph}>
          If you have any questions or suggestions, please contact us at:
        </Text>
        <TouchableOpacity onPress={() => openLink('mailto:hrodriguez1821@gmail.com')}>
          <Text style={styles.link}>hrodriguez1821@gmail.com</Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Effective as of: 2026-01-19</Text>
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