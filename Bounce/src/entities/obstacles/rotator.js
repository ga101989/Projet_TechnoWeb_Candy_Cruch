/**
 * Obstacle Rotator 
 * Un obstacle circulaire avec des segments colorés qui tournent
 */
class Rotator {
    /**
     * Créer un nouvel obstacle rotator
     * @param {number} x - Position X
     * @param {number} y - Position Y
     * @param {number} lane - Index de la voie
     * @param {number} sizeFactor - Facteur pour ajuster la taille 
     */
    constructor(x, y, lane, sizeFactor = 1.0) {
        this.position = { x, y };
        this.lane = lane;
        this.sizeFactor = sizeFactor;
        this.baseRadius = 125; 
        this.radius = this.baseRadius * this.sizeFactor; 
        this.thickness = 20 * this.sizeFactor; 
        this.rotation = Math.random() * 360; 
        this.rotationSpeed = 1; 
        this.type = "Rotator"; 
        
        // La difficulté augmente la vitesse de rotation en fonction de la position et de la taille
        // Plus petit = plus rapide pour maintenir le niveau de difficulté
        const speedMultiplier = 1 / this.sizeFactor;
        
        if (y < -1000) {
            this.rotationSpeed = 1.5 * speedMultiplier;
        }
        if (y < -2000) {
            this.rotationSpeed = 2 * speedMultiplier;
        }
        
        // Direction de rotation (horaire ou anti-horaire)
        this.rotationDirection = Math.random() > 0.5 ? 1 : -1;
        
        // Couleurs pour les segments dans un ordre précis
        this.colors = [
            colorManager.colors.RED,      
            colorManager.colors.TURQUOISE, 
            colorManager.colors.YELLOW,   
            colorManager.colors.VIOLET  
        ];
        
        this.passed = false;
    }

    /**
     * Mettre à jour l'état de l'obstacle
     */
    update() {
        this.rotation += this.rotationSpeed * this.rotationDirection;
        
        if (this.rotation >= 360) {
            this.rotation -= 360;
        } else if (this.rotation < 0) {
            this.rotation += 360;
        }
    }

    /**
     * Dessiner l'obstacle
     * @param {CanvasRenderingContext2D} ctx 
     */
    draw(ctx) {
        ctx.save();
        
        ctx.translate(this.position.x, this.position.y);
        
        ctx.rotate(this.rotation * Math.PI / 180);
        
        for (let i = 0; i < this.colors.length; i++) {
            const startAngle = i * (Math.PI / 2);
            const endAngle = (i + 1) * (Math.PI / 2);
            
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, startAngle, endAngle);
            ctx.lineWidth = this.thickness;
            ctx.strokeStyle = this.colors[i];
            ctx.stroke();
            
            ctx.shadowColor = this.colors[i];
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
        
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
        
        const innerRadius = this.radius - this.thickness / 2;
        const outerRadius = this.radius + this.thickness / 2;
        
        if (distance >= innerRadius && distance <= outerRadius) {
            const colorMatches = this.checkColorMatch(player);
            return !colorMatches;
        }
        
        return false;
    }

    /**
     * Vérifier si la couleur du joueur correspond à la couleur de l'obstacle au point de collision
     * @param {Player} player - Joueur à vérifier
     * @returns {boolean} - Si les couleurs correspondent
     */
    checkColorMatch(player) {
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;
        let angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        angle -= this.rotation;
        
        while (angle < 0) {
            angle += 360;
        }
        while (angle >= 360) {
            angle -= 360;
        }
        
        const segment = Math.floor(angle / 90);
        
        const segmentColor = this.colors[segment];
        
        return player.color === segmentColor;
    }

    /**
     * Vérifier si le joueur se trouve dans une zone de couleur spécifique
     * @param {Player} player - Joueur à vérifier
     * @param {string} zoneColor - Couleur de la zone à vérifier
     * @returns {boolean} - Si le joueur est dans la zone de couleur spécifiée
     */
    isInColorZone(player, zoneColor) {
        const dx = player.position.x - this.position.x;
        const dy = player.position.y - this.position.y;
        let angle = Math.atan2(dy, dx) * 180 / Math.PI;
        
        angle -= this.rotation;
        
        while (angle < 0) {
            angle += 360;
        }
        while (angle >= 360) {
            angle -= 360;
        }
        
        const segment = Math.floor(angle / 90);
        
        const segmentColor = this.colors[segment];
        
        return segmentColor === zoneColor;
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
        
        if (player.position.y < this.position.y - this.radius) {
            this.passed = true;
            return true;
        }
        
        return false;
    }
}