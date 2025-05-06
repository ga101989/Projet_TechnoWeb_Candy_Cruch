import Game from "./game.js";
import { drawPlayerHealthBar, drawExperienceBar} from "../interface/ui.js";
import { spawnMeleeEnemySafe, spawnRangeEnemySafe, spawnHealerEnemySafe, findFarthestInjuredEnemy } from "../utils/logic.js";
import { handleEnemyCollision, handlePlayerEnemyCollision, handleProjectileCollision, handleEnemyBorderCollision, handleFixCollection} from "../utils/collision.js";
import { } from "../utils/logic.js";
import { handleXPCollection } from "../utils/collision.js";
import XP from "../entities/xp.js";
import fix from "../entities/fix.js";

export default class GameManager {
  constructor(canvas) {
    this.canvas = canvas;
    const name = document.getElementById("playerName").value;
    this.game = new Game(canvas,name);
    this.animationFrame = null;
    this.lastTime = 0;

    window.addEventListener("keydown", e => this.game.input[e.key] = true);
    window.addEventListener("keyup", e => this.game.input[e.key] = false);
  }

  update() { /* gére les entrées de personnages, de projectiles
              * et de cristaux d'XP, ainsi que les collisions entre eux.
              * Permet aussi la logique du jeu, comme le spawn d'ennemis 
              * et la gestion de la vie du joueur.
              * Gére la gestion de la visée du joueur sur l'ennemi le plus proche.
              * Mets en place la mise à niveau du joueur
              * */   
    const { player, enemies, projectiles, xpCrystals, fixs, input, canvas } = this.game;

    // const currentTime = (Date.now() - this.startTime) / 1000;
    // console.log("Time elapsed: " + currentTime + " seconds");

    if (player.isDead()) {
      this.game.isPaused = true; // Mettre le jeu en pause
      this.stopGame(this.game.name); // Arrête le jeu si le joueur est mort
      return;
    }

    console.log(`${player.speed}`);

    player.move(input, canvas);

    const healerCount = enemies.filter(enemy => enemy.color === "purple").length;
    const maxHealers = 5;
    const timeBasedLimit = 6 + Math.floor((Date.now() - this.game.startTime) / 18000) * 2;

    if (enemies.length < timeBasedLimit) {
      enemies.push(spawnRangeEnemySafe(player, 300, canvas));
      enemies.push(spawnMeleeEnemySafe(player, 150, canvas));
      if (healerCount < maxHealers) {
      enemies.push(spawnHealerEnemySafe(player, 300, canvas));
      }
    }

    for (let i = enemies.length - 1; i >= 0; i--) {
      if (enemies[i].isDead()) {
        // Chance de laisser un cristal d'expérience
        if (Math.random() < 0.8) { // 80% de chance
          xpCrystals.push(new XP(enemies[i], player)); // Crée un cristal d'XP à la position de l'ennemi
        }
        if (Math.random() < 0.05) { // 5% de chance de laisser un cristal d'XP
          fixs.push(new fix(enemies[i],player));
         } 
        enemies.splice(i, 1); // Supprime l'ennemi mort
      }
    }

    let closestEnemy = null;
    let minDistance = player.range;

    enemies.forEach(enemy => {
      const distance = Math.hypot(enemy.x - player.x, enemy.y - player.y);
      if (distance < minDistance) { // permet de trouver l'ennemie le plus proche
        minDistance = distance;
        closestEnemy = enemy;
      }
      if (enemy.shootProjectile) { // Vérifie si l'ennemi peut tirer un projectile
        const enemyProjectile = enemy.shootProjectile(player);
        if (enemyProjectile) {
          projectiles.push(enemyProjectile);
        }
      }
      
      if (enemy.color === "purple") { // ennemie guérisseur
        const now = Date.now();
        if (now - enemy.lastHealTime >= 20000) { // Vérifie si le cooldown est terminé
          const farthestInjuredEnemy = findFarthestInjuredEnemy(enemy, enemies);
          if (farthestInjuredEnemy && farthestInjuredEnemy.health > 0) { // Vérifie que l'ennemi est vivant
            enemy.lastHealTime = now; // Met à jour le dernier moment de soin
            farthestInjuredEnemy.heal(enemy.healing); // Soigne l'allié
            farthestInjuredEnemy.healAnimationTime = 1000; // Affiche l'animation de soin pendant 1 seconde
            enemy.healAnimationTime = 1000; // Affiche l'animation de soin pour le guérisseur
          }
        }
      }
    });

    if (closestEnemy) { // Si un ennemi est trouvé dans la portée
      const projectile = player.shoot(closestEnemy);
      if (projectile) {
        projectiles.push(projectile); // on ajoute un projectile à la liste des projectiles
      }
    }

    handleEnemyCollision(enemies);
    handlePlayerEnemyCollision(player, enemies);
    handleProjectileCollision(projectiles, enemies, player);
    handleEnemyBorderCollision(enemies, canvas);
    const lvlUp = handleXPCollection(xpCrystals, player);
    handleFixCollection(fixs, player);

    // Mise à jour des entités
    enemies.forEach(e => e.update());
    projectiles.forEach(p => p.update());
    xpCrystals.forEach(xp => xp.update());
    fixs.forEach(f => f.update());

    // Vérification de la mise à niveau du joueur
    if (lvlUp) {
      this.pause(); // Arrête le jeu
      if (this.game.isPaused){
        this.showLevelUpOptions(player);
      }
    }
  }
 
