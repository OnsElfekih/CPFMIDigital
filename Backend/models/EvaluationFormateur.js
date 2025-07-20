// models/EvaluationFormateur.js
const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  formateur: { type: mongoose.Schema.Types.ObjectId, ref: 'Formateur', required: true },
  criteres: {
    experienceProfessionnelle: { type: Number, min: 1, max: 5, required: true },
    experienceFormationContinue: { type: Number, min: 1, max: 5, required: true },
    experiencePedagogique: { type: Number, min: 1, max: 5, required: true },
    diplome: { type: Number, min: 1, max: 5, required: true },
    honoraires: { type: Number, min: 1, max: 5, required: true },
    deontologie: { type: Number, min: 1, max: 5, required: true },
    comportement: { type: Number, min: 1, max: 5, required: true }
  },
  moyenne: Number,
  dateEvaluation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EvaluationFormateur', evaluationSchema);
