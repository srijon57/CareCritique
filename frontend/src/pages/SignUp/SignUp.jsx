import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FcGoogle } from "react-icons/fc";

const SignUpPage = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        bloodGroup: "",
        gender: "male",
        contactNumber: "",
        city: "",
        state: "",
        password: "",
    });
    
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSignUp = (e) => {
        e.preventDefault();
        console.log("Sign Up Data:", formData);
    };

    const handleGoogleSignUp = () => {
        console.log("Signing up with Google...");
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center"
        >
            <div className="w-full max-w-3xl bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-gray-100 mb-6">
                    Create Your Account
                </h2>

                <form onSubmit={handleSignUp}>
                    <div className="grid grid-cols-2 gap-4">
                        {Object.keys(formData).map((key) => (
                            key !== "password" && (
                                <div key={key} className="mb-4">
                                    <label htmlFor={key} className="block text-gray-700 dark:text-gray-300 font-medium mb-1">
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </label>
                                    <input
                                        type={key === "email" ? "email" : "text"}
                                        id={key}
                                        value={formData[key]}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-400 dark:border-gray-600 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-700"
                                        required
                                    />
                                </div>
                            )
                        ))}
                    </div>

                    <motion.button
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleGoogleSignUp}
                        className="w-full flex items-center justify-center gap-2 mb-4 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                        <FcGoogle className="w-5 h-5" />
                        <span className="text-white">Sign up with Google</span>
                    </motion.button>

                    <div className="flex justify-start gap-4">
                        <button
                            type="button"
                            onClick={() => navigate("/")}
                            className="inline-block font-medium px-10 py-2 rounded-md border border-red-500 text-red-500 dark:text-red-400 hover:bg-red-300 dark:hover:bg-red-900 focus:outline-none focus:ring-2 focus:ring-red-400"
                        >
                            Cancel
                        </button>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block text-white font-medium px-10 py-2 rounded-md bg-cyan-700 hover:bg-cyan-800 focus:outline-none"
                        >
                            Sign Up
                        </motion.button>
                    </div>
                </form>

                <div className="mt-16 text-center">
                    <div className="flex justify-center">
                        <img
                            src="https://cdn-icons-png.flaticon.com/512/4850/4850806.png"
                            alt="Medical Provider Icon"
                            className="w-12 h-12 dark:invert"
                        />
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 font-medium mt-2">
                        MEDICAL PROVIDER OR ADMINISTRATOR?
                    </p>
                    <button
                        className="mt-2 px-4 py-2 text-white bg-cyan-700 hover:bg-cyan-800 rounded-md"
                        onClick={() => navigate("/DrSignUp")}
                    >
                        SIGNUP HERE
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

export default SignUpPage;
