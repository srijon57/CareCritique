import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const FileUpload = () => {
    const [fileNames, setFileNames] = useState(["", "", ""]);

    const handleFileChange = (index, event) => {
        const file = event.target.files[0];
        const newFileNames = [...fileNames];
        newFileNames[index] = file ? file.name : "";
        setFileNames(newFileNames);
    };

    return (
        <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">

                Upload Valid Certificates
            </label>
            <div className="flex gap-4">
                {fileNames.map((fileName, index) => (
                    <label
                        key={index}
                        className="flex-1 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-cyan-500 dark:hover:border-cyan-600 transition-colors duration-300"
                    >
                        <input
                            type="file"
                            className="hidden"
                            onChange={(e) => handleFileChange(index, e)}
                        />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {fileName || "Click to upload"}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
};

const DrSignUpPage = () => {
    const [userType, setUserType] = useState("Doctor");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [bloodGroup, setBloodGroup] = useState("");
    const [gender, setGender] = useState("Male");
    const [contactNumber, setContactNumber] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [hospital, setHospital] = useState("");
    const [specialty, setSpecialty] = useState("");
    const [education, setEducation] = useState("");
    const [experience, setExperience] = useState("");
    const [language, setLanguage] = useState("");
    const [availability, setAvailability] = useState("");
    const [biography, setBiography] = useState("");
    const [password, setPassword] = useState("");

    const handleSignUp = (e) => {
        e.preventDefault();
        console.log("Sign Up Data:", {
            userType,
            firstName,
            lastName,
            email,
            address,
            bloodGroup,
            gender,
            contactNumber,
            city,
            state,
            hospital,
            specialty,
            education,
            experience,
            language,
            availability,
            biography,
            password,
        });
    };

    const handleGoogleSignUp = () => {
        console.log("Signing up with Google...");
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col justify-center items-center p-4">
            <div className="w-full max-w-4xl bg-white dark:bg-gray-800 shadow-2xl rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-cyan-400 to-cyan-800 p-6">
                    <h2 className="text-2xl font-bold text-white text-center">
                        Doctor Registration
                    </h2>
                </div>
                <div className="p-8">
                    <form onSubmit={handleSignUp}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    className="w-full px-4 py-2 border text-black dark:text-white dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    className="w-full px-4 py-2 text-black dark:text-white border dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-1 gap-1">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border text-black dark:text-white dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                    placeholder="Enter your email"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full px-4 py-2 border text-black dark:text-white dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    Blood Group
                                </label>
                                <input
                                    type="text"
                                    value={bloodGroup}
                                    onChange={(e) => setBloodGroup(e.target.value)}
                                    className="w-full px-4 py-2 border text-black dark:text-white dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    Gender
                                </label>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="w-full px-4 py-2 text-black dark:text-white border dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                className="w-full px-4 py-2 border text-black dark:text-white dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    City
                                </label>
                                <select
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    className="w-full px-4 py-2 border text-black dark:text-white dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                >
                                    <option value="">Select a city</option>
                                    <option value="Dhaka">Dhaka</option>
                                    <option value="Khulna">Khulna</option>
                                    <option value="Chittagong">Chittagong</option>
                                    <option value="Rajshahi">Rajshahi</option>
                                    <option value="Sylhet">Sylhet</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    State
                                </label>
                                <select
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    className="w-full px-4 py-2 border text-black dark:text-white dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                >
                                    <option value="">Select a state</option>
                                    <option value="Dhaka">Dhaka</option>
                                    <option value="Barishal">Barishal</option>
                                    <option value="Chattogram">Chattogram</option>
                                    <option value="Rajshahi">Rajshahi</option>
                                    <option value="Khulna">Khulna</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    Hospital
                                </label>
                                <input
                                    type="text"
                                    value={hospital}
                                    onChange={(e) => setHospital(e.target.value)}
                                    className="w-full px-4 py-2 border text-black dark:text-white dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    Specialty
                                </label>
                                <input
                                    type="text"
                                    value={specialty}
                                    onChange={(e) => setSpecialty(e.target.value)}
                                    className="w-full px-4 py-2 border text-black dark:text-white dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    Education
                                </label>
                                <input
                                    type="text"
                                    value={education}
                                    onChange={(e) => setEducation(e.target.value)}
                                    className="w-full px-4 py-2 border text-black dark:text-white dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    Experience
                                </label>
                                <input
                                    type="text"
                                    value={experience}
                                    onChange={(e) => setExperience(e.target.value)}
                                    className="w-full px-4 py-2 border text-black dark:text-white dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    Language
                                </label>
                                <input
                                    type="text"
                                    value={language}
                                    onChange={(e) => setLanguage(e.target.value)}
                                    className="w-full px-4 py-2 border text-black dark:text-white dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    Availability
                                </label>
                                <input
                                    type="text"
                                    value={availability}
                                    onChange={(e) => setAvailability(e.target.value)}
                                    className="w-full px-4 py-2 border text-black dark:text-white dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>
                        </div>

                        <FileUpload />

                        <div className="mb-6">
                            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                Biography
                            </label>
                            <textarea
                                value={biography}
                                onChange={(e) => setBiography(e.target.value)}
                                className="w-full px-4 py-2 border text-black dark:text-white dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                rows="4"
                            ></textarea>
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2 border text-black dark:text-white dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                                placeholder="Enter password"
                            />
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleSignUp}
                            className="w-full flex items-center justify-center gap-2 mb-6 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        >
                            <FcGoogle className="w-5 h-5" />
                            <span>Sign up with Google</span>
                        </button>

                        <div className="flex justify-left gap-4">
                            <button
                                type="button"
                                className="px-12 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 dark:hover:bg-red-600 transition-colors duration-300"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-12 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 dark:hover:bg-cyan-700 transition-colors duration-300"
                            >
                                Save
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default DrSignUpPage;