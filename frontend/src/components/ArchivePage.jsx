import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Honoraire.css';
import CombinedLayoutAdmin from './CombinedLayoutAdmin';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import './ArchiveModern.css';
import { useLocation } from 'react-router-dom';

export default function ArchivePage() {
  const [formateurs, setFormateurs] = useState([]);
  const [honoraires, setHonoraires] = useState([]);
  const [selectedFormateur, setSelectedFormateur] = useState(null);
  const location = useLocation();


  useEffect(() => {
    if (location.state?.formateurId) {
    handleSelectFormateur(location.state.formateurId);
  }
    axios.get('http://localhost:3001/api/formateurs')
      .then(res => setFormateurs(res.data))
      .catch(err => console.error(err));
  }, [location.state]);

  const handleSelectFormateur = async (formateurId) => {
    setSelectedFormateur(formateurId);
    try {
      const res = await axios.get(`http://localhost:3001/api/honoraires/formateur/${formateurId}`);
      setHonoraires(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const selected = formateurs.find(f => f._id === selectedFormateur);

  return (
    <CombinedLayoutAdmin>
      <div className="archive-page-modern">
        <h2 className="archive-title">🗂️ Archives des Notes d’Honoraires</h2>
        <div className="archive-grid">
          <div className="formateur-panel">
            <h3>👨‍🏫 Formateurs</h3>
            <ul className="formateur-list-modern">
              {formateurs.map((f) => (
                <li key={f._id}>
                  <button
                    onClick={() => handleSelectFormateur(f._id)}
                    className={`formateur-button ${selectedFormateur === f._id ? 'active' : ''}`}
                  >
                    {f.nom} {f.prenom}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="honoraire-panel">
            <h3>📋 Notes d’Honoraires</h3>
            {selectedFormateur ? (
              honoraires.length > 0 ? (
                <div className="honoraire-list-modern">
                  {honoraires.map(h => (
                    <div key={h._id} className="honoraire-card">
                      <FaFileInvoiceDollar className="icon" />
                      <div className="honoraire-info">
                        <p><strong>Type:</strong> {h.type}</p>
                        <p><strong>Date:</strong> {new Date(h.date).toLocaleDateString()}</p>
                        <p><strong>Montant:</strong> {h.total} TND</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="empty-message">Aucune note d’honoraire pour {selected?.nom} {selected?.prenom}.</p>
              )
            ) : (
              <p className="empty-message">Sélectionne un formateur pour voir ses honoraires.</p>
            )}
          </div>
        </div>
      </div>
    </CombinedLayoutAdmin>
  );
}
