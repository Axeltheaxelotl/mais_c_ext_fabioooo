const express = require('express');
const axios = require('axios');
const config = require('./config');
const app = express();
const port = 3000;

// Route d'accueil avec lien vers OAuth
app.get('/', (req, res) => {
    res.send(`<a href="https://api.intra.42.fr/oauth/authorize?client_id=${config.client_id}&redirect_uri=${encodeURIComponent(config.redirect_uri)}&response_type=code">Se connecter avec 42</a>`);
});

// Callback après l'authentification OAuth
app.get('/callback', async (req, res) => {
    const code = req.query.code;

    if (code) {
        try {
            // Échange du code contre un token d'accès
            const response = await axios.post(`${config.api_base_url}/oauth/token`, null, {
                params: {
                    client_id: config.client_id,
                    client_secret: config.client_secret,
                    code: code,
                    grant_type: 'authorization_code',
                    redirect_uri: config.redirect_uri
                }
            });

            const accessToken = response.data.access_token;

            // Utilisation du token pour obtenir des données utilisateur
            const userResponse = await axios.get(`${config.api_base_url}/v2/me`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            const userData = userResponse.data;

            // Affichage des données de l'utilisateur ou créer ton leaderboard
            res.send(`<h1>Bienvenue ${userData.login} !</h1><pre>${JSON.stringify(userData, null, 2)}</pre>`);

        } catch (error) {
            console.error('Erreur lors de la récupération du token ou des données utilisateur', error);
            res.send('Erreur lors de la récupération des données utilisateur.');
        }
    } else {
        res.send('Code d\'authentification manquant');
    }
});

// Démarre le serveur
app.listen(port, () => {
    console.log(`Serveur démarré à http://localhost:${port}`);
});

