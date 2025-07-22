import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Login from "./components/login";
import HomeAdmin from "./components/homeAdmin";
import HomeFormateur from "./components/homeFormateur";
import HomeEntreprise from "./components/homeEntreprise";
import ViewPlanning from "./components/ViewPlanning";
import PlanningCalendar from "./components/PlanningCalendar";
import EvaluationFormateur from "./components/EvaluationFormateur";
import FormateurDetails from "./components/FormateurDetails";
import FormNMotDePasse from "./components/formnmotdepasse";
import Certifications from "./components/certifications";
import UpdateAdmin from "./components/updateAdmin";
import UpdateFormateur from "./components/updatedFormateur";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/homeAdmin" element={<HomeAdmin/>} />
        <Route path="/homeEntreprise" element={<HomeEntreprise/>} />
        <Route path="/homeFormateur" element={<HomeFormateur/>} />
        <Route path="/updateAdmin" element={<UpdateAdmin/>}/>
        <Route path="/updateFormateur" element={<UpdateFormateur/>}/>
        <Route path="/certifications" element={<Certifications/>}/>
        <Route path="/formnmotdepasse" element={<FormNMotDePasse/>} />
        <Route path="/planning" element={<ViewPlanning />} />
        <Route path="/planningcal" element={<PlanningCalendar />} />
        <Route path="/evaluations" element={<EvaluationFormateur/>} />
        <Route path="/formateur/:id" element={<FormateurDetails />} />
        


        {/* Ajoute d'autres routes ici si nécessaire */}
      </Routes>
    </Router>
  );
}

export default App;