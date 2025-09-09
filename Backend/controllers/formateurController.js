const bcrypt = require('bcryptjs');
const Formateur = require('../models/formateurModel');
const User = require('../models/User');

const addFormateur = async (req, res) => {
  try {
    const { nom, prenom, email, planning, domaine, diplome, specialite, password } = req.body;

    // Vérifier si l’email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

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

const getFormateurs = async (req, res) => {
  try {
    const formateurs = await Formateur.find({ archived: false });
    res.json(formateurs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer formateur par ID
const getFormateurById = async (req, res) => {
  try {
    const formateur = await Formateur.findById(req.params.id);
    if (!formateur) return res.status(404).json({ message: 'Formateur non trouvé' });
    res.json(formateur);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Modifier formateur
const updateFormateur = async (req, res) => {
  try {
    const { nom, prenom, email, planning, domaine, diplome, specialite, password } = req.body;

    const formateur = await Formateur.findById(req.params.id);
    if (!formateur) return res.status(404).json({ message: 'Formateur non trouvé' });

    formateur.nom = nom || formateur.nom;
    formateur.prenom = prenom || formateur.prenom;
    formateur.email = email || formateur.email;
    formateur.planning = planning || formateur.planning;
    formateur.domaine = domaine || formateur.domaine;
    formateur.diplome = diplome || formateur.diplome;
    formateur.specialite = specialite || formateur.specialite;

    if (password) {
      formateur.password = await bcrypt.hash(password, 10);
    }

    await formateur.save();

    // Mettre à jour User
    const user = await User.findOne({ email: formateur.email });
    if (user) {
      user.username = `${formateur.prenom} ${formateur.nom}`;
      if (password) user.password = formateur.password;
      await user.save();
    }

    res.json({ message: 'Formateur mis à jour', formateur });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Suppression logique (archivage)
const deleteFormateur = async (req, res) => {
  try {
    const formateur = await Formateur.findById(req.params.id);
    if (!formateur) return res.status(404).json({ message: 'Formateur non trouvé' });

    formateur.archived = true;
    await formateur.save();

    res.json({ message: 'Formateur archivé avec succès' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { addFormateur, getCompetences, getFormateurs, getFormateurById, updateFormateur, deleteFormateur };
