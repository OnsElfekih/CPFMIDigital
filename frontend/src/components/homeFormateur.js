import { useEffect, useState } from "react";
import CombinedLayoutFormateur from "./combinedLayoutFormateur";

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
        className="flex flex-col items-center justify-center"
        style={{
          marginLeft: isSidebarOpen ? "210px" : "90px", // décalage léger ajouté
          marginTop: "80px",
          padding: "10px", // petit padding ajouté
          transition: "margin-left 0.3s ease"
        }}
      >
        <p className="text-xl font-bold">
          Bonjour : {info.role} du {info.username}
        </p>
        <p>
          {info.lastLoginDate && info.lastLoginDate !== "null"
            ? `Vous avez connecté la dernière fois : ${info.lastLoginDate}`
            : "C'est votre première connexion"}
        </p>
        <p>Vous avez connecté avec votre email : {info.email}</p>
        <p>Avec l'IP : {info.ip}</p>
      </div>
    </>
  );
};

export default HomeFormateur;
