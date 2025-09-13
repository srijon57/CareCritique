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
        return id; // keep as-is for head, chest, etc.
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
        axios.get(`${import.meta.env.VITE_BACKEND}/api/doctors`)
            .then(response => {
                if (Array.isArray(response.data)) {
                    const filteredDoctors = response.data
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
            })
            .catch(error => {
                console.error("Error fetching doctors:", error);
            });

        axios.get(`${import.meta.env.VITE_BACKEND}/api/hospitals`)
            .then(response => {
                if (Array.isArray(response.data)) {
                    setHospitals(response.data.slice(0, 4));
                }
            })
            .catch(error => {
                console.error("Error fetching hospitals:", error);
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
                            {searchQuery.length > 2 && (
                                <ul className="absolute z-10 bg-white dark:bg-gray-800 w-full mt-1 rounded-lg shadow-lg">
                                    {searchSuggestionsData
                                        .filter(suggestion =>
                                            suggestion.Name.toLowerCase().includes(searchQuery.toLowerCase())
                                        )
                                        .map((suggestion, index) => (
                                            <li
                                                key={index}
                                                className={`p-2 cursor-pointer ${
                                                    index === activeSearchSuggestionIndex
                                                        ? "bg-cyan-100 dark:bg-cyan-700"
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
                        <div className="flex justify-center items-center gap-4">
                            <input
                                type="text"
                                placeholder="Dhanmondi, Dhaka"
                                className="p-3 border-2 border-white rounded w-full focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                                value={area}
                                onChange={handleAreaChange}
                                onKeyDown={handleAreaKeyDown}
                            />
                            {area.length > 2 && (
                                <ul className="absolute z-10 bg-white dark:bg-gray-800 w-full mt-1 rounded-lg shadow-lg">
                                    {areaSuggestionsData
                                        .filter(suggestion =>
                                            suggestion.HospitalArea.toLowerCase().includes(area.toLowerCase())
                                        )
                                        .map((suggestion, index) => (
                                            <li
                                                key={index}
                                                className={`p-2 cursor-pointer ${
                                                    index === activeAreaSuggestionIndex
                                                        ? "bg-cyan-100 dark:bg-cyan-700"
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
                    {doctors.map(doctor => (
                        <div key={doctor.id} className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-white dark:hover:shadow-2xl">
                            <img src="https://i.pinimg.com/originals/53/e1/f9/53e1f9601fd784835e67a54f858d0c5e.png" alt={`${doctor.firstName} ${doctor.lastName}`} className="mx-auto mb-4 rounded-full w-32 h-32 object-cover" />
                            <h4 className="text-xl font-bold text-cyan-800 dark:text-white">{doctor.firstName} {doctor.lastName}</h4>
                            <p className="text-gray-500 dark:text-gray-400">{doctor.specialty}</p>
                            <button
                                className="bg-cyan-800 text-white py-2 px-4 mt-4 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600"
                                onClick={() => handleDoctorLearnMore(doctor.id)}
                            >
                                View Profile
                            </button>
                        </div>
                    ))}
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

            {/* Human Body UI Section */}
            <section className="container mx-auto p-6 text-center">
                <h2 className="text-4xl font-bold mb-8 text-cyan-800 dark:text-white">
                    Explore Human Body
                </h2>
                <div className="flex justify-center gap-4 mb-6">
                    <button
                        className="bg-cyan-800 text-white py-2 px-4 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600"
                        onClick={() => setBodyModel('male')}
                    >
                        Male Model
                    </button>
                    <button
                        className="bg-cyan-800 text-white py-2 px-4 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600"
                        onClick={() => setBodyModel('female')}
                    >
                        Female Model
                    </button>
                </div>
                <div className="flex justify-center">
                    <div className="w-full max-w-md">
                        <BodyComponent
                            partsInput={params}
                            bodyModel={bodyModel}
                            onChange={onChange}
                            onClick={onClick}
                        />
                    </div>
                </div>
                {selectedBodyPart && (
                    <div className="mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
                        <h3 className="text-xl font-bold text-cyan-800 dark:text-white mb-2">
                            Possible Diseases can couse in {selectedBodyPart.replace('_', ' ')}
                        </h3>
                        <ul className="list-disc pl-5 text-gray-700 dark:text-gray-400">
                            {bodyPartDiseases[selectedBodyPart]?.[bodyModel]?.map((disease, index) => (
                                <li key={index}>{disease}</li>
                            ))}
                        </ul>
                    </div>
                )}
            </section>

            {/* Emergency Section */}
            <section className="text-center my-12">
                <button className="bg-red-600 text-white py-4 px-8 text-2xl rounded hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600">Emergency - Call 999</button>
            </section>

            {/* Top Hospitals Section */}
            <section className="container mx-auto p-6">
                <h2 className="text-4xl font-bold mb-8 text-cyan-800 text-center dark:text-white">Top Hospitals</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {hospitals.map(hospital => (
                        <div key={hospital.HospitalID} className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300 dark:bg-gray-800 dark:text-white dark:hover:shadow-2xl">
                            <img src="https://static.vecteezy.com/system/resources/previews/038/252/707/non_2x/hospital-building-illustration-medical-clinic-isolated-on-white-background-vector.jpg" alt={hospital.Name} className="mx-auto mb-4 rounded-lg w-full h-48 object-cover" />
                            <h5 className="text-xl font-semibold text-cyan-800 dark:text-white">{hospital.Name}</h5>
                            <button
                                className="bg-cyan-800 text-white py-2 px-4 mt-4 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600"
                                onClick={() => handleHospitalLearnMore(hospital.HospitalID)}
                            >
                                Learn More
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Homepage;
