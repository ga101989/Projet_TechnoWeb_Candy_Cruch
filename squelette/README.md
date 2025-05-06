# CANDY GAME

## 1. Présentation du Projet

**Candy Game** est un jeu style puzzle développé en JavaScript DOM. Le joueur doit aligner au moins trois cookies identiques horizontalement ou verticalement pour marquer des points. Le jeu se déroule sur une grille de 9x9 cases et propose un système de progression par niveaux avec un chronomètre.

L’objectif principal est d’atteindre le score cible dans le temps imparti. Chaque nouveau niveau augmente la difficulté en ajoutant un objectif de score.

## 2. Structure du Projet

Le code source du jeu est organisé de manière modulaire :

- **`grille.js`** : Composant principal qui orchestre la logique du jeu.
    - Gère la génération de la grille, les interactions utilisateur (clics, drag & drop), la détection des alignements, la suppression en cascade, la gravité, la génération de nouveaux cookies, le score et les niveaux.

- **`cookie.js`** : Définit les objets interactifs du jeu.
    - Représente un cookie (type, position, image DOM).
    - Gère la sélection/désélection, le swap, la suppression, et le déplacement d’un cookie dans la grille.

- **`BoucleJeu.js`** : Gère l’initialisation globale du jeu.
    - Affiche l’écran d’accueil, gère l’entrée du nom joueur, lance la grille, gère la fin du jeu et le podium.

- **`utils.js`** : Contient des fonctions utilitaires.
    - `create2DArray()`: Crée un tableau 2D pour représenter la grille de cookies.

- **`index.html`** : Structure HTML de l’interface.
    - Comprend la grille, les écrans de démarrage et de fin de partie, ainsi que les éléments d’affichage (temps, score, niveau).

- **`assets/images/`** : Ressources graphiques (cookies normaux et surlignés, logo, favicon).

- **`css/styles.css`** : Mise en forme de l'interface utilisateur, des boutons, des overlays et des cookies.

## 3. Technologies Utilisées

- **JavaScript** : Langage principal pour la logique du jeu.
- **HTML5** : Utilisé pour interagir dynamiquement avec les éléments HTML (grille, images de cookies, boutons).
- **CSS** : Mise en page et animations visuelles.
- **localStorage** : Utilisé pour stocker localement les scores des joueurs dans un tableau de podium.

## 4. Explication des Scripts Clés

- **`BoucleJeu.js`** :
    - Gère l’écran d’accueil, le bouton "Jouer", le stockage du nom du joueur.
    - Affiche le podium à chaque fin de partie.
    - Appelle la fonction `init()` qui initialise une instance de `Grille`.

- **`grille.js`** :
    - Initialise la grille avec une difficulté (nombre de types de cookies).
    - Met à jour le score et le niveau.
    - Gère les interactions avec les cookies (clics, drag & drop).
    - Gère le temps (compte à rebours de 25 secondes par niveau).
    - Supprime les cookies alignés en cascade, les remplace, et vérifie la progression.

- **`cookie.js`** :
    - Crée les cookies avec les bonnes images.
    - Implémente `selectionnee()`, `deselectionnee()`, `supprimerCookie()` et `deplacer()`.
    - Contient des méthodes statiques comme `swapCookies()` et `distance()` pour faciliter la logique de swap.

- **`utils.js`** :
    - Fournit une méthode simple de création de tableau 2D utilisé pour modéliser la grille du jeu.

## 5. Mécaniques de Jeu

- **Grille 9x9** avec 4 à 6 types de cookies selon le niveau.
- **Interaction par clic ou drag & drop** pour échanger deux cookies adjacents.
- **Détection d’alignements** (3 cookies ou plus), suppression avec effet de cascade, et réapparition de nouveaux cookies.
- **Système de niveaux** : un score minimum est requis pour passer au niveau suivant.
- **Temps limité** (60s par niveau), avec fin de jeu si le score n’est pas atteint.
- **Podium sauvegardé** via `localStorage`.

## 6. Expérience Utilisateur

- Interface DOM avec :
    - Boutons de lancement et de rejouabilité
    - Affichage en temps réel du **score**, **niveau**, et **temps**
    - **Podium interactif** en fin de partie (top 3 joueurs)
- Interaction intuitive à la souris (clic ou glisser-déposer)
