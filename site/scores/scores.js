document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour charger les scores depuis le localStorage
    function loadScores() {
        const games = ['candy', 'bounce', 'shadow'];
        
        games.forEach(game => {
            const scores = JSON.parse(localStorage.getItem(`scores${game.charAt(0).toUpperCase() + game.slice(1)}`)) || [];
            const scoreList = document.getElementById(`${game}-scores`);
            
            // Trier les scores par ordre décroissant
            scores.sort((a, b) => b.score - a.score);
            if (game === 'candy') {
                scores.sort((a, b) => (b.score - 1000 ** a.niveau) - (a.score - 1000 ** b.niveau));
            } else if (game === 'bounce') {
                scores.sort((a, b) => b.score - a.score);
            } else if (game === 'shadow') {
                scores.sort((a, b) => b.score - a.score);
            }

            if (scores.length < 5) {
                while (scores.length < 5) {
                    scores.push({ nom: "-", score: "-", niveau: "-" });
                }
            }

            if (game === 'candy') {
                // Afficher les 5 meilleurs scores pour Candy Crush
                scoreList.innerHTML = scores.slice(0, 5).map((score, index) => `
                    <div class="score-item">
                        <span>#${index + 1}</span>
                        <span>${score.nom}</span>
                        <span>(Niv ${score.niveau}) ${score.score}</span>
                    </div>
                `).join('');
            } else if (game === 'bounce') {
                // Afficher les 5 meilleurs scores pour Bounce
                scoreList.innerHTML = scores.slice(0, 5).map((score, index) => `
                    <div class="score-item
">
                        <span>#${index + 1}</span>
                        <span>${score.nom}</span>
                        <span>${score.score}</span>
                    </div>
                `).join('');
            }
            else if (game === 'shadow') {
                // Afficher les 5 meilleurs scores pour Shadow
                scoreList.innerHTML = scores.slice(0, 5).map((score, index) => `
                    <div class="score-item
">
                        <span>#${index + 1}</span>
                        <span>${score.nom}</span>
                        <span>${score.score}</span>
                    </div>
                `).join('');
            }
        });
    }

    // Charger les scores au chargement de la page
    loadScores();

    // Mettre à jour les scores toutes les 30 secondes
    setInterval(loadScores, 30000);
}); 