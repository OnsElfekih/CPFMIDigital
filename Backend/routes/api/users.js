const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");


// 📌 LOGIN
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email, role });
    if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "jwtSecret", // ⚠️ À remplacer par une vraie variable d’environnement plus tard
      { expiresIn: "1d" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});


// 📌 AJOUTER UN FORMATEUR OU ADMIN
router.post("/add", async (req, res) => {
  try {
    const { username, nom, prenom, email, password, role } = req.body;

    // Validation simple
    if (!username || !nom || !prenom || !email || !password || !role) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }

    // Vérifie si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Utilisateur déjà existant avec cet email" });
    }

    // Hash du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer et enregistrer le nouvel utilisateur
    const newUser = new User({
      username,
      nom,
      prenom,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    res.status(201).json({ message: "Utilisateur ajouté avec succès !" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});


// 📌 LISTER TOUS LES UTILISATEURS (optionnel pour l’admin)
router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password"); // Exclure le mot de passe
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
  }
});

module.exports = router;
