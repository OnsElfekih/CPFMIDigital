const Honoraire = require('../models/Honoraire');
const Formateur = require('../models/formateurModel');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Créer et enregistrer l'honoraire + générer PDF
exports.ajouterHonoraire = async (req, res) => {
  try {
    const { formateurId, type, valeur, heures, statut  } = req.body;

    // Calcul du total
    const total = type === 'taux_horaire' ? valeur * heures : valeur;

    // Création de l'honoraire
    const honoraire = new Honoraire({
      formateurId,
      type,
      valeur,
      heures: type === 'taux_horaire' ? heures : undefined,
      total,
      date: new Date(),
      statut: statut || "envoyée"
    });

    await honoraire.save();

    // Vérification formateur
    const formateur = await Formateur.findById(formateurId);
    if (!formateur) {
      return res.status(404).json({ message: "Formateur introuvable" });
    }

    // Génération nom du fichier
    const fileName = `note_honoraire_${formateur.nom}_${Date.now()}.pdf`;
    const pdfDir = path.join(__dirname, '../pdf');
    const filePath = path.join(pdfDir, fileName);

    // Création du dossier si inexistant
    if (!fs.existsSync(pdfDir)) {
      fs.mkdirSync(pdfDir, { recursive: true });
    }

    // Génération du PDF
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(fs.createWriteStream(filePath));

    // === ENTÊTE ===
    doc.image(path.join(__dirname, '../../frontend/public/logoCPFMI.png'), 50, 45, { width: 80 });

    doc.font('Helvetica-Bold')
      .fontSize(16)
      .text('Cabinet Plus Formation Management Industriel', 150, 50);

    doc.font('Helvetica')
      .fontSize(10)
      .text('Adresse : Avenue Jadida Maghrebia, 8000 Nabeul – Tunisie', 150, 75)
      .text('Email : contact@cpfmi.tn', 150, 90)
      .text('Téléphone : +216 20 346 582', 150, 105);

    doc.moveTo(50, 130).lineTo(550, 130).stroke();

    // === TITRE DOCUMENT ===
    doc.moveDown(2)
      .fontSize(16)
      .font('Helvetica-Bold')
      .text("Note d'Honoraires", { align: 'center', underline: true });

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
    doc.fontSize(10).fillColor('#888').text('CPFMI Digital - Tous droits réservés', 50, 700, { align: 'center' });

    doc.end();

    // Sauvegarde du chemin du PDF
    honoraire.pdfPath = `http://localhost:3001/api/honoraires/download/${fileName}`;
    await honoraire.save();

    // Réponse
    res.status(201).json({ message: 'Note enregistrée et PDF généré', honoraire, fileName });

  } catch (err) {
    console.error('Erreur dans ajouterHonoraire:', err);
    res.status(500).json({ error: err.message });
  }
};

// Archiver tous les honoraires d’un formateur
exports.archiverHonorairesParFormateur = async (req, res) => {
  try {
    const { formateurId } = req.params;
    await Honoraire.updateMany(
      { formateurId: formateurId },
      { $set: { archive: true } }
    );
    res.status(200).json({ message: "Honoraires archivés avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'archivage.", error });
  }
};

// GET : honoraires par ID formateur
exports.getHonorairesParFormateur = async (req, res) => {
  try {
    const { id } = req.params;
    const honoraires = await Honoraire.find({ formateurId: id });
    res.status(200).json(honoraires);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération des honoraires", error });
  }
};

// GET : honoraires du formateur connecté
exports.getHonorairesFormateur = async (req, res) => {
  try {
    const formateurId = req.user._id; // récupéré via middleware auth
    const honoraires = await Honoraire.find({ formateurId }).sort({ date: -1 });
    res.status(200).json(honoraires);
  } catch (error) {
    console.error("Erreur récupération honoraires formateur :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
};
