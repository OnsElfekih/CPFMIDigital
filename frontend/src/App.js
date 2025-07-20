import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
 import Login from"./components/login";
 import Home from"./components/home"; // Page après connexion
function App() {
 return (
 <Router>
 <Routes>
 <Route path="/" element={<Login />} />
 <Route path="/home" element={<Home />} />
 </Routes>
 </Router>
 );
 }
 export default App