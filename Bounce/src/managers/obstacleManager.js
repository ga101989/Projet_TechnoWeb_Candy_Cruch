/**
 * Gestionnaire d'obstacles
 * Gère la génération et la gestion des obstacles
 */
class ObstacleManager {
    constructor() {
        this.obstacles = [[], []];
        
        this.obstacleBlueprints = [[], []];
        
        this.baseSpacing = 450;
        
        // Définitions des modèles d'obstacles avec coefficients d'espacement par difficulté
        this.patternTemplates = {
            easy: [
                { type: 'rotator', spacingFactor: 1.0 },
                { type: 'rotator', spacingFactor: 1.0 },
                { type: 'pulsar', spacingFactor: 1.1 }
            ],
            medium: [
                { type: 'rotator', spacingFactor: 0.9 },
                { type: 'pulsar', spacingFactor: 1.0 },
                { type: 'rotator', spacingFactor: 0.9 },
                { type: 'pulsar', spacingFactor: 1.0 }
            ],
            hard: [
                { type: 'rotator', spacingFactor: 0.8 },
                { type: 'rotator', spacingFactor: 0.85 },
                { type: 'pulsar', spacingFactor: 0.9 },
                { type: 'rotator', spacingFactor: 0.8 }
            ]
        };
        
        // Facteurs de taille pour les obstacles selon la difficulté
        this.sizeFactor = {
            easy: 1.0,
            medium: 0.85,
            hard: 0.75
        };
        
        this.patterns = {};
        
        this.sectionProportions = [
            { difficulty: 'easy', proportion: 0.2 },
            { difficulty: 'medium', proportion: 0.3 },
            { difficulty: 'hard', proportion: 0.5 }
        ];
        
        this.sections = [];
        
        this.obstacleFactory = {
            rotator: (x, y, lane) => new Rotator(x, y, lane, this.getCurrentSizeFactor(y)),
            pulsar: (x, y, lane) => new Pulsar(x, y, lane, this.getCurrentSizeFactor(y))
        };
        
        // Configuration de la génération et du nettoyage
        this.preGenerationDistance = window.innerHeight * 1.5;
        this.cleanupDistance = window.innerHeight * 2.5;
        
        // Limiter la fréquence de génération
        this.lastGenerationTime = [0, 0];
        this.generationCooldown = 500;
        
        this.levelEnd = 0;
    }

    /**
     * Détermine le facteur de taille approprié en fonction de la position Y
     * @param {number} y - Position Y de l'obstacle
     * @returns {number} - Facteur de taille à appliquer
     */
    getCurrentSizeFactor(y) {
        if (!this.sections || this.sections.length === 0) {
            return 1.0;
        }
        
        let currentY = 0;
        for (const section of this.sections) {
            currentY -= section.length;
            if (y >= currentY) {
                return this.sizeFactor[section.difficulty];
            }
        }
        
        return this.sizeFactor.hard;
    }

    /**
     * Initialiser les obstacles pour une nouvelle partie
     * @param {number} startY - Position Y de départ
     */
    initialize(startY) {
        this.obstacles = [[], []];
        this.obstacleBlueprints = [[], []];
        
        let levelHeight = 5000;
        
        if (typeof gameState !== 'undefined') {
            levelHeight = gameState.levelHeight;
            this.levelEnd = startY - levelHeight;
        } else {
            this.levelEnd = startY - levelHeight;
        }
        
        const levelFactor = Math.sqrt(levelHeight / 5000);
        const adjustedBaseSpacing = this.baseSpacing * levelFactor;
        
        this.patterns = {};
        
        Object.keys(this.patternTemplates).forEach(difficulty => {
            this.patterns[difficulty] = [];
            
            this.patternTemplates[difficulty].forEach(template => {
                const spacing = Math.round(adjustedBaseSpacing * template.spacingFactor);
                
                this.patterns[difficulty].push({
                    type: template.type,
                    spacing: spacing
                });
            });
        });
        
        this.sections = [];
        let cumulativeProportion = 0;
        
        this.sectionProportions.forEach(sectionProp => {
            const length = Math.round(levelHeight * sectionProp.proportion);
            
            this.sections.push({
                difficulty: sectionProp.difficulty,
                length: length
            });
            
            cumulativeProportion += sectionProp.proportion;
        });
        
        for (let lane = 0; lane < 2; lane++) {
            this.generateLevelBlueprintForLane(lane, startY);
        }
        
        for (let lane = 0; lane < 2; lane++) {
            this.createVisibleObstacles(lane, startY);
        }
    }

