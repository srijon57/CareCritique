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
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-pulse text-gray-600 dark:text-gray-300 text-xl">Loading doctor profile...</div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 text-black dark:text-white p-4 md:p-6">
      {/* Header with back button */}
      <div className="max-w-4xl mx-auto mb-6">
        <button 
          onClick={() => window.history.back()} 
          className="flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors"
        >
          <span className="mr-2">←</span>
          <span className="font-medium">Back to Doctors</span>
        </button>
      </div>
      
      <div className="max-w-4xl mx-auto">
        {/* Main card */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden dark:bg-gray-800 transition-all">
          {/* Header banner */}
          <div className="h-32 bg-gradient-to-r from-cyan-500 to-blue-500"></div>
          
          {/* Profile section */}
          <div className="px-8 pt-0 pb-8">
            {/* Avatar */}
            <div className="flex flex-col md:flex-row md:items-end mb-6">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/024/585/326/small_2x/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png.png"
                alt={`${doctor.FirstName} ${doctor.LastName}`}
                className="rounded-full w-32 h-32 object-cover border-4 border-white dark:border-gray-800 shadow-md transition-all"
              />
              <div className="md:ml-6 mt-4 md:mt-0">
                <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
                  Dr. {doctor.FirstName} {doctor.LastName}
                </h2>
                <p className="text-lg text-gray-500 dark:text-gray-400">{doctor.Specialty || 'General Practitioner'}</p>
              </div>
              
              {/* Action buttons */}
              <div className="flex gap-2 mt-4 md:mt-0 md:ml-auto">
                <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center shadow-md transition-all">
                  <span className="mr-2">📅</span>
                  Book Appointment
                </button>
                <button className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white rounded-lg flex items-center shadow-md transition-all">
                  <span className="mr-2">💬</span>
                  Message
                </button>
              </div>
            </div>
            
            {/* Content area */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column - Info */}
              <div className="space-y-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-cyan-600 dark:text-cyan-400 border-b border-gray-200 dark:border-gray-600 pb-2">
                    Doctor Information
                  </h3>
                  <div className="space-y-4">
                    <Info label="🏥 Hospital" value={doctor.Hospital} />
                    <Info label="📍 Address" value={doctor.Address} />
                    <Info label="📞 Contact" value={doctor.ContactNumber} />
                    <Info label="👤 Gender" value={doctor.Gender} />
                  </div>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-cyan-600 dark:text-cyan-400 border-b border-gray-200 dark:border-gray-600 pb-2">
                    Qualifications
                  </h3>
                  <div className="space-y-4">
                    <Info label="🎓 Education" value={doctor.Education} />
                    <Info label="⏳ Experience" value={doctor.Experience} />
                    <Info label="🗣️ Languages" value={doctor.Languages} />
                    <Info label="📆 Availability" value={doctor.Availability} />
                  </div>
                </div>
              </div>
              
              {/* Right column - Biography */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 h-full">
                <h3 className="text-xl font-semibold mb-4 text-cyan-600 dark:text-cyan-400 border-b border-gray-200 dark:border-gray-600 pb-2">
                  📜 Biography
                </h3>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {doctor.Biography || 'No biography available.'}
                  </p>
                </div>
                
                {/* Reviews section */}
                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 text-cyan-600 dark:text-cyan-400 border-b border-gray-200 dark:border-gray-600 pb-2">
                    Patient Reviews
                  </h3>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        ★★★★★
                      </div>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">5.0 (24 reviews)</span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 italic">
                      "Dr. {doctor.LastName} was very professional and thorough with my examination.
                      I felt heard and cared for during my visit."
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">- John D., 2 weeks ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Using your original Info component
const Info = ({ label, value }) => (
  <p className="flex items-center">
    <span className="font-semibold text-gray-900 dark:text-white">{label}:</span>
    <span className="ml-2 text-gray-700 dark:text-gray-300">{value || 'N/A'}</span>
  </p>
);

export default DoctorDetails;
