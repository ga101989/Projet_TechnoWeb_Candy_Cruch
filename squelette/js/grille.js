import Cookie from "./cookie.js";
import { create2DArray } from "./utils.js";
import { afficherPodium } from "./BoucleJeu.js";


/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
export default class Grille {
  /**
   * Constructeur de la grille
   * @param {number} l nombre de lignes
   * @param {number} c nombre de colonnes
   */
  constructor(l, c, difficulte, joueur) {
    this.c = c;
    this.l = l;
    this.difficulte = difficulte;
    this.score = 0;
    this.TabCookieEnCours = [];
    this.niveau = 1;
    this.tabCookies = this.remplirTableauDeCookies(difficulte);
    this.temps = 25;
    this.intervalId = null;
    this.tempsParNiveau = 25;
    this.joueur = joueur;
  }

  majScore(points) {
    this.score += points;
    document.querySelector("#infos div:nth-child(2)").textContent = `Score : ${this.score}`;

    if (this.score >= this.seuilScore()) {
      this.NiveauSuivant();
    }
      
  }

  majNiveau() {
    document.querySelector("#infos div:nth-child(3)").textContent = `Niveau : ${this.niveau}`;
  }

  CompteARebours() {
    clearInterval(this.intervalId);
    this.temps = this.tempsParNiveau;
  
    document.querySelector("#infos div:nth-child(1)").textContent = `Temps : ${this.temps}`;
  
    this.intervalId = setInterval(() => {
      this.temps--;
      document.querySelector("#infos div:nth-child(1)").textContent = `Temps : ${this.temps}`;
  
      if (this.temps <= 0) {
        clearInterval(this.intervalId);
        this.FinDuJeu();
      }
    }, 1000);
  }
  

  FinDuJeu() {

    const overlay = document.getElementById("overlay-niveau");
    overlay.innerHTML = `
      <div>
        Temps écoulé ! Partie terminée.
        <br><br>
        <button id="btn-rejouer" class="styled-button">Rejouer</button>
      </div>`;
    overlay.classList.add("visible");

    this.TabCookieEnCours = [];
    document.querySelectorAll("#grille img").forEach(img => {
      img.onclick = null;
      img.ondragstart = null;
      img.ondrop = null;
    });
  
    document.querySelectorAll("#grille div").forEach(div => {
      div.innerHTML = "";
    });

    this.joueur.score = this.score;
    this.joueur.niveau = this.niveau;
    let scores = JSON.parse(localStorage.getItem("scoresCandy")) || [];
    scores.push({ nom: this.joueur.nom, score: this.joueur.score, niveau: this.joueur.niveau });
    localStorage.setItem("scoresCandy", JSON.stringify(scores));
  
    document.getElementById("btn-rejouer").addEventListener("click", () => {
      overlay.classList.remove("visible");
      this.rejouer();
    });

    //this.afficherPodium();
    afficherPodium();

    setTimeout(() => {
      overlay.classList.remove("visible");
    }, 5000);
  
  }

  /*
  afficherPodium() {
    const scores = JSON.parse(localStorage.getItem("scoresCandy")) || [];

    scores.sort((a, b) => b.score - a.score);
  
    const top3 = scores.slice(0, 3);
    let html = "<h2>🏆 Podium</h2>";
    top3.forEach((entry, index) => {
      html += `<p>#${index + 1} - ${entry.nom} : ${entry.score} points (Niv ${entry.niveau})</p>`;
    });
  
    const overlay = document.getElementById("overlay-niveau");
    overlay.innerHTML += `<br><div class="podium">${html}</div>`;
  }*/
  

  rejouer() {
    this.score = 0;
    this.niveau = 1;
    this.difficulte = 6;
    this.tabCookies = this.remplirTableauDeCookies(this.difficulte);
    this.majScore(0);
    this.majNiveau();
    this.showCookies();
  
    setTimeout(() => {
      this.supprimeEnCascade(() => {
        this.CompteARebours();
      });
    }, 100);
  }
  

