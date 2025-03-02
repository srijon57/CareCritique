import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

const DoctorsList = () => {
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const initialSearchQuery = queryParams.get('search') || "";
        setSearchQuery(initialSearchQuery);


        
          
             
                 

        const fetchDoctorsAndReviews = async () => {
            try {
                // Fetch the list of doctors
                const doctorsResponse = await axios.get('http://127.0.0.1:8000/api/doctors');
                if (Array.isArray(doctorsResponse.data)) {
                    const doctorList = doctorsResponse.data.map(doctor => ({

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
                        profilePicture: doctor.ProfilePicture || null
                    }));

                    // Fetch reviews for each doctor and update ratings
                    const updatedDoctors = await Promise.all(
                        doctorList.map(async (doctor) => {
                            try {
                                const reviewsResponse = await axios.get(`http://127.0.0.1:8000/api/doctors/${doctor.id}/reviews`);
                                const reviews = reviewsResponse.data.reviews || [];
                                const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
                                const averageRating = reviews.length ? totalRating / reviews.length : 0;
                                return {
                                    ...doctor,
                                    rating: averageRating,
                                    totalReviews: reviews.length
                                };
                            } catch (err) {
                                console.error(`Error fetching reviews for doctor ${doctor.id}:`, err);
                                return {
                                    ...doctor,
                                    rating: 0,
                                    totalReviews: 0
                                };
                            }
                        })
                    );

                    setDoctors(updatedDoctors);
                } else {
                    console.error('API response is not an array:', doctorsResponse.data);
                    setError('Failed to fetch doctors. Please try again later.');
                }
            } catch (error) {
                console.error('Error fetching doctors:', error.response ? error.response.data : error.message);
                setError('Failed to fetch doctors. Please try again later.');



            }
        };

        fetchDoctorsAndReviews();

    }, [location.search]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredDoctors = doctors.filter(doctor => {
        const firstName = doctor.firstName || '';
        const lastName = doctor.lastName || '';
        const specialty = doctor.specialty || '';

        return (
            firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            specialty.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
        <div className="min-h-screen bg-gray-200 dark:bg-gray-900 text-black dark:text-white">
            <div className="container mx-auto p-6">
                <h2 className="text-4xl font-bold mb-8 text-cyan-800 text-center dark:text-white">All Doctors</h2>
                <div className="flex justify-center items-center my-8">
                    <input
                        type="text"
                        placeholder="Search by name or specialty"
                        className="w-full max-w-2xl p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                {error && <p className="text-red-500 text-center">{error}</p>}
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
                    {filteredDoctors.length > 0 ? (
                        filteredDoctors.map(doctor => (
                            <div
                                key={doctor.id}
                                className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center md:items-start hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-white dark:hover:shadow-2xl"
                            >
                                <div className="flex-shrink-0 md:mr-6 mb-4 md:mb-0">
                                    <img
                                        src={doctor.profilePicture || "https://i.pinimg.com/originals/53/e1/f9/53e1f9601fd784835e67a54f858d0c5e.png"}
                                        alt={`${doctor.firstName} ${doctor.lastName}`}
                                        className="rounded-full w-32 h-32 object-cover"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-center mb-2">
                                        <h4 className="text-xl font-bold text-cyan-800 dark:text-white">
                                            {doctor.firstName} {doctor.lastName}
                                        </h4>
                                    </div>
                                    <p className="text-gray-500 dark:text-gray-400">{doctor.specialty || 'N/A'}</p>
                                    <p className="text-gray-500 dark:text-gray-400">{doctor.hospital || 'N/A'}</p>
                                    <p className="text-gray-700 dark:text-gray-300"><strong>Languages:</strong> {doctor.languages || 'N/A'}</p>
                                    <p className="text-gray-700 dark:text-gray-300"><strong>Gender:</strong> {doctor.gender || 'N/A'}</p>
                                    <p className="text-gray-700 dark:text-gray-300"><strong>Experience:</strong> {doctor.experience || 'N/A'}</p>
                                    <p className="text-gray-700 dark:text-gray-300"><strong>Availability:</strong> {doctor.availability || 'N/A'}</p>
                                    <p className="text-yellow-500">
                                        ★ {doctor.rating.toFixed(1)} ({doctor.totalReviews} reviews)
                                    </p>
                                </div>
                                <div className="mt-4 md:mt-0 md:ml-auto">
                                    <Link
                                        to={`/doctors/${doctor.id}`}
                                        className="inline-block bg-cyan-800 text-white py-2 px-4 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600"
                                    >
                                        See more
                                    </Link>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400">No doctors found.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DoctorsList;