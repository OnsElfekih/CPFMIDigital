const mongoose = require("mongoose");

const factureSchema = new mongoose.Schema({
  numero: { type: String, required: true, unique: true },
  date: { type: Date, default: Date.now },
  montant: { type: Number, required: true },
  statut: { type: String, enum: ["payée", "en attente"], default: "en attente" },
  clientEmail: { type: String, required: true },
  clientNom: { type: String, required: true },
  entreprise: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  formations: [
  {
    nomFormation: { type: String, required: true },
    nomFormateur: { type: String, required: true },
    montantFormation: { type: Number, required: true }
  }
],
montant: { type: Number, required: true },
statut: String,
date: { type: Date, default: Date.now },

});

module.exports = mongoose.model("Facture", factureSchema);
