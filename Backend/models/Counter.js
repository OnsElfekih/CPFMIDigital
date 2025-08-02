const mongoose = require('mongoose');

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },//identif du compteur unique
  seq: { type: Number, default: 0 },//val du compteur
});

const Counter = mongoose.model('Counter', counterSchema);

module.exports = Counter;
