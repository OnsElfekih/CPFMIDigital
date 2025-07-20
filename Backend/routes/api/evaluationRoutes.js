// routes/evaluationRoutes.js
const express = require('express');
const router = express.Router();
const { createEvaluation, getEvaluations } = require('../../controllers/evaluationController');

router.post('/add', createEvaluation);
router.get('/', getEvaluations);

module.exports = router;
