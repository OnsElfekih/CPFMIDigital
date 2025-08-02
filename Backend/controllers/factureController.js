const Facture = require("../models/Facture");
const PDFDocument = require("pdfkit");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

// Création de la facture + PDF + envoi
const creerFacture = async (req, res) => {
  try {
    const { numero, clientNom, clientEmail, formations, montant } = req.body;

    const facture = new Facture({ numero, clientNom, clientEmail, formations, montant });
    await facture.save();
    console.log("Facture sauvegardée en base :", facture);

    const logoPath = path.join(__dirname, "../../frontend/public/logoCPFMI.png");
    const pdfDir = path.join(__dirname, "../../frontend/public/factures");
    if (!fs.existsSync(pdfDir)) fs.mkdirSync(pdfDir);

    //const pdfPath = path.join(pdfDir, `facture_${numero}.pdf`);
    const filename = `facture_${numero}.pdf`;
    const pdfPath = path.join(__dirname, "../../frontend/public/factures", filename);



    const doc = new PDFDocument({ margin: 50, size: "A4" });
    doc.pipe(fs.createWriteStream(pdfPath));

    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 45, { width: 120 });
    }

    doc
      .fontSize(16)
      .fillColor("#333")
      .text("Cabinet Plus Formation Management Industriel", 180, 50)
      .fontSize(10)
      .text("Téléphone : (+216) 20 346 582 | (+33) 06 67 09 61 20", 180, 70)
      .text("Email : contact@cpfmi.com", 180, 85)
      .moveDown();

    doc.moveTo(50, 120).lineTo(545, 120).stroke();

    doc
      .fontSize(12)
      .fillColor("#000")
      .text(`Facture N° : ${numero}`, 50, 130)
      .text(`Date : ${new Date().toLocaleDateString()}`, 50, 150)
      .text(`Client : ${clientNom}`, 50, 170)
      .moveDown();

    const tableTop = 200;
    const formationX = 50;
    const formateurX = 300;
    const montantX = 470;

    doc
      .fontSize(11)
      .fillColor("#000")
      .text("Formation", formationX, tableTop)
      .text("Formateur", formateurX, tableTop)
      .text("Montant (DT)", montantX, tableTop, { align: "right" });

    let y = tableTop + 20;

    formations.forEach(({ nomFormation, nomFormateur, montantFormation }) => {
      doc
        .fontSize(10)
        .text(nomFormation, formationX, y)
        .text(nomFormateur, formateurX, y)
        .text(`${Number(montantFormation).toFixed(2)
} DT`, montantX, y, { align: "right" });
      y += 20;
    });

    doc.moveTo(50, y + 10).lineTo(545, y + 10).stroke();

    doc
      .fontSize(13)
      .fillColor("#000")
      .text(`Total : ${montant.toFixed(2)} DT`, montantX, y + 25, { align: "right" });

    doc.end();

    const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "8496e2dc2613b3",
      pass: "e8916c56fa04d7"
    }
  });

    const mailOptions = {
      from: "stageinitiation2025@gmail.com",
      to: clientEmail,
      subject: `Votre facture CPFMI n°${numero}`,
      text: `Bonjour ${clientNom},\n\nVeuillez trouver ci-joint votre facture.\n\nMerci.`,
      attachments: [
        {
          filename: `facture_${numero}.pdf`,
          path: pdfPath,
        },
      ],
    };

    try {
  await transporter.sendMail(mailOptions);
  console.log("✅ Email envoyé avec succès !");
} catch (emailError) {
  console.error("❌ Échec de l'envoi de l'email :", emailError);
  throw emailError; // remonte pour que le res.status(500) le capte
}


    res.status(201).json({ message: "Facture créée, PDF généré et envoyée avec succès." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

// Téléchargement PDF depuis numéro de facture
const telechargerPDF = async (req, res) => {
  try {
    const numero = req.params.numero;
    const facture = await Facture.findOne({ numero });

    if (!facture) {
      return res.status(404).send("Facture non trouvée");
    }

    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument({ margin: 50, size: "A4" });

    res.setHeader("Content-disposition", `attachment; filename=facture_${numero}.pdf`);
    res.setHeader("Content-type", "application/pdf");

    doc.pipe(res);

    // Logo
    const logoPath = path.join(__dirname, "../../frontend/public/logoCPFMI.png");
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, 50, 45, { width: 120 });
    }

    // Entête
    doc
      .fontSize(16)
      .fillColor("#333")
      .text("Cabinet Plus Formation Management Industriel", 180, 50)
      .fontSize(10)
      .text("Téléphone : (+216) 20 346 582 | (+33) 06 67 09 61 20", 180, 70)
      .text("Email : contact@cpfmi.com", 180, 85)
      .moveDown();

    doc.moveTo(50, 120).lineTo(545, 120).stroke();

    doc
      .fontSize(12)
      .fillColor("#000")
      .text(`Facture N° : ${facture.numero}`, 50, 130)
      .text(`Date : ${new Date(facture.date).toLocaleDateString()}`, 50, 150)
      .text(`Client : ${facture.clientNom}`, 50, 170)
      .moveDown();

    // Tableau
    const tableTop = 200;
    const formationX = 50;
    const formateurX = 300;
    const montantX = 470;

    doc
      .fontSize(11)
      .fillColor("#000")
      .text("Formation", formationX, tableTop)
      .text("Formateur", formateurX, tableTop)
      .text("Montant (DT)", montantX, tableTop, { align: "right" });

    let y = tableTop + 20;

    facture.formations.forEach(({ nomFormation, nomFormateur, montantFormation }) => {
      doc
        .fontSize(10)
        .text(nomFormation, formationX, y)
        .text(nomFormateur, formateurX, y)
        .text(`${montantFormation.toFixed(2)} DT`, montantX, y, { align: "right" });
      y += 20;
    });

    doc.moveTo(50, y + 10).lineTo(545, y + 10).stroke();

    doc
      .fontSize(13)
      .fillColor("#000")
      .text(`Total : ${facture.montant.toFixed(2)} DT`, montantX, y + 25, { align: "right" });

    doc.end();

  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la génération du PDF");
  }
};

const getPdfFile = (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "../../frontend/public/factures", filename); // adapte selon ton dossier

  if (fs.existsSync(filePath)) {
    res.setHeader("Content-Type", "application/pdf");
    res.sendFile(filePath);
  } else {
    res.status(404).send("Fichier PDF introuvable");
  }
};

module.exports = { creerFacture, telechargerPDF, getPdfFile };