  draw() {
    const { ctx } = this.game;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const { player, enemies, projectiles, xpCrystals, fixs } = this.game;
    
    // Dessiner le jeu en boucle
    player.draw(ctx);
    enemies.forEach(e => e.draw(ctx));
    enemies.forEach(e => e.drawHealthBar(ctx));
    projectiles.forEach(p => p.draw(ctx));
    fixs.forEach(f => f.draw(ctx));
    xpCrystals.forEach(xp => xp.draw(ctx));

    // Dessiner les barres de vie et d'expérience
    drawPlayerHealthBar(ctx, player);
    drawExperienceBar(ctx, player);
  }

  loop(currentTime = 0) { // Ajoutez un paramètre pour le temps actuel
    if (this.game.isPaused) {
      return;
    }
  
    const deltaTime = (currentTime - this.lastTime) / 1000; // Temps écoulé en secondes
    this.lastTime = currentTime; // Mettez à jour le temps de la dernière frame
  
    this.update(deltaTime); // Passez le delta time à la méthode update
    this.draw();
  
    this.animationFrame = requestAnimationFrame((time) => this.loop(time)); // Passez le temps actuel
  }
  
  loop() { // Boucle principale du jeu
    if (this.game.isPaused) {
      return;
    }
    this.update();
    this.draw();
    this.animationFrame = requestAnimationFrame(() => this.loop());
  }  

  stopGame(name) {
    // Arrêter la boucle du jeu
    cancelAnimationFrame(this.animationFrame);
  
    // Calculer le temps écoulé
    const elapsedTime = Math.floor((Date.now() - this.game.startTime) / 1000);
    document.getElementById("game-time").textContent = `Partie de ${name} a durée: ${elapsedTime} secondes`;
    // Afficher le panneau de fin de partie
    const gameOverPanel = document.getElementById("game-over-panel");
    gameOverPanel.style.display = "block";

    let scores = JSON.parse(localStorage.getItem("scoresCubeInvasion")) || [];
    scores.push({ nom: name, time: elapsedTime });
    localStorage.setItem("scoresCubeInvasion", JSON.stringify(scores));
  
    // Ajouter un gestionnaire pour redémarrer le jeu
    document.getElementById("restart-button").onclick = () => {
      gameOverPanel.style.display = "none";
      const newName = document.getElementById("newGameName").value;
      while(newName === "") {
        alert("Veuillez entrer un nom de jeu !");
        break;
      }
      this.game.reset(document.getElementById("newGameName").value);
      this.start();
    };
  }

  start() {
    this.game.isPaused = false; // Réinitialiser l'état de pause
    this.loop();
  }  

