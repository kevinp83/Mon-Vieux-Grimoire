const Book = require("../models/book");
const fs = require("fs");

// Crée un nouveau livre
exports.createBook = (req, res, next) => {
  try {
  const bookObject = JSON.parse(req.body.book);
  delete bookObject._id;
  delete bookObject._userId;

// Crée une nouvelle instance du modèle Book avec les données fournies par l'utilisateur
  const book = new Book({
    ...bookObject,
    userId: req.auth.userId,
    imageUrl: req.filename
      ? `${req.protocol}://${req.get("host")}/images/${req.filename}`
      : null,
  });

// sauvegarde le nouveau livre dans la base de données
  book.save()
    .then(() => {
      res.status(201).json({ message: "Livre créé !" });
    })
    .catch((error) => { res.status(500).json({ error });
});
  } catch (error) {
    res.status(400).json({ error: "Les données du livre sont invalides." });
  }
};

// Ajoute une note à un livre existant
exports.addRating = (req, res, next) => {
  const bookId = req.params.id; // Récupère l'ID du livre depuis les paramètres de la requête

  if (!bookId) {
      return res
          .status(400)
          .json({message: "Il manque l'identifiant du livre."});
  }

// Vérifie si l'utilisateur a déjà noté ce livre
  Book.findOne({_id: bookId, "ratings.userId": req.auth.userId})
      .then((book) => {
          if (book) {
              return res
                  .status(400)
                  .json({message: "Vous avez déjà noté ce livre."});
          }
      })

      // Ajoute la nouvelle note au livre
      .then(() => {
          Book.findByIdAndUpdate(
              bookId,
              {
                  $push: {
                      ratings: {
                          userId: req.auth.userId,
                          grade: req.body.rating,
                      },
                  },
              },
              {new: true}
          ).then((book) => {
              if (!book) {
                  return res
                    .status(404)
                    .json({message: "Le livre n'existe pas."});
              }
              const totalRatings = book.ratings.length;
              const sumOfRates = book.ratings.reduce(
                  (total, rating) => total + rating.grade, 0);
              
              book.averageRating = parseInt(sumOfRates / totalRatings, 10);
              // Sauvegarde la mise à jour du livre dans la base de données
              book.save()
                  .then((book) => {
                      res.status(200).json(book);
                  })
                  .catch((error) => res.status(400).json({error}));
          });
      });
};

// Modifie un livre existant
exports.modifyBook = (req, res, next) => {
  const { title, author, year, genre } = req.body; // Récupère les nouvelles informations du livre depuis la requête
  const imageUrl = req.file
    ? `${req.protocol}://${req.get("host")}/images/${req.file.filename}`
    : null; // Met à jour l'URL de l'image du livre si une nouvelle image est fournie

  // Vérifie si le livre existe et si l'utilisateur est autorisé à le modifier
  Book.findOne({ _id: req.params.id })
    .then((book) => {
      if (book.userId !== req.auth.userId) {
        res.status(401).json({ message: "Non autorisé" });
      } else {
        // Met à jour les informations du livre
        book.title = title;
        book.author = author;
        book.year = year;
        book.genre = genre;
        if (imageUrl) {
          book.imageUrl = imageUrl;
        }

        // Sauvegarde les modifications du livre dans la base de données
        book
          .save() 
          .then(() => {
            res.status(200).json({ message: "Livre modifié avec succès !" });
          })
          .catch((error) => {
            res.status(400).json({ error: error.message });
          });
      }
    })
    .catch((error) => {
      res.status(400).json({ error: error.message });
    });
};

// Supprime un livre existant
exports.deleteBook = (req, res, next) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {

      // Vérifie si l'utilisateur est autorisé à supprimer le livre
      if (book.userId !== req.auth.userId) {
        res
          .status(401)
          .json({ message: "Non autorisé" }); 
      } else {
        const filename = book.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          
          // Supprime le livre de la base de données
          book
            .deleteOne() 
            .then(() => {
              res.status(200).json({ message: "Livre supprimé avec succès !" });
            })
            .catch((error) => {
              res.status(400).json({ error: error.message });
            });
        });
      }
    })
    .catch((error) => {
      res.status(500).json({ error: error.message });
    });
};

// Récupère les 3 livres les mieux notés
exports.getBestRating = (req, res, next) => {
  Book.find()
    .sort({ averageRating: -1 })
    .limit(3)
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({ error });
    });
};

// Récupère un livre spécifique par son ID
exports.getOneBook = (req, res, next) => {
  Book.findOne({
    _id: req.params.id,
  })
    .then((book) => {
      res.status(200).json(book);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};

// Récupère tous les livres
exports.getAllBooks = (req, res, next) => {
  Book.find()
    .then((books) => {
      res.status(200).json(books);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};