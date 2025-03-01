import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSpinner } from '../../components/SpinnerProvider';
import { useAuth } from '../../context/AuthContext';

const DoctorDetails = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [newReview, setNewReview] = useState({ rating: 0, comment: "" });
  const [editingReview, setEditingReview] = useState(null); // State for editing a review
  const [error, setError] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const { setLoading } = useSpinner();
  const { accessToken, isAuthenticated } = useAuth();

  // Fetch doctor details, reviews, and user profile
  useEffect(() => {
    setLoading(true);
    const fetchData = async () => {
      try {
        const doctorResponse = await axios.get(`http://127.0.0.1:8000/api/doctors/${id}`);
        setDoctor(doctorResponse.data);

        const reviewsResponse = await axios.get(`http://127.0.0.1:8000/api/doctors/${id}/reviews`);
        setReviews(reviewsResponse.data.reviews || []);
        setAverageRating(reviewsResponse.data.average_rating || 0);

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

  // Handle star rating input for new/edit review
  const handleStarClick = (rating, isEditing = false) => {
    if (isEditing) {
      setEditingReview({ ...editingReview, rating });
    } else {
      setNewReview({ ...newReview, rating });
    }
  };

  // Handle comment input for new/edit review
  const handleCommentChange = (e, isEditing = false) => {
    if (isEditing) {
      setEditingReview({ ...editingReview, comment: e.target.value });
    } else {
      setNewReview({ ...newReview, comment: e.target.value });
    }
  };

  // Handle review submission (new review)
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
      const response = await axios.post(
        `http://127.0.0.1:8000/api/doctors/${id}/reviews`,
        { rating: newReview.rating, comment: newReview.comment },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setReviews([...reviews, response.data.review]);
      setNewReview({ rating: 0, comment: "" });
      setError(null);

      const reviewsResponse = await axios.get(`http://127.0.0.1:8000/api/doctors/${id}/reviews`);
      setAverageRating(reviewsResponse.data.average_rating);
    } catch (error) {
      console.error('Error submitting review:', error);
      setError(error.response?.data?.error || "Failed to submit review.");
    }
  };

  // Handle initiating edit mode for a review
  const handleEditReview = (review) => {
    setEditingReview({ ...review });
    setError(null);
  };

  // Handle canceling edit mode
  const handleCancelEdit = () => {
    setEditingReview(null);
    setError(null);
  };

  // Handle updating an existing review
  const handleUpdateReview = async (e) => {
    e.preventDefault();
    if (editingReview.rating === 0) {
      setError("Please select a rating.");
      return;
    }

    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/doctors/${id}/reviews/${editingReview.review_id}`,
        { rating: editingReview.rating, comment: editingReview.comment },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setReviews(reviews.map(r => r.review_id === editingReview.review_id ? response.data.review : r));
      setEditingReview(null);
      setError(null);

      const reviewsResponse = await axios.get(`http://127.0.0.1:8000/api/doctors/${id}/reviews`);
      setAverageRating(reviewsResponse.data.average_rating);
    } catch (error) {
      console.error('Error updating review:', error);
      setError(error.response?.data?.error || "Failed to update review.");
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
                <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">
                  Dr. {doctor.FirstName} {doctor.LastName}
                </h2>
                <p className="text-lg text-gray-500 dark:text-gray-400">{doctor.Specialty || 'General Practitioner'}</p>
              </div>

              <div className="flex gap-2 mt-4 md:mt-0 md:ml-auto">
                <button className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg flex items-center shadow-md transition-all">
                  <span className="mr-2">📅</span>
                  Book Appointment
                </button>
              </div>
            </div>

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
                            // Edit form
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
                            // Display review
                            <div>
                              <div className="flex items-center">
                                <div className="flex text-yellow-400">
                                  {[...Array(5)].map((_, i) => (
                                    <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                                  ))}
                                </div>
                                {isAuthenticated && userProfile && userProfile.first_name === review.patient.first_name && userProfile.last_name === review.patient.last_name && (
                                  <button
                                    onClick={() => handleEditReview(review)}
                                    className="ml-2 text-sm text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
                                  >
                                    Edit
                                  </button>
                                )}
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 italic">{review.comment}</p>
                              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                                - {review.patient.first_name} {review.patient.last_name}, {review.created_at ? new Date(review.created_at).toLocaleDateString() : 'N/A'}
                              </p>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No reviews yet.</p>
                    )}
                  </div>

                  {isAuthenticated && userProfile && userProfile.user_type === 'Patient' && !reviews.some(review => review.patient.first_name === userProfile.first_name && review.patient.last_name === userProfile.last_name) && (
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
