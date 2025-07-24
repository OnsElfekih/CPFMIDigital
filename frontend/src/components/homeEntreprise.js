import { useEffect, useState } from "react";
import CombinedLayoutEntreprise from "./combinedLayoutEntreprise";
import "./homeEntreprise.css";

const HomeEntreprise = () => {
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
    document.title = "HomeEntreprise";
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
      <CombinedLayoutEntreprise isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className="home-entreprise-container"
        style={{
          marginLeft: isSidebarOpen ? "210px" : "90px",
          marginTop: "80px",
          transition: "margin-left 0.3s ease"
        }}
      >
        <p className="home-entreprise-title">
          Bonjour : <span className="home-entreprise-highlight">{info.role}</span> du <span className="home-entreprise-highlight">{info.username}</span>
        </p>
        <p className="home-entreprise-subtitle">
          {info.lastLoginDate && info.lastLoginDate !== "null"
            ? `Vous avez connecté la dernière fois : ${info.lastLoginDate}`
            : "C'est votre première connexion"}
        </p>
        <p className="home-entreprise-text">
          Vous avez connecté avec votre email : {info.email}
        </p>
        <p className="home-entreprise-text">
          Avec l'IP : {info.ip}
        </p>
      </div>
    </>
  );
};

export default HomeEntreprise;
