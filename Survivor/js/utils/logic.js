import meleeEnemy from "../entities/meleeEnemy.js";
import rangeEnemy from "../entities/rangeEnemy.js";
import enemyHealer from "../entities/enemyHealer.js";

export function spawnMeleeEnemySafe(player, minDistance, canvas) {
  let x, y, distance;
  do {
    x = Math.random() * canvas.width;
    y = Math.random() * canvas.height;
    distance = Math.hypot(x - player.x, y - player.y);
  } while (distance < minDistance);
  
  return new meleeEnemy(x, y, player, 10, 15); // Ajoute l'ennemie melee
}

export function spawnRangeEnemySafe(player, minDistance, canvas) {
  let x, y, distance;
  do {
    x = Math.random() * canvas.width;
    y = Math.random() * canvas.height;
    distance = Math.hypot(x - player.x, y - player.y);
  } while (distance < minDistance);
  
  return new rangeEnemy(x, y, player, 15, 10, 200); // Ajoute l'ennemie range
}

export function spawnHealerEnemySafe(player, minDistance, canvas) {
  let x, y, distance;
  do {
    x = Math.random() * canvas.width;
    y = Math.random() * canvas.height;
    distance = Math.hypot(x - player.x, y - player.y);
  } while (distance < minDistance);
  
  return new enemyHealer(x, y, player, 5, 20); // Ajoute l'ennemie healer
}

export function findFarthestInjuredEnemy(healer, enemies) {
  let farthestEnemy = null;
  let maxDistance = 0;

  enemies.forEach(enemy => {
    if (enemy !== healer && enemy.health > 0 && enemy.health < enemy.maxHealth) { // Vérifie si l'ennemi est vivant et a besoin de soins
      const distance = Math.hypot(enemy.x - healer.x, enemy.y - healer.y);
      if (distance > maxDistance) { // boucle parmis tous les ennemis pour trouver le plus éloigné
        maxDistance = distance;
        farthestEnemy = enemy;
      }
    }
  });

  return farthestEnemy; // Retourne l'ennemi le plus éloigné qui a besoin de soins
}

  
  


  
  