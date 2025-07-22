import { useEffect, useState } from "react";
import axios from "axios";
import CombinedLayoutFormateur from "./combinedLayoutFormateur";
import "./updatedFormateur.css";

const UpdateFormateur= () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const [formateur, setFormateur] = useState({ username: "", email: "" , password: ""});
  const [formateurId, setFormateurId] = useState("");

  useEffect(() => {
    document.title = "Mise à jour Formateur";
    document.body.style.backgroundColor = "white";

    const id = localStorage.getItem("userId");
    console.log("User ID récupéré dans updateFormateur :", id);
    setFormateurId(id);

    if (id) {
      axios.get(`http://localhost:3001/users/${id}`)
        .then(res => {
          const formateurData = res.data;
          setFormateur({
            username: formateurData.username,
            email: formateurData.email,
            password:formateurData.password
          });
        })
        .catch(err => console.error("Erreur chargement formateur :", err));
    } else {
      console.error("Aucun ID formateur trouvé dans localStorage");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormateur(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formateurId) return alert("ID formateur non trouvé");

    axios.put(`http://localhost:3001/users/${formateurId}`, formateur)
      .then(() => {
        alert("Formateur mis à jour");
        localStorage.setItem("username", formateur.username);
        localStorage.setItem("email", formateur.email);
        localStorage.setItem("password", formateur.password);
      })
      .catch(err => console.error("Erreur mise à jour formateur :", err));
  };

  return (
    <>
      <CombinedLayoutFormateur isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className="update-formateur-container"
        style={{
          marginLeft: isSidebarOpen ? "210px" : "90px",
          marginTop: "80px",
          padding: "10px",
          transition: "margin-left 0.3s ease",
          width: "100%"
        }}
      >
        <h2>Mise à jour du formateur</h2>
        <form className="update-formateur-form" onSubmit={handleSubmit}>
          <div>
            <label>Nom d'utilisateur :</label>
            <input
              type="text"
              name="username"
              value={formateur.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Email :</label>
            <input
              type="email"
              name="email"
              value={formateur.email}
              onChange={handleChange}
            />
          </div>
            <div>
          <label>Mot de passe :</label>
          <input
            type="password"
            name="password"
            value={formateur.password}
            onChange={handleChange}
          />
        </div>
          
          <button type="submit" className="update-formateur-button">
            Mettre à jour
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateFormateur;
