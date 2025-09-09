// HomeEntreprise.js
import { useEffect, useState } from "react";
import CombinedLayoutEntreprise from "./combinedLayoutEntreprise";
import { 
  FaUserCog, 
  FaUsers, 
  FaCalendarAlt, 
  FaRegCalendarCheck,
  FaFileUpload,
  FaChartBar,
  FaCalendarCheck
} from "react-icons/fa";
import "./homeEntreprise.css";

const HomeEntreprise = () => {
  const [info, setInfo] = useState({
    username: "",
    role: "",
    lastLoginDate: "",
    email: "",
   
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    document.title = "HomeEntreprise";
    document.body.style.backgroundColor = "#f5f7fa";

    setInfo({
      username: localStorage.getItem("username"),
      role: localStorage.getItem("role"),
      lastLoginDate: localStorage.getItem("lastLoginDate"),
      email: localStorage.getItem("email"),
     
    });
  }, []);

  const features = [
    {
      title: "Gérer Compte",
      icon: <FaUserCog size={28} />,
      color: "#d4edda",
      path: "/updateClient"
    },
    {
      title: "Liste des Formateurs",
      icon: <FaUsers size={28} />,
      color: "#f8d7da",
      path: "/listeformateur"
    },
    {
      title: "Disponibilités Formateurs",
      icon: <FaCalendarAlt size={28} />,
      color: "#cce5ff",
      path: "/client-calendar"
    },
    {
      title: "Mes Factures",
      icon: <FaRegCalendarCheck size={28} />,
      color: "#fff3cd",
      path: "/mes-factures"
    },
    {
      title: "Proposer Formations",
      icon: <FaFileUpload size={28} />,
      color: "#d1ecf1",
      path: "/proposer-formations"
    },
    {
      title: "Évaluation Formations",
      icon: <FaChartBar size={28} />,
      color: "#f8d7da",
      path: "/evaluation-formations"
    },
    {
      title: "Consulter Formations Programées",
      icon: <FaCalendarCheck size={28} />,
      color: "#cce5ff",
      path: "/formations-programmees"
    }
  ];

  const navigate = (path) => {
    window.location.href = path;
  };

  return (
    <CombinedLayoutEntreprise isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
      <div className="home-admin-wrapper">
        {/* Header */}
        <div className="home-admin-header">
          <h2>
            Bonjour <span className="home-admin-highlight">{info.username}</span> ({info.role})
          </h2>
          <p>
            {info.lastLoginDate && info.lastLoginDate !== "null"
              ? `Dernière connexion : ${info.lastLoginDate}`
              : "C'est votre première connexion"}
          </p>
          <p>Email : {info.email}</p>
          
        </div>

        {/* Grille des fonctionnalités */}
        <div className="admin-card-grid">
          {features.map((item, index) => (
            <div
              key={index}
              className="admin-card"
              style={{ backgroundColor: item.color }}
              onClick={() => navigate(item.path)}
            >
              <div className="admin-card-title">{item.title}</div>
              <div className="admin-card-icon">{item.icon}</div>
            </div>
          ))}
        </div>
      </div>
    </CombinedLayoutEntreprise>
  );
};

export default HomeEntreprise;
