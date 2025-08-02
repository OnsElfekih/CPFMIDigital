const mongoose = require('mongoose');

const honoraireSchema = new mongoose.Schema({
  formateurId: { type: mongoose.Schema.Types.ObjectId, ref: 'Formateur', required: true },
  type: { type: String, enum: ['taux_horaire', 'forfait'], required: true },
  valeur: { type: Number, required: true },
  heures: { type: Number }, // utilisé si taux horaire
  total: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  archive: { type: Boolean, default: false },
  status: { type: String, enum: ["validée", "envoyée", "payée"], default: "validée" },
  pdfPath: String,
});

module.exports = mongoose.model('Honoraire', honoraireSchema);
