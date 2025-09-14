/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSpinner } from '../../components/SpinnerProvider';
import { useAuth } from '../../context/Authcontext';
import { MdVerified, MdEdit, MdDelete, MdStar, MdStarBorder, MdLocationOn, MdPhone, MdSchool, MdWork, MdLanguage, MdCalendarToday, MdBook } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

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
        const doctorResponse = await axios.get(`${import.meta.env.VITE_BACKEND}/api/doctors/${id}`);
        setDoctor(doctorResponse.data);

        const reviewsResponse = await axios.get(`${import.meta.env.VITE_BACKEND}/api/doctors/${id}/reviews`);
        const fetchedReviews = reviewsResponse.data.reviews || [];
        setReviews(fetchedReviews);

        // Calculate average rating
        const totalRating = fetchedReviews.reduce((sum, review) => sum + review.rating, 0);
        const average = fetchedReviews.length ? totalRating / fetchedReviews.length : 0;
        setAverageRating(average);

        if (isAuthenticated && accessToken) {
          const profileResponse = await axios.get(`${import.meta.env.VITE_BACKEND}/api/profile`, {
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
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/doctors/${id}/reviews`,
        { rating: newReview.rating, comment: newReview.comment },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setNewReview({ rating: 0, comment: "" });
      setError(null);

      window.location.reload();
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error.response?.data?.error || "Failed to submit review.");
      setLoading(false);
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
      setLoading(true);
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND}/api/doctors/${id}/reviews/${editingReview.review_id}`,
        { rating: editingReview.rating, comment: editingReview.comment },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setEditingReview(null);
      setError(null);

      window.location.reload();
    } catch (error) {
      console.error('Error updating review:', error);
      setError(error.response?.data?.error || "Failed to update review.");
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!isAuthenticated || !accessToken) {
      setError("Please log in to delete a review.");
      return;
    }

    try {
      setLoading(true);
      await axios.delete(
        `${import.meta.env.VITE_BACKEND}/api/doctors/${id}/reviews/${reviewId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setError(null);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting review:', error);
      setError(error.response?.data?.error || "Failed to delete review.");
      setLoading(false);
    }
  };

  const handleToggleVerification = async () => {
    if (!isAuthenticated || !accessToken || userProfile?.user_type !== 'Admin') {
      setError("Only admins can toggle doctor verification.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND}/api/doctors/${id}/verify`,
        { is_verified: !doctor.isVerified },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setDoctor({ ...doctor, isVerified: !doctor.isVerified });
      setError(null);
      window.location.reload();
    } catch (error) {
      console.error('Error toggling verification:', error);
      setError(error.response?.data?.error || "Failed to toggle verification.");
      setLoading(false);
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
        `${import.meta.env.VITE_BACKEND}/api/appointments`,
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="animate-pulse flex flex-col items-center space-y-6">
            <div className="w-24 h-24 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
            <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded"></div>
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-cyan-50 dark:from-gray-900 dark:to-gray-950 text-slate-900 dark:text-slate-100 p-4 md:p-6 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-200/10 dark:bg-cyan-800/5 rounded-full blur-3xl -translate-x-24 -translate-y-24 -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-200/10 dark:bg-gold-800/5 rounded-full blur-3xl translate-x-24 translate-y-24 -z-10"></div>

      <div className="max-w-6xl mx-auto mb-8">
        <button
          onClick={() => window.history.back()}
          className="flex items-center text-cyan-600 dark:text-cyan-400 hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors px-4 py-2 rounded-lg hover:bg-cyan-50 dark:hover:bg-gray-800"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span className="font-medium">Back to Doctors</span>
        </button>
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white shadow-2xl rounded-3xl overflow-hidden dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
        >
          {/* Header Banner with AUST Badge */}
          <div className="h-48 bg-gradient-to-r from-navy-800 via-cyan-700 to-blue-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-10"></div>
            <div className="absolute top-4 right-4 flex items-center gap-2 text-white">
              <span className="px-3 py-1 bg-gold-500/80 text-white text-xs font-bold rounded-full">
                
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gold-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>

          <div className="px-8 pt-0 pb-12">
            <div className="flex flex-col lg:flex-row lg:items-end mb-8">
              <div className="flex-shrink-0">
                <motion.img
                  src={doctor.ProfilePicture || "https://i.pinimg.com/originals/53/e1/f9/53e1f9601fd784835e67a54f858d0c5e.png"}
                  alt={`${doctor.FirstName} ${doctor.LastName}`}
                  className="rounded-2xl w-40 h-40 object-cover border-6 border-white dark:border-gray-800 shadow-xl transition-all hover:scale-105"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </div>

              <div className="lg:ml-8 mt-6 lg:mt-0">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white flex items-center">
                  Dr. {doctor.FirstName} {doctor.LastName}
                  <motion.span
                    whileTap={{ scale: 0.95 }}
                    className="ml-3 flex items-center"
                  >
                    {doctor.isVerified ? (
                      <MdVerified className="text-3xl text-green-500" />
                    ) : (
                      <MdStarBorder className="text-3xl text-red-500" />
                    )}
                    <span className={`ml-1 text-sm font-medium ${
                      doctor.isVerified ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'
                    }`}>
                      {doctor.isVerified ? 'Verified' : 'Pending'}
                    </span>
                  </motion.span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">{doctor.Specialty || 'General Practitioner'}</p>
                <p className="text-base text-gray-500 dark:text-gray-400 mt-1">{doctor.Hospital}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 mt-6 lg:mt-0 lg:ml-auto">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAppointmentForm(true)}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <MdCalendarToday className="h-5 w-5" />
                  Book Appointment
                </motion.button>

                {userProfile?.user_type === 'Admin' && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleToggleVerification}
                    className={`px-6 py-3 font-medium rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                      doctor.isVerified
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {doctor.isVerified ? (
                      <>
                        <MdStarBorder className="h-5 w-5" />
                        Unverify
                      </>
                    ) : (
                      <>
                        <MdVerified className="h-5 w-5" />
                        Verify
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            </div>

            {showAppointmentForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-2xl border border-gray-200 dark:border-gray-600"
              >
                <h3 className="text-2xl font-bold text-navy-800 dark:text-gold-300 mb-4 flex items-center">
                  <MdCalendarToday className="h-6 w-6 mr-2 text-cyan-600" />
                  Schedule Your Appointment
                </h3>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleBookAppointment} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-1">Date</label>
                      <input
                        type="date"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        value={appointment.date}
                        onChange={(e) => setAppointment({ ...appointment, date: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 dark:text-gray-300 mb-1">Time</label>
                      <input
                        type="time"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                        value={appointment.time}
                        onChange={(e) => setAppointment({ ...appointment, time: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all"
                    >
                      Confirm Appointment
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAppointmentForm(false)}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
              {/* Left Column: Info & Qualifications */}
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-600">
                  <h2 className="text-2xl font-bold text-navy-800 dark:text-gold-300 mb-6 flex items-center">
                    <MdLocationOn className="h-6 w-6 mr-2 text-cyan-600" />
                    Professional Information
                  </h2>
                  <div className="space-y-4">
                    <Info label="🏥 Hospital" value={doctor.Hospital} icon={<MdLocationOn className="h-5 w-5 text-gray-500 dark:text-gray-400" />} />
                    <Info label="📍 Address" value={doctor.Address} icon={<MdLocationOn className="h-5 w-5 text-gray-500 dark:text-gray-400" />} />
                    <Info label="📞 Contact" value={doctor.ContactNumber} icon={<MdPhone className="h-5 w-5 text-gray-500 dark:text-gray-400" />} />
                    <Info label="👤 Gender" value={doctor.Gender} icon={<MdWork className="h-5 w-5 text-gray-500 dark:text-gray-400" />} />
                  </div>
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-600">
                  <h2 className="text-2xl font-bold text-navy-800 dark:text-gold-300 mb-6 flex items-center">
                    <MdSchool className="h-6 w-6 mr-2 text-cyan-600" />
                    Academic Qualifications
                  </h2>
                  <div className="space-y-4">
                    <Info label="🎓 Education" value={doctor.Education} icon={<MdSchool className="h-5 w-5 text-gray-500 dark:text-gray-400" />} />
                    <Info label="⏳ Experience" value={doctor.Experience} icon={<MdWork className="h-5 w-5 text-gray-500 dark:text-gray-400" />} />
                    <Info label="🗣️ Languages" value={doctor.Languages} icon={<MdLanguage className="h-5 w-5 text-gray-500 dark:text-gray-400" />} />
                    <Info label="📆 Availability" value={doctor.Availability} icon={<MdCalendarToday className="h-5 w-5 text-gray-500 dark:text-gray-400" />} />
                  </div>
                </div>
              </div>

              {/* Right Column: Biography & Reviews */}
              <div className="space-y-8">
                <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-600">
                  <h2 className="text-2xl font-bold text-navy-800 dark:text-gold-300 mb-6 flex items-center">
                    <MdBook className="h-6 w-6 mr-2 text-cyan-600" />
                    Biography
                  </h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
                      {doctor.Biography || (
                        <em className="text-gray-500 dark:text-gray-400">
                          No biography available. This doctor has not yet shared their professional journey.
                        </em>
                      )}
                    </p>
                  </div>

                  {userProfile && userProfile.user_type === 'Admin' && (
                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="text-xl font-semibold mb-4 text-cyan-600 dark:text-cyan-400 flex items-center">
                        <MdVerified className="h-5 w-5 mr-2" />
                        Admin-Only Details
                      </h3>
                      <div className="space-y-4">
                        <Info label="🆔 Doctor ID" value={doctor.DoctorID} />
                        <Info label="🆔 User ID" value={doctor.UserID} />
                        <Info label="🏨 Hospital ID" value={doctor.HospitalID} />
                        <div className="space-y-2">
                          <Info 
                            label="📜 Certificate 1" 
                            value={doctor.CertificatePath1 ? (
                              <img src={doctor.CertificatePath1} alt="Certificate 1" className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-600" />
                            ) : 'N/A'} 
                          />
                          <Info 
                            label="📜 Certificate 2" 
                            value={doctor.CertificatePath2 ? (
                              <img src={doctor.CertificatePath2} alt="Certificate 2" className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-600" />
                            ) : 'N/A'} 
                          />
                          <Info 
                            label="📜 Certificate 3" 
                            value={doctor.CertificatePath3 ? (
                              <img src={doctor.CertificatePath3} alt="Certificate 3" className="w-full h-auto rounded-lg border border-gray-200 dark:border-gray-600" />
                            ) : 'N/A'} 
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-white dark:bg-gray-700 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-600">
                  <h3 className="text-2xl font-bold text-navy-800 dark:text-gold-300 mb-6 flex items-center">
                    <MdStar className="h-6 w-6 mr-2 text-yellow-500" />
                    Patient Reviews
                  </h3>

                  <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm mb-6 border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>{i < Math.round(averageRating) ? '★' : '☆'}</span>
                        ))}
                      </div>
                      <span className="ml-2 text-gray-600 dark:text-gray-400 font-medium">
                        {averageRating.toFixed(1)} ({reviews.length} reviews)
                      </span>
                    </div>

                    {reviews.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <motion.div
                            key={review.review_id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className="border-b border-gray-100 dark:border-gray-700 pb-4 last:border-b-0"
                          >
                            {editingReview && editingReview.review_id === review.review_id ? (
                              <div className="space-y-3">
                                <div className="flex">
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
                                  className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                  rows="3"
                                  value={editingReview.comment}
                                  onChange={(e) => handleCommentChange(e, true)}
                                  placeholder="Write your updated review..."
                                />
                                <div className="flex gap-3">
                                  <button
                                    onClick={handleUpdateReview}
                                    className="px-4 py-2 bg-cyan-600 text-white font-medium rounded-lg hover:bg-cyan-700 transition-colors"
                                  >
                                    Save Changes
                                  </button>
                                  <button
                                    onClick={handleCancelEdit}
                                    className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div>
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex text-yellow-400">
                                    {[...Array(5)].map((_, i) => (
                                      <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                    ))}
                                  </div>
                                  <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(review.created_at).toLocaleDateString()}
                                  </span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 italic mb-2">{review.comment}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                  <span>— {review.patient ? `${review.patient.first_name} ${review.patient.last_name}` : 'Anonymous'}</span>
                                  {isAuthenticated && userProfile && review.patient && review.patient.first_name === userProfile.first_name && review.patient.last_name === userProfile.last_name && (
                                    <>
                                      <button
                                        onClick={() => handleEditReview(review)}
                                        className="text-cyan-600 dark:text-cyan-400 hover:underline"
                                      >
                                        Edit
                                      </button>
                                      <button
                                        onClick={() => handleDeleteReview(review.review_id)}
                                        className="text-red-600 dark:text-red-400 hover:underline"
                                      >
                                        Delete
                                      </button>
                                    </>
                                  )}
                                </div>
                              </div>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        Be the first to leave a review!
                      </p>
                    )}
                  </div>

                  {isAuthenticated && userProfile && userProfile.user_type === 'Patient' && !reviews.some(review => review.patient && review.patient.first_name === userProfile.first_name && review.patient.last_name === userProfile.last_name) && (
                    <div className="mt-6 p-6 bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-xl border border-cyan-200 dark:border-cyan-800">
                      <h4 className="text-lg font-medium mb-3 text-navy-800 dark:text-gold-300 flex items-center">
                        <MdStar className="h-5 w-5 mr-2" />
                        Submit Your Review
                      </h4>
                      {error && <p className="text-red-500 mb-3">{error}</p>}
                      <form onSubmit={handleSubmitReview} className="space-y-4">
                        <div className="flex mb-3">
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
                          className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                          rows="4"
                          placeholder="Share your experience with this doctor..."
                          value={newReview.comment}
                          onChange={(e) => handleCommentChange(e)}
                          required
                        />
                        <button
                          type="submit"
                          className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-700 hover:to-blue-700 transition-all shadow-md"
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
        </motion.div>
      </div>

      {/* Footer Credit */}
      <footer className="py-8 bg-slate-900 text-slate-300 text-center border-t border-slate-800 mt-12">
        <p className="text-sm">
          © {new Date().getFullYear()} | Developed with ❤️ by CSE-3200 Students at{" "}
          <span className="font-bold text-cyan-400">Ahsanullah University of Science and Technology (AUST)</span>
          <br />
          <span className="text-xs mt-1 block">141 & 142, Love Road, Tejgaon Industrial Area, Dhaka 1208, Bangladesh</span>
        </p>
      </footer>
    </div>
  );
};

// eslint-disable-next-line react/prop-types
const Info = ({ label, value, icon }) => (
  <p className="flex items-start">
    {icon && <span className="mt-0.5 mr-3 text-gray-500 dark:text-gray-400">{icon}</span>}
    <span className="font-semibold text-gray-900 dark:text-white min-w-[120px]">{label}:</span>
    <span className="ml-2 text-gray-700 dark:text-gray-300">{value || 'N/A'}</span>
  </p>
);

export default DoctorDetails;