import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Authcontext';
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
                    headers: { Authorization: `Bearer ${accessToken}` },
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
        return <div className="min-h-screen flex items-center justify-center text-xl text-gray-600 dark:text-gray-300">Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-6 lg:px-24 flex flex-col items-center">
            <div className="max-w-4xl w-full bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white text-center mb-8">Profile</h1>
                <div className="flex flex-col items-center">
                    {profile.profile_picture && (
                        <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-cyan-600 shadow-md">
                            <img src={profile.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                        </div>
                    )}
                    <p className="text-gray-600 dark:text-gray-400">{profile.email || 'N/A'}</p>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(profile).map(([key, value]) => {
                        if (['user_id', 'profile_picture', 'hospital', 'specialty', 'education', 'experience', 'languages', 'availability', 'biography'].includes(key)) {
                            return null;
                        }
                        return (
                            <div key={key} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">{key.replace(/_/g, ' ')}</label>
                                <p className="text-gray-800 dark:text-gray-200 mt-1">{value || 'N/A'}</p>
                            </div>
                        );
                    })}
                </div>

                {profile.user_type === 'Doctor' && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-semibold text-cyan-800 dark:text-cyan-400 text-center mb-6">Doctor Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {['hospital', 'specialty', 'education', 'experience', 'languages', 'availability', 'biography'].map((field) =>
                                profile[field] ? (
                                    <div key={field} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md">
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 capitalize">{field.replace(/_/g, ' ')}</label>
                                        <p className="text-gray-800 dark:text-gray-200 mt-1">{profile[field]}</p>
                                    </div>
                                ) : null
                            )}
                        </div>
                    </div>
                )}

                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate('/editprofile')}
                        className="w-full sm:w-auto bg-cyan-600 text-white py-2 px-6 rounded-lg shadow-md hover:bg-cyan-700 transition-all duration-200"
                    >
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;