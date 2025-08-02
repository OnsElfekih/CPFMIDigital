const mongoose = require('mongoose');
const certifSchema = new mongoose.Schema({
  numero: { type: Number, unique: true, required: true },
  nomSociete: { type: String, required: true },
  nomPrenomPart: { type: String, required: false },
  theme: { type: String, required: true },
  duree: { type: String, required: true },
  datedebut: { type: String, required: true },
  datefin: { type: String, required: true },
});

const Certif = mongoose.model('Certif', certifSchema);

module.exports = Certif;
