import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const GulshanHospitalsList = () => {
    const [hospitals, setHospitals] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:8000/api/hospitals");
            if (Array.isArray(response.data)) {
                const filteredHospitals = response.data.filter(hospital => hospital.HospitalArea?.toLowerCase() === "gulshan");
                setHospitals(filteredHospitals);
            } else {
                setError("Failed to fetch hospitals. Please try again later.");
            }
        } catch (error) {
            setError("Failed to fetch hospitals. Please try again later.");
        }
    };

    if (error) {
        return <div className="text-red-500 text-center mt-6">{error}</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-black dark:text-white flex flex-col items-center p-6">
            <h2 className="text-4xl font-bold mb-8 text-cyan-800 dark:text-white">Hospitals in Gulshan</h2>

            <div className="flex flex-col gap-6 w-full max-w-5xl">
                {hospitals.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center">No hospitals found in Gulshan.</p>
                ) : (
                    hospitals.map(hospital => (
                        <div key={hospital.HospitalID} className="bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6 flex items-center gap-6 transition-all hover:shadow-2xl dark:hover:shadow-xl w-full">
                            <img
                                src="https://static.vecteezy.com/system/resources/previews/038/252/707/non_2x/hospital-building-illustration-medical-clinic-isolated-on-white-background-vector.jpg"
                                alt={hospital.Name}
                                className="rounded-lg w-44 h-44 object-cover"
                            />
                            <div className="flex-1">
                                <h5 className="text-2xl font-semibold text-cyan-800 dark:text-white">{hospital.Name}</h5>
                                <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                                    {hospital.HospitalArea}, {hospital.HospitalCity}
                                </p>
                                <Link to={`/hospitals/${hospital.HospitalID}`} className="mt-3 inline-block bg-cyan-800 text-white py-2 px-5 rounded-lg hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:bg-cyan-700 dark:hover:bg-cyan-600">
                                    View Profile
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default GulshanHospitalsList;
