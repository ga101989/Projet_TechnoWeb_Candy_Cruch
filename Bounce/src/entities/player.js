/**
 * Classe Joueur
 * Gère le mouvement du joueur, l'état de couleur et les collisions
 */
class Player {
    /**
     * Créer un nouveau joueur
     * @param {number} x - Position x initiale
     * @param {number} y - Position y initiale
     * @param {number} lane - Index de la voie (0 pour gauche, 1 pour droite)
     */
    constructor(x, y, lane) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.radius = 12;
        this.lane = lane;
        
        this.alive = true;
        this.score = 0;
        this.canJump = true;
        this.isOnGround = false;
        this.progress = 0;
        
        this.color = colorManager.colorArray[0];
        this.isTransitioning = false;
        
        this.trail = [];
        this.maxTrailLength = 5;
        
        this.lastObstaclePassed = null;
    }

    /**
     * Mettre à jour l'état du joueur
     * @param {number} deltaTime - Temps écoulé depuis la dernière image
     */
    update(deltaTime) {
        if (!this.alive) return;
        
        const dt = (deltaTime === undefined || isNaN(deltaTime)) ? 0.016 : deltaTime;
        
        physics.applyGravity(this);
        
        if (isNaN(this.position.y)) {
            this.position.y = window.innerHeight - this.radius;
        }
        
        this.position.y += this.velocity.y * dt;
        
        this.updateTrail();
        
        if (this.position.y >= window.innerHeight - this.radius) {
            this.position.y = window.innerHeight - this.radius;
            this.velocity.y = 0;
            this.isOnGround = true;
        } else {
            this.isOnGround = false;
        }
    }

    /**
     * Faire sauter le joueur
     */
    jump() {
        if (!this.alive) return;
        
        physics.jump(this);
        this.isOnGround = false;
    }

    /**
     * Changer la couleur du joueur pour la suivante dans le cycle
     */
    switchColor() {
        if (!this.alive || this.isTransitioning) return;
        
        const nextColor = colorManager.getNextColor(this.color);
        colorManager.transitionColor(this, nextColor);
    }

    /**
     * Gérer la collision avec un obstacle
     * @param {Obstacle} obstacle - Obstacle avec lequel vérifier la collision
     * @returns {boolean} - Si une collision s'est produite
     */
    checkCollision(obstacle) {
        if (!this.alive || this.isTransitioning) return false;
        
        if (this.lastObstaclePassed === obstacle) {
            return false;
        }
        
        const collision = physics.checkCollision(this, obstacle);
        
        if (collision) {
            if (obstacle instanceof Rotator) {
                const dx = this.position.x - obstacle.position.x;
                const dy = this.position.y - obstacle.position.y;
                let angle = Math.atan2(dy, dx) * 180 / Math.PI;
                
                angle -= obstacle.rotation;
                
                while (angle < 0) {
                    angle += 360;
                }
                while (angle >= 360) {
                    angle -= 360;
                }
                
                const segment = Math.floor(angle / 90);
                
                const segmentColor = obstacle.colors[segment];
                
                const colorMatch = obstacle.checkColorMatch(this);
                
                if (!colorMatch) {
                    this.die();
                    return true;
                } else if (this.position.y < obstacle.position.y) {
                    this.lastObstaclePassed = obstacle;
                    this.increaseScore();
                }
            } else {
                const colorMatch = obstacle.checkColorMatch(this);
                
                if (!colorMatch) {
                    this.die();
                    return true;
                } else if (this.position.y < obstacle.position.y) {
                    this.lastObstaclePassed = obstacle;
                    this.increaseScore();
                }
            }
        }
        
        return false;
    }

    /**
     * Gérer la mort du joueur
     */
    die() {
        const respawnY = this.position.y + 150;
        this.position.y = respawnY;
        this.velocity = { x: 0, y: 0 };
        
    }

    /**
     * Augmenter le score du joueur
     */
    increaseScore() {
        this.score++;
        
        if (this.lane === 0) {
            document.getElementById('player1-score').textContent = `J1: ${this.score}`;
        } else {
            document.getElementById('player2-score').textContent = `J2: ${this.score}`;
        }
    }

    /**
     * Réinitialiser le joueur à l'état initial
     * @param {number} x - Position x initiale
     * @param {number} y - Position y initiale
     */
    reset(x, y) {
        this.position = { x, y };
        this.velocity = { x: 0, y: 0 };
        this.alive = true;
        this.score = 0;
        this.canJump = true;
        this.isOnGround = false;
        this.progress = 0;
        this.color = colorManager.colorArray[0];
        this.isTransitioning = false;
        this.trail = [];
        this.lastObstaclePassed = null;
        
        if (this.lane === 0) {
            document.getElementById('player1-score').textContent = 'J1: 0';
        } else {
            document.getElementById('player2-score').textContent = 'J2: 0';
        }
    }

    /**
     * Mettre à jour la traînée du joueur
     */
    updateTrail() {
        this.maxTrailLength = 5;

        this.trail.unshift({
            x: this.position.x,
            y: this.position.y,
            color: this.color,
            alpha: 1
        });
        
        if (this.trail.length > this.maxTrailLength) {
            this.trail.pop();
        }
        
        for (let i = 0; i < this.trail.length; i++) {
            this.trail[i].alpha = 1 - (i / this.maxTrailLength);
        }
    }

    /**
     * Dessiner le joueur
     * @param {CanvasRenderingContext2D} ctx - Contexte du canevas
     */
    draw(ctx) {
        for (let i = 0; i < this.trail.length; i++) {
            const trail = this.trail[i];
            if (trail.alpha > 0.3) {
                ctx.beginPath();
                ctx.arc(trail.x, trail.y, this.radius * trail.alpha, 0, Math.PI * 2);
                ctx.fillStyle = trail.color + Math.floor(trail.alpha * 255).toString(16).padStart(2, '0');
                ctx.fill();
            }
        }
        
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        
        ctx.shadowColor = this.color;
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}