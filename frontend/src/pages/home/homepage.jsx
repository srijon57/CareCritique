import { useState } from "react";

const Homepage = () => {
    return (
        <div className="bg-white min-h-screen font-sans">
            <main className="container mx-auto p-6">
                <section className="text-center mb-8">
                    <h2 className="text-4xl font-bold mb-4 text-cyan-800">MORE THAN 9 MILLION PROVIDER REVIEWS</h2>
                    <h3 className="text-2xl font-semibold mb-6 text-gray-800">Find the Right Doctors and Hospitals For You</h3>
                    <div className="flex justify-center items-center gap-4">
                        <input 
                            type="text" 
                            placeholder="Specialty, Condition or Procedure" 
                            className="p-3 border-2 border-cyan-800 rounded w-1/3 focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                        />
                        <input 
                            type="text" 
                            placeholder="Lalbag, Dhaka" 
                            className="p-3 border-2 border-cyan-800 rounded w-1/3 focus:outline-none focus:ring-2 focus:ring-cyan-500" 
                        />
                        <button className="bg-cyan-800 text-white py-3 px-6 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">Search</button>
                    </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                        <img src="https://static.vecteezy.com/system/resources/thumbnails/024/585/326/small_2x/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png.png" alt="Dr. Karl Smith" className="mx-auto mb-4 rounded-full w-32 h-32 object-cover" />
                        <h4 className="text-xl font-bold text-cyan-800">Dr. Mashrur Rahman Fahim</h4>
                        <p className="text-gray-500">Neurologist</p>
                        <button className="bg-cyan-800 text-white py-2 px-4 mt-4 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">Learn More</button>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                        <img src="https://static.vecteezy.com/system/resources/thumbnails/024/585/358/small_2x/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png.png" alt="Lisa Thomas" className="mx-auto mb-4 rounded-full w-32 h-32 object-cover" />
                        <h4 className="text-xl font-bold text-cyan-800">Dr. Aspia Amir</h4>
                        <p className="text-gray-500">Medical Team</p>
                        <button className="bg-cyan-800 text-white py-2 px-4 mt-4 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">Learn More</button>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                        <img src="https://static.vecteezy.com/system/resources/thumbnails/024/585/326/small_2x/3d-happy-cartoon-doctor-cartoon-doctor-on-transparent-background-generative-ai-png.png" alt="Janne Doe" className="mx-auto mb-4 rounded-full w-32 h-32 object-cover" />
                        <h4 className="text-xl font-bold text-cyan-800">Dr. Abdullah Ishtiaq Sakib</h4>
                        <p className="text-gray-500">Doctor</p>
                        <button className="bg-cyan-800 text-white py-2 px-4 mt-4 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">Learn More</button>
                    </div>
                </section>

                <section className="text-center mb-8">
                    <h4 className="text-2xl font-bold mb-4 text-cyan-800">Popular Specialties</h4>
                    <div className="flex justify-center gap-8">
                        <div className="text-center">
                            <i className="fas fa-user-md text-4xl text-cyan-800 mb-2"></i>
                            <p className="text-gray-700">Primary Care</p>
                        </div>
                        <div className="text-center">
                            <i className="fas fa-eye text-4xl text-cyan-800 mb-2"></i>
                            <p className="text-gray-700">Eye Doctor</p>
                        </div>
                        <div className="text-center">
                            <i className="fas fa-brain text-4xl text-cyan-800 mb-2"></i>
                            <p className="text-gray-700">Psychiatrist</p>
                        </div>
                        <div className="text-center">
                            <i className="fas fa-tooth text-4xl text-cyan-800 mb-2"></i>
                            <p className="text-gray-700">Dentist</p>
                        </div>
                    </div>
                </section>

                <section className="text-center mb-8">
                    <button className="bg-red-600 text-white py-4 px-8 text-2xl rounded hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500">Emergency - Call 999</button>
                </section>

                <section className="mb-8">
                    <h4 className="text-2xl font-bold mb-4 text-center text-cyan-800">Top Hospitals</h4>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                            <img src="https://static.vecteezy.com/system/resources/previews/038/252/707/non_2x/hospital-building-illustration-medical-clinic-isolated-on-white-background-vector.jpg" alt="Popular Hospital" className="mx-auto mb-4 rounded-lg w-full h-48 object-cover" />
                            <h5 className="text-xl font-semibold text-cyan-800">Popular Medical College Hospital</h5>
                            <button className="bg-cyan-800 text-white py-2 px-4 mt-4 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">Learn More</button>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                            <img src="https://static.vecteezy.com/system/resources/previews/038/252/707/non_2x/hospital-building-illustration-medical-clinic-isolated-on-white-background-vector.jpg" alt="Central Hospital" className="mx-auto mb-4 rounded-lg w-full h-48 object-cover" />
                            <h5 className="text-xl font-semibold text-cyan-800">Central Hospital Ltd</h5>
                            <button className="bg-cyan-800 text-white py-2 px-4 mt-4 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">Learn More</button>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                            <img src="https://static.vecteezy.com/system/resources/previews/038/252/707/non_2x/hospital-building-illustration-medical-clinic-isolated-on-white-background-vector.jpg" alt="Labaid Hospital" className="mx-auto mb-4 rounded-lg w-full h-48 object-cover" />
                            <h5 className="text-xl font-semibold text-cyan-800">Labaid Specialized Hospital</h5>
                            <button className="bg-cyan-800 text-white py-2 px-4 mt-4 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">Learn More</button>
                        </div>
                        <div className="bg-white shadow-lg rounded-lg p-6 text-center hover:shadow-xl transition-shadow duration-300">
                            <img src="https://static.vecteezy.com/system/resources/previews/038/252/707/non_2x/hospital-building-illustration-medical-clinic-isolated-on-white-background-vector.jpg" alt="Dhaka Medical" className="mx-auto mb-4 rounded-lg w-full h-48 object-cover" />
                            <h5 className="text-xl font-semibold text-cyan-800">Dhaka Medical College Hospital</h5>
                            <button className="bg-cyan-800 text-white py-2 px-4 mt-4 rounded hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500">Learn More</button>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="bg-cyan-800 text-white py-6">
                <div className="container mx-auto text-center">
                    <p className="mb-4">CSE3100 C1 @Team_2 2025 - All Rights Reserved</p>
                    <div className="flex justify-center gap-8">
                        <a href="#" className="hover:underline">Instagram</a>
                        <a href="#" className="hover:underline">Facebook</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Homepage;