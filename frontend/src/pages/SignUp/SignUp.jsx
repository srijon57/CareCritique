import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../../services/api';
import { useSnackbar } from 'notistack';

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);

        const registrationData = {
            email: formData.email,
            password: formData.password,
            user_type: 'Patient',
            first_name: formData.firstName,
            last_name: formData.lastName,
        };

        try {
            const response = await api.post('/register', registrationData);

            if (response.data && response.data.message) {
                enqueueSnackbar(response.data.message, { variant: 'success' });
            } else {
                enqueueSnackbar('Registration successful! Please verify your OTP.', { variant: 'success' });
            }

            navigate('/verify-otp', {
                state: {
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                },
            });
        } catch (error) {
            if (error.response && error.response.data && error.response.data.error) {
                enqueueSnackbar(error.response.data.error, { variant: 'error' });
            } else if (error.response && error.response.data && error.response.data.messages) {
                Object.values(error.response.data.messages).forEach(message => {
                    enqueueSnackbar(message[0], { variant: 'error' });
                });
            } else {
                enqueueSnackbar('Registration failed. Please try again.', { variant: 'error' });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    // Animation variants for form fields
    const fieldVariants = {
        hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: 'easeOut' } },
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.2,
            },
        },
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-850 dark:to-gray-900 flex items-center justify-center p-4 overflow-hidden relative"
        >
            {/* Abstract Decorative Elements */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-cyan-200/30 dark:bg-cyan-800/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-purple-200/20 dark:bg-purple-800/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-blue-100/20 dark:bg-blue-900/10 rounded-full blur-xl opacity-40"></div>

            {/* Main Card */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-xl bg-white dark:bg-gray-800 shadow-2xl backdrop-blur-sm bg-opacity-80 dark:bg-opacity-90 rounded-3xl p-8 md:p-10 border border-white/10 dark:border-gray-700/50 relative overflow-hidden"
            >
                {/* Floating Top Gradient Border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-t-3xl"></div>

                {/* Logo & Title */}
                <div className="text-center mb-10">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2, duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
                        className="flex justify-center mb-6"
                    >
                        <div className="relative">
                            <img
                                src="https://cdn-icons-png.flaticon.com/512/4850/4850806.png"
                                alt="Medical Provider Icon"
                                className="w-20 h-20 dark:invert drop-shadow-lg"
                            />
                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-cyan-500 rounded-full border-2 border-white dark:border-gray-800 shadow-lg"></div>
                        </div>
                    </motion.div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-2 tracking-tight">
                        Welcome to <span className="text-cyan-600 dark:text-cyan-400">CareCritique</span>
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed max-w-xs mx-auto">
                        Your trusted partner in personalized healthcare. Join thousands of patients who choose excellence.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSignUp} className="space-y-6">
                    <div className="grid grid-cols-1 gap-6">
                        {Object.keys(formData).map((key) => (
                            <motion.div
                                key={key}
                                variants={fieldVariants}
                                className="relative group"
                            >
                                <label
                                    htmlFor={key}
                                    className={`absolute left-4 top-4 text-sm font-medium transition-all duration-300 pointer-events-none peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-cyan-600 dark:peer-focus:text-cyan-400 bg-white dark:bg-gray-800 px-1 rounded-sm z-10 ${
                                        formData[key]
                                            ? '-translate-y-4 scale-75 text-cyan-600 dark:text-cyan-400'
                                            : 'text-gray-500 dark:text-gray-400'
                                    }`}
                                >
                                    {key.charAt(0).toUpperCase() + key.slice(1)}
                                </label>
                                <input
                                    type={key === 'email' ? 'email' : key === 'password' ? 'password' : 'text'}
                                    id={key}
                                    value={formData[key]}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-5 py-4 pr-10 border-2 rounded-2xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-800/50 focus:border-transparent transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500 peer"
                                    placeholder=" "
                                    aria-label={key.charAt(0).toUpperCase() + key.slice(1)}
                                />
                                {/* Input Icon (Email/Password) */}
                                <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200">
                                    {key === 'email' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 5.884v10.23a2 2 0 00-3.172 1.674L10 15.127l-2.828 1.674A2 2 0 004 16.118V5.884z" />
                                        </svg>
                                    )}
                                    {key === 'password' && (
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 116 0z" clipRule="evenodd" />
                                        </svg>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Password Strength Indicator (Subtle) */}
                    {formData.password.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-2 flex items-center space-x-1"
                        >
                            <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full transition-all duration-300 ${
                                        formData.password.length < 6
                                            ? 'bg-red-400 w-1/5'
                                            : formData.password.length < 10
                                              ? 'bg-yellow-400 w-3/5'
                                              : 'bg-green-500 w-full'
                                    }`}
                                ></div>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                {formData.password.length < 6
                                    ? 'Weak'
                                    : formData.password.length < 10
                                      ? 'Medium'
                                      : 'Strong'}
                            </span>
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02, boxShadow: '0 10px 25px rgba(14, 165, 233, 0.3)' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-cyan-300/50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 relative overflow-hidden group"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {isSubmitting ? (
                                <>
                                    <motion.div
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 0.8, repeat: Infinity }}
                                    ></motion.div>
                                    Verifying...
                                </>
                            ) : (
                                'Create My Account'
                            )}
                        </span>
                        <span className="absolute inset-0 bg-gradient-to-r from-cyan-700 to-blue-700 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                    </motion.button>
                </form>

                {/* Divider Line */}
                <div className="my-8 flex items-center">
                    <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                    <span className="mx-4 text-sm text-gray-500 dark:text-gray-400">or</span>
                    <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                </div>

                {/* Professional Signup CTA */}
                <div className="text-center">
                    <p className="text-gray-700 dark:text-gray-300 font-medium mb-3">
                        Are you a <span className="text-cyan-700 dark:text-cyan-400">Healthcare Professional</span>?
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.03, backgroundColor: '#10b981' }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => navigate('/DrSignUp')}
                        className="inline-flex items-center justify-center px-8 py-3 bg-gradient-to-r from-green-500 to-teal-500 text-white font-medium rounded-2xl shadow-md hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300/50 transition-all duration-200 border border-green-200 dark:border-green-900/30"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path
                                fillRule="evenodd"
                                d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                clipRule="evenodd"
                            />
                        </svg>
                        Sign Up as Doctor
                    </motion.button>
                </div>

                {/* Footer Link */}
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-cyan-600 dark:text-cyan-400 font-medium hover:underline focus:outline-none focus:underline"
                        >
                            Log In
                        </button>
                    </p>
                </div>

                {/* Trust Badges */}
                <div className="mt-8 flex justify-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                        </svg>
                        Secure & Encrypted
                    </span>
                    <span className="flex items-center">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                        GDPR Compliant
                    </span>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default SignUpPage;