import React, { useState, useEffect } from 'react';
import { Link, Redirect } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { useAppSelector, useAppDispatch } from '@/hooks/useStore';
import { loginRequest, resetAuthState, selectAuthStatus, selectAuthError } from '@/store/auth/auth.slice';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen = () => {
    const dispatch = useAppDispatch()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const authStatus = useAppSelector(selectAuthStatus);
    const authError = useAppSelector(selectAuthError);

    let content: React.ReactNode
    if (authStatus === "idle" || authStatus === 'failed') {
        content = <KeyboardAvoidingView style={styles.container} behavior="padding">
                    <View style={styles.innerContainer}>
                        <Text style={styles.title}>Welcome Back!</Text>
                        <Text style={styles.subtitle}>Login to your account</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChangeText={text => { 
                                dispatch(resetAuthState())
                                setEmail(text) 
                            }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            placeholderTextColor="#6e6e6e"
                        />

                        <TextInput
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChangeText={text => {
                                dispatch(resetAuthState())
                                setPassword(text)
                            }}
                            secureTextEntry
                            placeholderTextColor="#6e6e6e"
                        />

                        {authStatus === 'failed' && <Text style={styles.errorView}>{authError}</Text>}

                        <TouchableOpacity style={styles.button} onPress={() =>
                            dispatch(loginRequest({email, password}))
                        }>
                            <Text style={styles.buttonText}>Login</Text>
                        </TouchableOpacity>

                        <Text style={styles.footerText}>
                            Don't have an account? <Link href="/auth/signup" style={styles.linkText}>Sign Up</Link>
                        </Text>
                        
                    </View>
                </KeyboardAvoidingView>
    }
    else if (authStatus === "loading") {
        content = <ActivityIndicator size="large" color="#0000ff"/>
    }
    else if (authStatus === "succeeded") {
        content = <Redirect href="/" />
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.safeAreaView}>
                {content}
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    safeAreaView: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center'
    },
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
    errorView: {
        backgroundColor: 'red',
        color: '#fff',
        textAlign: 'center',
        paddingVertical: 12,
        fontSize: 18,
        fontWeight: 'bold',
        borderRadius: 8
    }
});

export default LoginScreen;
