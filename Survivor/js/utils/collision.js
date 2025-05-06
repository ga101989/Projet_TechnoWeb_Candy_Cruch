export function collisionBetweenRects(a, b) { // Vérifie si deux rectangles se chevauchent, fait avec IA
  return (
    a.x + a.size >= b.x - b.size && // Right side of A collides with left side of B
    a.x - a.size <= b.x + b.size && // Left side of A collides with right side of B
    a.y + a.size >= b.y - b.size && // Bottom side of A collides with top side of B
    a.y - a.size <= b.y + b.size    // Top side of A collides with bottom side of B
  );
}
  
export function handleEnemyCollision(enemies) { // Gère la collision entre les ennemis
  for (let i = 0; i < enemies.length; i++) {
    for (let j = i + 1; j < enemies.length; j++) {
      const a = enemies[i];
      const b = enemies[j];
  
      repulse(b, a); // repousse les ennemis pour éviter le chevauchement
    }
  }
}


export function handleProjectileCollision(projectiles, enemies, player) { // Gère la collision entre les projectiles et les ennemis
  for (let i = projectiles.length - 1; i >= 0; i--) {
    const projectile = projectiles[i];
  
    for (let j = 0; j < enemies.length; j++) {
      const enemy = enemies[j];
  
      if (collisionBetweenRects(projectile, enemy) && projectile.color === "black") {
        enemy.takeDamage(player.damage); // Le joueur inflige des dégâts à l'ennemi
        projectiles.splice(i, 1); // Retire le projectile
        break;
      }
    }
    // Vérifier la collision avec le joueur
    if (collisionBetweenRects(projectile, player) && projectile.color === "yellow") {
      const enemy = { damage: 10 }; // Déclare une valeur par défaut pour les dégâts de l'ennemi
      if (!player.isInvincible()) { // Si le joueur n'est pas invincible
        player.takeDamage(enemy.damage); 
        player.setInvincible(true); // Rendre le joueur temporairement invincible
        console.log(`Joueur touché par un projectile ennemi ! ${enemy.damage} `);
      }
      projectiles.splice(i, 1); // Retire le projectile
    }
  }
}

export function handleXPCollection(xpCrystals, player) { // Gère la collecte des cristaux d'XP
  const condition = false;
  for (let i = xpCrystals.length - 1; i >= 0; i--) {
    const xpCrystal = xpCrystals[i];
  
    if (collisionBetweenRects(player, xpCrystal)) {
      const condition = player.gainXP(xpCrystal.value); // Augmente l'XP du joueur
      xpCrystals.splice(i, 1); // Retire le cristal XP
      return condition; // Retourne la condition pour savoir si le joueur a monté de niveau
    }
  }
  return condition;
}

export function handleFixCollection(fixs, player) { // Gère la collecte des fixs
  for (let i = fixs.length - 1; i >= 0; i--) {
    const fix = fixs[i];
  
    if (collisionBetweenRects(player, fix)) {
      player.health += fix.value; // Augmente la vie du joueur
      if (player.health > player.maxHealth) {
        player.health = player.maxHealth; // Limite la vie à la vie maximale
      }
      fixs.splice(i, 1); // Retire le fix
    }
  }
}

export function handlePlayerEnemyCollision(player, enemies) { // Gère la collision entre le joueur et les ennemis
  for (let i = 0; i < enemies.length; i++) {
    const enemy = enemies[i];
  
    if (collisionBetweenRects(player, enemy)) {
      repulse(enemy, player); // Repousse l'ennemi et le joueur
      if (player.isInvincible()) { console.log("Joueur invinsible"); return;} // Si le joueur est invincible, ne pas infliger de dégâts
      player.takeDamage(enemy.damage); // Le joueur subit des dégâts
      player.setInvincible(true);
      break;
    }
  }
}

export function handleEnemyBorderCollision(enemies, canvas) { // Gère la collision entre les ennemis et les bords du canvas
  enemies.forEach(enemy => {
    if (enemy.x - enemy.size < 0) {
      enemy.x = enemy.size; // Empêche l'ennemi de sortir par la gauche
    } else if (enemy.x + enemy.size > canvas.width) {
      enemy.x = canvas.width - enemy.size; // Empêche l'ennemi de sortir par la droite
    }
    if (enemy.y - enemy.size < 0) {
      enemy.y = enemy.size; // Empêche l'ennemi de sortir par le haut
    } else if (enemy.y + enemy.size > canvas.height) {
      enemy.y = canvas.height - enemy.size; // Empêche l'ennemi de sortir par le bas
    }
  });
}

function repulse(b, a) { // Repousse les ennemis pour éviter le chevauchement moitié IA moitié fait main
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  const minDist = a.size + b.size;

  if (dist < minDist && dist !== 0) {
    // Repousse les deux ennemis pour qu’ils ne se chevauchent pas
    const overlap = (minDist - dist) / 2;
    const nx = dx / dist;
    const ny = dy / dist;

    a.x -= nx * overlap;
    a.y -= ny * overlap;
    b.x += nx * overlap;
    b.y += ny * overlap;
  }
}
