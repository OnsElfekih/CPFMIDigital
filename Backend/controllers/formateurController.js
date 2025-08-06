const bcrypt = require('bcryptjs');
const Formateur = require('../models/formateurModel');
const User = require('../models/User');

const addFormateur = async (req, res) => {
  try {
    const { nom, prenom, email, planning, domaine, diplome, specialite, password } = req.body;

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // créer dans formateurs
    const nouveauFormateur = new Formateur({
      nom,
      prenom,
      email,
      planning,
      domaine,
      diplome,
      specialite,
      password: hashedPassword
    });
    await nouveauFormateur.save();

    // créer dans users
    const nouveauUser = new User({
      username: `${prenom} ${nom}`,
      email,
      password: hashedPassword,
      role: 'formateur'
    });
    await nouveauUser.save();

    res.status(201).json({ message: 'Formateur et utilisateur ajoutés avec succès' });

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
