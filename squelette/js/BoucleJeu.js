import Grille from "./grille.js";

// 1 On définit une sorte de "programme principal"
// le point d'entrée du code qui sera appelée dès que la
// page ET SES RESSOURCES sont chargées

window.onload = init;

let grille;

function init() {
  console.log("Page et ressources prêtes à l'emploi");
  // appelée quand la page et ses ressources sont prêtes.
  // On dit aussi que le DOM est ready (en fait un peu plus...)

  grille = new Grille(9, 9, 6);
  //grille.verifierGrille();
  grille.showCookies();
  
  document.getElementById('alignements').addEventListener('click', () => {
    grille.verifierGrille(); 
    grille.highlightAlignments();
  });
}


