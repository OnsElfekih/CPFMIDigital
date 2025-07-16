// backend/models/Formation.js
const mongoose = require('mongoose');

const formationSchema = new mongoose.Schema({
  titre: { type: String, required: true },
  description: String,
  dateDebut: { type: Date, required: true },
  dateFin: { type: Date, required: true },
  formateur: { 
    type: String,  // Type changé à String
    required: true 
  },
  lieu: { type: String, default: "En ligne" },
  theme: { type: String, default: "Général" },
  duree: { type: Number, default: 1 },
  idSession: { type: String, unique: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Formation', formationSchema);
