import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Honoraire.css';
import { FaFileInvoiceDollar } from 'react-icons/fa';
import CombinedLayoutAdmin from './CombinedLayoutAdmin'; // adapte le chemin si besoin
import { useNavigate } from 'react-router-dom';

export default function HonoraireFormateurForm() {
  const navigate = useNavigate();
  const [formateurs, setFormateurs] = useState([]);
  const [formData, setFormData] = useState({
    formateurId: '',
    type: 'taux_horaire',
    valeur: '',
    heures: ''
  });

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    axios.get('http://localhost:3001/api/formateurs')
      .then(res => setFormateurs(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3001/api/honoraires/add', formData);
      alert("Note d'honoraire ajoutée avec succès !");
      const fileName = res.data.fileName;

      // Téléchargement PDF
      const link = document.createElement('a');
      link.href = `http://localhost:3001/api/honoraires/download/${fileName}`;
      link.download = fileName;
      link.click();

      // Réinitialiser le formulaire
      setFormData({
        formateurId: '',
        type: 'taux_horaire',
        valeur: '',
        heures: ''
      });

       // ✅ Rediriger vers la page d'archive avec l'ID du formateur
    navigate('/archive', { state: { formateurId: res.data.honoraire.formateurId } });
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l'ajout.");
    }
  };


  return (
    <CombinedLayoutAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
      <div className="honoraire-form">
        <h2><FaFileInvoiceDollar style={{ marginRight: "10px" }} />Ajouter Note d'Honoraires</h2>
        <form onSubmit={handleSubmit}>
          <label>Formateur :</label>
          <select name="formateurId" value={formData.formateurId} onChange={handleChange} required>
            <option value="">-- Choisir --</option>
            {formateurs.map(f => (
              <option key={f._id} value={f._id}>
                {f.nom} {f.prenom}
              </option>
            ))}
          </select>

          <label>Type :</label>
          <select name="type" value={formData.type} onChange={handleChange}>
            <option value="taux_horaire">Taux Horaire</option>
            <option value="forfait">Forfait</option>
          </select>

          <label>Valeur (TND) :</label>
          <input type="number" name="valeur" value={formData.valeur} onChange={handleChange} required />

          {formData.type === "taux_horaire" && (
            <>
              <label>Nombre de jours :</label>
              <input type="number" name="heures" value={formData.heures} onChange={handleChange} required />
            </>
          )}

          <button type="submit">Générer PDF + Sauvegarder</button>
          <button
            type="button"
            onClick={() => navigate('/archive')}
            style={{
              marginLeft: '10px',
              backgroundColor: '#aaa',
              color: '#fff',
              padding: '8px 12px',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Voir les archives
          </button>

        </form>
      </div>
    </CombinedLayoutAdmin>
  );
}
