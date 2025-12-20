// backend/routes/signalement.js

const router = require('express').Router();
const pool = require('../database');
const verifyRole = require('../middleware/verifyRole'); // Import du garde de rôle

// ----------------------------------------------------
// ROUTE 1 : CRÉATION (Accessible par tous les utilisateurs connectés)
// ----------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const { type_infraction, description, lieu, date_infraction, heure_infraction } = req.body;
    const utilisateur_id = req.userId; 

    const newReport = await pool.query(
      "INSERT INTO signalements (type_infraction, description, lieu, date_infraction, heure_infraction, utilisateur_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [type_infraction, description, lieu, date_infraction, heure_infraction, utilisateur_id]
    );

    res.json(newReport.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).json("Erreur Serveur lors de la création du signalement.");
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

module.exports = router;