// routes/formateurRoutes.js
const express = require('express');
const router = express.Router();
const { addFormateur, getCompetences } = require('../../controllers/formateurController');
const Formateur = require('../../models/formateurModel');

// Route POST pour ajouter un formateur
router.post('/add', addFormateur);

// Route GET pour récupérer tous les formateurs
router.get('/', async (req, res) => {
  try {
    const formateurs = await Formateur.find();
    res.json(formateurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET compétences distinctes
router.get('/competences', getCompetences);

// Route GET par ID
router.get("/:id", async (req, res) => {
  try {
    const formateur = await Formateur.findById(req.params.id);
    res.json(formateur);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
