import { useState, useEffect } from 'react';
import { useAuth } from '../../context/Authcontext';
import api from '../../services/api';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { useSpinner } from '../../components/SpinnerProvider';

const Appointments = () => {
    const { isAuthenticated, accessToken, userType, loading } = useAuth();
    const { enqueueSnackbar } = useSnackbar();
    const navigate = useNavigate();
    const { setLoading } = useSpinner();

    const [appointments, setAppointments] = useState([]);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            enqueueSnackbar('Please login to view appointments', { variant: 'warning' });
            navigate('/login');
            return;
        }
        if (isAuthenticated) {
            fetchAppointments();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, userType, navigate, enqueueSnackbar, loading]);

    const fetchAppointments = async () => {
        setLoading(true); // Start loading spinner
        try {
            const endpoint = userType === 'Doctor' ? '/doctor/appointments' : '/patient/appointments';
            const response = await api.get(endpoint, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setAppointments(response.data.appointments);
        // eslint-disable-next-line no-unused-vars
        } catch (error) {
            enqueueSnackbar('Failed to fetch appointments', { variant: 'error' });
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };

    // const handleCancelAppointment = (appointmentId) => {
    //     // Placeholder for cancel functionality
    //     enqueueSnackbar(`Cancel appointment ${appointmentId} (Not implemented)`, { variant: 'info' });
    // };

    // const handleRescheduleAppointment = (appointmentId) => {
    //     // Placeholder for reschedule functionality
    //     enqueueSnackbar(`Reschedule appointment ${appointmentId} (Not implemented)`, { variant: 'info' });
    // };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 dark:border-cyan-400 mx-auto mb-4"></div>
                    <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">Loading Appointments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-4xl font-bold text-center text-cyan-800 dark:text-cyan-200 mb-8 animate-fade-in-up">
                    {userType === 'Doctor' ? 'Your Scheduled Appointments' : 'Your Appointments'}
                </h1>

                {/* Existing Appointments */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                    {appointments.length === 0 ? (
                        <div className="text-center py-12">
                            <svg
                                className="mx-auto h-24 w-24 text-gray-400 dark:text-gray-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={1.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            <p className="mt-4 text-lg font-medium text-gray-600 dark:text-gray-400">
                                {userType === 'Doctor' ? 'No appointments scheduled.' : 'No appointments booked yet.'}
                            </p>
                            <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                                {userType === 'Doctor'
                                    ? 'Check back later for new appointments.'
                                    : 'Book an appointment with a doctor today!'}
                            </p>
                            {userType !== 'Doctor' && (
                                <button
                                    onClick={() => navigate('/doctors')}
                                    className="mt-4 inline-flex items-center px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
                                >
                                    Find a Doctor
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {appointments.map((appointment, index) => (
                                <div
                                    key={appointment.AppointmentID}
                                    className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 animate-fade-in-up"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            {userType === 'Doctor' ? (
                                                <>
                                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                                        Patient: {appointment.patient.FirstName} {appointment.patient.LastName}
                                                    </h3>
                                                </>
                                            ) : (
                                                <>
                                                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                                                        Dr. {appointment.doctor.FirstName} {appointment.doctor.LastName}
                                                    </h3>
                                                    <p className="text-sm text-cyan-600 dark:text-cyan-400">
                                                        {appointment.doctor.Specialty}
                                                    </p>
                                                </>
                                            )}
                                            <div className="mt-2 space-y-1">
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    <strong>Date:</strong> {new Date(appointment.Date).toLocaleDateString()}
                                                </p>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">
                                                    <strong>Time:</strong> {appointment.Time}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-full">
                                            <svg
                                                className="h-6 w-6 text-cyan-600 dark:text-cyan-400"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                strokeWidth={1.5}
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                    {/* <div className="mt-4 flex gap-3">
                                        <button
                                            onClick={() => handleRescheduleAppointment(appointment.AppointmentID)}
                                            className="flex-1 px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                        >
                                            Reschedule
                                        </button>
                                        <button
                                            onClick={() => handleCancelAppointment(appointment.AppointmentID)}
                                            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
                                        >
                                            Cancel
                                        </button>
                                    </div> */}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Appointments;