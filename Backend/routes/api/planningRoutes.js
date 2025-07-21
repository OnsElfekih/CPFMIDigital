const express = require("express");
const router = express.Router();
const Planning = require("../../models/Planning");

// Ajouter un planning
router.post("/add", async (req, res) => {
  try {
    const newPlanning = new Planning(req.body);
    await newPlanning.save();
    res.json({ message: "Planning ajouté", planning: newPlanning });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Récupérer les plannings d’un formateur
router.get("/:formateurId", async (req, res) => {
  try {
    const plannings = await Planning.find({ formateurId: req.params.formateurId });
    res.json(plannings);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

module.exports = router;
