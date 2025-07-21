import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"; // si tu utilises React Router
import FicheFormateur from "../components/FicheFormateur";
import axios from "axios";

export default function FormateurDetails() {
  const { id } = useParams(); // ID du formateur depuis l'URL
  const [formateur, setFormateur] = useState(null);

  useEffect(() => {
    axios.get(`/api/formateurs/${id}`)
      .then((res) => setFormateur(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!formateur) return <p>Chargement...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Détails du Formateur</h1>
      <div style={{ marginBottom: "20px" }}>
        <p><strong>Nom :</strong> {formateur.nom} {formateur.prenom}</p>
        <p><strong>Email :</strong> {formateur.email}</p>
        <p><strong>Téléphone :</strong> {formateur.telephone}</p>
        <p><strong>Domaine :</strong> {formateur.domaine}</p>
        {/* Ajoute ici les autres infos si besoin */}
      </div>

      <FicheFormateur formateurId={id} />
    </div>
  );
}
