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

module.exports = { addFormateur };
