import { useEffect, useState } from "react";
import axios from "axios";
import CombinedLayoutAdmin from "./CombinedLayoutAdmin";
import "./updateAdmin.css";

const UpdateAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const [admin, setAdmin] = useState({ username: "", email: "", password: "" });
  const [adminId, setAdminId] = useState("");

  useEffect(() => {
    document.title = "Mise à jour Admin";
    document.body.style.backgroundColor = "white";

    const id = localStorage.getItem("userId");
    console.log("User ID récupéré dans updateAdmin :", id);
    setAdminId(id);

    if (id) {
      axios.get(`http://localhost:3001/users/${id}`)
        .then(res => {
          const adminData = res.data;
          setAdmin({
            username: adminData.username,
            email: adminData.email,
            password: adminData.password
          });
        })
        .catch(err => console.error("Erreur chargement admin :", err));
    } else {
      console.error("Aucun ID admin trouvé dans localStorage");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!adminId) return alert("ID admin non trouvé");

    axios.put(`http://localhost:3001/users/${adminId}`, admin)
      .then(() => {
        alert("Admin mis à jour");
        localStorage.setItem("username", admin.username);
        localStorage.setItem("email", admin.email);
        localStorage.setItem("password", admin.password);
      })
      .catch(err => console.error("Erreur mise à jour admin :", err));
  };

  return (
    <>
      <CombinedLayoutAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className="update-admin-container"
        style={{
          marginLeft: isSidebarOpen ? "210px" : "90px",
          marginTop: "80px",
          padding: "10px",
          transition: "margin-left 0.3s ease",
          width: "100%"
        }}
      >
        <h2>Mise à jour de l'admin</h2>
        <form className="update-admin-form" onSubmit={handleSubmit}>
          <div>
            <label>Nom d'utilisateur :</label>
            <input
              type="text"
              name="username"
              value={admin.username}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Email :</label>
            <input
              type="email"
              name="email"
              value={admin.email}
              onChange={handleChange}
            />
          </div>
          <div>
          <label>Mot de passe :</label>
          <input
            type="password"
            name="password"
            value={admin.password}
            onChange={handleChange}
          />
        </div>
          <button type="submit" className="update-admin-button">
            Mettre à jour
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateAdmin;
