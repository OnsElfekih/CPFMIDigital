import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Login from "./components/login";
import HomeAdmin from "./components/homeAdmin";
import HomeFormateur from "./components/homeFormateur";
import HomeEntreprise from "./components/homeEntreprise";
import ViewPlanning from "./components/ViewPlanning";
import FormMotdepasse from "./components/FormNMotDePasse";
//import CalendarCard from "./components/CalendarCard"; // Si utilisé
import PlanningCalendar from "./components/PlanningCalendar";
import EvaluationFormateur from "./components/EvaluationFormateur";
import FormateurDetails from "./components/FormateurDetails";
import FicheFormateurEvaluation from "./components/FicheFormateurEvaluation";
import FactureForm from "./components/FactureForm"; // Importation du formulaire de facture
import FormateurCalendar from "./components/FormateurCalendar"; // Si utilisé
import ClientCalendar from "./components/ClientCalendar"; // Si utilisé
//import FicheFormateur from "./components/FicheFormateur"; 
import HonoraireFormateurForm from "./components/HonoraireFormateurForm";
import ArchivePage from './components/ArchivePage';
import MesHonoraires from "./components/MesHonoraires";


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
        <Route path="/planningcal" element={<PlanningCalendar />} />
        <Route path="/evaluations" element={<EvaluationFormateur/>} />
        <Route path="/formateur/:id" element={<FormateurDetails />} />
        <Route path="/fiche-formateur/:id" element={<FicheFormateurEvaluation />} />
        <Route path="/facture" element={<FactureForm />} /> {/* Route pour le formulaire de facture */}
        <Route path="/formateur-calendar" element={<FormateurCalendar />} />
        <Route path="/client-calendar" element={<ClientCalendar />} />
        <Route path="/honoraire" element={<HonoraireFormateurForm />} /> {/* Route pour le formulaire d'honoraires */}
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/mes-honoraires" element={<MesHonoraires />} />

        {/* Ajoute d'autres routes ici si nécessaire */}
      </Routes>
    </Router>
  );
}

export default App;