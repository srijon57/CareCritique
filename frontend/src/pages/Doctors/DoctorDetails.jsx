import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSpinner } from '../../components/SpinnerProvider';
import { useAuth } from '../../context/AuthContext';
import { MdVerified } from "react-icons/md";
import { VscUnverified } from "react-icons/vsc";

const DoctorDetails = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [editingReview, setEditingReview] = useState(null);
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [appointment, setAppointment] = useState({ date: '', time: '' });
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const { setLoading } = useSpinner();
  const { accessToken, isAuthenticated } = useAuth();

  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const doctorResponse = await axios.get(`http://127.0.0.1:8000/api/doctors/${id}`);
        setDoctor(doctorResponse.data);

        const reviewsResponse = await axios.get(`http://127.0.0.1:8000/api/doctors/${id}/reviews`);
        const fetchedReviews = reviewsResponse.data.reviews || [];
        setReviews(fetchedReviews);

        // Calculate average rating
        const totalRating = fetchedReviews.reduce((sum, review) => sum + review.rating, 0);
        const average = fetchedReviews.length ? totalRating / fetchedReviews.length : 0;
        setAverageRating(average);

        if (isAuthenticated && accessToken) {
          const profileResponse = await axios.get(`http://127.0.0.1:8000/api/profile`, {
            headers: { Authorization: `Bearer ${accessToken}` }
          });
          setUserProfile(profileResponse.data.profile);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          setError("Please log in to view additional details.");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, setLoading, isAuthenticated, accessToken]);

  const handleStarClick = (rating, isEditing = false) => {
    if (isEditing) {
      setEditingReview({ ...editingReview, rating });
    } else {
      setNewReview({ ...newReview, rating });
    }
  };

  const handleCommentChange = (e, isEditing = false) => {
    if (isEditing) {
      setEditingReview({ ...editingReview, comment: e.target.value });
    } else {
      setNewReview({ ...newReview, comment: e.target.value });
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (newReview.rating === 0) {
      setError("Please select a rating.");
      return;
    }

    if (!isAuthenticated || !accessToken) {
      setError("Please log in to submit a review.");
      return;
    }

    try {
      setLoading(true); // Show spinner during submission
      const response = await axios.post(
        `http://127.0.0.1:8000/api/doctors/${id}/reviews`,
        { rating: newReview.rating, comment: newReview.comment },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      // Instead of updating state manually, we'll trigger a refresh
      setNewReview({ rating: 0, comment: "" });
      setError(null);

      // Trigger a full page refresh to fetch updated data
      window.location.reload(); // This will trigger useEffect to fetch fresh data
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error.response?.data?.error || "Failed to submit review.");
      setLoading(false); // Hide spinner on error
    }
  };

  const handleEditReview = (review) => {
    setEditingReview({ ...review });
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setError(null);
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    if (editingReview.rating === 0) {
      setError("Please select a rating.");
      return;
    }

    try {
      setLoading(true); // Show spinner during update
      const response = await axios.put(
        `http://127.0.0.1:8000/api/doctors/${id}/reviews/${editingReview.review_id}`,
        { rating: editingReview.rating, comment: editingReview.comment },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setEditingReview(null);
      setError(null);

      // Trigger a full page refresh to fetch updated data
      window.location.reload();
    } catch (error) {
      console.error('Error updating review:', error);
      setError(error.response?.data?.error || "Failed to update review.");
      setLoading(false); // Hide spinner on error
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!isAuthenticated || !accessToken) {
      setError("Please log in to delete a review.");
      return;
    }

    try {
      setLoading(true); // Show spinner during deletion
      await axios.delete(
        `http://127.0.0.1:8000/api/doctors/${id}/reviews/${reviewId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setError(null);

      // Trigger a full page refresh to fetch updated data
      window.location.reload();
    } catch (error) {
      console.error('Error deleting review:', error);
      setError(error.response?.data?.error || "Failed to delete review.");
      setLoading(false); // Hide spinner on error
    }
  };





  const handleToggleVerification = async () => {
    if (!isAuthenticated || !accessToken || userProfile?.user_type !== 'Admin') {
      setError("Only admins can toggle doctor verification.");
      return;
    }

    try {
      setLoading(true); // Show spinner during verification toggle
      const response = await axios.post(
        `http://127.0.0.1:8000/api/doctors/${id}/verify`,
        { is_verified: !doctor.isVerified },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setDoctor({ ...doctor, isVerified: !doctor.isVerified });
      setError(null);

      // Trigger a full page refresh to fetch updated data
      window.location.reload();
    } catch (error) {
      console.error('Error toggling verification:', error);
      setError(error.response?.data?.error || "Failed to toggle verification.");
      setLoading(false); // Hide spinner on error
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    if (!isAuthenticated || !accessToken) {
      setError("Please log in to book an appointment.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'http://127.0.0.1:8000/api/appointments',
        {
          doctor_id: id,
          date: appointment.date,
          time: appointment.time
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` }
        }
      );

      setError(null);
      setAppointment({ date: '', time: '' });
      setShowAppointmentForm(false);
      alert('Appointment booked successfully!');
    } catch (error) {
      console.error('Error booking appointment:', error);
      setError(error.response?.data?.error || "Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  };



  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="animate-pulse text-gray-600 dark:text-gray-300 text-xl">Loading doctor profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-900 dark:to-gray-800 text-black dark:text-white p-4 md:p-6">
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
        <div className="bg-white shadow-xl rounded-xl overflow-hidden dark:bg-gray-800 transition-all">
          <div className="h-32 bg-gradient-to-r from-cyan-500 to-blue-500"></div>

          <div className="px-8 pt-0 pb-8">
            <div className="flex flex-col md:flex-row md:items-end mb-6">
              <img
                src={doctor.ProfilePicture || "https://i.pinimg.com/originals/53/e1/f9/53e1f9601fd784835e67a54f858d0c5e.png"}
                alt={`${doctor.FirstName} ${doctor.LastName}`}
                className="rounded-full w-32 h-32 object-cover border-4 border-white dark:border-gray-800 shadow-md transition-all"
              />
              <div className="md:ml-6 mt-4 md:mt-0">
                <h2 className="text-3xl font-semibold text-gray-900 dark:text-white flex items-center">
                  Dr. {doctor.FirstName} {doctor.LastName}
                  {doctor.isVerified ? (
                    <MdVerified className="ml-2 text-blue-500" />
                  ) : (
                    <VscUnverified className="ml-2 text-red-500" />
                  )}
                </h2>
                <p className="text-lg text-gray-500 dark:text-gray-400">{doctor.Specialty || 'General Practitioner'}</p>
              </div>

              <div className="flex gap-2 mt-4 md:mt-0 md:ml-auto">
                <button
                  onClick={() => setShowAppointmentForm(true)}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center shadow-md transition-all"
                >
                  <span className="mr-2">📅</span>
                  Book Appointment
                </button>
                {userProfile?.user_type === 'Admin' && (
                  <button
                    onClick={handleToggleVerification}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center shadow-md transition-all"
                  >
                    <span className="mr-2">{doctor.isVerified ? '✔️' : '❌'}</span>
                    {doctor.isVerified ? 'Unverify' : 'Verify'} Doctor
                  </button>
                )}
              </div>
            </div>

            {showAppointmentForm && (
              <form onSubmit={handleBookAppointment} className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h3 className="text-xl font-semibold mb-4 text-cyan-600 dark:text-cyan-400 border-b border-gray-200 dark:border-gray-600 pb-2">
                  Book an Appointment
                </h3>
                {error && <p className="text-red-500 mb-2">{error}</p>}
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300">Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    value={appointment.date}
                    onChange={(e) => setAppointment({ ...appointment, date: e.target.value })}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 dark:text-gray-300">Time</label>
                  <input
                    type="time"
                    className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
                    value={appointment.time}
                    onChange={(e) => setAppointment({ ...appointment, time: e.target.value })}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg"
                >
                  Book Appointment
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 h-full">
                <h3 className="text-xl font-semibold mb-4 text-cyan-600 dark:text-cyan-400 border-b border-gray-200 dark:border-gray-600 pb-2">
                  📜 Biography
                </h3>
                <div className="prose dark:prose-invert max-w-none">
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {doctor.Biography || 'No biography available.'}
                  </p>
                </div>

                {userProfile && userProfile.user_type === 'Admin' && (
                  <div className="mt-8">
                    <h3 className="text-xl font-semibold mb-4 text-cyan-600 dark:text-cyan-400 border-b border-gray-200 dark:border-gray-600 pb-2">
                      Admin-Only Details
                    </h3>
                    <div className="space-y-4">
                      <Info label="🆔 Doctor ID" value={doctor.DoctorID} />
                      <Info label="🆔 User ID" value={doctor.UserID} />
                      <Info label="🏨 Hospital ID" value={doctor.HospitalID} />
                      <div className="space-y-2">
                        <Info label="📜 Certificate 1" value={doctor.CertificatePath1 ? <img src={doctor.CertificatePath1} alt="Certificate 1" className="w-full h-auto rounded-lg" /> : 'N/A'} />
                        <Info label="📜 Certificate 2" value={doctor.CertificatePath2 ? <img src={doctor.CertificatePath2} alt="Certificate 2" className="w-full h-auto rounded-lg" /> : 'N/A'} />
                        <Info label="📜 Certificate 3" value={doctor.CertificatePath3 ? <img src={doctor.CertificatePath3} alt="Certificate 3" className="w-full h-auto rounded-lg" /> : 'N/A'} />
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 text-cyan-600 dark:text-cyan-400 border-b border-gray-200 dark:border-gray-600 pb-2">
                    Patient Reviews
                  </h3>
                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm mb-4">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < Math.round(averageRating) ? '★' : '☆'}</span>
                        ))}
                      </div>
                      <span className="ml-2 text-gray-600 dark:text-gray-400">
                        {averageRating.toFixed(1)} ({reviews.length} reviews)
                      </span>
                    </div>
                    {reviews.length > 0 ? (
                      reviews.map((review) => (
                        <div key={review.review_id} className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                          {editingReview && editingReview.review_id === review.review_id ? (
                            <div>
                              <div className="flex mb-2">
                                {[...Array(5)].map((_, i) => (
                                  <span
                                    key={i}
                                    className={`cursor-pointer text-2xl ${i < editingReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                    onClick={() => handleStarClick(i + 1, true)}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                              <textarea
                                className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
                                rows="3"
                                value={editingReview.comment}
                                onChange={(e) => handleCommentChange(e, true)}
                              />
                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={handleUpdateReview}
                                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-800 dark:text-white rounded-lg"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex items-center">
                                <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                  ))}
                                </div>
                                {isAuthenticated && userProfile && review.patient && review.patient.first_name === userProfile.first_name && review.patient.last_name === userProfile.last_name && (
                                  <>
                                    <button
                                      onClick={() => handleEditReview(review)}
                                      className="ml-2 text-sm text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() => handleDeleteReview(review.review_id)}
                                      className="ml-2 text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                                    >
                                      Delete
                                    </button>
                                  </>
                                )}
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 italic">{review.comment}</p>
                              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                                - {review.patient ? `${review.patient.first_name} ${review.patient.last_name}` : 'Unknown'}
                                {review.created_at ? `, ${new Date(review.created_at).toLocaleDateString()}` : ''}
                              </p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
                    )}
                  </div>

                  {isAuthenticated && userProfile && userProfile.user_type === 'Patient' && !reviews.some(review => review.patient && review.patient.first_name === userProfile.first_name && review.patient.last_name === userProfile.last_name) && (
                    <div className="mt-4">
                      <h4 className="text-lg font-medium mb-2">Submit a Review</h4>
                      {error && <p className="text-red-500 mb-2">{error}</p>}
                      <form onSubmit={handleSubmitReview}>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`cursor-pointer text-2xl ${i < newReview.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              onClick={() => handleStarClick(i + 1)}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        <textarea
                          className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:text-white dark:border-gray-600"
                          rows="3"
                          placeholder="Write your review..."
                          value={newReview.comment}
                          onChange={(e) => handleCommentChange(e)}
                        />
                        <button
                          type="submit"
                          className="mt-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg"
                        >
                          Submit Review
                        </button>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Info = ({ label, value }) => (
  <p className="flex items-center">
    <span className="font-semibold text-gray-900 dark:text-white">{label}:</span>
    <span className="ml-2 text-gray-700 dark:text-gray-300">{value || 'N/A'}</span>
  </p>
);

export default DoctorDetails;
