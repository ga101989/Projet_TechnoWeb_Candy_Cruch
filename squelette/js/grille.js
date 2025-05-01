import Cookie from "./cookie.js";
import { create2DArray } from "./utils.js";

/* Classe principale du jeu, c'est une grille de cookies. Le jeu se joue comme
Candy Crush Saga etc... c'est un match-3 game... */
export default class Grille {
  /**
   * Constructeur de la grille
   * @param {number} l nombre de lignes
   * @param {number} c nombre de colonnes
   */
  constructor(l, c, difficulte) {
    this.c = c;
    this.l = l;
    this.difficulte = difficulte;
    this.score = 0;
    this.TabCookieEnCours = [];

    this.tabCookies = this.remplirTableauDeCookies(difficulte);
  }

  majScore(points) {
    this.score += points;
    document.querySelector("#infos div:nth-child(2)").textContent = `Score : ${this.score}`;
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
        let l = cookieImage.dataset.ligne;
        let c = cookieImage.dataset.colonne;

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
          //this.tabCookies[ligne][colonne].supprimer(); // on supprime les cookies alignés
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


  supprimeEnCascade() {
    this.detectionAlignements();
  
    let aSupprimer = this.tabCookies.flat().some(c => c?.alignement);
  
    if (aSupprimer) {
      setTimeout(() => {
        this.supprimerAlignements();
  
        setTimeout(() => {
          this.supprimeEnCascade();
        }, 200);
      }, 200);
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
}
