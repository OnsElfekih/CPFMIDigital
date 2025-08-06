import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import CombinedLayoutEntreprise from "./combinedLayoutEntreprise";
import "./historiqueEvaluationFormation.css";

const MesEvaluations = () => {
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });

  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  const fetchEvaluations = () => {
    axios
      .get(`http://localhost:3001/evalformation/byuser/${userId}`)
      .then((res) => {
        setEvaluations(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erreur lors du chargement:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (userId) fetchEvaluations();
  }, [userId]);

  const handleClick = () => navigate("/evalformation");

  const openDeleteConfirm = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({ show: false, id: null });
  };

const handleDelete = async () => {
  console.log("Suppression URL:", `http://localhost:3001/evalformation/${deleteConfirm.id}`);
  try {
    await axios.delete(`http://localhost:3001/evalformation/${deleteConfirm.id}`);
    setEvaluations((prev) => prev.filter((e) => e._id !== deleteConfirm.id));
    closeDeleteConfirm();
  } catch (err) {
    console.error("Erreur suppression:", err);
  }
};


  if (loading) return <CircularProgress />;

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <>
      <CombinedLayoutEntreprise
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div
        className="evaluation-container"
        style={{ marginLeft: isSidebarOpen ? "210px" : "90px", marginTop: "80px" }}
      >
        <Box p={3}>
          <h2 className="title">Mes évaluations</h2>

          <button className="btn-ajouter" onClick={handleClick}>
            Ajouter évaluation
          </button>

          {evaluations.length === 0 ? (
            <Typography>Aucune évaluation trouvée.</Typography>
          ) : (
            <table className="table-evaluations">
              <thead>
                <tr>
                  <th>Formation</th>
                  <th>Note</th>
                  <th>Commentaire</th>
                  <th>Anonyme</th>
                  <th>Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {evaluations.map((e) => (
                  <tr key={e._id}>
                    <td>{e.formationNom}</td>
                    <td>{e.note} / 5</td>
                    <td>{e.commentaire || "Aucun"}</td>
                    <td>{e.anonyme ? "Oui" : "Non"}</td>
                    <td>{new Date(e.createdAt).toLocaleDateString("fr-FR")}</td>
                    <td>
                      <button onClick={() => openDeleteConfirm(e._id)}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Box>

        {deleteConfirm.show && (
          <div className="confirm-overlay">
            <div className="confirm-box">
              <p>Confirmer la suppression ?</p>
              <div className="confirm-buttons">
                <button onClick={handleDelete}>Confirmer</button>
                <button className="btn-supprimer" onClick={closeDeleteConfirm}>Annuler</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default MesEvaluations;
