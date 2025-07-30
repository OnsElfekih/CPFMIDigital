import { useState, useEffect } from "react";
import axios from "axios";
import CombinedLayoutEntreprise from "./combinedLayoutEntreprise";
import "./evaluationformation.css";
import { useNavigate } from "react-router-dom"; // import

function EvaluationFormation({ onSuccess }) {
  const [clientId, setClientId] = useState(null);
  const [clientName, setClientName] = useState("");
  const [formationNom, setFormationNom] = useState("");
  const [note, setNote] = useState(0);
  const [commentaire, setCommentaire] = useState("");
  const [anonyme, setAnonyme] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // hook de navigation

useEffect(() => {
  const storedClientId = localStorage.getItem("userId"); // clé utilisée dans login
  const storedName = localStorage.getItem("username");
  if (storedClientId) setClientId(storedClientId);
  if (storedName) setClientName(storedName);
}, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const handleCancel = () => {
    navigate("/historiqueeval");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!clientId) {
      setError("clientId manquant ou invalide");
      return;
    }

    if (!formationNom.trim()) {
      setError("Le nom d'une formation est obligatoire.");
      return;
    }

    try {
      await axios.post("http://localhost:3001/evalformation/allevalform", {
        formationNom,
        note,
        commentaire,
        anonyme,
        clientId,
      });

      setSubmitted(true);
      setFormationNom("");
      setNote(0);
      setCommentaire("");
      setAnonyme(false);

      if (onSuccess) onSuccess();
    } catch (err) {
      setError("Échec de l’envoi de l’évaluation.");
      console.error(err);
    }
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          onClick={() => setNote(i)}
          className={i <= note ? "selected" : ""}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") setNote(i);
          }}
          aria-label={`${i} étoiles`}
        >
          ★
        </span>
      );
    }
    return <div className="star-rating">{stars}</div>;
  };

  return (
    <>
      <CombinedLayoutEntreprise isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className="flex flex-col items-center justify-center"
        style={{
          marginLeft: isSidebarOpen ? "210px" : "90px",
          marginTop: "80px",
          padding: "10px",
          transition: "margin-left 0.3s ease",
          width: "100%",
        }}
      >
        <h2 className="title">
          Évaluation d'une formation pour le client{" "}
          <span style={{ fontWeight: "bold", color: "#F27405" }}>{clientName}</span>
        </h2>

        <form onSubmit={handleSubmit} className="evaluation-form">
          <div>
            <label>Nom de la formation</label>
            <input
              type="text"
              value={formationNom}
              onChange={(e) => setFormationNom(e.target.value)}
              placeholder="Tapez le nom de la formation"
              required
            />
          </div>

          <div>
            <label>Note (1-5)</label>
            {renderStars()}
          </div>

          <div>
            <label>Commentaire</label>
            <textarea
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              placeholder="Votre avis"
              rows={4}
            />
          </div>

          <div className="checkbox-wrapper">
            <label>
              <input
                type="checkbox"
                checked={anonyme}
                onChange={() => setAnonyme(!anonyme)}
              />
              Anonyme
            </label>
          </div>

          <button type="submit" className="btn-ajouter">
            Soumettre
          </button>
<button type="button" className="btn-annuler" onClick={handleCancel}>
  Annuler
</button>

          {submitted && <p style={{ color: "green", marginTop: "10px" }}>Évaluation enregistrée.</p>}
          {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
        </form>
      </div>
    </>
  );
}

export default EvaluationFormation;
