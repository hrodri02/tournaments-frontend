export type Role = 'USER' | 'ADMIN' | 'PLAYER';

export interface AuthResponse {
    user: User;
    tokens: Tokens;
}

export interface User {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    appUserRole: Role;
}

export interface Tokens {
    refreshToken: string;
    accessToken: string;
    expiresIn: number;
    tokenType: string;
}
  
export interface AuthState {
    user: User | null;
    accessToken: string | null;
    refreshToken: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
    rememberMe: boolean;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials extends LoginCredentials {
    name: string;
}

export interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials, rememberMe: boolean) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    clearError: () => void;
    rememberMeToggle: (rememberMe: boolean) => void;
} 