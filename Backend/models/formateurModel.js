// models/formateurModel.js
const mongoose = require('mongoose');

const formateurSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    email: String,
    specialite: String,
    planning: String,
    diplome: String,
    domaine: String,
    password: { type: String, required: true },
    archived: { type: Boolean, default: false }, // suppression logique
    }, { timestamps: true });

module.exports = mongoose.model('Formateur', formateurSchema);
