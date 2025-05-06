/**
 * Moteur de rendu
 * Gère le dessin des éléments du jeu sur le canevas
 */
class Renderer {
    constructor() {
        this.canvas = document.getElementById('game-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.resizeCanvas();
        
        // Propriétés de la caméra pour chaque joueur
        this.cameras = [
            {
                y: 0,
                shake: {
                    intensity: 0,
                    duration: 0,
                    current: 0
                }
            },
            {
                y: 0,
                shake: {
                    intensity: 0,
                    duration: 0,
                    current: 0
                }
            }
        ];
        
        this.splitScreenGap = 4;
        this.splitScreen = {
            width: (this.canvas.width - this.splitScreenGap) / 2,
            gap: this.splitScreenGap
        };
        
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    /**
     * Redimensionner le canevas pour s'adapter à la fenêtre
     */
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        this.splitScreen = {
            width: (this.canvas.width - this.splitScreenGap) / 2,
            gap: this.splitScreenGap
        };
    }

    /**
     * Effacer le canevas
     */
    clear() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Mettre à jour les positions des caméras pour les deux joueurs
     * @param {Array} players - Tableau d'objets joueurs
     */
    updateCameras(players) {
        for (let i = 0; i < 2; i++) {
            if (players[i].alive) {
                const targetY = players[i].position.y - this.canvas.height * 0.7;
                
                this.cameras[i].y += (targetY - this.cameras[i].y) * 0.1;
                
                if (this.cameras[i].shake.current > 0) {
                    this.cameras[i].shake.current--;
                }
            }
        }
    }

    /**
     * Ajouter un effet de tremblement de caméra
     * @param {number} playerIndex - Index de la caméra du joueur à secouer
     * @param {number} intensity - Intensité du tremblement
     * @param {number} duration - Durée du tremblement en images
     */
    shakeCamera(playerIndex, intensity, duration) {
        this.cameras[playerIndex].shake.intensity = intensity;
        this.cameras[playerIndex].shake.duration = duration;
        this.cameras[playerIndex].shake.current = duration;
    }

    /**
     * Dessiner l'arrière-plan
     */
    drawBackground() {
        const gradient = this.ctx.createLinearGradient(0, 0, 0, this.canvas.height);
        gradient.addColorStop(0, '#111');
        gradient.addColorStop(1, '#000');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(this.splitScreen.width, 0, this.splitScreen.gap, this.canvas.height);
    }

    /**
     * Dessiner les lignes de la grille pour référence visuelle
     */
    drawGrid() {
        const gridSize = 100;
        
        this.ctx.strokeStyle = '#222';
        this.ctx.lineWidth = 1;
        
        // ÉCRAN GAUCHE
        const startY1 = Math.floor(this.cameras[0].y / gridSize) * gridSize;
        for (let y = startY1; y < startY1 + this.canvas.height; y += gridSize) {
            const screenY = y - this.cameras[0].y;
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, screenY);
            this.ctx.lineTo(this.splitScreen.width, screenY);
            this.ctx.stroke();
        }
        
        const startY2 = Math.floor(this.cameras[1].y / gridSize) * gridSize;
        for (let y = startY2; y < startY2 + this.canvas.height; y += gridSize) {
            const screenY = y - this.cameras[1].y;
            
            this.ctx.beginPath();
            this.ctx.moveTo(this.splitScreen.width + this.splitScreen.gap, screenY);
            this.ctx.lineTo(this.canvas.width, screenY);
            this.ctx.stroke();
        }
        
        for (let x = 0; x <= this.splitScreen.width; x += gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(x + this.splitScreen.width + this.splitScreen.gap, 0);
            this.ctx.lineTo(x + this.splitScreen.width + this.splitScreen.gap, this.canvas.height);
            this.ctx.stroke();
        }
    }

