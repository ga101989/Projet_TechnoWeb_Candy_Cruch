# Projets Jeu Web

## Auteur : Nathan Bitoun, Axel Guillou, Alexander Boretti

### Jeu : Cube Invasion

### Attention :

Le Jeu ne s'adapte pas au frameRate de l'ordinateur, le jeu sera très dur avec un frameRate élevé.

#### Architecture :

L'architecture a été travaillée afin de pouvoir améliorer le jeu dans le futur de manière plus simple. Il est possible de s'y retrouver facilement.  
Nous avons une classe abstraite qui permet de créer des entités plus facilement.

#### Partie Technique :

- **Canvas API** : Le jeu utilise l'API Canvas pour dessiner les entités (joueur, ennemis, projectiles, etc.) et gérer les animations en temps réel.
- **Modularité** : Le code est organisé en modules JavaScript, ce qui permet une séparation claire des responsabilités :
  - `entities/` : Contient les classes représentant les entités du jeu (joueur, ennemis, projectiles, etc.).
  - `utils/` : Contient des fonctions utilitaires pour la logique du jeu (collisions, spawn sécurisé, etc.).
  - `game/` : Contient la logique principale du jeu, y compris la gestion des menus et de la boucle de jeu.
  - `interface/` : Gère l'affichage des éléments d'interface utilisateur, comme les barres de vie et d'expérience.
- **Gestion des entrées clavier** : Les entrées utilisateur sont capturées via des écouteurs d'événements pour permettre au joueur de se déplacer et d'interagir avec le jeu.
- **Système de progression** : Le joueur peut monter de niveau en accumulant de l'expérience, ce qui débloque des améliorations (santé, dégâts, vitesse, etc.).
- **IA des ennemis** : Les ennemis ont des comportements variés (melee, range, healer) et interagissent avec le joueur de manière dynamique.
- **Gestion des collisions** : Les collisions entre entités (joueur, ennemis, projectiles, etc.) sont gérées pour déterminer les interactions (dégâts, collecte d'XP, etc.).

#### Possibilités d'Amélioration :

1. **Optimisation des Performances** :
   - Implémenter un système de spatial partitioning (comme une grille ou un quad-tree) pour réduire le nombre de calculs de collision.
   - Réduire les appels fréquents à `Math.hypot` en utilisant des distances au carré lorsque possible.

2. **Amélioration de l'IA** :
   - Ajouter des comportements plus complexes pour les ennemis, comme des formations ou des attaques coordonnées.
   - Introduire des boss avec des mécaniques uniques.

3. **Système de Sauvegarde** :
   - Permettre au joueur de sauvegarder sa progression (nom, niveau, statistiques) et de la charger ultérieurement.

4. **Support Multijoueur** :
   - Ajouter un mode multijoueur local ou en ligne pour permettre à plusieurs joueurs de coopérer ou de s'affronter.

5. **Amélioration de l'Interface Utilisateur** :
   - Ajouter des animations pour les barres de vie et d'expérience.
   - Intégrer un tableau des scores pour afficher les meilleurs temps ou niveaux atteints.

6. **Refactorisation du Code** :
   - Extraire certaines logiques complexes (comme la gestion des collisions ou des projectiles) dans des classes ou des services dédiés.
   - Utiliser des constantes ou des fichiers de configuration pour les valeurs magiques (par exemple, les chances de drop, les durées de cooldown).

7. **Ajout de Contenu** :
   - Introduire de nouveaux types d'ennemis, armes, ou compétences pour enrichir le gameplay.
   - Ajouter des niveaux ou des environnements variés pour diversifier l'expérience de jeu.

8. **Tests Unitaires** :
   - Écrire des tests unitaires pour les fonctions critiques (collisions, spawn sécurisé, etc.) afin de garantir la stabilité du jeu.

9. **Accessibilité** :
   - Ajouter des options pour les joueurs ayant des besoins spécifiques (par exemple, des contrôles personnalisables ou des modes daltoniens).

10. **Effets Visuels et Sonores** :
    - Ajouter des effets sonores pour les actions (tir, dégâts, montée de niveau, etc.).
    - Intégrer des animations ou des effets de particules pour rendre le jeu plus immersif.

Avec ces améliorations, le jeu pourrait devenir plus performant, engageant et accessible pour les joueurs. L'architecture actuelle permet déjà une bonne extensibilité, ce qui facilite l'ajout de nouvelles fonctionnalités.