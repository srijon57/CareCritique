import { Route } from "react-router-dom";
import HospitalsList from "../pages/Hospitals/HospitalsList";
import HospitalDetails from "../pages/Hospitals/HospitalDetails";
import UttoraHospitalsList from "../pages/Hospitals/UttoraHospitalsList";
import DhanmondiHospitalsList from "../pages/Hospitals/DhanmondiHospitalsList";
import ShahbagHospitalsList from "../pages/Hospitals/ShahbagHospitalsList";
import GulshanHospitalsList from "../pages/Hospitals/GulshanHospitalsList";
import BashundharaHospitalsList from "../pages/Hospitals/BashundharaHospitalsList";
import MirpurHospitalsList from "../pages/Hospitals/MirpurHospitalsList";
import MotijhilHospitalsList from "../pages/Hospitals/MotijhilHospitalsList";

const hospitalRoutes = [
    <Route key="hospitals" path="/hospitals" element={<HospitalsList />} />,
    <Route
        key="hospital-details"
        path="/hospitals/:id"
        element={<HospitalDetails />}
    />,
    <Route
        key="uttora"
        path="/hospitals/uttora"
        element={<UttoraHospitalsList />}
    />,
    <Route
        key="dhanmondi"
        path="/hospitals/dhanmondi"
        element={<DhanmondiHospitalsList />}
    />,
    <Route
        key="shahbag"
        path="/hospitals/shahbag"
        element={<ShahbagHospitalsList />}
    />,
    <Route
        key="gulshan"
        path="/hospitals/gulshan"
        element={<GulshanHospitalsList />}
    />,
    <Route
        key="bashundhara"
        path="/hospitals/bashundhara"
        element={<BashundharaHospitalsList />}
    />,
    <Route
        key="mirpur"
        path="/hospitals/Mirpur"
        element={<MirpurHospitalsList />}
    />,
    <Route
        key="motijhil"
        path="/hospitals/Motijhil"
        element={<MotijhilHospitalsList />}
    />,
];

export default hospitalRoutes;
