const express = require('express');
const router = express.Router();
const Disponibilite = require('../../models/Disponibilite');
const controller = require('../../controllers/disponibiliteController');

// ➕ Ajouter une disponibilité
router.post('/add', async (req, res) => {
  try {
    const { formateurId, date, periode } = req.body;

    console.log("Données reçues :", req.body);

    // Convertir date en Date JS et normaliser à minuit UTC
    const parsedDate = new Date(date);
    parsedDate.setUTCHours(0, 0, 0, 0);

    const nextDay = new Date(parsedDate);
    nextDay.setDate(parsedDate.getDate() + 1);

    // Vérifier s’il existe déjà une dispo le même jour avec la même période
    const exists = await Disponibilite.findOne({
      formateurId,
      periode,
      date: {
        $gte: parsedDate,
        $lt: nextDay,
      },
    });

    if (exists) {
      return res.status(400).json({ message: 'Déjà réservé pour cette période.' });
    }

    const dispo = new Disponibilite({
      formateurId,
      date: parsedDate,
      periode,
    });

    await dispo.save();

    res.status(201).json(dispo);
  } catch (error) {
    console.error("Erreur lors de l'ajout :", error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// 🔄 Récupérer les dispos d’un formateur
router.get('/:formateurId', async (req, res) => {
  try {
    const { formateurId } = req.params;
    const disponibilites = await Disponibilite.find({ formateurId });
    res.status(200).json(disponibilites);
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});
// ❌ Supprimer une disponibilité (ex: déselection dans le calendrier)
router.delete('/remove', async (req, res) => {
  try {
    const { formateurId, date, periode } = req.body;

    const parsedDate = new Date(date);
    parsedDate.setUTCHours(0, 0, 0, 0);
    const nextDay = new Date(parsedDate);
    nextDay.setDate(parsedDate.getDate() + 1);

    const deleted = await Disponibilite.findOneAndDelete({
      formateurId,
      periode,
      date: {
        $gte: parsedDate,
        $lt: nextDay,
      },
    });

    if (!deleted) return res.status(404).json({ message: "Disponibilité non trouvée" });

    res.status(200).json({ message: "Disponibilité supprimée" });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

router.post('/add', controller.ajouterDisponibilite);
router.get('/:formateurId', controller.getDisponibilites);

module.exports = router;
