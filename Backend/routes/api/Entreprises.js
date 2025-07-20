const express = require("express");
const router = express.Router();
const Entreprise = require("../../models/entreprise");

// 🔹 GET: récupérer toutes les entreprises
router.get("/", async (req, res) => {
  try {
    const entreprises = await Entreprise.find();
    res.json(entreprises);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 POST: créer une nouvelle entreprise
router.post("/", async (req, res) => {
  try {
    console.log("Corps de la requête:", req.body);

    const nouvelleEntreprise = new Entreprise({
      nom: req.body.nom,
      telephone: req.body.telephone,
      mail: req.body.mail,
      adresse: req.body.adresse,
      premierResponsable: req.body.premierResponsable,
      personnesAContacter: req.body.personnesAContacter || [],
      domaineActivite: req.body.domaineActivite,
      priseRdv: req.body.priseRdv ? new Date(req.body.priseRdv) : null,
      observation: req.body.observation,
      beneficiaires: req.body.beneficiaires || [],
    });

    const entrepriseEnregistree = await nouvelleEntreprise.save();
    res.status(201).json(entrepriseEnregistree);
  } catch (err) {
    console.error("Erreur lors de la création de l'entreprise:", err);
    res.status(500).json({
      message: "Erreur lors de la création de l'entreprise",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 🔹 PUT: modifier une entreprise
router.put("/:id", async (req, res) => {
  try {
    const updated = await Entreprise.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 DELETE: supprimer une entreprise
router.delete("/:id", async (req, res) => {
  try {
    await Entreprise.findByIdAndDelete(req.params.id);
    res.json({ message: "Entreprise supprimée avec succès." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