    /**
     * Génère le schéma complet du niveau pour une voie
     * @param {number} lane - Index de la voie (0 ou 1)
     * @param {number} startY - Position Y de départ
     */
    generateLevelBlueprintForLane(lane, startY) {
        let currentY = startY;
        const totalDistance = Math.abs(this.levelEnd - startY);
        
        const levelFactor = Math.sqrt(totalDistance / 5000);
        const minDistanceBetweenObstacles = Math.round(500 * levelFactor);
        
        const estimatedObstacleCount = Math.ceil(totalDistance / (this.baseSpacing * levelFactor));
        
        let lastWasPulsar = false;
        
        this.sections.forEach(section => {
            const endY = currentY - section.length;
            
            const sectionEndY = Math.max(endY, this.levelEnd - 200);
            
            let sectionObstacleCount = 0;
            
            while (currentY > sectionEndY) {
                const pattern = this.patterns[section.difficulty];
                
                let patternIndex;
                let obstacleType;
                
                if (lastWasPulsar) {
                    do {
                        patternIndex = Math.floor(Math.random() * pattern.length);
                        obstacleType = pattern[patternIndex].type;
                    } while (obstacleType === 'pulsar');
                } else {
                    patternIndex = Math.floor(Math.random() * pattern.length);
                    obstacleType = pattern[patternIndex].type;
                }
                
                const spacing = Math.max(pattern[patternIndex].spacing, minDistanceBetweenObstacles);
                
                lastWasPulsar = (obstacleType === 'pulsar');
                
                let tooClose = false;
                if (this.obstacleBlueprints[lane].length > 0) {
                    tooClose = this.obstacleBlueprints[lane].some(blueprint => {
                        const distance = Math.abs(blueprint.y - currentY);
                        return distance < minDistanceBetweenObstacles;
                    });
                }
                
                if (!tooClose) {
                    const blueprint = {
                        type: obstacleType,
                        x: 0,
                        y: currentY,
                        created: false
                    };
                    
                    this.obstacleBlueprints[lane].push(blueprint);
                    sectionObstacleCount++;
                }
                
                currentY -= spacing;
            }
        });
    }

    /**
     * Crée les obstacles visibles pour une voie donnée
     * @param {number} lane - Index de la voie (0 ou 1)
     * @param {number} currentY - Position Y actuelle du joueur
     */
    createVisibleObstacles(lane, currentY) {
        const visibleStart = currentY - this.preGenerationDistance;
        const visibleEnd = currentY + this.cleanupDistance;
        
        let newObstaclesCount = 0;
        
        this.obstacleBlueprints[lane].forEach(blueprint => {
            if (!blueprint.created && blueprint.y >= visibleStart && blueprint.y <= visibleEnd) {
                const obstacle = this.createObstacle(blueprint.type, lane, blueprint.y);
                this.obstacles[lane].push(obstacle);
                
                blueprint.created = true;
                newObstaclesCount++;
            }
        });
        
    }

    /**
     * Créer un obstacle
     * @param {string} type - Type d'obstacle
     * @param {number} lane - Index de la voie
     * @param {number} y - Position Y
     * @returns {Obstacle} - Nouvel obstacle
     */
    createObstacle(type, lane, y) {
        const x = 0;
        
        if (!this.obstacleFactory[type]) {
            console.error("Type d'obstacle inconnu:", type);
            return null;
        }
        
        const obstacle = this.obstacleFactory[type](x, y, lane);
        
        return obstacle;
    }

    /**
     * Mettre à jour les obstacles
     * @param {Array} players - Tableau d'objets joueurs
     * @param {function} addScore - Fonction pour ajouter des points
     */
    update(players, addScore) {
        for (let lane = 0; lane < 2; lane++) {
            this.obstacles[lane].forEach(obstacle => {
                obstacle.update();
                
                if (players[lane].alive) {
                    players[lane].checkCollision(obstacle);
                }
                
            });
            
            const oldObstacleCount = this.obstacles[lane].length;
            this.obstacles[lane] = this.obstacles[lane].filter(obstacle => {
                const keepObstacle = obstacle.position.y > players[lane].position.y - this.preGenerationDistance &&
                                    obstacle.position.y < players[lane].position.y + this.cleanupDistance;
                
                return keepObstacle;
            });
            
            
            this.createVisibleObstacles(lane, players[lane].position.y);
        }
    }

    /**
     * Dessiner les obstacles et les étoiles
     * @param {CanvasRenderingContext2D} ctx - Contexte du canevas
     * @param {number} cameraY - Position Y de la caméra
     */
    draw(ctx, cameraY) {
        for (let lane = 0; lane < 2; lane++) {
            this.obstacles[lane].forEach(obstacle => {
                if (this.isOnScreen(obstacle, cameraY)) {
                    obstacle.draw(ctx);
                }
            });
        }
    }

    /**
     * Vérifier si une entité est à l'écran
     * @param {Object} entity - Entité avec position
     * @param {number} cameraY - Position Y de la caméra
     * @returns {boolean} - Si l'entité est à l'écran
     */
    isOnScreen(entity, cameraY) {
        return entity.position.y > cameraY - 100 &&
               entity.position.y < cameraY + window.innerHeight + 100;
    }

    
}