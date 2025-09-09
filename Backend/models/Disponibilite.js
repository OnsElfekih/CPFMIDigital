// models/Disponibilite.js
const mongoose = require('mongoose');

const disponibiliteSchema = new mongoose.Schema({
  formateurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Formateur',
    required: true,
  },
  date: {
    type: Date,  // ⚡️ Utiliser Date plutôt que String
    required: true,
  },
  periode: {
    type: String,
    enum: ['matin', 'après-midi'], // utiliser "apres-midi" sans accent pour compatibilité frontend
    required: true,
  },
  formation: { type: String }
});

module.exports = mongoose.model('Disponibilite', disponibiliteSchema);