  /**
   * parcours la liste des divs de la grille et affiche les images des cookies
   * correspondant à chaque case. Au passage, à chaque image on va ajouter des
   * écouteurs de click et de drag'n'drop pour pouvoir interagir avec elles
   * et implémenter la logique du jeu.
   */
  showCookies() {
    let caseDivs = document.querySelectorAll("#grille div");

    caseDivs.forEach((div, index) => {
      // on calcule la ligne et la colonne de la case
      // index est le numéro de la case dans la grille
      // on sait que chaque ligne contient this.c colonnes
      // er this.l lignes
      // on peut en déduire la ligne et la colonne
      // par exemple si on a 9 cases par ligne et qu'on 
      // est à l'index 4
      // on est sur la ligne 0 (car 4/9 = 0) et 
      // la colonne 4 (car 4%9 = 4)
      let ligne = Math.floor(index / this.l);
      let colonne = index % this.c;

      console.log("On remplit le div index=" + index + " l=" + ligne + " col=" + colonne);

      // on récupère le cookie correspondant à cette case
      let cookie = this.tabCookies[ligne][colonne];
      // on récupère l'image correspondante
      if (!cookie || !cookie.htmlImage) return;
      let img = cookie.htmlImage;

      
      img.onclick = (event) => {

        let cookieImage = event.target;

        let cookie = this.getCookieFromImage(cookieImage);

          
        if (!this.TabCookieEnCours.includes(cookie)) {
            this.TabCookieEnCours.push(cookie);
            cookie.selectionnee();
        }
        if (this.TabCookieEnCours.length == 2) {
            let cookie1 = this.TabCookieEnCours[0];
            let cookie2 = this.TabCookieEnCours[1];
  
            this.TryDeSwipe(cookie1, cookie2);
        }

      };
  
      img.ondragstart = (event) => {
        console.log("dragstart sur cookie");
        // on récupère l'image qui a été draggée
        let cookieImage = event.target;

        let cookie = this.getCookieFromImage(cookieImage);

        // on stocke dans l'objet event.dataTransfer les infos
        // sur le cookie
        event.dataTransfer.setData("text", JSON.stringify(cookieImage.dataset));
      }


      img.ondragover = (event) => {
        
        event.preventDefault();

      }

      // on ajoute une classe CSS quand on survole l'image
      img.ondragenter = (event) => {

        event.target.classList.add("grilleDragOver");

      }


      // on enlève la classe CSS quand on sort de l'image
      img.ondragleave = (event) => {

        event.target.classList.remove("grilleDragOver");

      }

      img.ondrop = (event) => {
        // on supprime l'effet de survol
        event.target.classList.remove("grilleDragOver");

        // on récupère les infos du cookie draggé
        let data = JSON.parse(event.dataTransfer.getData("text"));

        let cookieImage = event.target;
        let l = parseInt(cookieImage.dataset.ligne);
        let c = parseInt(cookieImage.dataset.colonne);
/** 
        let l = cookieImage.dataset.ligne;
        let c = cookieImage.dataset.colonne;
*/

//TODO changer

        let t = this.tabCookies[l][c].type;
        console.log(`dragstart sur cookie : t = ${t} l = ${l} c = ${c}`); 

        let cookie1 = this.getCookieFromLC(data.ligne, data.colonne);
        let cookie2 = this.getCookieFromImage(cookieImage);

        // on swappe les cookies
        this.TryDeSwipe(cookie1, cookie2);
      }


      // on affiche l'image dans le div pour la faire apparaitre à l'écran.
      div.appendChild(img);
    });
  }

  getCookieFromImage(img) {

    let [ligne, colonne] = Cookie.getLCFromImg(img);

    return this.getCookieFromLC(ligne, colonne);
  }

  getCookieFromLC(ligne, colonne) {
    return this.tabCookies[ligne][colonne];
  }


  swapLesCookies(cookie1, cookie2) {
    if (Cookie.swapPossible(cookie1, cookie2)) {
      
      Cookie.swapCookies(cookie1, cookie2);

      return true;
    }  
    
    else {return false;}

    
  }

  TryDeSwipe(cookie1, cookie2) {

    if(this.swapLesCookies(cookie1, cookie2)) {
      this.TabCookieEnCours = [];
      cookie2.deselectionnee();
      cookie1.deselectionnee();

      //this.detectionAlignements();
      //this.supprimerAlignements();

      this.supprimeEnCascade();

    }
    else{
      console.log("Impossible de swap les cookies");
      this.TabCookieEnCours.splice(1, 1);
      cookie2.deselectionnee();
      this.TabCookieEnCours = [];
    }

  }

  rajoutDeCookies() {
    for (let ligne = 0; ligne < this.l; ligne++) {
      for (let colonne = 0; colonne < this.c; colonne++) {
        if (this.tabCookies[ligne][colonne] === null) {
          const type = Math.floor(Math.random() * this.difficulte);
          const nouveauCookie = new Cookie(type, ligne, colonne);
          this.tabCookies[ligne][colonne] = nouveauCookie;
        }
      }
    }
  
    this.reafficherCookies();
  }


