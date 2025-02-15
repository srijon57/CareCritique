import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useSnackbar } from 'notistack';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');

        if (storedAccessToken && storedRefreshToken) {
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            setIsAuthenticated(true);
        }
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            const { access_token, refresh_token } = response.data;
            setAccessToken(access_token);
            setRefreshToken(refresh_token);
            localStorage.setItem('accessToken', access_token);
            localStorage.setItem('refreshToken', refresh_token);
            setIsAuthenticated(true);
            enqueueSnackbar('Logged in successfully!', { variant: 'success' });
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Login failed. Please check your credentials.';
            throw new Error(errorMessage);
        }
    };

    const logout = () => {
        setIsAuthenticated(false);
        setAccessToken(null);
        setRefreshToken(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    };

    const refreshAccessToken = async () => {
        try {
            const response = await api.post('/refresh-token', {}, {
                headers: {
                    Authorization: `Bearer ${refreshToken}`,
                },
            });
            const { access_token } = response.data;
            setAccessToken(access_token);
            localStorage.setItem('accessToken', access_token);
        } catch (error) {
            console.error('Token refresh failed:', error);
            logout();
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            const interval = setInterval(() => {
                refreshAccessToken();
            }, 10 * 60 * 1000);

            return () => clearInterval(interval);
        }
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, accessToken }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
