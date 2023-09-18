const mongoose = require('mongoose');

// Définition du schéma de données pourn le modèle 'Book'
const bookSchema = mongoose.Schema({
    // Tout les champs, ici obligatoire, pour créer un livre
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    ratings: [ // Tableau des évaluations du livre
        {
            userId: { type: String, required: false }, // ID de l'utilisateur qui a donné la note
            grade: { type: Number, required: false }, // Note attribué par l'utilisateur
        },
    ],
    averageRating: { type: Number, default: 0 }, // Note moyenne du livre (0 par défaut)
});
 
module.exports = mongoose.model('Book', bookSchema);