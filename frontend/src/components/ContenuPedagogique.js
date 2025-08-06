import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function ContenuPedagogique({ formationId }) {
  const [contenu, setContenu] = useState("");
  const [objectifsDisponibles, setObjectifsDisponibles] = useState([]);
  const [competencesDisponibles, setCompetencesDisponibles] = useState([]);
  const [objectifs, setObjectifs] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [loading, setLoading] = useState(true);

  // Charger données au montage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [formationRes, objRes, compRes] = await Promise.all([
          axios.get(`/api/formations/${formationId}`),
          axios.get("/api/objectifs"),
          axios.get("/api/competences"),
        ]);

        const formation = formationRes.data;
        setContenu(formation.contenuPedagogique || "");
        setObjectifs(formation.objectifs || []);
        setCompetences(formation.competences || []);
        setObjectifsDisponibles(objRes.data);
        setCompetencesDisponibles(compRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur de chargement", err);
        setLoading(false);
      }
    };

    fetchData();
  }, [formationId]);

  const handleSubmit = async () => {
    try {
      await axios.put(`/api/formations/${formationId}/contenu`, {
        contenuPedagogique: contenu,
        objectifs,
        competences,
      });

      alert("Contenu pédagogique enregistré !");
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'enregistrement.");
    }
  };

  if (loading) return <p>Chargement...</p>;

  return (
    <div className="contenu-container" style={{ padding: "20px" }}>
      <h2>Contenu pédagogique</h2>

      <ReactQuill value={contenu} onChange={setContenu} theme="snow" style={{ height: "300px", marginBottom: "30px" }} />

      <div style={{ marginBottom: "20px" }}>
        <h3>Objectifs pédagogiques</h3>
        <select multiple value={objectifs} onChange={(e) =>
          setObjectifs(Array.from(e.target.selectedOptions, opt => opt.value))
        }>
          {objectifsDisponibles.map(obj => (
            <option key={obj._id} value={obj.nom}>{obj.nom}</option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <h3>Compétences visées</h3>
        <select multiple value={competences} onChange={(e) =>
          setCompetences(Array.from(e.target.selectedOptions, opt => opt.value))
        }>
          {competencesDisponibles.map(comp => (
            <option key={comp._id} value={comp.nom}>{comp.nom}</option>
          ))}
        </select>
      </div>

      <button onClick={handleSubmit}>💾 Enregistrer</button>
    </div>
  );
}
