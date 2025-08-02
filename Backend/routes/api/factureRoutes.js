const express = require("express");
const router = express.Router();
const { creerFacture, telechargerPDF } = require("../../controllers/factureController");
const { getPdfFile } = require("../../controllers/factureController");

router.post("/add", creerFacture);
router.get("/pdf/:numero", telechargerPDF);  // <-- nouvelle route pour PDF
router.get("/pdf/:filename", getPdfFile);

module.exports = router;
