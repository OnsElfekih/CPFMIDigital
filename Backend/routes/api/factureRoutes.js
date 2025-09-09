const express = require("express");
const router = express.Router();
const { creerFacture, getFacturesByClient, telechargerPDF } = require("../../controllers/factureController");
const { getPdfFile } = require("../../controllers/factureController");
const { protect } = require('../../models/authMiddleware');

router.post("/add",protect, creerFacture);
router.get("/pdf/:numero",  telechargerPDF);  // <-- nouvelle route pour PDF
router.get("/pdf/:filename", getPdfFile);
router.get("/mes-factures",protect,  getFacturesByClient);

module.exports = router;
