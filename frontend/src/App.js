import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

// Pages principales
import Login from "./components/login";
import HomeAdmin from "./components/homeAdmin";
import HomeEntreprise from "./components/homeEntreprise";
import HomeFormateur from "./components/homeFormateur";

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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/homeadmin" element={<HomeAdmin />} />
        <Route path="/homeentreprise" element={<HomeEntreprise />} />
        <Route path="/homeformateur" element={<HomeFormateur />} />
        <Route path="/formations" element={<FormationTable />} />
        <Route path="/formationform" element={<FormationForm />} />
        <Route path="/planning" element={<ViewPlanning />} />
        <Route path="/planningcal" element={<PlanningCalendar />} />
        <Route path="/validation" element={<ValidFormation />} />
        <Route path="/formnmotdepasse" element={<FormNMotDePasse />} />
        <Route path="/calendarcard" element={<CalendarCard />} />
        <Route path="/navsidad" element={<CombinedLayoutAdmin />} />
        <Route path="/updateadmin" element={<UpdateAdmin />} />
        <Route path="/evaluations" element={<EvaluationFormateur />} />
        <Route path="/formateur/:id" element={<FormateurDetails />} />
        <Route path="/certifications" element={<Certifications />} />
      </Routes>
    </Router>
  );
}

export default App;
