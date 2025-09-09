import React, { useState } from "react";
import axios from "axios";

const UploadParticipants = ({ titreFormation, formateur, clientId, onClose }) => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage("Veuillez choisir un fichier.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("titreFormation", titreFormation); // titre
    formData.append("formateur", formateur);           // formateur
               

    try {
      const res = await axios.post(
        "http://localhost:3001/api/participants/import",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setMessage(`Succès ! ${res.data.count} participants importés.`);
      onClose(); // ferme la modale après succès
    } catch (err) {
      console.error("Erreur upload :", err);
      setMessage(
        err.response?.data?.error || "Erreur serveur lors de l'importation"
      );
    }
  };

  return (
    <div style={{ maxWidth: "400px" }}>
      <h3>Importer participants pour :</h3>
      <p><strong>Formation :</strong> {titreFormation}</p>
      <p><strong>Formateur :</strong> {formateur}</p>

      <input type="file" accept=".csv, .xlsx, .xls" onChange={handleFileChange} />
      <div style={{ marginTop: "10px" }}>
        <button onClick={handleUpload} style={{ marginRight: "10px" }}>Importer</button>
        <button onClick={onClose}>Annuler</button>
      </div>

      {message && (
        <p style={{ color: message.includes("Succès") ? "green" : "red" }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default UploadParticipants;
