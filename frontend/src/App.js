import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
 import Login from"./components/login";
 import Home from"./components/home"; 
 import FormationTable from "./components/FormationTable";
function App() {
 return (
 <Router>
 <Routes>
 <Route path="/" element={<Login />} />
 <Route path="/home" element={<Home />} />
 <Route path="/formations" element={<FormationTable />} /> 

 </Routes>
 </Router>
 );
 }
 export default App