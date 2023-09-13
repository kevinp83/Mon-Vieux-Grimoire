const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require("path");

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sharp = require("sharp");

const booksCtrl = require("../controllers/books");

router.post("/", auth,
    multer, 
    async (req, res, next) => {
        fs.access("./images", (error) => {
        if (error) { 
            fs.mkdirSync("./images");
        }
        });
        const { buffer, originalname } = req.file;
        const timestamp = Date.now();
        const ref = `${timestamp}-${path.parse(originalname).name}.webp`;
        await sharp(buffer)
        .webp({ quality: 20 })
        .toFile("./images/" + ref);
        req.filename = ref;

        next();
    },
  booksCtrl.createBook); // Crée un nouveau livre
router.post("/:id/rating", auth, booksCtrl.addRating); // Route pour ajouter une note à un livre
router.put("/:id", auth, multer, booksCtrl.modifyBook); // Modifie un livre existant
router.delete("/:id", auth, booksCtrl.deleteBook); // Supprime un livre existant
router.get("/bestrating", booksCtrl.getBestRating); // Récupère les livres les mieux noter
router.get("/:id", booksCtrl.getOneBook); // Obtient les informations d'un livre spécifique
router.get("/", booksCtrl.getAllBooks); // Obtient tous les livres

module.exports = router;