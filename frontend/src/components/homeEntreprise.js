import { useEffect, useState } from "react";

const HomeEntreprise = () => {
  const [info, setInfo] = useState({
    username: "",
    role: "",
    lastLoginDate: "",
    email: "",
    ip: ""
  });

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
  <div className="flex flex-col items-center justify-center h-screen space-y-2">
    <p className="text-xl font-bold">Bonjour : {info.role}, du {info.username}</p>
    <p>
      {info.lastLoginDate && info.lastLoginDate !== "null"
        ? `Vous avez connecté la dernière fois : ${info.lastLoginDate}`
        : "C'est votre première connexion"}
    </p>
    <p>Vous avez connecté avec votre email : {info.email}</p>
    <p>Avec l'IP : {info.ip}</p>
  </div>
);

};

export default HomeEntreprise;
