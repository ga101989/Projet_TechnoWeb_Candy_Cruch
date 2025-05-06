import Menu from "./game/menu.js";
import GameManager from "./game/gameManager.js";

const canvas = document.getElementById("gameCanvas");

const menu = new Menu(() => { // Callback pour démarrer le jeu en commençant avec le menu
  const gameManager = new GameManager(canvas);
  gameManager.start();
});
