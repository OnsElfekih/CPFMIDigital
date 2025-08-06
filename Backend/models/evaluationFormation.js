const mongoose = require("mongoose");

const EvaluationFormationSchema = new mongoose.Schema(
  {
    formationNom: { type: String, required: true }, // Nom libre
    note: { type: Number, required: true },
    commentaire: { type: String },
    anonyme: { type: Boolean, default: false },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("EvaluationFormation", EvaluationFormationSchema);
