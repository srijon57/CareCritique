import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoMdStar, IoMdStarHalf, IoMdStarOutline } from "react-icons/io";
const DoctorsList = () => {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [specialtyFilter, setSpecialtyFilter] = useState("");
    const [specialties, setSpecialties] = useState([]);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const initialSearchQuery = queryParams.get("search") || "";
        const initialSpecialtyFilter = queryParams.get("specialty") || "";
        setSearchQuery(initialSearchQuery);
        setSpecialtyFilter(initialSpecialtyFilter);

        fetchDoctorsAndReviews();
    }, [location.search]);

    const fetchDoctorsAndReviews = async () => {
        setLoading(true);
        try {
            // Fetch the list of doctors
            const doctorsResponse = await axios.get(
                "http://127.0.0.1:8000/api/doctors"
            );
            if (Array.isArray(doctorsResponse.data)) {
                const doctorList = doctorsResponse.data.map((doctor) => ({
                    id: doctor.DoctorID,
                    firstName: doctor.FirstName,
                    lastName: doctor.LastName,
                    gender: doctor.Gender,
                    specialty: doctor.Specialty,
                    hospital: doctor.Hospital,
                    languages: doctor.Languages,
                    experience: doctor.Experience,
                    availability: doctor.Availability,
                    rating: 0,
                    totalReviews: 0,
                    profilePicture: doctor.ProfilePicture || null,
                }));

                // Extract unique specialties for filter dropdown
                const uniqueSpecialties = [
                    ...new Set(
                        doctorList
                            .map((doctor) => doctor.specialty)
                            .filter(Boolean)
                    ),
                ];
                setSpecialties(uniqueSpecialties);

                // Fetch reviews for each doctor and update ratings
                const updatedDoctors = await Promise.all(
                    doctorList.map(async (doctor) => {
                        try {
                            const reviewsResponse = await axios.get(
                                `http://127.0.0.1:8000/api/doctors/${doctor.id}/reviews`
                            );
                            const reviews = reviewsResponse.data.reviews || [];
                            const totalRating = reviews.reduce(
                                (sum, review) => sum + review.rating,
                                0
                            );
                            const averageRating = reviews.length
                                ? totalRating / reviews.length
                                : 0;
                            return {
                                ...doctor,
                                rating: averageRating,
                                totalReviews: reviews.length,
                            };
                        } catch (err) {
                            console.error(
                                `Error fetching reviews for doctor ${doctor.id}:`,
                                err
                            );
                            return {
                                ...doctor,
                                rating: 0,
                                totalReviews: 0,
                            };
                        }
                    })
                );

                setDoctors(updatedDoctors);
                setError(null);
            } else {
                console.error(
                    "API response is not an array:",
                    doctorsResponse.data
                );
                setError("Failed to fetch doctors. Please try again later.");
            }
        } catch (error) {
            console.error(
                "Error fetching doctors:",
                error.response ? error.response.data : error.message
            );
            setError("Failed to fetch doctors. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleSpecialtyChange = (e) => {
        setSpecialtyFilter(e.target.value);
    };

    const handleApplyFilters = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.set("search", searchQuery);
        if (specialtyFilter) params.set("specialty", specialtyFilter);
        navigate(`/doctors?${params.toString()}`);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleApplyFilters();
        }
    };

    const clearFilters = () => {
        setSearchQuery("");
        setSpecialtyFilter("");
        navigate("/doctors");
    };

    const filteredDoctors = doctors.filter((doctor) => {
        const firstName = doctor.firstName || "";
        const lastName = doctor.lastName || "";
        const specialty = doctor.specialty || "";
        const fullName = `${firstName} ${lastName}`;

        const matchesSearch =
            fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            specialty.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesSpecialty = specialtyFilter
            ? specialty.toLowerCase() === specialtyFilter.toLowerCase()
            : true;

        return matchesSearch && matchesSpecialty;
    });

    // Function to render rating stars
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;

        // Full stars
        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <span key={`full-${i}`} className="text-yellow-500">
                    <IoMdStar />
                </span>
            );
        }

        // Half star
        if (hasHalfStar) {
            stars.push(
                <span key="half" className="text-yellow-500">
                    <IoMdStarHalf />
                </span>
            );
        }

        // Empty stars
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <span
                    key={`empty-${i}`}
                    className="text-gray-300 dark:text-gray-600"
                >
                    <IoMdStarOutline />
                </span>
            );
        }

        return stars;
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Hero section with search */}
            <div className="bg-gradient-to-r from-cyan-700 to-blue-900 dark:from-gray-800 dark:to-gray-900">
                <div className="container mx-auto px-4 py-12">
                    <h1 className="text-4xl font-bold text-white text-center mb-4">
                        Find Your Doctor
                    </h1>
                    <p className="text-cyan-100 dark:text-gray-300 text-center mb-8 max-w-2xl mx-auto">
                        Browse our network of qualified medical professionals to
                        find the right doctor for your needs.
                    </p>

                    {/* Search and filter container */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-4xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Search input */}
                            <div className="col-span-1 md:col-span-2">
                                <label
                                    htmlFor="search"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Search by name or keyword
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            viewBox="0 0 20 20"
                                            fill="currentColor"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                                clipRule="evenodd"
                                            />
                                        </svg>
                                    </span>
                                    <input
                                        id="search"
                                        type="text"
                                        placeholder="Search by doctor name or specialty"
                                        className="pl-10 w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:text-white"
                                        value={searchQuery}
                                        onChange={handleSearchChange}
                                        onKeyPress={handleKeyPress}
                                    />
                                </div>
                            </div>

                            {/* Specialty filter */}
                            <div>
                                <label
                                    htmlFor="specialty"
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                                >
                                    Specialty
                                </label>
                                <select
                                    id="specialty"
                                    className="w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:text-white"
                                    value={specialtyFilter}
                                    onChange={handleSpecialtyChange}
                                >
                                    <option value="">All Specialties</option>
                                    {specialties.map((specialty) => (
                                        <option
                                            key={specialty}
                                            value={specialty}
                                        >
                                            {specialty}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex justify-end mt-4 space-x-3">
                            <button
                                onClick={clearFilters}
                                className="py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                            >
                                Clear Filters
                            </button>
                            <button
                                onClick={handleApplyFilters}
                                className="py-2 px-4 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content area */}
            <div className="container mx-auto px-4 py-8">
                {/* Results header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {loading
                            ? "Loading doctors..."
                            : filteredDoctors.length === 0
                            ? "No doctors found"
                            : `Found ${filteredDoctors.length} doctor${
                                filteredDoctors.length === 1 ? "" : "s"
                            }`}
                    </h2>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
                    </div>
                )}

                {/* Error state */}
                {error && (
                    <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <svg
                                    className="h-5 w-5 text-red-500"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm text-red-700 dark:text-red-300">
                                    {error}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && filteredDoctors.length === 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                        <div className="text-gray-400 text-5xl mb-4">👨‍⚕️</div>
                        <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">
                            No doctors found
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                            Try adjusting your search criteria or clear filters
                            to see more results.
                        </p>
                        <button
                            onClick={clearFilters}
                            className="text-cyan-600 hover:text-cyan-700 font-medium dark:text-cyan-400 dark:hover:text-cyan-300"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}

                {/* Doctors list */}
                <div className="space-y-6">
                    {filteredDoctors.map((doctor) => (
                        <div
                            key={doctor.id}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg"
                        >
                            <div className="flex flex-col md:flex-row">
                                {/* Doctor image and quick info */}
                                <div className="md:w-64 bg-cyan-50 dark:bg-gray-700 p-6 flex flex-col items-center justify-center">
                                    <img
                                        src={
                                            doctor.profilePicture ||
                                            "https://i.pinimg.com/originals/53/e1/f9/53e1f9601fd784835e67a54f858d0c5e.png"
                                        }
                                        alt={`${doctor.firstName} ${doctor.lastName}`}
                                        className="rounded-full w-28 h-28 object-cover border-4 border-white dark:border-gray-600 shadow-md"
                                    />
                                    <h3 className="font-bold text-lg mt-4 text-center text-gray-900 dark:text-white">
                                        Dr. {doctor.firstName} {doctor.lastName}
                                    </h3>
                                    <p className="text-cyan-600 dark:text-cyan-400 font-medium text-center">
                                        {doctor.specialty || "Specialist"}
                                    </p>
                                    <div className="flex items-center mt-2 text-lg">
                                        {renderStars(doctor.rating)}
                                    </div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {doctor.totalReviews} review
                                        {doctor.totalReviews !== 1 ? "s" : ""}
                                    </p>
                                </div>

                                {/* Doctor details */}
                                <div className="flex-1 p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Hospital
                                            </h4>
                                            <p className="text-gray-900 dark:text-white">
                                                {doctor.hospital || "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Languages
                                            </h4>
                                            <p className="text-gray-900 dark:text-white">
                                                {doctor.languages || "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Gender
                                            </h4>
                                            <p className="text-gray-900 dark:text-white">
                                                {doctor.gender || "N/A"}
                                            </p>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                                Experience
                                            </h4>
                                            <p className="text-gray-900 dark:text-white">
                                                {doctor.experience || "N/A"}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                            Availability
                                        </h4>
                                        <p className="text-gray-900 dark:text-white">
                                            {doctor.availability || "N/A"}
                                        </p>
                                    </div>

                                    <div className="mt-6 flex justify-end">
                                        <Link
                                            to={`/doctors/${doctor.id}`}
                                            className="inline-flex items-center bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                        >
                                            View Profile
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-5 w-5 ml-1"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DoctorsList;
