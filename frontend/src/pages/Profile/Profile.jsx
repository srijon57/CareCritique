import  { useState, useEffect } from 'react';
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
                 //   enqueueSnackbar('No access token found. Please log in again.', { variant: 'error' });
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
        return <div className="bg-white dark:bg-gray-900 min-h-screen font-sans p-6">Loading...</div>;
    }

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen font-sans p-6">
            <h1 className="text-4xl font-bold text-cyan-800 mb-8 text-center dark:text-white">Profile</h1>
            <div className="container mx-auto bg-gray-200 dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Email</label>
                        <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300">
                            {profile.email}
                        </p>
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">User Type</label>
                        <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300">
                            {profile.user_type}
                        </p>
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">First Name</label>
                        <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300">
                            {profile.first_name}
                        </p>
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Last Name</label>
                        <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300">
                            {profile.last_name}
                        </p>
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Address</label>
                        <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300">
                            {profile.address}
                        </p>
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Blood Group</label>
                        <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300">
                            {profile.blood_group}
                        </p>
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Gender</label>
                        <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300">
                            {profile.gender}
                        </p>
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Contact Number</label>
                        <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300">
                            {profile.contact_number}
                        </p>
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">City</label>
                        <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300">
                            {profile.city}
                        </p>
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">State</label>
                        <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300">
                            {profile.state}
                        </p>
                    </div>
                </div>

                {profile.user_type === 'Doctor' && (
                    <div className="mt-8">
                        <h2 className="text-2xl font-bold text-cyan-800 mb-6 dark:text-white">Doctor Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Hospital</label>
                                <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300">
                                    {profile.hospital}
                                </p>
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Specialty</label>
                                <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300">
                                    {profile.specialty}
                                </p>
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Education</label>
                                <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300">
                                    {profile.education}
                                </p>
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Experience</label>
                                <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300">
                                    {profile.experience}
                                </p>
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Languages</label>
                                <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300">
                                    {profile.languages}
                                </p>
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Availability</label>
                                <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300">
                                    {profile.availability}
                                </p>
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Biography</label>
                                <p className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300">
                                    {profile.biography}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    onClick={() => navigate('/editprofile')}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Edit Profile
                </button>
            </div>
        </div>
    );
};

export default Profile;
