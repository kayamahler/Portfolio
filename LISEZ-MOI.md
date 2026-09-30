# Projet Kaya — guide de modification

Le site tient en 3 fichiers, plus 2 dossiers à placer à côté :

```
index.html     la structure des pages (rarement à modifier)
style.css      l'apparence : polices, couleurs, tailles, positions
script.js      le contenu (images, textes, e-mail) et le fonctionnement
fonts/         les polices Africa et Alaska
images/        toutes les images et la vidéo
```

## Où modifier quoi

| Je veux changer…                         | Fichier    | Où                                              |
|------------------------------------------|------------|-------------------------------------------------|
| L'adresse e-mail                         | script.js  | `CONFIG.contactEmail`                           |
| Les images / vidéos d'un projet          | script.js  | `PROJECT_IMAGES` (section 0)                    |
| Ajouter ou retirer une page projet       | script.js  | un bloc dans `PROJECT_IMAGES` + un texte dans `projects` (fr, en, es, it) |
| Titre et texte d'un projet               | script.js  | `CONFIG.i18n.fr.projects` (et en / es / it)          |
| Ville, « Qui suis-je », « Let's talk »   | script.js  | `CONFIG.i18n.fr` (et en / es / it)                   |
| Les images « Qui suis-je »               | script.js  | `CONFIG.aboutImages` (une par langue)           |
| Ajouter une langue                       | script.js + index.html | copier une rubrique de `CONFIG.i18n` + un bouton dans `.lang` |
| Vitesse des carrousels / de l'écriture   | script.js  | `CONFIG.slideInterval`, `typeSpeed`…            |
| Mouvement des lettres                    | script.js  | `CONFIG.letterPhysics`                          |
| Couleurs du site                         | style.css  | section 1, `--ink`, `--paper`…                  |
| Couleurs de la dernière page             | style.css  | `--color-footer-bg` (fond, noir) et `--color-footer-text` (textes + « Let's talk », blanc) |
| Langue choisie / non choisie             | style.css  | section 4, `.lang button` (opacité, sans soulignement) |
| Taille du mot « kaya »                   | style.css  | `--kaya-size`, `--kaya-width`                   |
| Taille de « Let's talk »                 | style.css  | `--talk-size`, `--talk-width`                   |
| Espacement des lettres de « Let's talk » | style.css  | `--talk-tracking` (positif = plus espacé, négatif = plus serré) |
| Marges autour de l'écran                 | style.css  | `--edge-x`, `--edge-y`                          |
| Glissement d'accueil (indice de défilement) | style.css + script.js | `--peek-distance`, `--peek-duration` · `CONFIG.scrollHint` (activer, délai) |
| Réglages pour téléphone / tablette       | style.css  | section 9 (mêmes variables, autres valeurs)     |

## Comment fonctionne l'adaptation aux écrans

Les valeurs de la section 1 de `style.css` valent pour les ordinateurs.
La section 9 les remplace selon l'écran :

- tablette (≤ 1024 px de large) ;
- téléphone en portrait (≤ 700 px) ;
- écran peu haut, par exemple un téléphone couché (≤ 500 px de haut) ;
- très grand écran (≥ 1800 px).

Pour ajuster un type d'écran, change la variable dans le bloc correspondant de la section 9.

**Bas de page (ville, « Qui suis-je », e-mail).** Le script vérifie s'ils tiennent sur une ligne sans se toucher.
Sinon (écran étroit, texte plus long dans une autre langue, e-mail long), ils s'empilent automatiquement à droite :
« Qui suis-je », puis la ville, puis l'e-mail. Rien à régler.

**« Let's talk »** est toujours centré dans la dernière page ; sa taille s'adapte à l'écran.

## Tester le site

Ouvre le site **via un petit serveur local**, pas en double-cliquant sur `index.html`.
Sinon Chrome bloque l'analyse des couleurs, et le texte et les flèches passent en couleurs inversées.

Exemple : dans le dossier du site, lance `python3 -m http.server` puis ouvre `http://localhost:8000`.
Dans VS Code, l'extension « Live Server » fait la même chose.

Avant la mise en ligne, mets `CONFIG.showMissingImages` sur `false`.
