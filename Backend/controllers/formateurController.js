const Formateur = require('../models/formateurModel');

const addFormateur = async (req, res) => {
  try {
    const { nom, prenom, email, planning, domaine, diplome } = req.body;
    const nouveauFormateur = new Formateur({ nom, prenom, email, planning, domaine, diplome });
    await nouveauFormateur.save();
    res.status(201).json({ message: 'Formateur ajouté avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

const getCompetences = async (req, res) => {
  try {
    // Ici on récupère les valeurs uniques du champ "specialite" (ou "domaine", selon ce que tu veux)
    const competences = await Formateur.distinct('domaine'); // ou 'domaine' si tu préfères
    res.json(competences.filter(c => c)); // filtre les valeurs nulles/vides
  } catch (error) {
    console.error("Erreur récupération des compétences :", error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};

module.exports = { addFormateur, getCompetences };
