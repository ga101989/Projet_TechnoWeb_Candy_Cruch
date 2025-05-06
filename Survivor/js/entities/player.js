import Character from "./character.js";
import Projectile from "./projectile.js"; 

export default class Player extends Character {
  constructor(x,y) {
    super(x, y, 15, 3, "black"); // x, y, size, speed, color
    this.xp = 0;
    this.level = 1;
    this.maxHealth = 100; // vie max
    this.health = this.maxHealth; // vie actuelle
    this.damage = 5; // dégâts infligés
    this.fireRate = 400; // cadence de tir (en ms)
    this.lastShotTime = 0; // temps du dernier tir
    this.projectileSpeed = 5; // vitesse des projectiles
    this.invincible = false; // état d'invincibilité
    this.invincibilityDuration = 1000; // durée d'invincibilité (en ms)
    this.collectionRadius = 100; // rayon de collecte des XP
    this.range = 150;
  }
  
  move(input, canvas) {
    if (input["ArrowUp"] && this.y - this.size > 0) this.y -= this.speed;
    if (input["ArrowDown"] && this.y + this.size < canvas.height) this.y += this.speed;
    if (input["ArrowLeft"] && this.x - this.size > 0) this.x -= this.speed;
    if (input["ArrowRight"] && this.x + this.size < canvas.width) this.x += this.speed;
  }
  
  draw(ctx) {
    ctx.save();
  
    if (this.invincible && this.blinking) {
      ctx.globalAlpha = 0.3; // Rendre le joueur semi-transparent lorsqu'il clignote
    } else if (this.invincible) {
      ctx.globalAlpha = 0.7; // Rendre le joueur légèrement transparent lorsqu'il ne clignote pas
    }
  
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  
  takeDamage(amount) {
    this.health -= amount;
  }

  isDead() {
    return this.health <= 0;
  }

  isInvincible() {
    return this.invincible;
  }

  setInvincible(state) {
    this.invincible = state;
  
    if (state) {
      // Activer le clignotement
      this.blinking = true;
      const blinkInterval = setInterval(() => {
        this.blinking = !this.blinking; // Alterne entre visible et semi-transparent
      }, 100); // Change toutes les 100ms pour un effet de clignotement rapide
  
      // Désactiver l'invincibilité après la durée définie
      setTimeout(() => {
        this.invincible = false;
        this.blinking = false; // Arrêter le clignotement
        clearInterval(blinkInterval); // Arrêter l'intervalle
      }, this.invincibilityDuration);
    }
  }
  
  gainXP(amount) {
    this.xp += amount;
    if (this.xp >= this.level * 110) { 
      let xpRemaining = this.xp - (this.level * 110); // XP restante après la montée de niveau
      this.levelUp(xpRemaining);
      return true; // Indique que le joueur a monté de niveau
    }
    return false; // Indique que le joueur n'a pas monté de niveau
  }

  getLevel() {
    return this.level;
  }

  levelUp(xpRemaining) {
    this.level++; // Augmente le niveau du joueur
    this.xp = xpRemaining; // XP restante après la montée de niveau
    console.log("Level up! New level: " + this.level);
  }

  canShoot() {
    const now = Date.now();
    return now - this.lastShotTime >= this.fireRate;
  }

  shoot(target) {
    if (this.canShoot()) {
      this.lastShotTime = Date.now();
      return new Projectile(this.x, this.y, target, 4, "black"); 
    }
    return null;
  }

  onLevelUp() {
    // Arrêtez le jeu et affichez les options d'amélioration
    this.game.pause(); // Méthode pour arrêter le jeu
    this.game.showLevelUpOptions(); // Affiche les options d'amélioration
  }
}
  