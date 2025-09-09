// FormateurCalendarPage.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Paper,
  Chip,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { LocalizationProvider, DateCalendar } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

// 🔽 IMPORT DU LAYOUT FORMATEUR
import CombinedLayoutFormateur from "../components/combinedLayoutFormateur";

export default function FormateurCalendarPage() {
  const [dispos, setDispos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [periode, setPeriode] = useState("matin");
  const [loading, setLoading] = useState(false);
  const [formation, setFormation] = useState("");

  // ✅ état sidebar (fermée par défaut)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Lis l'id une seule fois (et garde-le en state)
  const [formateurId] = useState(() => {
    return (
      localStorage.getItem("formateurId") ||
      JSON.parse(localStorage.getItem("utilisateur") || "null")?._id ||
      ""
    );
  });

  const API_BASE = "http://localhost:3001/api/disponibilites"; // 🔹 Base URL

  // 🔹 Récupérer toutes les disponibilités
  useEffect(() => {
    if (!formateurId) return;
    setLoading(true);
    axios
      .get(`${API_BASE}/${formateurId}`)
      .then((res) => setDispos(res.data))
      .catch((err) => console.error("Erreur GET dispos:", err))
      .finally(() => setLoading(false));
  }, [formateurId]);

  const formatDateForApi = (date) => date.format("YYYY-MM-DD");

  // 🔹 Ajouter une disponibilité
  const handleAddDispo = async () => {
    if (!formateurId) {
      alert("Formateur ID manquant.");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE}/add`, {
        formateurId,
        date: formatDateForApi(selectedDate),
        periode,
        formation,
      });
      setDispos([...dispos, res.data]);
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Modifier période d'une disponibilité
  const handleTogglePeriode = async (dispo) => {
    const nouvellePeriode = dispo.periode === "matin" ? "après-midi" : "matin";
    try {
      setLoading(true);
      // Supprimer l'ancienne dispo
      await axios.delete(`${API_BASE}/remove`, {
        data: {
          formateurId,
          date: dispo.date,
          periode: dispo.periode,
        },
      });

      // Ajouter la nouvelle dispo
      const res = await axios.post(`${API_BASE}/add`, {
        formateurId,
        date: dispo.date,
        periode: nouvellePeriode,
      });

      const sansAncienne = dispos.filter(
        (d) =>
          !(
            dayjs(d.date).isSame(dispo.date, "day") &&
            d.periode === dispo.periode
          )
      );
      setDispos([...sansAncienne, res.data]);
    } catch (err) {
      alert("Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  const dispoDuJour = dispos.filter(
    (d) =>
      dayjs(d.date).format("YYYY-MM-DD") ===
      selectedDate.format("YYYY-MM-DD")
  );

  return (
    <CombinedLayoutFormateur
      isSidebarOpen={isSidebarOpen}          // 🔹 passe l'état
      toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} // 🔹 bouton ouvre/ferme
    >
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box maxWidth={600} mx="auto" my={4} p={3} sx={{ fontFamily: "Roboto, sans-serif" }}>
          <Typography variant="h4" align="center" gutterBottom color="primary">
            Gestion des disponibilités
          </Typography>

          <Box display="flex" justifyContent="center" mb={3}>
            <DateCalendar
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              disablePast
            />
          </Box>

          <Box display="flex" justifyContent="center" mb={3}>
            <input
              type="text"
              placeholder="Nom de la formation"
              value={formation}
              onChange={(e) => setFormation(e.target.value)}
              style={{
                padding: "10px",
                width: "100%",
                maxWidth: "400px",
                border: "1px solid #ccc",
                borderRadius: "8px"
              }}
            />
          </Box>

          <Box display="flex" justifyContent="center" alignItems="center" mb={3} gap={3}>
            <RadioGroup row value={periode} onChange={(e) => setPeriode(e.target.value)}>
              <FormControlLabel value="matin" control={<Radio color="primary" />} label="Matin" />
              <FormControlLabel value="après-midi" control={<Radio color="primary" />} label="Après-midi" />
            </RadioGroup>

            <Button
              variant="contained"
              color="primary"
              onClick={handleAddDispo}
              disabled={loading}
              startIcon={loading && <CircularProgress size={20} />}
            >
              Ajouter
            </Button>
          </Box>

          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Disponibilités du jour sélectionné ({selectedDate.format("DD/MM/YYYY")})
            </Typography>

            {dispoDuJour.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Aucune disponibilité ce jour.
              </Typography>
            ) : (
              <List dense>
                {dispoDuJour.map((d, i) => (
                  <ListItem key={i}>
                    <ListItemText
                      primary={`${d.periode === "matin" ? "Matin" : "Après-midi"} - ${d.formation || "Sans formation"}`}
                      onClick={() => {
                        if (window.confirm("Modifier la période (matin/après-midi) ?")) {
                          handleTogglePeriode(d);
                        }
                      }}
                      style={{ cursor: "pointer", color: "#1976d2" }}
                    />
                    <Chip
                      label={d.periode.replace("-", " ")}
                      color={d.periode === "matin" ? "warning" : "secondary"}
                      size="small"
                      sx={{ ml: 1 }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>

          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Toutes les disponibilités enregistrées
            </Typography>

            {dispos.length === 0 ? (
              <Typography variant="body2" color="text.secondary">
                Aucune disponibilité enregistrée.
              </Typography>
            ) : (
              <List dense component={Paper} elevation={3}>
                {dispos.map((d, i) => (
                  <React.Fragment key={i}>
                    <ListItem
                      secondaryAction={
                        <Chip
                          label={d.periode.replace("-", " ")}
                          color={d.periode === "matin" ? "warning" : "secondary"}
                          size="small"
                        />
                      }
                    >
                      <ListItemText primary={dayjs(d.date).format("DD/MM/YYYY")} />
                    </ListItem>
                    {i < dispos.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Box>
        </Box>
      </LocalizationProvider>
    </CombinedLayoutFormateur>
  );
}
