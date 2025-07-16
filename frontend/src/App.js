import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
 import Login from"./components/login";
import FormNMotDePasse from "./components/formnmotdepasse";
import HomeAdmin from "./components/homeAdmin";
import HomeEntreprise from "./components/homeEntreprise";
import HomeFormateur from "./components/homeFormateur";
function App() {
 return (
 <Router>
 <Routes>
 <Route path="/" element={<Login />} />
<Route path="/formnmotdepasse" element={<FormNMotDePasse/>} />
<Route path="/homeAdmin" element={<HomeAdmin/>} />
<Route path="/homeEntreprise" element={<HomeEntreprise/>} />
<Route path="/homeFormateur" element={<HomeFormateur/>} />
 </Routes>
 </Router>
 );
 }
 export default App