const router = require("express").Router();
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const { Resend } = require("resend");
const LoginLog = require("../../models/loginLog"); // import log
const resend = new Resend("re_ghCMdVbG_6rCSZHZs4QgXQFy8bMw8yKBy");

router.post("/add", async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role
    });

    await newUser.save();

    res.status(201).json({
      message: "Utilisateur ajouté avec succès",
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        role: newUser.role
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'ajout de l'utilisateur", error });
  }
});


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


router.post("/login", async (req, res) => {
  const { email, password, role } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
    const user = await User.findOne({ email, role });
    let success = false;

    if (!user) {
      await LoginLog.create({ email, role, ip, success });
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      await LoginLog.create({ email, role, ip, success });
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      "jwtSecret",
      { expiresIn: "1d" }
    );

    success = true;
    await LoginLog.create({ email, role, ip, success });

    // Chercher la dernière connexion avant celle-ci
    const lastLogin = await LoginLog.findOne({
      email,
      role,
      success: true,
    })
    .sort({ date: -1 })
    .skip(1);

const lastLoginDateFormatted = lastLogin
  ? new Date(lastLogin.date).toLocaleString("fr-FR", {
      timeZone: "Africa/Tunis",
      weekday: "long", 
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false // format 24h
    }).replace(",", "")
  : null;


res.json({
  token,
  role: user.role,
  username: user.username,
  lastLoginDate: lastLoginDateFormatted,
  email: user.email,
  ip: ip,
});
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});



// Lire tous les utilisateurs (READ)
router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs", error });
  }
});

// Lire un utilisateur par ID (READ)
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur", error });
  }
});

// Mettre à jour un utilisateur par ID (UPDATE)
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { email, password } = req.body;

  try {
    let updatedFields = { email };

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updatedFields.password = hashedPassword;
    }

    const updatedUser = await User.findByIdAndUpdate(
      id, 
      updatedFields,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    res.status(200).json({
      message: "Utilisateur mis à jour avec succès",
      updatedUser
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour de l'utilisateur", error });
  }
});

// Supprimer un utilisateur par ID (DELETE)
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Supprimer aussi les logs liés à cet email
    await LoginLog.deleteMany({ email: deletedUser.email });

    res.status(200).json({ message: "Utilisateur supprimé avec succès et logs supprimés" });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur", error });
  }
});




module.exports = router;
