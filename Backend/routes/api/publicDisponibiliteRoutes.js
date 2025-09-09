// routes/publicDisponibiliteRoutes.js
const express = require('express');
const router = express.Router();
const Disponibilite = require('../../models/Disponibilite');
const Formateur = require('../../models/formateurModel');

// GET /api/disponibilites/public?competence=React&period=matin
router.get('/public', async (req, res) => {
  try {
    const { formation, periode } = req.query;

    // 1. Trouver les formateurs filtrés par compétence si demandée
    let formateursFiltres = [];
    if (formation) {
      formateursFiltres = await Formateur.find({ formation: formation }).select('_id');
    } else {
      formateursFiltres = await Formateur.find().select('_id');
    }

    const formateurIds = formateursFiltres.map(f => f._id);

    // 2. Construire le filtre pour disponibilités
    const filtreDispo = { };
    if (formation) {
      filtreDispo.formation = formation;
    }
    if (periode) {
      filtreDispo.periode = periode; // "matin" ou "apres-midi"
    }

    // 3. Récupérer les disponibilités filtrées
    const disponibilites = await Disponibilite.find(filtreDispo)
      .populate('formateurId', 'nom formation'); // pour afficher nom et compétence

    res.json(disponibilites);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// ➕ Endpoint pour récupérer la liste unique des formations
router.get('/formations', async (req, res) => {
  try {
    const formations = await Disponibilite.distinct("formation");
    res.json(formations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur." });
  }
});

module.exports = router;
