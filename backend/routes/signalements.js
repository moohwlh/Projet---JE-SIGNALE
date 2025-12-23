const router = require('express').Router();
const pool = require('../database');
const verifyToken = require('../middleware/verifyToken'); 
const verifyRole = require('../middleware/verifyRole');   

// 1. CRÉATION D'UN SIGNALEMENT (Route Citoyen)
router.post("/", verifyToken, async (req, res) => {
  try {
    const { type_infraction, description, lieu, date_infraction, heure_infraction } = req.body;
    const utilisateur_id = req.userId; 

    // Création dossier
    const newDossier = await pool.query("INSERT INTO dossiers DEFAULT VALUES RETURNING idDo");
    const dossier_id = newDossier.rows[0].iddo;

    // Création signalement
    const newReport = await pool.query(
      "INSERT INTO signalements (type_infraction, description, lieu, date_infraction, heure_infraction, utilisateur_id, dossier_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [type_infraction, description, lieu, date_infraction, heure_infraction, utilisateur_id, dossier_id]
    );

    res.json(newReport.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json("Erreur serveur");
  }
});

// 👇 2. C'EST ICI LA NOUVELLE ROUTE (HISTORIQUE CITOYEN) 👇
// Elle permet à l'utilisateur de récupérer UNIQUEMENT SES signalements
router.get("/mes-signalements", verifyToken, async (req, res) => {
    try {
        const currentUserId = req.userId; // On récupère l'ID de celui qui est connecté

        const myReports = await pool.query(`
            SELECT 
                s.*, 
                d.statut 
            FROM signalements s
            LEFT JOIN dossiers d ON s.dossier_id = d.idDo
            WHERE s.utilisateur_id = $1  -- <-- FILTRE IMPORTANT : Seulement les siens
            ORDER BY s.idSig DESC
        `, [currentUserId]);
        
        res.json(myReports.rows);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erreur Serveur");
    }
});

// 3. RÉCUPÉRATION DE TOUS LES SIGNALEMENTS (Route Police uniquement)
router.get("/", verifyToken, verifyRole, async (req, res) => {
    try {
        const allSignalements = await pool.query(`
            SELECT s.*, u.nom, u.prenom, d.statut 
            FROM signalements s
            LEFT JOIN utilisateurs u ON s.utilisateur_id = u.idUti
            LEFT JOIN dossiers d ON s.dossier_id = d.idDo
            ORDER BY s.idSig DESC
        `);
        res.json(allSignalements.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erreur Serveur");
    }
});

// 4. MISE À JOUR DU STATUT (Route Police uniquement)
router.put("/:id/statut", verifyToken, verifyRole, async (req, res) => {
  try {
    const { id } = req.params; 
    const { nouveauStatut } = req.body;

    const signalement = await pool.query("SELECT dossier_id FROM signalements WHERE idSig = $1", [id]);
    if (signalement.rows.length === 0) return res.status(404).json("Introuvable");

    const dossierId = signalement.rows[0].dossier_id;
    await pool.query("UPDATE dossiers SET statut = $1 WHERE idDo = $2", [nouveauStatut, dossierId]);

    res.json("Statut mis à jour");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erreur Serveur");
  }
});

module.exports = router;