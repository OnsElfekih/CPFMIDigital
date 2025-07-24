import { useEffect, useState } from "react";
import axios from "axios";
import CombinedLayoutAdmin from "./CombinedLayoutAdmin";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./updateAdmin.css";

const UpdateAdmin = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const [admin, setAdmin] = useState({ username: "", email: "", password: "" });
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [adminId, setAdminId] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    document.title = "Mise à jour Admin";
    document.body.style.backgroundColor = "white";

    const id = localStorage.getItem("userId");
    setAdminId(id);

    if (id) {
      axios.get(`http://localhost:3001/users/${id}`)
        .then(res => {
          const adminData = res.data;
          setAdmin({
            username: adminData.username,
            email: adminData.email,
            password: ""
          });
          setOldPassword(adminData.password);
        })
        .catch(err => console.error("Erreur chargement admin :", err));
    }
  }, []);

  const checkPasswordSame = async () => {
  try {
    const res = await axios.post("http://localhost:3001/users/check-password", {
      userId: adminId,
      newPassword: admin.password
    });
    return res.data.isSame; // true si même mot de passe
  } catch {
    return false; // erreur, on considère différent
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdmin(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
e.preventDefault();
setError("");
setSuccess("");

if (!adminId) {
  setError("ID admin non trouvé");
  return;
}

if (admin.password !== confirmPassword) {
  setError("Les mots de passe ne correspondent pas");
  return;
}

const isSame = await checkPasswordSame();

if (isSame) {
  setError("Le nouveau mot de passe doit être différent de l'ancien");
  return;
}

    axios.put(`http://localhost:3001/users/${adminId}`, admin)
      .then(() => {
        setSuccess("La mise à jour a été faite avec succès");
        localStorage.setItem("username", admin.username);
        localStorage.setItem("email", admin.email);
        localStorage.setItem("password", admin.password);
        setOldPassword(admin.password);
      })
      .catch(err => {
        console.error("Erreur mise à jour admin :", err);
        setError("Erreur lors de la mise à jour");
      });
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
        <h2>Modifier votre profil</h2>
        {success && <p style={{ color: "green" }}>{success}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

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
            <label>nouveau mot de passe :</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={admin.password}
                onChange={handleChange}
                style={{ paddingRight: "30px" }}
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer"
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </span>
            </div>
          </div>

          <div>
            <label>Confirmer le mot de passe :</label>
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ paddingRight: "30px" }}
              />
              <span
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer"
                }}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </span>
            </div>
          </div>

          <button type="submit" className="update-admin-button">
            Modifier
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateAdmin;
