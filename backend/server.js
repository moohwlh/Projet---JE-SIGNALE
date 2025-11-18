require('dotenv').config();
const express = require('express');
const pool = require('./database');
const app = express();
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
app.listen(5000, () => {
    console.log("Le serveur est démarré sur le port 5000");
});