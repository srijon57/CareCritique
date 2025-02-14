import { FaFacebook, FaTwitter } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-700 text-white py-8">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
                
                <div>
                    <h3 className="font-bold text-lg mb-4">About Care Critique</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:underline">About</a></li>
                        <li><a href="#" className="hover:underline">Press</a></li>
                        <li><a href="#" className="hover:underline">Contact</a></li>
                        <li><a href="#" className="hover:underline">FAQ</a></li>
                        <li><a href="#" className="hover:underline">News</a></li>
                        <li><a href="#" className="hover:underline">Copyright</a></li>
                        <li><a href="#" className="hover:underline">Privacy & Terms</a></li>
                        <li><a href="#" className="hover:underline">Accessibility</a></li>
                        <li><a href="#" className="hover:underline">Claim Doctor Profile</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-lg mb-4">Top Specialties</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:underline">Family G.P.</a></li>
                        <li><a href="#" className="hover:underline">Gynecologist/OBGYN</a></li>
                        <li><a href="#" className="hover:underline">Dentist</a></li>
                        <li><a href="#" className="hover:underline">Orthopedics/Sports</a></li>
                        <li><a href="#" className="hover:underline">Cosmetic Surgeon</a></li>
                        <li><a href="#" className="hover:underline">Dermatologist</a></li>
                        <li><a href="#" className="hover:underline">Gastroenterologist</a></li>
                        <li><a href="#" className="hover:underline">View all specialties</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-lg mb-4">Top Local Doctors</h3>
                    <ul className="space-y-2">
                        <li><a href="#" className="hover:underline">Motijhil</a></li>
                        <li><a href="#" className="hover:underline">Hatirjhil</a></li>
                        <li><a href="#" className="hover:underline">Dhanmondi</a></li>
                        <li><a href="#" className="hover:underline">Mirpur</a></li>
                        <li><a href="#" className="hover:underline">Uttara</a></li>
                        <li><a href="#" className="hover:underline">Shahbag</a></li>
                        <li><a href="#" className="hover:underline">Farmgate</a></li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-lg mb-4">Follow Us</h3>
                    <div className="flex flex-col space-y-3">
                        <a href="#" className="flex items-center gap-2 hover:underline">
                            <FaFacebook className="text-blue-500 text-2xl" /> Facebook
                        </a>
                        <a href="#" className="flex items-center gap-2 hover:underline">
                            <FaTwitter className="text-blue-400 text-2xl" /> Twitter
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
