
import { Route } from "react-router-dom";
import DoctorsList from "../pages/Doctors/DoctorsList";
import DoctorDetails from "../pages/Doctors/DoctorDetails";
import GynecologistsList from "../pages/Doctors/GynecologistsList";
import CardiologistsList from "../pages/Doctors/CardiologistsList";
import NeurologistsList from "../pages/Doctors/NeurologistsList";
import DentistsList from "../pages/Doctors/DentistsList";

const doctorRoutes = [
  <Route key="doctors" path="/doctors" element={<DoctorsList />} />,
  <Route key="doctor-details" path="/doctors/:id" element={<DoctorDetails />} />,
  <Route key="gynecologists" path="/gynecologistslist" element={<GynecologistsList />} />,
  <Route key="cardiologists" path="/cardiologistslist" element={<CardiologistsList />} />,
  <Route key="neurologists" path="/neurologistslist" element={<NeurologistsList />} />,
  <Route key="dentists" path="/dentistslist" element={<DentistsList />} />
];

export default doctorRoutes;