// routes/formateurRoutes.js
const express = require('express');
const router = express.Router();
const { addFormateur, getCompetences,
  getFormateurs,
  getFormateurById,
  updateFormateur,
  deleteFormateur } = require('../../controllers/formateurController');
const Formateur = require('../../models/formateurModel');
const User = require('../../models/User');

// Route POST pour ajouter un formateur
router.post('/add', addFormateur);
router.get('/', getFormateurs);
router.get('/:id', getFormateurById);
router.put('/:id', updateFormateur);
router.delete('/:id', deleteFormateur);

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
router.delete('/:id', async (req, res) => {
  try {
    const formateur = await Formateur.findByIdAndDelete(req.params.id);

    if (!formateur) {
      return res.status(404).json({ message: 'Formateur non trouvé' });
    }

    // Supprimer le compte user lié à ce formateur via email
    await User.findOneAndDelete({ email: formateur.email });

    res.json({ message: 'Formateur et utilisateur supprimés avec succès' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
});

module.exports = router;
