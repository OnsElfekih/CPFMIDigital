const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage(); // stockage en mémoire

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".csv" && ext !== ".xlsx" && ext !== ".xls") {
    return cb(new Error("Type de fichier non autorisé"), false);
  }
  cb(null, true);
};

module.exports = multer({ storage, fileFilter });
