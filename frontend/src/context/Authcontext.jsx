import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

// eslint-disable-next-line react/prop-types
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [refreshToken, setRefreshToken] = useState(null);
    const [userType, setUserType] = useState(null);
    const [loading, setLoading] = useState(true); // Add loading state
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();

    useEffect(() => {
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedUserType = localStorage.getItem('userType');

        if (storedAccessToken && storedRefreshToken && storedUserType) {
            setAccessToken(storedAccessToken);
            setRefreshToken(storedRefreshToken);
            setUserType(storedUserType);
            setIsAuthenticated(true);
        }
        setLoading(false); // Set loading to false after initialization
    }, []);

    const login = async (email, password) => {
        try {
            const response = await api.post('/login', { email, password });
            const { access_token, refresh_token } = response.data;

            const user_type = response.data.user_type || 'Patient';
            setAccessToken(access_token);
            setRefreshToken(refresh_token);
            setUserType(user_type);
            localStorage.setItem('accessToken', access_token);
            localStorage.setItem('refreshToken', refresh_token);
            localStorage.setItem('userType', user_type);
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
        setUserType(null);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('userType');
        navigate('/');
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
            }, 10 * 60 * 1000); // Refresh token every 10 minutes

            return () => clearInterval(interval);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout, accessToken, userType, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
