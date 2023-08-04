const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

// définition du schéma de données pour le modèle 'User'
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Vérifie dans la base de données si l'adresse mail est unique 
userSchema.plugin(uniqueValidator);

module.exports = mongoose.model("User", userSchema);