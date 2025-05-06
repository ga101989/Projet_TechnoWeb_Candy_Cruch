/**
 * Gestionnaire de couleurs
 * Gère les transitions de couleurs et les fonctionnalités liées aux couleurs
 */
class ColorManager {
    constructor() {
        this.colorNames = {
            "#FF6B6B": "Rouge",
            "#4ECDC4": "Turquoise",
            "#FFE66D": "Jaune",
            "#AC6CFF": "Violet"
        };
        
        this.colors = {
            RED: "#FF6B6B",
            TURQUOISE: "#4ECDC4",
            YELLOW: "#FFE66D",
            VIOLET: "#AC6CFF"
        };
        
        this.colorArray = [
            this.colors.RED,
            this.colors.TURQUOISE,
            this.colors.YELLOW,
            this.colors.VIOLET
        ];
        
        this.transitionSteps = 10;
        this.transitionSpeed = 16;
    }

    /**
     * Obtenir la couleur suivante dans le cycle
     * @param {string} currentColor - Couleur actuelle
     * @returns {string} - Couleur suivante
     */
    getNextColor(currentColor) {
        const currentIndex = this.colorArray.indexOf(currentColor);
        if (currentIndex === -1) {
            return this.colorArray[0];
        }
        
        const nextIndex = (currentIndex + 1) % this.colorArray.length;
        return this.colorArray[nextIndex];
    }

    /**
     * Obtenir une couleur aléatoire de la palette
     * @param {string} [excludeColor] - Couleur à exclure de la sélection
     * @returns {string} - Couleur aléatoire
     */
    getRandomColor(excludeColor) {
        let availableColors = [...this.colorArray];
        
        if (excludeColor) {
            availableColors = availableColors.filter(color => color !== excludeColor);
            
            if (availableColors.length === 0) {
                return this.colors.YELLOW;
            }
        }
        
        const randomIndex = Math.floor(Math.random() * availableColors.length);
        const selectedColor = availableColors[randomIndex];
        return selectedColor;
    }

    /**
     * Obtenir le nom d'une couleur pour le débogage
     * @param {string} color - Couleur au format hex
     * @returns {string} - Nom de la couleur
     */
    getColorName(color) {
        return this.colorNames[color] || "Inconnue";
    }

    /**
     * Faire la transition de la couleur d'un joueur vers une nouvelle couleur
     * @param {Player} player - Joueur à transiter
     * @param {string} newColor - Couleur cible
     * @returns {Promise} - Promesse qui se résout lorsque la transition est terminée
     */
    transitionColor(player, newColor) {
        player.color = newColor;
        return Promise.resolve();
        
    }

    /**
     * Interpoler entre deux couleurs
     * @param {string} startColor - Couleur de départ (hex)
     * @param {string} endColor - Couleur de fin (hex)
     * @param {number} t - Facteur d'interpolation (0-1)
     * @returns {string} - Couleur interpolée (hex)
     */
    lerpColor(startColor, endColor, t) {
        const startRGB = this.hexToRgb(startColor);
        const endRGB = this.hexToRgb(endColor);
        
        const startHSL = this.rgbToHsl(startRGB.r, startRGB.g, startRGB.b);
        const endHSL = this.rgbToHsl(endRGB.r, endRGB.g, endRGB.b);
        
        const h = this.lerp(startHSL.h, endHSL.h, t);
        const s = this.lerp(startHSL.s, endHSL.s, t);
        const l = this.lerp(startHSL.l, endHSL.l, t);
        
        const rgb = this.hslToRgb(h, s, l);
        
        return this.rgbToHex(rgb.r, rgb.g, rgb.b);
    }

    /**
     * Interpolation linéaire entre deux valeurs
     * @param {number} a - Valeur de départ
     * @param {number} b - Valeur de fin
     * @param {number} t - Facteur d'interpolation (0-1)
     * @returns {number} - Valeur interpolée
     */
    lerp(a, b, t) {
        return a + (b - a) * t;
    }

    /**
     * Convertir une couleur hex en RVB
     * @param {string} hex - Code couleur hex
     * @returns {Object} - Objet couleur RVB
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    /**
     * Convertir RVB en couleur hex
     * @param {number} r - Composante rouge (0-255)
     * @param {number} g - Composante verte (0-255)
     * @param {number} b - Composante bleue (0-255)
     * @returns {string} - Code couleur hex
     */
    rgbToHex(r, g, b) {
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    /**
     * Convertir RVB en TSL
     * @param {number} r - Composante rouge (0-255)
     * @param {number} g - Composante verte (0-255)
     * @param {number} b - Composante bleue (0-255)
     * @returns {Object} - Objet couleur TSL
     */
    rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            
            h /= 6;
        }

        return { h, s, l };
    }

    /**
     * Convertir TSL en RVB
     * @param {number} h - Teinte (0-1)
     * @param {number} s - Saturation (0-1)
     * @param {number} l - Luminosité (0-1)
     * @returns {Object} - Objet couleur RVB
     */
    hslToRgb(h, s, l) {
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }
}

const colorManager = new ColorManager();