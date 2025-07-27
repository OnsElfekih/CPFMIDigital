import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CombinedLayoutAdmin from "./CombinedLayoutAdmin";
import axios from "axios";
import "./addCertificationEntreprise.css";

const AddCertificationsEntreprise = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const navigate = useNavigate(); // ajout

  const [formData, setFormData] = useState({
    nomSociete: "",
    theme: "",
    duree: "",
    datedebut: "",
    datefin: ""
  });
  const handleCancel = () => {
    navigate("/certifications");
  };
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => {
      const updated = { ...prev, [name]: value };

      // Calcul automatique de datefin
      if (name === "datedebut" || name === "duree") {
        const { datedebut, duree } = {
          ...updated,
          [name]: value
        };

        if (datedebut && duree) {
          const startDate = new Date(datedebut);
          startDate.setDate(startDate.getDate() + parseInt(duree));
          const formatted = startDate.toISOString().split("T")[0];
          updated.datefin = formatted;
        }
      }

      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

      // Vérifier si datedebut est passée
  const today = new Date();
  today.setHours(0,0,0,0); // pour comparer uniquement la date
  const selectedDate = new Date(formData.datedebut);

  if (selectedDate < today) {
    setError("La date de début ne peut pas être dans le passé");
    return;
  }

    try {
      await axios.post("http://localhost:3001/certifications/addcertifEntreprise", formData);
      setSuccess("Certification entreprise est ajoutée avec succès");
      setFormData({
        nomSociete: "",
        theme: "",
        duree: "",
        datedebut: "",
        datefin: ""
      });

      // Redirection après 3 secondes
      setTimeout(() => {
        navigate("/certifications");
      }, 2000);

    } catch (err) {
      console.error("Erreur lors de l'ajout :", err);
      setError("Erreur lors de l'ajout");
    }
  };

  return (
    <>
      <CombinedLayoutAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div
        className="form-container"
        style={{
          marginLeft: isSidebarOpen ? "210px" : "90px",
          marginTop: "80px",
          padding: "10px",
          transition: "margin-left 0.3s ease",
          width: "100%"
        }}
      >
        <h2>Ajouter une certification entreprise</h2>

        {success && <p style={{ color: "#F27405" }}>{success}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit} className="certification-form">
          <div>
            <input
              type="text"
              name="nomSociete"
              placeholder="Nom société"
              value={formData.nomSociete}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              type="text"
              name="theme"
              placeholder="Thème"
              value={formData.theme}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              type="text"
              name="duree"
              placeholder="Durée (en jours)"
              value={formData.duree}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              type="date"
              name="datedebut"
              placeholder="Date début"
              value={formData.datedebut}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <input
              type="date"
              name="datefin"
              placeholder="Date fin"
              value={formData.datefin}
              readOnly
            />
          </div>

          <button type="submit" className="button-ajouter">Ajouter</button>
          <button type="button" className="button-cancel" onClick={handleCancel}>Annuler</button>
        </form>
      </div>
    </>
  );
};

export default AddCertificationsEntreprise;
