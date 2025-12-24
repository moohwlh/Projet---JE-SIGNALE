const router = require('express').Router();
const pool = require('../database');
const verifyToken = require('../middleware/verifyToken'); 
const verifyRole = require('../middleware/verifyRole');   
const jwt = require('jsonwebtoken');
router.post("/", async (req, res) => {
  try {
    const { type_infraction, description, lieu, date_infraction, heure_infraction } = req.body;
    
    //  LOGIQUE D'AUTHENTIFICATION OPTIONNELLE
    let utilisateur_id = null;
    const token = req.header("token");

    if (token) {
        try {
            // On vérifie le token manuellement ici
            const verified = jwt.verify(token, process.env.JWT_SECRET);
            utilisateur_id = verified.userId;
        } catch (err) {
            console.log("Token invalide ou expiré, signalement traité comme anonyme.");
        }
    }

    // Étape 1 : Création du dossier technique
    const newDossier = await pool.query(
      "INSERT INTO dossiers DEFAULT VALUES RETURNING idDo"
    );
    const dossier_id = newDossier.rows[0].iddo;

    // Étape 2 : Création du signalement 
    const newReport = await pool.query(
      "INSERT INTO signalements (type_infraction, description, lieu, date_infraction, heure_infraction, utilisateur_id, dossier_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *",
      [type_infraction, description, lieu, date_infraction, heure_infraction, utilisateur_id, dossier_id]
    );

    res.json(newReport.rows[0]);

  } catch (err) {
    console.error(err.message);
    res.status(500).json("Erreur serveur lors de la création");
  }
});

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

router.get("/public/stats", async (req, res) => {
    try {
        // 1. Compter les signalements "Actifs" (En attente ou En cours)
        const actifs = await pool.query(
            "SELECT COUNT(*) FROM dossiers WHERE statut IN ('En attente', 'En cours')"
        );

        // 2. Compter les "Résolus"
        const resolus = await pool.query(
            "SELECT COUNT(*) FROM dossiers WHERE statut = 'Résolu'"
        );

        // 3. Calculer le taux de réponse (Ceux qui ne sont plus 'En attente')
        const total = await pool.query("SELECT COUNT(*) FROM dossiers");
        const enAttente = await pool.query("SELECT COUNT(*) FROM dossiers WHERE statut = 'En attente'");
        
        const totalCount = parseInt(total.rows[0].count);
        const waitingCount = parseInt(enAttente.rows[0].count);
        
        // Si 0 signalement, taux = 0% pour éviter la division par zéro
        let taux = 0;
        if (totalCount > 0) {
            taux = Math.round(((totalCount - waitingCount) / totalCount) * 100);
        }

        res.json({
            actifs: parseInt(actifs.rows[0].count),
            resolus: parseInt(resolus.rows[0].count),
            taux: taux
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erreur Serveur");
    }
});

module.exports = router;