export default class Menu {
    constructor(onStartCallback) { // Menu de démarrage du jeu
      this.menu = document.getElementById("menu");
      this.canvas = document.getElementById("gameCanvas");
      this.nameInput = document.getElementById("playerName");
      this.startButton = document.getElementById("startButton");
      this.scoreButton = document.getElementById("scoreButton");
      this.helpButton = document.getElementById("helpButton");
      this.onStart = onStartCallback;
  
      this.setupListeners();
    }
  
    setupListeners() { // Écouteurs d'événements pour les boutons
      this.startButton.addEventListener("click", () => {
        const playerName = this.nameInput.value.trim();
        if (playerName === "") {
          alert("Veuillez entrer un nom de joueur !");
          return;
        }
        this.hide();
        this.showCanvas();
        this.onStart(playerName);
      });

      this.helpButton.addEventListener("click", () => {
        this.showHelp();
      });

      this.scoreButton.addEventListener("click", () => {
        const elapsedTime = this.game.getElapsedTime();
        if (this.playerName) {
          alert(`Nom du joueur : ${this.playerName}\nTemps de jeu : ${elapsedTime} secondes`);
        } else {
          alert("Aucune partie n'a été jouée !");
        }
      });
    }
  
    showHelp() { // Affiche les règles du jeu
      alert(
        "Règles du jeu :\n" +
        "- Déplacez-vous avec les flèches directionnelles.\n" +
        "- Rapprochez-vous des ennemis pour les attaquer.\n" +
        "- Éliminez les ennemis pour récupérer de l'expérience.\n" +
        "- Améliorez vos compétences lorsque vous montez de niveau.\n" +
        "- Récuperer des fixs qui seront sous les points d'expérience de temps en temps.\n" +
        "- Survivez le plus longtemps possible !"

      );
    }
    
    show() {
      this.menu.style.display = "flex";
      this.canvas.style.display = "none";
    }
  
    hide() {
      this.menu.style.display = "none";
    }
  
    showCanvas() {
      this.canvas.style.display = "block";
    }
  }
  