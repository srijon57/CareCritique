import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown, FaChevronUp, FaUserCircle } from 'react-icons/fa';
import logo from '../../assets/logo.svg';
import ThemeToggle from '../ThemeToggle';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const { isAuthenticated, logout } = useAuth();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
        setOpenDropdown(null);
    };

    const toggleDropdown = (index) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    const navItems = [
        { name: 'Home', href: '/' },
        {
            name: 'Find a Doctor',
            children: [
                { name: 'All Doctors', href: '/doctors/doctorsList' },
                { name: 'Gynecologists', href: '/doctors/gynecologistslist' },
                { name: 'Neurologists', href: '/doctors/neurologistslist' },
                { name: 'Dentists', href: '/doctors/dentistslist' },
                { name: 'Cardiologists', href: '/doctors/cardiologistslist' },
            ],
        },
        {
            name: 'Find a Hospital',
            children: [
                { name: 'All Hospitals', href: '/hospitals' },
                { name: 'Motijhil', href: '/hospitals/motijhil' },
                { name: 'Dhanmondi', href: '/hospitals/dhanmondi' },
                { name: 'Shahbag', href: '/hospitals/shahbag' },
                { name: 'Mirpur', href: '/hospitals/mirpur' },
                { name: 'Uttora', href: '/hospitals/uttora' },
                { name: 'Gulshan', href: '/hospitals/gulshan' },
                { name: 'Bashundhara', href: '/hospitals/bashundhara' },
                
            ],
        },
        { name: 'News', href: '/news' },
    ];

    return (
        <header className="bg-cyan-800 shadow p-4 dark:bg-cyan-950">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="flex items-center space-x-2">
                    <img src={logo} alt="Logo" className="w-10 h-10" />
                    <h1 className="text-3xl font-bold text-white">Care Critique</h1>
                </Link>
                <div className="flex items-center space-x-4">
                    {isAuthenticated ? (
                        <>
                            <Link to="/profile" className="text-white hover:text-gray-300">
                                <FaUserCircle className="w-6 h-6" />
                            </Link>
                            <button
                                onClick={logout}
                                className="text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none font-medium rounded-lg text-sm px-4 py-2"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <Link
                            to="/login"
                            className="text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none font-medium rounded-lg text-sm px-4 py-2"
                        >
                            Login
                        </Link>
                    )}
                    <button onClick={toggleMenu} className="text-white focus:outline-none">
                        <FaBars className="w-6 h-6" />
                    </button>
                    <ThemeToggle />
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={`fixed top-0 right-0 h-full w-64 bg-cyan-800 shadow-lg transform transition-transform duration-300 ease-in-out z-50 ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className="p-4">
                    <button onClick={toggleMenu} className="text-white focus:outline-none">
                        <FaTimes className="w-6 h-6" />
                    </button>
                    <ul className="mt-4 space-y-2">
                        {navItems.map((item, index) => (
                            <li key={index} className="relative">
                                {item.children ? (
                                    <div>
                                        <button
                                            className="flex items-center justify-between w-full text-white hover:text-gray-300"
                                            onClick={() => toggleDropdown(index)}
                                        >
                                            <span>{item.name}</span>
                                            {openDropdown === index ? <FaChevronUp className="ml-2" /> : <FaChevronDown className="ml-2" />}
                                        </button>
                                        {openDropdown === index && (
                                            <ul className="pl-4 mt-1 space-y-2">
                                                {item.children.map((child, childIndex) => (
                                                    <li key={childIndex}>
                                                        <Link to={child.href} className="block text-white hover:text-gray-300">
                                                            {child.name}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    <Link to={item.href} className="block text-white hover:text-gray-300">
                                        {item.name}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </header>
    );
};

export default Navbar;