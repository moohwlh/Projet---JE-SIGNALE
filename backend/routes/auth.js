const router = require('express').Router();
const pool = require('../database'); 
const bcrypt = require('bcrypt');  
const jwt = require('jsonwebtoken');  


router.post('/register', async (req, res) => {
    try {
        // Récupérer les infos envoyées par le client 
        const { nom, prenom, email, mot_de_passe, telephone } = req.body;
        if ( mot_de_passe.length <6){
            return res.status(401).json("Le mot de passe doit contenir au moins 6 caractères");
        }
        //  Vérifier si l'utilisateur existe déjà 
        const userExist = await pool.query("SELECT * FROM utilisateurs WHERE email = $1", [email]);
        if (userExist.rows.length > 0) {
            return res.status(401).json("Cet email est déjà utilisé !");
        }

        // Chiffrer le mot de passe 
        const saltRound = 10; 
        const salt = await bcrypt.genSalt(saltRound);
        const bcryptPassword = await bcrypt.hash(mot_de_passe, salt);

        // Insérer le nouvel utilisateur dans la base de données
        const newUser = await pool.query(
            "INSERT INTO utilisateurs (nom, prenom, email, mot_de_passe, telephone) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [nom, prenom, email, bcryptPassword, telephone]
        );

        // Répondre au client que c'est bon 
        res.json(newUser.rows[0]);

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erreur Serveur");
    }
});
router.post('/login', async (req, res) => {
    try {
   const { email, mot_de_passe } = req.body;
   const user = await pool.query("SELECT * FROM utilisateurs WHERE email = $1", [email]);
   if (user.rows.length === 0) {
            return res.status(401).json("Email incorrect");
        }
        const validPassword = await bcrypt.compare(mot_de_passe, user.rows[0].mot_de_passe);
        if (!validPassword) {
            return res.status(401).json("Mot de passe incorrect");
        }
        const token = jwt.sign(
            { userId: user.rows[0].iduti },
            process.env.JWT_SECRET || "cle_secrete_temporaire", 
            { expiresIn: "1h" } // Le jeton est valable 1 heure
        );
       res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Erreur Serveur");
    }});
        module.exports = router;
