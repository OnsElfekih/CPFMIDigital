import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CombinedLayoutAdmin from "./CombinedLayoutAdmin"; 
import "./EvaluationFormateur.css"; 

export default function FicheFormateurEvaluation() {
  const { id } = useParams(); // formateur ID
  const [evaluations, setEvaluations] = useState([]);
  const [formateur, setFormateur] = useState(null);
  const [commentaires, setCommentaires] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const criteresLabels = {
    experienceProfessionnelle: "Expérience professionnelle",
    experienceFormationContinue: "Expérience en formation continue",
    experiencePedagogique: "Expérience pédagogique",
    diplome: "Diplôme",
    honoraires: "Honoraires",
    deontologie: "Déontologie",
    comportement: "Comportement"
  };

  useEffect(() => {
    axios.get(`http://localhost:3001/api/formateurs/${id}`)
      .then((res) => setFormateur(res.data))
      .catch(console.error);

      axios.get(`http://localhost:3001/api/evaluationRoutes/byformateur/${id}`)
      .then((res) => setEvaluations(res.data))
      .catch((err) => console.error("Erreur fetch évaluations:", err));

    axios.get("http://localhost:3001/api/evaluationRoutes/")
      .then((res) => {
        const filtrées = res.data.filter(e => e.formateur._id === id);
        setEvaluations(filtrées);
      })
      .catch(console.error);
  }, [id]);

  return (
    <CombinedLayoutAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
      <div style={{ padding: "30px" }}>
        <h2>📄 Fiche d’Évaluation du Formateur</h2>

        {formateur && (
          <div style={{ marginBottom: "20px" }}>
            <p><strong>Nom :</strong> {formateur.nom} {formateur.prenom}</p>
            <p><strong>Domaine :</strong> {formateur.domaine}</p>
            <p><strong>Diplôme :</strong> {formateur.diplome}</p>
          </div>
        )}

        {evaluations.length === 0 ? (
          <p>Aucune évaluation disponible.</p>
        ) : (
          evaluations.map((evalItem, index) => {
            const scorePourcent = Math.round((evalItem.moyenne / 5) * 100);
            const statut = scorePourcent >= 60 ? "✅ Accepté" : "❌ Refusé";

            return (
              <div key={index} style={{
                border: "1px solid #ccc",
                padding: "15px",
                marginBottom: "20px",
                borderRadius: "10px",
                backgroundColor: "#f9f9f9"
              }}>
                <p><strong>Date :</strong> {new Date(evalItem.dateEvaluation).toLocaleDateString()}</p>
                <p><strong>Moyenne :</strong> {evalItem.moyenne.toFixed(2)} / 5 ({scorePourcent}%)</p>
                <p><strong>Statut :</strong> {statut}</p>

                <ul>
                  {Object.entries(evalItem.criteres).map(([key, note], i) => (
                    <li key={i}>
                      <strong>{criteresLabels[key]}:</strong> {note} / 5
                    </li>
                  ))}
                </ul>

                <div style={{ marginTop: "10px" }}>
                  <label><strong>Commentaire :</strong></label><br />
                  <textarea
                    rows={3}
                    cols={60}
                    placeholder="Ajouter un commentaire..."
                    value={commentaires[index] || ""}
                    onChange={(e) =>
                      setCommentaires({ ...commentaires, [index]: e.target.value })
                    }
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </CombinedLayoutAdmin>
  );
}
