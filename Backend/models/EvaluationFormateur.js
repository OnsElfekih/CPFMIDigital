// models/EvaluationFormateur.js
const mongoose = require('mongoose');

const evaluationSchema = new mongoose.Schema({
  formateur: { type: mongoose.Schema.Types.ObjectId, ref: 'Formateur', required: true },

  // Champs copiés du formateur
  nom: String,
  prenom: String,
  diplome: String,
  domaine: String,
  experienceProfessionnelle: Number,
  experienceFormationContinue: Number,
  experiencePedagogique: Number,
  honoraires: Number,
  deontologie: Number,

  // Notes d’évaluation
  criteres: {
    experienceProfessionnelle: { type: Number, required: true },
    experienceFormationContinue: { type: Number, required: true },
    experiencePedagogique: { type: Number, required: true },
    diplome: { type: Number, required: true },
    honoraires: { type: Number, required: true },
    deontologie: { type: Number, required: true },
    comportement: { type: Number, required: true }
  },

  moyenne: Number,
  dateEvaluation: { type: Date, default: Date.now }
});

module.exports = mongoose.model('EvaluationFormateur', evaluationSchema);
