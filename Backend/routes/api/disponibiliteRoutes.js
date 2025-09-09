const express = require('express');
const router = express.Router();
const Disponibilite = require('../../models/Disponibilite');
const controller = require('../../controllers/disponibiliteController');

// ➕ Ajouter une disponibilité
router.post('/add', async (req, res) => {
  try {
    const { formateurId, date, periode, formation } = req.body;

    console.log("Données reçues :", req.body);

    // Convertir date en Date JS et normaliser à minuit UTC
    const parsedDate = new Date(`${date}T00:00:00.000Z`);
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
      formation
    });

    await dispo.save();

    res.status(201).json(dispo);
  } catch (error) {
    console.error("Erreur lors de l'ajout :", error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// 🔄 Récupérer les dispos d’un formateur
router.get('/public', async (req, res) => {
  try {
     const { formation, periode } = req.query;
    let query = {};

    if (formation) query.formation = formation;
    if (periode) query.periode = periode;

    const disponibilites = await Disponibilite.find(query).populate("formateurId", "nom prenom email");
    res.status(200).json(disponibilites);
  } catch (error) {
    console.error("Erreur lors de la récupération :", error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
});

// 🔹 Récupérer toutes les formations distinctes
router.get('/formations', async (req, res) => {
  try {
    const formations = await Disponibilite.distinct("formation", { formation: { $ne: null } });
    res.status(200).json(formations);
  } catch (error) {
    console.error("Erreur lors de la récupération des formations:", error);
    res.status(500).json({ message: "Erreur serveur" });
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


// 🔄 Récupérer toutes les disponibilités (pour admin)
router.get('/all', async (req, res) => {
  try {
    const disponibilites = await Disponibilite.find()
      .populate("formateurId", "nom prenom email");
    
    // Convertir date et période en format lisible pour le calendrier
    const events = disponibilites.map(d => {
      let start = new Date(d.date);
      let end = new Date(d.date);

      // Définir l'heure selon la période
      if (d.periode === "matin") start.setHours(9, 0, 0), end.setHours(12, 0, 0);
      else if (d.periode === "apres-midi") start.setHours(13, 0, 0), end.setHours(17, 0, 0);
      else if (d.periode === "soir") start.setHours(18, 0, 0), end.setHours(20, 0, 0);

      return {
        id: d._id,
        title: `Disponible: ${d.formateurId.nom} ${d.formateurId.prenom}`,
        start,
        end,
        extendedProps: {
          formateur: `${d.formateurId.nom} ${d.formateurId.prenom}`,
          periode: d.periode,
          formation: d.formation || "Libre",
        },
      };
    });

    res.status(200).json(events);
  } catch (error) {
    console.error("Erreur récupération disponibilités :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});


module.exports = router;
