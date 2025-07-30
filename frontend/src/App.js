import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

// Pages principales
import Login from "./components/login";
import HomeAdmin from "./components/homeAdmin";
import HomeEntreprise from "./components/homeEntreprise";
import HomeFormateur from "./components/homeFormateur";
import UpdateCertif from "./components/updateCertification"

// Formations et planning
import FormationTable from "./components/FormationTable";
import FormationForm from "./components/FormationForm";
import ViewPlanning from "./components/ViewPlanning";
import PlanningCalendar from "./components/PlanningCalendar";
import ValidFormation from "./components/ValidFormation";

// Autres composants
import FormNMotDePasse from "./components/formnmotdepasse";
import CalendarCard from "./components/CalendarCard";
import CombinedLayoutAdmin from "./components/CombinedLayoutAdmin";
import UpdateAdmin from "./components/updateAdmin";
import EvaluationFormateur from "./components/EvaluationFormateur";
import FormateurDetails from "./components/FormateurDetails";
import Certifications from "./components/certifications";
import CertifPrintPage from "./components/CertifPrintPage";
import EvaluationFormation from "./components/evaluationFormation";
import MesEvaluations from "./components/historiqueEvaluationFormation";
import ListeFormateurs from "./components/listeFormateur";
import ProfilFormateur from "./components/profilFormateur";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/homeAdmin" element={<HomeAdmin/>} />
        <Route path="/homeEntreprise" element={<HomeEntreprise/>} />
        <Route path="/homeFormateur" element={<HomeFormateur/>} />
        <Route path="/updateAdmin" element={<UpdateAdmin/>}/>
        <Route path="/certifications" element={<Certifications/>}/>
        <Route path="/formnmotdepasse" element={<FormNMotDePasse/>} />
        <Route path="/updatecertif/:id" element={<UpdateCertif/>}/>
        <Route path="/certifprint/:id" element ={<CertifPrintPage/>}/>
        <Route path="/evalformation" element ={<EvaluationFormation/>}/>
        <Route path="/historiqueeval" element ={<MesEvaluations/>}/>
        <Route path="/listeformateur" element ={<ListeFormateurs/>}/>
        <Route path="/profilformateur/:id" element={<ProfilFormateur/>}/>
        <Route path="/planning" element={<ViewPlanning />} />
        <Route path="/planningcal" element={<PlanningCalendar />} />
        <Route path="/validation" element={<ValidFormation />} />
        <Route path="/formnmotdepasse" element={<FormNMotDePasse />} />
        <Route path="/calendarcard" element={<CalendarCard />} />
        <Route path="/navsidad" element={<CombinedLayoutAdmin />} />
        <Route path="/evaluations" element={<EvaluationFormateur />} />
        <Route path="/formateur/:id" element={<FormateurDetails />} />

        {/* Ajoute d'autres routes ici si nécessaire */}
      </Routes>
    </Router>
  );
}

export default App;
