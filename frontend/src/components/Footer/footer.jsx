import { Link } from "react-router-dom";
import { FaFacebook, FaWikipediaW, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-gray-700 text-white py-8">
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-6">
                <div>
                    <h3 className="font-bold text-lg mb-4">
                        About Care Critique
                    </h3>
                    <ul className="space-y-2">
                        <li>
                            <a href="/aboutus" className="hover:underline">
                                About
                            </a>
                        </li>
                        <li>
                            <a href="/news" className="hover:underline">
                                News
                            </a>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-lg mb-4">Top Specialties</h3>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/doctors" className="hover:underline">
                                All Doctors
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/gynecologistslist"
                                className="hover:underline"
                            >
                                Gynecologists
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/neurologistslist"
                                className="hover:underline"
                            >
                                Neurologists
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/dentistslist"
                                className="hover:underline"
                            >
                                Dentists
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/cardiologistslist"
                                className="hover:underline"
                            >
                                Cardiologists
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-lg mb-4">
                        Top Local Doctors
                    </h3>
                    <ul className="space-y-2">
                        <li>
                            <Link
                                to="/hospitals/Motijhil"
                                className="hover:underline"
                            >
                                Motijhil
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/hospitals/uttora"
                                className="hover:underline"
                            >
                                Uttora
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/hospitals/dhanmondi"
                                className="hover:underline"
                            >
                                Dhanmondi
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/hospitals/Mirpur"
                                className="hover:underline"
                            >
                                Mirpur
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/hospitals/shahbag"
                                className="hover:underline"
                            >
                                Shahbag
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/hospitals/gulshan"
                                className="hover:underline"
                            >
                                Gulshan
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/hospitals/bashundhara"
                                className="hover:underline"
                            >
                                Bashundhara
                            </Link>
                        </li>
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-lg mb-4">Follow Us</h3>
                    <div className="flex flex-col space-y-3">
                        <a
                            href="https://www.facebook.com/AUST.BD/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:underline"
                        >
                            <FaFacebook className="text-blue-500 text-2xl" />{" "}
                            Facebook
                        </a>
                        <a
                            href="https://en.wikipedia.org/wiki/Ahsanullah_University_of_Science_and_Technology"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:underline"
                        >
                            <FaWikipediaW className="text-gray-600 text-2xl" />{" "}
                            Wikipedia
                        </a>
                        <a
                            href="https://www.linkedin.com/company/ahsanullahuniversityofscience&technology/?originalSubdomain=bd"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 hover:underline"
                        >
                            <FaLinkedin className="text-blue-700 text-2xl" />{" "}
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
            <br />
            <p className="text-center text-lg font-semibold text-gray-200">
                &copy; 2025 | <span className="font-bold">CSE-3100</span> | C1 |{" "}
                <span className="italic">Team-Care_Critique</span> | All rights
                reserved.
            </p>
        </footer>
    );
};

export default Footer;
