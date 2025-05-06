/**
 * Système d'interface utilisateur
 * Gère les éléments de l'interface utilisateur tels que les menus, les affichages de score et d'autres composants de l'interface utilisateur
 */
class UISystem {
    constructor() {
        // Éléments de l'interface utilisateur
        this.elements = {
            player1Score: document.getElementById('player1-score'),
            player2Score: document.getElementById('player2-score'),
            gameMessage: document.getElementById('game-message')
        };
        
        // État du menu
        this.menuVisible = true;
        
        this.createMenuElements();
    }

    createMenuElements() {
        this.menuContainer = document.createElement('div');
        this.menuContainer.id = 'menu-container';
        this.menuContainer.style.position = 'absolute';
        this.menuContainer.style.top = '0';
        this.menuContainer.style.left = '0';
        this.menuContainer.style.width = '100%';
        this.menuContainer.style.height = '100%';
        this.menuContainer.style.display = 'flex';
        this.menuContainer.style.flexDirection = 'column';
        this.menuContainer.style.justifyContent = 'center';
        this.menuContainer.style.alignItems = 'center';
        this.menuContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        this.menuContainer.style.zIndex = '100';
        
        // Créer le titre
        const title = document.createElement('h1');
        title.textContent = 'BOUNCE';
        title.style.color = '#FFF';
        title.style.fontSize = '48px';
        title.style.marginBottom = '40px';
        title.style.fontFamily = 'Arial, sans-serif';
        title.style.textAlign = 'center';
        title.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
        
        // Créer une barre de couleur animée sous le titre
        const colorBar = document.createElement('div');
        colorBar.style.width = '300px';
        colorBar.style.height = '10px';
        colorBar.style.marginBottom = '40px';
        colorBar.style.position = 'relative';
        colorBar.style.overflow = 'hidden';
        
        // Créer les segments de couleur
        const colors = colorManager.colorArray;
        for (let i = 0; i < colors.length; i++) {
            const segment = document.createElement('div');
            segment.style.position = 'absolute';
            segment.style.top = '0';
            segment.style.left = (i * 25) + '%';
            segment.style.width = '25%';
            segment.style.height = '100%';
            segment.style.backgroundColor = colors[i];
            segment.style.animation = `colorSlide 2s infinite ${i * 0.5}s`;
            colorBar.appendChild(segment);
        }
        
        // Créer le style d'animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes colorSlide {
                0% { transform: translateX(0); }
                50% { transform: translateX(100%); }
                100% { transform: translateX(0); }
            }
        `;
        document.head.appendChild(style);
        
        // Créer le bouton de démarrage
        this.startButton = document.createElement('button');
        this.startButton.textContent = 'JOUER';
        this.startButton.style.backgroundColor = '#FFF';
        this.startButton.style.color = '#000';
        this.startButton.style.border = 'none';
        this.startButton.style.padding = '15px 30px';
        this.startButton.style.fontSize = '24px';
        this.startButton.style.borderRadius = '5px';
        this.startButton.style.cursor = 'pointer';
        this.startButton.style.marginBottom = '20px';
        this.startButton.style.fontFamily = 'Arial, sans-serif';
        this.startButton.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
        
        // Ajouter un effet de survol
        this.startButton.addEventListener('mouseover', () => {
            this.startButton.style.backgroundColor = colorManager.colorArray[0];
            this.startButton.style.color = '#FFF';
        });
        
        this.startButton.addEventListener('mouseout', () => {
            this.startButton.style.backgroundColor = '#FFF';
            this.startButton.style.color = '#000';
        });
        
        // Ajouter un événement de clic
        this.startButton.addEventListener('click', () => {
            this.hideMenu();
            gameState.startGame();
        });
        
        // Créer les instructions
        const instructions = document.createElement('div');
        instructions.style.color = '#FFF';
        instructions.style.fontSize = '18px';
        instructions.style.marginTop = '30px';
        instructions.style.textAlign = 'center';
        instructions.style.maxWidth = '600px';
        instructions.style.lineHeight = '1.5';
        instructions.innerHTML = `
            <p><strong>Contrôles:</strong></p>
            <p>Joueur 1: <kbd>Espace</kbd> pour sauter</p>
            <p>Joueur 2: <kbd>Entrée</kbd> pour sauter</p>
            <p>Faites correspondre la couleur de votre balle avec celle des obstacles pour les traverser!</p>
            <p>Le premier arrivé à la fin du niveau gagne!</p>
        `;
        
        // Styliser les éléments kbd
        const style2 = document.createElement('style');
        style2.textContent = `
            kbd {
                background-color: #333;
                border-radius: 3px;
                border: 1px solid #666;
                box-shadow: 0 1px 0 rgba(255,255,255,0.2);
                color: #FFF;
                display: inline-block;
                font-size: 14px;
                line-height: 1.4;
                margin: 0 0.1em;
                padding: 0.1em 0.6em;
                white-space: nowrap;
            }
        `;
        document.head.appendChild(style2);
        
        // Ajouter les éléments au conteneur du menu
        this.menuContainer.appendChild(title);
        this.menuContainer.appendChild(colorBar);
        this.menuContainer.appendChild(this.startButton);
        this.menuContainer.appendChild(instructions);
        
        // Ajouter le conteneur du menu au conteneur du jeu
        document.getElementById('game-container').appendChild(this.menuContainer);
    }

    /**
     * Afficher le menu
     */
    showMenu() {
        this.menuContainer.style.display = 'flex';
        this.menuVisible = true;
    }

    /**
     * Cacher le menu
     */
    hideMenu() {
        this.menuContainer.style.display = 'none';
        this.menuVisible = false;
    }

    /**
     * Mettre à jour l'affichage du score du joueur
     * @param {number} playerIndex - Index du joueur (0 ou 1)
     * @param {number} score - Nouveau score
     */
    updateScore(playerIndex, score) {
        if (playerIndex === 0) {
            this.elements.player1Score.textContent = `J1: ${score}`;
        } else {
            this.elements.player2Score.textContent = `J2: ${score}`;
        }
    }

    /**
     * Afficher un message
     * @param {string} message - Message à afficher
     * @param {number} duration - Durée d'affichage du message (ms)
     */
    showMessage(message, duration = 0) {
        this.elements.gameMessage.textContent = message;
        this.elements.gameMessage.style.display = 'block';
        
        // Ajouter un effet d'animation de texte
        this.animateMessage();
        
        // Cacher le message après la durée si spécifiée
        if (duration > 0) {
            setTimeout(() => {
                this.hideMessage();
            }, duration);
        }
    }

    /**
     * Cacher le message
     */
    hideMessage() {
        this.elements.gameMessage.style.display = 'none';
    }

    /**
     * Animer le message avec un effet ondulé
     */
    animateMessage() {
        let time = 0;
        const animateText = () => {
            if (this.elements.gameMessage.style.display === 'none') return;
            
            time += 0.05;
            const chars = this.elements.gameMessage.textContent.split('');
            let html = '';
            
            for (let i = 0; i < chars.length; i++) {
                const y = Math.sin(time + i * 0.1) * 10;
                html += `<span style="display: inline-block; transform: translateY(${y}px)">${chars[i]}</span>`;
            }
            
            this.elements.gameMessage.innerHTML = html;
            requestAnimationFrame(animateText);
        };
        
        animateText();
    }

    /**
     * Afficher l'écran de fin de partie
     * @param {number} winnerIndex - Index du gagnant (-1 pour égalité)
     */
    showGameOver(winnerIndex) {
        // Créer le conteneur de fin de partie
        const gameOverContainer = document.createElement('div');
        gameOverContainer.style.position = 'absolute';
        gameOverContainer.style.top = '0';
        gameOverContainer.style.left = '0';
        gameOverContainer.style.width = '100%';
        gameOverContainer.style.height = '100%';
        gameOverContainer.style.display = 'flex';
        gameOverContainer.style.flexDirection = 'column';
        gameOverContainer.style.justifyContent = 'center';
        gameOverContainer.style.alignItems = 'center';
        gameOverContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        gameOverContainer.style.zIndex = '100';
        
        // Créer le message de fin de partie
        const message = document.createElement('h2');
        
        if (winnerIndex === -1) {
            message.textContent = 'ÉGALITÉ!';
        } else {
            message.textContent = `JOUEUR ${winnerIndex + 1} GAGNE!`;
        }
        
        message.style.color = '#FFF';
        message.style.fontSize = '48px';
        message.style.marginBottom = '40px';
        message.style.fontFamily = 'Arial, sans-serif';
        message.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
        
        // Créer le bouton de redémarrage
        const restartButton = document.createElement('button');
        restartButton.textContent = 'REJOUER';
        restartButton.style.backgroundColor = '#FFF';
        restartButton.style.color = '#000';
        restartButton.style.border = 'none';
        restartButton.style.padding = '15px 30px';
        restartButton.style.fontSize = '24px';
        restartButton.style.borderRadius = '5px';
        restartButton.style.cursor = 'pointer';
        restartButton.style.fontFamily = 'Arial, sans-serif';
        restartButton.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
        
        // Ajouter un effet de survol
        restartButton.addEventListener('mouseover', () => {
            restartButton.style.backgroundColor = colorManager.colorArray[0];
            restartButton.style.color = '#FFF';
        });
        
        restartButton.addEventListener('mouseout', () => {
            restartButton.style.backgroundColor = '#FFF';
            restartButton.style.color = '#000';
        });
        
        // Ajouter un événement de clic - recharge la page complètement au lieu de redémarrer
        restartButton.addEventListener('click', () => {
            window.location.reload();
        });
        
        // Ajouter les éléments au conteneur de fin de partie
        gameOverContainer.appendChild(message);
        gameOverContainer.appendChild(restartButton);
        
        // Ajouter le conteneur de fin de partie au conteneur du jeu
        document.getElementById('game-container').appendChild(gameOverContainer);
    }

    /**
     * Afficher l'écran de pause
     */
    showPauseScreen() {
        // Créer le conteneur de pause
        const pauseContainer = document.createElement('div');
        pauseContainer.id = 'pause-container';
        pauseContainer.style.position = 'absolute';
        pauseContainer.style.top = '0';
        pauseContainer.style.left = '0';
        pauseContainer.style.width = '100%';
        pauseContainer.style.height = '100%';
        pauseContainer.style.display = 'flex';
        pauseContainer.style.flexDirection = 'column';
        pauseContainer.style.justifyContent = 'center';
        pauseContainer.style.alignItems = 'center';
        pauseContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        pauseContainer.style.zIndex = '100';
        
        // Créer le message de pause
        const message = document.createElement('h2');
        message.textContent = 'PAUSE';
        message.style.color = '#FFF';
        message.style.fontSize = '48px';
        message.style.marginBottom = '40px';
        message.style.fontFamily = 'Arial, sans-serif';
        message.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
        
        // Créer le bouton de reprise
        const resumeButton = document.createElement('button');
        resumeButton.textContent = 'REPRENDRE';
        resumeButton.style.backgroundColor = '#FFF';
        resumeButton.style.color = '#000';
        resumeButton.style.border = 'none';
        resumeButton.style.padding = '15px 30px';
        resumeButton.style.fontSize = '24px';
        resumeButton.style.borderRadius = '5px';
        resumeButton.style.cursor = 'pointer';
        resumeButton.style.marginBottom = '20px';
        resumeButton.style.fontFamily = 'Arial, sans-serif';
        resumeButton.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.5)';
        
        // Ajouter un effet de survol
        resumeButton.addEventListener('mouseover', () => {
            resumeButton.style.backgroundColor = colorManager.colorArray[0];
            resumeButton.style.color = '#FFF';
        });
        
        resumeButton.addEventListener('mouseout', () => {
            resumeButton.style.backgroundColor = '#FFF';
            resumeButton.style.color = '#000';
        });
        
        // Ajouter un événement de clic
        resumeButton.addEventListener('click', () => {
            window.game.togglePause();
        });
        
        // Ajouter les éléments au conteneur de pause
        pauseContainer.appendChild(message);
        pauseContainer.appendChild(resumeButton);
        
        // Ajouter le conteneur de pause au conteneur du jeu
        document.getElementById('game-container').appendChild(pauseContainer);
    }

    /**
     * Cacher l'écran de pause
     */
    hidePauseScreen() {
        const pauseContainer = document.getElementById('pause-container');
        
        if (pauseContainer) {
            document.getElementById('game-container').removeChild(pauseContainer);
        }
    }
}

// Créer une instance globale du système d'interface utilisateur
const uiSystem = new UISystem();