import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CombinedLayoutAdmin from "./CombinedLayoutAdmin";
import axios from "axios";
import "./updateCertification.css";

const UpdateCerif = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [certif, setCertif] = useState(null);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    document.title = "Editer Certification";
    document.body.style.backgroundColor = "white";

    axios.get(`http://localhost:3001/certifications/${id}`)
      .then(res => setCertif(res.data))
      .catch(err => {
        console.error("Erreur récupération certification:", err);
        setError("Erreur lors de la récupération des données");
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setCertif(prev => {
      const updated = { ...prev, [name]: value };

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

  const today = new Date();
  today.setHours(0,0,0,0);

  const selectedDate = new Date(certif.datedebut);

  if (selectedDate < today) {
    setError("La date de début ne peut pas être dans le passé");
    return;
  }

  try {
    await axios.put(`http://localhost:3001/certifications/${id}`, certif);
    setSuccess("Certification modifiée avec succès");

    setTimeout(() => {
      navigate("/certifications");
    }, 2000);
  } catch (err) {
    console.error("Erreur modification:", err);
    setError("Erreur lors de la modification");
  }
};

  const handleCancel = () => {
    navigate("/certifications");
  };

  if (!certif) return <div>Chargement...</div>;

  return (
    <>
      <CombinedLayoutAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
<div
  className="form-container"
  style={{
    marginLeft: isSidebarOpen ? "210px" : "90px",
    transition: "margin-left 0.3s ease",
    width: "100%",
      justifyContent: "center",
  alignItems: "center",
  }}
>

        <h2>Editer Certification</h2>

        {success && <p style={{ color: "#F27405" }}>{success}</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <form onSubmit={handleSubmit} className="update-certification-form">
          <label>Nom société actuel:</label>
          <input
            type="text"
            name="nomSociete"
            value={certif.nomSociete}
            onChange={handleChange}
            placeholder="Nom société"
          />

          {certif.nomPrenomPart && (
            <>
              <label>Nom participant actuel:</label>
              <input
                type="text"
                name="nomPrenomPart"
                value={certif.nomPrenomPart}
                onChange={handleChange}
                placeholder="Nom participant"
              />
            </>
          )}

          <label>Thème actuel:</label>
          <input
            type="text"
            name="theme"
            value={certif.theme}
            onChange={handleChange}
            placeholder="Thème"
          />

          <label>Durée actuelle:</label>
          <input
            type="number"
            name="duree"
            value={certif.duree}
            onChange={handleChange}
            placeholder="Durée"
            style={{ width: "500px" }}  // largeur fixe
          />

          <label>Date début actuelle:</label>
          <input
            type="date"
            name="datedebut"
            value={certif.datedebut?.substr(0, 10)}
            onChange={handleChange}
          />

          <label>Date fin actuelle:</label>
          <input
            type="date"
            name="datefin"
            value={certif.datefin?.substr(0, 10)}
            readOnly
          />

          <button type="submit" className="button-update">Modifier</button>
          <button type="button" className="button-cancel" onClick={handleCancel}>Annuler</button>
        </form>
      </div>
    </>
  );
};

export default UpdateCerif;
