const express = require("express");
const router = express.Router();
const User = require("../../models/User");
const Formateur = require("../../models/Formateur");

router.post("/copier-formateurs", async (req, res) => {
  try {
    // Récupérer tous les users avec role formateur
    const formateursUsers = await User.find({ role: "formateur" });

    // Vérifier si aucun formateur
    if (formateursUsers.length === 0) {
      return res.status(404).json({ message: "Aucun formateur trouvé" });
    }

    // Pour chaque user formateur, créer un formateur dans la collection Formateur
    for (let user of formateursUsers) {
      // Vérifier si déjà existant dans la collection formateurs
      const exists = await Formateur.findOne({ email: user.email });
      if (!exists) {
        const nouveauFormateur = new Formateur({
          username: user.username,
          email: user.email,
          password: user.password,
          role: user.role
        });
        await nouveauFormateur.save();
      }
    }

    res.status(200).json({ message: "Tous les formateurs copiés avec succès" });
  } catch (error) {
    console.error("Erreur copie formateurs :", error);
    res.status(500).json({ message: "Erreur copie formateurs", error });
  }
});

module.exports = router;
