// src/utils/axios.js
import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5000', // Replace with your API base URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default instance;