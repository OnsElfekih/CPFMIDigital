const express = require('express');
const router = express.Router();
const Formation = require('../../models/Formation');

// Middleware de validation
const validateFormation = (req, res, next) => {
  if (!req.body.titre) return res.status(400).json({ message: "Le titre est requis" });
  if (!req.body.dateDebut) return res.status(400).json({ message: "La date de début est requise" });
  if (!req.body.formateur) return res.status(400).json({ message: "Le formateur est requis" });
  next();
};

// 🔹 GET: Récupérer toutes les formations avec filtres
router.get('/', async (req, res) => {
  try {
    const { statut } = req.query;
    const filter = statut ? { statut } : {};
    
    const formations = await Formation.find(filter)
      .populate('formateur', 'nom email')
      .populate('participants', 'nom email');
      
    res.json(formations);
  } catch (err) {
    res.status(500).json({ 
      message: "Erreur de chargement",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 🔹 GET: Récupérer une formation spécifique
router.get('/:id', async (req, res) => {
  try {
    const formation = await Formation.findById(req.params.id)
      .populate('formateur participants');
      
    if (!formation) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }
    res.json(formation);
  } catch (err) {
    res.status(500).json({ message: "Erreur de chargement" });
  }
});

// 🔹 POST: Créer une nouvelle formation
router.post('/', validateFormation, async (req, res) => {
  try {
    const formationData = {
      ...req.body,
      idSession: `FORM-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      statut: 'en attente' // Valeur par défaut
    };

    const nouvelleFormation = await Formation.create(formationData);
    res.status(201).json(nouvelleFormation);
  } catch (err) {
    res.status(500).json({ 
      message: "Erreur de création",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 🔹 PUT: Valider/Annuler une formation (SPÉCIFIQUE - Doit être avant la route générique)
router.put('/:id/validate', async (req, res) => {
  try {
    const { action } = req.body;
    
    if (!['validate', 'cancel'].includes(action)) {
      return res.status(400).json({ message: "Action invalide. Utilisez 'validate' ou 'cancel'" });
    }

    const statut = action === 'validate' ? 'validée' : 'annulée';
    
    const updated = await Formation.findByIdAndUpdate(
      req.params.id,
      { statut },
      { new: true, runValidators: true }
    ).populate('formateur participants');

    if (!updated) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ 
      message: "Erreur de validation",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 🔹 PUT: Modifier une formation (GÉNÉRIQUE)
router.put('/:id', validateFormation, async (req, res) => {
  try {
    const updated = await Formation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!updated) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }
    
    res.json(updated);
  } catch (err) {
    res.status(500).json({ 
      message: "Erreur de modification",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

// 🔹 DELETE: Supprimer une formation
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Formation.findByIdAndDelete(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({ message: "Formation non trouvée" });
    }
    
    res.json({ message: "Formation supprimée avec succès" });
  } catch (err) {
    res.status(500).json({ 
      message: "Erreur de suppression",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
});

module.exports = router;