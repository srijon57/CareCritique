import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [address, setAddress] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [gender, setGender] = useState("male");
    const [contactNumber, setContactNumber] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const navigate = useNavigate();


    const handleSignUp = (e) => {
        e.preventDefault();
        console.log("Sign Up Data:", {
            firstName,
            lastName,
            email,
            address,
            bloodGroup,
            gender,
            contactNumber,
            city,
            state,
            password,
        });

    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center">
            <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-6"> { }
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create Your Account</h2>
                <form onSubmit={handleSignUp}>
                    <div className="grid grid-cols-2 gap-4"> { }
                        <div className="mb-4">
                            <label htmlFor="firstName" className="block text-gray-700 font-medium mb-1">First Name</label>
                            <input type="text" id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-4 py-2 border border-gray-400 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-700" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="lastName" className="block text-gray-700 font-medium mb-1">Last Name</label>
                            <input type="text" id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-4 py-2 border border-gray-400 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-700" required />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="email" className="block text-gray-700 font-medium mb-1">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="w-full px-4 py-2 border border-gray-400 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-700" required />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="address" className="block text-gray-700 font-medium mb-1">Address</label>
                        <input type="text" id="address" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-4 py-2 border border-gray-400 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-700" required />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label htmlFor="bloodGroup" className="block text-gray-700 font-medium mb-1">Blood Group</label>
                            <input type="text" id="bloodGroup" value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="w-full px-4 py-2 border border-gray-400 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-700" required />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="gender" className="block text-gray-700 font-medium mb-1">Gender</label>
                            <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} className="w-full px-4 py-2 border border-gray-400 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-700">
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="contactNumber" className="block text-gray-700 font-medium mb-1">Contact Number</label>
                        <input type="tel" id="contactNumber" value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} className="w-full px-4 py-2 border border-gray-400 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-700" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="mb-4">
                            <label htmlFor="city" className="block text-gray-700 font-medium mb-1">City</label>
                            <select
                                id="city"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-400 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-700"
                                required
                            >
                                <option value="">Select a city</option>
                                <option value="Dhaka">Dhaka</option>
                                <option value="Chittagong">Chittagong</option>
                                <option value="Khulna">Barishal</option>
                                <option value="Barishal">Sylhet</option>
                                <option value="Sylhet">Rangpur</option>

                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="state" className="block text-gray-700 font-medium mb-1">State</label>
                            <input type="text" id="state" value={state} onChange={(e) => setState(e.target.value)} className="w-full px-4 py-2 border border-gray-400 rounded-md bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-700" required />
                        </div>
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-gray-700 font-medium mb-1">Password</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full px-4 py-2 border border-gray-400 rounded-lg bg-gray-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-600" required />
                    </div>

                    <button
                        type="button"
                        className="inline-block font-medium px-10 py-2 rounded-md border border-red-500 text-red-500 hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-red-400 mr-2"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-block text-white font-medium mb-1 px-10 py-2 rounded-md bg-cyan-700 hover:bg-cyan-800 focus:outline-none" // Sign Up button styles - already inline-block
                    >
                        Sign Up
                    </button>
                </form>
                <div className="mt-16 text-center">
                    <div className="flex justify-center">
                        <img src="https://cdn-icons-png.flaticon.com/512/4850/4850806.png"
                            alt="Medical Provider Icon"
                            className="w-12 h-12" />
                    </div>
                    <p className="text-gray-700 font-medium mt-2">
                        MEDICAL PROVIDER OR ADMINISTRATOR?
                    </p>
                    <button
                        className="mt-2 px-4 py-2 text-white bg-cyan-700 hover:bg-cyan-800 rounded-md"
                        onClick={() => (window.location.href = "/DrSignUp")}
                    >
                        SIGNUP HERE
                    </button>
                </div>

            </div>
        </div>
    );
};

export default SignUpPage;