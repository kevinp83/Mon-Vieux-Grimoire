const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/user');

// Route pour l'inscription d'un nouvel utilisateur
router.post('/signup', userCtrl.signup);

// Route pour la connexion d'un utilisateur existant
router.post('/login', userCtrl.login);

module.exports = router;