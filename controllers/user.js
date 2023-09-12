const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

// Inscrciption d'un nouvel utilisateur
exports.signup = (req, res, next) => {
  if (req.body.password.length < 8) {
    return res.status(400).json({ response: 'Le mot de passe doit contenir au moins 8 caractères.'})
  }
  // Hachage du mot de passe avant de le stocker dans la base de données
    bcrypt.hash(req.body.password, 10)
      .then((hash) => {
        // Crée un nouvel utilisateur avec l'email et le mot de passe haché
        const user = new User({
          email: req.body.email,
          password: hash
        });

        // sauvegarde le nouvel utilisateur dans la base de données
        user.save()
          .then(() => res.status(201).json({ response: 'Utilisateur créé !' }))
          .catch((error) => res.status(400).json({response: "La création du nouvel utilisateur n'a pas fonctionné."}));
      })
      .catch((error) => res.status(500).json({ error }));
  };

  // Connexion d'un utilisateur existant
exports.login = (req, res, next) => {
  // Recherche l'utilisateur dans la base de données en fonction de l'email
    User.findOne({email: req.body.email})
    .then((user) => {
        if (!user) {
          return res.status(401).json({ error: 'Paire identifiant/mot de passe incorrecte'});
        } 
            // Comparaison du mot de passe fourni avec celui stocké dans la base de données
            bcrypt.compare(req.body.password, user.password)
            .then((valid) => {
                if (!valid) {
                  return  res.status(401).json({ message: 'Paire identifiant/Mot de passe incorrect'});
                } 

                // Crée un token d'authentification avec l'ID de l'utilisateur
                const token = jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
                  expiresIn: "24h",
                });

                    // Renvoie l'ID de l'utilisateur et le token d'authentification
                    res.status(200).json({
                    userId: user._id,
                    token: token,
                    });
            })
            .catch((error) => res.status(500).json({ error }));
            })
    .catch((error) => res.status(500).json({ error }));
};