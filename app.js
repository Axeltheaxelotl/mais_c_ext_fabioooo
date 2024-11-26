document.getElementById('loginButton').addEventListener('click', function() {
    // Rediriger l'utilisateur vers l'URL d'authentification OAuth
    window.location.href = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-58e91ff8865d51f28401c794095ee73cd986e94cb866777db1a299b59f421cf8&redirect_uri=http://localhost:3000/callback&response_type=code';
});

// Une fois que l'utilisateur est redirigé et que le code est récupéré
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');
if (code) {
    fetch('/getAccessToken', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Access Token:', data.access_token);
        // Utiliser l'Access Token pour récupérer les utilisateurs
        return fetch('/leaderboard', {
            headers: {
                'Authorization': `Bearer ${data.access_token}`,
            },
        });
    })
    .then(response => response.json())
    .then(leaderboard => {
        // Afficher le leaderboard
        const leaderboardDiv = document.getElementById('leaderboard');
        leaderboardDiv.innerHTML = leaderboard.map(user => `<p>${user.login}: ${user.pool_year}</p>`).join('');
    });
}

