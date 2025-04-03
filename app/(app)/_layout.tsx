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
    if (authStatus === 'loading') {
        content = <ActivityIndicator size="large" color="#0000ff"/>
    }
    else if (authStatus === 'succeeded') {
        if (authToken === null) {
            return <Redirect href='/auth/login' />
        }
        return (
            <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
            </Stack>
        );
    }
    else if (authStatus === 'failed') {
        content = <Text style={styles.errorView}>{authError}</Text>
    }

    return (
        <View style={styles.containerView}>
            {content}
        </View>
    )
}