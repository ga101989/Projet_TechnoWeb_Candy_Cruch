/**
 * Moteur physique
 * Gère la gravité, la détection des collisions et le mouvement
 */
class Physics {
    constructor() {
        this.gravity = 0.6;
        this.jumpForce = -12;
        this.scrollSpeed = 4;
        this.terminalVelocity = 25;
        
        this.lastTimestamp = 0;
        this.deltaTime = 0;
    }

    /**
     * Mettre à jour les calculs physiques en fonction du temps écoulé
     * @param {number} timestamp - Horodatage de l'image d'animation actuelle
     */
    update(timestamp) {
        if (this.lastTimestamp === 0) {
            this.lastTimestamp = timestamp;
            this.deltaTime = 1;
            return this.deltaTime;
        }
        
        this.deltaTime = (timestamp - this.lastTimestamp) / (1000 / 60);
        
        if (isNaN(this.deltaTime) || !isFinite(this.deltaTime) || this.deltaTime <= 0) {
            this.deltaTime = 1;
        }
        
        this.lastTimestamp = timestamp;
        
        return this.deltaTime;
    }

    /**
     * Appliquer la gravité à une entité
     * @param {Object} entity - Entité avec les propriétés position et vélocité
     */
    applyGravity(entity) {
        entity.velocity.y += this.gravity * this.deltaTime;
        
        if (entity.velocity.y > this.terminalVelocity) {
            entity.velocity.y = this.terminalVelocity;
        }
    }

    /**
     * Appliquer le défilement vertical à une entité
     * @param {Object} entity - Entité avec la propriété position
     */
    applyScroll(entity) {
        entity.position.y += this.scrollSpeed * this.deltaTime;
    }

    /**
     * Faire sauter l'entité
     * @param {Object} entity - Entité avec la propriété vélocité
     */
    jump(entity) {
        entity.velocity.y = this.jumpForce;
    }

    /**
     * Vérifier la collision entre le joueur circulaire et l'obstacle
     * @param {Object} player - Entité joueur
     * @param {Object} obstacle - Entité obstacle
     * @returns {boolean} - Si une collision s'est produite
     */
    checkCollision(player, obstacle) {
        const dx = player.position.x - obstacle.position.x;
        const dy = player.position.y - obstacle.position.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < player.radius + obstacle.radius) {
            return obstacle.detailedCollision(player);
        }
        
        return false;
    }

    /**
     * Vérifier si le joueur est dans la zone de couleur d'un obstacle
     * @param {Object} player - Entité joueur
     * @param {Object} obstacle - Entité obstacle
     * @param {string} zoneColor - Couleur de la zone à vérifier
     * @returns {boolean} - Si le joueur est dans la zone de couleur spécifiée
     */
    isInColorZone(player, obstacle, zoneColor) {
        return obstacle.isInColorZone(player, zoneColor);
    }
}

const physics = new Physics();