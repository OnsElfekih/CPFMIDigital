import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  MenuItem,
  Autocomplete,
  Select,
  InputLabel,
  TextField,
  Button,
  Stack,
  FormControl
} from '@mui/material';

const FormationForm = ({ open, onClose, onSubmit }) => {
  const [formation, setFormation] = useState({
    titre: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    formateur: '',
    lieu: '',
    theme: '',
    duree: 1,
    participants: 1,
    entreprise: ''
  });

  const [entreprises, setEntreprises] = useState([]);

  useEffect(() => {
    if (open) {
      axios.get('http://localhost:3001/api/entreprises')
        .then(res => {
          const noms = res.data.map(e => e.nom);
          setEntreprises(noms);
        })
        .catch(err => {
          console.error("Erreur récupération entreprises :", err);
          setEntreprises([]);
        });
    }
  }, [open]);

  const handleChange = (e) => {
    setFormation({ ...formation, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formation);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white' }}>
        Créer une nouvelle formation
      </DialogTitle>
      <DialogContent>
        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
          <Stack spacing={3}>
            <TextField
              label="Titre de la formation"
              name="titre"
              value={formation.titre}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Description"
              name="description"
              value={formation.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />

            <TextField
              label="Date de début"
              name="dateDebut"
              type="date"
              value={formation.dateDebut}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />

            <TextField
              label="Date de fin"
              name="dateFin"
              type="date"
              value={formation.dateFin}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />

            <TextField
              label="Formateur"
              name="formateur"
              value={formation.formateur}
              onChange={handleChange}
              fullWidth
              required
            />

            <FormControl fullWidth required>
              <InputLabel id="participants-label">Nombre de participants</InputLabel>
              <Select
                labelId="participants-label"
                name="participants"
                value={formation.participants}
                label="Nombre de participants"
                onChange={handleChange}
              >
                {[...Array(10)].map((_, i) => (
                  <MenuItem key={i + 1} value={i + 1}>
                    {i + 1}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Autocomplete
              options={entreprises}
              getOptionLabel={(option) => option}
              value={formation.entreprise || null}
              onChange={(event, newValue) => {
                setFormation({ ...formation, entreprise: newValue });
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Entreprise partenaire"
                  fullWidth
                  required
                />
              )}
            />

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button variant="outlined" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Enregistrer
              </Button>
            </Stack>
          </Stack>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default FormationForm;
