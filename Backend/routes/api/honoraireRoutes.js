const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const honoraireController = require('../../controllers/honoraireController');
const { protect } = require('../../models/authMiddleware');

// ➤ Ajouter honoraire
const { ajouterHonoraire, getHonorairesParFormateur} = require('../../controllers/honoraireController');
router.post('/add', ajouterHonoraire);

// ➤ Récupérer honoraires par ID formateur
router.get('/formateur/:id', getHonorairesParFormateur);

// ➤ Télécharger un PDF
router.get('/download/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, '../../pdf', fileName);

  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ message: 'Fichier non trouvé' });
  }
});

// ➤ Archiver tous les honoraires d’un formateur
router.post('/archive/:formateurId', honoraireController.archiverHonorairesParFormateur);

// ➤ Récupérer les honoraires du formateur connecté
router.get('/mes-honoraires', protect, honoraireController.getHonorairesFormateur);

module.exports = router;
