import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Button } from "@mui/material";
import CombinedLayoutEntreprise from "./combinedLayoutEntreprise";
import "./profilFormateur.css";

const ProfilFormateur = () => {
  const { id } = useParams();
  const [formateur, setFormateur] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchFormateur = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/formateurs/${id}`);
        setFormateur(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement du profil :", err);
      }
    };

    fetchFormateur();
  }, [id]);

  if (!formateur) return <Typography>Chargement...</Typography>;

  return (
    <>
      <CombinedLayoutEntreprise
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

<div className={`profil-container ${isSidebarOpen ? "" : "collapsed"}`}>
  <Typography className="profil-title">Profil du Formateur</Typography>
  <ul className="profil-details">
    <li><strong>Nom</strong> {formateur.nom}</li>
    <li><strong>Prénom</strong> {formateur.prenom}</li>
    <li><strong>Email</strong> {formateur.email}</li>
    <li><strong>Spécialité</strong> {formateur.specialite}</li>
    <li><strong>Diplôme</strong> {formateur.diplome}</li>
    <li><strong>Domaine</strong> {formateur.domaine}</li>
  </ul>
  <button
    className="btn-retourner"
    onClick={() => navigate("/listeformateur")}
  >
    Retourner
  </button>
</div>

    </>
  );
};

export default ProfilFormateur;
