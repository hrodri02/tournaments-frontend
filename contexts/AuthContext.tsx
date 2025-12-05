import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from "react";
import { Platform } from "react-native";
import {
  AuthContextType,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
} from "@/entities/auth";
import {
  getStoredAuth,
  setStorageItemAsync,
  TOKEN_KEY,
  USER_KEY,
  clearStoredAuth,
} from "@/store/auth/authStorage";
import { useAppDispatch } from "@/hooks/useStore";
import { resetFetchState } from "@/store/teams/teamsSlice";
import { useTranslation } from "react-i18next";

// TODO: Change to the API_URL from the .env file
// Platform-specific API URL
const API_URL = Platform.select({
  android: "http://ec2-34-225-163-243.compute-1.amazonaws.com/api/v1", // Android emulator
  ios: "http://ec2-34-225-163-243.compute-1.amazonaws.com/api/v1", // iOS simulator
  default: "http://ec2-34-225-163-243.compute-1.amazonaws.com/api/v1", // fallback
});
const TOKEN_PREFIX_LENTH = 7;

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { t } = useTranslation('errors');
  const dispatch = useAppDispatch();
  const [state, setState] = useState<AuthState>(initialState);

  // Load stored authentication on mount
  useEffect(() => {
    async function loadStoredAuth() {
      try {
        const { token, user } = await getStoredAuth();
        if (token && user) {
          setState({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
        } else {
          setState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error:
            error instanceof Error
              ? error.message
              : "Failed to load auth state",
        }));
      }
    }
    loadStoredAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      // This coudl be moved to a service file for modularity as well as other endpoints
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        // 1. Read the response body to get the server's detailed error message.
        let errorMessage = "Invalid username or password";
        
        try {
          const errorData = await response.json();
          
          // Assuming the error structure from your Spring backend includes a 'message' field
          // that contains the detailed exception text (e.g., from ServiceException).
          if (errorData) {
            const key = errorData.errorKey;
            errorMessage = t(`${key}`);
          }
        } catch (e) {
          // Fallback if the response body is not valid JSON
          errorMessage = `Login failed with status ${response.status}. Could not read error details.`;
        }
        
        // 2. Throw a new Error using the specific message retrieved from the server.
        throw new Error(errorMessage);
      }

      const data = await response.json()
      const headers = response.headers
      const authorization = headers.get("Authorization")
      const token = authorization?.substring(TOKEN_PREFIX_LENTH)

      // Store auth data
      await Promise.all([
        setStorageItemAsync(TOKEN_KEY, token!),
        setStorageItemAsync(USER_KEY, JSON.stringify(data)),
      ]);

      setState({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "An error occurred",
      }));
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error("Registration failed");
      }

      const data = await response.json();

      // Store auth data
      await Promise.all([
        setStorageItemAsync(TOKEN_KEY, data.token),
        setStorageItemAsync(USER_KEY, JSON.stringify(data.user)),
      ]);

      setState({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "An error occurred",
      }));
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      await clearStoredAuth();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      });
      dispatch(resetFetchState())
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Logout failed"
      }));
    }
  }, [dispatch]);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      login,
      register,
      logout,
      clearError,
    }),
    [state, login, register, logout, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
