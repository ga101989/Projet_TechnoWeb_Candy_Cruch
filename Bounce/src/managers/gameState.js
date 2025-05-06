/**
 * Gestionnaire de l'état du jeu
 * Gère l'état du jeu, le score et les conditions de victoire
 */
class GameState {
    constructor() {
        this.states = {
            MENU: 'menu',
            READY: 'ready',
            PLAYING: 'playing',
            PAUSED: 'paused',
            GAME_OVER: 'gameOver',
            VICTORY: 'victory'
        };
        
        this.currentState = this.states.MENU;
        
        this.playerStates = [
            { alive: true, score: 0, wins: 0 },
            { alive: true, score: 0, wins: 0 }
        ];
        
        this.winScore = 10;
        this.levelHeight = 10000; // Hauteur du niveau en pixels
        this.currentProgress = 0;
        
        this.messageElement = document.getElementById('game-message');
    }

    /**
     * Commencer une nouvelle partie
     */
    startGame() {
        this.currentState = this.states.PLAYING;
        this.playerStates[0].alive = true;
        this.playerStates[1].alive = true;
        this.playerStates[0].score = 0;
        this.playerStates[1].score = 0;
        this.currentProgress = 0;
        
        this.messageElement.style.display = 'none';
    }

    /**
     * Mettre le jeu en pause
     */
    pauseGame() {
        if (this.currentState === this.states.PLAYING) {
            this.currentState = this.states.PAUSED;
        }
    }

    /**
     * Reprendre le jeu
     */
    resumeGame() {
        if (this.currentState === this.states.PAUSED) {
            this.currentState = this.states.PLAYING;
            this.messageElement.style.display = 'none';
        }
    }

    /**
     * Gérer le joueur atteignant la fin du niveau
     * @param {number} playerIndex - Index du joueur ayant atteint la fin
     */
    playerReachedEnd(playerIndex) {
        this.playerWon(playerIndex);
    }

    /**
     * Gérer la victoire d'un joueur
     * @param {number} playerIndex - Index du joueur gagnant
     */
    playerWon(playerIndex) {
        this.playerStates[playerIndex].wins++;
        this.currentState = this.states.VICTORY;
        
        this.messageElement.style.display = 'none';
        
        uiSystem.showGameOver(playerIndex);
    }

    /**
     * Mettre à jour la progression dans le niveau
     * @param {number} progress - Progression dans le niveau (0-1)
     */
    updateProgress(progress) {
        this.currentProgress = progress;
        
        if (progress >= 1) {
            if (this.currentState === this.states.VICTORY) {
                return;
            }
            
            if (this.playerStates[0].score > this.playerStates[1].score) {
                this.playerReachedEnd(0);
            } else if (this.playerStates[1].score > this.playerStates[0].score) {
                this.playerReachedEnd(1);
            } else {
                this.showMessage('ÉGALITÉ!');
                this.currentState = this.states.VICTORY;
            }
        }
    }

    /**
     * Afficher un message à l'écran
     * @param {string} message - Message à afficher
     */
    showMessage(message) {
        this.messageElement.textContent = message;
        this.messageElement.style.display = 'block';
    }

    /**
     * Vérifier si le jeu est en cours
     * @returns {boolean} - Si le jeu est en cours
     */
    isPlaying() {
        return this.currentState === this.states.PLAYING;
    }

    /**
     * Vérifier si le jeu est en pause
     * @returns {boolean} - Si le jeu est en pause
     */
    isPaused() {
        return this.currentState === this.states.PAUSED;
    }
}

const gameState = new GameState();