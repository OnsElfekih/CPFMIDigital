// src/components/FicheEvaluationFormateur.js

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function FicheEvaluationFormateur() {
  const [formateurs, setFormateurs] = useState([]);
  const [notes, setNotes] = useState({}); // {formateurId: { experiencePro: 3, ... }}

  const criteres = [
    { key: "experiencePro", label: "Expérience professionnelle" },
    { key: "experienceFormationContinue", label: "Expérience en formation continue" },
    { key: "experiencePedagogique", label: "Expérience pédagogique" },
    { key: "diplomes", label: "Diplômes" },
    { key: "honoraires", label: "Honoraires" },
    { key: "deontologie", label: "Déontologie" },
    { key: "comportement", label: "Comportement" }
  ];

  useEffect(() => {
    axios.get("/api/formateurs")
      .then(res => setFormateurs(res.data))
      .catch(err => console.error("Erreur chargement formateurs :", err));
  }, []);

  const handleChange = (formateurId, critere, value) => {
    setNotes(prev => ({
      ...prev,
      [formateurId]: {
        ...prev[formateurId],
        [critere]: parseInt(value)
      }
    }));
  };

  const calculerScore = (formateurId) => {
    const data = notes[formateurId];
    if (!data) return "0%";
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    const moyenne = total / criteres.length;
    return `${Math.round((moyenne / 5) * 100)}%`;
  };

  const handleSubmit = async (formateurId) => {
    const evaluation = {
      formateurId,
      notes: notes[formateurId]
    };

    try {
      await axios.post("/api/evaluation/add", evaluation);
      alert("Évaluation enregistrée !");
    } catch (err) {
      alert("Erreur lors de l’envoi !");
      console.error(err);
    }
  };

  return (
    <div>
      <h2>📋 Évaluation des Formateurs</h2>
      <table border="1" cellPadding={6} style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th>Formateur</th>
            <th>Diplôme</th>
            <th>Domaine de Compétence</th>
            {criteres.map((c, i) => (
              <th key={i}>{c.label}</th>
            ))}
            <th>Score</th>
            <th>Valider</th>
          </tr>
        </thead>
        <tbody>
          {formateurs.map(formateur => (
            <tr key={formateur._id}>
              <td>{formateur.nom}</td>
              <td>{formateur.diplome}</td>
              <td>{formateur.domaine}</td>
              {criteres.map((c, i) => (
                <td key={i}>
                  <select
                    value={notes[formateur._id]?.[c.key] || 1}
                    onChange={(e) => handleChange(formateur._id, c.key, e.target.value)}
                  >
                    {[1, 2, 3, 4, 5].map(val => (
                      <option key={val} value={val}>{val}</option>
                    ))}
                  </select>
                </td>
              ))}
              <td style={{ backgroundColor: "red", color: "white" }}>
                {calculerScore(formateur._id)}
              </td>
              <td>
                <button onClick={() => handleSubmit(formateur._id)}>Valider</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
