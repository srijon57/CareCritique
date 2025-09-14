import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import { BodyComponent } from "reactjs-human-body";

const Homepage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [area, setArea] = useState("");
    const [activeSearchSuggestionIndex, setActiveSearchSuggestionIndex] = useState(-1);
    const [activeAreaSuggestionIndex, setActiveAreaSuggestionIndex] = useState(-1);
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [bodyModel, setBodyModel] = useState("male");
    const [params] = useState(null);
    const [selectedBodyPart, setSelectedBodyPart] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchFocused, setSearchFocused] = useState(false);
    const [areaFocused, setAreaFocused] = useState(false);
    const navigate = useNavigate();

    // ✅ Diseases grouped by normalized body part
    const bodyPartDiseases = {
        head: {
            male: ["Migraine", "Cluster Headache", "Concussion", "Sinusitis", "Brain Tumor", "Stroke", "Meningitis"],
            female: ["Migraine (Hormonal)", "Tension Headache", "Concussion", "Sinusitis", "Brain Tumor", "Stroke", "Meningitis", "Hormonal Imbalance Headaches"],
        },
        shoulder: {
            male: ["Rotator Cuff Injury", "Frozen Shoulder", "Shoulder Impingement", "Bursitis", "Arthritis"],
            female: ["Rotator Cuff Injury", "Frozen Shoulder", "Shoulder Impingement", "Bursitis", "Arthritis", "Osteoporosis-Related Fractures"],
        },
        chest: {
            male: ["Heart Disease", "Pneumonia", "Asthma", "Bronchitis", "Acid Reflux", "Angina", "Lung Cancer"],
            female: ["Heart Disease", "Pneumonia", "Asthma", "Bronchitis", "Acid Reflux", "Angina", "Breast Cancer", "Lung Cancer"],
        },
        stomach: {
            male: ["Gastritis", "Peptic Ulcer", "Gallstones", "Pancreatitis", "Appendicitis", "Irritable Bowel Syndrome (IBS)"],
            female: ["Gastritis", "Peptic Ulcer", "Gallstones", "Pancreatitis", "Appendicitis", "Irritable Bowel Syndrome (IBS)", "Endometriosis", "Ovarian Cysts"],
        },
        arm: {
            male: ["Tennis Elbow", "Carpal Tunnel Syndrome", "Fractures", "Arthritis", "Tendonitis"],
            female: ["Tennis Elbow", "Carpal Tunnel Syndrome", "Fractures", "Arthritis", "Tendonitis", "Osteoporosis-Related Fractures"],
        },
        hand: {
            male: ["Carpal Tunnel Syndrome", "Arthritis", "Trigger Finger", "Ganglion Cyst"],
            female: ["Carpal Tunnel Syndrome", "Arthritis", "Trigger Finger", "Ganglion Cyst", "Raynaud's Disease"],
        },
        leg: {
            male: ["Varicose Veins", "Deep Vein Thrombosis (DVT)", "Arthritis", "Fractures", "Sciatica"],
            female: ["Varicose Veins", "Deep Vein Thrombosis (DVT)", "Arthritis", "Fractures", "Sciatica", "Osteoporosis-Related Fractures"],
        },
        foot: {
            male: ["Plantar Fasciitis", "Gout", "Bunions", "Athlete's Foot", "Flat Feet"],
            female: ["Plantar Fasciitis", "Gout", "Bunions", "Athlete's Foot", "Flat Feet", "Osteoporosis-Related Fractures"],
        },
    };

    // ✅ normalize left/right body parts
    const normalizeBodyPart = (id) => {
        if (!id) return id;
        if (id.toLowerCase().includes("arm")) return "arm";
        if (id.toLowerCase().includes("leg")) return "leg";
        if (id.toLowerCase().includes("hand")) return "hand";
        if (id.toLowerCase().includes("foot")) return "foot";
        if (id.toLowerCase().includes("shoulder")) return "shoulder";
        return id;
    };

    const searchSuggestionsData = [
        { Name: "Cardiology" },
        { Name: "Dermatology" },
        { Name: "Pediatrics" },
        { Name: "Orthopedics" },
    ];
    const areaSuggestionsData = [
        { HospitalArea: "Dhanmondi" },
        { HospitalArea: "Gulshan" },
        { HospitalArea: "Banani" },
        { HospitalArea: "Mirpur" },
    ];

    useEffect(() => {
        setIsLoading(true);
        
        // Simulate loading with multiple API calls
        Promise.all([
            axios.get(`${import.meta.env.VITE_BACKEND}/api/doctors`).catch(() => ({ data: [] })),
            axios.get(`${import.meta.env.VITE_BACKEND}/api/hospitals`).catch(() => ({ data: [] }))
        ]).then(([doctorsResponse, hospitalsResponse]) => {
            if (Array.isArray(doctorsResponse.data)) {
                const filteredDoctors = doctorsResponse.data
                    .map(doctor => ({
                        id: doctor.DoctorID,
                        firstName: doctor.FirstName,
                        lastName: doctor.LastName,
                        specialty: doctor.Specialty,
                        hospital: doctor.Hospital,
                    }))
                    .slice(0, 3);
                setDoctors(filteredDoctors);
            }
            
            if (Array.isArray(hospitalsResponse.data)) {
                setHospitals(hospitalsResponse.data.slice(0, 4));
            }
            
            setTimeout(() => setIsLoading(false), 800);
        });
    }, []);

    const handleSearchChange = (e) => setSearchQuery(e.target.value);
    const handleAreaChange = (e) => setArea(e.target.value);

    const handleSearchKeyDown = (e) => {
        const filteredSuggestions = searchSuggestionsData.filter(suggestion =>
            suggestion.Name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (e.key === "ArrowDown") {
            setActiveSearchSuggestionIndex((prevIndex) =>
                prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : prevIndex
            );
        } else if (e.key === "ArrowUp") {
            setActiveSearchSuggestionIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : 0
            );
        } else if (e.key === "Enter") {
            if (activeSearchSuggestionIndex >= 0 && filteredSuggestions[activeSearchSuggestionIndex]) {
                const selectedSuggestion = filteredSuggestions[activeSearchSuggestionIndex];
                setSearchQuery(selectedSuggestion.Name);
                navigate(`/doctors?search=${selectedSuggestion.Name}`);
            }
        }
    };

    const handleAreaKeyDown = (e) => {
        const filteredSuggestions = areaSuggestionsData.filter(suggestion =>
            suggestion.HospitalArea.toLowerCase().includes(area.toLowerCase())
        );
        if (e.key === "ArrowDown") {
            setActiveAreaSuggestionIndex((prevIndex) =>
                prevIndex < filteredSuggestions.length - 1 ? prevIndex + 1 : prevIndex
            );
        } else if (e.key === "ArrowUp") {
            setActiveAreaSuggestionIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : 0
            );
        } else if (e.key === "Enter") {
            if (activeAreaSuggestionIndex >= 0 && filteredSuggestions[activeAreaSuggestionIndex]) {
                const selectedSuggestion = filteredSuggestions[activeAreaSuggestionIndex];
                setArea(selectedSuggestion.HospitalArea);
                navigate(`/hospitals?area=${selectedSuggestion.HospitalArea}`);
            }
        }
    };

    const handleSearch = () => {
        if (searchQuery) navigate(`/doctors?search=${searchQuery}`);
        if (area) navigate(`/hospitals?area=${area}`);
    };

    const handleDoctorLearnMore = (doctorId) => navigate(`/doctors/${doctorId}`);
    const handleHospitalLearnMore = (hospitalId) => navigate(`/hospitals/${hospitalId}`);

    const onChange = (parts) => console.log("Changed Parts:", parts);

    const onClick = (id) => {
        const normalizedPart = normalizeBodyPart(id);
        setSelectedBodyPart(normalizedPart);
        console.log("Clicked Part:", id, "→ normalized:", normalizedPart);
    };

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-cyan-800 mx-auto mb-4"></div>
                    <p className="text-cyan-800 dark:text-white text-lg font-semibold">Loading Healthcare Services...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen font-sans overflow-hidden">
            {/* Hero Section with Enhanced Animations */}
            <section className="bg-gradient-to-r from-cyan-700 to-cyan-600 text-white py-20 dark:from-black dark:to-cyan-600 relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full animate-bounce delay-1000"></div>
                    <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full animate-ping delay-2000"></div>
                    <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-white rounded-full animate-pulse delay-3000"></div>
                </div>
                
                <div className="container mx-auto text-center relative z-10">
                    <h1 className="text-5xl font-bold mb-4 animate-fade-in-up">Find the Best Healthcare Providers</h1>
                    <p className="text-xl mb-8 animate-fade-in-up delay-200">Your health is our priority. Search for doctors, hospitals, and specialists near you.</p>
                    
                    <div className="flex justify-center items-center gap-4 animate-fade-in-up delay-300">
                        <div className="relative w-1/3">
                            <input
                                type="text"
                                placeholder="Specialty, Condition or Procedure"
                                className={`p-3 border-2 border-white rounded w-full focus:outline-none focus:ring-4 focus:ring-cyan-300 text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all duration-300 transform ${searchFocused ? 'scale-105 shadow-2xl' : 'hover:scale-102 shadow-lg'}`}
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyDown={handleSearchKeyDown}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                            />
                            {searchQuery.length > 2 && (
                                <ul className="absolute z-10 bg-white dark:bg-gray-800 w-full mt-1 rounded-lg shadow-2xl animate-fade-in-down border border-gray-200 dark:border-gray-700">
                                    {searchSuggestionsData
                                        .filter(suggestion =>
                                            suggestion.Name.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .map((suggestion, index) => (
                                            <li
                                                key={index}
                                                className={`p-3 cursor-pointer text-gray-800 dark:text-white transition-all duration-200 transform hover:scale-102 ${
                                                    index === activeSearchSuggestionIndex
                                                        ? "bg-cyan-100 dark:bg-cyan-700 shadow-md"
                                                        : "hover:bg-cyan-50 dark:hover:bg-cyan-600"
                                                }`}
                                                onClick={() => {
                                                    setSearchQuery(suggestion.Name);
                                                    navigate(`/doctors?search=${suggestion.Name}`);
                                                }}
                                            >
                                                {suggestion.Name}
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>
                        
                        <div className="relative w-1/3">
                            <input
                                type="text"
                                placeholder="Dhanmondi, Dhaka"
                                className={`p-3 border-2 border-white rounded w-full focus:outline-none focus:ring-4 focus:ring-cyan-300 text-gray-800 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all duration-300 transform ${areaFocused ? 'scale-105 shadow-2xl' : 'hover:scale-102 shadow-lg'}`}
                                value={area}
                                onChange={handleAreaChange}
                                onKeyDown={handleAreaKeyDown}
                                onFocus={() => setAreaFocused(true)}
                                onBlur={() => setAreaFocused(false)}
                            />
                            {area.length > 2 && (
                                <ul className="absolute z-10 bg-white dark:bg-gray-800 w-full mt-1 rounded-lg shadow-2xl animate-fade-in-down border border-gray-200 dark:border-gray-700">
                                    {areaSuggestionsData
                                        .filter(suggestion =>
                                            suggestion.HospitalArea.toLowerCase().includes(area.toLowerCase())
                                        )
                                        .map((suggestion, index) => (
                                            <li
                                                key={index}
                                                className={`p-3 cursor-pointer text-gray-800 dark:text-white transition-all duration-200 transform hover:scale-102 ${
                                                    index === activeAreaSuggestionIndex
                                                        ? "bg-cyan-100 dark:bg-cyan-700 shadow-md"
                                                        : "hover:bg-cyan-50 dark:hover:bg-cyan-600"
                                                }`}
                                                onClick={() => {
                                                    setArea(suggestion.HospitalArea);
                                                    navigate(`/hospitals?area=${suggestion.HospitalArea}`);
                                                }}
                                            >
                                                {suggestion.HospitalArea}
                                            </li>
                                        ))}
                                </ul>
                            )}
                        </div>
                        
                        <button
                            className="bg-white text-cyan-800 py-3 px-8 rounded hover:bg-cyan-100 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl active:scale-95 font-semibold"
                            onClick={handleSearch}
                        >
                            🔍 Search
                        </button>
                    </div>
                </div>
            </section>

            {/* Featured Doctors Section with Staggered Animation */}
            <section className="container mx-auto p-6">
                <h2 className="text-4xl font-bold mb-8 text-cyan-800 text-center dark:text-white animate-fade-in-up">Featured Doctors</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    {doctors.map((doctor, index) => (
                        <div 
                            key={doctor.id} 
                            className={`bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-2xl transition-all duration-500 dark:bg-gray-800 dark:text-white transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up`}
                            style={{ animationDelay: `${index * 200}ms` }}
                        >
                            <div className="relative mb-4 group">
                                <img 
                                    src="https://i.pinimg.com/originals/53/e1/f9/53e1f9601fd784835e67a54f858d0c5e.png" 
                                    alt={`${doctor.firstName} ${doctor.lastName}`} 
                                     className="mx-auto rounded-full w-32 h-32 object-cover border-4 border-cyan-200 group-hover:border-cyan-400 transition-all duration-300 transform group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-0  transition-opacity duration-300"></div>
                            </div>
                            <h4 className="text-xl font-bold text-cyan-800 dark:text-white mb-2 transform hover:scale-105 transition-transform duration-200">{doctor.firstName} {doctor.lastName}</h4>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">{doctor.specialty}</p>
                            <button
                                className="bg-cyan-800 text-white py-3 px-6 mt-4 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-700 dark:hover:bg-cyan-600 transition-all duration-300 transform hover:scale-110 active:scale-95 font-semibold shadow-lg hover:shadow-xl"
                                onClick={() => handleDoctorLearnMore(doctor.id)}
                            >
                                👨‍⚕️ View Profile
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Enhanced Testimonials Carousel */}
           <section className="bg-white py-12 dark:bg-gray-900 animate-fade-in-up">
    <h2 className="text-4xl font-bold mb-8 text-cyan-800 text-center dark:text-white">What Our Patients Say</h2>
    <div className="container mx-auto">
        <Carousel
            showArrows={true}
            infiniteLoop={true}
            showThumbs={false}
            showStatus={false}
            autoPlay={true} // 👈 Added this prop
            interval={10000} // 👈 Added this prop for 10s delay
            className="testimonial-carousel"
        >
            <div className="p-8 text-center bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl mx-4 transform hover:scale-105 transition-all duration-300 shadow-lg">
                <div className="text-6xl mb-4">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-700 text-lg mb-6 dark:text-gray-400 italic">``আমার জীবনের সেরা স্বাস্থ্যসেবার অভিজ্ঞতা। ডাক্তাররা খুবই পেশাদার এবং যত্নশীল ছিলেন।``</p>
                <p className="text-cyan-800 font-bold text-lg dark:text-white">- সাদিক রহমান</p>
            </div>
            <div className="p-8 text-center bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl mx-4 transform hover:scale-105 transition-all duration-300 shadow-lg">
                <div className="text-6xl mb-4">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-700 text-lg mb-6 dark:text-gray-400 italic">``আমার অবস্থার জন্য আমি নিখুঁত বিশেষজ্ঞ খুঁজে পেয়েছি। পরিষেবাটি দুর্দান্ত ছিল!``</p>
                <p className="text-cyan-800 font-bold text-lg dark:text-white">- কাজী কামরুদ্দিন আহমেদ</p>
            </div>
            <div className="p-8 text-center bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl mx-4 transform hover:scale-105 transition-all duration-300 shadow-lg">
                <div className="text-6xl mb-4">⭐⭐⭐⭐⭐</div>
                <p className="text-gray-700 text-lg mb-6 dark:text-gray-400 italic">``Highly recommend this platform for finding top-notch healthcare providers.``</p>
                <p className="text-cyan-800 font-bold text-lg dark:text-white">- Srabani Mitra</p>
            </div>
        </Carousel>
    </div>
</section>

            {/* Enhanced Health Tips Section */}
            <section className="container mx-auto p-6">
                <h2 className="text-4xl font-bold mb-8 text-cyan-800 text-center dark:text-white animate-fade-in-up">Health Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        { icon: "💧", title: "Stay Hydrated", content: "Drinking enough water is essential for maintaining good health. Aim for at least 8 glasses a day.", color: "from-blue-400 to-cyan-500" },
                        { icon: "🏃‍♂️", title: "Exercise Regularly", content: "Regular physical activity can help you maintain a healthy weight and reduce the risk of chronic diseases.", color: "from-green-400 to-teal-500" },
                        { icon: "🥗", title: "Eat a Balanced Diet", content: "A balanced diet rich in fruits, vegetables, and whole grains is key to maintaining good health.", color: "from-orange-400 to-red-500" }
                    ].map((tip, index) => (
                        <div 
                            key={index}
                            className={`bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-all duration-500 dark:bg-gray-800 dark:text-white transform hover:-translate-y-3 hover:scale-105 animate-fade-in-up group cursor-pointer`}
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${tip.color} flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                                {tip.icon}
                            </div>
                            <h3 className="text-xl font-bold text-cyan-800 mb-3 dark:text-white text-center group-hover:text-cyan-600 transition-colors duration-300">{tip.title}</h3>
                            <p className="text-gray-700 dark:text-gray-400 text-center leading-relaxed">{tip.content}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Enhanced Human Body UI Section */}
            <section className="container mx-auto p-6 text-center animate-fade-in-up">
                <h2 className="text-4xl font-bold mb-8 text-cyan-800 dark:text-white">
                    🫀 Explore Human Body
                </h2>
                <div className="flex justify-center gap-4 mb-6">
                    <button
                        className={`py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-cyan-300 ${
                            bodyModel === 'male' 
                                ? 'bg-cyan-800 text-white shadow-lg' 
                                : 'bg-gray-200 text-cyan-800 hover:bg-cyan-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setBodyModel('male')}
                    >
                        🚹 Male Model
                    </button>
                    <button
                        className={`py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-cyan-300 ${
                            bodyModel === 'female' 
                                ? 'bg-cyan-800 text-white shadow-lg' 
                                : 'bg-gray-200 text-cyan-800 hover:bg-cyan-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                        }`}
                        onClick={() => setBodyModel('female')}
                    >
                        🚺 Female Model
                    </button>
                </div>
                <div className="flex justify-center mb-6">
                    <div className="w-full max-w-md transform hover:scale-105 transition-transform duration-300">
                        <BodyComponent
                            partsInput={params}
                            bodyModel={bodyModel}
                            onChange={onChange}
                            onClick={onClick}
                        />
                    </div>
                </div>
                {selectedBodyPart && (
                    <div className="mt-6 p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg transform animate-fade-in-up border border-cyan-200 dark:border-gray-600">
                        <h3 className="text-2xl font-bold text-cyan-800 dark:text-white mb-4 flex items-center justify-center gap-2">
                            🔍 Possible Diseases in {selectedBodyPart.replace('_', ' ').toUpperCase()}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {bodyPartDiseases[selectedBodyPart]?.[bodyModel]?.map((disease, index) => (
                                <div key={index} className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-102">
                                    <span className="text-gray-800 dark:text-gray-200 font-medium">• {disease}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Enhanced Emergency Section */}
            <section className="text-center my-12 animate-fade-in-up">
                <button className="bg-red-600 text-white py-6 px-12 text-2xl font-bold rounded-xl hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-700 dark:hover:bg-red-600 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-2xl animate-pulse">
                    🚨 Emergency - Call 999
                </button>
                <p className="mt-3 text-gray-600 dark:text-gray-400">Available 24/7 for medical emergencies</p>
            </section>

            {/* Enhanced Top Hospitals Section */}
            <section className="container mx-auto p-6">
                <h2 className="text-4xl font-bold mb-8 text-cyan-800 text-center dark:text-white animate-fade-in-up">🏥 Top Hospitals</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {hospitals.map((hospital, index) => (
                        <div 
                            key={hospital.HospitalID} 
                            className={`bg-white shadow-lg rounded-xl p-6 text-center hover:shadow-2xl transition-all duration-500 dark:bg-gray-800 dark:text-white transform hover:-translate-y-3 hover:scale-105 animate-fade-in-up group`}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div className="relative mb-4 overflow-hidden rounded-lg group-hover:shadow-xl transition-shadow duration-300">
                                <img 
                                    src="https://static.vecteezy.com/system/resources/previews/038/252/707/non_2x/hospital-building-illustration-medical-clinic-isolated-on-white-background-vector.jpg" 
                                    alt={hospital.Name} 
                                    className="w-full h-48 object-cover transform group-hover:scale-110 transition-transform duration-500" 
                                />
                                <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            </div>
                            <h5 className="text-xl font-bold text-cyan-800 dark:text-white mb-4 transform group-hover:scale-105 transition-transform duration-200">{hospital.Name}</h5>
                            <button
                                className="bg-cyan-800 text-white py-3 px-6 mt-4 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-700 dark:hover:bg-cyan-600 transition-all duration-300 transform hover:scale-110 active:scale-95 font-semibold shadow-lg hover:shadow-xl"
                                onClick={() => handleHospitalLearnMore(hospital.HospitalID)}
                            >
                                🏥 Learn More
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Custom CSS Styles for Animations */}
            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes fade-in-down {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out forwards;
                    opacity: 0;
                }

                .animate-fade-in-down {
                    animation: fade-in-down 0.3s ease-out forwards;
                }

                .delay-200 {
                    animation-delay: 200ms;
                }

                .delay-300 {
                    animation-delay: 300ms;
                }

                .delay-1000 {
                    animation-delay: 1000ms;
                }

                .delay-2000 {
                    animation-delay: 2000ms;
                }

                .delay-3000 {
                    animation-delay: 3000ms;
                }

                .hover\\:scale-102:hover {
                    transform: scale(1.02);
                }

                .testimonial-carousel .carousel .slide {
                    background: transparent !important;
                }

                .testimonial-carousel .carousel .control-arrow {
                    background: rgba(8, 145, 178, 0.8) !important;
                    border-radius: 50% !important;
                    width: 50px !important;
                    height: 50px !important;
                    top: 50% !important;
                    transform: translateY(-50%) !important;
                    transition: all 0.3s ease !important;
                }

                .testimonial-carousel .carousel .control-arrow:hover {
                    background: rgba(8, 145, 178, 1) !important;
                    transform: translateY(-50%) scale(1.1) !important;
                }

                .testimonial-carousel .carousel .control-arrow:before {
                    border-top: 8px solid transparent !important;
                    border-bottom: 8px solid transparent !important;
                }

                .testimonial-carousel .carousel .control-prev.control-arrow:before {
                    border-right: 12px solid white !important;
                }

                .testimonial-carousel .carousel .control-next.control-arrow:before {
                    border-left: 12px solid white !important;
                }

                /* Floating Animation for Background Elements */
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }

                .animate-float {
                    animation: float 3s ease-in-out infinite;
                }

                /* Glow Effect */
                .glow {
                    box-shadow: 0 0 20px rgba(8, 145, 178, 0.5);
                }

                .glow:hover {
                    box-shadow: 0 0 30px rgba(8, 145, 178, 0.8);
                }

                /* Gradient Text */
                .gradient-text {
                    background: linear-gradient(45deg, #0891b2, #06b6d4);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    background-clip: text;
                }

                /* Smooth Scrolling */
                html {
                    scroll-behavior: smooth;
                }

                /* Custom Scrollbar */
                ::-webkit-scrollbar {
                    width: 8px;
                }

                ::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }

                ::-webkit-scrollbar-thumb {
                    background: #0891b2;
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: #0e7490;
                }

                /* Dark mode scrollbar */
                .dark ::-webkit-scrollbar-track {
                    background: #374151;
                }

                .dark ::-webkit-scrollbar-thumb {
                    background: #06b6d4;
                }

                .dark ::-webkit-scrollbar-thumb:hover {
                    background: #0891b2;
                }
            `}</style>
        </div>
    );
};

export default Homepage;