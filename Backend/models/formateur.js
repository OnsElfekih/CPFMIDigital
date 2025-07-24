const mongoose = require('mongoose');

const formateurSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: "formateur" }
});

// Vérifie si le modèle existe déjà avant de le définir
module.exports = mongoose.models.Formateur || mongoose.model('Formateur', formateurSchema);
