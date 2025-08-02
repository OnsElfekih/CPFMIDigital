import React, { useEffect, useState } from "react";
import axios from "axios";
import CombinedLayoutFormateur from "./combinedLayoutFormateur";
import "./MesHonoraire.css";

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
        const token = localStorage.getItem("token"); // ✅ assure-toi que le token est stocké lors du login
        const res = await axios.get("http://localhost:3001/api/honoraires/mes-honoraires", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHonoraires(res.data);
      } catch (err) {
        console.error(err);
        setError("Erreur lors de la récupération des honoraires.");
      } finally {
        setLoading(false);
      }
    };

    fetchHonoraires();
  }, []);

  return (
    <div className="page-container">
      <CombinedLayoutFormateur isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <div className={`main-content ${isSidebarOpen ? "" : "full-width"}`}>
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
                      <td>{new Date(h.date).toLocaleDateString()}</td>
                      <td>{h.type === "taux_horaire" ? "Taux Horaire" : "Forfait"}</td>
                      <td>{h.total.toFixed(2)} TND</td>
                      <td>
                        <span className={`status ${h.status.toLowerCase()}`}>{h.status}</span>
                      </td>
                      <td>
                        {h.pdfPath ? (
                          <a href={h.pdfPath} target="_blank" rel="noopener noreferrer" className="download-link" download>
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
      </div>
    </div>
  );
}
