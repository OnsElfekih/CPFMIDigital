const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Formateur = require("../../models/formateurModel");
const User = require("../../models/User");
const { addFormateur, getCompetences } = require("../../controllers/formateurController");

// ➔ POST ajouter un formateur (et aussi user)
router.post("/addform", addFormateur);


// ➔ GET tous les formateurs
router.get("/allform", async (req, res) => {
  try {
    const formateurs = await Formateur.find();
    res.status(200).json(formateurs);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération formateurs", error });
  }
});

// ➔ GET compétences
router.get("/competences", getCompetences);

// ➔ GET un formateur par ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const formateur = await Formateur.findById(id);
    if (!formateur) return res.status(404).json({ message: "Formateur non trouvé" });
    res.status(200).json(formateur);
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération formateur", error });
  }
});

// ➔ POST ajouter un formateur
router.post("/addform", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existing = await Formateur.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newFormateur = new Formateur({
      username,
      email,
      password: hashedPassword,
      role: "formateur"
    });

    await newFormateur.save();

    res.status(201).json({
      message: "Formateur ajouté",
      formateur: {
        id: newFormateur._id,
        username: newFormateur.username,
        email: newFormateur.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur ajout formateur", error });
  }
});

// ➔ PUT mise à jour formateur
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { username, email, password } = req.body;
  try {
    let updatedFields = { username, email };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = hashedPassword;

      // Mettre à jour aussi dans User
      await User.findOneAndUpdate(
        { email: email, role: "formateur" },
        { password: hashedPassword }
      );
    }

    const updatedFormateur = await Formateur.findByIdAndUpdate(id, updatedFields, { new: true });

    if (!updatedFormateur) return res.status(404).json({ message: "Formateur non trouvé" });

    res.status(200).json({
      message: "Formateur mis à jour",
      updatedFormateur
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur mise à jour formateur", error });
  }
});


// ➔ DELETE formateur
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedFormateur = await Formateur.findByIdAndDelete(id);
    if (!deletedFormateur) return res.status(404).json({ message: "Formateur non trouvé" });

    res.status(200).json({ message: "Formateur supprimé" });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression formateur", error });
  }
});

// ➔ POST copier formateurs depuis users
router.post("/copier-formateurs", async (req, res) => {
  try {
    const formateursUsers = await User.find({ role: "formateur" });

    if (formateursUsers.length === 0) {
      return res.status(404).json({ message: "Aucun formateur trouvé dans users" });
    }

    let insertedCount = 0;

    for (let user of formateursUsers) {
      const exists = await Formateur.findOne({ email: user.email });
      if (!exists) {
        const nouveauFormateur = new Formateur({
          username: user.username,
          email: user.email,
          password: user.password, // déjà hashé
          role: "formateur"
        });
        await nouveauFormateur.save();
        insertedCount++;
      }
    }

    res.status(200).json({ 
      message: `${insertedCount} formateurs copiés avec succès` 
    });
  } catch (error) {
    console.error("Erreur copie formateurs :", error);
    res.status(500).json({ message: "Erreur copie formateurs", error });
  }
});

module.exports = router;
