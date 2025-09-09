import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";

import { PictureAsPdf, GridOn ,SomePdfIcon} from '@mui/icons-material';

import autoTable from "jspdf-autotable";
import axios from "axios";
import FormationForm from './FormationForm';
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { 
  Table, TableBody, TableCell, TableContainer, Grid,
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

  const [selectedFormation, setSelectedFormation] = useState(null);

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


  const exportToExcel = () => {
  const worksheetData = formations.map(f => ({
    Titre: f.titre,
    Lieu: f.lieu,
    Theme: f.theme,
    'Durée (jours)': f.duree,
    'Date Début': new Date(f.dateDebut).toLocaleDateString('fr-FR'),
    'Date Fin': new Date(f.dateFin).toLocaleDateString('fr-FR'),
    Entreprise: f.entreprise,
    'ID Session': f.idSession,
    Participants: f.participants
  }));

  const worksheet = XLSX.utils.json_to_sheet(worksheetData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Formations");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, "formations.xlsx");
};


  



const exportToPDF = () => {
  const doc = new jsPDF();
  doc.text("Liste des formations", 14, 10);

  const tableData = formations.map(f => [
    f.titre,
    f.lieu,
    f.theme,
    f.duree,
    new Date(f.dateDebut).toLocaleDateString('fr-FR'),
    new Date(f.dateFin).toLocaleDateString('fr-FR'),
    f.entreprise
  ]);

  autoTable(doc, {
    head: [["Titre", "Lieu", "Thème", "Durée", "Début", "Fin", "Entreprise"]],
    body: tableData
  });

  doc.save("formations.pdf");
};



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

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
       {/* Affichage des formations sous forme de cartes */}
       <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
  <Button
  variant="contained"
  color="primary"
  startIcon={<GridOn />}
  sx={{ textTransform: "none", fontWeight: "bold", borderRadius: 2 }}
  onClick={exportToExcel}
>
  Exporter en Excel
</Button>

<Button
  variant="outlined"
  color="secondary"
  startIcon={<PictureAsPdf />}
  sx={{ textTransform: "none", fontWeight: "bold", borderRadius: 2 }}
  onClick={exportToPDF}
>
  Exporter en PDF
</Button>
</Box>
{loading ? (
 <Grid container spacing={2}>
  {formations.map((formation) => (
    <Grid item xs={10} sm={6} md={4} key={formation._id}>
      
       <Paper 
    elevation={3}
  sx={{
    p: 2,
    height: '100%',
    transform: 'scale(0.95)', // ✅ réduit taille globale à 95%
    transformOrigin: 'top center',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: '#f5f5f5',
      transform: 'scale(0.97)', // un petit zoom au hover
    }
  }}
        onClick={() => setSelectedFormation(formation)}
      >
        <Typography variant="h6" color="primary">{formation.titre}</Typography>
        <Typography variant="body2">📍 {formation.lieu}</Typography>
        <Typography variant="body2">🗓️ {new Date(formation.dateDebut).toLocaleDateString('fr-FR')}</Typography>
        <Typography variant="body2">🏢 {formation.entreprise || '-'}</Typography>
        <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
          <IconButton color="primary" onClick={(e) => {
            e.stopPropagation();
            setEditingFormation(formation);
          }}>
            <EditIcon />
          </IconButton>
         <IconButton 
  onClick={(e) => {
    e.stopPropagation();
    setDeleteConfirm(formation._id);
  }}
  sx={{ color: 'orange' }} // Couleur personnalisée
>
  <DeleteIcon />
</IconButton>
        </Box>
      </Paper>
      

    </Grid>
    
  ))}
</Grid>

) : error ? (
  <Alert severity="error" sx={{ mb: 3 }}>
    {error}
  </Alert>
) : (
  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
    {formations.length === 0 ? (
      <Typography variant="body1" color="textSecondary">
        Aucune formation disponible
      </Typography>
    ) : (
      formations.map((formation) => (
        <Paper 
          key={formation._id} 
          elevation={3}
          sx={{ 
            p: 2, width: 300, cursor: 'pointer',
            '&:hover': { backgroundColor: '#f5f5f5' }
          }}
          onClick={() => setSelectedFormation(formation)}
        >
          <Typography variant="h6" color="primary">{formation.titre}</Typography>
          <Typography variant="body2">📍 {formation.lieu}</Typography>
          <Typography variant="body2">🗓️ {new Date(formation.dateDebut).toLocaleDateString('fr-FR')}</Typography>
          <Typography variant="body2">🏢 {formation.entreprise || '-'}</Typography>
          <Box sx={{ mt: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton color="primary" onClick={(e) => {
              e.stopPropagation();
              setEditingFormation(formation);
            }}>
              <EditIcon />
            </IconButton>
           <IconButton 
  onClick={(e) => {
    e.stopPropagation();
    setDeleteConfirm(formation._id);
  }}
  sx={{ color:" #F27405" }} // Couleur personnalisée
>
  <DeleteIcon />
</IconButton>
          </Box>
        </Paper>
      ))
    )}
  </Box>
  
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

        {/* Détails formation */}
<Dialog
  open={Boolean(selectedFormation)}
  onClose={() => setSelectedFormation(null)}
>
  <DialogTitle>Détails de la formation</DialogTitle>
  <DialogContent dividers>
    {selectedFormation && (
      <Box>
        <Typography><strong>Titre:</strong> {selectedFormation.titre}</Typography>
        <Typography><strong>Lieu:</strong> {selectedFormation.lieu}</Typography>
        <Typography><strong>Thème:</strong> {selectedFormation.theme}</Typography>
        <Typography><strong>Durée:</strong> {selectedFormation.duree} jours</Typography>
        <Typography><strong>Date début:</strong> {new Date(selectedFormation.dateDebut).toLocaleDateString('fr-FR')}</Typography>
        <Typography><strong>Date fin:</strong> {new Date(selectedFormation.dateFin).toLocaleDateString('fr-FR')}</Typography>
        <Typography><strong>ID Session:</strong> {selectedFormation.idSession}</Typography>
        <Typography><strong>Entreprise:</strong> {selectedFormation.entreprise}</Typography>
        <Typography><strong>Participants:</strong> {selectedFormation.participants}</Typography>
      </Box>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={() => setSelectedFormation(null)}>Fermer</Button>
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
