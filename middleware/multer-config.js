const multer = require('multer');
const express = require('express');

// Type MIME acceptés et leurs extensions correspondantes
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};

// Configuration de multer pour la gestion des fichiers
const storage = multer.memoryStorage();
    
const upload = multer({ storage });

upload.single("images");

module.exports = multer({ storage }).single('image');