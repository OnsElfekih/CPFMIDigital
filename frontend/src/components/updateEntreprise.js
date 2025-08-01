import { useEffect, useState } from "react";
import axios from "axios";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import "./updateEntreprise.css";
import { useNavigate } from "react-router-dom";
import CombinedLayoutEntreprise from "./combinedLayoutEntreprise";

const UpdateEntreprise = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const [entreprise, setEntreprise] = useState({ username: "", email: "", password: "" });
    const [entrepriseId, setEntrepriseId] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    document.title = "Mise à jour Entreprise";
    document.body.style.backgroundColor = "white";

const id = localStorage.getItem("userId");
setEntrepriseId(id);

if (id) {
  axios.get(`http://localhost:3001/users/${id}`)
    .then(res => {
      const entrepriseData = res.data;
      setEntreprise({
        username: entrepriseData.username,
        email: entrepriseData.email,
        password: ""
      });
      setOldPassword(entrepriseData.password);
    })
    .catch(err => console.error("Erreur chargement entreprise :", err));
}

  }, []);

  const checkPasswordSame = async () => {
  try {
    const res = await axios.post("http://localhost:3001/users/check-password", {
      userId: entrepriseId,
      newPassword: entreprise.password
      
    });
    return res.data.isSame; // true si même mot de passe
  } catch {
    return false; // erreur, on considère différent
  }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntreprise(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
e.preventDefault();
setError("");
setSuccess("");

if (!entrepriseId) {
  setError("ID entreprise non trouvé");
  return;
}

if (entreprise.password !== confirmPassword) {
  setError("Les mots de passe ne correspondent pas");
  return;
}

const isSame = await checkPasswordSame();

if (isSame) {
  setError("Le nouveau mot de passe doit être différent de l'ancien");
  return;
}

    axios.put(`http://localhost:3001/users/${entrepriseId}`, entreprise)
      .then(() => {
        setSuccess("La mise à jour a été faite avec succès");
        localStorage.setItem("username", entreprise.username);
        localStorage.setItem("email", entreprise.email);
        localStorage.setItem("password", entreprise.password);
        setOldPassword(entreprise.password);
        setTimeout(() => {
        navigate("/homeEntreprise");
      }, 2000);
      })
      .catch(err => {
        console.error("Erreur mise à jour entreprise :", err);
        setError("Erreur lors de la mise à jour");
      });
  };

  return (
    <>
      <CombinedLayoutEntreprise isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className="update-entreprise-container"
        style={{
          marginLeft: isSidebarOpen ? "210px" : "90px",
          marginTop: "80px",
          padding: "10px",
          transition: "margin-left 0.3s ease",
          width: "100%"
        }}
      >
        <h2>Modifier votre profil</h2>
        {success && <p style={{ color: "#F27405" }}>{success}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <form className="update-entreprise-form" onSubmit={handleSubmit}>
          <div>
            <label>Nom d'utilisateur :</label>
            <input
              type="text"
              name="username"
              value={entreprise.username}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>Email :</label>
            <input
              type="email"
              name="email"
              value={entreprise.email}
              onChange={handleChange}
            />
          </div>

          <div>
            <label>nouveau mot de passe :</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={entreprise.password}
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

          <button type="submit" className="update-entreprise-button">
            Modifier
          </button>
        </form>
      </div>
    </>
  );
};

export default UpdateEntreprise;
