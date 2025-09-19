import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useSnackbar } from 'notistack';
import { motion } from 'framer-motion';
import FileUpload from '../../components/FileUpload';

const DrSignUpPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        firstName: '',
        lastName: '',
        profilePicture: null,
        certificate1: null,
        certificate2: null,
        certificate3: null,
    });

    const [fileNames, setFileNames] = useState(['', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleFileChange = (index, event) => {
        const file = event.target.files[0];
        if (index === 0) {
            setFormData((prev) => ({ ...prev, profilePicture: file }));
        } else {
            const newFileNames = [...fileNames];
            newFileNames[index - 1] = file ? file.name : '';
            setFileNames(newFileNames);
            setFormData((prev) => ({ ...prev, [`certificate${index}`]: file }));
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        setIsSubmitting(true);

        const formDataToSend = new FormData();
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('user_type', 'Doctor');
        formDataToSend.append('first_name', formData.firstName);
        formDataToSend.append('last_name', formData.lastName);

        if (formData.profilePicture) {
            formDataToSend.append('profile_picture', formData.profilePicture);
        }
        if (formData.certificate1) {
            formDataToSend.append('certificate_path1', formData.certificate1);
        }
        if (formData.certificate2) {
            formDataToSend.append('certificate_path2', formData.certificate2);
        }
        if (formData.certificate3) {
            formDataToSend.append('certificate_path3', formData.certificate3);
        }

        // Debugging
        for (let pair of formDataToSend.entries()) {
            console.log(pair[0], pair[1]);
        }

        try {
            const response = await api.post('/register', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            enqueueSnackbar(response.data.message || 'Registration successful!', { variant: 'success' });
            navigate('/verify-otp', {
                state: {
                    email: formData.email,
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                },
            });
        } catch (error) {
            enqueueSnackbar(error.response?.data?.error || 'Registration failed. Please try again.', { variant: 'error' });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2,
            },
        },
    };

    const fieldVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
    };

    const buttonVariants = {
        hover: { scale: 1.05 },
        tap: { scale: 0.98 },
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-gradient-to-br from-gray-50 to-cyan-50 dark:from-gray-900 dark:to-gray-950 flex items-center justify-center p-4 overflow-hidden relative"
        >
            {/* Abstract Background Elements */}
            <div className="absolute top-10 left-10 w-32 h-32 bg-cyan-200/20 dark:bg-cyan-800/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-40 h-40 bg-purple-200/15 dark:bg-purple-900/10 rounded-full blur-3xl animate-pulse delay-1000"></div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-2xl backdrop-blur-sm bg-opacity-90 dark:bg-opacity-95 rounded-3xl overflow-hidden border border-white/10 dark:border-gray-700/50"
            >
                {/* Header Banner */}
                <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-700 p-8 text-white">
                    <div className="flex items-center justify-center gap-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h1M5 16h14" />
                        </svg>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Doctor Registration</h1>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                    </div>
                    <p className="mt-3 text-cyan-100 text-lg max-w-2xl mx-auto text-center">
                        Join our network of trusted healthcare professionals. Complete your registration with valid credentials and certifications.
                    </p>
                </div>

                {/* Form Body */}
                <form onSubmit={handleSignUp} className="p-8 md:p-10 space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div variants={fieldVariants}>
                            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-5 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-800/30 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500"
                                required
                            />
                        </motion.div>

                        <motion.div variants={fieldVariants}>
                            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="w-full px-5 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-800/30 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500"
                                required
                            />
                        </motion.div>
                    </div>

                    <motion.div variants={fieldVariants}>
                        <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-5 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-800/30 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500"
                            required
                            placeholder="yourname@domain.com"
                        />
                    </motion.div>

                    <motion.div variants={fieldVariants}>
                        <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-5 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-cyan-200 dark:focus:ring-cyan-800/30 transition-all duration-300 placeholder-gray-400 dark:placeholder-gray-500"
                            required
                            placeholder="••••••••"
                        />
                    </motion.div>

                    {/* Profile Picture Upload */}
                    <motion.div variants={fieldVariants} className="relative">
                        <label className="block text-gray-700 dark:text-gray-200 font-medium mb-3">
                            Upload Profile Picture
                        </label>
                        <label className="relative flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl cursor-pointer hover:border-cyan-500 dark:hover:border-cyan-400 transition-colors duration-300 group">
                            <input
                                type="file"
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                onChange={(e) => handleFileChange(0, e)}
                                accept="image/*"
                                aria-label="Upload profile picture"
                            />
                            <div className="flex flex-col items-center justify-center text-center p-4">
                                {formData.profilePicture ? (
                                    <>
                                        <img
                                            src={URL.createObjectURL(formData.profilePicture)}
                                            alt="Preview"
                                            className="w-16 h-16 object-cover rounded-full mb-3 border-2 border-cyan-300 dark:border-cyan-700 shadow-md"
                                        />
                                        <span className="text-sm text-gray-600 dark:text-gray-300 font-medium truncate max-w-xs">
                                            {formData.profilePicture.name}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-8 w-8 text-gray-400 group-hover:text-cyan-500 transition-colors duration-300"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                            />
                                        </svg>
                                        <span className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            Click to upload or drag and drop
                                        </span>
                                        <span className="text-xs text-gray-400 dark:text-gray-500">
                                            PNG, JPG, GIF up to 10MB
                                        </span>
                                    </>
                                )}
                            </div>
                        </label>
                    </motion.div>

                    {/* Certificates Upload Section */}
                    <motion.div variants={fieldVariants} className="space-y-6">
                        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
                            Professional Certifications (Max 3)
                        </h3>
                        <FileUpload
                            fileNames={fileNames}
                            setFileNames={setFileNames}
                            handleFileChange={handleFileChange}
                        />
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                        className="flex justify-between pt-6 border-t border-gray-200 dark:border-gray-700"
                        variants={buttonVariants}
                    >
                        <motion.button
                            type="button"
                            onClick={() => navigate('/')}
                            className="px-8 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all duration-300 transform hover:-translate-y-1 shadow-md"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Cancel
                        </motion.button>

                        <motion.button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-12 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-medium hover:from-cyan-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-cyan-300/50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                    <motion.div
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 0.8, repeat: Infinity }}
                                    ></motion.div>
                                    Registering...
                                </span>
                            ) : (
                                'Complete Registration'
                            )}
                        </motion.button>
                    </motion.div>
                </form>
            </motion.div>

            {/* Trusted by AUST Badge */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
            >
                <span className="flex items-center gap-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    Trusted by AUST
                </span>
            </motion.div>
        </motion.div>
    );
};

export default DrSignUpPage;