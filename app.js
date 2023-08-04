const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require("./routes/user");
const bookRoutes = require('./routes/books');
const cors = require("cors");
require('dotenv').config();
const password = process.env.MONGODBPASSWORD;
const urlMGDB = process.env.MONGODBURL;

const app = express();

mongoose.connect(`mongodb+srv://MVG:${password}@${urlMGDB}`,
{ useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/images", express.static("images"));

app.use("/api/auth", userRoutes); // Routes pour les utilisateurs avec le préfixe "/api/auth"
app.use("/api/books", bookRoutes); // Routes pour les livres avec le préfixe "/api/books"

module.exports = app;