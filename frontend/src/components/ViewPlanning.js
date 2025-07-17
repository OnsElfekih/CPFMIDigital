import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CalendarCard from './CalendarCard';

const ViewPlanning = () => {
  const [formateurId, setFormateurId] = useState("");
  const [planning, setPlanning] = useState([]);

  useEffect(() => {
    const fetchPlanning = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/api/planning/formateur/${formateurId}`);
        setPlanning(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement du planning :", err);
      }
    };

    if (formateurId) {
      fetchPlanning();
    }
  }, [formateurId]); // ✅ Aucun warning ici

  return (
    <div style={{ padding: "20px" }}>
      <h2>🗓️ Consulter le planning d’un formateur</h2>
      <input
        type="text"
        placeholder="Entrer l’ID du formateur"
        value={formateurId}
        onChange={(e) => setFormateurId(e.target.value)}
        style={{ padding: "8px", width: "300px", marginBottom: "20px" }}
      />
      <div>
        {planning.length > 0 ? (
          planning.map((item) => <CalendarCard key={item._id} item={item} />)
        ) : (
          formateurId && <p>Aucun planning trouvé pour ce formateur.</p>
        )}
      </div>
    </div>
  );
};

export default ViewPlanning;
