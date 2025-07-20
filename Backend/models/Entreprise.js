const mongoose = require('mongoose');

const beneficiaireSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  sexe: { type: String, enum: ['Homme', 'Femme'] },
  numero: String,
  signe: String,
  matricule: String,
  cnss: String,
  qualification: String,
  poste: String,
  lieuAffectation: String
});

const entrepriseSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  telephone: String,
  mail: String,
  adresse: String,
  premierResponsable: String,
  personnesAContacter: [String],
  domaineActivite: String,
  priseRdv: Date,
  observation: String,
  beneficiaires: [beneficiaireSchema]
});

module.exports = mongoose.model('Entreprise', entrepriseSchema);
