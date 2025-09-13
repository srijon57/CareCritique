import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authcontext";
import api from "../../services/api";
import { useSnackbar } from "notistack";
import { useSpinner } from "../../components/SpinnerProvider";

// List of areas in Dhaka, Bangladesh
const areas = [
    "Abdullahpur", "Bochila", "Adabor", "Uttara", "Mirpur", "Pallabi", "Kazipara", "Kafrul",
    "Agargaon", "Sher-e-Bangla Nagar", "Cantonment area", "Banani", "Gulshan", "Niketan",
    "Shahjadpur", "Mohakhali", "Bashundhara", "Banasree", "Aftab Nagar", "Baridhara",
    "Uttarkhan", "Dakshinkhan", "Bawnia", "Khilkhet", "Tejgaon", "Farmgate", "Mohammadpur",
    "Rampura", "Badda", "Satarkul", "Beraid", "Khilgaon", "Vatara", "Gabtali", "Hazaribagh",
    "Dhanmondi", "Segunbagicha", "Ramna", "Motijheel", "Sabujbagh", "Lalbagh", "Kamalapur",
    "Kakrail", "Kamrangirchar", "Islampur", "Sadarghat", "Wari", "Kotwali", "Sutrapur",
    "Jurain", "Dania", "Demra", "Shyampur", "Nimtoli", "Matuail", "Paribagh", "Shahbagh",
    "Paltan", "Ashulia", "Birulia", "Savar", "Hasnabad", "Jinjira", "Tegharia", "Jhilmil",
    "Tongi", "Gazipur", "Fatullah", "Siddhirganj", "Narayanganj"
];

