const express = require("express");
const router = express.Router();
const { Resend } = require("resend");

// Remplace ici par ta vraie clé API depuis https://resend.com
const resend = new Resend("re_d1NfPFyJ_DKa1DvAXuVCQzgWo3gHR3v3L");

router.post("/send", async (req, res) => {
  const { to, sujet, message } = req.body;

  try {
    const email = await resend.emails.send({
      from: "CPFMI Direction <noreply@cpfmi.tn>",
      to,
      subject: sujet,
      text: message,
    });

    console.log("✅ Email envoyé avec succès :", email);
    res.status(200).json({ message: "✅ Email envoyé avec succès !" });
  } catch (error) {
    console.error("❌ Erreur d'envoi :", error);
    res.status(500).json({ message: "❌ Échec de l'envoi de l'email", error: error.message });
  }
});

module.exports = router;
