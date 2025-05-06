import Character from "./character.js";
import Projectile from "./projectile.js"; // Assurez-vous que le chemin est correct

export default class rangeEnemy extends Character {
  constructor(x, y, target, damage, maxHealth, range) {
    super(x, y, 15, 0.5, "yellow"); // taille, vitesse, couleur
    this.target = target; // cible = joueur
    this.damage = damage; // Dégâts infligés à la cible
    this.maxHealth = maxHealth; // Vie max de l'ennemi
    this.health = this.maxHealth; 
    this.lastShotTime = 0; // temps du dernier tir
    this.range = range; // portée de tir
    this.lastHealTime = 0;
    this.isHealing = false; // Indique si l'ennemi est en train de soigner
  }

update() {
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > this.range) {
        // Se rapproche de la cible
        const angle = Math.atan2(dy, dx);
        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;
    } else {
        // Tire sur la cible
        const projectile = this.shootProjectile(this.target);
        if (projectile) {
            // Ajoutez le projectile à une liste de projectiles si nécessaire
        }

        // Recule un peu après avoir tiré
        const angle = Math.atan2(dy, dx);
        this.x -= Math.cos(angle) * this.speed;
        this.y -= Math.sin(angle) * this.speed;
    }
}

  draw(ctx) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x - this.size, this.y - this.size, this.size * 2, this.size * 2);
    ctx.restore();
  }

  drawHealthBar(ctx) {
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

  
  shootProjectile(target) {
    const now = Date.now();
    const distance = Math.hypot(target.x - this.x, target.y - this.y);
      
    // Vérifiez si le joueur est à portée
    if (distance <= this.range  && now - this.lastShotTime >= 2500) {
      this.lastShotTime = now;
      // Crée un projectile dirigé vers le joueur
      return new Projectile(this.x, this.y, target, 2, "yellow");
    }
    return null;
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
