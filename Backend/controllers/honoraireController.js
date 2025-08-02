const Honoraire = require('../models/Honoraire');
const Formateur = require('../models/formateurModel');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Créer et enregistrer l'honoraire + générer PDF
exports.ajouterHonoraire = async (req, res) => {
  try {
    const { formateurId, type, valeur, heures } = req.body;

    const total = type === 'taux_horaire' ? valeur * heures : valeur;

    const honoraire = new Honoraire({
      formateurId,
      type,
      valeur,
      heures: type === 'taux_horaire' ? heures : undefined,
      total
    });

    await honoraire.save();

    await honoraire.save(); // mettre à jour avec le chemin du PDF


    const formateur = await Formateur.findById(formateurId);

    const fileName = `note_honoraire_${formateur.nom}_${Date.now()}.pdf`;
    honoraire.pdfPath = `http://localhost:3001/api/honoraires/download/${fileName}`;

    const pdfDir = path.join(__dirname, '../pdf');
    const filePath = path.join(pdfDir, fileName);

    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir);
    }

    // Création PDF
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream(filePath));

    // === ENTÊTE ===
    doc.image(path.join(__dirname, '../../frontend/public/logoCPFMI.png'), 50, 45, { width: 80 });

    // Titre société
    doc
      .font('Helvetica-Bold')
      .fontSize(16)
      .text('Cabinet Plus Formation Management Industriel', 150, 50);

    // Coordonnées avec espacements
    doc
      .font('Helvetica')
      .fontSize(10)
      .text('Adresse : Avenue Jadida Maghrebia, 8000 Nabeul – Tunisie', 150, 75)
      .text('Email : contact@cpfmi.tn', 150, 90)
      .text('Téléphone : +216 20 346 582', 150, 105);

    // Ligne horizontale après l'en-tête
    doc.moveTo(50, 130).lineTo(550, 130).stroke();

    // === TITRE DU DOCUMENT ===
    doc
      .moveDown(2)
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Note d\'Honoraires', { align: 'center', underline: true });

    // === CONTENU ===
    doc.moveDown(2).fontSize(12).font('Helvetica');

    doc.text(`Nom du formateur : ${formateur.nom} ${formateur.prenom}`).moveDown(0.5);
    doc.text(`Type d'honoraire : ${type === 'taux_horaire' ? 'Taux horaire' : 'Forfait'}`).moveDown(0.5);
    doc.text(`Valeur : ${valeur} TND`).moveDown(0.5);

    if (type === 'taux_horaire') {
      doc.text(`Nombre de jours : ${heures}`).moveDown(0.5);
    }

    doc.text(`Montant total : ${total} TND`).moveDown(0.5);
    doc.text(`Date de génération : ${new Date().toLocaleDateString('fr-TN')}`).moveDown(2);

    // === PIED DE PAGE ===
    doc
      .fontSize(10)
      .fillColor('#888')
      .text('CPFMI Digital - Tous droits réservés', 50, 700, { align: 'center' });

    doc.end();

    // Réponse
    res.status(201).json({
      message: 'Note enregistrée et PDF généré',
      honoraire,
      fileName
    });

  } catch (err) {
    console.error('Erreur dans ajouterHonoraire:', err);
    res.status(500).json({ error: err.message });
  }
};


exports.archiverHonorairesParFormateur = async (req, res) => {
  try {
    const { formateurId } = req.params;

    // Met à jour tous les honoraires liés au formateur pour les archiver
    await Honoraire.updateMany(
      { formateurId: formateurId },
      { $set: { archive: true } } // Assure-toi que ton modèle Honoraire a bien un champ 'archive' de type Boolean
    );

    res.status(200).json({ message: "Honoraires archivés avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'archivage.", error });
  }
};

// GET : honoraires d’un formateur
exports.getHonorairesParFormateur = async (req, res) => {
  try {
    const { id } = req.params;
    const honoraires = await Honoraire.find({ formateurId: id });
    res.status(200).json(honoraires);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des honoraires", error });
  }
};

// GET : Honoraire spécifique à un formateur connecté
exports.getHonorairesFormateur = async (req, res) => {
  try {
    const formateurId = req.user._id; // récupéré via le middleware auth
    const honoraires = await Honoraire.find({ formateurId: formateurId }).populate("formateur");

    res.status(200).json(honoraires);
  } catch (error) {
    console.error("Erreur récupération honoraires formateur :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};


