"use client"

import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom" // Import useNavigate
import axios from "axios"

const HospitalDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate() // Initialize useNavigate
  const [hospital, setHospital] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [doctorsLoading, setDoctorsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    setDoctorsLoading(true)
    
    // Fetch hospital details
    axios
      .get(`${import.meta.env.VITE_BACKEND}/api/hospitals/${id}`)
      .then((response) => {
        setHospital(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching hospital details:", error)
        setError("Failed to fetch hospital details. Please try again later.")
        setLoading(false)
      })
    
    // Fetch doctors separately to avoid blocking hospital display
    axios
      .get(`${import.meta.env.VITE_BACKEND}/api/hospitals/${id}/doctors`)
      .then((response) => {
        setDoctors(response.data || [])
        setDoctorsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching doctors:", error)
        setDoctors([]) // Set empty array on error
        setDoctorsLoading(false)
      })
  }, [id])

  // Handle image error by using a fallback image
  const handleImageError = (e) => {
    e.target.src =
      "https://static.vecteezy.com/system/resources/previews/038/252/707/non_2x/hospital-building-illustration-medical-clinic-isolated-on-white-background-vector.jpg"
  }

  // Function to navigate to DoctorDetails page
  const handleSeeMore = (doctorId) => {
    navigate(`/doctors/${doctorId}`) // Navigate to DoctorDetails page
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        {/* Back Navigation */}
        <button
          onClick={() => window.history.back()}
          className="group mb-6 flex items-center text-cyan-700 dark:text-cyan-400 font-medium transition-all hover:text-cyan-900 dark:hover:text-cyan-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 transform group-hover:-translate-x-1 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Hospitals
        </button>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 mx-auto text-red-500 dark:text-red-400 mb-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-lg font-medium text-red-800 dark:text-red-300 mb-2">Something went wrong</h3>
            <p className="text-red-600 dark:text-red-400">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Try Again
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && !error && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden animate-pulse">
            {/* Image Skeleton */}
            <div className="h-64 bg-gray-300 dark:bg-gray-700"></div>

            {/* Content Skeleton */}
            <div className="p-6">
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded-lg w-3/4 mx-auto mb-6"></div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-700 mr-3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-700 mr-3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-700 mr-3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                </div>
                <div className="flex items-center">
                  <div className="h-5 w-5 rounded-full bg-gray-300 dark:bg-gray-700 mr-3"></div>
                  <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-full"></div>
                </div>
              </div>

              <div className="mt-8 h-10 bg-gray-300 dark:bg-gray-700 rounded-lg w-1/3 mx-auto"></div>
            </div>
          </div>
        )}

        {/* Hospital Details */}
        {!loading && !error && hospital && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden transform transition-all">
            {/* Hospital Image with Overlay */}
            <div className="h-64 sm:h-80 overflow-hidden">
              <img
                src={
                  hospital.ImageURL ||
                  "https://static.vecteezy.com/system/resources/previews/038/252/707/non_2x/hospital-building-illustration-medical-clinic-isolated-on-white-background-vector.jpg"
                }
                alt={hospital.Name}
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-700"
                onError={handleImageError}
              />
              <div className="bg-gradient-to-t from-black/70 via-transparent to-transparent h-full flex flex-col justify-end p-6">
                <div className="inline-block px-3 py-1 bg-cyan-600 text-white text-xs font-semibold rounded-full mb-2">
                  Medical Facility
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">{hospital.Name}</h1>
              </div>
            </div>

            {/* Hospital Information */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Hospital Information
                  </h2>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-full mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-cyan-700 dark:text-cyan-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Address</p>
                      <p className="text-gray-800 dark:text-white">{hospital.Address}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-full mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-cyan-700 dark:text-cyan-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact Number</p>
                      <p className="text-gray-800 dark:text-white">{hospital.ContactNumber}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                    Location Details
                  </h2>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-full mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-cyan-700 dark:text-cyan-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Area</p>
                      <p className="text-gray-800 dark:text-white">{hospital.HospitalArea}</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-full mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-cyan-700 dark:text-cyan-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400">City</p>
                      <p className="text-gray-800 dark:text-white">{hospital.HospitalCity}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Doctors Section */}
              <div className="mt-8">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2 mb-4">
                  Our Doctors
                </h2>
                
                {/* Doctors Loading State */}
                {doctorsLoading && (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-700 dark:border-cyan-400"></div>
                  </div>
                )}
                
                {/* Doctors Loaded State */}
                {!doctorsLoading && (
                  <>
                    {doctors.length === 0 ? (
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 text-center">
                        <div className="flex-shrink-0 bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-full mx-auto mb-3 w-fit">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 text-cyan-700 dark:text-cyan-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">No doctors are currently associated with this hospital.</p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Please check back later for updates.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {doctors.map((doctor) => (
                          <div 
                            key={doctor.DoctorID} 
                            className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 flex items-start hover:shadow-md transition-shadow"
                          >
                            <div className="flex-shrink-0 bg-cyan-100 dark:bg-cyan-900/30 p-2 rounded-full mr-3">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-cyan-700 dark:text-cyan-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                />
                              </svg>
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-800 dark:text-white">
                                Dr. {doctor.FirstName} {doctor.LastName}
                              </h3>
                              <p className="text-cyan-600 dark:text-cyan-400">{doctor.Specialty}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {doctor.Education}
                              </p>
                              {/* Add "See More" Button */}
                              <button
                                onClick={() => handleSeeMore(doctor.DoctorID)}
                                className="mt-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg transition-colors"
                              >
                                See More
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                
                <a
                  href={`tel:${hospital.ContactNumber}`}
                  className="px-6 py-2.5 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 flex items-center"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  Contact Hospital
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default HospitalDetails