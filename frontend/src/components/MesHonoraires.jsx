import React, { useEffect, useState } from "react";
import axios from "axios";
import CombinedLayoutFormateur from "./combinedLayoutFormateur";
import "./MesHonoraire.css";
import Cookies from "js-cookie";

export default function MesHonoraires() {
  const [honoraires, setHonoraires] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const fetchHonoraires = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = Cookies.get("token");
        axios.get("http://localhost:3001/api/honoraires/mes-honoraires", {
          headers: { Authorization: `Bearer ${token}` }
        })
        .then(res => console.log(res.data))
        .catch(err => console.error(err));

        if (!token) {
          setError("Vous devez être connecté pour voir vos honoraires.");
          setLoading(false);
          return;
        }

        const res = await axios.get(
          "http://localhost:3001/api/honoraires/mes-honoraires",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("Réponse honoraires :", res.data); // debug

        setHonoraires(res.data || []);
      } catch (err) {
        console.error("Erreur Axios :", err);

        if (err.response) {
          // erreur côté serveur (401, 403, 500…)
          setError(
            err.response.data.message ||
              `Erreur ${err.response.status}: ${err.response.statusText}`
          );
        } else if (err.request) {
          // requête envoyée mais pas de réponse
          setError("Aucune réponse du serveur.");
        } else {
          // autre erreur
          setError("Erreur lors de la récupération des honoraires.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHonoraires();
  }, []);

  return (
    <CombinedLayoutFormateur
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={toggleSidebar}
    >
      <div className="honoraire-container">
        <h2>Mes Notes d’Honoraires</h2>

        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : honoraires.length === 0 ? (
          <p>Aucune note d'honoraire trouvée.</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Montant</th>
                  <th>Statut</th>
                  <th>PDF</th>
                </tr>
              </thead>
              <tbody>
                {honoraires.map((h) => (
                  <tr key={h._id}>
                    <td>
                      {h.date
                        ? new Date(h.date).toLocaleDateString("fr-FR")
                        : "Non définie"}
                    </td>
                    <td>
                      {h.type === "taux_horaire" ? "Taux Horaire" : "Forfait"}
                    </td>
                    <td>{h.total ? h.total.toFixed(2) : 0} TND</td>
                    <td>
                      <span
                        className={`statut ${
                          h.statut ? h.statut.toLowerCase() : "inconnu"
                        }`}
                      >
                        {h.statut || "Inconnu"}
                      </span>
                    </td>
                    <td>
                      {h.pdfPath ? (
                        <a
                          href={h.pdfPath} // important: chemin complet
                          target="_blank"
                          rel="noopener noreferrer"
                          className="download-link"
                          download
                        >
                          Télécharger
                        </a>
                      ) : (
                        <span className="no-pdf">Non disponible</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CombinedLayoutFormateur>
  );
}
