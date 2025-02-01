import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Homepage from "./pages/home/homepage";
import LoginPage from "./pages/Login/login";
import Navbar from "./components/Navbar/navbar";
import SignUpPage from "./pages/SignUp/SignUp";

function App() {
  return (  
    <> 
    <Navbar/>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage/>} />
        <Route path="/SignUp" element={<SignUpPage/>} />
      </Routes>
    </>
  );
}

export default App;