require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./database');
const authRoutes = require('./routes/auth');
const authorize = require("./middleware/verifyToken");
const app = express();
const signalementRoutes = require('./routes/signalements');
app.get('/', (req, res) => {
    res.send("Bonjour, je suis ton serveur !");
});
// Test de connexion à la base de données
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Erreur de connexion à la base de données :', err);
    } else {
        console.log('Connexion réussie à la base de données ! Heure serveur :', res.rows[0].now);
    }
});
app.use(cors());
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/signalementRoutes', signalementRoutes);
app.use("/signalementRoutes", authorize, signalementRoutes);
app.listen(5000, () => {
    console.log("Le serveur est démarré sur le port 5000");
});