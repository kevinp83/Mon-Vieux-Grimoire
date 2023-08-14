const multer = require('multer');
const sharp = require('sharp');
const express = require('express');

const app = express();

app.use(express.static("../images"));

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
        callback(null, name + Date.now() + '.' + 'webp'); 
    }
});

const upload = multer({ storage });

app.post("/", upload.single("picture"), async (req, res) => {
    fs.access("./images", (error) => {
      if (error) {
        fs.mkdirSync("./images");
      }
    });
    const { buffer, originalname } = req.file;
    const timestamp = new Date().toISOString();
    const ref = `${timestamp}-${originalname}.webp`;
    await sharp(buffer)
      .webp({ quality: 20 })
      .toFile("./images/" + ref);
      const link = `http://localhost:3000/${ref}`;
        return res.json({ link });
});

app.listen(3000);
module.exports = multer({ storage }).single('image');

