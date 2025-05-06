import Player from "../entities/player.js";

export default class Game {
  constructor(canvas, name) {
    this.name = name;
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    // constructeur de Player : x, y, size, speed, color
    this.player = new Player(canvas.width / 2, canvas.height / 2);
    this.enemies = [];
    this.projectiles = [];
    this.xpCrystals = [];
    this.fixs = [];
    this.input = {};
    this.startTime = Date.now();
    this.isPaused = false;
  }

  reset() {
    this.enemies = []; // Réinitialiser les ennemis
    this.projectiles = []; // Réinitialiser les projectiles
    this.xpCrystals = [];   // Réinitialiser les cristaux d'XP
    this.fixs = []; // Réinitialiser les fixs
    this.player.health = this.player.maxHealth;
    this.player.x = this.canvas.width / 2;
    this.player.y = this.canvas.height / 2;
    this.player.xp = 0; // Réinitialiser l'XP
    this.player.level = 1;  // Réinitialiser le niveau
    this.player.invincible = false; // Réinitialiser l'état d'invincibilité
    this.player.maxHealth = 100; // Réinitialiser la vie maximale
    this.player.health = this.player.maxHealth; // Réinitialiser la vie actuelle
    this.player.damage = 5; // Réinitialiser les dégâts
    this.player.fireRate = 400; // Réinitialiser la cadence de tir
    this.player.lastShotTime = 0; // Réinitialiser le temps du dernier tir
    this.player.projectileSpeed = 5; // Réinitialiser la vitesse des projectiles
    this.player.collectionRadius = 100; // Réinitialiser le rayon de collecte des XP
    this.player.range = 150; // Réinitialiser la portée
    this.player.speed = 3; // Réinitialiser la vitesse
  }
}
