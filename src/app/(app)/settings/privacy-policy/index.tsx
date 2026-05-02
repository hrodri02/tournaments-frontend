import React from 'react';
import { 
    ScrollView, 
    Text, 
    View, 
    StyleSheet, 
    Linking, 
    TouchableOpacity 
} from 'react-native';
import { useTranslation } from 'react-i18next';

const PrivacyPolicyPage = () => {
    const { t } = useTranslation('settings')
    const openLink = (url) => Linking.openURL(url);

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>{t('privacy_policy.title')}</Text>
        <Text style={styles.paragraph}>{t('privacy_policy.paragraph')}</Text>

        <Text style={styles.heading}>
            {t('privacy_policy.information_collection_and_use_title')}
        </Text>
        <Text style={styles.paragraph}>
            {t('privacy_policy.information_collection_and_use_paragraph')}
        </Text>
        
        <View style={styles.list}>
            <Text style={styles.listItem}>
                • {t('privacy_policy.information_collection_and_use_point_one')}
            </Text>
            <Text style={styles.listItem}>
                • {t('privacy_policy.information_collection_and_use_point_two')}
            </Text>
            <Text style={styles.listItem}>
                • {t('privacy_policy.information_collection_and_use_point_three')}
            </Text>
        </View>

        <Text style={styles.heading}>{t('contact_us_title')}</Text>
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