const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("config"); // you missed this import

const users = require("./routes/api/users");
const formateurRoutes = require("./routes/api/formateurRoutes");
const planningRoutes = require("./routes/api/planningRoutes");
const evaluationRoutes = require("./routes/api/evaluationRoutes");
const formations = require("./routes/api/formations");
const formateursRoutes=require("./routes/api/formateur");
const participantRoutes = require("./routes/api/participants");
const entrepriseRoutes = require("./routes/api/Entreprises");





const app = express();

const mongo_url = config.get("mongo_url"); // single declaration

mongoose.set('strictQuery', true);

mongoose
  .connect(mongo_url)
  .then(() => console.log("MongoDB connected..."))
  .catch((err) => console.log(err));

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/users", users);
app.use("/api/formations", formations); // you need to define 'formations'
app.use("/api/planning", planningRoutes);
app.use("/api/formateurs", formateurRoutes);
app.use("/api/participants", participantRoutes);
app.use("/api/entreprises", entrepriseRoutes); // ✅ branchement correct



// Server start
const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));
