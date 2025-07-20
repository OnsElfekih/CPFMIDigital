const express = require("express");
const mongoose = require("mongoose");
const config = require("config");
const cors = require("cors");
const users = require ("./routes/api/users");
const formations = require("./routes/api/formations"); 


const formateurRoutes = require("./routes/api/formateurRoutes");
const planningRoutes = require("./routes/api/planningRoutes");
const evaluationRoutes = require("./routes/api/evaluationRoutes");

const app = express();

const mongo_url = config.get("mongo_url");

// Middlewares
app.use(express.json());
app.use(cors());


mongoose.set('strictQuery', true);
mongoose
.connect(mongo_url)
.then(() => console.log("MongoDB connected..."))
.catch((err) => console.log(err));
app.use ("/users",users);
app.use("/api/formations", formations);
// Routes
//app.use("/users", users);
app.use("/api/users", require("./routes/api/users"));
app.use("/api/planning", planningRoutes);
app.use("/api/formateurs", formateurRoutes);

app.use("/api/evaluation", evaluationRoutes);

// Connexion MongoDB
//const mongo_url = config.get("mongo_url");
mongoose.set("strictQuery", true);
mongoose
  .connect(mongo_url)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

// Démarrage du serveur
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
