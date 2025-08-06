// routes/participants.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const XLSX = require("xlsx");
const Participant = require("../../models/Participant");

// Multer config mémoire
const storage = multer.memoryStorage();
const upload = multer({ storage });

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { clientId, columnMapping } = req.body;
    
    // Validation
    if (!clientId) throw new Error("Client ID manquant");
    
    // Traitement du fichier Excel
    const participants = processExcel(req.file, JSON.parse(columnMapping), clientId);
    
    await Participant.insertMany(participants);
    res.json({ message: `${participants.length} participants importés` });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
