// EvaluationFormateur.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import "./EvaluationFormateur.css"; // pour les styles

export default function EvaluationFormateur() {
  const [formateurs, setFormateurs] = useState([]);
  const [evaluations, setEvaluations] = useState({}); // { formateurId: { critère: note } }

  useEffect(() => {
  axios.get("http://localhost:3001/api/formateurs")
    .then((res) => {
      setFormateurs(res.data);
      console.log("Formateurs reçus :", res.data); // 👈 Ajout
    })
    .catch((err) => console.error("Erreur chargement formateurs:", err));
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
    if (!criteres) return alert("Veuillez noter ce formateur.");

    try {
      await axios.post("http://localhost:3001/api/evaluationRoutes/add", {
        formateur: formateurId,
        criteres
      });
      alert("Évaluation enregistrée !");
    } catch (err) {
      console.error("Erreur enregistrement:", err);
    }
  };

  return (
    <div className="evaluation-container">
      <h2>Évaluation des formateurs</h2>
      <table className="evaluation-table">
        <thead>
          <tr>
            <th>Formateurs</th>
            <th>Diplôme</th>
            <th>Domaine de compétences</th>
            <th>Exp. prof.</th>
            <th>Exp. formation continue</th>
            <th>Exp. pédagogique</th>
            <th>Diplôme</th>
            <th>Honoraires</th>
            <th>Déontologie</th>
            <th>Score</th>
            <th>Action</th>
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
                <td><input type="number" min="1" max="5" value={evalData.experienceProfessionnelle || ""} onChange={(e) => handleChange(f._id, "experienceProfessionnelle", e.target.value)} /></td>
                <td><input type="number" min="1" max="5" value={evalData.experienceFormationContinue || ""} onChange={(e) => handleChange(f._id, "experienceFormationContinue", e.target.value)} /></td>
                <td><input type="number" min="1" max="5" value={evalData.experiencePedagogique || ""} onChange={(e) => handleChange(f._id, "experiencePedagogique", e.target.value)} /></td>
                <td><input type="number" min="1" max="5" value={evalData.diplome || ""} onChange={(e) => handleChange(f._id, "diplome", e.target.value)} /></td>
                <td><input type="number" min="1" max="5" value={evalData.honoraires || ""} onChange={(e) => handleChange(f._id, "honoraires", e.target.value)} /></td>
                <td><input type="number" min="1" max="5" value={evalData.deontologie || ""} onChange={(e) => handleChange(f._id, "deontologie", e.target.value)} /></td>
                <td style={{ backgroundColor: "#ff4444", color: "white", fontWeight: "bold" }}>
                  {calculateScore(evalData)}
                </td>
                <td>
                  <button onClick={() => saveEvaluation(f._id)}>Enregistrer</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
