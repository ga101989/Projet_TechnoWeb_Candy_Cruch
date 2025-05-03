import Grille from "./grille.js";

// 1 On définit une sorte de "programme principal"
// le point d'entrée du code qui sera appelée dès que la
// page ET SES RESSOURCES sont chargées

window.onload = init;

let grille;
let temps = 60;
let intervalId;

let tempsParNiveau = 60;


function init() {
  console.log("Page et ressources prêtes à l'emploi");
  // appelée quand la page et ses ressources sont prêtes.
  // On dit aussi que le DOM est ready (en fait un peu plus...)

  grille = new Grille(9, 9, 6);
  //grille.verifierGrille();
  grille.showCookies();

  // Nettoyage initial de la grille
  setTimeout(nettoyerGrilleInit, 100);
  
  //demarrerChronometre();
  CompteARebours();
  
  document.getElementById('alignements').addEventListener('click', () => {
    grille.verifierGrille(); 
    grille.highlightAlignments();
  });
}

function CompteARebours() {
  intervalId = setInterval(() => {
    temps--;
    document.querySelector("#infos div:nth-child(1)").textContent = `Temps : ${temps}`;
    
    if (temps <= 0) {
      clearInterval(intervalId);
      FinDuJeu();
    }
  }, 1000);
}

function FinDuJeu() {

  const overlay = document.getElementById("overlay-niveau");
  overlay.textContent = "Temps écoulé ! Partie terminée.";
  overlay.classList.add("visible");

  setTimeout(() => {
    overlay.classList.remove("visible");
  }, 5000);

  grille.TabCookieEnCours = [];
  document.querySelectorAll("#grille img").forEach(img => {
    img.onclick = null;
    img.ondragstart = null;
    img.ondrop = null;
  });
}

function demarrerChronometre() {
  intervalId = setInterval(() => {
    temps++;
    document.querySelector("#infos div:nth-child(1)").textContent = `Temps : ${temps}`;
  }, 1000);
}

function nettoyerGrilleInit() {
  /** 
  grille.detectionAlignements();

  let aSupprimer = grille.tabCookies.flat().some(cookie => cookie.alignement);
  
  while (aSupprimer) {
    grille.supprimerAlignements();
    setTimeout(() => {
      grille.faireDescendreCookies();
    }, 1000);
    //grille.faireDescendreCookies();
    //grille.detectionAlignements();
    aSupprimer = grille.tabCookies.flat().some(cookie => cookie.alignement);
    document.querySelector("#infos div:nth-child(2)").textContent = "Score : 0";
  }
  */
  grille.supprimeEnCascade(() => {
    grille.score = 0;
    grille.majScore(0); // met à jour l'affichage sans ajouter de points
  });
}


