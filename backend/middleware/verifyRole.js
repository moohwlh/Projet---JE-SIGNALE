module.exports = (req, res, next) => {
  
  // La règle de sécurité : L'utilisateur doit être admin
  if (req.userRole === "admin") {
    next(); // Autorisé
  } else {
    // Statut 403: Accès refusé
    return res.status(403).json("Accès refusé. Seuls les agents d'administration sont autorisés.");
  }
};