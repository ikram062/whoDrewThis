import { createContext, useEffect, useState } from "react";
import type { LoginData, PropsType, RegisterData, User } from "../utils/types";
import authApi from "../api/authApi";
import apiService from "../utils/api";

interface AuthContextType {
    user: User | null;
    isAuthenticated: Boolean;
    isLoading: Boolean;
    error: string | null;
    register: (data: RegisterData) => Promise<void>;
    login: (data: LoginData) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (updatedUserData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsType) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<Boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const getUserFromStorage = (): User | null => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    };

    const clearAuthData = (): void => {
        setUser(null);
        setError(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    };

    const storeTokens = (accessToken: string, refreshToken: string): void => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        apiService.setAuthToken(accessToken);
    };

    const storeUser = (user: User) => {
        localStorage.setItem('user', JSON.stringify(user));
    };

    const updateUser = (updatedUserData: Partial<User>): void => {
        if (user) {
            const updatedUser = { ...user, ...updatedUserData };
            setUser(updatedUser);
            storeUser(updatedUser);
        }
    };

    const isAuthenticated = !!user && !!localStorage.getItem('accessToken');

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const storedUser = getUserFromStorage();
                const accessToken = localStorage.getItem('accessToken');

                if (storedUser && accessToken) {
                    try {
                        setUser(storedUser);
                    } catch (err) {
                        setError("Failed to parse user data from storage.");
                        clearAuthData();
                    }
                }
            } catch (error) {
                clearAuthData();
            } finally {
                setIsLoading(false);
            }
        };

        initializeAuth();
    });

    useEffect(() => {
        const handleAuthFailure = () => {
            clearAuthData();
            setError('Expired session. Log in again.');
        };

        window.addEventListener('auth-failure', handleAuthFailure);

        return (window.removeEventListener('auth-failure', handleAuthFailure));
    }, []);

    const register = async (data: RegisterData): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await authApi.register(data);

            if (response.success && response.data) {
                storeTokens(response.data.accessToken, response.data.refreshToken);
                storeUser(response.data.user);
                setUser(response.data.user);
            } else {
                throw new Error(response.message || 'Registration failed');
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Registration failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (loginData: LoginData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await authApi.login(loginData);

            if (response.success && response.data) {
                storeTokens(response.data.accessToken, response.data.refreshToken);
                storeUser(response.data.user);
                setUser(response.data.user);
            } else {
                throw new Error(response.message || 'Login failed');
            }
        } catch (error: any) {
            const errorMessage = error.message || 'Login failed';
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        setIsLoading(true);

        try {
            await authApi.logout();
        } catch (error: any) {
            console.error('Logout failed:', error);
        } finally {
            clearAuthData();
            setIsLoading(false);
        }
    };

    const value: AuthContextType = {
        user,
        isAuthenticated,
        isLoading,
        error,
        login,
        register,
        logout,
        updateUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}