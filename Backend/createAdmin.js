const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/CPFMI");
    console.log("Connecté à MongoDB");

    // Vérifier si l'admin existe déjà pour éviter doublon
    const existingAdmin = await User.findOne({ email: "stageinitiation2025@gmail.com" });
    if (existingAdmin) {
      console.log("L'admin existe déjà");
      return;
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);
    await User.create({
      username: "CPFMI",
      email: "stageinitiation2025@gmail.com",
      password: hashedPassword,
      role: "admin",
    });
    console.log("Admin créé");
  } catch (err) {
    console.error("Erreur:", err);
  } finally {
    await mongoose.disconnect();
  }
}

main();
