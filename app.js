document.getElementById('loginButton').addEventListener('click', function() {
    window.location.href = `https://api.intra.42.fr/oauth/authorize?client_id=${config.client_id}&redirect_uri=${config.redirect_uri}&response_type=code`;
});

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
        return fetch('/leaderboard', {
            headers: {
                'Authorization': `Bearer ${data.access_token}`,
            },
        });
    })
    .then(response => response.json())
    .then(leaderboard => {
        const leaderboardDiv = document.getElementById('leaderboard');
        leaderboardDiv.innerHTML = leaderboard.map(user => `<p>${user.login}: ${user.pool_year}</p>`).join('');
    });
}

