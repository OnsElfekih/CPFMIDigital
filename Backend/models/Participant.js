// models/Participant.js
const mongoose = require("mongoose");

const participantSchema = new mongoose.Schema({
  nom: String,
  prenom: String,
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  telephone: String,
  poste: String,
  formationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Formation",
    required: true,
  },
  clientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Client",
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Participant", participantSchema);
