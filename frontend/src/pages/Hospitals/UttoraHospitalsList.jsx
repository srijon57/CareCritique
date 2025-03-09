import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const UttoraHospitalsList = () => {
    const [hospitals, setHospitals] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/hospitals");
            if (Array.isArray(response.data)) {
                const filteredHospitals = response.data.filter(hospital => 
                    hospital.HospitalArea?.toLowerCase() === "uttora"
                );
                setHospitals(filteredHospitals);
                setError(null);
            } else {
                setError("Failed to fetch hospitals. Please try again later.");
            }
        } catch (error) {
            console.error("Error fetching hospitals:", error.response ? error.response.data : error.message);
            setError("Failed to fetch hospitals. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full text-center">
                    <div className="text-red-500 text-5xl mb-4">⚠️</div>
                    <h3 className="text-lg font-semibold mb-2 dark:text-white">Error</h3>
                    <p className="text-gray-600 dark:text-gray-300">{error}</p>
                    <button 
                        onClick={fetchHospitals}
                        className="mt-4 bg-cyan-700 hover:bg-cyan-800 text-white py-2 px-4 rounded-md transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
            {/* Header section */}
            <div className="bg-cyan-700 dark:bg-gray-800 text-white py-12">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold mb-4">Hospitals in Uttora</h1>
                    <p className="text-cyan-100 dark:text-gray-300 max-w-2xl">
                        Find quality healthcare facilities in the Uttora area
                    </p>
                </div>
            </div>

            {/* Results section */}
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {loading ? "Loading hospitals..." : 
                        hospitals.length === 0 ? "No hospitals found" :
                        `Found ${hospitals.length} hospital${hospitals.length === 1 ? '' : 's'}`}
                    </h2>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
                    </div>
                )}

                {/* Empty state */}
                {!loading && hospitals.length === 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                        <div className="text-gray-400 text-5xl mb-4">🏥</div>
                        <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">No hospitals found</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">There are currently no hospitals registered in Uttora</p>
                    </div>
                )}

                {/* Hospital list */}
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
                    {hospitals.map(hospital => (
                        <div
                            key={hospital.HospitalID}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                        >
                            <div className="p-0 flex flex-col md:flex-row">
                                {/* Hospital Image */}
                                <div className="md:w-64 h-full">
                                    <img
                                        src="https://static.vecteezy.com/system/resources/previews/038/252/707/non_2x/hospital-building-illustration-medical-clinic-isolated-on-white-background-vector.jpg"
                                        alt={hospital.Name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Hospital Info */}
                                <div className="flex-1 p-6 flex flex-col">
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                                    {hospital.Name}
                                                </h3>
                                                <div className="flex items-center mt-1 text-gray-500 dark:text-gray-400">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                    <span>{hospital.HospitalArea}, {hospital.HospitalCity}</span>
                                                </div>
                                            </div>
                                            
                                            <span className="bg-cyan-100 text-cyan-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-cyan-900 dark:text-cyan-300">
                                                Hospital
                                            </span>
                                        </div>

                                        <p className="text-gray-600 dark:text-gray-300 my-4">
                                            {hospital.Address}
                                        </p>
                                    </div>

                                    <div className="flex justify-between items-center mt-4">
                                        <Link
                                            to={`/hospitals/${hospital.HospitalID}`}
                                            className="inline-flex items-center bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                        >
                                            View Details
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
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

export default UttoraHospitalsList;