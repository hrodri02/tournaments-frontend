import React, {useState} from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';

interface EditEmailFormProps {
    oldEmail: string;
    onSubmit: (newEmail: string, oldEmail: string) => void;
    onClose: () => void;
}

export default function EditEmailForm({ oldEmail, onSubmit, onClose }: EditEmailFormProps) {
    const [email, setEmail] = useState(oldEmail);

    const handleSubmitPress = () => {
        // Clean up the email (e.g., remove whitespace)
        const trimmedEmail = email.trim();
        
        if (trimmedEmail) {
            // 3. Call the parent's function
            onSubmit(trimmedEmail, oldEmail);
            
            // Clear the input and close the modal
            setEmail(''); 
            onClose();
        } else {
            // Handle case where input is empty
            alert('Please enter a valid email address.');
        }
    };

    return (
        <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Edit email</Text>
            <TextInput
                style={[styles.input, styles.whiteBackground]}
                onChangeText={setEmail}
                value={email}
                placeholder="Enter email"
            />

            <Pressable
                onPress={handleSubmitPress}
                style={styles.buttonContainer}
            >
                <Text style={styles.buttonText}>Submit</Text>
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