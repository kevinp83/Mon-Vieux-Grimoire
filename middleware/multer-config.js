const multer = require('multer');

// Type MIME acceptés et leurs extensions correspondantes
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png'
};
// Configuration de multer pour la gestion des fichiers
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images') // Destination fichiers téléchargés dans dossier image
    },
    filename: (req, file, callback) => {
        
        //Renommage du fichier pour éviter les espaces dans le nom
        const name = file.originalname.split(' ').join('_'); 
        // Récupération extension fichier à partir du type MIME
        const extension = MIME_TYPES[file.mimetype]; 
        // Construction du nom de fichier en ajoutant le timeStamp actuel, pour rendre chaque images unique
        callback(null, name + Date.now() + '.' + extension); 
    }
});

module.exports = multer({ storage }).single('image');