module.exports = (req, res, next) => {
  // L'utilisateur est identifié et son rôle/email est attaché par le middleware précédent (auth.js)
  
  // La règle de sécurité : L'utilisateur doit être admin ou avoir un email de police
  if (req.userRole === "admin" || req.userEmail.endsWith("@police.fr")) {
    next(); // Autorisé
  } else {
    // Statut 403: Accès refusé
    return res.status(403).json("Accès refusé. Seuls les agents d'administration sont autorisés.");
  }
};