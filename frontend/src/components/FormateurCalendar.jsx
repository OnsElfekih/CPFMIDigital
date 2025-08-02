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

export default function FormateurCalendar({ formateurId }) {
  const [dispos, setDispos] = useState([]);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [periode, setPeriode] = useState("matin");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!formateurId) return;
    setLoading(true);
    axios
      .get(`/api/disponibilites/${formateurId}`)
      .then((res) => setDispos(res.data))
      .finally(() => setLoading(false));
  }, [formateurId]);

  // Envoi la date au format ISO complet (avec heure)
  const formatDateForApi = (date) => date.toISOString();

  const handleAddDispo = async () => {
    if (!formateurId) {
      alert("Formateur ID manquant.");
      return;
    }
    try {
      setLoading(true);
      console.log("Envoi des données :", {
        formateurId,
        date: formatDateForApi(selectedDate),
        periode,
      });
      const res = await axios.post("/api/disponibilites/add", {
        formateurId,
        date: formatDateForApi(selectedDate),
        periode,
      });
      setDispos([...dispos, res.data]);
    } catch (err) {
      alert(err.response?.data?.message || "Erreur lors de l'ajout");
    } finally {
      setLoading(false);
    }
  };

  const dispoDuJour = dispos.filter(
    (d) => dayjs(d.date).format("YYYY-MM-DD") === selectedDate.format("YYYY-MM-DD")
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        maxWidth={600}
        mx="auto"
        my={4}
        p={3}
        sx={{ fontFamily: "Roboto, sans-serif" }}
      >
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

        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mb={3}
          gap={3}
        >
          <RadioGroup
            row
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
          >
            <FormControlLabel
              value="matin"
              control={<Radio color="primary" />}
              label="Matin"
            />
            <FormControlLabel
              value="après-midi" // <-- Accent important ici !
              control={<Radio color="primary" />}
              label="Après-midi"
            />
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
            Disponibilités du jour sélectionné (
            {selectedDate.format("DD/MM/YYYY")})
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
                    primary={d.periode === "matin" ? "Matin" : "Après-midi"}
                  />
                  <Chip
                    label={d.periode.replace("-", " ")}
                    color={d.periode === "matin" ? "warning" : "secondary"}
                    size="small"
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
  );
}
