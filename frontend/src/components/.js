// ImportParticipants.js
import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

const ImportParticipants = ({ formationId, clientId }) => {
  const [file, setFile] = useState(null);
  const [columns, setColumns] = useState([]);
  const [mapping, setMapping] = useState({});
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    setFile(selected);

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);
      setRows(data);
      setColumns(Object.keys(data[0]));
    };
    reader.readAsBinaryString(selected);
  };

  const handleMappingChange = (e, field) => {
    setMapping({ ...mapping, [field]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!file || !mapping.email || !mapping.nom) {
      setMessage("Veuillez sélectionner un fichier et mapper au minimum le champ email et nom.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("formationId", formationId);
    formData.append("clientId", clientId);
    formData.append("columnMapping", JSON.stringify(mapping));

    try {
      const res = await axios.post("/api/participants/upload", formData);
      setMessage(res.data.message);
    } catch (error) {
      console.error(error);
      setMessage("Erreur lors de l'import.");
    }
  };

  return (
    <div>
      <h2>Importer des participants</h2>
      <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} />

      {columns.length > 0 && (
        <div>
          <h4>Mapper les colonnes :</h4>
          {["nom", "prenom", "email", "telephone", "poste"].map((field) => (
            <div key={field}>
              {field} :
              <select onChange={(e) => handleMappingChange(e, field)}>
                <option value="">-- Sélectionner --</option>
                {columns.map((col) => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          ))}
          <button onClick={handleSubmit}>Importer</button>
        </div>
      )}

      {message && <p>{message}</p>}
    </div>
  );
};

export default ImportParticipants;
