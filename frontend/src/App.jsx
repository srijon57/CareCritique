import { Routes, Route } from "react-router-dom"; 
import Homepage from "./pages/home/homepage";
import LoginPage from "./pages/Login/login";
import Navbar from "./components/Navbar/navbar";
import Footer from "./components/Footer/footer";
import SignUpPage from "./pages/SignUp/SignUp";
import DrSignUpPage from "./pages/DrSignUp/Drsignup";
import Profile from "./pages/Profile/Profile";
import ProfileEdit from "./pages/Profile/ProfileEdit";
import VerifyOtpPage from "./pages/VerifyOtpPage/VerifyOtpPage";
import DoctorsList from "./pages/Doctors/DoctorsList";
import DoctorDetails from "./pages/Doctors/DoctorDetails";

function App() {
  return (  
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/SignUp" element={<SignUpPage />} />
        <Route path="/DrSignUp" element={<DrSignUpPage />} />
        <Route path="/Profile" element={<Profile/>}/>
        <Route path="/editprofile" element={<ProfileEdit/>}/>
        <Route path="/verify-otp" element={<VerifyOtpPage/>}/>
        <Route path="/doctors" element={<DoctorsList/>}/>
        <Route path="/doctors/:id" element={<DoctorDetails/>}/>
      </Routes>
    <Footer />
    </>
  );
}

export default App;