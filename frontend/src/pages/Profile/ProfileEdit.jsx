import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { useSnackbar } from 'notistack';

const EditProfile = () => {
    const { accessToken } = useAuth();
    const [profile, setProfile] = useState({});
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!accessToken) {
                   // enqueueSnackbar('No access token found. Please log in again.', { variant: 'error' });
                    return;
                }

                const response = await api.get('/profile', {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setProfile(response.data.profile);
            } catch (error) {
                if (error.response?.status === 401) {
                    enqueueSnackbar('Session expired. Please log in again.', { variant: 'error' });
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    navigate('/login');
                } else {
                    enqueueSnackbar('Failed to fetch profile', { variant: 'error' });
                }
            }
        };

        fetchProfile();
    }, [accessToken, navigate, enqueueSnackbar]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(
                '/profile/update',
                {
                    ...profile,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            enqueueSnackbar('Profile updated successfully', { variant: 'success' });
        } catch (error) {
            enqueueSnackbar('Failed to update profile', { variant: 'error' });
        }
        navigate('/profile');
    };

    if (!profile) {
        return <div className="bg-white dark:bg-gray-900 min-h-screen font-sans p-6">Loading...</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen font-sans p-6">
            <h1 className="text-4xl font-bold text-cyan-800 mb-8 text-center dark:text-white">Edit Profile</h1>
            <form onSubmit={handleSubmit} className="container mx-auto bg-gray-200 dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={profile.password || ''}
                            onChange={handleInputChange}
                            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">First Name</label>
                        <input
                            type="text"
                            name="first_name"
                            value={profile.first_name || ''}
                            onChange={handleInputChange}
                            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Last Name</label>
                        <input
                            type="text"
                            name="last_name"
                            value={profile.last_name || ''}
                            onChange={handleInputChange}
                            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={profile.address || ''}
                            onChange={handleInputChange}
                            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">City</label>
                        <input
                            type="text"
                            name="city"
                            value={profile.city || ''}
                            onChange={handleInputChange}
                            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">State</label>
                        <input
                            type="text"
                            name="state"
                            value={profile.state || ''}
                            onChange={handleInputChange}
                            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                        />
                    </div>

                    {profile.user_type === 'Doctor' && (
                        <>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Experience</label>
                                <input
                                    type="text"
                                    name="experience"
                                    value={profile.experience || ''}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Availability</label>
                                <input
                                    type="text"
                                    name="availability"
                                    value={profile.availability || ''}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Biography</label>
                                <input
                                    type="text"
                                    name="biography"
                                    value={profile.biography || ''}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Hospital</label>
                                <input
                                    type="text"
                                    name="hospital"
                                    value={profile.hospital || ''}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                />
                            </div>
                        </>
                    )}
                </div>

                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Save Changes
                </button>
            </form>
        </div>
    );
};

export default EditProfile;
