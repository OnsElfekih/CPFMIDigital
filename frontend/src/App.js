import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import HomeAdmin from "./components/homeAdmin";
import HomeFormateur from "./components/homeFormateur";
import HomeEntreprise from "./components/homeEntreprise";
import ViewPlanning from "./components/ViewPlanning";
import FormMotdepasse from "./components/FormNMotDePasse";
//import CalendarCard from "./components/CalendarCard"; // Si utilisé

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<HomeAdmin />} />
        <Route path="/formateur" element={<HomeFormateur />} />
        <Route path="/entreprise" element={<HomeEntreprise />} />
        <Route path="/planning" element={<ViewPlanning />} />
        <Route path="/mdp" element={<FormMotdepasse />} />
        {/* Ajoute d'autres routes ici si nécessaire */}
      </Routes>
    </Router>
  );
}

export default App;
