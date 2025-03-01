import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CardiologistsList = () => {
    const [cardiologists, setCardiologists] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/doctors')
            .then(response => {
                if (Array.isArray(response.data)) {
                    const filteredDoctors = response.data
                        .filter(doctor => doctor.Specialty.toLowerCase() === "cardiologist")
                        .map(doctor => ({
                            id: doctor.DoctorID,
                            firstName: doctor.FirstName,
                            lastName: doctor.LastName,
                            gender: doctor.Gender,
                            specialty: doctor.Specialty,
                            hospital: doctor.Hospital,
                            languages: doctor.Languages,
                            experience: doctor.Experience,
                            availability: doctor.Availability,
                            rating: 5.0, // Mock data
                            reviews: 866 // Mock data
                        }));
                    setCardiologists(filteredDoctors);
                } else {
                    console.error('API response is not an array:', response.data);
                    setError('Failed to fetch cardiologists. Please try again later.');
                }
            })
            .catch(error => {
                console.error('Error fetching doctors:', error.response ? error.response.data : error.message);
                setError('Failed to fetch cardiologists. Please try again later.');
            });
    }, []);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredCardiologists = cardiologists.filter(doctor => {
        return (
            doctor.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doctor.lastName.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
        <div className="min-h-screen bg-gray-200 dark:bg-gray-900 text-black dark:text-white">
            <div className="container mx-auto p-6">
                <h2 className="text-4xl font-bold mb-8 text-cyan-800 text-center dark:text-white">Cardiologists</h2>
                <div className="flex justify-center items-center my-8">
                    <input
                        type="text"
                        placeholder="Search by name"
                        className="w-full max-w-2xl p-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mb-8">
                    {filteredCardiologists.map(doctor => (
                        <div key={doctor.id} className="bg-white shadow-lg rounded-lg p-6 flex flex-col md:flex-row items-center md:items-start hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-white dark:hover:shadow-2xl">
                            <div className="flex-shrink-0 md:mr-6 mb-4 md:mb-0">
                                <img src="https://static.vecteezy.com/system/resources/thumbnails/024/585/326/small_2x/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png.png" alt={doctor.firstName} className="rounded-full w-32 h-32 object-cover" />
                            </div>
                            <div className="flex-grow">
                                <h4 className="text-xl font-bold text-cyan-800 dark:text-white">{doctor.firstName} {doctor.lastName}</h4>
                                <p className="text-gray-500 dark:text-gray-400">{doctor.specialty}</p>
                                <p className="text-gray-500 dark:text-gray-400">{doctor.hospital}</p>
                                <p className="text-gray-700 dark:text-gray-300"><strong>Languages:</strong> {doctor.languages || 'N/A'}</p>
                                <p className="text-gray-700 dark:text-gray-300"><strong>Gender:</strong> {doctor.gender || 'N/A'}</p>
                                <p className="text-gray-700 dark:text-gray-300"><strong>Experience:</strong> {doctor.experience || 'N/A'}</p>
                                <p className="text-gray-700 dark:text-gray-300"><strong>Availability:</strong> {doctor.availability || 'N/A'}</p>
                                <p className="text-yellow-500">★ {doctor.rating} ({doctor.reviews} reviews)</p>
                            </div>
                            <div className="mt-4 md:mt-0 md:ml-auto">
                                <Link to={`/doctors/${doctor.id}`} className="inline-block bg-cyan-800 text-white py-2 px-4 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600">See more</Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CardiologistsList;