  pause() {
    console.log(`pause : ${this.animationFrame}`); // Afficher la référence de l'animation
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame); // Arrête la boucle d'animation
      this.animationFrame = null; // Réinitialise la référence
    }
    this.game.isPaused = true; // Mettre le jeu en pause
  }

  showLevelUpOptions(player) { // Affiche les options de mise à niveau
    console.log("Level up options displayed. Input state:", this.game.input);
    const levelUpPanel = document.createElement("div");
    levelUpPanel.id = "level-up-panel";
    levelUpPanel.style.position = "absolute";
    levelUpPanel.style.top = "50%";
    levelUpPanel.style.left = "50%";
    levelUpPanel.style.transform = "translate(-50%, -50%)";
    levelUpPanel.style.background = "rgba(0, 0, 0, 0.8)";
    levelUpPanel.style.color = "white";
    levelUpPanel.style.padding = "20px";
    levelUpPanel.style.borderRadius = "10px";
    levelUpPanel.style.textAlign = "center";
    levelUpPanel.innerHTML = `
      <h1>Level Up!</h1> 
      <p>Choose an upgrade:</p>
      <div style="display: flex; flex-wrap: wrap; justify-content: center; gap: 10px;">
      <button id="increase-health" style="flex: 1 1 30%; padding: 10px; background: orange; color: white; border: none; border-radius: 5px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;">Increase Max Health</button>
      <button id="increase-damage" style="flex: 1 1 30%; padding: 10px; background: orange; color: white; border: none; border-radius: 5px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;">Increase Damage</button>
      <button id="increase-speed" style="flex: 1 1 30%; padding: 10px; background: orange; color: white; border: none; border-radius: 5px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;">Increase Speed</button>
      <button id="increase-attack-speed" style="flex: 1 1 30%; padding: 10px; background: orange; color: white; border: none; border-radius: 5px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;">Increase Attack Speed</button>
      <button id="increase-range" style="flex: 1 1 30%; padding: 10px; background: orange; color: white; border: none; border-radius: 5px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;">Increase Range</button>
      <button id="increase-collection-range" style="flex: 1 1 30%; padding: 10px; background: orange; color: white; border: none; border-radius: 5px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3); cursor: pointer; transition: transform 0.2s, box-shadow 0.2s;">Increase Collection Range</button>
      </div>
    `;

    // Add hover effect for buttons
    const buttons = levelUpPanel.querySelectorAll("button");
    buttons.forEach(button => {
      button.addEventListener("mouseover", () => {
      button.style.transform = "translateY(-3px)";
      button.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.4)";
      });
      button.addEventListener("mouseout", () => {
      button.style.transform = "translateY(0)";
      button.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.3)";
      });
    });
    document.body.appendChild(levelUpPanel);

    // Ajoutez un gestionnaire d'événements pour les entrées au clavier

    window.addEventListener("keydown", e => {
      if (this.game.isPaused) return; // Ignore les entrées si le jeu est en pause
      this.game.input[e.key] = true;
    });
    
    window.addEventListener("keyup", e => {
      if (this.game.isPaused) return; // Ignore les entrées si le jeu est en pause
      this.game.input[e.key] = false;
    });
  
    // Ajoutez des gestionnaires pour les boutons
    document.getElementById("increase-health").onclick = () => {
      player.maxHealth += 10; // Augmente la santé maximale
      player.health += 10; // Restaure la santé
      this.resume();
    };
  
    document.getElementById("increase-damage").onclick = () => {
      player.damage += 2.5;
      this.resume();
    };
  
    document.getElementById("increase-speed").onclick = () => {
      player.speed += 1;
      this.resume();
    };

    document.getElementById("increase-attack-speed").onclick = () => {
      player.fireRate -= 50;
      this.resume();
    };

    document.getElementById("increase-range").onclick = () => {
      player.range += 25;
      this.resume();
    };

    document.getElementById("increase-collection-range").onclick = () => {
      player.collectionRadius += 50;
      this.resume();
    };
  }

  resume() { // Permet la reprise du jeu après la mise à niveau
    const levelUpPanel = document.getElementById("level-up-panel");
    if (levelUpPanel) {
      levelUpPanel.remove();
    }
    this.game.isPaused = false;
    this.loop(); // ← suffisant
  }
  

}
