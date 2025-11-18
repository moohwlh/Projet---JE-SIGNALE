const router = require('express').Router();
const pool = require('../database');
// Route pour créer un signalement
router.post('/', async (req, res) => {
    try {
        // 1. On récupère les infos du formulaire (req.body)
        // Regarde ton fichier database.sql pour voir les colonnes qu'on a créées
        const { type_infraction, description, lieu, date_infraction,heure_infraction } = req.body;

        // 2. On insère dans la base de données
        const newReport = await pool.query(
            "INSERT INTO signalements (type_infraction, description, lieu, date_infraction, heure_infraction) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [type_infraction, description, lieu, date_infraction, heure_infraction]
        );
        
        // 3. On renvoie le signalement créé
        res.json(newReport.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).json("Erreur serveur");
    }
});
router.get('/', async (req, res) => { 
    try {
        const allReports = await pool.query("SELECT * FROM signalements");
        res.json(allReports.rows);
    }
    catch(err){
        console.error(err.message);
        res.status(500).json("Erreur serveur");
    }
})
module.exports = router;