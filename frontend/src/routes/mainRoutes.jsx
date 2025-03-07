import { Route } from "react-router-dom";
import Homepage from "../pages/home/homepage";
import LoginPage from "../pages/Login/login";
import SignUpPage from "../pages/SignUp/SignUp";
import DrSignUpPage from "../pages/DrSignUp/Drsignup";
import Profile from "../pages/Profile/Profile";
import ProfileEdit from "../pages/Profile/ProfileEdit";
import VerifyOtpPage from "../pages/VerifyOtpPage/VerifyOtpPage";
import AboutUs from "../pages/AboutUs";
import NewsApp from "../components/NewsApp";
import Appointments from "../pages/Appointments/Appointments";

const mainRoutes = [
    <Route key="home" path="/" element={<Homepage />} />,
    <Route key="login" path="/login" element={<LoginPage />} />,
    <Route key="signup" path="/SignUp" element={<SignUpPage />} />,
    <Route key="dr-signup" path="/DrSignUp" element={<DrSignUpPage />} />,
    <Route key="profile" path="/Profile" element={<Profile />} />,
    <Route key="edit-profile" path="/editprofile" element={<ProfileEdit />} />,
    <Route key="verify-otp" path="/verify-otp" element={<VerifyOtpPage />} />,
    <Route key="aboutus" path="/aboutus" element={<AboutUs/>} />,
    <Route key="news" path="/news" element={<NewsApp/>} />,
    <Route key="appointments" path="/appointments" element={<Appointments />} />, // New route
];

export default mainRoutes;