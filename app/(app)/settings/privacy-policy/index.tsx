import React from 'react';
import { ScrollView, Text, View, StyleSheet, Linking, TouchableOpacity } from 'react-native';

const PrivacyPolicyPage = () => {
  const openLink = (url) => Linking.openURL(url);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.paragraph}>
        This privacy policy applies to the Tournaments app (hereby referred to as "Application") 
        for mobile devices that was created by Heriberto Rodriguez (hereby referred to as "Service Provider") 
        as a Free service. This service is intended for use "AS IS".
      </Text>

      <Text style={styles.heading}>Information Collection and Use</Text>
      <Text style={styles.paragraph}>
        The Application collects information when you download and use it. This information may include:
      </Text>
      
      <View style={styles.list}>
        <Text style={styles.listItem}>• Your device's Internet Protocol address (e.g. IP address)</Text>
        <Text style={styles.listItem}>• The pages of the Application that you visit</Text>
        <Text style={styles.listItem}>• The operating system you use on your mobile device</Text>
      </View>

      <Text style={styles.heading}>Contact Us</Text>
      <TouchableOpacity onPress={() => openLink('mailto:hrodriguez1821@gmail.com')}>
        <Text style={styles.link}>hrodriguez1821@gmail.com</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        backgroundColor: '#fff' 
    },
    content: { 
        padding: 10 
    },
    title: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        marginBottom: 15 
    },
    heading: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        marginTop: 20, 
        marginBottom: 10 
    },
    paragraph: { 
        fontSize: 12, 
        lineHeight: 22, 
        color: '#444', 
        marginBottom: 10 
    },
    list: { 
        marginLeft: 10, 
        marginBottom: 10 
    },
    listItem: { 
        fontSize: 12, 
        lineHeight: 22, 
        color: '#444', 
        marginBottom: 5 
    },
    link: { 
        color: '#007AFF', 
        textDecorationLine: 'underline' 
    }
});

export default PrivacyPolicyPage;