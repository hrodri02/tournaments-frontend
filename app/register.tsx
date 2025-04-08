import React from 'react';
import {View, Text, TextInput, TouchableOpacity, StyleSheet} from 'react-native';
import {useAuth} from '@/contexts/AuthContext';
import {router} from 'expo-router';

export default function RegisterScreen() {
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const {register, isLoading, error} = useAuth();

    const handleRegister = async () => {
        try {
            await register({name, email, password});
            router.replace('/(app)/home');
        } catch (err) {
            console.error('Registration failed:', err);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>

            {error && <Text style={styles.error}>{error}</Text>}

            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            <TouchableOpacity
                style={[styles.button, isLoading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={isLoading}
            >
                <Text style={styles.buttonText}>
                    {isLoading ? 'Registering...' : 'Register'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.link}
                onPress={() => router.push('/login')}
            >
                <Text style={styles.linkText}>Already have an account? Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginBottom: 15,
        textAlign: 'center',
    },
    link: {
        marginTop: 20,
        alignItems: 'center',
    },
    linkText: {
        color: '#007AFF',
        fontSize: 16,
    },
});
