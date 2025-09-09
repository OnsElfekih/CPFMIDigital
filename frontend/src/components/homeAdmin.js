// HomeAdmin.js
import { useEffect, useState } from "react";
import CombinedLayoutAdmin from "./CombinedLayoutAdmin";
import "./homeAdmin.css";
import { useNavigate } from "react-router-dom";
import {
  FaUsers,
  FaChalkboardTeacher,
  FaPlus,
  FaCalendarAlt,
  FaMoneyCheckAlt,
  FaFileInvoice,
  FaChartBar,
  FaCertificate,
  FaFileUpload,     // pour Créer Formations
  FaCheckCircle,    // pour Valider Formations
  FaEye             // pour Consulter Évaluations
} from "react-icons/fa";

const HomeAdmin = () => {
  const [info, setInfo] = useState({
    username: "",
    role: "",
    lastLoginDate: "",
    email: "",
    ip: ""
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "HomeAdmin";
    document.body.style.backgroundColor = "#f5f7fa";

    setInfo({
      username: localStorage.getItem("username"),
      role: localStorage.getItem("role"),
      lastLoginDate: localStorage.getItem("lastLoginDate"),
      email: localStorage.getItem("email"),
      ip: localStorage.getItem("ip")
    });
  }, []);

  const features = [
    {
      title: "Gestion Entreprises",
      icon: <FaUsers size={28} />,
      color: "#D1E7DD",
      path: "/Gestion-Entreprises"
    },
    {
      title: "Gestion Formateurs",
      icon: <FaChalkboardTeacher size={28} />,
      color: "#C8E6C9",
      path: "/adminformateurs"
    },
    {
      title: "Ajouter Formations",
      icon: <FaPlus size={28} />,
      color: "#F8D7DA",
      path: "/formationtable"
    },
    {
      title: "Créer Formations",
      icon: <FaFileUpload size={28} />,
      color: "#CCE5FF",
      path: "/creerFormation"
    },
    {
      title: "Valider Formations",
      icon: <FaCheckCircle size={28} />,
      color: "#D1ECF1",
      path: "/validerFormation"
    },
    {
      title: "Consulter Évaluations",
      icon: <FaEye size={28} />,
      color: "#FFF3CD",
      path: "/consulterEvaluations"
    },
    {
      title: "Planning des Formations",
      icon: <FaCalendarAlt size={28} />,
      color: "#CCE5FF",
      path: "/planningcal"
    },
    {
      title: "Gérer Honoraires",
      icon: <FaMoneyCheckAlt size={28} />,
      color: "#FFF3CD",
      path: "/honoraire"
    },
    {
      title: "Gérer Factures",
      icon: <FaFileInvoice size={28} />,
      color: "#E2E3E5",
      path: "/facture"
    },
    {
      title: "Évaluation Formateurs",
      icon: <FaChartBar size={28} />,
      color: "#D1ECF1",
      path: "/evaluations"
    },
    {
      title: "Certificat Clients",
      icon: <FaCertificate size={28} />,
      color: "#D1E7DD",
      path: "/addCertificationEntreprise"
    },
    {
      title: "Certificat Formateurs",
      icon: <FaCertificate size={28} />,
      color: "#F8D7DA",
      path: "/addCertificationParticipant"
    }
  ];

  return (
    <CombinedLayoutAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
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
          <p>IP : {info.ip}</p>
        </div>

        {/* Grille des fonctionnalités */}
        <div className="admin-card-grid">
          {features.map((item, index) => (
            <div
              className={`admin-card ${
                item.title === "Gestion Formateurs" ? "gestion-formateurs" : ""
              }`}
              key={index}
              style={{ backgroundColor: item.color }}
              onClick={() => navigate(item.path)}
            >
              <div className="admin-card-title">{item.title}</div>
              <div className="admin-card-icon">{item.icon}</div>
            </div>
          ))}
        </div>
      </div>
    </CombinedLayoutAdmin>
  );
};

export default HomeAdmin;
