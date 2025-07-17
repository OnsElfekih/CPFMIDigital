const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { Resend } = require("resend");

const resend = new Resend("re_ghCMdVbG_6rCSZHZs4QgXQFy8bMw8yKBy");

router.post("/resetpassword", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const generatePassword = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      let password = "";
      for (let i = 0; i < 10; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return password;
    };

    const newPassword = generatePassword();
    console.log("Mot de passe envoyé:", newPassword);

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    await resend.emails.send({
      from: "CPFMI Direction <onboarding@resend.dev>",
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      text: `Votre nouveau mot de passe est : ${newPassword}`,
    });

    return res.status(200).json({ message: "Le nouveau mot de passe est envoyé par email" });
  } catch (error) {
    return res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
});



// 📌 LOGIN
router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;

  try {
    const user = await User.findOne({ email, role });

    if (role === "admin") {
      if (!user) return res.status(400).json({ message: "Accès refusé" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Accès refusé" });
    } else {
      if (!user) return res.status(400).json({ message: "Utilisateur non trouvé" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: "Mot de passe incorrect" });
    }

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

module.exports = router;
