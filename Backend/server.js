const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const entrepriseRoutes = require('./routes/api/Entreprises');
const users = require("./routes/api/users");
const formations = require("./routes/api/formations");
const formateurRoutes = require("./routes/api/formateurRoutes");
const planningRoutes = require("./routes/api/planningRoutes");

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Déclaration avant utilisation !
const mongo_url = "mongodb://127.0.0.1:27017/CPFMI";

mongoose.set('strictQuery', true);

mongoose
  .connect(mongo_url)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

// Routes
app.use("/users", users);
app.use("/api/formations", formations);
app.use("/api/planning", planningRoutes);
app.use("/api/formateurs", formateurRoutes);
app.use("/api/entreprises", entrepriseRoutes);

// Démarrage du serveur
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
