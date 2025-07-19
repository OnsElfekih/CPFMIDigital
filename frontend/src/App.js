import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
 import Login from"./components/login";


 import FormationTable from "./components/FormationTable";

import HomeAdmin from "./components/homeAdmin";
import HomeEntreprise from "./components/homeEntreprise";
import HomeFormateur from "./components/homeFormateur";
import FormNMotDePasse from "./components/formnmotdepasse";
import CalendarCard from "./components/CalendarCard";
import FormationForm from "./components/FormationForm";
import ViewPlanning from "./components/ViewPlanning";
import CombinedLayoutAdmin from "./components/CombinedLayoutAdmin";

function App() {
 return (
 <Router>
 <Routes>
 <Route path="/" element={<Login />} />
 <Route path="/formations" element={<FormationTable />} /> 
  <Route path="/homeadmin" element={<HomeAdmin/>} />
   <Route path="/homeentreprise" element={<HomeEntreprise/>} />
    <Route path="/homeformateur" element={<HomeFormateur />} />
    <Route path="/formnmotdepasse" element={<FormNMotDePasse/>} />
    <Route path="/CalendarCard" element={<CalendarCard/>} />
    <Route path="/FormationForm" element={<FormationForm/>} />
     <Route path="/Planning" element={<ViewPlanning/>} />
    <Route path="/formations" element={<FormationTable/>} />
    <Route path="/navsidad" element={<CombinedLayoutAdmin/>} />

 </Routes>
 </Router>
 );
 }
 export default App