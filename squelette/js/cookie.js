export default class Cookie {
  ligne=0;
  colone=0;
  type=0;
  htmlImage=undefined;

  static urlsImagesNormales = [
    "./assets/images/Croissant@2x.png",
    "./assets/images/Cupcake@2x.png",
    "./assets/images/Danish@2x.png",
    "./assets/images/Donut@2x.png",
    "./assets/images/Macaroon@2x.png",
    "./assets/images/SugarCookie@2x.png",
  ];
  static urlsImagesSurlignees = [
    "./assets/images/Croissant-Highlighted@2x.png",
    "./assets/images/Cupcake-Highlighted@2x.png",
    "./assets/images/Danish-Highlighted@2x.png",
    "./assets/images/Donut-Highlighted@2x.png",
    "./assets/images/Macaroon-Highlighted@2x.png",
    "./assets/images/SugarCookie-Highlighted@2x.png",
  ];

  constructor(type, ligne, colonne) {
    this.type = type;
    this.ligne = ligne;
    this.colonne = colonne;
    this.alignement = false;

    // On récupère l'URL de l'image correspondant au type
    // qui est un nombre entre 0 et 5
    const url = Cookie.urlsImagesNormales[type];

    // On crée une image HTML avec l'API du DOM
    let img = document.createElement("img");
    img.src = url;
    img.width = 80;
    img.height = 80;
    img.dataset.ligne = ligne;
    img.dataset.colonne = colonne;

    // On stocke l'image dans l'objet cookie
    this.htmlImage = img;
  }

  isSelectionnee() {
    // On va vérifier si l'image a la classe CSS "cookies-selected"
    return this.htmlImage.classList.contains("cookies-selected");
  }

  selectionnee() {

    this.htmlImage.src = Cookie.urlsImagesSurlignees[this.type];
    // On va ajouter la classe CSS "cookies-selected" à
    // l'image du cookie
    this.htmlImage.classList.add("cookies-selected");
  }

  deselectionnee() {
    // on change l'image et la classe CSS
    // A FAIRE
    this.htmlImage.src = Cookie.urlsImagesNormales[this.type];
    // On va ajouter la classe CSS "cookies-selected" à
    // l'image du cookie
    this.htmlImage.classList.remove("cookies-selected");
  }

  static swapCookies(c1, c2) {
    // A FAIRE
    console.log("On essaie SWAP C1 C2");

    // On regarde la distance entre les deux cookies
    // si elle est de 1, on peut les swapper
    const dist = Cookie.distance(c1, c2);
    if(dist === 1) {
      // on swappe les cookies dans le tableau
      // On échange leurs images et types

      // On échange les types
      let tmp = c1.type;
      c1.type = c2.type;
      c2.type = tmp;

      // On échange les images
      tmp = c1.htmlImage.src;
      c1.htmlImage.src = c2.htmlImage.src;
      c2.htmlImage.src = tmp;
    }

    // et on remet les images correspondant au look
    // "désélectionné"
    c1.deselectionnee();
    c2.deselectionnee();
  }

  /** renvoie la distance au sens "nombre de cases" 
   * entre deux cookies. Servira pour savoir si on peut
   * swapper deux cookies */
  static distance(cookie1, cookie2) {
    let l1 = cookie1.ligne;
    let c1 = cookie1.colonne;
    let l2 = cookie2.ligne;
    let c2 = cookie2.colonne;

    const distance = Math.sqrt((c2 - c1) * (c2 - c1) + (l2 - l1) * (l2 - l1));
    console.log("Distance = " + distance);
    return distance;
  }

  supprimerCookie() {
    // Remplacer l'image par une image vide ou supprimer l'élément
    this.htmlImage.src = '';
    this.htmlImage = null;
    // Optionnel : marquer le cookie comme supprimé
    this.type = null;
  }

  deplacer(trou) {
    // Mettre à jour les coordonnées du cookie
    this.ligne += trou;
    // Mettre à jour les attributs de données de l'image HTML
    if (this.htmlImage) {
      this.htmlImage.dataset.ligne = this.ligne;
    }
  }

  setAlignement(alignement) {
    this.alignement = alignement;
  }
  

    /**
   * renvoie true si c'est à une distance de 1 sinon false
   * @param {*} cookie1 
   * @param {*} cookie2 
   * @returns 
   */
    static swapPossible(cookie1, cookie2) {

      let distance = Cookie.distance(cookie1, cookie2);
  
      return distance === 1;
    }


    /**
     * On swappe les cookies
     * @param {*} c1 
     * @param {*} c2 
     */
    static swapCookies(c1, c2) {

      if(Cookie.swapPossible(c1, c2)) {
        // on swappe les cookies dans le tableau
        // On échange leurs images et types
  
        // On échange les types
        let tmp = c1.type;
        c1.type = c2.type;
        c2.type = tmp;
  
        // On échange les images
        tmp = c1.htmlImage.src;
        c1.htmlImage.src = c2.htmlImage.src;
        c2.htmlImage.src = tmp;

        c1.deselectionnee();
        c2.deselectionnee();
      }

    }

    static getLCFromImg(img) {
      return [img.dataset.ligne, img.dataset.colonne];
    }


  
}
