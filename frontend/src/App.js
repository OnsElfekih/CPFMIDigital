import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
 import Login from"./components/login";


 import FormationTable from "./components/FormationTable";
 

function App() {
 return (
 <Router>
 <Routes>
 <Route path="/" element={<Login />} />

 
 <Route path="/formations" element={<FormationTable />} /> 




 </Routes>
 </Router>
 );
 }
 export default App