// Blood group options
const bloodGroups = ["", "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Gender options
const genderOptions = ["", "Male", "Female", "Other"];

// Days of the week
const daysOfWeek = [
    "", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

// Time slots
const timeSlots = [
    "", "12:00 AM", "1:00 AM", "2:00 AM", "3:00 AM", "4:00 AM", "5:00 AM", "6:00 AM",
    "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM",
    "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM",
    "9:00 PM", "10:00 PM", "11:00 PM"
];

const EditProfile = () => {
    const { accessToken } = useAuth();
    const [profile, setProfile] = useState({
        availabilityStartDay: "",
        availabilityEndDay: "",
        availabilityStartTime: "",
        availabilityEndTime: "",
        area: "",
        blood_group: "",
        gender: "",
        city: "",
    });
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();
    const { setLoading } = useSpinner();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                if (!accessToken) return;
                const response = await api.get("/profile", {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                const profileData = response.data.profile;
                setProfile({
                    ...profileData,
                    availabilityStartDay: profileData.availabilityStartDay || "",
                    availabilityEndDay: profileData.availabilityEndDay || "",
                    availabilityStartTime: profileData.availabilityStartTime || "",
                    availabilityEndTime: profileData.availabilityEndTime || "",
                    area: profileData.area || "",
                    blood_group: profileData.blood_group || "",
                    gender: profileData.gender || "",
                    city: profileData.city || "",
                });
            } catch (error) {
                if (error.response?.status === 401) {
                    enqueueSnackbar("Session expired. Please log in again.", { variant: "error" });
                    localStorage.removeItem("accessToken");
                    localStorage.removeItem("refreshToken");
                    navigate("/login");
                } else {
                    enqueueSnackbar("Failed to fetch profile", { variant: "error" });
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [accessToken, navigate, enqueueSnackbar, setLoading]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const days = profile.availabilityStartDay && profile.availabilityEndDay
                ? `${profile.availabilityStartDay.substring(0, 3)}-${profile.availabilityEndDay.substring(0, 3)}`
                : "";
            const time = profile.availabilityStartTime && profile.availabilityEndTime
                ? `${formatTime(profile.availabilityStartTime)}-${formatTime(profile.availabilityEndTime)}`
                : "";
            const availability = days && time ? `${days} ${time}` : "";
            await api.put(
                "/profile/update",
                { ...profile, availability },
                { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            enqueueSnackbar("Profile updated successfully", { variant: "success" });
        } catch (error) {
            enqueueSnackbar("Failed to update profile", { variant: "error" });
        } finally {
            setLoading(false);
            navigate("/profile");
        }
    };

    const formatTime = (time) => {
        if (!time) return "";
        const [timePart, period] = time.split(" ");
        const [hours, minutes] = timePart.split(":");
        return `${hours}${period}`;
    };

    if (!profile) {
        return (
            <div className="bg-white dark:bg-gray-900 min-h-screen font-sans p-6">
                Loading...
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen font-sans p-6">
            <h1 className="text-4xl font-bold text-cyan-800 mb-8 text-center dark:text-white">
                Edit Profile
            </h1>
            <form
                onSubmit={handleSubmit}
                className="container mx-auto bg-gray-200 dark:bg-gray-800 shadow-lg rounded-lg p-6"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                            Password
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={profile.password || ""}
                            onChange={handleInputChange}
                            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                            First Name
                        </label>
                        <input
                            type="text"
                            name="first_name"
                            value={profile.first_name || ""}
                            onChange={handleInputChange}
                            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                            Last Name
                        </label>
                        <input
                            type="text"
                            name="last_name"
                            value={profile.last_name || ""}
                            onChange={handleInputChange}
                            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                        />
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                            City
                        </label>
                        <select
                            name="city"
                            value={profile.city || ""}
                            onChange={handleInputChange}
                            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                        >
                            <option value="">Select City</option>
                            <option value="Dhaka">Dhaka</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                            Address
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={profile.address || ""}
                            onChange={handleInputChange}
                            className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                        />
                    </div>
                    {profile.user_type === "Patient" && (
                        <>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                    Blood Group
                                </label>
                                <select
                                    name="blood_group"
                                    value={profile.blood_group}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                >
                                    <option value="">Select Blood Group</option>
                                    {bloodGroups.map((group) => (
                                        <option key={group} value={group}>
                                            {group}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    value={profile.gender || ""}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                >
                                    <option value="">Select Gender</option>
                                    {genderOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    name="contact_number"
                                    value={profile.contact_number || ""}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                    Area
                                </label>
                                <select
                                    name="area"
                                    value={profile.area || ""}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                >
                                    <option value="">Select Area</option>
                                    {areas.map((area) => (
                                        <option key={area} value={area}>
                                            {area}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}
                    {profile.user_type === "Doctor" && (
                        <>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                    Gender
                                </label>
                                <select
                                    name="gender"
                                    value={profile.gender || ""}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                >
                                    <option value="">Select Gender</option>
                                    {genderOptions.map((option) => (
                                        <option key={option} value={option}>
                                            {option}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                    Contact Number
                                </label>
                                <input
                                    type="text"
                                    name="contact_number"
                                    value={profile.contact_number || ""}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                    Specialty
                                </label>
                                <input
                                    type="text"
                                    name="specialty"
                                    value={profile.specialty || ""}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                    Education
                                </label>
                                <input
                                    type="text"
                                    name="education"
                                    value={profile.education || ""}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                    Hospital
                                </label>
                                <input
                                    type="text"
                                    name="hospital"
                                    value={profile.hospital || ""}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                    Experience
                                </label>
                                <input
                                    type="text"
                                    name="experience"
                                    value={profile.experience || ""}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                    Languages
                                </label>
                                <input
                                    type="text"
                                    name="languages"
                                    value={profile.languages || ""}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                    Availability Start Day
                                </label>
                                <select
                                    name="availabilityStartDay"
                                    value={profile.availabilityStartDay}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                >
                                    <option value="">Select Start Day</option>
                                    {daysOfWeek.map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                    Availability End Day
                                </label>
                                <select
                                    name="availabilityEndDay"
                                    value={profile.availabilityEndDay}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                >
                                    <option value="">Select End Day</option>
                                    {daysOfWeek.map((day) => (
                                        <option key={day} value={day}>
                                            {day}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                    Availability Start Time
                                </label>
                                <select
                                    name="availabilityStartTime"
                                    value={profile.availabilityStartTime}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                >
                                    <option value="">Select Start Time</option>
                                    {timeSlots.map((time) => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                    Availability End Time
                                </label>
                                <select
                                    name="availabilityEndTime"
                                    value={profile.availabilityEndTime}
                                    onChange={handleInputChange}
                                    className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg text-gray-700 dark:text-gray-300 w-full"
                                >
                                    <option value="">Select End Time</option>
                                    {timeSlots.map((time) => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-gray-700 dark:text-gray-300 font-semibold mb-2">
                                    Biography
                                </label>
                                <input
                                    type="text"
                                    name="biography"
                                    value={profile.biography || ""}
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
