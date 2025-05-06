/**
 * Obstacle Pulsar pour 
 * Un obstacle circulaire qui se dilate et se contracte de façon rythmique
 */
class Pulsar {
    /**
     * Créer un nouvel obstacle pulsar
     * @param {number} x - Position X
     * @param {number} y - Position Y
     * @param {number} lane - Index de la voie (0 ou 1)
     * @param {number} sizeFactor - Facteur pour ajuster la taille (défaut: 1.0)
     */
    constructor(x, y, lane, sizeFactor = 1.0) {
        this.position = { x, y };
        this.lane = lane;
        this.sizeFactor = sizeFactor;
        this.baseRadius = 100;
        this.minRadius = 70 * sizeFactor;
        this.maxRadius = 130 * sizeFactor;
        this.radius = this.baseRadius * sizeFactor;
        this.thickness = 20 * sizeFactor;
        this.type = "Pulsar";
        
        this.pulsationSpeed = 0.05;
        this.pulsationPhase = Math.random() * Math.PI * 2;
        
        // La difficulté augmente la vitesse de pulsation et s'ajuste à la taille
        const speedMultiplier = 1 / this.sizeFactor;
        
        if (y < -1000) {
            this.pulsationSpeed = 0.07 * speedMultiplier;
        }
        if (y < -2000) {
            this.pulsationSpeed = 0.09 * speedMultiplier;
        }
        
        if (window.game && window.game.players && window.game.players[lane]) {
            this.color = window.game.players[lane].color;
        } else {
            this.color = colorManager.getRandomColor();
        }
        
        this.passed = false;
        
        this.playerColorChanged = false;
        
        this.centerMarkerRadius = 25 * sizeFactor;
        this.centerGlowIntensity = 0;
        this.centerGlowDirection = 1;
    }

    /**
     * Mettre à jour l'état de l'obstacle
     */
    update() {
        this.pulsationPhase += this.pulsationSpeed;
        
        const pulseFactor = Math.sin(this.pulsationPhase);
        const radiusRange = this.maxRadius - this.minRadius;
        this.radius = this.minRadius + (radiusRange * (pulseFactor + 1) / 2);
        
        if (window.game && window.game.players && window.game.players[this.lane]) {
            this.color = window.game.players[this.lane].color;
        }
        
        this.centerGlowIntensity += 0.03 * this.centerGlowDirection;
        if (this.centerGlowIntensity > 1) {
            this.centerGlowIntensity = 1;
            this.centerGlowDirection = -1;
        } else if (this.centerGlowIntensity < 0.3) {
            this.centerGlowIntensity = 0.3;
            this.centerGlowDirection = 1;
        }
    }

    /**
     * Dessiner l'obstacle
     * @param {CanvasRenderingContext2D} ctx - Contexte du canvas
     */
    draw(ctx) {
        ctx.save();
        
        ctx.translate(this.position.x, this.position.y);
        
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
        ctx.lineWidth = this.thickness;
        ctx.strokeStyle = this.color;
        ctx.stroke();
        
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.stroke();
        ctx.shadowBlur = 0;
        
        ctx.beginPath();
        ctx.arc(0, 0, this.centerMarkerRadius, 0, Math.PI * 2);
        
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.centerMarkerRadius);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(0.7, this.color + "CC");
        gradient.addColorStop(1, this.color + "00");
        
        ctx.fillStyle = gradient;
        ctx.fill();
        
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 20 * this.centerGlowIntensity;
        ctx.fill();
        
        ctx.restore();
    }

    /**
     * Vérifier la collision détaillée avec le joueur
     * @param {Player} player - Joueur à vérifier
     * @returns {boolean} - Si une collision s'est produite
     */
    detailedCollision(player) {
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= this.centerMarkerRadius && !this.playerColorChanged) {
            this.changePlayerColor(player);
            return false;
        }
        
        const innerRadius = this.radius - this.thickness / 2;
        const outerRadius = this.radius + this.thickness / 2;
        
        if (distance >= innerRadius && distance <= outerRadius) {
            const colorMatch = this.checkColorMatch(player);
            return !colorMatch;
        }
        
        return false;
    }

    /**
     * Change la couleur du joueur et met à jour celle du pulsar
     * @param {Player} player - Le joueur dont il faut changer la couleur
     */
    changePlayerColor(player) {
        if (this.playerColorChanged) return;
        
        const oldColor = player.color;
        
        let newColor = "";
        
        if (oldColor === "#FF6B6B") {
            newColor = "#4ECDC4";
        } else if (oldColor === "#4ECDC4") {
            newColor = "#FFE66D";
        } else if (oldColor === "#FFE66D") {
            newColor = "#AC6CFF";
        } else {
            newColor = "#FF6B6B";
        }
        
        player.color = newColor;
        
        this.color = newColor;
        
        if (window.game && window.game.obstacleManager) {
            window.game.obstacleManager.obstacles[this.lane].forEach(obstacle => {
                if (obstacle instanceof Pulsar) {
                    obstacle.color = newColor;
                }
            });
        }
        
        player.increaseScore();
        
        this.playerColorChanged = true;
    }

    /**
     * Vérifier si la couleur du joueur correspond à la couleur de l'obstacle
     * @param {Player} player - Joueur à vérifier
     * @returns {boolean} - Si les couleurs correspondent
     */
    checkColorMatch(player) {
        return player.color === this.color;
    }

    /**
     * Vérifier si le joueur se trouve dans une zone de couleur spécifique
     * @param {Player} player - Joueur à vérifier
     * @param {string} zoneColor - Couleur de la zone à vérifier
     * @returns {boolean} - Si le joueur est dans la zone de couleur spécifiée
     */
    isInColorZone(player, zoneColor) {
        return this.color === zoneColor;
    }

    /**
     * Vérifier si le joueur a passé cet obstacle
     * @param {Player} player - Joueur à vérifier
     * @returns {boolean} - Si le joueur a passé
     */
    checkPassed(player) {
        if (this.passed) {
            return false;
        }
        
        if (player.position.y < this.position.y - this.maxRadius) {
            this.passed = true;
            return true;
        }
        
        return false;
    }
}