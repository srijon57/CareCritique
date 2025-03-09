import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const HospitalsList = () => {
    const [hospitals, setHospitals] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [areaQuery, setAreaQuery] = useState("");
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialSearchQuery = queryParams.get('search') || "";
    const initialAreaQuery = queryParams.get('area') || "";

    useEffect(() => {
        setSearchQuery(initialSearchQuery);
        setAreaQuery(initialAreaQuery);
        fetchHospitals();
    }, [initialSearchQuery, initialAreaQuery]);

    const fetchHospitals = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/hospitals");
            if (Array.isArray(response.data)) {
                setHospitals(response.data);
                setError(null);
            } else {
                console.error("API response is not an array:", response.data);
                setError("Failed to fetch hospitals. Please try again later.");
            }
        } catch (error) {
            console.error("Error fetching hospitals:", error.response ? error.response.data : error.message);
            setError("Failed to fetch hospitals. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleAreaChange = (e) => {
        setAreaQuery(e.target.value);
    };

    const handleSearch = () => {
        navigate(`/hospitals?search=${searchQuery}&area=${areaQuery}`);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const filteredHospitals = hospitals.filter(hospital => {
        const nameMatch = (hospital.Name || '').toLowerCase().includes(searchQuery.toLowerCase());
        const areaMatch = (hospital.HospitalArea || '').toLowerCase().includes(areaQuery.toLowerCase());
        return nameMatch && areaMatch;
    });

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
                    <h1 className="text-4xl font-bold mb-4">Find a Hospital</h1>
                    <p className="text-cyan-100 dark:text-gray-300 max-w-2xl">
                        Search and browse hospitals in your area to find the right care for your needs.
                    </p>
                </div>
            </div>

            {/* Search section */}
            <div className="bg-white dark:bg-gray-800 shadow-md">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <label htmlFor="hospital-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Hospital Name
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <input
                                    id="hospital-search"
                                    type="text"
                                    placeholder="Search by hospital name"
                                    className="pl-10 w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:text-white"
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onKeyPress={handleKeyPress}
                                />
                            </div>
                        </div>
                        
                        <div className="flex-1">
                            <label htmlFor="area-search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Area/Location
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500 dark:text-gray-400">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </span>
                                <input
                                    id="area-search"
                                    type="text"
                                    placeholder="Search by area"
                                    className="pl-10 w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 dark:text-white"
                                    value={areaQuery}
                                    onChange={handleAreaChange}
                                    onKeyPress={handleKeyPress}
                                />
                            </div>
                        </div>
                        
                        <div className="self-end">
                            <button
                                className="w-full md:w-auto bg-cyan-600 hover:bg-cyan-700 focus:ring-4 focus:ring-cyan-500/50 text-white font-medium py-3 px-6 rounded-lg transition-colors"
                                onClick={handleSearch}
                            >
                                Search
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Results section */}
            <div className="container mx-auto px-4 py-8">
                {/* Results header */}
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                        {loading ? "Loading hospitals..." : 
                         filteredHospitals.length === 0 ? "No hospitals found" :
                         `Found ${filteredHospitals.length} hospital${filteredHospitals.length === 1 ? '' : 's'}`}
                    </h2>
                </div>

                {/* Loading state */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-600"></div>
                    </div>
                )}

                {/* Empty state */}
                {!loading && filteredHospitals.length === 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 text-center">
                        <div className="text-gray-400 text-5xl mb-4">🏥</div>
                        <h3 className="text-lg font-medium mb-2 text-gray-800 dark:text-white">No hospitals found</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search criteria or clear filters to see more results.</p>
                        <button 
                            onClick={() => {
                                setSearchQuery("");
                                setAreaQuery("");
                                navigate("/hospitals");
                            }}
                            className="text-cyan-600 hover:text-cyan-700 font-medium dark:text-cyan-400 dark:hover:text-cyan-300"
                        >
                            Clear all filters
                        </button>
                    </div>
                )}

                {/* Hospital list */}
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
                    {filteredHospitals.map(hospital => (
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
                                        <div className="flex items-center">
                                            {/* We could add additional info like ratings here */}
                                        </div>
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

export default HospitalsList;