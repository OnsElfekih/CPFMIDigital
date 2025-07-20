// backend/routes/formationRoutes.js
const express = require("express");
const router = express.Router();
const Formation = require("../../models/Formation"); 

// 🔹 GET: récupérer toutes les formations
router.get('/planning/:id', async (req, res) => {
  try {
    const formations = await Formation.find({ formateurId: req.params.id });
    res.json(formations);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});

// 🔹 POST: créer une nouvelle formation
// routes/formationRoutes.js
router.post("/", async (req, res) => {
  try {
    console.log("Corps de la requête:", req.body);
    
    // Validation des champs obligatoires
    if (!req.body.titre) return res.status(400).json({ message: "Le titre est requis" });
    if (!req.body.dateDebut) return res.status(400).json({ message: "La date de début est requise" });
    if (!req.body.formateur) return res.status(400).json({ message: "Le formateur est requis" });

    const formationData = {
      titre: req.body.titre,
      description: req.body.description || "",
      dateDebut: new Date(req.body.dateDebut),
      dateFin: new Date(req.body.dateFin),
      formateur: req.body.formateur.toString(), // Conversion explicite en string
      lieu: req.body.lieu || "En ligne",
      theme: req.body.theme || "Général",
      duree: req.body.duree || 1,
      idSession: `FORM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`
    };

    const nouvelleFormation = await Formation.create(formationData);
    console.log("Formation créée:", nouvelleFormation);
    
    res.status(201).json(nouvelleFormation);
  } catch (err) {
    console.error("Erreur serveur:", err);
    res.status(500).json({ 
      message: "Erreur lors de la création de la formation",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 🔹 PUT: modifier une formation
router.put("/:id", async (req, res) => {
  try {
    const updated = await Formation.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 DELETE: supprimer une formation
router.delete("/:id", async (req, res) => {
  try {
    await Formation.findByIdAndDelete(req.params.id);
    res.json({ message: "Formation supprimée avec succès." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
