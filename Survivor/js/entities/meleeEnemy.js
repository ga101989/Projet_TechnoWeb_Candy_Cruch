import Character from "./character.js";

export default class meleeEnemy extends Character {
  constructor(x, y, target, damage, maxHealth) {
    super(x, y, 15, 1, "red"); // taille, vitesse, couleur
    this.target = target; // cible = joueur
    this.damage = damage; // Dégâts infligés à la cible
    this.maxHealth = maxHealth; // Vie max de l'ennemi
    this.health = this.maxHealth;
    this.lastHealTime = 0; // Temps du dernier soin
    this.isHealing = false; // Indique si l'ennemi est en train de soigner
  }

  update() {
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 0) {
      this.x += (dx / dist) * this.speed;
      this.y += (dy / dist) * this.speed;
    }
  }

  draw(ctx) {
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
    ctx.fillStyle = 'grey'; // couleur de la barre de vie vide

    ctx.fillRect(x, y, barWidth, barHeight);

    const healthRatio = this.health / this.maxHealth;
    ctx.fillStyle = 'red'; // couleur de la barre de vie pleine
    ctx.fillRect(x, y, barWidth * healthRatio, barHeight);

    ctx.strokeStyle = 'black'; // contours
    ctx.strokeRect(x, y, barWidth, barHeight);

    if(this.isHealing) {
      ctx.fillStyle = 'green'; // Couleur de la barre de soin
      ctx.font = 'bold 15px Arial'; // Police de la barre de soin
      ctx.fillText('+', x + barWidth + 5, y); // Texte de la barre de soin
    }
    ctx.restore();
  }

  isDead() {
    return this.health <= 0;
  }

  takeDamage(damage) {
    this.health -= damage;
  }

  heal(amount) {
    const now = Date.now();
    if (now - this.lastHealTime < 10000) {
        return; 
    }
    this.health += amount;
    if (this.health > this.maxHealth) {
        this.health = this.maxHealth; // Ne pas dépasser la vie max
    }
    this.isHealing = true; // Indique que l'ennemi est en train de soigner
    setTimeout(() => {
      this.isHealing = false; // Réinitialise l'état de soin après 5 secondes
    }, 1000); // Durée de soin
  }

}
