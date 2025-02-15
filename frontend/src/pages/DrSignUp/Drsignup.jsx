import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import api from '../../services/api';

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
    const [formData, setFormData] = useState({
        userType: "Doctor",
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        bloodGroup: "",
        gender: "Male",
        contactNumber: "",
        city: "",
        state: "",
        hospital: "",
        specialty: "",
        education: "",
        experience: "",
        languages: "Bengali",
        availabilityStart: "1 AM",
        availabilityEnd: "1 PM",
        biography: "",
        password: "",
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        // Combine the availability times into a single string
        const availability = `${formData.availabilityStart.replace(' AM', 'am')} - ${formData.availabilityEnd.replace(' PM', 'pm')}`;

        // Map the formData to the desired format
        const registrationData = {
            user_type: formData.userType,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            address: formData.address,
            blood_group: formData.bloodGroup,
            gender: formData.gender,
            contact_number: formData.contactNumber,
            city: formData.city,
            state: formData.state,
            hospital: formData.hospital,
            specialty: formData.specialty,
            education: formData.education,
            experience: formData.experience,
            languages: formData.languages,
            availability: availability,
            biography: formData.biography,
            password: formData.password,
        };

        console.log("Sign Up Data:", registrationData); // Log the data being sent

        try {
            const response = await api.post('/register', registrationData);
            console.log("Registration successful:", response.data);
            // Redirect or show success message
        } catch (error) {
            console.error("Registration failed:", error);
        }
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
                                    id="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
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
                                    id="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
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
                                    id="email"
                                    value={formData.email}
                                    onChange={handleChange}
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
                                    id="address"
                                    value={formData.address}
                                    onChange={handleChange}
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
                                <select
                                    id="bloodGroup"
                                    value={formData.bloodGroup}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 text-black dark:text-white border dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                >
                                    <option value="">Select blood group</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    Gender
                                </label>
                                <select
                                    id="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 text-black dark:text-white border dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                id="contactNumber"
                                value={formData.contactNumber}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border text-black dark:text-white dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    City
                                </label>
                                <input
                                    type="text"
                                    id="city"
                                    value={formData.city}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border text-black dark:text-white dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    State
                                </label>
                                <input
                                    type="text"
                                    id="state"
                                    value={formData.state}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border text-black dark:text-white dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    Hospital
                                </label>
                                <input
                                    type="text"
                                    id="hospital"
                                    value={formData.hospital}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border text-black dark:text-white dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    Specialty
                                </label>
                                <select
                                    id="specialty"
                                    value={formData.specialty}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 text-black dark:text-white border dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                >
                                    <option value="">Select specialty</option>
                                    <option value="Anesthesiology">Anesthesiology</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Dermatology">Dermatology</option>
                                    <option value="Emergency Medicine">Emergency Medicine</option>
                                    <option value="Endocrinology">Endocrinology</option>
                                    <option value="Family Medicine">Family Medicine</option>
                                    <option value="Gastroenterology">Gastroenterology</option>
                                    <option value="General Surgery">General Surgery</option>
                                    <option value="Geriatrics">Geriatrics</option>
                                    <option value="Hematology">Hematology</option>
                                    <option value="Infectious Disease">Infectious Disease</option>
                                    <option value="Internal Medicine">Internal Medicine</option>
                                    <option value="Nephrology">Nephrology</option>
                                    <option value="Neurology">Neurology</option>
                                    <option value="Obstetrics and Gynecology">Obstetrics and Gynecology</option>
                                    <option value="Oncology">Oncology</option>
                                    <option value="Ophthalmology">Ophthalmology</option>
                                    <option value="Orthopedic Surgery">Orthopedic Surgery</option>
                                    <option value="Otolaryngology (ENT)">Otolaryngology (ENT)</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Plastic Surgery">Plastic Surgery</option>
                                    <option value="Podiatry">Podiatry</option>
                                    <option value="Psychiatry">Psychiatry</option>
                                    <option value="Pulmonology">Pulmonology</option>
                                    <option value="Radiology">Radiology</option>
                                    <option value="Rheumatology">Rheumatology</option>
                                    <option value="Sports Medicine">Sports Medicine</option>
                                    <option value="Surgical Oncology">Surgical Oncology</option>
                                    <option value="Urology">Urology</option>
                                    <option value="Vascular Surgery">Vascular Surgery</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    Education
                                </label>
                                <input
                                    type="text"
                                    id="education"
                                    value={formData.education}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border text-black dark:text-white dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    Experience
                                </label>
                                <input
                                    type="number"
                                    id="experience"
                                    value={formData.experience}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border text-black dark:text-white dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                    languages
                                </label>
                                <select
                                    id="languages"
                                    value={formData.languages}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 text-black dark:text-white border dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                    required
                                >
                                    <option value="Bengali">Bengali</option>
                                    <option value="English">English</option>
                                    <option value="Chinese">Chinese</option>
                                    <option value="Japanese">Japanese</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="French">French</option>
                                    <option value="Arabic">Arabic</option>
                                    <option value="Portuguese">Portuguese</option>
                                    <option value="Russian">Russian</option>
                                    <option value="Urdu">Urdu</option>
                                    <option value="German">German</option>
                                </select>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="mr-2">
                                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                        Availability From
                                    </label>
                                    <select
                                        id="availabilityStart"
                                        value={formData.availabilityStart}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 text-black dark:text-white border dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        required
                                    >
                                        {[...Array(12).keys()].map((num) => (
                                            <option key={num + 1} value={`${num + 1} AM`}>
                                                {num + 1} AM
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mx-2 text-gray-700 dark:text-gray-200 font-medium">
                                    to
                                </div>
                                <div className="ml-2">
                                    <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                        Availability To
                                    </label>
                                    <select
                                        id="availabilityEnd"
                                        value={formData.availabilityEnd}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 text-black dark:text-white border dark:border-gray-600 dark:bg-gray-700 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                        required
                                    >
                                        {[...Array(12).keys()].map((num) => (
                                            <option key={num + 1} value={`${num + 1} PM`}>
                                                {num + 1} PM
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <FileUpload />

                        <div className="mb-6">
                            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                Biography
                            </label>
                            <textarea
                                id="biography"
                                value={formData.biography}
                                onChange={handleChange}
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
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
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
