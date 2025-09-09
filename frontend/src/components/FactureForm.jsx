import React, { useState, useEffect } from "react";
import axios from "axios";
import CombinedLayoutAdmin from "./CombinedLayoutAdmin"; // adapte le chemin si besoin
import "./FactureForm.css";
import Cookies from "js-cookie";

export default function FactureForm() {
  const [facture, setFacture] = useState({
    numero: "",
    clientNom: "",
    clientEmail: "",
    formations: [
      { nomFormation: "", nomFormateur: "", montantFormation: "" }
    ],
    montantTotal: 0,
    statut: "en attente", // ✅ ajouté
  });

  // Gestion ouverture sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Met à jour les champs simples (numero, clientNom, clientEmail, statut si select)
  const handleChange = (e) => {
    setFacture({ ...facture, [e.target.name]: e.target.value });
  };

  // Met à jour une formation dans le tableau formations
  const handleFormationChange = (index, e) => {
    const newFormations = [...facture.formations];
    newFormations[index][e.target.name] = e.target.value;
    setFacture({ ...facture, formations: newFormations });
  };

  // Ajoute une nouvelle formation vide
  const ajouterFormation = () => {
    setFacture({
      ...facture,
      formations: [...facture.formations, { nomFormation: "", nomFormateur: "", montantFormation: "" }],
    });
  };

  // Supprime une formation par index
  const supprimerFormation = (index) => {
    const newFormations = facture.formations.filter((_, i) => i !== index);
    setFacture({ ...facture, formations: newFormations });
  };

  // Calcule le total chaque fois que formations changent
  useEffect(() => {
    const total = facture.formations.reduce((acc, f) => {
      const val = parseFloat(f.montantFormation);
      return acc + (isNaN(val) ? 0 : val);
    }, 0);
    setFacture(facture => ({ ...facture, montantTotal: total }));
  }, [facture.formations]);

  // Envoie la facture au backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...facture, montant: facture.montantTotal, statut: facture.statut }; // ✅ statut ajouté
      await axios.post("http://localhost:3001/api/factures/add", payload,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}` // ou localStorage.getItem("token")
        }
      });
      alert("✅ Facture envoyée avec succès !");

      // Téléchargement automatique du PDF après création
      const pdfResponse = await axios.get(`http://localhost:3001/api/factures/pdf/facture_${facture.numero}`, {
        responseType: "blob",
      });

    } catch (err) {
      console.error(err);
      alert("❌ Erreur lors de l'envoi de la facture");
    }
  };

  // Téléchargement du PDF facture via backend
  const telechargerPDF = async () => {
    if (!facture.numero) {
      alert("Veuillez entrer le numéro de facture pour télécharger le PDF.");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:3001/api/factures/pdf/${facture.numero}`, {
        responseType: "blob", // important pour recevoir un fichier
      });

      // Création d'un lien pour télécharger le fichier PDF
      const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `facture_${facture.numero}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error(error);
      alert("Erreur lors du téléchargement de la facture PDF.");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <CombinedLayoutAdmin isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        className="facture-container"
        style={{
          flexGrow: 1,
          padding: "20px",
          backgroundColor: "#f4f4f4",
          marginTop: "100px",
          borderRadius: "8px",
          boxShadow: "0 2px 10px rgba(0, 0,0, 0.1)",   
        }}
      >
        <h2>📄 Créer une nouvelle facture</h2>
        <form onSubmit={handleSubmit} className="facture-form">

          <div className="form-group">
            <label>Numéro de facture</label>
            <input
              type="text"
              name="numero"
              placeholder="e.g. 2025-001"
              value={facture.numero}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Nom du client</label>
            <input
              type="text"
              name="clientNom"
              placeholder="e.g. Jean Dupont"
              value={facture.clientNom}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email du client</label>
            <input
              type="email"
              name="clientEmail"
              placeholder="e.g. jean.dupont@example.com"
              value={facture.clientEmail}
              onChange={handleChange}
              required
            />
          </div>

          <h3>Formations</h3>
          {facture.formations.map((formation, index) => (
            <div key={index} className="formation-block">
              <input
                type="text"
                name="nomFormation"
                placeholder="Nom de la formation"
                value={formation.nomFormation}
                onChange={(e) => handleFormationChange(index, e)}
                required
              />
              <input
                type="text"
                name="nomFormateur"
                placeholder="Nom du formateur"
                value={formation.nomFormateur}
                onChange={(e) => handleFormationChange(index, e)}
                required
              />
              <input
                type="number"
                step="0.01"
                name="montantFormation"
                placeholder="Montant (DT)"
                value={formation.montantFormation}
                onChange={(e) => handleFormationChange(index, e)}
                required
              />
              {facture.formations.length > 1 && (
                <button
                  type="button"
                  className="btn-supprimer"
                  onClick={() => supprimerFormation(index)}
                >
                  Supprimer
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={ajouterFormation}
            className="add-formation-btn"
          >
            + Ajouter une formation
          </button>

          <div className="total-montant">
            <strong>Total : {facture.montantTotal.toFixed(2)} DT</strong>
          </div>

          {/* ✅ Champ statut */}
          <div className="form-group">
            <label>Statut de la facture</label>
            <select
              name="statut"
              value={facture.statut}
              onChange={handleChange}
            >
              <option value="en attente">⏳ En attente</option>
              <option value="payée">✅ Payée</option>
            </select>
          </div>

          <button type="submit" className="submit-btn">
            📬 Enregistrer la facture
          </button>
        </form>

        <button
          onClick={telechargerPDF}
          className="submit-btn"
          style={{ marginTop: "20px", backgroundColor: "#27ae60" }}
        >
          📥 Télécharger la facture PDF
        </button>
      </div>
    </div>
  );
}
