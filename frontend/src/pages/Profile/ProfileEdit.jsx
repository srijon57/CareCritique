import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/Authcontext';
import api from '../../services/api';
import { useSnackbar } from 'notistack';
import { useSpinner } from '../../components/SpinnerProvider';

const EditProfile = () => {
    const { accessToken } = useAuth();
    const [profile, setProfile] = useState({
        availabilityDays: '',
        availabilityTime: '',
    });
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
                const profileData = response.data.profile;
                if (profileData.availability) {
                    const [days, time] = profileData.availability.split(' ');
                    setProfile({
                        ...profileData,
                        availabilityDays: days || '',
                        availabilityTime: time || '',
                    });
                } else {
                    setProfile(profileData);
                }
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({
            ...prevProfile,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        const availability = profile.availabilityDays && profile.availabilityTime 
            ? `${profile.availabilityDays} ${profile.availabilityTime}`
            : profile.availability || '';

        try {
            // eslint-disable-next-line no-unused-vars
            const response = await api.put(
                '/profile/update',
                {
                    ...profile,
                    availability: availability,
                },
                {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            enqueueSnackbar('Profile updated successfully', { variant: 'success' });
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            enqueueSnackbar('Failed to update profile', { variant: 'error' });
        } finally {
            setLoading(false);
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
                    
                    {profile.user_type === 'Patient' && (
                        <>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Blood Group</label>
                                <input
                                    type="text"
                                    name="blood_group"
                                    value={profile.blood_group || ''}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Gender</label>
                                <input
                                    type="text"
                                    name="gender"
                                    value={profile.gender || ''}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Contact Number</label>
                                <input
                                    type="text"
                                    name="contact_number"
                                    value={profile.contact_number || ''}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Area</label>
                                <input
                                    type="text"
                                    name="area"
                                    value={profile.area || ''}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                />
                            </div>
                        </>
                    )}

                    {profile.user_type === 'Doctor' && (
                        <>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Gender</label>
                                <input
                                    type="text"
                                    name="gender"
                                    value={profile.gender || ''}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Contact Number</label>
                                <input
                                    type="text"
                                    name="contact_number"
                                    value={profile.contact_number || ''}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Specialty</label>
                                <input
                                    type="text"
                                    name="specialty"
                                    value={profile.specialty || ''}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Education</label>
                                <input
                                    type="text"
                                    name="education"
                                    value={profile.education || ''}
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
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Languages</label>
                                <input
                                    type="text"
                                    name="languages"
                                    value={profile.languages || ''}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Availability Days</label>
                                <select
                                    name="availabilityDays"
                                    value={profile.availabilityDays || ''}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                >
                                    <option value="">Select Days</option>
                                    <option value="Mon-Fri">Monday - Friday</option>
                                    <option value="Mon-Sat">Monday - Saturday</option>
                                    <option value="Mon-Sun">Monday - Sunday</option>
                                    <option value="Sat-Sun">Saturday - Sunday</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">Availability Time</label>
                                <select
                                    name="availabilityTime"
                                    value={profile.availabilityTime || ''}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                >
                                    <option value="">Select Time</option>
                                    <option value="9AM-5PM">9:00 AM - 5:00 PM</option>
                                    <option value="8AM-4PM">8:00 AM - 4:00 PM</option>
                                    <option value="10AM-6PM">10:00 AM - 6:00 PM</option>
                                    <option value="12PM-8PM">12:00 PM - 8:00 PM</option>
                                </select>
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