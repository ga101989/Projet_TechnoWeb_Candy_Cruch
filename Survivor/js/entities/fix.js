export default class fix {
    constructor(body, target) {
      this.x = body.x;
      this.y = body.y;
      this.size = 10;
      this.value = 10; 
      this.speed = 15;
      this.target = target; 
    }
    
    draw(ctx) { // dessine le fix au même endroit que l'experience
        ctx.save();
        ctx.fillStyle = 'orange';
        ctx.translate(this.x, this.y);
        ctx.rotate(Math.PI / 4);
        ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
        ctx.restore();
    }
  
    update() { // Déplacement du fix vers le joueur
      const distance = Math.hypot(this.target.x - this.x, this.target.y - this.y);
  
      if (distance < this.target.collectionRadius) {
        // Déplacement vers le joueur
        const dx = this.target.x - this.x;
        const dy = this.target.y - this.y;
        const magnitude = Math.hypot(dx, dy);
        this.x += (dx / magnitude) * this.speed;
        this.y += (dy / magnitude) * this.speed;
      }
    }
  }
    