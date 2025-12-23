const jwt = require("jsonwebtoken");
const pool = require("../database");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("token");

    if (!token) {
      console.log(" ERREUR: Aucun token reçu dans le header !");
      return res.status(403).json("Accès refusé (Token manquant)");
    }

    // 1. Vérifier la signature du token
    const payload = jwt.verify(token, process.env.JWT_SECRET || "cle_secrete_temporaire");
    
    // DEBUG : Voir ce qu'il y a dans le token
    console.log("INFO TOKEN DÉCODÉ :", payload);

    if (!payload.userId) {
        console.log("ERREUR: Le token ne contient pas de userId !");
        return res.status(403).json("Token malformé");
    }

    // 2. Vérifier si l'utilisateur existe en BDD et récupérer son rôle
    const user = await pool.query("SELECT * FROM utilisateurs WHERE iduti = $1", [payload.userId]);

    if (user.rows.length === 0) {
        console.log(" ERREUR: Utilisateur introuvable en BDD pour l'ID :", payload.userId);
        return res.status(403).json("Utilisateur introuvable");
    }

    // DEBUG : Voir le rôle trouvé en BDD
    console.log(" SUCCÈS: Utilisateur trouvé. Rôle BDD =", user.rows[0].role);

    // 3. Attacher les infos à la requête
    req.userId = user.rows[0].iduti;
    req.userRole = user.rows[0].role; // C'est ça que verifyRole va vérifier

    next();
  } catch (err) {
    console.error(" CRASH verifyToken :", err.message);
    return res.status(403).json("Token invalide ou expiré");
  }
};