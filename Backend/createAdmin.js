const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

mongoose.connect("mongodb://127.0.0.1:27017/CPFMI")
  .then(() => console.log("Connecté à MongoDB"))
  .catch(err => console.log(err));

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("admin123", 10);
  await User.create({
    username: "admin",
    email: "admin@gmail.com",
    password: hashedPassword,
    role: "admin",
  });
  console.log("Admin créé");
  mongoose.disconnect();
}

createAdmin();
