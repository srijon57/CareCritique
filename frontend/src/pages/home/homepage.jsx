import { useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

const Homepage = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [location, setLocation] = useState("");

    const handleSearch = () => {
        // Handle search logic here
        console.log("Searching for:", searchQuery, "in", location);
    };

    return (
        <div className="bg-white min-h-screen font-sans">
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-cyan-700 to-cyan-500 text-white py-20">
                <div className="container mx-auto text-center">
                    <h1 className="text-5xl font-bold mb-4">Find the Best Healthcare Providers</h1>
                    <p className="text-xl mb-8">Your health is our priority. Search for doctors, hospitals, and specialists near you.</p>
                    <div className="flex justify-center items-center gap-4">
                        <input 
                            type="text" 
                            placeholder="Specialty, Condition or Procedure" 
                            className="p-3 border-2 border-white rounded w-1/3 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <input 
                            type="text" 
                            placeholder="Lalbag, Dhaka" 
                            className="p-3 border-2 border-white rounded w-1/3 focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white" 
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                        <button 
                            className="bg-white text-cyan-800 py-3 px-6 rounded hover:bg-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                            onClick={handleSearch}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </section>

            {/* Featured Doctors Section */}
            <section className="container mx-auto p-6">
                <h2 className="text-4xl font-bold mb-8 text-cyan-800 text-center">Featured Doctors</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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
                </div>
            </section>

            {/* Testimonials Carousel */}
            <section className="bg-white py-12">
                <h2 className="text-4xl font-bold mb-8 text-cyan-800 text-center">What Our Patients Say</h2>
                <div className="container mx-auto">
                    <Carousel showArrows={true} infiniteLoop={true} showThumbs={false} showStatus={false}>
                        <div className="p-6 text-center">
                            <p className="text-gray-700 text-lg mb-4">``আমার জীবনের সেরা স্বাস্থ্যসেবার অভিজ্ঞতা। ডাক্তাররা খুবই পেশাদার এবং যত্নশীল ছিলেন।``</p>
                            <p className="text-cyan-800 font-semibold">- সাদিক রহমান</p>
                        </div>
                        <div className="p-6 text-center">
                            <p className="text-gray-700 text-lg mb-4">``আমার অবস্থার জন্য আমি নিখুঁত বিশেষজ্ঞ খুঁজে পেয়েছি। পরিষেবাটি দুর্দান্ত ছিল!``</p>
                            <p className="text-cyan-800 font-semibold">- কাজী কামরুদ্দিন আহমেদ</p>
                        </div>
                        <div className="p-6 text-center">
                            <p className="text-gray-700 text-lg mb-4">``Highly recommend this platform for finding top-notch healthcare providers.``</p>
                            <p className="text-cyan-800 font-semibold">- Srabani Mitra</p>
                        </div>
                    </Carousel>
                </div>
            </section>

            {/* Health Tips Section */}
            <section className="container mx-auto p-6">
                <h2 className="text-4xl font-bold mb-8 text-cyan-800 text-center">Health Tips</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-xl font-bold text-cyan-800 mb-2">Stay Hydrated</h3>
                        <p className="text-gray-700">Drinking enough water is essential for maintaining good health. Aim for at least 8 glasses a day.</p>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-xl font-bold text-cyan-800 mb-2">Exercise Regularly</h3>
                        <p className="text-gray-700">Regular physical activity can help you maintain a healthy weight and reduce the risk of chronic diseases.</p>
                    </div>
                    <div className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                        <h3 className="text-xl font-bold text-cyan-800 mb-2">Eat a Balanced Diet</h3>
                        <p className="text-gray-700">A balanced diet rich in fruits, vegetables, and whole grains is key to maintaining good health.</p>
                    </div>
                </div>
            </section>

            {/* Emergency Section */}
            <section className="text-center my-12">
                <button className="bg-red-600 text-white py-4 px-8 text-2xl rounded hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-red-500">Emergency - Call 999</button>
            </section>

            {/* Top Hospitals Section */}
            <section className="container mx-auto p-6">
                <h2 className="text-4xl font-bold mb-8 text-cyan-800 text-center">Top Hospitals</h2>
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

           
        </div>
    );
}

export default Homepage;
