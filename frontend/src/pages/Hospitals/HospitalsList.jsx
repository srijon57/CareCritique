import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";

const HospitalsList = () => {
    const [hospitals, setHospitals] = useState([]);
    const [error, setError] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [areaQuery, setAreaQuery] = useState("");
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [areaSuggestions, setAreaSuggestions] = useState([]);
    const [activeSearchSuggestionIndex, setActiveSearchSuggestionIndex] = useState(-1);
    const [activeAreaSuggestionIndex, setActiveAreaSuggestionIndex] = useState(-1);
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const initialSearchQuery = queryParams.get('search') || "";
    const initialAreaQuery = queryParams.get('area') || "";

    useEffect(() => {
        setSearchQuery(initialSearchQuery);
        setAreaQuery(initialAreaQuery);
        fetchHospitals(initialSearchQuery, initialAreaQuery);
    }, [initialSearchQuery, initialAreaQuery]);

    const fetchHospitals = async (search, area) => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/hospitals", {
                params: { search, area },
            });
            if (Array.isArray(response.data)) {
                setHospitals(response.data);
            } else {
                console.error("API response is not an array:", response.data);
                setError("Failed to fetch hospitals. Please try again later.");
            }
        } catch (error) {
            console.error("Error fetching hospitals:", error.response ? error.response.data : error.message);
            setError("Failed to fetch hospitals. Please try again later.");
        }
    };

    const fetchSearchSuggestions = async (query) => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/hospitals/suggestions", {
                params: { query, type: "name" }, // Add type to differentiate between name and area suggestions
            });
            setSearchSuggestions(response.data);
        } catch (error) {
            console.error("Error fetching search suggestions:", error);
        }
    };

    const fetchAreaSuggestions = async (query) => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/hospitals/suggestions", {
                params: { query, type: "area" }, // Add type to differentiate between name and area suggestions
            });
            setAreaSuggestions(response.data);
        } catch (error) {
            console.error("Error fetching area suggestions:", error);
        }
    };

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value.length > 2) {
            fetchSearchSuggestions(value);
        } else {
            setSearchSuggestions([]);
        }
    };

    const handleAreaChange = (e) => {
        const value = e.target.value;
        setAreaQuery(value);
        if (value.length > 2) {
            fetchAreaSuggestions(value);
        } else {
            setAreaSuggestions([]);
        }
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            setActiveSearchSuggestionIndex((prevIndex) =>
                prevIndex < searchSuggestions.length - 1 ? prevIndex + 1 : prevIndex
            );
        } else if (e.key === "ArrowUp") {
            setActiveSearchSuggestionIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : 0
            );
        } else if (e.key === "Enter") {
            if (activeSearchSuggestionIndex >= 0 && searchSuggestions[activeSearchSuggestionIndex]) {
                const selectedSuggestion = searchSuggestions[activeSearchSuggestionIndex];
                setSearchQuery(selectedSuggestion.Name || selectedSuggestion.HospitalArea);
                setSearchSuggestions([]);
            }
        }
    };

    const handleAreaKeyDown = (e) => {
        if (e.key === "ArrowDown") {
            setActiveAreaSuggestionIndex((prevIndex) =>
                prevIndex < areaSuggestions.length - 1 ? prevIndex + 1 : prevIndex
            );
        } else if (e.key === "ArrowUp") {
            setActiveAreaSuggestionIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : 0
            );
        } else if (e.key === "Enter") {
            if (activeAreaSuggestionIndex >= 0 && areaSuggestions[activeAreaSuggestionIndex]) {
                const selectedSuggestion = areaSuggestions[activeAreaSuggestionIndex];
                setAreaQuery(selectedSuggestion.HospitalArea || selectedSuggestion.Name);
                setAreaSuggestions([]);
            }
        }
    };

    const handleSearch = () => {
        navigate(`/hospitals?search=${searchQuery}&area=${areaQuery}`);
        fetchHospitals(searchQuery, areaQuery);
    };

    if (error) {
        return <div className="text-red-500 text-center mt-6">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white flex flex-col items-center p-6">
            <h2 className="text-4xl font-bold mb-8 text-cyan-800 dark:text-white">All Hospitals</h2>
            
            {/* Search Bar */}
            <div className="flex justify-center items-center gap-4 mb-4">
                {/* Search by Name */}
                <div className="flex justify-center items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search hospitals by name"
                        className="p-3 border-2 border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onKeyDown={handleSearchKeyDown}
                    />
                    {searchSuggestions.length > 0 && (
                        <ul className="absolute z-10 bg-white dark:bg-gray-800 w-full mt-1 rounded-lg shadow-lg">
                            {searchSuggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className={`p-2 cursor-pointer ${
                                        index === activeSearchSuggestionIndex
                                            ? "bg-cyan-100 dark:bg-cyan-700"
                                            : "hover:bg-cyan-50 dark:hover:bg-cyan-600"
                                    }`}
                                    onClick={() => {
                                        setSearchQuery(suggestion.Name || suggestion.HospitalArea);
                                        setSearchSuggestions([]);
                                    }}
                                >
                                    {suggestion.Name || suggestion.HospitalArea}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Search by Area */}
                <div className="flex justify-center items-center gap-4">
                    <input
                        type="text"
                        placeholder="Search by area"
                        className="p-3 border-2 border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
                        value={areaQuery}
                        onChange={handleAreaChange}
                        onKeyDown={handleAreaKeyDown}
                    />
                    {areaSuggestions.length > 0 && (
                        <ul className="absolute z-10 bg-white dark:bg-gray-800 w-full mt-1 rounded-lg shadow-lg">
                            {areaSuggestions.map((suggestion, index) => (
                                <li
                                    key={index}
                                    className={`p-2 cursor-pointer ${
                                        index === activeAreaSuggestionIndex
                                            ? "bg-cyan-100 dark:bg-cyan-700"
                                            : "hover:bg-cyan-50 dark:hover:bg-cyan-600"
                                    }`}
                                    onClick={() => {
                                        setAreaQuery(suggestion.HospitalArea || suggestion.Name);
                                        setAreaSuggestions([]);
                                    }}
                                >
                                    {suggestion.HospitalArea || suggestion.Name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Search Button */}
                <button
                    className="bg-cyan-800 text-white py-3 px-6 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                    onClick={handleSearch}
                >
                    Search
                </button>
            </div>
            {/* write gap */}
            {/* Hospital List */}
            <div className="flex flex-col gap-6 w-full max-w-5xl">
                {hospitals.map(hospital => (
                    <div 
                        key={hospital.HospitalID} 
                        className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 flex items-center gap-6 transition-all hover:shadow-2xl dark:hover:shadow-xl w-full"
                    >
                        {/* Hospital Image */}
                        <img 
                            src="https://static.vecteezy.com/system/resources/previews/038/252/707/non_2x/hospital-building-illustration-medical-clinic-isolated-on-white-background-vector.jpg" 
                            alt={hospital.Name} 
                            className="rounded-lg w-44 h-44 object-cover"
                        />

                        {/* Hospital Info */}
                        <div className="flex-1">
                            <h5 className="text-2xl font-semibold text-cyan-800 dark:text-white">
                                {hospital.Name}
                            </h5>
                            <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                                {hospital.HospitalArea}, {hospital.HospitalCity} 
                            </p>

                            {/* Link Button */}
                            <Link 
                                to={`/hospitals/${hospital.HospitalID}`} 
                                className="mt-3 inline-block bg-cyan-800 text-white py-2 px-5 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600"
                            >
                                View Profile
                            </Link>
                        </div>

                        {/* Location */}
                        <div className="text-right text-gray-600 dark:text-gray-400 text-sm">
                            <p>📍 {hospital.Address}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HospitalsList;