// controllers/evaluationController.js
const Evaluation = require('../models/EvaluationFormateur');
const Formateur = require('../models/formateurModel');

exports.createEvaluation = async (req, res) => {
  try {
    const { formateur, criteres } = req.body;
    console.log("Requête reçue pour créer une évaluation :", req.body);


    if (!formateur || !criteres || typeof criteres !== 'object') {
      return res.status(400).json({ message: "Formateur et critères sont requis." });
    }

    const values = Object.values(criteres);
    const requiredCriteres = ['experienceProfessionnelle', 'experienceFormationContinue', 'experiencePedagogique', 'diplome', 'honoraires', 'deontologie', 'comportement'];

    for (const crit of requiredCriteres) {
      if (!(crit in criteres)) {
        return res.status(400).json({ message: `Critère manquant: ${crit}` });
      }
    }


    const moyenne = values.reduce((a, b) => a + b, 0) / values.length;

    const formateurData = await Formateur.findById(formateur);
    if (!formateurData) {
      return res.status(404).json({ message: "Formateur introuvable" });
    }

    const newEval = new Evaluation({
      formateur: formateurData._id,
      nom: formateurData.nom,
      prenom: formateurData.prenom,
      diplome: formateurData.diplome,
      domaine: formateurData.domaine,
      experienceProfessionnelle: formateurData.experienceProfessionnelle,
      experienceFormationContinue: formateurData.experienceFormationContinue,
      experiencePedagogique: formateurData.experiencePedagogique,
      honoraires: formateurData.honoraires,
      deontologie: formateurData.deontologie,
      criteres,
      moyenne
    });

    await newEval.save();
    res.status(201).json(newEval);

  } catch (error) {
    console.error("Erreur lors de la création de l’évaluation :", error.message, error.stack);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
};
exports.getEvaluations = async (req, res) => {
  try {
    const evaluations = await Evaluation.find().populate('formateur');
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Récupérer toutes les évaluations d'un formateur par son ID
exports.getEvaluationsByFormateur = async (req, res) => {
  try {
    const { formateurId } = req.params;
    const evaluations = await Evaluation.find({ formateur: formateurId }).populate("formateur");

    if (!evaluations || evaluations.length === 0) {
      return res.status(404).json({ message: "Aucune évaluation trouvée pour ce formateur." });
    }

    res.json(evaluations);
  } catch (err) {
    console.error("Erreur getEvaluationsByFormateur:", err.message);
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
};
