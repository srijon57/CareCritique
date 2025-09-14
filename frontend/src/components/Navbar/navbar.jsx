import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBars, FaTimes, FaChevronDown, FaUserCircle } from 'react-icons/fa';
import logo from '../../assets/logo.svg';
import { useAuth } from '../../context/Authcontext';
import { motion, AnimatePresence } from 'framer-motion';
import ThemeToggle from '../ThemeToggle';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [hoveredItem, setHoveredItem] = useState(null);
    const { isAuthenticated, logout, userType } = useAuth();

    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
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
                { name: 'All Doctors', href: '/doctors' },
                { name: 'Gynecologists', href: '/gynecologistslist' },
                { name: 'Neurologists', href: '/neurologistslist' },
                { name: 'Dentists', href: '/dentistslist' },
                { name: 'Cardiologists', href: '/cardiologistslist' },
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
        ...(isAuthenticated && (userType === 'Patient' || userType === 'Doctor')
            ? [{ name: 'Appointments', href: '/appointments' }]
            : []),
    ];

    // Animation Variants
    const sidebarVariants = {
        open: { 
            x: 0, 
            transition: { 
                type: 'spring', 
                stiffness: 300, 
                damping: 30,
                staggerChildren: 0.05,
                delayChildren: 0.1
            } 
        },
        closed: { 
            x: '100%', 
            transition: { 
                type: 'spring', 
                stiffness: 400, 
                damping: 40,
                staggerChildren: 0.05,
                staggerDirection: -1
            } 
        },
    };

    const backdropVariants = {
        open: { 
            opacity: 1, 
            pointerEvents: 'auto',
            transition: { duration: 0.3 }
        },
        closed: { 
            opacity: 0, 
            pointerEvents: 'none',
            transition: { duration: 0.3 }
        },
    };

    const dropdownVariants = {
        open: { 
            opacity: 1, 
            y: 0, 
            height: 'auto', 
            transition: { 
                duration: 0.3, 
                ease: 'easeOut',
                staggerChildren: 0.05,
                delayChildren: 0.1
            } 
        },
        closed: { 
            opacity: 0, 
            y: -10, 
            height: 0, 
            transition: { 
                duration: 0.2, 
                ease: 'easeIn',
                staggerChildren: 0.05,
                staggerDirection: -1
            } 
        },
    };

    const itemVariants = {
        open: {
            opacity: 1,
            y: 0,
            transition: { type: "spring", stiffness: 300, damping: 24 }
        },
        closed: { 
            opacity: 0, 
            y: 20, 
            transition: { duration: 0.2 } 
        },
    };

    return (
        <>
            {/* Backdrop */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        variants={backdropVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-40 md:hidden"
                        onClick={toggleMenu}
                    />
                )}
            </AnimatePresence>

            {/* Navbar */}
            <motion.header 
                initial={{ y: -100 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                className="bg-cyan-950/90 backdrop-blur-md shadow-lg border-b border-cyan-800/30 sticky top-0 z-50"
            >
                <div className="container mx-auto flex justify-between items-center px-6 py-4">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-3 group">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 2 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                            className="relative"
                        >
                            <motion.img
                                src={logo}
                                alt="Logo"
                                className="w-12 h-12 rounded-lg shadow-md"
                            />
                            <motion.div 
                                className="absolute inset-0 rounded-lg bg-cyan-300/20 opacity-0 group-hover:opacity-100"
                                transition={{ duration: 0.2 }}
                            />
                        </motion.div>
                        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            Care<span className="text-cyan-300">Critique</span>
                        </h1>
                    </Link>

                    {/* Desktop Menu */}
                    <nav className="hidden md:flex items-center space-x-1">
                        {navItems.map((item, index) =>
                            item.children ? (
                                <div
                                    key={index}
                                    className="relative group"
                                    onMouseEnter={() => setOpenDropdown(index)}
                                    onMouseLeave={() => setOpenDropdown(null)}
                                >
                                    <motion.button
                                        whileHover={{ y: -2 }}
                                        whileTap={{ y: 0 }}
                                        className="flex items-center gap-1 px-3 py-2 text-white hover:text-cyan-200 font-medium transition-colors duration-200 relative"
                                    >
                                        {item.name}
                                        <motion.span
                                            animate={{ rotate: openDropdown === index ? 180 : 0 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <FaChevronDown className="w-4 h-4 group-hover:text-cyan-200 transition-colors duration-200" />
                                        </motion.span>
                                        <motion.span 
                                            className="absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-300 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
                                            whileHover={{ scaleX: 1 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </motion.button>

                                    <AnimatePresence>
                                        {openDropdown === index && (
                                            <motion.ul
                                                initial="closed"
                                                animate="open"
                                                exit="closed"
                                                variants={dropdownVariants}
                                                className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-40"
                                            >
                                                {item.children.map((child, childIndex) => (
                                                    <motion.li
                                                        key={childIndex}
                                                        variants={itemVariants}
                                                        whileHover={{ 
                                                            backgroundColor: '#f0f9ff', 
                                                            borderRadius: '8px',
                                                            transition: { duration: 0.2 }
                                                        }}
                                                        className="border-b last:border-b-0 border-gray-100 dark:border-gray-700"
                                                    >
                                                        <Link
                                                            to={child.href}
                                                            className="block px-5 py-3 text-gray-800 dark:text-gray-200 hover:text-cyan-700 dark:hover:text-cyan-400 transition-colors duration-200"
                                                            onClick={() => setOpenDropdown(null)}
                                                        >
                                                            {child.name}
                                                        </Link>
                                                    </motion.li>
                                                ))}
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ) : (
                                <motion.div
                                    key={index}
                                    whileHover={{ y: -2 }}
                                    whileTap={{ y: 0 }}
                                    onHoverStart={() => setHoveredItem(index)}
                                    onHoverEnd={() => setHoveredItem(null)}
                                    className="relative"
                                >
                                    <Link
                                        to={item.href}
                                        className="px-3 py-2 text-white hover:text-cyan-200 font-medium relative block"
                                    >
                                        {item.name}
                                        <motion.span 
                                            className="absolute -bottom-1 left-0 w-full h-0.5 bg-cyan-300"
                                            initial={{ scaleX: 0 }}
                                            animate={{ scaleX: hoveredItem === index ? 1 : 0 }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </Link>
                                </motion.div>
                            )
                        )}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-3">
                        <ThemeToggle />
                        
                        {isAuthenticated ? (
                            <>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Link
                                        to="/profile"
                                        className="p-2 text-white hover:text-cyan-200 rounded-full hover:bg-cyan-800/20 transition-all duration-200 flex items-center"
                                        aria-label="View profile"
                                    >
                                        <FaUserCircle className="w-6 h-6" />
                                    </Link>
                                </motion.div>
                                <motion.button
                                    whileHover={{ scale: 1.05, boxShadow: "0 10px 25px -10px rgba(239, 68, 68, 0.5)" }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={logout}
                                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg text-sm shadow-md hover:shadow-lg transition-all duration-200"
                                >
                                    Logout
                                </motion.button>
                            </>
                        ) : (
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <Link
                                    to="/login"
                                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-medium rounded-lg text-sm shadow-md hover:shadow-lg transition-all duration-200 hover:from-cyan-700 hover:to-cyan-800 block"
                                >
                                    Login
                                </Link>
                            </motion.div>
                        )}

                        {/* Mobile Toggle */}
                        <motion.button
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleMenu}
                            className="md:hidden p-2 text-white hover:text-cyan-200 rounded-lg hover:bg-cyan-800/20 transition-all duration-200"
                            aria-label="Toggle menu"
                        >
                            <FaBars className="w-6 h-6" />
                        </motion.button>
                    </div>
                </div>
            </motion.header>

            {/* Mobile Sidebar */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.aside
                        variants={sidebarVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="fixed inset-y-0 right-0 w-80 bg-gradient-to-b from-cyan-950 to-cyan-900 shadow-2xl z-50 p-6 text-white overflow-y-auto"
                    >
                        <motion.div 
                            variants={itemVariants}
                            className="flex justify-between items-center mb-8"
                        >
                            <Link to="/" className="flex items-center space-x-2" onClick={toggleMenu}>
                                <img src={logo} alt="Logo" className="w-10 h-10 rounded-lg" />
                                <h2 className="text-xl font-bold">CareCritique</h2>
                            </Link>
                            <motion.button 
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={toggleMenu} 
                                className="text-white hover:text-cyan-200 transition-colors duration-200"
                            >
                                <FaTimes className="w-6 h-6" />
                            </motion.button>
                        </motion.div>

                        <motion.ul variants={dropdownVariants} className="space-y-4">
                            {navItems.map((item, index) => (
                                <motion.li key={index} variants={itemVariants}>
                                    {item.children ? (
                                        <div>
                                            <button
                                                className="flex items-center justify-between w-full py-3 px-2 hover:text-cyan-200 rounded-lg transition-colors duration-200"
                                                onClick={() => toggleDropdown(index)}
                                            >
                                                <span className="font-medium">{item.name}</span>
                                                <motion.span
                                                    animate={openDropdown === index ? { rotate: 180 } : { rotate: 0 }}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    <FaChevronDown className="w-5 h-5" />
                                                </motion.span>
                                            </button>

                                            <AnimatePresence>
                                                {openDropdown === index && (
                                                    <motion.ul
                                                        initial="closed"
                                                        animate="open"
                                                        exit="closed"
                                                        variants={dropdownVariants}
                                                        className="mt-2 pl-4 space-y-2"
                                                    >
                                                        {item.children.map((child, childIndex) => (
                                                            <motion.li
                                                                key={childIndex}
                                                                variants={itemVariants}
                                                                whileHover={{ 
                                                                    x: 5,
                                                                    transition: { duration: 0.2 }
                                                                }}
                                                            >
                                                                <Link
                                                                    to={child.href}
                                                                    className="block py-2 text-gray-300 hover:text-cyan-200 transition-colors duration-200"
                                                                    onClick={toggleMenu}
                                                                >
                                                                    {child.name}
                                                                </Link>
                                                            </motion.li>
                                                        ))}
                                                    </motion.ul>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ) : (
                                        <Link
                                            to={item.href}
                                            className="block py-3 px-2 hover:text-cyan-200 rounded-lg transition-colors duration-200"
                                            onClick={toggleMenu}
                                        >
                                            {item.name}
                                        </Link>
                                    )}
                                </motion.li>
                            ))}

                            {/* Auth Buttons */}
                            {!isAuthenticated && (
                                <motion.li variants={itemVariants} className="mt-8 pt-6 border-t border-cyan-800/50">
                                    <Link
                                        to="/login"
                                        className="block py-3 px-4 bg-gradient-to-r from-cyan-600 to-cyan-700 text-white font-medium rounded-lg text-center hover:from-cyan-700 hover:to-cyan-800 transition-all duration-200"
                                        onClick={toggleMenu}
                                    >
                                        Login
                                    </Link>
                                </motion.li>
                            )}

                            {isAuthenticated && (
                                <motion.li variants={itemVariants} className="mt-8 pt-6 border-t border-cyan-800/50">
                                    <Link
                                        to="/profile"
                                        className="flex items-center gap-3 py-3 px-4 hover:text-cyan-200 rounded-lg transition-colors duration-200"
                                        onClick={toggleMenu}
                                    >
                                        <FaUserCircle className="w-5 h-5" />
                                        My Profile
                                    </Link>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={logout}
                                        className="w-full mt-3 py-3 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-medium rounded-lg text-center hover:from-red-600 hover:to-red-700 transition-all duration-200"
                                    >
                                        Logout
                                    </motion.button>
                                </motion.li>
                            )}
                        </motion.ul>

                        {/* Footer */}
                        <motion.div 
                            variants={itemVariants}
                            className="mt-12 pt-6 border-t border-cyan-800/50 text-center"
                        >
                            <p className="text-xs text-gray-400 italic">
                                In partnership with <span className="font-medium text-cyan-300">AUST</span> • CSE-3200
                            </p>
                        </motion.div>
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
};

export default Navbar;