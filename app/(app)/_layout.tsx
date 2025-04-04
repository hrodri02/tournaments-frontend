import { useEffect } from "react";
import { Stack, Redirect } from "expo-router";
import { useAppSelector, useAppDispatch } from '@/hooks/useStore';
import { loadAuth, selectAuthStatus, selectAuthToken, selectAuthError } from '@/store/auth/auth.slice';
import { ActivityIndicator, Text, View, StyleSheet } from 'react-native'

const styles = StyleSheet.create({
    containerView: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        justifyContent: 'center'
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
})

export default function AppLayout() {
    const dispatch = useAppDispatch()
    const authStatus = useAppSelector(selectAuthStatus)
    const authToken = useAppSelector(selectAuthToken)
    const authError = useAppSelector(selectAuthError)
    
    useEffect(() => {
        if (authStatus === 'idle') {
            dispatch(loadAuth())
        }
    }, [authStatus, dispatch])

    let content: React.ReactNode
    const homeScreen: React.ReactNode = 
        <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
        </Stack>

    if (authStatus === 'loading') {
        // loading auth state or login request is pending
        content = <ActivityIndicator size="large" color="#0000ff"/>
    }
    else if (authStatus === 'succeeded') {
        // loading auth state succeeded, but not auth token is present
        if (authToken === null) {
            return <Redirect href='/auth/login' />
        }
        
        // loading auth state succeeded, and auth token is present
        return (homeScreen)
    }
    else if (authStatus === 'failed') {
        // failed to logout
        if (authToken !== null) {
            return (homeScreen)
        }
        // failed to login or to load auth state
        content = <Text style={styles.errorView}>{authError}</Text>
    }

    return (
        <View style={styles.containerView}>
            {content}
        </View>
    )
}