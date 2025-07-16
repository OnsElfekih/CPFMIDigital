import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
 import Login from"./components/login";
 import Home from"./components/home"; // Page après connexion
import FormNMotDePasse from "./components/formnmotdepasse";
function App() {
 return (
 <Router>
 <Routes>
 <Route path="/" element={<Login />} />
 <Route path="/home" element={<Home />} />
  <Route path="/formnmotdepasse" element={<FormNMotDePasse/>} />
 </Routes>
 </Router>
 );
 }
 export default App