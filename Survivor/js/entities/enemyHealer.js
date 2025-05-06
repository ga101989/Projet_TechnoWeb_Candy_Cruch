import Character from "./character.js";

export default class enemyHealer extends Character {
  constructor(x, y, target, healing, maxHealth) {
    super(x, y, 15, 0.5, "purple"); // taille, vitesse, couleur
    this.target = target; // cible = joueur
    this.healing = healing; // Dégâts infligés à la cible
    this.maxHealth = maxHealth; // Vie max de l'ennemi
    this.health = this.maxHealth; // Vie actuelle de l'enn
    this.lastHealTime = 0; // Temps du dernier soin
    this.damage = healing / 2; // dégats au contact
  }

  update() { // déplacement de l'ennemi
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 0) {
      this.x -= (dx / dist) * this.speed;
      this.y -= (dy / dist) * this.speed;
    }
  }

  draw(ctx) { // dessinne l'ennemi
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
    ctx.restore();
  }

  drawHealthBar(ctx) { // dessinne la barre de vie de l'ennemi
    const barWidth = this.size * 2 * 0.9; 
    const barHeight = 5;
    const x = this.x - this.size + 2;
    const y = this.y - this.size - 10;

    ctx.save();
    ctx.fillStyle = 'grey';

    ctx.fillRect(x, y, barWidth, barHeight);

    const healthRatio = this.health / this.maxHealth;
    ctx.fillStyle = 'red';
    ctx.fillRect(x, y, barWidth * healthRatio, barHeight);

    ctx.strokeStyle = 'black';
    ctx.strokeRect(x, y, barWidth, barHeight);
    ctx.restore();
  }

  isDead() {
    return this.health <= 0;
  }

  takeDamage(damage) {
    this.health -= damage;
  }

  heal(amount) { // se soigne grâce aux enemyHealers 
    const now = Date.now();
    if (now - this.lastHealTime < 9000) {
        return; // Ne pas soigner si moins de 5 secondes se sont écoulées depuis le dernier soin
    }
    this.health += amount;
    if (this.health > this.maxHealth) {
        this.health = this.maxHealth; // Ne pas dépasser la vie max
    }
  }

}
