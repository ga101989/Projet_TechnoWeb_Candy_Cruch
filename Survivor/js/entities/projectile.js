export default class Projectile {
    constructor(x, y, target, speed, color) {
      this.x = x;
      this.y = y;
      this.size = 4;
      this.speed = speed;
      this.color = color; // couleur par défaut
  
      const dx = target.x - x;
      const dy = target.y - y;
      const length = Math.hypot(dx, dy);
      this.vx = (dx / length) * speed;
      this.vy = (dy / length) * speed;
    }
  
    update() {
      this.x += this.vx;
      this.y += this.vy;
    }
  
    draw(ctx) {
      ctx.save();
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  
    hits(target) { // touche la target
      return (
        this.x < target.x + target.size &&
        this.x + this.size > target.x &&
        this.y < target.y + target.size &&
        this.y + this.size > target.y
      );
    }
  }
  