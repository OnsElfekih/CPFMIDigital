// HomeFormateur.js
import { useEffect, useState } from "react";
import CombinedLayoutFormateur from "./combinedLayoutFormateur";
import { 
  FaMoneyCheckAlt, 
  FaCalendarAlt, 
  FaBookOpen, 
  FaCheckSquare 
} from "react-icons/fa";
import "./homeFormateur.css";

const HomeFormateur = () => {
  const [info, setInfo] = useState({
    username: "",
    role: "",
    lastLoginDate: "",
    email: "",
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    document.title = "Panel Formateur";
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
      title: "Notes d'Honoraires",
      icon: <FaMoneyCheckAlt size={28} />,
      color: "#f8d7da",
      path: "/mes-honoraires"
    },
    {
      title: "Gérer Disponibilités",
      icon: <FaCalendarAlt size={28} />,
      color: "#d1ecf1",
      path: "/formateur-calendar"
    },
    {
      title: "Consultation Formations",
      icon: <FaBookOpen size={28} />,
      color: "#d4edda",
      path: "/formations"
    },
    {
      title: "Validation Présences",
      icon: <FaCheckSquare size={28} />,
      color: "#cfe2ff",
      path: "/validation-presences"
    }
  ];

  const navigate = (path) => {
    window.location.href = path;
  };

  return (
    <CombinedLayoutFormateur isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
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
    </CombinedLayoutFormateur>
  );
};

export default HomeFormateur;
