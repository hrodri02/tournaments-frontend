import { useAuth as useAuthContext } from '../contexts/AuthContext';

export const useAuth = () => {
  const auth = useAuthContext();
  
  return {
    auth,
    isAuthenticated: auth.isAuthenticated,
    user: auth.user,
    isLoading: auth.isLoading,
    error: auth.error,
    login: auth.login,
    register: auth.register,
    logout: auth.logout,
    clearError: auth.clearError,
  };
}; 