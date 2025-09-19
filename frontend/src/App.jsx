// App.jsx
import { Routes } from "react-router-dom";
import Navbar from "./components/Navbar/navbar";
import Footer from "./components/Footer/footer";
import mainRoutes from "./routes/mainRoutes";
import doctorRoutes from "./routes/doctorRoutes";
import hospitalRoutes from "./routes/hospitalRoutes";
import Chatbot from "./components/Chatbot/Chatbot"; 

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {mainRoutes}
        {doctorRoutes}
        {hospitalRoutes}
      </Routes>
      <Footer />
      <Chatbot />
    </>
  );
}

export default App;