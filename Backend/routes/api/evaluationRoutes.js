// routes/evaluationRoutes.js
const express = require('express');
const router = express.Router();
const { createEvaluation, getEvaluations } = require('../../controllers/evaluationController');

router.post('/add', createEvaluation);
router.get('/', getEvaluations);

console.log('Type createEvaluation:', typeof createEvaluation); // doit être 'function'


module.exports = router;
