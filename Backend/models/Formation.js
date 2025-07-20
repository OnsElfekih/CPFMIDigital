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
  lieu: { type: String},
  theme: { type: String},
  duree: { type: Number},
  idSession: { type: String, unique: true },
  participants: {
  type: Number,
  required: true,
  min: 1,
  max: 10,
},
entreprise: {
  type: String,
  required: true
},
 statut: {
    type: String,
    enum: ['en attente', 'validée', 'annulée'],
    default: 'en attente'
  }
}, { timestamps: true });

module.exports = mongoose.model('Formation', formationSchema);
