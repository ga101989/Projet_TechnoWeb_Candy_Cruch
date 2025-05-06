/**
 * Classe principale du jeu
 * Gère l'initialisation du jeu, la boucle et la gestion de l'état
 */
class Game {
    static FPS = 60;
    static FRAME_TIME = 1000 / Game.FPS;
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
        
        window.addEventListener('resize', () => this.resizeCanvas());
        
        this.renderer = new Renderer();
        
        // Positionner les joueurs au centre de leurs moitiés respectives
        this.players = [
            new Player(0, this.canvas.height - 50, 0),
            new Player(0, this.canvas.height - 50, 1)
        ];
        
        this.obstacleManager = new ObstacleManager();
        
        this.isRunning = false;
        this.lastTimestamp = 0;
        this.frameCount = 0;
        
        window.addEventListener('keydown', (event) => {
            if (event.code === 'Escape') {
                this.togglePause();
            }
        });
        
        this.initialize();
    }

    /**
     * Redimensionner le canevas pour s'adapter à la fenêtre
     */
    resizeCanvas() {
        // Réduire légèrement la résolution pour améliorer les performances
        const scaleFactor = 0.9; // Réduire à 90% de la taille réelle
        this.canvas.width = window.innerWidth * scaleFactor;
        this.canvas.height = window.innerHeight * scaleFactor;
        
        // Style pour que le canvas occupe toujours l'écran entier
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
    }

    /**
     * Initialiser le jeu
     */
    initialize() {
        this.obstacleManager.initialize(0);
        
        // Reset players - centrés horizontalement
        this.players[0].reset(0, this.canvas.height - 50);
        this.players[1].reset(0, this.canvas.height - 50);
        
        gameState.startGame();
        
        this.isRunning = true;
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    /**
     * Basculer l'état de pause
     */
    togglePause() {
        if (gameState.isPlaying()) {
            gameState.pauseGame();
            this.isRunning = false;
            uiSystem.showPauseScreen();
        } else if (gameState.isPaused()) {
            gameState.resumeGame();
            this.isRunning = true;
            uiSystem.hidePauseScreen();
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }

    /**
     * Boucle de jeu principale
     * @param {number} timestamp - Horodatage actuel
     */
    gameLoop(timestamp) {
        if (this.lastTimestamp === 0) {
            this.lastTimestamp = timestamp;
        }
        
        const now = timestamp;
        const elapsed = now - this.lastTimestamp;
        
        if (elapsed > Game.FRAME_TIME) {
            const deltaTime = physics.update(timestamp) || 0.016;
            
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.frameCount++;
            
            if (gameState.isPlaying()) {
                inputHandler.handlePlayerInput(this.players[0], 0);
                inputHandler.handlePlayerInput(this.players[1], 1);
                
                this.players.forEach(player => {
                    player.update(deltaTime);
                });
                
                this.obstacleManager.update(this.players);
                
                for (let i = 0; i < this.players.length; i++) {
                    const player = this.players[i];
                    if (player.alive) {
                        const playerProgress = Math.min(1, Math.max(0, -player.position.y / gameState.levelHeight));
                        
                        player.progress = playerProgress;
                        
                        if (playerProgress >= 1) {
                            this.endGame(i); // Le joueur i a gagné
                            break;
                        }
                    }
                }
                
                const highestProgress = Math.max(this.players[0].progress || 0, this.players[1].progress || 0);
                gameState.updateProgress(highestProgress);
            }
            
            this.renderer.render(this);
            
            this.lastTimestamp = now - (elapsed % Game.FRAME_TIME);
        }
        
        if (this.isRunning) {
            requestAnimationFrame(this.gameLoop.bind(this));
        }
    }

    /**
     * Commencer une nouvelle partie
     */
    startNewGame() {
        gameState.startGame();
        
        this.initialize();
    }

    /**
     * Terminer la partie
     * @param {number} winnerIndex - Index du gagnant (-1 pour égalité)
     */
    endGame(winnerIndex) {
        gameState.playerWon(winnerIndex);
        
        this.isRunning = false;
        
        uiSystem.showGameOver(winnerIndex);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.game = new Game();
});