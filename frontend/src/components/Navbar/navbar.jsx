import { Link } from "react-router-dom";
import React, { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import logo from "../../assets/logo.svg";
const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const navItems = [
        { name: "Home", href: "/" },
        { name: "Find a Doctor", href: "#" },
        { name: "Find a Hospital", href: "#" },
        { name: "News", href: "#" },
    ];

    return (
        <header className="bg-cyan-800 shadow p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2">
                <img src={logo} alt="Logo" className="w-10 h-10" />
                    <h1 className="text-3xl font-bold text-white">Care Critique</h1>
                </Link>
                <div className="flex items-center">
                    <Link
                        to="/login"
                        className="text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 text-center mr-4"
                    >
                        Login
                    </Link>
                    <button onClick={toggleMenu} className="text-white focus:outline-none ml-auto">
                        <FaBars className="w-6 h-6" />
                    </button>
                </div>
            </div>
            <div className={`fixed top-0 right-0 h-full w-64 bg-cyan-800 shadow-lg transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4">
                    <button onClick={toggleMenu} className="text-white focus:outline-none">
                        <FaTimes className="w-6 h-6" />
                    </button>
                    <ul className="mt-4">
                        {navItems.map((item, idx) => (
                            <li key={idx} className="mb-2">
                                <a href={item.href} className="text-white hover:text-gray-300">
                                    {item.name}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
