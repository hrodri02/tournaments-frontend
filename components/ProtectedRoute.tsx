import React from 'react';
import {Redirect} from 'expo-router';
import {useAuth} from '@/contexts/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export default function ProtectedRoute({children}: ProtectedRouteProps) {
    const {isAuthenticated, isLoading} = useAuth();

    if (isLoading) {
        return null; // Or a loading spinner
    }

    if (!isAuthenticated) {
        return <Redirect href="/login"/>;
    }

    return <>{children}</>;
}
