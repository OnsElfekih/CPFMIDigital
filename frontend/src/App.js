import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Auth & home
import Login from "./components/login";
import HomeAdmin from "./components/homeAdmin";
import HomeFormateur from "./components/homeFormateur";
import HomeEntreprise from "./components/homeEntreprise";

// Formations & planning
import FormationTable from "./components/FormationTable";
import FormationForm from "./components/FormationForm";
import ViewPlanning from "./components/ViewPlanning";
import PlanningCalendar from "./components/PlanningCalendar";
import ValidFormation from "./components/ValidFormation";
import AdminFormateurs from "./components/AdminFormateurs";
// User & profile
import FormMotdepasse from "./components/formnmotdepasse";
import UpdateAdmin from "./components/updateAdmin";
import UpdateEntreprise from "./components/updateEntreprise";
import UpdateFormateur from "./components/updateFormateur";
import FormateurDetails from "./components/FormateurDetails";
import ProfilFormateur from "./components/profilFormateur";
import ListeFormateurs from "./components/listeFormateur";

// Evaluation
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

// UI & Layouts
import CalendarCard from "./components/CalendarCard";
import CombinedLayoutAdmin from "./components/CombinedLayoutAdmin";

// Factures & Honoraires
import FactureForm from "./components/FactureForm";
import HonoraireFormateurForm from "./components/HonoraireFormateurForm";
import ArchivePage from './components/ArchivePage';
import MesHonoraires from "./components/MesHonoraires";

// Calendars
import FormateurCalendar from "./components/FormateurCalendar";
import ClientCalendar from "./components/ClientCalendar";
import FacturesClient from "./components/FacturesClient";

function App() {
  return (
    <Router>
      <Routes>
        {/* Authentication & redirection */}
        <Route path="/" element={<Login />} />
        <Route path="/formnmotdepasse" element={<FormMotdepasse />} />
        <Route path="/mdp" element={<FormMotdepasse />} />

        {/* Home dashboards */}
        <Route path="/admin" element={<HomeAdmin />} />
        <Route path="/formateur" element={<HomeFormateur />} />
        <Route path="/entreprise" element={<HomeEntreprise />} />

        {/* Planning */}
        {/* <Route path="/planning" element={<ViewPlanning />} /> */}
        <Route path="/planningcal" element={<PlanningCalendar />} />
        <Route path="/calendarcard" element={<CalendarCard />} />
        <Route path="/formateur-calendar" element={<FormateurCalendar />} />
        <Route path="/client-calendar" element={<ClientCalendar />} />

        {/* Formations */}
        <Route path="/formationtable" element={<FormationTable />} />
        <Route path="/formationform" element={<FormationForm />} />
        <Route path="/validation" element={<ValidFormation />} />

        {/* Evaluation */}
        <Route path="/evaluations" element={<EvaluationFormateur />} />
        <Route path="/evalformation" element={<EvaluationFormation />} />
        <Route path="/fiche-formateur/:id" element={<FicheFormateurEvaluation />} />
        <Route path="/historiqueeval" element={<MesEvaluations />} />

        {/* Certifications */}
        <Route path="/certifications" element={<Certifications />} />
        <Route path="/addCertificationEntreprise" element={<AddCertificationsEntreprise />} />
        <Route path="/addCertificationParticipant" element={<AddCertificationsParticipant />} />
        <Route path="/updatecertif/:id" element={<UpdateCertif />} />
        <Route path="/certifprint/:id" element={<CertifPrintPage />} />

        {/* Utilisateurs & profils */}
        <Route path="/updateClient" element={<UpdateEntreprise />} />
        <Route path="/updateAdmin" element={<UpdateAdmin />} />
        <Route path="/updateForm" element={<UpdateFormateur />} />
        <Route path="/formateur/:id" element={<FormateurDetails />} />
        <Route path="/profilformateur/:id" element={<ProfilFormateur />} />
        <Route path="/listeformateur" element={<ListeFormateurs />} />
        <Route path="/adminformateurs" element={<AdminFormateurs />} />
        
        {/* Factures & honoraires */}
        <Route path="/facture" element={<FactureForm />} />
        <Route path="/honoraire" element={<HonoraireFormateurForm />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/mes-honoraires" element={<MesHonoraires />} />
        <Route path="/mes-factures" element={<FacturesClient />} />

        {/* Layouts & admin */}
        <Route path="/navsidad" element={<CombinedLayoutAdmin />} />
      </Routes>
    </Router>
  );
}

export default App;
