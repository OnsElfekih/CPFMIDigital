const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");

// Importation des routes
const users = require("./routes/api/users");
const formations = require("./routes/api/formations");
const formateurRoutes = require("./routes/api/formateurRoutes");
const planningRoutes = require("./routes/api/planningRoutes");
const evaluationRoutes = require("./routes/api/evaluationRoutes");
const factureRoutes = require("./routes/api/factureRoutes");
const emailRoutes = require("./routes/api/emailRoutes");
const disponibiliteRoutes = require("./routes/api/disponibiliteRoutes");
const publicDisponibiliteRoutes = require("./routes/api/publicDisponibiliteRoutes");


const path = require("path");

const app = express();

// URL de connexion MongoDB depuis config
const mongo_url = config.get("mongo_url");

// Middlewares
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

// Connexion à MongoDB
mongoose.set("strictQuery", true);
mongoose
  .connect(mongo_url)
  .then(() => console.log("✅ MongoDB connected..."))
  .catch((err) => console.log("❌ MongoDB connection error:", err));

// Routes
app.use("/api/users", users);
app.use("/api/formations", formations);
app.use("/api/formateurs", formateurRoutes);
app.use("/api/planning", planningRoutes);
app.use("/api/evaluationRoutes", evaluationRoutes);
app.use("/api/factures", factureRoutes);
app.use("/api/email", emailRoutes);
app.use("/api/disponibilites", disponibiliteRoutes);
app.use("/api/public-disponibilites", publicDisponibiliteRoutes);
app.use('/api/honoraires', require('./routes/api/honoraireRoutes'));
app.use('/pdf', express.static(path.join(__dirname, 'pdf')));


// Démarrage du serveur
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`🚀 Server running on port ${port}`));
