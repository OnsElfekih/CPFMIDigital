const mongoose = require("mongoose");

const planningSchema = new mongoose.Schema({
  formateurId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  formationTitle: {
    type: String,
    required: true
  },
  dateDebut: {
    type: Date,
    required: true
  },
  dateFin: {
    type: Date,
    required: true
  },
  lieu: String
});

module.exports = mongoose.model("Planning", planningSchema);
