import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { useSnackbar } from 'notistack';
import { useSpinner } from '../../components/SpinnerProvider';

const Profile = () => {
    const { accessToken } = useAuth();
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { setLoading } = useSpinner();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                if (!accessToken) {
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
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [accessToken, navigate, enqueueSnackbar, setLoading]);

    if (!profile) {
        return <div className="bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center">Loading...</div>;
    }

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
            <h1 className="text-4xl font-bold text-cyan-800 mb-8 text-center dark:text-white">Profile</h1>
            <div className="max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(profile).map(([key, value]) => key !== "hospital" &&
                        key !== "specialty" && key !== "education" && key !== "experience" &&
                        key !== "languages" && key !== "availability" && key !== "biography" &&
                        key !== "profile_picture" ? (
                            <div key={key} className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow">
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2 capital">{key.replace(/_/g, ' ').toUpperCase()}</label>
                                <p className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg text-gray-700 dark:text-gray-300">{value || 'N/A'}</p>
                            </div>
                        ) : null
                    )}
                </div>
            
                {profile.user_type === 'Doctor' && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-cyan-800 mb-6 dark:text-white">Doctor Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow">
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Hospital</label>
                                <p className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg text-gray-700 dark:text-gray-300">{profile.hospital}</p>
                            </div>
                            <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow">
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Specialty</label>
                                <p className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg text-gray-700 dark:text-gray-300">{profile.specialty}</p>
                            </div>
                            <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow">
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Education</label>
                                <p className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg text-gray-700 dark:text-gray-300">{profile.education}</p>
                            </div>
                            <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow">
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Experience</label>
                                <p className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg text-gray-700 dark:text-gray-300">{profile.experience}</p>
                            </div>
                            <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow">
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Languages</label>
                                <p className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg text-gray-700 dark:text-gray-300">{profile.languages}</p>
                            </div>
                            <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow">
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Availability</label>
                                <p className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg text-gray-700 dark:text-gray-300">{profile.availability}</p>
                            </div>
                            <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow">
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Biography</label>
                                <p className="bg-gray-100 dark:bg-gray-600 p-3 rounded-lg text-gray-700 dark:text-gray-300">{profile.biography}</p>
                            </div>
                            {profile.profile_picture && (
                                <div className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg shadow">
                                    <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Profile Picture</label>
                                    <img src={profile.profile_picture} alt="Profile" className="w-full h-auto rounded-lg" />
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <button
                    onClick={() => navigate('/editprofile')}
                    className="mt-6 w-full sm:w-auto bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-200"
                >
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default Profile;