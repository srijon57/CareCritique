import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";

const Homepage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [area, setArea] = useState("");
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [areaSuggestions, setAreaSuggestions] = useState([]);
    const [activeSearchSuggestionIndex, setActiveSearchSuggestionIndex] = useState(-1);
    const [activeAreaSuggestionIndex, setActiveAreaSuggestionIndex] = useState(-1);
    const navigate = useNavigate();

    // Fetch search suggestions from the backend API
    const fetchSearchSuggestions = async (query) => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/hospitals/suggestions", {
                params: { query },
            });
            setSearchSuggestions(response.data);
        } catch (error) {
            console.error("Error fetching search suggestions:", error);
        }
    };

    // Fetch area suggestions from the backend API
    const fetchAreaSuggestions = async (query) => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/hospitals/suggestions", {
                params: { query },
            });
            setAreaSuggestions(response.data);
        } catch (error) {
            console.error("Error fetching area suggestions:", error);
        }
    };

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        if (value.length > 2) {
            fetchSearchSuggestions(value);
        } else {
            setSearchSuggestions([]);
        }
    };

    // Handle area input change
    const handleAreaChange = (e) => {
        const value = e.target.value;
        setArea(value);
        if (value.length > 2) {
            fetchAreaSuggestions(value);
        } else {
            setAreaSuggestions([]);
        }
    };

    // Handle keyboard navigation for search suggestions
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

    // Handle keyboard navigation for area suggestions
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
                setArea(selectedSuggestion.HospitalArea || selectedSuggestion.Name);
                setAreaSuggestions([]);
            }
        }
    };

    // Handle search button click
    const handleSearch = () => {
        navigate(`/hospitals?search=${searchQuery}&area=${area}`);
    };

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen font-sans">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-cyan-700 to-cyan-600 text-white py-20 dark:from-black dark:to-cyan-600">
                <div className="container mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-4">Find the Best Healthcare Providers</h1>
                    <p className="text-xl mb-8">Your health is our priority. Search for doctors, hospitals, and specialists near you.</p>
                    <div className="flex justify-center items-center gap-4">
                        <div className="relative w-1/3">
                            <input
                                type="text"
                                placeholder="Specialty, Condition or Procedure"
                                className="p-3 border-2 border-white rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
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
                        <div className="flex justify-center items-center gap-4">
                            <input
                                type="text"
                                placeholder="Dhanmondi, Dhaka"
                                className="p-3 border-2 border-white rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                value={area}
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
                                                setArea(suggestion.HospitalArea || suggestion.Name);
                                                setAreaSuggestions([]);
                                            }}
                                        >
                                            {suggestion.HospitalArea || suggestion.Name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <button
                            className="bg-white text-cyan-800 py-3 px-6 rounded hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </section>

            {/* Featured Doctors Section */}
            <section className="container mx-auto p-6">
                <h2 className="text-4xl font-bold mb-8 text-cyan-800 text-center dark:text-white">Featured Doctors</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-white dark:hover:shadow-2xl">
                        <img src="https://static.vecteezy.com/system/resources/thumbnails/024/585/326/small_2x/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png.png" alt="Dr. Karl Smith" className="mx-auto mb-4 rounded-full w-32 h-32 object-cover" />
                        <h4 className="text-xl font-bold text-cyan-800 dark:text-white">Dr. Mashrur Rahman Fahim</h4>
                        <p className="text-gray-500 dark:text-gray-400">Neurologist</p>
                        <button className="bg-cyan-800 text-white py-2 px-4 mt-4 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600">Learn More</button>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-white dark:hover:shadow-2xl">
                        <img src="https://static.vecteezy.com/system/resources/thumbnails/024/585/358/small_2x/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png.png" alt="Lisa Thomas" className="mx-auto mb-4 rounded-full w-32 h-32 object-cover" />
                        <h4 className="text-xl font-bold text-cyan-800 dark:text-white">Dr. Aspia Amir</h4>
                        <p className="text-gray-500 dark:text-gray-400">Medical Team</p>
                        <button className="bg-cyan-800 text-white py-2 px-4 mt-4 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600">Learn More</button>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-white dark:hover:shadow-2xl">
                        <img src="https://static.vecteezy.com/system/resources/thumbnails/024/585/326/small_2x/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png.png" alt="Janne Doe" className="mx-auto mb-4 rounded-full w-32 h-32 object-cover" />
                        <h4 className="text-xl font-bold text-cyan-800 dark:text-white">Dr. Abdullah Ishtiaq Sakib</h4>
                        <p className="text-gray-500 dark:text-gray-400">Doctor</p>
                        <button className="bg-cyan-800 text-white py-2 px-4 mt-4 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600">Learn More</button>
                    </div>
                </div>
            </section>

            {/* Testimonials Carousel */}
            <section className="bg-white py-12 dark:bg-gray-900">
                <h2 className="text-4xl font-bold mb-8 text-cyan-800 text-center dark:text-white">What Our Patients Say</h2>
                <div className="container mx-auto">
                    <Carousel showArrows={true} infiniteLoop={true} showThumbs={false} showStatus={false}>
                        <div className="p-6 text-center">
                            <p className="text-gray-700 text-lg mb-4 dark:text-gray-400">``আমার জীবনের সেরা স্বাস্থ্যসেবার অভিজ্ঞতা। ডাক্তাররা খুবই পেশাদার এবং যত্নশীল ছিলেন।``</p>
                            <p className="text-cyan-800 font-semibold dark:text-white">- সাদিক রহমান</p>
                        </div>
                        <div className="p-6 text-center">
                            <p className="text-gray-700 text-lg mb-4 dark:text-gray-400">``আমার অবস্থার জন্য আমি নিখুঁত বিশেষজ্ঞ খুঁজে পেয়েছি। পরিষেবাটি দুর্দান্ত ছিল!``</p>
                            <p className="text-cyan-800 font-semibold dark:text-white">- কাজী কামরুদ্দিন আহমেদ</p>
                        </div>
                        <div className="p-6 text-center">
                            <p className="text-gray-700 text-lg mb-4 dark:text-gray-400">``Highly recommend this platform for finding top-notch healthcare providers.``</p>
                            <p className="text-cyan-800 font-semibold dark:text-white">- Srabani Mitra</p>
                        </div>
                    </Carousel>
                </div>
            </section>

            {/* Health Tips Section */}
            <section className="container mx-auto p-6">
                <h2 className="text-4xl font-bold mb-8 text-cyan-800 text-center dark:text-white">Health Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-white dark:hover:shadow-2xl">
                        <h3 className="text-xl font-bold text-cyan-800 mb-2 dark:text-white">Stay Hydrated</h3>
                        <p className="text-gray-700 dark:text-gray-400">Drinking enough water is essential for maintaining good health. Aim for at least 8 glasses a day.</p>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-white dark:hover:shadow-2xl">
                        <h3 className="text-xl font-bold text-cyan-800 mb-2 dark:text-white">Exercise Regularly</h3>
                        <p className="text-gray-700 dark:text-gray-400">Regular physical activity can help you maintain a healthy weight and reduce the risk of chronic diseases.</p>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-white dark:hover:shadow-2xl">
                        <h3 className="text-xl font-bold text-cyan-800 mb-2 dark:text-white">Eat a Balanced Diet</h3>
                        <p className="text-gray-700 dark:text-gray-400">A balanced diet rich in fruits, vegetables, and whole grains is key to maintaining good health.</p>
                    </div>
                </div>
            </section>

            {/* Emergency Section */}
            <section className="text-center my-12">
                <button className="bg-red-600 text-white py-4 px-8 text-2xl rounded hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600">Emergency - Call 999</button>
            </section>

            {/* Top Hospitals Section */}
            <section className="container mx-auto p-6">
                <h2 className="text-4xl font-bold mb-8 text-cyan-800 text-center dark:text-white">Top Hospitals</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-white dark:hover:shadow-2xl">
                        <img src="https://static.vecteezy.com/system/resources/previews/038/252/707/non_2x/hospital-building-illustration-medical-clinic-isolated-on-white-background-vector.jpg" alt="Popular Hospital" className="mx-auto mb-4 rounded-lg w-full h-48 object-cover" />
                        <h5 className="text-xl font-semibold text-cyan-800 dark:text-white">Popular Medical College Hospital</h5>
                        <button className="bg-cyan-800 text-white py-2 px-4 mt-4 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600">Learn More</button>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-white dark:hover:shadow-2xl">
                        <img src="https://static.vecteezy.com/system/resources/previews/038/252/707/non_2x/hospital-building-illustration-medical-clinic-isolated-on-white-background-vector.jpg" alt="Central Hospital" className="mx-auto mb-4 rounded-lg w-full h-48 object-cover" />
                        <h5 className="text-xl font-semibold text-cyan-800 dark:text-white">Central Hospital Ltd</h5>
                        <button className="bg-cyan-800 text-white py-2 px-4 mt-4 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600">Learn More</button>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-white dark:hover:shadow-2xl">
                        <img src="https://static.vecteezy.com/system/resources/previews/038/252/707/non_2x/hospital-building-illustration-medical-clinic-isolated-on-white-background-vector.jpg" alt="Labaid Hospital" className="mx-auto mb-4 rounded-lg w-full h-48 object-cover" />
                        <h5 className="text-xl font-semibold text-cyan-800 dark:text-white">Labaid Specialized Hospital</h5>
                        <button className="bg-cyan-800 text-white py-2 px-4 mt-4 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600">Learn More</button>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-white dark:hover:shadow-2xl">
                        <img src="https://static.vecteezy.com/system/resources/previews/038/252/707/non_2x/hospital-building-illustration-medical-clinic-isolated-on-white-background-vector.jpg" alt="Dhaka Medical" className="mx-auto mb-4 rounded-lg w-full h-48 object-cover" />
                        <h5 className="text-xl font-semibold text-cyan-800 dark:text-white">Dhaka Medical College Hospital</h5>
                        <button className="bg-cyan-800 text-white py-2 px-4 mt-4 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600">Learn More</button>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Homepage;
