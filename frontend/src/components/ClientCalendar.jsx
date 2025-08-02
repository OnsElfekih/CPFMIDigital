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

export default function PublicDisponibilite() {
  const [dispos, setDispos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [competences, setCompetences] = useState([]); // Liste des compétences disponibles — tu peux récupérer dynamiquement si besoin

  const [filtreCompetence, setFiltreCompetence] = useState('');
  const [filtrePeriode, setFiltrePeriode] = useState('');

  const [selectedDate, setSelectedDate] = useState(dayjs());

  useEffect(() => {
    const fetchDisponibilites = async () => {
      setLoading(true);

      // Construire params
      const params = {};
      if (filtreCompetence) params.competence = filtreCompetence;
      if (filtrePeriode) params.periode = filtrePeriode;

      try {
        const res = await axios.get('/api/disponibilites/public', { params });
        setDispos(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDisponibilites();
  }, [filtreCompetence, filtrePeriode]);

   // Charger compétences une seule fois au montage
  useEffect(() => {
    const fetchCompetences = async () => {
      try {
        const res = await axios.get('/api/formateurs/competences');
        setCompetences(res.data);
      } catch (err) {
        console.error('Erreur chargement compétences:', err);
      }
    };
    fetchCompetences();
  }, []);

   // Charger disponibilités à chaque changement de filtres
  useEffect(() => {
    const fetchDisponibilites = async () => {
      setLoading(true);
      const params = {};
      if (filtreCompetence) params.competence = filtreCompetence;
      if (filtrePeriode) params.periode = filtrePeriode;

      try {
        const res = await axios.get('/api/disponibilites/public', { params });
        setDispos(res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDisponibilites();
  }, [filtreCompetence, filtrePeriode]);

  // Filtrer dispo du jour sélectionné
  const dispoDuJour = dispos.filter(
    (d) => dayjs(d.date).format('YYYY-MM-DD') === selectedDate.format('YYYY-MM-DD')
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box maxWidth={700} mx="auto" my={4} p={3} fontFamily="Roboto, sans-serif">
        <Typography variant="h4" align="center" gutterBottom>
          Disponibilités des formateurs
        </Typography>

        {/* FILTRES */}
        <Box display="flex" gap={2} mb={3} justifyContent="center">
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel>Compétence</InputLabel>
            <Select
              value={filtreCompetence}
              label="Compétence"
              onChange={(e) => setFiltreCompetence(e.target.value)}
              size="small"
            >
              <MenuItem value="">Toutes</MenuItem>
              {competences.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
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
              <MenuItem value="apres-midi">Après-midi</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* CALENDRIER */}
        <Box display="flex" justifyContent="center" mb={3}>
          <DateCalendar
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            disablePast
            readOnly
            renderDay={(day, selectedDate, DayComponentProps) => {
              // Indiquer si dispo pour ce jour (tu peux améliorer)
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
                  }}
                >
                  {day.date()}
                </Box>
              );
            }}
          />
        </Box>

        {/* DISPO DU JOUR */}
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
                  primary={`Formateur : ${d.formateurId.nom}`}
                  secondary={`Période : ${d.periode.replace('-', ' ')}`}
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
  );
}
