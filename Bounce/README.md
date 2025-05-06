# BOUNCE 

## 1. Présentation du Projet

**BOUNCE** est un jeu d'arcade 2D à défilement vertical conçu pour deux joueurs en écran partagé. Chaque joueur contrôle une balle colorée qui progresse automatiquement vers le haut de l'écran. L'objectif principal est de survivre le plus longtemps possible en traversant des obstacles. Pour franchir un obstacle, la couleur de la balle du joueur doit correspondre à la couleur du segment de l'obstacle qu'elle touche.

Le premier joueur à atteindre la ligne d'arrivée gagne. 

## 2. Structure du Projet

Le code source du jeu est organisé dans le dossier `src/` et est divisé en plusieurs sous-dossiers: 

-   **`core/`**: Contient la logique fondamentale et le moteur du jeu.
    -   `game.js`: Le script principal qui orchestre l'ensemble du jeu. Il gère la boucle de jeu, l'initialisation des composants, les états du jeu (menu, en cours, pause, fin), et la logique de victoire.
    -   `input.js`: Gère les entrées clavier pour les deux joueurs (saut).
    -   `physics.js`: Implémente une physique simplifiée pour le jeu, incluant la gravité, la force de saut, et des fonctions de base pour la détection de collision.

-   **`entities/`**: Définit tous les objets interactifs du jeu.
    -   `player.js`: Contient la logique du personnage joueur, y compris ses mouvements, la gestion de sa couleur, la détection des collisions, le calcul du score, et le dessin de sa traînée visuelle.
    -   `obstacles/`: Un sous-dossier pour les différents types d'obstacles.
        -   `pulsar.js`: Un type d'obstacle qui pulse et permet au joueur de changer sa couleur en le traversant par le centre.
        -   `rotator.js`: Un obstacle circulaire rotatif composé de segments de différentes couleurs. Le joueur doit traverser le segment correspondant à sa couleur.
        

-   **`managers/`**: Regroupe les classes responsables de la gestion de différents aspects transversaux du jeu.
    -   `colorManager.js`: Gère la palette de couleurs du jeu, les transitions de couleur, et fournit des utilitaires pour la manipulation des couleurs.
    -   `gameState.js`: Suit l'état actuel du jeu (menu, jeu, pause, etc.), les scores des joueurs, et les conditions de victoire/défaite.
    -   `obstacleManager.js`: Responsable de la génération procédurale et de la gestion du cycle de vie des obstacles pour les deux voies des joueurs.

-   **`rendering/`**: Contient toute la logique liée à l'affichage graphique du jeu.
    -   `renderer.js`: Le moteur de rendu principal. Il utilise l'API HTML5 Canvas pour dessiner tous les éléments du jeu (joueurs, obstacles, arrière-plan, grille, ligne d'arrivée). Il gère également les caméras pour chaque joueur et la division de l'écran.
    -   `ui.js`: Gère les éléments de l'interface utilisateur (UI) qui sont superposés au jeu, tels que le menu principal, l'écran de pause, l'écran de fin de partie, et l'affichage des scores. Ces éléments sont principalement des éléments HTML DOM.
    

## 3. Technologies Utilisées

-   **JavaScript**: Langage principal pour toute la logique du jeu.
-   **HTML5**: Utilisé pour la structure de base de la page web et l'élément `<canvas>`.
-   **HTML5 Canvas API (2D)**: Technologie clé pour le rendu graphique en temps réel de tous les éléments visuels du jeu.
-   **CSS**: Utilisé pour le style des éléments HTML de l'interface utilisateur (menus, boutons, etc.), bien qu'une partie du style soit également gérée dynamiquement via JavaScript dans `ui.js`.

## 4. Explication des Scripts Clés

-   **`src/core/game.js`**: C'est le chef d'orchestre du jeu. Il initialise tous les gestionnaires et entités, démarre la boucle de jeu principale (`gameLoop`) qui met à jour la logique du jeu et effectue le rendu à chaque frame (via `requestAnimationFrame`). Il gère également les transitions entre les différents états du jeu (par exemple, passage du menu au jeu, gestion de la pause).

-   **`src/entities/player.js`**: Ce script définit tout ce qui concerne le joueur. Il gère la position, la vélocité (affectée par la gravité et les sauts), la couleur actuelle (cruciale pour interagir avec les obstacles), la détection des collisions avec les obstacles (en collaboration avec `physics.js` et les méthodes de collision spécifiques des obstacles), et la mise à jour du score. Il est aussi responsable de dessiner le joueur et sa traînée.

-   **`src/managers/obstacleManager.js`**: Ce gestionnaire est vital pour la rejouabilité et le défi. Il génère dynamiquement les obstacles pour les deux joueurs en suivant des schémas et des niveaux de difficulté prédéfinis. Il s'assure que les obstacles sont correctement espacés et gère leur apparition et leur disparition de l'écran en fonction de la progression des joueurs.

-   **`src/rendering/renderer.js`**: Le cœur du système de rendu. Il prend en charge le dessin de chaque frame du jeu sur le Canvas. Ses responsabilités incluent :
    -   Nettoyer le canvas.
    -   Mettre à jour et appliquer les transformations des caméras pour chaque joueur.
    -   Dessiner l'arrière-plan, la grille, et la ligne d'arrivée.
    -   Gérer le rendu en écran partagé, en s'assurant que chaque joueur voit sa propre perspective.
    -   Appeler les méthodes de dessin des joueurs et des obstacles.

-   **`src/rendering/ui.js`**: S'occupe de tous les aspects de l'interface utilisateur non-Canvas. Il crée et gère les éléments HTML pour le menu principal (titre, bouton "Jouer", instructions), l'écran de pause (message "PAUSE", bouton "Reprendre"), l'écran de fin de partie (message de victoire/défaite, bouton "Rejouer"), et l'affichage des scores en temps réel.

## 5. Gestion de Deux Interfaces en Simultané (Écran Partagé)

Le jeu est conçu pour une expérience à deux joueurs sur le même écran :

-   **Division de l'Écran**: `renderer.js` divise la largeur du canvas en deux sections égales, séparées par un petit espace (`splitScreenGap`). Chaque section (`this.splitScreen.width`) est dédiée à un joueur.
-   **Caméras Indépendantes**: Chaque joueur possède sa propre caméra virtuelle (`this.cameras[0]` et `this.cameras[1]`). Ces caméras suivent verticalement la progression de leur joueur respectif donc separement.
-   **Donc pour le rendu Séparé**: Lors de cette phase de rendu dans `renderer.render()`:
    1.  Le contexte du canvas est sauvegardé (`ctx.save()`).
    2.  Une région de découpage (`clipping region` via `ctx.rect()` et `ctx.clip()`) est définie pour la vue du Joueur 1, limitant le dessin à la moitié gauche de l'écran.
    3.  Les transformations de translation (`ctx.translate()`) sont appliquées pour positionner le monde du jeu par rapport à la caméra du Joueur 1.
    4.  Les obstacles et le Joueur 1 sont dessinés.
    5.  Le contexte est restauré (`ctx.restore()`).
    6.  Le processus est répété pour le Joueur 2 sur la moitié droite de l'écran, avec sa propre caméra et ses propres obstacles.

-   **Entrées Utilisateur**: `input.js` écoute les touches spécifiques pour chaque joueur (par exemple, Espace pour J1, Entrée pour J2).
