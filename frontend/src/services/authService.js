import axios from './utils/axios';

export const signUp = async (userData) => {
    try {
        const response = await axios.post('/auth/signup', userData);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};

export const login = async (credentials) => {
    try {
        const response = await axios.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw error.response.data;
    }
};
