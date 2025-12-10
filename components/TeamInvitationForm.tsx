import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    Pressable, 
    StyleSheet 
} from 'react-native';
import { useTranslation } from 'react-i18next';

interface TeamInvitationFormProps {
    onInvite: (email: string) => void;
    onClose: () => void;
}

export default function TeamInvitationForm({ onInvite, onClose}: TeamInvitationFormProps) {
    const { t } = useTranslation(['teams', 'common']);
    const [email, setEmail] = useState('');

    const handleAddEmailPress = () => {
        // Clean up the email (e.g., remove whitespace)
        const trimmedEmail = email.trim();
        
        if (trimmedEmail) {
            // 3. Call the parent's function
            onInvite(trimmedEmail);
            
            // Clear the input and close the modal
            setEmail(''); 
            onClose();
        } else {
            // Handle case where input is empty
            alert(t('invites.error_message'));
        }
    };

    return (
        <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{t('invites.title')}</Text>
            <TextInput
                style={[styles.input, styles.whiteBackground]}
                onChangeText={setEmail}
                value={email}
                placeholder={t('common:email_placeholder')}
            />

            <Pressable
                onPress={handleAddEmailPress}
                style={styles.buttonContainer}
            >
                <Text style={styles.buttonText}>{t('invites.button')}</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        marginTop: 44,
        borderRadius: 20,
        padding: 35,
        backgroundColor: '#777',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 15
    },
    input: {
        height: 40,
        borderWidth: 1,
        padding: 10,
        marginBottom: 20
    },
    whiteBackground: {
        backgroundColor: 'white'
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
    }
});