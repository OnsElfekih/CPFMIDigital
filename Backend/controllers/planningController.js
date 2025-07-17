const Planning = require("../models/Planning");
const User = require("../models/User");

exports.getPlanningByFormateur = async (req, res) => {
  try {
    const { formateurId } = req.params;
    const planning = await Planning.find({ formateurId }).populate("formateurId", "username email");

    res.status(200).json(planning);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

exports.addPlanning = async (req, res) => {
  try {
    const { formateurId, formationTitle, dateDebut, dateFin, lieu } = req.body;

    const planning = new Planning({
      formateurId,
      formationTitle,
      dateDebut,
      dateFin,
      lieu,
    });

    await planning.save();
    res.status(201).json({ message: "Planning ajouté", planning });
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};
