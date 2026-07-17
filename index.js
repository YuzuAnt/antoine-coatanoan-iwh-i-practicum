// Charge les variables d'environnement depuis le fichier .env
require('dotenv').config();

// Importe le framework Express pour créer le serveur web
const express = require('express');

// Importe Axios pour faire des requêtes HTTP vers l'API HubSpot
const axios = require('axios');

// Crée l'application Express
const app = express();

// Définit le port d'écoute du serveur
const PORT = 3000;

// Lit le token d'authentification HubSpot depuis les variables d'environnement
const PRIVATE_APP_TOKEN = process.env.PRIVATE_APP_TOKEN;

// Lit l'identifiant du custom object (Robots) depuis les variables d'environnement
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;

// Configure Pug comme moteur de templates pour générer les pages HTML
app.set('view engine', 'pug');

// Indique à Express où trouver les fichiers de vues (dossier views/)
app.set('views', './views');

// Permet de lire les données envoyées via les formulaires HTML
app.use(express.urlencoded({ extended: true }));

// Sert les fichiers statiques (CSS, images) depuis le dossier public/
app.use(express.static('public'));

// Construit l'URL de base pour l'API HubSpot CRM v3 du custom object Robots
const HUBSPOT_API_BASE = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`;
// Démarre le serveur sur le port 3000 et affiche un message dans la console
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));