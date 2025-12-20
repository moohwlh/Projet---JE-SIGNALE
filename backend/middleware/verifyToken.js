const jwt = require("jsonwebtoken");
const pool = require("../database"); // Import de la connexion BDD

module.exports = async (req, res, next) => {
  // 1. Récupération du Token
  const token = req.header("token");

  if (!token) {
    return res.status(403).json("Token manquant. Accès refusé.");
  }

  try {
    // 2. Vérification du Token (Validité/Expiration)
    const payload = jwt.verify(token, process.env.JWT_SECRET || "cle_secrete_temporaire");
    const userId = payload.userId; 

    // 3. Récupération des infos utilisateur (rôle et email) pour l'autorisation
    const userResult = await pool.query("SELECT email, role FROM utilisateurs WHERE iduti = $1", [userId]);
    
    if (userResult.rows.length === 0) {
        return res.status(403).json("Utilisateur non trouvé.");
    }
    
    // 4. Attacher l'ID et le Rôle à la requête (pour les routes suivantes)
    req.userId = userId;
    req.userRole = userResult.rows[0].role;
    req.userEmail = userResult.rows[0].email;

    next(); // La vérification est réussie, on passe à la route

  } catch (err) {
    // 5. Échec de la vérification (Token invalide ou expiré)
    console.error(err.message);
    return res.status(403).json("Token invalide ou expiré.");
  }
};