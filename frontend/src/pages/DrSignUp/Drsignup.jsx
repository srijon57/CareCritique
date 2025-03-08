import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useSnackbar } from 'notistack';
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

    const [fileNames, setFileNames] = useState(['', '', '']); // Only for certificates
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({
            ...formData,
            [id]: value,
        });
    };

    const handleFileChange = (index, event) => {
        const file = event.target.files[0];
        if (index === 0) {
            setFormData({
                ...formData,
                profilePicture: file,
            });
        } else {
            const newFileNames = [...fileNames];
            newFileNames[index - 1] = file ? file.name : '';
            setFileNames(newFileNames);

            setFormData({
                ...formData,
                [`certificate${index}`]: file,
            });
        }
    };

    const handleSignUp = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        formDataToSend.append('user_type', 'Doctor');
        formDataToSend.append('first_name', formData.firstName);
        formDataToSend.append('last_name', formData.lastName);

        // Append actual file objects, not file names
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

        // Debugging: Log FormData values
        for (let pair of formDataToSend.entries()) {
            console.log(pair[0], pair[1]); // Should display actual File objects
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
        }
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
                        </div>

                        <div className="mb-6">
                            <label className="block text-gray-700 dark:text-gray-200 font-medium mb-2">
                                Upload Profile Picture
                            </label>
                            <label className="flex-1 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center cursor-pointer hover:border-cyan-500 dark:hover:border-cyan-600 transition-colors duration-300">
                                <input
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => handleFileChange(0, e)}
                                    accept=".png, .jpg, .jpeg"
                                />
                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                    {formData.profilePicture ? formData.profilePicture.name : 'Click to upload'}
                                </span>
                            </label>
                        </div>

                        <FileUpload fileNames={fileNames} setFileNames={setFileNames} handleFileChange={handleFileChange} />

                        <div className="flex justify-left gap-4">
                            <button
                                type="button"
                                onClick={() => navigate('/')}
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
