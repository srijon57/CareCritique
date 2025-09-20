import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";
import { BodyComponent } from "reactjs-human-body";
import CountUp from "react-countup"; // Import react-countup
import "./homepage.css";
import shuffle from "lodash/shuffle";


const Homepage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [area, setArea] = useState("");
    const [activeSearchSuggestionIndex, setActiveSearchSuggestionIndex] =
        useState(-1);
    const [activeAreaSuggestionIndex, setActiveAreaSuggestionIndex] =
        useState(-1);
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [bodyModel, setBodyModel] = useState("male");
    const [params] = useState(null);
    const [selectedBodyPart, setSelectedBodyPart] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [searchFocused, setSearchFocused] = useState(false);
    const [areaFocused, setAreaFocused] = useState(false);
    const navigate = useNavigate();
    


 const quizData = [
    {
        question: "What is the normal human body temperature?",
        options: ["36°C", "37°C", "38°C", "39°C"],
        answer: "37°C",
    },
    {
        question: "Which organ pumps blood throughout the body?",
        options: ["Lungs", "Heart", "Kidney", "Liver"],
        answer: "Heart",
    },
    {
        question: "Which vitamin is produced when skin is exposed to sunlight?",
        options: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"],
        answer: "Vitamin D",
    },
    {
        question: "Which part of the brain controls balance?",
        options: ["Cerebellum", "Cerebrum", "Medulla", "Hypothalamus"],
        answer: "Cerebellum",
    },
    {
        question: "What is the largest organ in the human body?",
        options: ["Liver", "Skin", "Heart", "Lungs"],
        answer: "Skin",
    },
    {
        question: "How many bones are in the adult human body?",
        options: ["206", "201", "210", "215"],
        answer: "206",
    },
    {
        question: "Which blood type is the universal donor?",
        options: ["O+", "O-", "AB+", "AB-"],
        answer: "O-",
    },
    {
        question: "What is the main function of red blood cells?",
        options: ["Fight infection", "Transport oxygen", "Clot blood", "Produce hormones"],
        answer: "Transport oxygen",
    },
    {
        question: "Which nutrient is essential for muscle growth?",
        options: ["Carbohydrates", "Proteins", "Fats", "Vitamins"],
        answer: "Proteins",
    },
    {
        question: "Which organ removes waste from blood?",
        options: ["Liver", "Kidney", "Lungs", "Spleen"],
        answer: "Kidney",
    },
    {
        question: "Which vitamin helps in blood clotting?",
        options: ["Vitamin A", "Vitamin D", "Vitamin K", "Vitamin E"],
        answer: "Vitamin K",
    },
    {
        question: "What is the primary function of the lungs?",
        options: ["Digest food", "Pump blood", "Exchange gases", "Store energy"],
        answer: "Exchange gases",
    },
    {
        question: "Which mineral is important for strong bones?",
        options: ["Calcium", "Iron", "Zinc", "Magnesium"],
        answer: "Calcium",
    },
    {
        question: "What is the normal resting heart rate for adults?",
        options: ["60-100 bpm", "40-60 bpm", "100-120 bpm", "120-140 bpm"],
        answer: "60-100 bpm",
    },
    {
        question: "Which organ produces insulin?",
        options: ["Pancreas", "Liver", "Kidney", "Heart"],
        answer: "Pancreas",
    },
    {
        question: "Which is the smallest bone in the human body?",
        options: ["Stapes", "Femur", "Tibia", "Humerus"],
        answer: "Stapes",
    },
    {
        question: "What protects the brain from injury?",
        options: ["Skin", "Skull", "Spine", "Ribs"],
        answer: "Skull",
    },
    {
        question: "Which cells fight infections in the body?",
        options: ["Red blood cells", "White blood cells", "Platelets", "Muscle cells"],
        answer: "White blood cells",
    },
    {
        question: "Which organ stores bile?",
        options: ["Liver", "Gallbladder", "Pancreas", "Stomach"],
        answer: "Gallbladder",
    },
    {
        question: "Which nutrient is the main source of energy?",
        options: ["Proteins", "Fats", "Carbohydrates", "Vitamins"],
        answer: "Carbohydrates",
    },
    {
    question: "Which vitamin is important for blood cell production?",
    options: ["Vitamin A", "Vitamin B12", "Vitamin C", "Vitamin D"],
    answer: "Vitamin B12",
  },
  {
    question: "What is the largest artery in the human body?",
    options: ["Pulmonary artery", "Aorta", "Carotid artery", "Femoral artery"],
    answer: "Aorta",
  },
  {
    question: "Which organ is primarily responsible for filtering toxins from blood?",
    options: ["Kidney", "Liver", "Spleen", "Lungs"],
    answer: "Liver",
  },
  {
    question: "How many chambers are there in the human heart?",
    options: ["2", "3", "4", "5"],
    answer: "4",
  },
  {
    question: "Which nutrient helps in muscle growth and repair?",
    options: ["Protein", "Carbohydrate", "Fat", "Vitamin C"],
    answer: "Protein",
  },
  {
    question: "Which vitamin is essential for strong bones?",
    options: ["Vitamin A", "Vitamin B12", "Vitamin D", "Vitamin K"],
    answer: "Vitamin D",
  },
  {
    question: "Which organ is part of both the digestive and endocrine system?",
    options: ["Liver", "Pancreas", "Stomach", "Gallbladder"],
    answer: "Pancreas",
  },
  {
    question: "Which condition is characterized by high blood sugar levels?",
    options: ["Hypertension", "Diabetes", "Anemia", "Asthma"],
    answer: "Diabetes",
  },
  {
    question: "What is the main function of red blood cells?",
    options: ["Fight infection", "Carry oxygen", "Clot blood", "Remove toxins"],
    answer: "Carry oxygen",
  },
  {
    question: "Which part of the eye is responsible for focusing light?",
    options: ["Iris", "Lens", "Cornea", "Retina"],
    answer: "Lens",
  },
];
const [quizQuestions] = useState(() =>
  quizData && quizData.length ? shuffle(quizData).slice(0, 10) : []
);
const [currentQuestion, setCurrentQuestion] = useState(0);
const [score, setScore] = useState(0);
const [selectedOption, setSelectedOption] = useState(null);
const [showScore, setShowScore] = useState(false);
const handleOptionClick = (option) => {
    setSelectedOption(option);
    if (option === quizQuestions[currentQuestion].answer) {
        setScore((prev) => prev + 1);
    }
};

const handleNextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion((prev) => prev + 1);
        setSelectedOption(null);
    } else {
        setShowScore(true);
    }
};






    const bodyPartDiseases = {
        head: {
            male: [
                "Migraine",
                "Cluster Headache",
                "Concussion",
                "Sinusitis",
                "Brain Tumor",
                "Stroke",
                "Meningitis",
            ],
            female: [
                "Migraine (Hormonal)",
                "Tension Headache",
                "Concussion",
                "Sinusitis",
                "Brain Tumor",
                "Stroke",
                "Meningitis",
                "Hormonal Imbalance Headaches",
            ],
        },
        shoulder: {
            male: [
                "Rotator Cuff Injury",
                "Frozen Shoulder",
                "Shoulder Impingement",
                "Bursitis",
                "Arthritis",
            ],
            female: [
                "Rotator Cuff Injury",
                "Frozen Shoulder",
                "Shoulder Impingement",
                "Bursitis",
                "Arthritis",
                "Osteoporosis-Related Fractures",
            ],
        },
        chest: {
            male: [
                "Heart Disease",
                "Pneumonia",
                "Asthma",
                "Bronchitis",
                "Acid Reflux",
                "Angina",
                "Lung Cancer",
            ],
            female: [
                "Heart Disease",
                "Pneumonia",
                "Asthma",
                "Bronchitis",
                "Acid Reflux",
                "Angina",
                "Breast Cancer",
                "Lung Cancer",
            ],
        },
        stomach: {
            male: [
                "Gastritis",
                "Peptic Ulcer",
                "Gallstones",
                "Pancreatitis",
                "Appendicitis",
                "Irritable Bowel Syndrome (IBS)",
            ],
            female: [
                "Gastritis",
                "Peptic Ulcer",
                "Gallstones",
                "Pancreatitis",
                "Appendicitis",
                "Irritable Bowel Syndrome (IBS)",
                "Endometriosis",
                "Ovarian Cysts",
            ],
        },
        arm: {
            male: [
                "Tennis Elbow",
                "Carpal Tunnel Syndrome",
                "Fractures",
                "Arthritis",
                "Tendonitis",
            ],
            female: [
                "Tennis Elbow",
                "Carpal Tunnel Syndrome",
                "Fractures",
                "Arthritis",
                "Tendonitis",
                "Osteoporosis-Related Fractures",
            ],
        },
        hand: {
            male: [
                "Carpal Tunnel Syndrome",
                "Arthritis",
                "Trigger Finger",
                "Ganglion Cyst",
            ],
            female: [
                "Carpal Tunnel Syndrome",
                "Arthritis",
                "Trigger Finger",
                "Ganglion Cyst",
                "Raynaud's Disease",
            ],
        },
        leg: {
            male: [
                "Varicose Veins",
                "Deep Vein Thrombosis (DVT)",
                "Arthritis",
                "Fractures",
                "Sciatica",
            ],
            female: [
                "Varicose Veins",
                "Deep Vein Thrombosis (DVT)",
                "Arthritis",
                "Fractures",
                "Sciatica",
                "Osteoporosis-Related Fractures",
            ],
        },
        foot: {
            male: [
                "Plantar Fasciitis",
                "Gout",
                "Bunions",
                "Athlete's Foot",
                "Flat Feet",
            ],
            female: [
                "Plantar Fasciitis",
                "Gout",
                "Bunions",
                "Athlete's Foot",
                "Flat Feet",
                "Osteoporosis-Related Fractures",
            ],
        },
    };

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
            axios
                .get(`${import.meta.env.VITE_BACKEND}/api/doctors`)
                .catch(() => ({ data: [] })),
            axios
                .get(`${import.meta.env.VITE_BACKEND}/api/hospitals`)
                .catch(() => ({ data: [] })),
        ]).then(([doctorsResponse, hospitalsResponse]) => {
            if (Array.isArray(doctorsResponse.data)) {
                const filteredDoctors = doctorsResponse.data
                    .map((doctor) => ({
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
        const filteredSuggestions = searchSuggestionsData.filter((suggestion) =>
            suggestion.Name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        if (e.key === "ArrowDown") {
            setActiveSearchSuggestionIndex((prevIndex) =>
                prevIndex < filteredSuggestions.length - 1
                    ? prevIndex + 1
                    : prevIndex
            );
        } else if (e.key === "ArrowUp") {
            setActiveSearchSuggestionIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : 0
            );
        } else if (e.key === "Enter") {
            if (
                activeSearchSuggestionIndex >= 0 &&
                filteredSuggestions[activeSearchSuggestionIndex]
            ) {
                const selectedSuggestion =
                    filteredSuggestions[activeSearchSuggestionIndex];
                setSearchQuery(selectedSuggestion.Name);
                navigate(`/doctors?search=${selectedSuggestion.Name}`);
            }
        }
    };

    const handleAreaKeyDown = (e) => {
        const filteredSuggestions = areaSuggestionsData.filter((suggestion) =>
            suggestion.HospitalArea.toLowerCase().includes(area.toLowerCase())
        );
        if (e.key === "ArrowDown") {
            setActiveAreaSuggestionIndex((prevIndex) =>
                prevIndex < filteredSuggestions.length - 1
                    ? prevIndex + 1
                    : prevIndex
            );
        } else if (e.key === "ArrowUp") {
            setActiveAreaSuggestionIndex((prevIndex) =>
                prevIndex > 0 ? prevIndex - 1 : 0
            );
        } else if (e.key === "Enter") {
            if (
                activeAreaSuggestionIndex >= 0 &&
                filteredSuggestions[activeAreaSuggestionIndex]
            ) {
                const selectedSuggestion =
                    filteredSuggestions[activeAreaSuggestionIndex];
                setArea(selectedSuggestion.HospitalArea);
                navigate(`/hospitals?area=${selectedSuggestion.HospitalArea}`);
            }
        }
    };

    const handleSearch = () => {
        if (searchQuery) navigate(`/doctors?search=${searchQuery}`);
        if (area) navigate(`/hospitals?area=${area}`);
    };

    const handleDoctorLearnMore = (doctorId) =>
        navigate(`/doctors/${doctorId}`);
    const handleHospitalLearnMore = (hospitalId) =>
        navigate(`/hospitals/${hospitalId}`);

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
                    <p className="text-cyan-800 dark:text-white text-lg font-semibold">
                        Loading Healthcare Services...
                    </p>
                </div>
            </div>
        );
    }
   
    return (
        <div className="bg-blue-50 dark:bg-gray-900 min-h-screen font-sans overflow-hidden">
            {/* Hero Section with Enhanced Animations */}
            <section className="bg-gradient-to-r from-cyan-700 to-cyan-600 text-white py-20 dark:from-black dark:to-cyan-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full animate-pulse"></div>
                    <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full animate-bounce delay-1000"></div>
                    <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white rounded-full animate-ping delay-2000"></div>
                    <div className="absolute bottom-32 right-1/3 w-8 h-8 bg-white rounded-full animate-pulse delay-3000"></div>
                </div>

                <div className="container mx-auto text-center relative z-10">
                    <h1 className="text-5xl font-bold mb-4 animate-fade-in-up">
                        Find the Best Healthcare Providers
                    </h1>
                    <p className="text-xl mb-8 animate-fade-in-up delay-200">
                        Your health is our priority. Search for doctors,
                        hospitals, and specialists near you.
                    </p>

                    <div className="flex justify-center items-center gap-4 animate-fade-in-up delay-300">
                        <div className="relative w-1/3">
                            <input
                                type="text"
                                placeholder="Specialty, Condition or Procedure"
                                className={`p-3 border-2 border-white rounded w-full focus:outline-none focus:ring-4 focus:ring-cyan-300 text-white dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all duration-300 transform ${
                                    searchFocused
                                        ? "scale-105 shadow-2xl"
                                        : "hover:scale-102 shadow-lg"
                                }`}
                                value={searchQuery}
                                onChange={handleSearchChange}
                                onKeyDown={handleSearchKeyDown}
                                onFocus={() => setSearchFocused(true)}
                                onBlur={() => setSearchFocused(false)}
                            />
                            {searchQuery.length > 2 && (
                                <ul className="absolute z-10 bg-white dark:bg-gray-800 w-full mt-1 rounded-lg shadow-2xl animate-fade-in-down border border-gray-200 dark:border-gray-700">
                                    {searchSuggestionsData
                                        .filter((suggestion) =>
                                            suggestion.Name.toLowerCase().includes(
                                                searchQuery.toLowerCase()
                                            )
                                        )
                                        .map((suggestion, index) => (
                                            <li
                                                key={index}
                                                className={`p-3 cursor-pointer text-gray-800 dark:text-white transition-all duration-200 transform hover:scale-102 ${
                                                    index ===
                                                    activeSearchSuggestionIndex
                                                        ? "bg-cyan-100 dark:bg-cyan-700 shadow-md"
                                                        : "hover:bg-cyan-50 dark:hover:bg-cyan-600"
                                                }`}
                                                onClick={() => {
                                                    setSearchQuery(
                                                        suggestion.Name
                                                    );
                                                    navigate(
                                                        `/doctors?search=${suggestion.Name}`
                                                    );
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
                                className={`p-3 border-2 border-white rounded w-full focus:outline-none focus:ring-4 focus:ring-cyan-300 text-white dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all duration-300 transform ${
                                    areaFocused
                                        ? "scale-105 shadow-2xl"
                                        : "hover:scale-102 shadow-lg"
                                }`}
                                value={area}
                                onChange={handleAreaChange}
                                onKeyDown={handleAreaKeyDown}
                                onFocus={() => setAreaFocused(true)}
                                onBlur={() => setAreaFocused(false)}
                            />
                            {area.length > 2 && (
                                <ul className="absolute z-10 bg-white dark:bg-gray-800 w-full mt-1 rounded-lg shadow-2xl animate-fade-in-down border border-gray-200 dark:border-gray-700">
                                    {areaSuggestionsData
                                        .filter((suggestion) =>
                                            suggestion.HospitalArea.toLowerCase().includes(
                                                area.toLowerCase()
                                            )
                                        )
                                        .map((suggestion, index) => (
                                            <li
                                                key={index}
                                                className={`p-3 cursor-pointer text-gray-800 dark:text-white transition-all duration-200 transform hover:scale-102 ${
                                                    index ===
                                                    activeAreaSuggestionIndex
                                                        ? "bg-cyan-100 dark:bg-cyan-700 shadow-md"
                                                        : "hover:bg-cyan-50 dark:hover:bg-cyan-600"
                                                }`}
                                                onClick={() => {
                                                    setArea(
                                                        suggestion.HospitalArea
                                                    );
                                                    navigate(
                                                        `/hospitals?area=${suggestion.HospitalArea}`
                                                    );
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
                <h2 className="text-4xl font-bold mb-8 text-cyan-800 text-center dark:text-white animate-fade-in-up">
                    Featured Doctors
                </h2>
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
                                <div className="absolute inset-0 rounded-full bg-cyan-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                            </div>
                            <h4 className="text-xl font-bold text-cyan-800 dark:text-white mb-2 transform hover:scale-105 transition-transform duration-200">
                                {doctor.firstName} {doctor.lastName}
                            </h4>
                            <p className="text-gray-500 dark:text-gray-400 mb-4">
                                {doctor.specialty}
                            </p>
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

            {/* Animated Counter Section with react-countup */}
            <section className=" py-12 animate-fade-in-up">
                <h2 className="text-4xl font-bold mb-8 text-cyan-800 text-center dark:text-white">
                    Our Impact
                </h2>
                <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: "👨‍⚕️",
                            title: "Total Doctors",
                            end: 150, // Target count
                            color: "from-cyan-400 to-blue-500",
                        },
                        {
                            icon: "🏥",
                            title: "Total Hospitals",
                            end: 50, // Target count
                            color: "from-teal-400 to-cyan-500",
                        },
                        {
                            icon: "🩺",
                            title: "Total Patients",
                            end: 10000, // Target count
                            color: "from-blue-400 to-indigo-500",
                        },
                    ].map((item, index) => (
                        <div
                            key={index}
                            className={`bg-white dark:bg-gray-800 rounded-xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 animate-fade-in-up`}
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <div
                                className={`w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl mb-4 mx-auto transform hover:scale-110 transition-transform duration-300 shadow-lg`}
                            >
                                {item.icon}
                            </div>
                            <h3 className="text-xl font-bold text-cyan-800 dark:text-white mb-2">
                                {item.title}
                            </h3>
                            <p className="text-3xl font-semibold text-gray-700 dark:text-gray-200">
                                <CountUp
                                    start={0}
                                    end={item.end}
                                    duration={2}
                                    separator=","
                                    enableScrollSpy={true}
                                    scrollSpyDelay={200}
                                />
                                <span className="text-2xl ml-1 text-cyan-600 dark:text-cyan-600">+</span>
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Enhanced Testimonials Carousel */}
            <section className="bg-blue-50 py-12 dark:bg-gray-900 animate-fade-in-up">
                <h2 className="text-4xl font-bold mb-8 text-cyan-800 text-center dark:text-white">
                    What Our Patients Say
                </h2>
                <div className="container mx-auto">
                    <Carousel
                        showArrows={true}
                        infiniteLoop={true}
                        showThumbs={false}
                        showStatus={false}
                        autoPlay={true}
                        interval={10000}
                        className="testimonial-carousel"
                    >
                        <div className="p-8 text-center bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl mx-4 transform hover:scale-105 transition-all duration-300 shadow-lg">
                            <p className="text-gray-700 text-lg mb-6 dark:text-gray-400 italic">
                                ``আমার জীবনের সেরা স্বাস্থ্যসেবার অভিজ্ঞতা।
                                ডাক্তাররা খুবই পেশাদার এবং যত্নশীল ছিলেন।``
                            </p>
                            <p className="text-cyan-800 font-bold text-lg dark:text-white">
                                - সাদিক রহমান
                            </p>
                        </div>
                        <div className="p-8 text-center bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl mx-4 transform hover:scale-105 transition-all duration-300 shadow-lg">
                            <p className="text-gray-700 text-lg mb-6 dark:text-gray-400 italic">
                                ``আমার অবস্থার জন্য আমি নিখুঁত বিশেষজ্ঞ খুঁজে
                                পেয়েছি। পরিষেবাটি দুর্দান্ত ছিল!``
                            </p>
                            <p className="text-cyan-800 font-bold text-lg dark:text-white">
                                - কাজী কামরুদ্দিন আহমেদ
                            </p>
                        </div>
                        <div className="p-8 text-center bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl mx-4 transform hover:scale-105 transition-all duration-300 shadow-lg">
                            <p className="text-gray-700 text-lg mb-6 dark:text-gray-400 italic">
                                ``Highly recommend this platform for finding
                                top-notch healthcare providers.``
                            </p>
                            <p className="text-cyan-800 font-bold text-lg dark:text-white">
                                - Srabani Mitra
                            </p>
                        </div>
                    </Carousel>
                </div>
            </section>

            {/* Enhanced Health Tips Section */}
            <section className="container mx-auto p-6">
                <h2 className="text-4xl font-bold mb-8 text-cyan-800 text-center dark:text-white animate-fade-in-up">
                    Health Tips
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: "💧",
                            title: "Stay Hydrated",
                            content:
                                "Drinking enough water is essential for maintaining good health. Aim for at least 8 glasses a day.",
                            color: "from-blue-400 to-cyan-500",
                        },
                        {
                            icon: "🏃‍♂️",
                            title: "Exercise Regularly",
                            content:
                                "Regular physical activity can help you maintain a healthy weight and reduce the risk of chronic diseases.",
                            color: "from-green-400 to-teal-500",
                        },
                        {
                            icon: "🥗",
                            title: "Eat a Balanced Diet",
                            content:
                                "A balanced diet rich in fruits, vegetables, and whole grains is key to maintaining good health.",
                            color: "from-orange-400 to-red-500",
                        },
                    ].map((tip, index) => (
                        <div
                            key={index}
                            className={`bg-white shadow-lg rounded-xl p-6 hover:shadow-2xl transition-all duration-500 dark:bg-gray-800 dark:text-white transform hover:-translate-y-3 hover:scale-105 animate-fade-in-up group cursor-pointer`}
                            style={{ animationDelay: `${index * 150}ms` }}
                        >
                            <div
                                className={`w-16 h-16 rounded-full bg-gradient-to-br ${tip.color} flex items-center justify-center text-2xl mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                            >
                                {tip.icon}
                            </div>
                            <h3 className="text-xl font-bold text-cyan-800 mb-3 dark:text-white text-center group-hover:text-cyan-600 transition-colors duration-300">
                                {tip.title}
                            </h3>
                            <p className="text-gray-700 dark:text-gray-400 text-center leading-relaxed">
                                {tip.content}
                            </p>
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
                            bodyModel === "male"
                                ? "bg-cyan-800 text-white shadow-lg"
                                : "bg-gray-200 text-cyan-800 hover:bg-cyan-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                        }`}
                        onClick={() => setBodyModel("male")}
                    >
                        🚹 Male Model
                    </button>
                    <button
                        className={`py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-cyan-300 ${
                            bodyModel === "female"
                                ? "bg-cyan-800 text-white shadow-lg"
                                : "bg-gray-200 text-cyan-800 hover:bg-cyan-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                        }`}
                        onClick={() => setBodyModel("female")}
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
                            🔍 Possible Diseases in{" "}
                            {selectedBodyPart.replace("_", " ").toUpperCase()}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {bodyPartDiseases[selectedBodyPart]?.[
                                bodyModel
                            ]?.map((disease, index) => (
                                <div
                                    key={index}
                                    className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-102"
                                >
                                    <span className="text-gray-800 dark:text-gray-200 font-medium">
                                        • {disease}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* Enhanced Emergency Section */}
            <section className="text-center my-12 animate-fade-in-up">
                <a
                    href="tel:999"
                    className="bg-red-600 text-white py-6 px-12 text-2xl font-bold rounded-xl hover:bg-red-500 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-red-700 dark:hover:bg-red-600 transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-2xl animate-pulse block w-fit mx-auto"
                >
                    🚨 Emergency - Call 999
                </a>
                <p className="mt-3 text-gray-600 dark:text-gray-400">
                    Available 24/7 for medical emergencies
                </p>
            </section>
            <section className="container mx-auto p-6 my-12 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-gray-800 dark:to-gray-700 rounded-xl shadow-lg animate-fade-in-up">
    <h2 className="text-4xl font-bold mb-6 text-cyan-800 dark:text-white text-center">
        📝 Health Quiz
    </h2>
    {!showScore ? (
        <div className="text-center">
            <h3 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                Question {currentQuestion + 1} of {quizQuestions.length}
            </h3>
            <p className="text-lg mb-6 text-gray-700 dark:text-gray-300">
                {quizQuestions[currentQuestion].question}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shuffle(quizQuestions[currentQuestion].options).map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleOptionClick(option)}
                        className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all duration-300 ${
                            selectedOption === option
                                ? option === quizQuestions[currentQuestion].answer
                                    ? "bg-green-500 text-white border-green-600"
                                    : "bg-red-500 text-white border-red-600"
                                : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-800 dark:text-white hover:bg-cyan-100 dark:hover:bg-cyan-600"
                        }`}
                        disabled={!!selectedOption}
                    >
                        {option}
                    </button>
                ))}
            </div>
            {selectedOption && (
                <button
                    onClick={handleNextQuestion}
                    className="mt-6 py-3 px-6 bg-cyan-800 text-white rounded-lg hover:bg-cyan-700 transition-all duration-300 font-semibold"
                >
                    {currentQuestion === quizQuestions.length - 1
                        ? "See Score"
                        : "Next Question"}
                </button>
            )}
        </div>
    ) : (
        <div className="text-center">
            <h3 className="text-2xl font-bold mb-4 text-cyan-800 dark:text-white">
                🎉 Your Score: {score} / {quizQuestions.length}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
                {score === quizQuestions.length
                    ? "Excellent! You got all questions correct."
                    : score >= quizQuestions.length / 2
                    ? "Good job! Keep learning."
                    : "Better luck next time! Keep practicing."}
            </p>
            <button
                onClick={() => {
                    setScore(0);
                    setCurrentQuestion(0);
                    setShowScore(false);
                    setSelectedOption(null);
                }}
                className="mt-6 py-3 px-6 bg-cyan-800 text-white rounded-lg hover:bg-cyan-700 transition-all duration-300 font-semibold"
            >
                🔄 Retry Quiz
            </button>
        </div>
    )}
</section>

            {/* Enhanced Top Hospitals Section */}
            <section className="container mx-auto p-6 mb-9">
                <h2 className="text-4xl font-bold mb-8 text-cyan-800 text-center dark:text-white animate-fade-in-up">
                    🏥 Top Hospitals
                </h2>
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
                            <h5 className="text-xl font-bold text-cyan-800 dark:text-white mb-4 transform group-hover:scale-105 transition-transform duration-200">
                                {hospital.Name}
                            </h5>
                            <button
                                className="bg-cyan-800 text-white py-3 px-6 mt-4 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-4 focus:ring-cyan-300 dark:bg-cyan-700 dark:hover:bg-cyan-600 transition-all duration-300 transform hover:scale-110 active:scale-95 font-semibold shadow-lg hover:shadow-xl"
                                onClick={() =>
                                    handleHospitalLearnMore(hospital.HospitalID)
                                }
                            >
                                🏥 Learn More
                            </button>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Homepage;