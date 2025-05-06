export function drawPlayerHealthBar(ctx, player) { // Dessine la barre de vie du joueur
  const barWidth = 150;
  const barHeight = 17;
  const x = 20;
  const y = 20;

  ctx.save();
  
  ctx.fillStyle = 'gray';
  ctx.fillRect(x, y, barWidth, barHeight);
  
  if (player.health <= 0) {
    ctx.fillStyle = 'black'; // Color for dead player
    ctx.fillRect(x, y, barWidth, barHeight);
    ctx.restore();
    return;
  }
  const healthRatio = player.health / player.maxHealth;
  ctx.fillStyle = 'green';
  ctx.fillRect(x, y, barWidth * healthRatio, barHeight);

  ctx.font = 'bold 15px Arial';
  ctx.fillStyle = 'green'; // Text color
  ctx.fillText(`HP: ${Math.floor(player.health)}`, x + barWidth + 5, y + barHeight - 2); // Display health value
  
  ctx.strokeStyle = 'black';
  ctx.strokeRect(x, y, barWidth, barHeight);

  ctx.restore();
}

export function drawExperienceBar(ctx, player) { // Dessine la barre d'expérience du joueur
  const barWidth = 150;
  const barHeight = 17;
  const x = 20;
  const y = 50;

  ctx.save();
  
  ctx.fillStyle = 'gray';
  ctx.fillRect(x, y, barWidth, barHeight);
  
  const xpRatio = player.xp / (player.level * 110);
  ctx.fillStyle = 'blue';
  ctx.fillRect(x, y, barWidth * xpRatio, barHeight);

  ctx.font = 'bold 15px Arial';
  ctx.fillStyle = 'blue'; // Text color
  ctx.fillText(`LvL: ${player.level}`, x + barWidth + 5, y + barHeight - 2); // Display XP value
  
  ctx.strokeStyle = 'black';
  ctx.strokeRect(x, y, barWidth, barHeight);

  ctx.restore();
}




  