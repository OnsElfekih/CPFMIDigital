// controllers/disponibiliteController.js
const Disponibilite = require('../models/Disponibilite');

// ➕ Ajouter une disponibilité avec vérification
exports.ajouterDisponibilite = async (req, res) => {
  try {
    const { formateurId, date, periode } = req.body;

    const dateNormalisee = new Date(date);
    dateNormalisee.setUTCHours(0, 0, 0, 0);

    const jourSuivant = new Date(dateNormalisee);
    jourSuivant.setDate(dateNormalisee.getDate() + 1);

    const existe = await Disponibilite.findOne({
      formateurId,
      periode,
      date: {
        $gte: dateNormalisee,
        $lt: jourSuivant,
      },
    });

    if (existe) {
      return res.status(400).json({ message: "Déjà réservé pour cette période." });
    }

    const dispo = new Disponibilite({ formateurId, date: dateNormalisee, periode });
    await dispo.save();
    res.status(201).json({ message: "Disponibilité ajoutée", dispo });
  } catch (error) {
    console.error("Erreur:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// 🔄 Obtenir les disponibilités d’un formateur
exports.getDisponibilites = async (req, res) => {
  try {
    const { formateurId } = req.params;
    const dispos = await Disponibilite.find({ formateurId });
    res.status(200).json(dispos);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
