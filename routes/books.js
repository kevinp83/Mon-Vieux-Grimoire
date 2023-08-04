const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const booksCtrl = require("../controllers/books");

router.post("/", auth, multer, booksCtrl.createBook); // Crée un nouveau livre
router.post("/:id/rating", auth, booksCtrl.addRating); // Route pour ajouter une note à un livre
router.put("/:id", auth, multer, booksCtrl.modifyBook); // Modifie un livre existant
router.delete("/:id", auth, booksCtrl.deleteBook); // Supprime un livre existant
router.get("/bestrating", booksCtrl.getBestRating); // Récupère les livres les mieux noter
router.get("/:id", booksCtrl.getOneBook); // Obtient les informations d'un livre spécifique
router.get("/", booksCtrl.getAllBooks); // Obtient tous les livres

module.exports = router;