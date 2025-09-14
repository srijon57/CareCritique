import { Link } from "react-router-dom";
import { FaFacebook, FaWikipediaW, FaLinkedin } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
    const containerVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { staggerChildren: 0.15, duration: 0.6 },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    };

    return (
        <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={containerVariants}
            className="bg-gradient-to-r from-gray-900 via-gray-800 to-black text-gray-300 py-10 mt-10"
        >
            {/* Top Sections */}
            <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 px-6">
                {/* About */}
                <motion.div variants={itemVariants}>
                    <h3 className="font-bold text-lg mb-4 text-white relative inline-block after:content-[''] after:block after:h-[2px] after:w-12 after:bg-cyan-500 after:mt-2">
                        About Care Critique
                    </h3>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/aboutus" className="hover:text-cyan-400 transition">
                                About
                            </Link>
                        </li>
                        <li>
                            <Link to="/news" className="hover:text-cyan-400 transition">
                                News
                            </Link>
                        </li>
                    </ul>
                </motion.div>

                {/* Top Specialties */}
                <motion.div variants={itemVariants}>
                    <h3 className="font-bold text-lg mb-4 text-white relative inline-block after:content-[''] after:block after:h-[2px] after:w-12 after:bg-cyan-500 after:mt-2">
                        Top Specialties
                    </h3>
                    <ul className="space-y-2">
                        <li>
                            <Link to="/doctors" className="hover:text-cyan-400 transition">
                                All Doctors
                            </Link>
                        </li>
                        <li>
                            <Link to="/gynecologistslist" className="hover:text-cyan-400 transition">
                                Gynecologists
                            </Link>
                        </li>
                        <li>
                            <Link to="/neurologistslist" className="hover:text-cyan-400 transition">
                                Neurologists
                            </Link>
                        </li>
                        <li>
                            <Link to="/dentistslist" className="hover:text-cyan-400 transition">
                                Dentists
                            </Link>
                        </li>
                        <li>
                            <Link to="/cardiologistslist" className="hover:text-cyan-400 transition">
                                Cardiologists
                            </Link>
                        </li>
                    </ul>
                </motion.div>

                {/* Local Doctors */}
                <motion.div variants={itemVariants}>
                    <h3 className="font-bold text-lg mb-4 text-white relative inline-block after:content-[''] after:block after:h-[2px] after:w-12 after:bg-cyan-500 after:mt-2">
                        Top Local Doctors
                    </h3>
                    <ul className="space-y-2">
                        {["Motijhil", "Uttora", "Dhanmondi", "Mirpur", "Shahbag", "Gulshan", "Bashundhara"].map(
                            (area) => (
                                <li key={area}>
                                    <Link
                                        to={`/hospitals/${area.toLowerCase()}`}
                                        className="hover:text-cyan-400 transition"
                                    >
                                        {area}
                                    </Link>
                                </li>
                            )
                        )}
                    </ul>
                </motion.div>

                {/* Social Links */}
                <motion.div variants={itemVariants}>
                    <h3 className="font-bold text-lg mb-4 text-white relative inline-block after:content-[''] after:block after:h-[2px] after:w-12 after:bg-cyan-500 after:mt-2">
                        Follow Us
                    </h3>
                    <div className="flex flex-col space-y-4">
                        <motion.a
                            href="https://www.facebook.com/AUST.BD/"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 hover:text-cyan-400 transition"
                        >
                            <FaFacebook className="text-blue-500 text-2xl" /> Facebook
                        </motion.a>
                        <motion.a
                            href="https://en.wikipedia.org/wiki/Ahsanullah_University_of_Science_and_Technology"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 hover:text-cyan-400 transition"
                        >
                            <FaWikipediaW className="text-gray-400 text-2xl" /> Wikipedia
                        </motion.a>
                        <motion.a
                            href="https://www.linkedin.com/company/ahsanullahuniversityofscience&technology/?originalSubdomain=bd"
                            target="_blank"
                            rel="noopener noreferrer"
                            whileHover={{ scale: 1.05 }}
                            className="flex items-center gap-2 hover:text-cyan-400 transition"
                        >
                            <FaLinkedin className="text-blue-600 text-2xl" /> LinkedIn
                        </motion.a>
                    </div>
                </motion.div>
            </div>

            {/* Divider */}
            <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-[1px] bg-gray-600 my-8 mx-auto w-11/12"
            />

            {/* Bottom Copyright */}
            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-center text-sm text-gray-400"
            >
                &copy; 2025 | <span className="font-bold text-white">CSE-3200</span> | C1 |{" "}
                <span className="italic text-cyan-400">Team-Care_Critique</span> | All rights reserved.
            </motion.p>
        </motion.footer>
    );
};

export default Footer;
