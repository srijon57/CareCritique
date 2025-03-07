import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
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
    }, [isAuthenticated, userType, navigate, enqueueSnackbar, loading]);

    const fetchAppointments = async () => {
        setLoading(true); // Start loading spinner
        try {
            const endpoint = userType === 'Doctor' ? '/doctor/appointments' : '/patient/appointments';
            const response = await api.get(endpoint, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setAppointments(response.data.appointments);
        } catch (error) {
            enqueueSnackbar('Failed to fetch appointments', { variant: 'error' });
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };

    if (loading) {
        return <div>Loading...</div>; // Show a loading indicator while checking authentication
    }

    return (
        <div className="w-full min-h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-4">
            <h1 className="text-3xl font-bold mb-6 text-cyan-800 dark:text-cyan-200">
                {userType === 'Doctor' ? 'Your Scheduled Appointments' : 'Your Appointments'}
            </h1>

            {/* Existing Appointments */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4 text-cyan-800 dark:text-cyan-200">
                    {userType === 'Doctor' ? 'Patient Appointments' : 'Your Appointments'}
                </h2>
                {appointments.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400">
                        {userType === 'Doctor' ? 'No appointments scheduled.' : 'No appointments booked yet.'}
                    </p>
                ) : (
                    <ul className="space-y-4">
                        {appointments.map((appointment) => (
                            <li key={appointment.AppointmentID} className="border-b pb-2">
                                {userType === 'Doctor' ? (
                                    <>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <strong>Patient:</strong> {appointment.patient.FirstName} {appointment.patient.LastName}
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <strong>Doctor:</strong> {appointment.doctor.FirstName} {appointment.doctor.LastName}
                                        </p>
                                        <p className="text-gray-700 dark:text-gray-300">
                                            <strong>Specialty:</strong> {appointment.doctor.Specialty}
                                        </p>
                                    </>
                                )}
                                <p className="text-gray-700 dark:text-gray-300">
                                    <strong>Date:</strong> {appointment.Date}
                                </p>
                                <p className="text-gray-700 dark:text-gray-300">
                                    <strong>Time:</strong> {appointment.Time}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default Appointments;
