import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.jsx';
import { AuthProvider } from './context/Authcontext.jsx';
import { SnackbarProvider } from 'notistack';
createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <StrictMode>
        <SnackbarProvider maxSnack={3}>
            <AuthProvider>
                <App />
            </AuthProvider>
        </SnackbarProvider>
        </StrictMode>
    </BrowserRouter>
);
