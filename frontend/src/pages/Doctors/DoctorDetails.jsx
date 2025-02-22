import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSpinner } from '../../components/SpinnerProvider';

const DoctorDetails = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const { setLoading } = useSpinner();

    useEffect(() => {
        setLoading(true);
        axios.get(`http://127.0.0.1:8000/api/doctors/${id}`)
            .then(response => {
                setDoctor(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching doctor details:', error);
                setLoading(false);
            });
    }, [id, setLoading]);

    if (!doctor) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 text-black dark:text-white flex items-center justify-center p-6">
            <div className="max-w-3xl w-full bg-white shadow-xl rounded-xl p-8 dark:bg-gray-800 transition-all">
                <div className="flex flex-col items-center">
                    <img 
                        src="https://static.vecteezy.com/system/resources/thumbnails/024/585/326/small_2x/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png.png" 
                        alt={`${doctor.FirstName} ${doctor.LastName}`} 
                        className="rounded-full w-36 h-36 object-cover border-4 border-cyan-500 shadow-md transition-all"
                    />
                    <h2 className="mt-4 text-3xl font-semibold text-gray-900 dark:text-white">
                        {doctor.FirstName} {doctor.LastName}
                    </h2>
                    <p className="text-lg text-gray-500 dark:text-gray-400">{doctor.Specialty || 'General Practitioner'}</p>
                </div>

                <div className="mt-6 space-y-4 text-gray-700 dark:text-gray-300">
                    <Info label="🏥 Hospital" value={doctor.Hospital} />
                    <Info label="📍 Address" value={doctor.Address} />
                    <Info label="👤 Gender" value={doctor.Gender} />
                    <Info label="📞 Contact" value={doctor.ContactNumber} />
                    <Info label="🎓 Education" value={doctor.Education} />
                    <Info label="⏳ Experience" value={doctor.Experience} />
                    <Info label="🗣️ Languages" value={doctor.Languages} />
                    <Info label="📆 Availability" value={doctor.Availability} />
                </div>

                <div className="mt-6 text-gray-800 dark:text-gray-300">
                    <h3 className="text-lg font-semibold text-cyan-600 dark:text-cyan-400">📜 Biography</h3>
                    <p className="text-sm mt-2">{doctor.Biography || 'No biography available.'}</p>
                </div>
            </div>
        </div>
    );
}

// eslint-disable-next-line react/prop-types
const Info = ({ label, value }) => (
    <p className="flex items-center">
        <span className="font-semibold text-gray-900 dark:text-white">{label}:</span>
        <span className="ml-2">{value || 'N/A'}</span>
    </p>
);

export default DoctorDetails;
