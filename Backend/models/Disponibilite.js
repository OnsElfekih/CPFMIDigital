const mongoose = require('mongoose');

const disponibiliteSchema = new mongoose.Schema({
  formateurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Formateur',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  periode: {
    type: String,
    enum: ['matin', 'après-midi'],  // Accent ici important !
    required: true,
  },
});

module.exports = mongoose.model('Disponibilite', disponibiliteSchema);
