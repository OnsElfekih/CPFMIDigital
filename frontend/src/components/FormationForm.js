import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, Button, Stack } from '@mui/material';

const FormationForm = ({ open, onClose, onSubmit }) => {
 
const [formation, setFormation] = useState({
  titre: '',
  description: '',
  dateDebut: '',
  dateFin: '',
  formateur: '',
  lieu: 'En ligne', // Valeur par défaut
  theme: 'Général', // Valeur par défaut
  duree: 1 // Valeur par défaut
});

  const handleChange = (e) => {
    setFormation({...formation, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formation);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white' }}>Créer une nouvelle formation</DialogTitle>
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