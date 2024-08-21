import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView } from 'react-native';

const SignUpScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    return (
        <KeyboardAvoidingView style={styles.container} behavior="padding">
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Create Account</Text>
                <Text style={styles.subtitle}>Sign up to get started</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={name}
                    onChangeText={text => setName(text)}
                    autoCapitalize="words"
                    placeholderTextColor="#6e6e6e"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={text => setEmail(text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholderTextColor="#6e6e6e"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)}
                    secureTextEntry
                    placeholderTextColor="#6e6e6e"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChangeText={text => setConfirmPassword(text)}
                    secureTextEntry
                    placeholderTextColor="#6e6e6e"
                />

                <TouchableOpacity style={styles.button} onPress={() => console.log('Sign Up pressed')}>
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>

                <Text style={styles.footerText}>
                    Already have an account? <Text style={styles.linkText}>Login</Text>
                </Text>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#f5f5f5',
    },
    innerContainer: {
        justifyContent: 'center',
        alignItems: 'stretch',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        color: '#6e6e6e',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 15,
        backgroundColor: '#fff',
    },
    button: {
        backgroundColor: '#6200ee',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    footerText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#6e6e6e',
    },
    linkText: {
        color: '#6200ee',
        fontWeight: 'bold',
    },
});

export default SignUpScreen;
