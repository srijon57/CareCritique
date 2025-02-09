import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; 

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate(); 

    const handleLogin = (e) => {
        e.preventDefault();
        console.log("Email:", email);
        console.log("Password:", password);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
            <div className="w-full max-w-sm bg-white shadow-lg rounded-lg p-6">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Log in to Your Account</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-2 ">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className="w-full px-4 py-2 border border-gray-400 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-2 ">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            placeholder="Enter your password"
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-600"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-cyan-700 text-white font-medium py-2 rounded-full hover:bg-cyan-700 focus:outline-none"
                    >
                        Login
                    </button>
                    <div className="mt-9"></div>
                </form>
                <button
                    type="button"
                    onClick={() => navigate("/signUp")} 
                    className="w-full border-2 border-cyan-700 text-cyan-500 font-medium py-2 rounded-full hover:bg-cyan-700 hover:text-white transition duration-300"
                >
                    New Here? Sign Up!
                </button>
            </div>
            <div className="mt-6">
                <button
                    onClick={() => alert("Calling emergency service...")}
                    className="bg-red-600 text-white font-medium px-6 py-2 rounded-lg shadow-lg hover:bg-red-700 focus:outline-none"
                >
                    Emergency
                    <span className="ml-2">Call 999</span>
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
