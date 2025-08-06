import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Input, Table, TableHead,
  TableRow, TableCell, TableBody, Select, MenuItem, FormControl, InputLabel
} from "@mui/material";
import * as XLSX from "xlsx";
import axios from "axios";

const ImportParticipants = () => {
  const [file, setFile] = useState(null);
  const [parsedData, setParsedData] = useState([]);
  const [columnMapping, setColumnMapping] = useState({});
  const [headers, setHeaders] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [formations, setFormations] = useState([]);
  const [selectedEntreprise, setSelectedEntreprise] = useState("");
  const [selectedFormation, setSelectedFormation] = useState("");

  // Charger les entreprises
  useEffect(() => {
    axios.get("http://localhost:3001/api/entreprises")

      .then((res) => setEntreprises(res.data))
      .catch((err) => console.error("Erreur entreprises:", err));
  }, []);

  // Charger les formations quand une entreprise est sélectionnée
  useEffect(() => {
    if (selectedEntreprise) {
      axios.get(`http://localhost:5000/api/formations/byClient/${selectedEntreprise}`)
        .then((res) => setFormations(res.data))
        .catch((err) => console.error("Erreur formations:", err));
    }
  }, [selectedEntreprise]);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);

    const reader = new FileReader();
    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

      if (json.length > 0) {
        setParsedData(json);
        setHeaders(Object.keys(json[0]));
      }
    };
    reader.readAsArrayBuffer(selected);
  };

  const handleMappingChange = (dbField, excelColumn) => {
    setColumnMapping(prev => ({ ...prev, [dbField]: excelColumn }));
  };

  const handleSubmit = async () => {
    const mappedData = parsedData.map(row => {
      const participant = {};
      for (const key in columnMapping) {
        participant[key] = row[columnMapping[key]] || "";
      }
      return participant;
    });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("mappedData", JSON.stringify(mappedData));
    formData.append("formationId", selectedFormation);
    formData.append("clientId", selectedEntreprise);

    try {
      const res = await axios.post("http://localhost:5000/api/participants/upload", formData);
      alert("Participants importés avec succès !");
    } catch (err) {
      console.error("Erreur d'import:", err);
      alert("Erreur lors de l'import.");
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h5" mb={3}>Importation des Participants</Typography>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Entreprise</InputLabel>
        <Select
          value={selectedEntreprise}
          label="Entreprise"
          onChange={(e) => {
            setSelectedEntreprise(e.target.value);
            setSelectedFormation("");
          }}
        >
          {entreprises.map(ent => (
            <MenuItem key={ent._id} value={ent._id}>{ent.nom}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Formation</InputLabel>
        <Select
          value={selectedFormation}
          label="Formation"
          onChange={(e) => setSelectedFormation(e.target.value)}
          disabled={!formations.length}
        >
          {formations.map(f => (
            <MenuItem key={f._id} value={f._id}>{f.titre}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Input
        type="file"
        onChange={handleFileChange}
        sx={{ mb: 2 }}
      />

      {headers.length > 0 && (
        <>
          <Typography variant="h6" mt={3} mb={1}>Mapping des Colonnes</Typography>
          {["nom", "prenom", "email", "poste", "telephone"].map((field) => (
            <FormControl fullWidth sx={{ mb: 2 }} key={field}>
              <InputLabel>{field}</InputLabel>
              <Select
                value={columnMapping[field] || ""}
                onChange={(e) => handleMappingChange(field, e.target.value)}
              >
                {headers.map((header, index) => (
                  <MenuItem key={index} value={header}>{header}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ))}
        </>
      )}

      {parsedData.length > 0 && (
        <Box mt={3}>
          <Typography variant="h6">Aperçu</Typography>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell key={index}>{header}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {parsedData.slice(0, 5).map((row, i) => (
                <TableRow key={i}>
                  {headers.map((header, j) => (
                    <TableCell key={j}>{row[header]}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      )}

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 3 }}
        onClick={handleSubmit}
        disabled={!file || !selectedEntreprise || !selectedFormation}
      >
        Importer les Participants
      </Button>
    </Box>
  );
};

export default ImportParticipants;
