import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
 import Login from"./components/login";
 import Home from"./components/home"; // Page après connexion
 //import PlanningFormateur from"./components/PlanningFormateur";
 import ViewPlanning from './components/ViewPlanning';
function App() {
 return (
 <Router>
 <Routes>
 <Route path="/" element={<Login />} />
 <Route path="/home" element={<Home />} />
 <Route path="/admin/planning" element={<ViewPlanning />} /> {/* ✅ Nouvelle route */}
 
 </Routes>
 </Router>
 );
 }
 export default App