// controllers/evaluationController.js
const Evaluation = require('../models/EvaluationFormateur');
const Formateur = require('../models/formateurModel');

exports.createEvaluation = async (req, res) => {
  try {
    const { formateur, criteres } = req.body;
    const values = Object.values(criteres);
    const moyenne = values.reduce((a, b) => a + b, 0) / values.length;

    const newEval = new Evaluation({
      formateur,
      criteres,
      moyenne
    });

    await newEval.save();
    res.status(201).json(newEval);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error });
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
