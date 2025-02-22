import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const HospitalDetails = () => {
    const { id } = useParams();
    const [hospital, setHospital] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://127.0.0.1:8000/api/hospitals/${id}`)
            .then(response => {
                setHospital(response.data);
            })
            .catch(error => {
                console.error('Error fetching hospital details:', error);
                setError('Failed to fetch hospital details. Please try again later.');
            });
    }, [id]);

    if (error) {
        return <div className="text-red-500 text-center mt-6">{error}</div>;
    }

    if (!hospital) {
        return <div className="text-center text-gray-500 dark:text-gray-400 mt-10">Loading...</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
            <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl p-6 max-w-2xl w-full">
                
                {/* Hospital Image */}
                <img 
                    src="https://static.vecteezy.com/system/resources/previews/038/252/707/non_2x/hospital-building-illustration-medical-clinic-isolated-on-white-background-vector.jpg" 
                    alt={hospital.Name} 
                    className="w-full h-60 object-cover rounded-lg shadow-md"
                />

                {/* Hospital Info */}
                <h2 className="text-3xl font-semibold text-center text-cyan-800 dark:text-white mt-4">
                    {hospital.Name}
                </h2>

                <div className="mt-4 space-y-2 text-gray-600 dark:text-gray-400">
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">📍 Address:</span> {hospital.Address}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">📞 Contact:</span> {hospital.ContactNumber}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">🏥 Area:</span> {hospital.HospitalArea}</p>
                    <p><span className="font-medium text-gray-700 dark:text-gray-300">🌆 City:</span> {hospital.HospitalCity}</p>
                </div>

                {/* Back Button */}
                <div className="mt-6 flex justify-center">
                    <button 
                        onClick={() => window.history.back()} 
                        className="bg-cyan-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-cyan-600 transition-all"
                    >
                        ← Go Back
                    </button>
                </div>

            </div>
        </div>
    );
}

export default HospitalDetails;
