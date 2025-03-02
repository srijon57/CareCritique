import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { useSnackbar } from 'notistack';

const VerifyOtpPage = () => {
    const [otp, setOtp] = useState('');
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const location = useLocation();
    const { email, firstName, lastName } = location.state || {};

    const handleChange = (e) => {
        setOtp(e.target.value);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        const verifyData = {
            email,
            otp,
            first_name: firstName,
            last_name: lastName,
        };

        try {
            const response = await api.post('/verify-otp', verifyData);
            if (response.data && response.data.message) {
                enqueueSnackbar(response.data.message, { variant: 'success' });
            } else {
                enqueueSnackbar('OTP verified successfully!', { variant: 'success' });
            }
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                enqueueSnackbar(error.response.data.error, { variant: 'error' });
            } else {
                enqueueSnackbar('OTP verification failed. Please try again.', { variant: 'error' });
            }
        }
    };

    useEffect(() => {
        if (!email) {
            navigate('/');
        }
    }, [email, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
                    Verify Your OTP
                </h2>
                <form onSubmit={handleVerifyOtp}>
                    <div className="mb-4">
                        <label htmlFor="otp" className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                            OTP
                        </label>
                        <input
                            type="text"
                            id="otp"
                            value={otp}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-400 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-700"
                            required
                        />
                    </div>
                    <div className="flex justify-center gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="inline-block font-medium px-10 py-2 rounded-md border border-red-500 text-red-500 dark:text-red-400 hover:bg-red-300 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="inline-block text-white font-medium px-10 py-2 rounded-md bg-cyan-700 hover:bg-cyan-800 focus:outline-none"
                        >
                            Verify OTP
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default VerifyOtpPage;