  /**
   * Initialisation du niveau de départ. Le paramètre est le nombre de cookies différents
   * dans la grille. 4 types (4 couleurs) = facile de trouver des possibilités de faire
   * des groupes de 3. 5 = niveau moyen, 6 = niveau difficile
   *
   * Améliorations : 1) s'assurer que dans la grille générée il n'y a pas déjà de groupes
   * de trois. 2) S'assurer qu'il y a au moins 1 possibilité de faire un groupe de 3 sinon
   * on a perdu d'entrée. 3) réfléchir à des stratégies pour générer des niveaux plus ou moins
   * difficiles.
   *
   * On verra plus tard pour les améliorations...
   */
  remplirTableauDeCookies(nbDeCookiesDifferents) {
    // créer un tableau vide de 9 cases pour une ligne
    // en JavaScript on ne sait pas créer de matrices
    // d'un coup. Pas de new tab[3][4] par exemple.
    // Il faut créer un tableau vide et ensuite remplir
    // chaque case avec un autre tableau vide
    // Faites ctrl-click sur la fonction create2DArray
    // pour voir comment elle fonctionne
    let tab = create2DArray(this.l);

    // remplir
    for (let l = 0; l < this.l; l++) {
      for (let c = 0; c < this.c; c++) {

        // on génère un nombre aléatoire entre 0 et nbDeCookiesDifferents-1
        const type = Math.floor(Math.random() * nbDeCookiesDifferents);
        //console.log(type)
        tab[l][c] = new Cookie(type, l, c);
      }
    }

    return tab;
  }

  detectionAlignements() {
    // Réinitialiser l'attribut alignement de tous les cookies
    for (let ligne = 0; ligne < this.l; ligne++) {
      for (let colonne = 0; colonne < this.c; colonne++) {
        this.tabCookies[ligne][colonne].alignement = false;
      }
    }

    // Vérification des alignements horizontaux
    for (let ligne = 0; ligne < this.l; ligne++) {
      let compte = 1;
      for (let colonne = 0; colonne < this.c - 1; colonne++) {
        if (this.tabCookies[ligne][colonne].type === this.tabCookies[ligne][colonne + 1].type) {
          compte++;
        } else {
          if (compte >= 3) {
            for (let k = 0; k < compte; k++) {
              this.tabCookies[ligne][colonne - k].alignement = true;
            }
          }
          compte = 1;
        }
      }
      if (compte >= 3) {
        for (let k = 0; k < compte; k++) {
          this.tabCookies[ligne][this.c - 1 - k].alignement = true;
        }
      }
    }

    // Vérification des alignements verticaux
    for (let colonne = 0; colonne < this.c; colonne++) {
      let compte = 1;
      for (let ligne = 0; ligne < this.l - 1; ligne++) {
        if (this.tabCookies[ligne][colonne].type === this.tabCookies[ligne + 1][colonne].type) {
          compte++;
        } else {
          if (compte >= 3) {
            for (let k = 0; k < compte; k++) {
              this.tabCookies[ligne - k][colonne].alignement = true;
            }
          }
          compte = 1;
        }
      }
      if (compte >= 3) {
        for (let k = 0; k < compte; k++) {
          this.tabCookies[this.l - 1 - k][colonne].alignement = true;
        }
      }
    }
  }

  // Méthode qui permet de supprimer les cookies alignés
  supprimerAlignements() {
    let nbCases = 0;
    for (let ligne = 0; ligne < this.l; ligne++) {
      for (let colonne = 0; colonne < this.c; colonne++) { // on repère tous les cookies qui sont alignés
        if (this.tabCookies[ligne][colonne].alignement) {

          this.tabCookies[ligne][colonne].supprimerCookie(); // on supprime l'image du cookie
          this.tabCookies[ligne][colonne] = null;
          nbCases++;// pour le nbre de cases à supprimer
        }
      }
    }

    if (nbCases > 0) {
      this.majScore(nbCases * 20);
    }

    this.faireDescendreCookies();
    this.rajoutDeCookies();

  }


  supprimeEnCascade(callback) {
    this.detectionAlignements();
  
    let aSupprimer = this.tabCookies.flat().some(c => c?.alignement);
  
    if (aSupprimer) {
      setTimeout(() => {
        this.supprimerAlignements();
  
        setTimeout(() => {
          this.supprimeEnCascade(callback);
        }, 200);
      }, 200);
    } else {
      if (callback) callback();
    }
  }
  
  



