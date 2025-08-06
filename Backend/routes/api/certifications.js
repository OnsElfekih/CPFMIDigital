const express = require("express");
const router = express.Router();
const Certification = require("../../models/Certification");
const Counter=require ("../../models/Counter");

// Fonction pour obtenir le numéro unique
async function getNextSequence(name) {
  const counter = await Counter.findOneAndUpdate(
    { name },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return counter.seq;
}


// GET toutes les certifications
router.get("/all", async (req, res) => {
  try {
    const certifications = await Certification.find();
    res.json(certifications);
  } catch (err) {
    console.error("Erreur récupération certifications :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// GET une certification par ID
router.get("/:id", async (req, res) => {
  try {
    const certif = await Certification.findById(req.params.id);
    if (!certif) {
      return res.status(404).json({ message: "Certification non trouvée" });
    }
    res.json(certif);
  } catch (err) {
    console.error("Erreur récupération certification :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// POST ajouter une certification
router.post("/addcertifEntreprise", async (req, res) => {
  try {
    // Génère le numéro avant de créer la certification
    const numero = await getNextSequence('certifNumeroEntreprise');

    const { nomSociete, theme, duree, datedebut, datefin } = req.body;

    const newCertif = new Certification({
      numero, // bien fourni ici
      nomSociete,
      theme,
      duree,
      datedebut,
      datefin
    });

    const savedCertif = await newCertif.save();
    res.status(201).json(savedCertif);

  } catch (err) {
    console.error("Erreur ajout certification :", err);
    res.status(400).json({ message: "Erreur lors de l'ajout" });
  }
});

// POST ajouter une certification
router.post("/addcertifParticipant", async (req, res) => {
    const numero = await getNextSequence('certifNumeroParticipant');
    const { nomSociete, nomPrenomPart, theme, duree, datedebut, datefin } = req.body;

  const newCertif = new Certification({
    numero,
    nomSociete,
    nomPrenomPart,
    theme,
    duree,
    datedebut,
    datefin
  });

  try {
    const savedCertif = await newCertif.save();
    res.status(201).json(savedCertif);
  } catch (err) {
    console.error("Erreur ajout certification :", err);
    res.status(400).json({ message: "Erreur lors de l'ajout" });
  }
});

// PUT mise à jour d'une certification
router.put("/:id", async (req, res) => {
  const { nomSociete, theme, duree, datedebut, datefin } = req.body;

  try {
    const updatedCertif = await Certification.findByIdAndUpdate(
      req.params.id,
      { nomSociete, theme, duree, datedebut, datefin },
      { new: true }
    );

    if (!updatedCertif) {
      return res.status(404).json({ message: "Certification non trouvée" });
    }

    res.json(updatedCertif);
  } catch (err) {
    console.error("Erreur mise à jour certification :", err);
    res.status(400).json({ message: "Erreur lors de la mise à jour" });
  }
});

// DELETE suppression d'une certification
router.delete("/:id", async (req, res) => {
  try {
    const deletedCertif = await Certification.findByIdAndDelete(req.params.id);

    if (!deletedCertif) {
      return res.status(404).json({ message: "Certification non trouvée" });
    }

    res.json({ message: "Certification supprimée" });
  } catch (err) {
    console.error("Erreur suppression certification :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
