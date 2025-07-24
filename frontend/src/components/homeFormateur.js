import { useEffect, useState } from "react";
import CombinedLayoutFormateur from "./combinedLayoutFormateur";
import "./homeFormateur.css";

const HomeFormateur = () => {
  const [info, setInfo] = useState({
    username: "",
    role: "",
    lastLoginDate: "",
    email: "",
    ip: ""
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    document.title = "HomeFormateur";
    document.body.style.backgroundColor = "white";

    setInfo({
      username: localStorage.getItem("username"),
      role: localStorage.getItem("role"),
      lastLoginDate: localStorage.getItem("lastLoginDate"),
      email: localStorage.getItem("email"),
      ip: localStorage.getItem("ip")
    });
  }, []);

  return (
    <>
      <CombinedLayoutFormateur isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className="home-formateur-container"
        style={{
          marginLeft: isSidebarOpen ? "210px" : "90px",
          marginTop: "80px",
          transition: "margin-left 0.3s ease"
        }}
      >
        <p className="home-formateur-title">
          Bonjour : <span className="home-formateur-highlight">{info.role}</span> du <span className="home-formateur-highlight">{info.username}</span>
        </p>
        <p className="home-formateur-subtitle">
          {info.lastLoginDate && info.lastLoginDate !== "null"
            ? `Vous avez connecté la dernière fois : ${info.lastLoginDate}`
            : "C'est votre première connexion"}
        </p>
        <p className="home-formateur-text">
          Vous avez connecté avec votre email : {info.email}
        </p>
        <p className="home-formateur-text">
          Avec l'IP : {info.ip}
        </p>
        <div className="home-formateur-footer">
          Panel Formateur
        </div>
      </div>
    </>
  );
};

export default HomeFormateur;
