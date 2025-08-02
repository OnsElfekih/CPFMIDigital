const express = require("express");
const router = express.Router();
const EvaluationFormation = require("../../models/evaluationFormation");

// POST - créer une nouvelle évaluation
router.post("/allevalform", async (req, res) => {
  try {
    console.log("Données reçues :", req.body); // <--- vérifie ce qui arrive
    const { formationNom, note, commentaire, anonyme, clientId } = req.body;

    // Vérification simple
    if (!clientId) {
      return res.status(400).json({ message: "clientId est obligatoire" });
    }

    const newEval = new EvaluationFormation({
      formationNom,
      note,
      commentaire,
      anonyme,
      clientId
    });

    await newEval.save();
    res.status(201).json(newEval);
  } catch (err) {
    console.error(err); // log de l'erreur complète
    res.status(500).json({ message: err.message });
  }
});


// GET - récupérer toutes les évaluations
router.get("/allevalform", async (req, res) => {
  try {
    const evaluations = await EvaluationFormation.find().populate("clientId", "username email");
    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});



// PUT - modifier une évaluation par son id
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { note, commentaire, anonyme, formationNom } = req.body;

    const evaluation = await EvaluationFormation.findById(id);
    if (!evaluation) return res.status(404).json({ message: "Évaluation non trouvée" });

    if (note !== undefined) evaluation.note = note;
    if (commentaire !== undefined) evaluation.commentaire = commentaire;
    if (anonyme !== undefined) evaluation.anonyme = anonyme;
    if (formationNom !== undefined) evaluation.formationNom = formationNom;

    await evaluation.save();
    res.json(evaluation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE - supprimer une évaluation par son id
router.delete("/:id", async (req, res) => {
  console.log("DELETE /:id appelé avec id =", req.params.id);
  try {
    const { id } = req.params;
    const deleted = await EvaluationFormation.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Évaluation non trouvée" });

    res.json({ message: "Évaluation supprimée" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


// GET - récupérer les évaluations par clientId
router.get("/byuser/:clientId", async (req, res) => {
  try {
    const { clientId } = req.params;

    if (!clientId) {
      return res.status(400).json({ message: "clientId est requis" });
    }

    const evaluations = await EvaluationFormation.find({ clientId }) // ✅
      .populate("clientId", "username email");

    res.json(evaluations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
