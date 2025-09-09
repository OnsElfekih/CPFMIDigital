const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Vérif si email et password existent
  if (!email || !password) {
    return res.status(400).json({ msg: "Veuillez fournir un email et un mot de passe" });
  }

  try {
    // Recherche de l'utilisateur
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Utilisateur non trouvé" });
    }

    // Vérification du mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Mot de passe incorrect" });
    }

    // Génération du token JWT
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "secretkey", // fallback si non défini
      { expiresIn: "1d" }
    );

    // Réponse
    return res.status(200).json({
      token,
      user: {
        id: user._id,
        nom: user.nom,
        prenom: user.prenom || "", // si tu as prénom
        email: user.email,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Erreur login:", err);
    return res.status(500).json({ msg: "Erreur serveur" });
  }
};
