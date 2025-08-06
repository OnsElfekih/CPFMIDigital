import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';

// Pages principales
import Login from "./components/login";
import HomeAdmin from "./components/homeAdmin";
import HomeFormateur from "./components/homeFormateur";
import HomeEntreprise from "./components/homeEntreprise";

// Formations et planning
import FormationTable from "./components/FormationTable";
import FormationForm from "./components/FormationForm";
import ViewPlanning from "./components/ViewPlanning";
import PlanningCalendar from "./components/PlanningCalendar";
import ValidFormation from "./components/ValidFormation";

// Composants utilisateur & sécurité
import FormMotdepasse from "./components/FormNMotDePasse";
import UpdateAdmin from "./components/updateAdmin";
import UpdateEntreprise from "./components/updateEntreprise";
import UpdateFormateur from "./components/updateFormateur";
import FormateurDetails from "./components/FormateurDetails";

// Evaluations
import EvaluationFormateur from "./components/EvaluationFormateur";
import EvaluationFormation from "./components/evaluationFormation";
import FicheFormateurEvaluation from "./components/FicheFormateurEvaluation";
import MesEvaluations from "./components/historiqueEvaluationFormation";

// Certifications
import Certifications from "./components/certifications";
import AddCertificationsEntreprise from "./components/addCertificationEntreprise";
import AddCertificationsParticipant from "./components/addCertificationParticipant";
import UpdateCertif from "./components/updateCertification";
import CertifPrintPage from "./components/CertifPrintPage";
import ImportParticipants from "./components/ImportParticipants";

// Formateurs
import ProfilFormateur from "./components/profilFormateur";
import ListeFormateurs from "./components/listeFormateur";

// Factures & honoraires
import FactureForm from "./components/FactureForm";
import HonoraireFormateurForm from "./components/HonoraireFormateurForm";
import ArchivePage from './components/ArchivePage';
import MesHonoraires from "./components/MesHonoraires";

// Calendriers
import CalendarCard from "./components/CalendarCard";
import CombinedLayoutAdmin from "./components/CombinedLayoutAdmin";
import FormateurCalendar from "./components/FormateurCalendar";
import ClientCalendar from "./components/ClientCalendar";

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentification */}
        <Route path="/" element={<Login />} />
        <Route path="/mdp" element={<FormMotdepasse />} />
        <Route path="/formnmotdepasse" element={<FormMotdepasse />} />

        {/* Tableaux de bord */}
        <Route path="/admin" element={<HomeAdmin />} />
        <Route path="/formateur" element={<HomeFormateur />} />
        <Route path="/entreprise" element={<HomeEntreprise />} />

        {/* Planning */}
        <Route path="/planning" element={<ViewPlanning />} />
        <Route path="/planningcal" element={<PlanningCalendar />} />
        <Route path="/formateur-calendar" element={<FormateurCalendar />} />
        <Route path="/client-calendar" element={<ClientCalendar />} />

        {/* Gestion des utilisateurs */}
        <Route path="/updateClient" element={<UpdateEntreprise />} />
        <Route path="/updateAdmin" element={<UpdateAdmin />} />
        <Route path="/updateForm" element={<UpdateFormateur />} />
        <Route path="/formateur/:id" element={<FormateurDetails />} />
        <Route path="/profilformateur/:id" element={<ProfilFormateur />} />
        <Route path="/listeformateur" element={<ListeFormateurs />} />

        {/* Certifications */}
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/import" element={<ImportParticipants/>}/>
        <Route path="/addCertificationEntreprise" element={<AddCertificationsEntreprise />} />
        <Route path="/addCertificationParticipant" element={<AddCertificationsParticipant />} />
        <Route path="/updatecertif/:id" element={<UpdateCertif />} />
        <Route path="/certifprint/:id" element={<CertifPrintPage />} />

        {/* Evaluations */}
        <Route path="/evaluations" element={<EvaluationFormateur />} />
        <Route path="/evalformation" element={<EvaluationFormation />} />
        <Route path="/historiqueeval" element={<MesEvaluations />} />
        <Route path="/fiche-formateur/:id" element={<FicheFormateurEvaluation />} />

        {/* Factures et honoraires */}
        <Route path="/facture" element={<FactureForm />} />
        <Route path="/honoraire" element={<HonoraireFormateurForm />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/mes-honoraires" element={<MesHonoraires />} />

        {/* Outils et layouts */}
        <Route path="/navsidad" element={<CombinedLayoutAdmin />} />
        <Route path="/calendarcard" element={<CalendarCard />} />
        <Route path="/validation" element={<ValidFormation />} />
      </Routes>
    </Router>
  );
}

export default App;