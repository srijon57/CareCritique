import { BrowserRouter, Routes, Route } from "react-router-dom"; 
import Homepage from "./pages/home/homepage";
import LoginPage from "./pages/Login/login";
import Navbar from "./components/Navbar/navbar";

function App() {
  return (  
    <> 
    <Navbar/>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<LoginPage/>} />
      </Routes>
    </>
  );
}

export default App;