// models/formateurModel.js
const mongoose = require('mongoose');

const formateurSchema = new mongoose.Schema({
    nom: String,
    prenom: String,
    email: String,
    specialite: String,
    planning: String
    // Ajoute d'autres champs si nécessaire
});

module.exports = mongoose.model('Formateur', formateurSchema);
