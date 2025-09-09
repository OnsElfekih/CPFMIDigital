const jwt = require("jsonwebtoken");
const Formateur = require("../models/formateurModel");

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "jwtSecret");

      if (decoded.role === "formateur") {
        req.user = await Formateur.findById(decoded.formateurId).select("-password");
      } else {
        req.user = { _id: decoded.id, role: decoded.role, 
          email: decoded.email || null };
      }

      if (!req.user) {
        return res.status(401).json({ message: "Utilisateur non trouvé" });
      }

      next();
    } catch (error) {
      return res.status(401).json({ message: "Non autorisé, token invalide." });
    }
  } else {
    return res.status(401).json({ message: "Non autorisé, pas de token." });
  }
};

module.exports = { protect };