    /**
     * Dessiner le marqueur de fin du niveau
     * @param {number} endY - Position Y de la fin du niveau
     */
    drawLevelEnd(endY) {
        const checkSize = 20;
        const numFlagRows = 3; 
        this.ctx.lineWidth = 5;
        this.ctx.strokeStyle = '#FFFFFF';
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = 'bold 30px Arial';
        this.ctx.textAlign = 'center';

        // JOUEUR 1 (ÉCRAN GAUCHE)
        const screenY1 = endY - this.cameras[0].y;
        if (screenY1 >= 0 && screenY1 <= this.canvas.height) {
            // Draw finish line
            this.ctx.beginPath();
            this.ctx.moveTo(0, screenY1);
            this.ctx.lineTo(this.splitScreen.width, screenY1);
            this.ctx.stroke();
            
            // on dessine le drapeau à damier
            for (let i = 0; i < numFlagRows; i++) { 
                const yPos = screenY1 - (numFlagRows - i) * checkSize; 
                for (let col = 0; col < Math.ceil(this.splitScreen.width / checkSize); col++) {
                   
                    if ((col + i) % 2 === 0) { 
                        this.ctx.fillRect(col * checkSize, yPos, checkSize, checkSize);
                    }
                }
            }
            
            this.ctx.fillText('ARRIVÉE', this.splitScreen.width / 2, screenY1 - (numFlagRows * checkSize) - 5); 
        }
        
        // JOUEUR 2 (ÉCRAN DROIT)
        const screenY2 = endY - this.cameras[1].y;
        if (screenY2 >= 0 && screenY2 <= this.canvas.height) {
            const player2ScreenXStart = this.splitScreen.width + this.splitScreen.gap;
            this.ctx.beginPath();
            this.ctx.moveTo(player2ScreenXStart, screenY2);
            this.ctx.lineTo(this.canvas.width, screenY2);
            this.ctx.stroke();
            
            
            for (let i = 0; i < numFlagRows; i++) { 
                const yPos = screenY2 - (numFlagRows - i) * checkSize; 
                for (let col = 0; col < Math.ceil(this.splitScreen.width / checkSize); col++) {
                    if ((col + i) % 2 === 0) {
                        const currentX = player2ScreenXStart + (col * checkSize);
                        if (currentX < this.canvas.width) {
                           this.ctx.fillRect(currentX, yPos, Math.min(checkSize, this.canvas.width - currentX), checkSize);
                        }
                    }
                }
            }
            this.ctx.fillText('ARRIVÉE', player2ScreenXStart + this.splitScreen.width / 2, screenY2 - (numFlagRows * checkSize) - 5); 
        }
    }

    /**
     * Dessiner un joueur
     * @param {Player} player - Joueur à dessiner
     * @param {number} screenX - Position X à l'écran
     */
    drawPlayer(player, screenX) {
        this.ctx.save();
        
        this.ctx.translate(screenX, 0);
        
        player.draw(this.ctx);
        
        this.ctx.restore();
    }

    /**
     * Dessiner un obstacle
     * @param {Obstacle} obstacle - Obstacle à dessiner
     * @param {number} screenX - Position X à l'écran
     * @param {number} playerIndex - Index de la vue du joueur
     */
    drawObstacle(obstacle, screenX, playerIndex) {
        this.ctx.save();
        
        this.ctx.translate(screenX, 0);
        
        obstacle.draw(this.ctx, this.cameras[playerIndex].y);
        
        this.ctx.restore();
    }

    /**
     * Dessiner tous les éléments du jeu
     * @param {Object} game - Objet jeu avec joueurs et obstacles
     */
    render(game) {
        this.clear();
        
        this.updateCameras(game.players);
        
        this.drawBackground();
        
        this.drawGrid();
        
        this.drawLevelEnd(game.obstacleManager.levelEnd);
        
        // Vue du joueur 1 (côté gauche)
        const player1X = this.splitScreen.width / 2;
        this.ctx.save();
        
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.splitScreen.width, this.canvas.height);
        this.ctx.clip();
        
        this.ctx.translate(player1X, -this.cameras[0].y);
        
        if (this.cameras[0].shake.current > 0) {
            const shakeX = Math.random() * this.cameras[0].shake.intensity * 2 - this.cameras[0].shake.intensity;
            const shakeY = Math.random() * this.cameras[0].shake.intensity * 2 - this.cameras[0].shake.intensity;
            this.ctx.translate(shakeX, shakeY);
        }
        
        game.obstacleManager.obstacles[0].forEach(obstacle => {
            this.drawObstacle(obstacle, 0, 0);
        });
        
        this.drawPlayer(game.players[0], 0);
        
        this.ctx.restore();
        
        // Vue du joueur 2 (côté droit)
        const player2X = this.splitScreen.width + this.splitScreen.gap + this.splitScreen.width / 2;
        
        this.ctx.save();
        
        this.ctx.beginPath();
        this.ctx.rect(this.splitScreen.width + this.splitScreen.gap, 0, this.splitScreen.width, this.canvas.height);
        this.ctx.clip();
        
        this.ctx.translate(player2X, -this.cameras[1].y);
        
        if (this.cameras[1].shake.current > 0) {
            const shakeX = Math.random() * this.cameras[1].shake.intensity * 2 - this.cameras[1].shake.intensity;
            const shakeY = Math.random() * this.cameras[1].shake.intensity * 2 - this.cameras[1].shake.intensity;
            this.ctx.translate(shakeX, shakeY);
        }
        
        game.obstacleManager.obstacles[1].forEach(obstacle => {
            this.drawObstacle(obstacle, 0, 1);
        });
        
        this.drawPlayer(game.players[1], 0);
        
        this.ctx.restore();
    }
}