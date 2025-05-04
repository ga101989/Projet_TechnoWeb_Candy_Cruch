import Grille from "./grille.js";
export { afficherPodium };

window.onload = () => {
  document.getElementById("overlay-start").classList.add("visible");

  afficherPodium();

  document.getElementById("btn-regles").addEventListener("click", () => {
    document.getElementById("overlay-regles").classList.add("active");
  });
  
  document.getElementById("btn-fermer-regles").addEventListener("click", () => {
    document.getElementById("overlay-regles").classList.remove("active");
  });
  

  document.getElementById("btn-jouer").addEventListener("click", () => {

    const nom = document.getElementById("player-name").value.trim();

    const scores = JSON.parse(localStorage.getItem("scoresCandy")) || [];
    const nomsExistants = scores.map(e => e.nom.toLowerCase());

    if (!nom) {
      document.querySelector("#overlay-start input#player-name").style.backgroundColor = "red";
      document.querySelector("#overlay-start input#player-name").style.color = "white";
      alert("Veuillez entrer un nom.");
      return;
    } else if (nomsExistants.includes(nom.toLowerCase())) {
      document.querySelector("#overlay-start input#player-name").style.backgroundColor = "red";
      document.querySelector("#overlay-start input#player-name").style.color = "white";
      alert("Ce nom est déjà utilisé. Choisissez un autre.");
      
      return;
    }

    joueur.nom = nom;

    document.getElementById("overlay-start").classList.remove("visible");
    init();

    
  });
};

let grille;
let joueur = {
  nom: "",
  score: 0,
  niveau: 1,
};


function init() {
  console.log("Page et ressources prêtes à l'emploi");

  grille = new Grille(9, 9, 6, joueur);
  
  //grille.verifierGrille();
  grille.showCookies();

  // Nettoyage initial de la grille
  setTimeout(nettoyerGrilleInit, 100);
  
  // lancer le chrono
  grille.CompteARebours();

  
}

function nettoyerGrilleInit() {

  grille.supprimeEnCascade(() => {
    grille.score = 0;
    grille.majScore(0); // met à jour l'affichage sans ajouter de points
  });
}

function afficherPodium() {
  const scores = JSON.parse(localStorage.getItem("scoresCandy")) || [];

  scores.sort((a, b) => (b.score-1000**a.niveau) - (a.score-1000**b.niveau));
  const top3 = scores.slice(0, 3);
  
  while (top3.length < 3) {
    top3.push({ nom: "-", score: "-", niveau: "-" });
  }

  let html = "<h2>🏆 Podium</h2>";
  top3.forEach((entry, index) => {
    html += `<div class="podium-entry">#${index + 1} — ${entry.nom} : (Niv ${entry.niveau}) ${entry.score} pts </div>`;
  });

  document.getElementById("podium").innerHTML = html;
}

