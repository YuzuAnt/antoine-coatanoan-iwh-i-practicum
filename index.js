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

// Route GET / : récupère tous les robots et affiche la page d'accueil
app.get('/', async (req, res) => {
    try {
        // Appelle l'API HubSpot pour récupérer tous les enregistrements Robots
        // avec leurs trois propriétés : name, bio et modele
        const response = await axios.get(
            `${HUBSPOT_API_BASE}?properties=name,bio,modele`,
            {
                // Envoie le token dans le header Authorization pour s'authentifier
                headers: { Authorization: `Bearer ${PRIVATE_APP_TOKEN}` }
            }
        );

        // Extrait la liste des enregistrements depuis la réponse de l'API
        const robots = response.data.results;

        // Rend la vue homepage.pug en lui transmettant la liste des robots
        res.render('homepage', { title: 'Robots', robots });

    } catch (error) {
        // Affiche l'erreur dans la console pour le débogage
        console.error(error);
        // Retourne une erreur HTTP 500 au navigateur
        res.status(500).send('Erreur lors de la récupération des robots');
    }
});

// Route GET /update-cobj : affiche le formulaire de création d'un nouveau robot
app.get('/update-cobj', (req, res) => {
    // Rend la vue updates.pug (formulaire vide, prêt à être rempli)
    res.render('updates', { title: 'Créer un robot' });
});

// Route POST /update-cobj : reçoit les données du formulaire et crée un robot dans HubSpot
app.post('/update-cobj', async (req, res) => {
    try {
        // Extrait les trois champs envoyés par le formulaire HTML
        const { name, bio, modele } = req.body;

        // Envoie une requête POST à l'API HubSpot pour créer un nouvel enregistrement
        await axios.post(
            HUBSPOT_API_BASE,
            {
                // Objet properties : contient les valeurs des propriétés du robot
                properties: { name, bio, modele }
            },
            {
                // Header Authorization pour s'authentifier + Content-Type JSON
                headers: {
                    Authorization: `Bearer ${PRIVATE_APP_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        // Redirige vers la page d'accueil une fois le robot créé
        res.redirect('/');

    } catch (error) {
        // Affiche l'erreur dans la console pour le débogage
        console.error(error);
        // Retourne une erreur HTTP 500 au navigateur
        res.status(500).send('Erreur lors de la création du robot');
    }
});

// Démarre le serveur sur le port 3000 et affiche un message dans la console
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}`));