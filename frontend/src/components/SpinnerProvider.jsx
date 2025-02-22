import  { createContext, useState, useContext } from 'react';

const SpinnerContext = createContext();

export const SpinnerProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    return (
        <SpinnerContext.Provider value={{ loading, setLoading }}>
            {children}
            {loading && (
                <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
                    <div className="relative flex justify-center items-center">
                        <div className="absolute animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-cyan-500"></div>
                        <img src="https://www.svgrepo.com/show/284250/surgeon-doctor.svg" className="rounded-full h-28 w-28" alt="Loading" />
                    </div>
                </div>
            )}
        </SpinnerContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSpinner = () => useContext(SpinnerContext);
