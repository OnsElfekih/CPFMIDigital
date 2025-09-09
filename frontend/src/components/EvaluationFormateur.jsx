import React, { useState, useEffect } from "react";
import axios from "axios";
import CombinedLayoutAdmin from "./CombinedLayoutAdmin";
import "./EvaluationFormateur.css";
import { Link } from "react-router-dom";

export default function EvaluationFormateur() {
  const [formateurs, setFormateurs] = useState([]);
  const [evaluations, setEvaluations] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    axios.get("http://localhost:3001/api/formateurs")
      .then((res) => setFormateurs(res.data))
      .catch((err) => console.error(err));
  }, []);

  const handleChange = (formateurId, critere, value) => {
    setEvaluations((prev) => ({
      ...prev,
      [formateurId]: {
        ...prev[formateurId],
        [critere]: Number(value)
      }
    }));
  };

  const calculateScore = (notes) => {
    const values = Object.values(notes || {});
    if (values.length === 0) return "0%";
    const total = values.reduce((a, b) => a + b, 0);
    return `${Math.round((total / (values.length * 5)) * 100)}%`;
  };

  const saveEvaluation = async (formateurId) => {
    const criteres = evaluations[formateurId];

    if (!criteres || Object.keys(criteres).length < 7) {
      alert("Veuillez remplir tous les critères pour ce formateur.");
      return;
    }

    try {
      await axios.post("http://localhost:3001/api/evaluationRoutes/add", {
        formateur: formateurId,
        criteres
      });

      alert("Évaluation enregistrée !");
    } catch (err) {
      console.error("Erreur:", err);
      alert("Échec de l'enregistrement.");
    }
  };

  return (
    <CombinedLayoutAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
      <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <div className="evaluation-container">
          <h2>Évaluation des formateurs</h2>
          <table className="evaluation-table">
            <thead>
              <tr>
                <th>Formateurs</th>
                <th>Diplôme</th>
                <th>Domaine</th>
                <th>Exp. prof.</th>
                <th>Exp. formation</th>
                <th>Exp. pédagogique</th>
                <th>Diplôme</th>
                <th>Honoraires</th>
                <th>Déontologie</th>
                <th>Comportement</th>
                <th>Score</th>
                <th>Action</th>
                <th>Fiche</th>
              </tr>
            </thead>
            <tbody>
              {formateurs.map((f) => {
                const evalData = evaluations[f._id] || {};
                return (
                  <tr key={f._id}>
                    <td>{f.nom} {f.prenom}</td>
                    <td>{f.diplome}</td>
                    <td>{f.domaine}</td>
                    <td>
                      <input type="number" min="1" max="5" value={evalData.experienceProfessionnelle || ""}
                        onChange={(e) => handleChange(f._id, "experienceProfessionnelle", e.target.value)} />
                    </td>
                    <td>
                      <input type="number" min="1" max="5" value={evalData.experienceFormationContinue || ""}
                        onChange={(e) => handleChange(f._id, "experienceFormationContinue", e.target.value)} />
                    </td>
                    <td>
                      <input type="number" min="1" max="5" value={evalData.experiencePedagogique || ""}
                        onChange={(e) => handleChange(f._id, "experiencePedagogique", e.target.value)} />
                    </td>
                    <td>
                      <input type="number" min="1" max="5" value={evalData.diplome || ""}
                        onChange={(e) => handleChange(f._id, "diplome", e.target.value)} />
                    </td>
                    <td>
                      <input type="number" min="1" max="5" value={evalData.honoraires || ""}
                        onChange={(e) => handleChange(f._id, "honoraires", e.target.value)} />
                    </td>
                    <td>
                      <input type="number" min="1" max="5" value={evalData.deontologie || ""}
                        onChange={(e) => handleChange(f._id, "deontologie", e.target.value)} />
                    </td>
                    <td>
                      <input type="number" min="1" max="5" value={evalData.comportement || ""}
                        onChange={(e) => handleChange(f._id, "comportement", e.target.value)} />
                    </td>
                    <td style={{ backgroundColor: "#ff4444", color: "white", fontWeight: "bold" }}>
                      {calculateScore(evalData)}
                    </td>
                    <td>
                      <button onClick={() => saveEvaluation(f._id)}>Enregistrer</button>
                    </td>
                    <td>
                      <Link to={`/fiche-formateur/${f._id}`}>
                        <button>Voir fiche</button>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </CombinedLayoutAdmin>
  );
}
