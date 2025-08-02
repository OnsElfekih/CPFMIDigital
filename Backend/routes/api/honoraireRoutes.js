const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const honoraireController = require('../../controllers/honoraireController');
const { protect } = require('../../models/authMiddleware');

const {
  ajouterHonoraire,
  getHonorairesParFormateur
} = require('../../controllers/honoraireController');

router.post('/add', ajouterHonoraire);
router.get('/formateur/:id', getHonorairesParFormateur);

router.get('/download/:fileName', (req, res) => {
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, '../../pdf', fileName);

  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ message: 'Fichier non trouvé' });
  }
});

router.post('/archive/:formateurId', honoraireController.archiverHonorairesParFormateur);

router.get('/mes-honoraires', protect, honoraireController.getHonorairesFormateur);


module.exports = router;
