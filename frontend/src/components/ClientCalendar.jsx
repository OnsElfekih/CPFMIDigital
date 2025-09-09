import React, { useState, useEffect } from 'react';
import axios from 'axios';

import {
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';

import { LocalizationProvider, DateCalendar } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

import CombinedLayoutEntreprise from './combinedLayoutEntreprise'; 
import './combinedLayoutEntreprise.css'; 
import './ClientCalendar.css'; 

export default function ClientCalendar() {
  const [dispos, setDispos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formations, setFormations] = useState([]);
  const [filtreFormation, setFiltreFormation] = useState('');
  const [filtrePeriode, setFiltrePeriode] = useState('');
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // 🔹 Charger les disponibilités avec filtres
  useEffect(() => {
    const fetchDisponibilites = async () => {
      setLoading(true);
      const params = {};
      if (filtreFormation) params.formation = filtreFormation;
      if (filtrePeriode) params.periode = filtrePeriode;

      try {
        const res = await axios.get('http://localhost:3001/api/disponibilites/public', { params });
        setDispos(res.data);
      } catch (error) {
        console.error("Erreur chargement disponibilités :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDisponibilites();
  }, [filtreFormation, filtrePeriode]);

  // 🔹 Charger la liste des formations disponibles
  useEffect(() => {
    const fetchFormations = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/disponibilites/formations');
        setFormations(res.data);
      } catch (err) {
        console.error('Erreur chargement formations:', err);
      }
    };
    fetchFormations();
  }, []);

  // 🔹 Filtrer par date sélectionnée
  const dispoDuJour = dispos.filter(
    (d) => dayjs(d.date).format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')
  );

  return (
    <CombinedLayoutEntreprise isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Box maxWidth={700} mx="auto" my={4} p={3} fontFamily="Roboto, sans-serif">
          <Typography variant="h4" align="center" gutterBottom>
            Disponibilités des formateurs
          </Typography>

          {/* Filtres */}
          <Box display="flex" gap={2} mb={3} justifyContent="center">
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Formation</InputLabel>
              <Select
                value={filtreFormation}
                label="Formation"
                onChange={(e) => setFiltreFormation(e.target.value)}
                size="small"
              >
                <MenuItem value="">Toutes</MenuItem>
                {formations.map((c, i) => (
                  <MenuItem key={i} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Période</InputLabel>
              <Select
                value={filtrePeriode}
                label="Période"
                onChange={(e) => setFiltrePeriode(e.target.value)}
                size="small"
              >
                <MenuItem value="">Toutes</MenuItem>
                <MenuItem value="matin">Matin</MenuItem>
                <MenuItem value="après-midi">Après-midi</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Calendrier */}
          <Box display="flex" justifyContent="center" mb={3}>
            <DateCalendar
              value={selectedDate}
              onChange={(newValue) => setSelectedDate(newValue)}
              disablePast
              renderDay={(day) => {
                const hasDispo = dispos.some(
                  (d) => dayjs(d.date).format('YYYY-MM-DD') === day.format('YYYY-MM-DD')
                );
                return (
                  <Box
                    sx={{
                      position: 'relative',
                      bgcolor: hasDispo ? 'primary.main' : 'transparent',
                      borderRadius: '50%',
                      width: 36,
                      height: 36,
                      color: hasDispo ? 'white' : 'inherit',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {day.date()}
                  </Box>
                );
              }}
            />
          </Box>

          {/* Liste des disponibilités */}
          <Typography variant="h6" gutterBottom>
            Disponibilités pour le {selectedDate.format('DD/MM/YYYY')}
          </Typography>

          {loading ? (
            <CircularProgress />
          ) : dispoDuJour.length === 0 ? (
            <Typography color="text.secondary">Aucune disponibilité ce jour.</Typography>
          ) : (
            <List>
              {dispoDuJour.map((d, i) => (
                <ListItem key={i} divider>
                  <ListItemText
                    primary={`Formateur : ${d.formateurId?.nom || "Inconnu"}`}
                    secondary={`Formation : ${d.formation || "Non spécifiée"} | Période : ${d.periode.replace('-', ' ')}`}
                  />
                  <Chip
                    label={d.periode.replace('-', ' ')}
                    color={d.periode === 'matin' ? 'warning' : 'secondary'}
                    size="small"
                  />
                </ListItem>
              ))}
            </List>
          )}
        </Box>
      </LocalizationProvider>
    </CombinedLayoutEntreprise>
  );
}
