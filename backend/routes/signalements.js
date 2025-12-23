// backend/routes/signalement.js

const router = require('express').Router();
const pool = require('../database');
const verifyRole = require('../middleware/verifyRole'); // Import du garde de rôle


// ----------------------------------------------------
// ROUTE 1 : CRÉATION (Accessible par tous les utilisateurs connectés)
// ----------------------------------------------------
const authenticate = require('../middleware/verifyToken'); 


router.post("/", authenticate, async (req, res) => {
  try {
    const { type_infraction, description, lieu, date_infraction, heure_infraction } = req.body;
    const utilisateur_id = req.userId;

    // 1. D'abord, on crée un dossier technique pour ce signalement
    // La table 'dossiers' a une valeur par défaut 'En attente', donc on insère juste DEFAULT
    const newDossier = await pool.query(
      "INSERT INTO dossiers DEFAULT VALUES RETURNING idDo"
    );
    const dossier_id = newDossier.rows[0].iddo; // On récupère l'ID du nouveau dossier

    // 2. Ensuite, on crée le signalement en le liant au dossier 
    const newReport = await pool.query(
      "INSERT INTO signalements (type_infraction, description, lieu, date_infraction, heure_infraction, utilisateur_id, dossier_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [type_infraction, description, lieu, date_infraction, heure_infraction, utilisateur_id, dossier_id]
    );

    res.json(newReport.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).json("Erreur Serveur lors de la création.");
  }
});


// ----------------------------------------------------
// ROUTE 2 : LECTURE (Protégée par le rôle)
// ----------------------------------------------------
router.get("/", verifyRole, async (req, res) => { // <-- Seuls les Admins/Police y accèdent
  try {
    const allReports = await pool.query("SELECT * FROM signalements");
    res.json(allReports.rows);
  }
  catch(err){
    console.error(err.message);
    res.status(500).json("Erreur serveur");
  }
});


router.get("/mes-signalements", authenticate, async (req, res) => {
  try {
    const userId = req.userId;
    
    // On fait un JOIN pour récupérer le statut depuis la table 'dossiers'
    const userReports = await pool.query(
      `SELECT s.*, d.statut 
       FROM signalements s 
       LEFT JOIN dossiers d ON s.dossier_id = d.idDo 
       WHERE s.utilisateur_id = $1 
       ORDER BY s.date_infraction DESC`,
      [userId]
    );
    
    res.json(userReports.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Erreur lors de la récupération.");
  }
});
router.get("/", verifyRole, async (req, res) => {
  try {
    const allReports = await pool.query(
      `SELECT s.*, d.statut, u.email as citoyen_email
       FROM signalements s
       LEFT JOIN dossiers d ON s.dossier_id = d.idDo
       LEFT JOIN utilisateurs u ON s.utilisateur_id = u.idUti
       ORDER BY s.date_soumission DESC`
    );
    res.json(allReports.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Erreur serveur lecture admin");
  }
});
router.put("/:id/statut", verifyRole, async (req, res) => {
  try {
    const { id } = req.params; 
    const { nouveauStatut } = req.body; 

    await pool.query(
      `UPDATE dossiers 
       SET statut = $1 
       FROM signalements 
       WHERE dossiers.idDo = signalements.dossier_id AND signalements.idSig = $2`,
      [nouveauStatut, id]
    );

    res.json("Statut mis à jour !");
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Erreur mise à jour statut");
  }
});

module.exports = router;