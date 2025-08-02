import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import CombinedLayoutEntreprise from "./combinedLayoutEntreprise";
import "./listeFormateur.css";

const ListeFormateurs = () => {
  const [formateurs, setFormateurs] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchFormateurs = async () => {
      try {
        const res = await axios.get("http://localhost:3001/api/formateurs/");
        setFormateurs(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement des formateurs :", err);
      }
    };

    fetchFormateurs();
  }, []);

  const consulterProfil = (id) => {
    navigate(`/profilformateur/${id}`);
  };

  return (
    <>
      <CombinedLayoutEntreprise
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div
        className="formateurs-container"
        style={{
          marginLeft: isSidebarOpen ? "210px" : "90px",
          marginTop: "80px"
        }}
      >
        <Box p={3}>
          <h2 className="title">Liste des formateurs</h2>

          {formateurs.length === 0 ? (
            <Typography>Aucun formateur trouvé.</Typography>
          ) : (
            <table className="table-formateurs">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {formateurs.map((f) => (
                  <tr key={f._id}>
                    <td>{f.nom}</td>
                    <td>{f.prenom}</td>
                    <td>{f.email}</td>
                    <td>
                      <button
                        onClick={() => consulterProfil(f._id)}
                        title="Voir profil"
                      >
                        🔍
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Box>
      </div>
    </>
  );
};

export default ListeFormateurs;
