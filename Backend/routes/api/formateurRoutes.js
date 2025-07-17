// routes/formateurRoutes.js
const express = require('express');
const router = express.Router();
const { addFormateur } = require('../../controllers/formateurController'); // chemin vers le modèle

// Route POST pour ajouter un formateur
router.post('/add', addFormateur);

module.exports = router;
