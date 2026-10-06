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
| L'adresse e-mail (protégée contre le spam) | script.js | `CONFIG.contactEmail` (en 2 morceaux : `user` et `domain`) |
| Les images / vidéos d'un projet          | script.js  | `PROJECT_IMAGES` (section 0)                    |
| Ajouter ou retirer une page projet       | script.js  | un bloc dans `PROJECT_IMAGES` + un texte dans `projects` (fr, en, es, it) |
| Titre et texte d'un projet               | script.js  | `CONFIG.i18n.fr.projects` (et en / es / it)          |
| Ville, « Qui suis-je », « Let's talk »   | script.js  | `CONFIG.i18n.fr` (et en / es / it)                   |
| Les images « Qui suis-je »               | script.js  | `CONFIG.aboutImages` (une par langue)           |
| Couleurs inversées de « Qui suis-je »    | style.css  | `--about-invert` (1 = inversées, 0 = d'origine) |
| Ajouter une langue                       | script.js + index.html | copier une rubrique de `CONFIG.i18n` + un bouton dans `.lang` |
| Temps de lecture du texte d'un projet    | script.js  | `CONFIG.horizontal.textHold`                    |
| Images des projets (hauteur, écart)      | style.css  | `--slide-h`, `--slide-max-w`, `--slide-gap`     |
| Textes des projets (taille, largeur, gris) | style.css | `--title-size`, `--desc-size`, `--intro-w`, `--text-w`, `--word-dim` |
| Douceur du défilement                    | script.js  | `CONFIG.smoothScroll` (`lerp`, `magnet`…)       |
| Mouvement du « ? »                       | script.js  | `CONFIG.questionMark` ; taille : `--q-size` (style.css) |
| Mouvement des lettres                    | script.js  | `CONFIG.letterPhysics`                          |
| Couleurs du site                         | style.css  | section 1, `--ink`, `--paper`…                  |
| Couleurs de la dernière page             | style.css  | `--color-footer-bg` (fond, noir) et `--color-footer-text` (textes + « Let's talk », blanc) |
| Langue choisie / non choisie             | style.css  | section 4, `.lang button` (opacité, sans soulignement) |
| Taille du mot « kaya »                   | style.css  | `--kaya-size`, `--kaya-width`                   |
| Taille de « Let's talk » (au centre)     | style.css  | `--talk-w` (largeur max), `--talk-h` (hauteur max) |
| Message « Adresse copiée »               | script.js  | `CONFIG.i18n.<langue>.mailCopied`               |
| Espacement des lettres de « Let's talk » | style.css  | `--talk-tracking` (positif = plus espacé, négatif = plus serré) |
| Marges autour de l'écran                 | style.css  | `--edge-x`, `--edge-y`                          |
| Taille du rond du curseur                | style.css  | `--cursor-size`                                 |
| Réglages pour téléphone / tablette       | style.css  | section 9 (mêmes variables, autres valeurs)     |

## Comment fonctionne l'adaptation aux écrans

Les valeurs de la section 1 de `style.css` valent pour les ordinateurs.
La section 9 les remplace selon l'écran :

- tablette (≤ 1024 px de large) ;
- téléphone en portrait (≤ 700 px) ;
- écran peu haut, par exemple un téléphone couché (≤ 500 px de haut) ;
- très petit téléphone (≤ 360 px) ;
- très grand écran (≥ 1800 px).

Pour ajuster un type d'écran, change la variable dans le bloc correspondant de la section 9.

**Page 1.** Langues en haut à droite. **Dernière page.** « Let's talk » au centre ; sa taille s'adapte à l'écran.

**Bas de page (ville, e-mail).** Le script vérifie s'ils tiennent sur une ligne sans se toucher.
Sinon, ils s'empilent automatiquement à droite (la ville au-dessus de l'e-mail). Rien à régler.

## Tester le site

Ouvre de préférence le site **via un petit serveur local**, pas en double-cliquant sur `index.html`
(certains navigateurs limitent les vidéos et les polices en `file://`).

Exemple : dans le dossier du site, lance `python3 -m http.server` puis ouvre `http://localhost:8000`.
Dans VS Code, l'extension « Live Server » fait la même chose.

Avant la mise en ligne, mets `CONFIG.showMissingImages` sur `false`.


## Version 2 — notes

- **Page d'accueil noire** : fond noir, textes blancs.
- **« kaya » tombe** du haut de la page (gravité, rebonds, lettres qui s'empilent et s'imbriquent), repoussé par le curseur
  ou le doigt. Réglages : constante `G` dans `createFallingWord` (script.js) et `CONFIG.letterPhysics`.
- **Infos rigides** : ville, « Qui suis-je » et e-mail sont poussés par les lettres et le curseur, sans déformation,
  puis reviennent à leur place.
- **Glitch** : à l'arrivée sur la page 1 (`initGlitch`), la page clignote en négatif et l'image « Qui suis-je » de la langue
  en cours apparaît sous les infos, en couleurs inversées. Les lettres retombent à chaque retour sur la page.
- Le glissement d'accueil est conservé, mais décalé à 2,2 s pour laisser finir le glitch (`CONFIG.scrollHint.delay`).


## Mise à jour — accueil, e-mail, carrousels

- **Page 1** : plus de bouton « Qui suis-je » (il reste sur la dernière page) ; à la place, un grand signe **▾** en bas au centre
  (`.scroll-cue`, style.css section 13) qui descend à la page suivante. Le glissement d'accueil est désactivé
  (`CONFIG.scrollHint.enabled: false`).
- **E-mail** cliquable (ordinateur, téléphone, tablette) : zone de toucher élargie, et le curseur ne le repousse plus
  (seules les lettres peuvent le pousser). Il ouvre le logiciel de messagerie par défaut (`mailto:`).
- **Carrousels des pages projets** :
  - clic = image agrandie ; elle a ses propres flèches (mêmes symboles `>`), les touches ← →, le glissement du doigt ou du trackpad ;
  - dans la page, ← → (clavier), glisser à droite / à gauche au trackpad, ou glisser du doigt changent d'image ;
  - zone de clic des flèches agrandie (style.css : `.carousel-arrow::after`, valeurs `inset`).
- **Projet 1 (page 2)** : la vidéo est en 2e position du carrousel (`PROJECT_IMAGES`, script.js).


## Version 3 — notes

- **E-mail anti-spam** : `kayamahler@eduvaud.ch` n'est jamais écrit en clair dans la page. Le script l'assemble à partir de `CONFIG.contactEmail` (deux morceaux) et le « @ » vient du CSS (`.m-at`). Le lien `mailto:` fonctionne au clic et au toucher, avec une grande zone de clic. Cela arrête les collecteurs d'adresses courants ; aucun site n'est protégé à 100 %.
- **Curseur** : rond plus grand (`--cursor-size`, 24 px).
- **Page 1** : un clic sur une lettre de « kaya » ouvre la même image que « Qui suis-je » (`openAboutFromWord`). La langue, la ville et l'e-mail tombent du haut de la page avec les lettres. Le glitch se rejoue aussi à chaque changement de langue (`playGlitch`). Le ▾ est plus grand.
- **Astérisque supprimé** : à la place, dans l'image agrandie, un « ? » (police Africa) tombe du haut de la page. Au clic, l'image devient noire et le texte du projet s'écrit en blanc (police Alaska), à la plus grande taille qui remplit le cadre. Un clic sur le texte ou sur « ? » le referme. La vitesse d'écriture se règle avec `CONFIG.typeSpeed`.
- **Flèches** : zone de clic plus grande (`.carousel-arrow::after`).
- **Téléphone** : images en carré 1:1 sur fond noir (section 15 de `style.css`), dans les carrousels comme dans l'image agrandie.
- **Textes des projets** : mis à jour en FR, EN, ES et IT (`CONFIG.i18n.<langue>.projects`).


## Version 4 — notes

- **Page d'accueil** : l'image d'accueil (`CONFIG.heroImage`, `images/accueil.jpg`) est de nouveau en fond, sur toute la page, à 50 % d'opacité (`--hero-image-opacity` dans style.css). Sur téléphone, elle remplit tout l'écran.
- **« Qui suis-je »** est de retour au centre du bas de la page d'accueil, entre la ville et l'e-mail. Le ▾ reste au-dessus.
- **« kaya »** bouge maintenant exactement comme « Let's talk » : les lettres sont repoussées par le curseur ou le doigt, puis reviennent à leur place (`createInteractiveWord`). Tailles et écarts : `--kaya-size`, `--kaya-width`, `--kaya-gap`, `--kaya-last-gap`.
- **Glitch supprimé**, ainsi que la chute des lettres et des infos.
- **Téléphone** : les images des carrousels ne s'agrandissent plus. Le « ? » est toujours visible en haut à gauche de chaque page projet ; un toucher affiche le texte du projet sur l'image, un autre toucher le referme. Sur ordinateur et tablette, rien ne change (clic = image agrandie, avec son « ? »).
- **Microtypographie** (automatique, fonction `typo` dans script.js) : apostrophes ’, tirets 2026–2027, espaces fines insécables en français avant ; ! ? et dans « », espace insécable avant :, guillemets «…» sans espace en espagnol et en italien, mots de 1 ou 2 lettres jamais en fin de ligne, pas de mot court isolé en dernière ligne. Tu écris normalement dans `CONFIG`, le site corrige à l'affichage.
- **Drapeau des textes explicatifs** (style.css, section 14) : fins de ligne équilibrées (`text-wrap: pretty`), césure discrète dans la langue affichée (mots d'au moins 8 lettres), crénage et ligatures activés. Les lignes ne bougent pas pendant l'effet machine à écrire.
- **Espagnol** : « Lausana, Suiza » (nom espagnol de la ville).


## Version 5 — notes

- **« ? » de l'image agrandie** (ordinateur et tablette, toutes les pages projets) : à chaque ouverture d'une image, il tombe du haut de la page du côté droit, rebondit, bascule et reste couché en bas à droite. Il reste cliquable. Réglages dans style.css, section 14 : `--q-size`, `--q-right`, `--q-bottom`, `--q-settle`, `--q-angle` (90deg = couché vers la droite, -90deg = vers la gauche) et la durée `1.8s`.
- Sur téléphone, rien ne change : les images ne s'agrandissent pas et le « ? » reste visible en haut à gauche de la page projet.


## Version 6 — notes

- **Défilement fluide** (inspiré de 3dlogogif.com) : sur ordinateur, la molette et le trackpad font glisser le site avec de l'inertie au lieu de sauter de page en page (`initSmoothScroll`, réglages `CONFIG.smoothScroll` : `lerp` = douceur, `wheelMultiplier` = distance par cran). Les projets défilent librement ; la page 1 et la dernière page se calent toutes seules quand on s'en approche (`magnet`). Clavier : ↑ ↓, Espace, Page préc./suiv., Début, Fin. Sur téléphone, le défilement natif (déjà fluide) est gardé.
- **Projets en galerie** : les carrousels sont remplacés par une galerie par projet (n° + titre, puis toutes les images). Chaque image est dans un cadre en position relative à ses propres proportions, en `object-fit: contain` : elle est toujours **entière**. Les images d'une même ligne ont la même hauteur (`--row-h`). Elles apparaissent en douceur quand elles entrent dans l'écran. Les vidéos tournent en boucle, sans son, quand elles sont visibles.
- **Image agrandie** : clic (ou toucher, aussi sur téléphone) sur une image = plein écran, avec flèches, ← →, glissement ; la vidéo y a le son.
- **« ? » en mouvement** : un seul « ? », en bas à droite, visible tant qu'un projet est à l'écran (et dans l'image agrandie). Il flotte, penche selon la vitesse du défilement et fait une pirouette à chaque nouveau projet. Clic = texte du projet visible (machine à écrire) ; si le texte est ouvert et qu'on passe au projet suivant, il est réécrit avec le texte de ce projet. Clic sur le texte, sur « ? » ou Échap = fermeture.
- Supprimé : carrousels, flèches à couleur de contraste, « ? » qui tombe dans l'image agrandie, « ? » en haut à gauche sur téléphone, réglages `slideInterval`, `contrastColors`…


## Version 7 — notes

- **Responsive** : vérifié sur ordinateur, très grand écran (2560 px), tablette, téléphone, petit téléphone (320 px) et téléphone couché. Nouveaux réglages pour les très petits et très grands écrans (section 9 de style.css), zones de toucher agrandies (langues, « Qui suis-je », e-mail).
- **« Qui suis-je »** : bouton bien visible (pastille contour blanc, fond sombre flouté, s'inverse au survol ou au toucher), en haut à GAUCHE de la page 1, face aux langues. Sur la dernière page, il est en haut à droite. Il n'est plus en bas de page.
- **Dernière page** : l'image « Qui suis-je » de la langue en cours sert de fond, en couleurs inversées (`.footer-bg`). « Let's talk! » est en haut à gauche, avec ses lettres mobiles ; les lettres, la ville et l'e-mail s'inversent sur les parties claires du fond pour rester lisibles.
- **E-mail fiable sur tous les appareils** : un clic ou un toucher sur « Let's talk », sur une de ses lettres ou sur l'adresse ouvre la messagerie par un vrai lien `mailto:` (méthode la plus compatible : iPhone, Android, tablettes, ordinateurs, navigateurs intégrés). L'adresse est en plus copiée et affichée quelques secondes en bas de l'écran (« Adresse copiée · … »), utile sur un ordinateur sans logiciel de messagerie. L'adresse reste invisible pour les robots.


## Version 8 — notes

- **Défilement et images inspirés de cominvi.com.mx** : chaque image monte derrière un cache (elle se découvre de bas en haut) en dézoomant légèrement, au rythme du défilement. Une fois entièrement à l'écran, elle est entière et nette. En remontant, l'effet se rejoue à l'envers. Au survol d'une image, les autres s'assombrissent. Réglages : `CONFIG.scrollFx.imageReveal`, `--image-zoom`.
- **Textes explicatifs dans la page** : chaque projet affiche son numéro (« 01 / 06 »), son titre (qui glisse hors d'un cache) et son texte. Les mots s'allument un à un, du gris au blanc, au fil du défilement ; un trait fin sous le titre se trace en même temps. Sur ordinateur et tablette, le texte reste collé à gauche pendant que les images défilent à droite (un texte plus haut que l'écran remonte jusqu'à sa fin, puis reste collé). Sur téléphone, le texte est au-dessus des images. Réglages : `CONFIG.scrollFx.textSpeed`, `--word-dim`, `--title-size`, `--desc-size`, `--aside-w`.
- **« ? »** : toujours en mouvement ; un clic ramène maintenant au début du texte du projet visible (dans l'image agrandie : elle se ferme d'abord). Le bloc noir avec effet machine à écrire est supprimé (`CONFIG.typeSpeed` aussi).
- **« Qui suis-je »** : plus de contour ; pastille au fond sombre, toujours bien lisible.


## Version 9 — notes

- **Ordre des pages** : page 1 (« kaya ») → page « Qui suis-je » (l'image de la langue en cours, entière, sur fond blanc ; elle se pose en douceur pendant qu'on arrive) → projets → « Let's talk ». Le ▾ de la page 1 mène à la page « Qui suis-je ». Sur ordinateur, ces trois pages plein écran se calent toutes seules.
- **Projets en défilement horizontal** (inspiré de hugeinc.com) : on fait défiler normalement vers le bas, l'écran reste fixe et la bande du projet glisse vers la gauche : n° + grand titre, puis les images, qui arrivent de côté (entières, toutes à la même hauteur, `--slide-h`), puis le texte. Une fine barre en bas montre l'avancée dans le projet. Sur trackpad, un geste horizontal fait aussi avancer.
- **Texte après la dernière image** : il entre à la fin de la bande, et ses mots s'allument un à un au fil du défilement ; la bande reste immobile le temps de lire (`CONFIG.horizontal.textHold`), puis le projet suivant arrive.
- **« ? »** : un clic mène directement au texte du projet visible.
- Le bouton « Qui suis-je » ouvre toujours l'image en plein écran depuis la page 1 et la dernière page.


## Version 10 — notes

- **Dernière page** : fond noir uni (l'image « Qui suis-je » inversée est retirée). « Let's talk! » est de retour au **centre** de la page, avec ses lettres mobiles ; un clic ou un toucher dessus ouvre toujours la messagerie.
- **Bouton « Qui suis-je » supprimé** (page 1 et dernière page). L'image « Qui suis-je » reste sur la page 2, et un clic sur une lettre de « kaya » l'ouvre toujours en plein écran.


## Version 11 — notes

- **« Qui suis-je » en couleurs inversées** : sur la page 2 et en plein écran (clic sur « kaya »), l'image est inversée, et son fond blanc devient noir avec elle. Pour revenir aux couleurs d'origine : `--about-invert: 0;` (style.css, section 1).
