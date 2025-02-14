import { useEffect, useState } from "react";
import { MdDarkMode, MdLightMode } from "react-icons/md";

const ThemeToggle = () => {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [theme]);

    useEffect(() => {
        const storedTheme = localStorage.getItem("theme");
        if (storedTheme) {
            setTheme(storedTheme);
            document.documentElement.classList.add(storedTheme);
        } else {
            const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setTheme(prefersDark ? "dark" : "light");
            document.documentElement.classList.add(prefersDark ? "dark" : "light");
        }
    }, []);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <button 
            onClick={toggleTheme} 
            className="fixed bottom-2 left-2 p-1 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
        >
            {theme === "dark" ? <MdLightMode className="text-white-400 text-2xl" /> : <MdDarkMode className="text-gray-900 text-2xl" />}
        </button>
    );
};

export default ThemeToggle;