  highlightAlignments() {
    for (let ligne = 0; ligne < this.l; ligne++) {
      for (let colonne = 0; colonne < this.c; colonne++) {
        let cookie = this.tabCookies[ligne][colonne];
        if (cookie && cookie.alignement) {
          cookie.htmlImage.src = Cookie.urlsImagesSurlignees[cookie.type];
        }
      }
    }
  }

  // Méthode qui permet de faire descendre les cookies
  faireDescendreCookies() {
    for (let colonne = 0; colonne < this.c; colonne++) {
      let trou = 0;
      for (let ligne = this.l - 1; ligne >= 0; ligne--) {
        if (this.tabCookies[ligne][colonne] === null) {
          trou++;
        } else if (trou > 0) {
          this.tabCookies[ligne][colonne].deplacer(trou);

          this.tabCookies[ligne + trou][colonne] = this.tabCookies[ligne][colonne];
        this.tabCookies[ligne][colonne] = null;
        }
      }
    }

    // Remplir les cases vides avec de nouveaux cookies
    this.reafficherCookies();

  }

  reafficherCookies() {
    let caseDivs = document.querySelectorAll("#grille div");
  
    for (let ligne = 0; ligne < this.l; ligne++) {
      for (let colonne = 0; colonne < this.c; colonne++) {
        const index = ligne * this.c + colonne;
        const div = caseDivs[index];
        div.innerHTML = "";
  
        const cookie = this.tabCookies[ligne][colonne];
        if (cookie && cookie.htmlImage) {
          this.ajouterListenersSurImage(cookie.htmlImage);
          div.appendChild(cookie.htmlImage);
        }
      }
    }
  }
  

  verifierGrille(){
    this.detectionAlignements();
    // this.supprimerAlignements(alignements);
    // this.faireDescendreCookies();
  }


  ajouterListenersSurImage(img) {
    img.onclick = (event) => {
      if (this.enCoursDeCascade) return;
  
      let cookieImage = event.target;
      let cookie = this.getCookieFromImage(cookieImage);
  
      if (!this.TabCookieEnCours.includes(cookie)) {
        this.TabCookieEnCours.push(cookie);
        cookie.selectionnee();
      }
      if (this.TabCookieEnCours.length == 2) {
        let cookie1 = this.TabCookieEnCours[0];
        let cookie2 = this.TabCookieEnCours[1];
        this.TryDeSwipe(cookie1, cookie2);
      }
    };
  
    img.ondragstart = (event) => {
      if (this.enCoursDeCascade) return;
  
      let cookieImage = event.target;
      event.dataTransfer.setData("text", JSON.stringify(cookieImage.dataset));
    };
  
    img.ondragover = (event) => event.preventDefault();
  
    img.ondragenter = (event) => {
      event.target.classList.add("grilleDragOver");
    };
  
    img.ondragleave = (event) => {
      event.target.classList.remove("grilleDragOver");
    };
  
    img.ondrop = (event) => {
      event.target.classList.remove("grilleDragOver");
      let data = JSON.parse(event.dataTransfer.getData("text"));
  
      let cookieImage = event.target;
      let l = parseInt(cookieImage.dataset.ligne);
      let c = parseInt(cookieImage.dataset.colonne);
  
      let cookie1 = this.getCookieFromLC(parseInt(data.ligne), parseInt(data.colonne));
      let cookie2 = this.getCookieFromImage(cookieImage);
  
      this.TryDeSwipe(cookie1, cookie2);
    };
  }

  seuilScore() {
    return this.niveau * 1000;
  }


  NiveauSuivant() {
    this.niveau++;
    this.majNiveau();
    this.CompteARebours();
    //difficulté
    this.difficulte = Math.min(this.difficulte + 1, 5);//
  
    //nouvelle grille
    this.tabCookies = this.remplirTableauDeCookies(this.difficulte);
    this.showCookies();
    this.supprimeEnCascade(() => {
      this.score = 0;
      this.majScore(0);
    });
    this.NiveauSuivantAffichage();
    //alert(`Bravo ! Vous passez au niveau ${this.niveau}`);
  }

  NiveauSuivantAffichage() {
    const overlay = document.getElementById("overlay-niveau");
    overlay.textContent = `Niveau ${this.niveau}`;
    overlay.classList.add("visible");
    setTimeout(() => {
      overlay.classList.remove("visible");
    }, 1500);
  }


}
