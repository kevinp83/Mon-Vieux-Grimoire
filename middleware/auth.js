const jwt = require('jsonwebtoken');

// Middleware pour vérifier l'authentification avec le token
module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; 
        const decodedToken = jwt.verify(token, "RANDOM_TOKEN_SECRET"); // Décodage Token après vérification
        const userId = decodedToken.userId; // Récupère Id utilisateur à partir du Token décodé
        req.auth = { userId: userId }; // Ajout de l'ID de l'utilisateur dans l'objet 'auth' de la requête

        next();
    } catch (error) {
        res.status(401).json({ error });
}
};