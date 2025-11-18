require('dotenv').config();
const express = require('express');
const pool = require('./database');
const authRoutes = require('./routes/auth');
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
app.use(express.json());
app.use('/auth', authRoutes);
app.use('/signalements', signalementRoutes);
app.listen(5000, () => {
    console.log("Le serveur est démarré sur le port 5000");
});