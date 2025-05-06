/**
 * Gestionnaire d'entrées
 * Gère les entrées clavier pour les deux joueurs
 */
class InputHandler {
    constructor() {
        this.keys = {
            player1Jump: false,  // Touche Espace
            player2Jump: false   // Touche Entrée
        };
        
        this.keyCodes = {
            SPACE: 'Space',
            ENTER: 'Enter'
        };
        
        this.setupEventListeners();
    }

    /**
     * Configurer les écouteurs d'événements clavier
     */
    setupEventListeners() {
        window.addEventListener('keydown', (event) => {
            switch (event.code) {
                case this.keyCodes.SPACE:
                    this.keys.player1Jump = true;
                    break;
                case this.keyCodes.ENTER:
                    this.keys.player2Jump = true;
                    break;
            }
        });
        
        window.addEventListener('keyup', (event) => {
            switch (event.code) {
                case this.keyCodes.SPACE:
                    this.keys.player1Jump = false;
                    break;
                case this.keyCodes.ENTER:
                    this.keys.player2Jump = false;
                    break;
            }
        });
    }

    /**
     * Vérifier si une touche spécifique est pressée
     * @param {string} key - Touche à vérifier
     * @returns {boolean} - Si la touche est pressée
     */
    isKeyPressed(key) {
        return this.keys[key];
    }

    /**
     * Réinitialiser tous les états des touches
     */
    reset() {
        for (const key in this.keys) {
            this.keys[key] = false;
        }
    }

    /**
     * Gérer l'entrée du joueur pour un joueur spécifique
     * @param {Player} player - Joueur pour lequel gérer l'entrée
     * @param {number} playerIndex - Index du joueur (0 pour joueur 1, 1 for joueur 2)
     */
    handlePlayerInput(player, playerIndex) {
        if (playerIndex === 0 && this.keys.player1Jump && player.canJump) {
            player.jump();
            player.canJump = false;
        } else if (playerIndex === 1 && this.keys.player2Jump && player.canJump) {
            player.jump();
            player.canJump = false;
        }
        
        if (playerIndex === 0 && !this.keys.player1Jump) {
            player.canJump = true;
        } else if (playerIndex === 1 && !this.keys.player2Jump) {
            player.canJump = true;
        }
    }
}

const inputHandler = new InputHandler();