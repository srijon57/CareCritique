import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useSnackbar } from 'notistack';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginMethod] = useState('email');
    const navigate = useNavigate();
    const { login } = useAuth();
    const { enqueueSnackbar } = useSnackbar();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            console.error('Error during login:', error);
            if (error.message) {
                enqueueSnackbar(error.message, { variant: 'error' });
            } else {
                enqueueSnackbar('Login failed. Please try again.', { variant: 'error' });
            }
        }
    };
    
    

    const loginVariants = {
        hidden: { opacity: 0, x: -50 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.5 } },
        exit: { opacity: 0, x: 50, transition: { duration: 0.3 } },
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center">
            <div className="w-full max-w-sm bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 relative overflow-hidden">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
                    Log in to Your Account
                </h2>
                <AnimatePresence mode="wait">
                    {loginMethod === 'email' && (
                        <motion.form
                            onSubmit={handleLogin}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            variants={loginVariants}
                        >
                            <div className="mb-4">
                                <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                    Gmail
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-400 dark:border-gray-600 rounded-md
                                    bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white
                                    focus:outline-none focus:ring-2 focus:ring-cyan-700 dark:focus:ring-cyan-400"
                                    required
                                />
                            </div>
                            <div className="mb-6">
                                <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-400 dark:border-gray-600 rounded-lg
                                    bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white
                                    focus:outline-none focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-400"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-cyan-700 dark:bg-cyan-600 text-white font-medium py-2 rounded-full
                                hover:bg-cyan-800 dark:hover:bg-cyan-700 focus:outline-none transition-colors"
                            >
                                Login
                            </button>
                        </motion.form>
                    )}       
                </AnimatePresence>
                <button
                    type="button"
                    onClick={() => navigate('/SignUp')}
                    className="w-full border-2 border-cyan-700 dark:border-cyan-400 text-cyan-500 dark:text-cyan-400
                    font-medium py-2 rounded-full hover:bg-cyan-700 dark:hover:bg-cyan-600 hover:text-white
                    transition duration-300 mt-4"
                >
                    New Here? Sign Up!
                </button>
            </div>

            <div className="mt-6">
                <button
                    onClick={() => alert('Calling emergency service...')}
                    className="bg-red-600 dark:bg-red-700 text-white font-medium px-6 py-2 rounded-lg shadow-lg
                    hover:bg-red-700 dark:hover:bg-red-800 focus:outline-none transition-colors"
                >
                    Emergency
                    <span className="ml-2">Call 999</span>
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
