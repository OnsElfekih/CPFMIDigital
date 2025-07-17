import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
 import Login from"./components/login";


 import FormationTable from "./components/FormationTable";
 import Home from"./components/home"; // Page après connexion

function App() {
 return (
 <Router>
 <Routes>
 <Route path="/" element={<Login />} />

 
 <Route path="/formations" element={<FormationTable />} /> 


 <Route path="/home" element={<Home />} />

 </Routes>
 </Router>
 );
 }
 export default App