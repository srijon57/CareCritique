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

import HospitalsList from "./pages/Hospitals/HospitalsList";
import HospitalDetails from "./pages/Hospitals/HospitalDetails";
import UttoraHospitalsList from './pages/Hospitals/UttoraHospitalsList';
import DhanmondiHospitalsList from './pages/Hospitals/DhanmondiHospitalsList';
import ShahbagHospitalsList from './pages/Hospitals/ShahbagHospitalsList';
import GulshanHospitalsList from './pages/Hospitals/GulshanHospitalsList';
import BashundharaHospitalsList from './pages/Hospitals/BashundharaHospitalsList';
import MirpurHospitalsList from './pages/Hospitals/MirpurHospitalsList';
import MotijhilHospitalsList from './pages/Hospitals/MotijhilHospitalsList';
import GynecologistsList from "./pages/Doctors/GynecologistsList";
import CardiologistsList from "./pages/Doctors/CardiologistsList";
import NeurologistsList from "./pages/Doctors/NeurologistsList";
import DentistsList from "./pages/Doctors/DentistsList";

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
        <Route path="/gynecologistslist" element={<GynecologistsList/>}/>
        <Route path="/cardiologistslist" element={<CardiologistsList/>}/>
        <Route path="/neurologistslist" element={<NeurologistsList/>}/>
        <Route path="/dentistslist" element={<DentistsList/>}/>
        <Route path="/doctors/:id" element={<DoctorDetails/>}/>
        <Route path="/hospitals" element={<HospitalsList/>}/>
        <Route path="/hospitals/:id" element={<HospitalDetails/>}/>
        <Route path="/hospitals/uttora" element={<UttoraHospitalsList />} />
        <Route path="/hospitals/dhanmondi" element={<DhanmondiHospitalsList />} />
        <Route path="/hospitals/shahbag" element={<ShahbagHospitalsList />} />
        <Route path="/hospitals/gulshan" element={<GulshanHospitalsList />} />
        <Route path="/hospitals/bashundhara" element={<BashundharaHospitalsList />} />
        <Route path="/hospitals/Mirpur" element={<MirpurHospitalsList />} />
        <Route path="/hospitals/Motijhil" element={<MotijhilHospitalsList />} />
      </Routes>
    <Footer />
    </>
  );
}

export default App;