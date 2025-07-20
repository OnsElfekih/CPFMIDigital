import React, { useEffect, useState } from "react";
import axios from "axios";
import FormationForm from './FormationForm';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Button, 
  IconButton, Typography, Box, 
  CircularProgress, Alert, Snackbar,
  Dialog, DialogTitle, DialogContent,
  DialogActions, DialogContentText,
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit as EditIcon, 
  Delete as DeleteIcon,
} from '@mui/icons-material';

import CombinedLayoutAdmin from "./CombinedLayoutAdmin";

const FormationTable = () => {
  const [openForm, setOpenForm] = useState(false);
  const [formations, setFormations] = useState([]);
  const [entreprises, setEntreprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingFormation, setEditingFormation] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  

  // Charger formations
  const fetchFormations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:3001/api/formations");
      setFormations(res.data);
    } catch (err) {
      setError("Erreur lors du chargement des formations");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

const toggleSidebar = () => {
  setIsSidebarOpen(prev => !prev);
};


  // Charger entreprises
  const fetchEntreprises = async () => {
    try {
      const res = await axios.get("http://localhost:3001/api/entreprises");
      setEntreprises(res.data.map(e => e.nom)); // Liste des noms uniquement
    } catch (err) {
      console.error("Erreur chargement entreprises:", err);
      setEntreprises([]);
    }
  };

  useEffect(() => {
    fetchFormations();
    fetchEntreprises();
  }, []);

  const handleCreateFormation = async (newFormation) => {
    try {
      const response = await axios.post('http://localhost:3001/api/formations', {
        ...newFormation,
        dateDebut: new Date(newFormation.dateDebut).toISOString(),
        dateFin: new Date(newFormation.dateFin).toISOString()
      });
      
      setSnackbar({
        open: true,
        message: 'Formation créée avec succès!',
        severity: 'success'
      });
      fetchFormations();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Erreur lors de la création',
        severity: 'error'
      });
    }
  };

  const handleUpdateFormation = async (updatedFormation) => {
    try {
      await axios.put(`http://localhost:3001/api/formations/${editingFormation._id}`, {
        ...updatedFormation,
        dateDebut: new Date(updatedFormation.dateDebut).toISOString(),
        dateFin: new Date(updatedFormation.dateFin).toISOString()
      });
      
      setSnackbar({
        open: true,
        message: 'Formation mise à jour avec succès!',
        severity: 'success'
      });
      setEditingFormation(null);
      fetchFormations();
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Erreur lors de la mise à jour',
        severity: 'error'
      });
    }
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/formations/${deleteConfirm}`);
      setSnackbar({
        open: true,
        message: 'Formation supprimée avec succès!',
        severity: 'success'
      });
      setDeleteConfirm(null);
      fetchFormations();
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  return (
  <div className="admin-home">
    <CombinedLayoutAdmin
      isSidebarOpen={isSidebarOpen}
      toggleSidebar={toggleSidebar}
    />

    <div className={`main-content ${isSidebarOpen ? "sidebar-open" : ""}`}>
      {/* En-tête ou texte d’intro */}
      <h1>Bienvenue sur l'interface administrateur</h1>
      

      <Box sx={{ p: 3 }}>
        {/* Titre + bouton */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1" color="primary">
            Espace Formations
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenForm(true)}
          >
            Nouvelle Formation
          </Button>
        </Box>

        {/* Affichage du tableau */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <TableContainer component={Paper} elevation={3}>
            <Table sx={{ minWidth: 650 }} aria-label="table des formations">
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Titre</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Lieu</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Thème</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Durée</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date de début</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID Session</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Entreprise</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Participants</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {formations.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography variant="body1" color="textSecondary">
                        Aucune formation disponible
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  formations.map((formation) => (
                    <TableRow
                      key={formation._id}
                      sx={{
                        '&:last-child td, &:last-child th': { border: 0 },
                        '&:hover': {
                          backgroundColor: '#e3f2fd',
                          cursor: 'pointer',
                        },
                      }}
                    >
                      <TableCell>{formation.titre}</TableCell>
                      <TableCell>{formation.lieu}</TableCell>
                      <TableCell>{formation.theme}</TableCell>
                      <TableCell>{formation.duree} jours</TableCell>
                      <TableCell>
                        {new Date(formation.dateDebut).toLocaleDateString('fr-FR')}
                      </TableCell>
                      <TableCell>{formation.idSession}</TableCell>
                      <TableCell>{formation.entreprise || '-'}</TableCell>
                      <TableCell>{formation.participants}</TableCell>
                      <TableCell>
                        <IconButton
                          color="primary"
                          onClick={() => setEditingFormation(formation)}
                          sx={{ mr: 1 }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => setDeleteConfirm(formation._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Modale de création */}
        <FormationForm
          open={openForm}
          onClose={() => setOpenForm(false)}
          onSubmit={handleCreateFormation}
          entreprises={entreprises}
        />

        {/* Modale d’édition */}
        <FormationForm
          open={Boolean(editingFormation)}
          onClose={() => setEditingFormation(null)}
          onSubmit={handleUpdateFormation}
          initialData={editingFormation}
          isEditMode={true}
          entreprises={entreprises}
        />

        {/* Dialog de suppression */}
        <Dialog
          open={Boolean(deleteConfirm)}
          onClose={() => setDeleteConfirm(null)}
        >
          <DialogTitle>Confirmer la suppression</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Êtes-vous sûr de vouloir supprimer cette formation ? Cette action est irréversible.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirm(null)}>Annuler</Button>
            <Button onClick={confirmDelete} color="error" variant="contained">
              Supprimer
            </Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </div>
  </div>
  
  
);
}
export default FormationTable;
