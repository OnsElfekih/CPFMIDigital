const express = require("express");
const router = express.Router();
const { getPlanningByFormateur , addPlanning } = require("../../controllers/planningController");

// GET /api/planning/formateur/:formateurId
router.get("/formateur/:formateurId", getPlanningByFormateur);
router.post("/add", addPlanning);  // ← à ajouter
module.exports = router;
