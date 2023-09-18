const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require("path");

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const sharp = require("sharp");

const booksCtrl = require("../controllers/books");

// Crée un nouveau livre
router.post("/", auth, multer, async (req, res, next) => {
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
}, booksCtrl.createBook);

// Route pour ajouter une note à un livre
router.post("/:id/rating", auth, booksCtrl.addRating);

// Modifie un livre existant
router.put("/:id", auth, 
multer, 
async (req, res, next) => {
    fs.access("./images", (error) => {
        if (error) { 
            fs.mkdirSync("./images");
        }
    });

    // Vérifie si une nouvelle image a été fournie
    if (req.file) {
        const { buffer, originalname } = req.file;
        const timestamp = Date.now();
        const ref = `${timestamp}-${path.parse(originalname).name}.webp`;

        await sharp(buffer)
            .webp({ quality: 20 })
            .toFile("./images/" + ref);

        req.filename = ref;
    }

    next();
}, booksCtrl.modifyBook);

// Supprime un livre existant
router.delete("/:id", auth, booksCtrl.deleteBook);

// Récupère les livres les mieux notés
router.get("/bestrating", booksCtrl.getBestRating);

// Obtient les informations d'un livre spécifique
router.get("/:id", booksCtrl.getOneBook);

// Obtient tous les livres
router.get("/", booksCtrl.getAllBooks);

module.exports = router;