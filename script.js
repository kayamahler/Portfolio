/* =====================================================================
   PROJET KAYA — script.js
   ---------------------------------------------------------------------
   COMMENT LIRE CE FICHIER
   • Sections 0 et 1 (marquées ★) : c'est là que tu modifies le contenu
     du site (images, vidéos, textes, e-mail, vitesses, réglages).
   • Sections 2 à 7 : le « moteur » du site. Chaque bloc commence par un
     commentaire qui explique ce qu'il fait. Pas besoin d'y toucher pour
     changer le contenu.
   • Les tailles et positions à l'écran (taille de « kaya », du titre
     « Let's talk »…) se règlent dans style.css,
     section 1 : le script les lit directement là-bas.

   PLAN
     0. ★ IMAGES / VIDÉOS DES PAGES PROJETS   (PROJECT_IMAGES)
     1. ★ RÉGLAGES ET TEXTES FR / EN / ES / IT (CONFIG)
     2. OUTILS                                 chargement des images, couleur de contraste
     3. MOTS INTERACTIFS                       « kaya » et « Let's talk »
     4. PAGES PROJETS                          carrousels, flèches, texte, agrandissement
     5. « QUI SUIS-JE »
     6. PAGE 1 & DERNIÈRE PAGE                 image d'accueil, e-mail, bas de page
     7. CURSEUR, LANGUE, iOS, DÉMARRAGE
   ===================================================================== */
"use strict";


/* =====================================================================
   0. ★ IMAGES / VIDÉOS DES PAGES PROJETS
   ---------------------------------------------------------------------
   • Chaque bloc [ ... ] = UNE page projet (le 1er bloc = page 2, etc.).
   • "images/nom.jpg"             = une image du carrousel.
   • { video: "images/nom.mp4" }  = une vidéo : elle est jouée en entier
                                    avant de passer à l'élément suivant.
   • Ajouter une page : copie un bloc entier, colle-le à la suite, puis
     ajoute son titre et son texte dans CONFIG.i18n.fr/en/es.projects,
     à la même position (3e bloc = 3e texte).
   • L'extension des IMAGES est retrouvée toute seule (.jpg, .webp, .png…).
     Pour les VIDÉOS, le chemin doit être exact.
   • Chemins relatifs à index.html : le dossier « images » est à côté.
   ===================================================================== */
const PROJECT_IMAGES = [
  // ---- Projet 1 (page 2) ----
  [
    "images/projet1-1.webp",
    { video: "images/projet1-video.mp4" }, // ★ chemin réel de la vidéo (2e élément du carrousel)
    "images/projet1-2.webp",
  ],
  // ---- Projet 2 (page 3) ----
  [
    "images/projet2-1.webp",
    "images/projet2-2.webp",
    "images/projet2-3.png",
    "images/projet2-4.png",
    
  ],
  // ---- Projet 3 (page 4) ----
  [
    "images/projet3-1.jpg",
    "images/projet3-2.jpg",
    "images/projet3-3.jpg",
    "images/projet3-4.jpg",
    "images/projet3-5.jpg",
    "images/projet3-6.jpg",
  ],
  // ---- Projet 4 (page 5) ----
  [
    "images/projet4-1.jpg",
    "images/projet4-2.jpg",
    "images/projet4-3.jpg",
    "images/projet4-4.jpg",
  ],
  // ---- Projet 5 (page 6) ----
  [
    "images/projet5-1.jpg",
    "images/projet5-2.jpg",
    "images/projet5-3.jpg",
    
  ],
  // ---- Projet 6 (page 7) ----
  [
    "images/projet6-1.jpg",
    "images/projet6-2.jpg",
    "images/projet6-3.jpg",
    
  ],
];


/* =====================================================================
   1. ★ RÉGLAGES ET TEXTES
   ===================================================================== */
const CONFIG = {
  // ---- Contact : l'adresse e-mail, COUPÉE EN DEUX volontairement ----
  // Elle n'existe jamais en clair dans la page : le script l'assemble quand
  // on la touche ou la clique. Les robots de spam qui lisent le code source
  // n'y trouvent donc aucune adresse.
  contactEmail: { user: "kayamahler", domain: "eduvaud.ch" },

  // ---- Langue affichée à la première visite : "fr", "en", "es" ou "it" ----
  defaultLang: "fr",

  // ---- Vitesses (en millisecondes : 1000 ms = 1 seconde) ----
  typeSpeed: 14,                 // texte des projets (« ? ») : machine à écrire rapide, délai entre deux lettres
  slideInterval: 2000,           // carrousels : durée d'affichage d'une image
  slideIntervalAfterClick: 4000, // … après un clic sur une flèche
  videoFallbackDuration: 25000,  // sécurité : si une vidéo ne signale pas sa fin, on passe à la suite

  // ---- Couleur de contraste (texte des projets + flèches) ----
  // Le site mesure la luminosité de l'image SOUS le texte et SOUS chaque flèche.
  contrastColors: { onLight: "#000", onDark: "#fff" }, // fond clair → noir, fond sombre → blanc
  contrastThreshold: 0.55,       // de 0 à 1 : au-dessus, le fond est considéré comme clair
  contrastRefresh: 400,          // fréquence de la mesure (suit aussi les vidéos)

  // ---- Mouvement des lettres (« kaya » et « Let's talk ») ----
  letterPhysics: {
    repelRadius: 2.4,   // zone d'influence du curseur, en « tailles de lettre »
    repelStrength: 2,   // force de base de la répulsion
    speedBoost: 0.4,    // répulsion supplémentaire quand le curseur va vite
    spring: 0.02,       // force du retour à la place d'origine (plus grand = plus rapide)
    damping: 0.88,      // freinage (plus proche de 1 = plus « glissant »)
    maxTilt: 0.5,       // inclinaison max des lettres (en radians, 0.5 ≈ 29°)
    gyroStrength: 6,    // force du gyroscope sur téléphone
  },

  // ---- Images fixes ----
  heroImage: "images/accueil.jpg", // page 1 : image de fond à 50 % d'opacité

  // ---- « Qui suis-je » : une image par langue ----
  aboutImages: {
    fr: "images/qui-suis-je-fr.svg",
    en: "images/qui-suis-je-en.svg",
    es: "images/qui-suis-je-es.svg",
    it: "images/qui-suis-je-it.svg",
  },

  // ---- Aide pendant la construction du site ----
  showMissingImages: true, // true = liste les images introuvables à l'écran. Mettre false à la mise en ligne.
  imageExtensions: ["webp", "jpg", "jpeg", "png", "avif", "gif", "JPG", "JPEG", "PNG", "WEBP"],

  // ---- Textes (une rubrique par langue, mêmes clés partout) ----
  // Ajouter une langue : copie une rubrique entière (ex. "it: { … }"), change
  // son code et ses textes, puis ajoute un bouton dans index.html (.lang).
  i18n: {
    fr: {
      gyroText: "Autoriser le capteur de mouvement pour animer les lettres ?",
      gyroAllow: "Autoriser",
      gyroDecline: "Refuser",
      aboutLabel: "Qui suis-je",
      aboutClose: "Fermer",
      contactCity: "Lausanne, Suisse",
      letsTalkTitle: "Let's talk!", // titre de la dernière page
      // Un { title, text } par page projet, dans le même ordre que PROJECT_IMAGES.
      projects: [
        { title: "AGENDA ERACOM",
          text: "Projet réalisé dans un cadre scolaire\nAgenda de l'ERACOM 2026-2027\n\nConception réalisée en collaboration avec Gabriel Perreira.\nRéalisation de la mise en page : Gabriel Perreira.\nRéalisation photographie : Kaya Mahler.\n\nLe mandat demandait de créer un agenda fonctionnel et intéressant pour les élèves de l'ERACOM. Notre ambition a été de créer un objet qui réunisse les filières de l'école, en mettant en valeur la matière et les élèves au cœur de l'action. Le projet s'articule autour d'une série de 50 photographies qui viennent rythmer l'année en racontant une histoire, celle de la vie au sein de l'établissement. Nous voulions mettre en lumière les coulisses des différentes formations." },
        { title: "PORTES OUVERTES",
          text: "Projet réalisé dans un cadre scolaire\nPortes ouvertes de l'ERACOM 2026-2027\n\nLe mandat demandait de créer une affiche annonçant les futures portes ouvertes de l'établissement avec comme thème « La Suisse est géniale ». Les mandants proposaient différents axes ; j'ai choisi l'absurde.\n\nLe concept repose sur un détournement d'objets : un économe, un carac et de la crème à café." },
        { title: "NIFFF",
          text: "Le mandat demandait de créer une affiche pour la 25ᵉ édition du Neuchâtel International Fantastic Film Festival, en respectant leur identité.\n\nJ'ai fait le choix de travailler avec de la pâte polymère pour concevoir des organes humains, puis de les mettre en scène avec des parties récupérées de déchets électroniques. L'ensemble a été photographié afin de créer un visuel qui intègre l'humain et la machine." },
        { title: "TYPO 2026",
          text: "Typographie commencée dans un cadre scolaire et développée à titre personnel." },
        { title: "VIDY FLYER 2024",
          text: "Le mandat demandait de créer un dépliant pour l'une des œuvres présentées au Théâtre de Vidy, en conservant l'identité du théâtre. Le dépliant devait transmettre la sensation de la pièce." },
        { title: "AFFICHE 2024",
          text: "Projet réalisé dans un cadre scolaire\nWorkshop avec Guillaume Besson.\n\nTirage au sort d'une recette. Création d'un visuel. Contrainte de deux couleurs." },
      ],
    },
    en: {
      gyroText: "Allow motion sensors to animate the letters?",
      gyroAllow: "Allow",
      gyroDecline: "Decline",
      aboutLabel: "Who am I",
      aboutClose: "Close",
      contactCity: "Lausanne, Switzerland",
      letsTalkTitle: "Let's talk!",
      projects: [
        { title: "ERACOM AGENDA",
          text: "Project carried out as part of my studies\nERACOM Agenda 2026-2027\n\nDesigned in collaboration with Gabriel Perreira.\nLayout: Gabriel Perreira.\nPhotography: Kaya Mahler.\n\nThe brief was to create a functional and engaging planner for ERACOM students. Our ambition was to make an object that brings together the school's departments, highlighting the materials and the students at the heart of the action. The project is built around a series of 50 photographs that punctuate the year while telling a story: the life within the school. We wanted to shine a light on what goes on behind the scenes of the different programmes." },
        { title: "OPEN DAYS",
          text: "Project carried out as part of my studies\nERACOM Open Days 2026-2027\n\nThe brief was to create a poster announcing the school's upcoming open days, on the theme “Switzerland is great”. The clients suggested several approaches; I chose the absurd.\n\nThe concept relies on diverting everyday objects: a peeler, a carac (a small Swiss chocolate tartlet) and a coffee creamer." },
        { title: "NIFFF",
          text: "The brief was to create a poster for the 25th edition of the Neuchâtel International Fantastic Film Festival, respecting its visual identity.\n\nI chose to work with polymer clay to make human organs, then staged them with parts salvaged from electronic waste. The whole was photographed to create a visual that merges human and machine." },
        { title: "TYPO 2026",
          text: "Typeface begun as part of my studies and developed on a personal basis." },
        { title: "VIDY FLYER 2024",
          text: "The brief was to create a folded leaflet for one of the works presented at the Théâtre de Vidy, keeping the theatre's identity. The leaflet had to convey the feeling of the play." },
        { title: "POSTER 2024",
          text: "Project carried out as part of my studies\nWorkshop with Guillaume Besson.\n\nA recipe drawn at random. Creation of a visual. Limit of two colours." },
      ],
    },
    es: {
      gyroText: "¿Permitir los sensores de movimiento para animar las letras?",
      gyroAllow: "Permitir",
      gyroDecline: "Rechazar",
      aboutLabel: "¿Quién soy?",
      aboutClose: "Cerrar",
      contactCity: "Lausanne, Suiza",
      letsTalkTitle: "¡Hablemos!",
      projects: [
        { title: "AGENDA ERACOM",
          text: "Proyecto realizado en un contexto escolar\nAgenda de la ERACOM 2026-2027\n\nDiseño realizado en colaboración con Gabriel Perreira.\nMaquetación: Gabriel Perreira.\nFotografía: Kaya Mahler.\n\nEl encargo consistía en crear una agenda funcional e interesante para los alumnos de la ERACOM. Nuestra ambición fue crear un objeto que reuniera las distintas especialidades de la escuela, poniendo en valor la materia y a los alumnos en el centro de la acción. El proyecto se articula en torno a una serie de 50 fotografías que marcan el ritmo del año contando una historia: la de la vida dentro del centro. Quisimos dar a conocer los entresijos de las diferentes formaciones." },
        { title: "PUERTAS ABIERTAS",
          text: "Proyecto realizado en un contexto escolar\nPuertas abiertas de la ERACOM 2026-2027\n\nEl encargo consistía en crear un cartel que anunciara las próximas jornadas de puertas abiertas del centro, con el tema «Suiza es genial». Los clientes propusieron distintos enfoques; elegí lo absurdo.\n\nEl concepto se basa en el desvío de objetos: un pelapatatas, un carac (pastelito suizo de chocolate) y una nata de café." },
        { title: "NIFFF",
          text: "El encargo consistía en crear un cartel para la 25.ª edición del Neuchâtel International Fantastic Film Festival, respetando su identidad.\n\nDecidí trabajar con arcilla polimérica para crear órganos humanos y luego escenificarlos con piezas recuperadas de residuos electrónicos. El conjunto se fotografió para crear un visual que integra al ser humano y la máquina." },
        { title: "TYPO 2026",
          text: "Tipografía iniciada en un contexto escolar y desarrollada a título personal." },
        { title: "FOLLETO VIDY 2024",
          text: "El encargo consistía en crear un folleto para una de las obras presentadas en el Théâtre de Vidy, conservando la identidad del teatro. El folleto debía transmitir la sensación de la obra." },
        { title: "CARTEL 2024",
          text: "Proyecto realizado en un contexto escolar\nTaller con Guillaume Besson.\n\nSorteo de una receta. Creación de un visual. Limitación a dos colores." },
      ],
    },
    it: {
      gyroText: "Consentire i sensori di movimento per animare le lettere?",
      gyroAllow: "Consenti",
      gyroDecline: "Rifiuta",
      aboutLabel: "Chi sono",
      aboutClose: "Chiudi",
      contactCity: "Losanna, Svizzera",
      letsTalkTitle: "Parliamo!",
      projects: [
        { title: "AGENDA ERACOM",
          text: "Progetto realizzato in ambito scolastico\nAgenda dell'ERACOM 2026-2027\n\nIdeazione realizzata in collaborazione con Gabriel Perreira.\nImpaginazione: Gabriel Perreira.\nFotografia: Kaya Mahler.\n\nL'incarico richiedeva di creare un'agenda funzionale e interessante per gli studenti dell'ERACOM. La nostra ambizione è stata creare un oggetto che riunisse i diversi indirizzi della scuola, mettendo in risalto la materia e gli studenti al centro dell'azione. Il progetto si articola attorno a una serie di 50 fotografie che scandiscono l'anno raccontando una storia, quella della vita all'interno dell'istituto. Volevamo mettere in luce il dietro le quinte delle diverse formazioni." },
        { title: "PORTE APERTE",
          text: "Progetto realizzato in ambito scolastico\nPorte aperte dell'ERACOM 2026-2027\n\nL'incarico richiedeva di creare un manifesto per annunciare le prossime porte aperte dell'istituto, sul tema « La Svizzera è geniale ». I committenti proponevano diversi approcci; ho scelto l'assurdo.\n\nIl concetto si basa sul riutilizzo improprio di oggetti: un pelapatate, un carac (dolcetto svizzero al cioccolato) e una panna da caffè." },
        { title: "NIFFF",
          text: "L'incarico richiedeva di creare un manifesto per la 25ª edizione del Neuchâtel International Fantastic Film Festival, nel rispetto della loro identità.\n\nHo scelto di lavorare con la pasta polimerica per realizzare organi umani, per poi metterli in scena con parti recuperate da rifiuti elettronici. L'insieme è stato fotografato per creare un visual che integra l'umano e la macchina." },
        { title: "TYPO 2026",
          text: "Carattere tipografico iniziato in ambito scolastico e sviluppato a titolo personale." },
        { title: "PIEGHEVOLE VIDY 2024",
          text: "L'incarico richiedeva di creare un pieghevole per una delle opere presentate al Théâtre de Vidy, mantenendo l'identità del teatro. Il pieghevole doveva trasmettere la sensazione dello spettacolo." },
        { title: "MANIFESTO 2024",
          text: "Progetto realizzato in ambito scolastico\nWorkshop con Guillaume Besson.\n\nEstrazione a sorte di una ricetta. Creazione di un visual. Vincolo di due colori." },
      ],
    },
  },
};

// Langue affichée en ce moment (changée par applyLang, section 7).
let currentLang = CONFIG.defaultLang;


/* =====================================================================
   2. OUTILS
   ===================================================================== */

// Raccourci : $("x") = document.getElementById("x")
const $ = (id) => document.getElementById(id);

// Lit une variable CSS de style.css comme un NOMBRE ("-8px" → -8, "0.28" → 0.28).
function readCSSNumber(varName, fallback) {
  if (!varName) return fallback;
  const n = parseFloat(getComputedStyle(document.documentElement).getPropertyValue(varName));
  return Number.isFinite(n) ? n : fallback;
}
// Lit une variable CSS comme un TEXTE (ex. la police).
function readCSSString(varName, fallback) {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return raw || fallback;
}

// Appelle "callback(true/false)" quand "element" entre / sort de l'écran.
// Sert à mettre en pause ce qui n'est pas visible (économie de batterie).
function watchVisibility(element, callback, threshold = 0) {
  if (!("IntersectionObserver" in window)) { callback(true); return; }
  new IntersectionObserver(([entry]) => callback(entry.isIntersecting), { threshold }).observe(element);
}

// Appelle "callback" quand la taille de "element" change (rotation du
// téléphone, barre d'adresse mobile, fenêtre redimensionnée…).
function watchSize(element, callback) {
  if ("ResizeObserver" in window) new ResizeObserver(() => callback()).observe(element);
  else window.addEventListener("resize", callback);
}

/* ---- Chargement fiable des images -------------------------------------
   Avant d'afficher une image, on vérifie qu'elle existe. Si non, on
   essaie la même image avec d'autres extensions (.jpg, .webp…). Le
   résultat est mémorisé pour ne jamais tester deux fois le même chemin.
   ---------------------------------------------------------------------- */
// E-mail assemblé à la demande (jamais écrit en clair dans la page).
const mailAddress = () => CONFIG.contactEmail.user + String.fromCharCode(64) + CONFIG.contactEmail.domain;
const openMail = () => { window.location.href = "mailto:" + mailAddress(); };

const imageCache = new Map();

function probeImage(url) {
  return new Promise((resolve) => {
    const test = new Image();
    test.onload = () => resolve(true);
    test.onerror = () => resolve(false);
    test.src = url;
  });
}

function resolveImage(path) {
  if (!path) return Promise.resolve(null);
  if (imageCache.has(path)) return imageCache.get(path);
  const base = path.replace(/\.[A-Za-z0-9]+$/, "");
  const candidates = [...new Set([path, ...CONFIG.imageExtensions.map((ext) => base + "." + ext)])];
  const search = (async () => {
    for (const url of candidates) {
      if (await probeImage(url)) return url;
    }
    console.warn("[Kaya] image introuvable :", path);
    return null;
  })();
  imageCache.set(path, search);
  return search;
}

async function setImage(imgElement, path) {
  if (!imgElement) return;
  const url = await resolveImage(path);
  if (url) imgElement.src = url;
}

/* ---- Couleur de contraste ----------------------------------------------
   Mesure la luminosité moyenne (0 = noir, 1 = blanc) de la partie de
   l'image/vidéo visible située SOUS un élément (flèche, texte), en tenant
   compte du recadrage « object-fit: cover ». Renvoie null si impossible.
   ---------------------------------------------------------------------- */
const contrastCanvas = document.createElement("canvas");
contrastCanvas.width = contrastCanvas.height = 16; // 16×16 px suffisent pour une moyenne
const contrastCtx = contrastCanvas.getContext("2d", { willReadFrequently: true });
let contrastBlocked = false; // devient true si le navigateur interdit de lire les pixels

function sampleLuminance(media, box, rect) {
  if (contrastBlocked || !media || !rect.width || !rect.height) return null;
  const isVideo = media.tagName === "VIDEO";
  const iw = isVideo ? media.videoWidth : media.naturalWidth;
  const ih = isVideo ? media.videoHeight : media.naturalHeight;
  if (!iw || !ih || (isVideo && media.readyState < 2)) return null;

  // Où se trouve "rect" dans l'image d'origine ?
  const b = box.getBoundingClientRect();
  if (!b.width || !b.height) return null;
  const scale = Math.max(b.width / iw, b.height / ih); // même calcul que object-fit: cover
  const offX = (b.width - iw * scale) / 2;
  const offY = (b.height - ih * scale) / 2;
  const sx = Math.max(0, (rect.left - b.left - offX) / scale);
  const sy = Math.max(0, (rect.top - b.top - offY) / scale);
  const ex = Math.min(iw, (rect.right - b.left - offX) / scale);
  const ey = Math.min(ih, (rect.bottom - b.top - offY) / scale);
  if (ex - sx < 1 || ey - sy < 1) return null;

  const S = contrastCanvas.width;
  try {
    contrastCtx.clearRect(0, 0, S, S);
    contrastCtx.drawImage(media, sx, sy, ex - sx, ey - sy, 0, 0, S, S);
    const d = contrastCtx.getImageData(0, 0, S, S).data;
    const bgLum = 0.067; // fond #111 visible à travers les parties transparentes
    let sum = 0;
    for (let i = 0; i < d.length; i += 4) {
      const lum = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255;
      const a = d[i + 3] / 255;
      sum += lum * a + bgLum * (1 - a);
    }
    return sum / (d.length / 4);
  } catch (e) {
    // Arrive quand le site est ouvert en double-cliquant sur index.html
    // (file://) dans Chrome : on bascule sur les couleurs inversées (CSS).
    contrastBlocked = true;
    console.warn("[Kaya] Analyse des couleurs impossible ici (site ouvert en file:// ?). Couleurs inversées utilisées à la place.");
    document.querySelectorAll(".project").forEach((s) => s.classList.add("contrast-fallback"));
    return null;
  }
}


/* =====================================================================
   3. MOTS INTERACTIFS (« kaya » et « Let's talk »)
   ---------------------------------------------------------------------
   Chaque lettre est dessinée sur un <canvas> et se comporte comme un
   petit objet physique :
     • repoussée par le curseur / le doigt (ou le gyroscope sur téléphone) ;
     • ramenée à sa place par un ressort (effet « sous l'eau ») ;
     • inclinée dans le sens du mouvement ;
     • jamais superposée à sa voisine.
   Deux façons de placer les lettres :
     • « cercles » (kaya)            : écart identique entre toutes les lettres ;
     • « measureGlyphs » (Let's talk): écart selon la vraie largeur de
                                       chaque lettre → interlettrage régulier et serré.
   Tailles et écarts : variables CSS (style.css, section 1), relues à
   chaque changement de taille d'écran.
   ===================================================================== */
function createInteractiveWord(options) {
  const {
    canvasId,                 // id du <canvas>
    page,                     // la <section> qui contient le canvas
    getChars,                 // fonction qui renvoie la liste des lettres à afficher
    fontFamilyVar, fontFamilyFallback,
    textColor = "#000",            // couleur des lettres (si textColorVar n'est pas donné)
    textColorVar,                  // variable CSS de la couleur (ex. "--color-footer-text")
    sizeVar, defaultSize = 0.28,   // hauteur max des lettres (fraction de la hauteur de page)
    widthVar, defaultWidth = 0.5,  // largeur max du mot (fraction de la largeur de page)
    measureGlyphs = false,
    trackingVar,                   // interlettrage (mode measureGlyphs)
    gapVar, lastGapVar, spacingVar,
    onLetterClick,
  } = options;

  const canvas = $(canvasId);
  if (!canvas || !page) return null;
  const ctx = canvas.getContext("2d");
  const P = CONFIG.letterPhysics;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touchScreen = window.matchMedia("(hover: none) and (pointer: coarse)");
  const fontFamily = readCSSString(fontFamilyVar, fontFamilyFallback);

  let W = 0, H = 0, fontSize = 0;
  let letters = [];
  let settings = {};        // valeurs CSS mémorisées (évite de les relire 60 fois par seconde)
  let started = false, onScreen = false, rafId = null;

  const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };
  let lastSample = null;

  function fontAt(size) { return `${size}px ${fontFamily}`; }

  // Relit les réglages CSS (appelé à chaque changement de taille).
  function readSettings() {
    const baseGap = readCSSNumber(gapVar, 1);
    settings = {
      baseGap,
      lastGap: readCSSNumber(lastGapVar, baseGap),
      extra: readCSSNumber(spacingVar, 0),
      tracking: readCSSNumber(trackingVar, 0),
      size: readCSSNumber(sizeVar, defaultSize),
      width: readCSSNumber(widthVar, defaultWidth),
      color: textColorVar ? readCSSString(textColorVar, textColor) : textColor,
    };
  }

  // Taille des lettres : la plus grande qui respecte --…-size ET --…-width.
  function computeFontSize(chars) {
    if (measureGlyphs) {
      ctx.font = fontAt(100);
      const natural = chars.reduce((sum, c) => sum + ctx.measureText(c).width, 0)
                    + settings.tracking * 100 * (chars.length - 1);
      return Math.min((100 * W * settings.width) / Math.max(natural, 1), H * settings.size);
    }
    const n = Math.max(chars.length, 1);
    return Math.min((W * settings.width) / (n * 0.7), H * settings.size);
  }

  // Calcule la place « de repos » de chaque lettre.
  function layoutLetters() {
    const chars = getChars();
    fontSize = computeFontSize(chars);
    const homeY = H / 2; // le mot est centré verticalement dans sa page

    let widths = null;
    if (measureGlyphs) {
      ctx.font = fontAt(fontSize);
      widths = chars.map((c) => Math.max(ctx.measureText(c).width, fontSize * 0.08));
    }
    const radiusOf = (i) => (measureGlyphs ? widths[i] / 2 : fontSize * 0.36);
    const tracking = measureGlyphs ? settings.tracking * fontSize : 0;

    // Distance entre le centre d'une lettre et celui de la suivante.
    const pairDistances = chars.slice(0, -1).map((_, i) => {
      const gap = i === chars.length - 2 ? settings.lastGap : settings.baseGap;
      return radiusOf(i) + radiusOf(i + 1) + tracking + gap + settings.extra;
    });
    let x = W / 2 - pairDistances.reduce((a, b) => a + b, 0) / 2;

    letters = chars.map((char, i) => {
      const old = letters[i] && letters[i].char === char ? letters[i] : null; // garde le mouvement en cours
      const homeX = x;
      const gapAfter = i < pairDistances.length ? pairDistances[i] : null;
      if (gapAfter !== null) x += gapAfter;
      return {
        char, r: radiusOf(i), gapAfter, homeX, homeY,
        x: old ? old.x : homeX, y: old ? old.y : homeY,
        vx: old ? old.vx : 0, vy: old ? old.vy : 0,
        angle: old ? old.angle : 0, targetAngle: 0,
      };
    });
  }

  // Adapte le canvas à la taille de la page (appelé à chaque redimensionnement).
  function resize() {
    W = page.clientWidth;
    H = page.clientHeight;
    if (!W || !H) return;
    // Netteté sur écrans Retina, mais limitée à ~6 millions de pixels pour
    // ne pas saturer la mémoire sur les très grands écrans (4K, 5K…).
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const maxPixels = 6e6;
    if (W * H * dpr * dpr > maxPixels) dpr = Math.sqrt(maxPixels / (W * H));
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    readSettings();
    layoutLetters();
    draw();
  }

  /* ---- Curseur / doigt ---- */
  function samplePointer(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const now = performance.now();
    if (lastSample) {
      const dt = Math.max(now - lastSample.t, 1);
      pointer.vx = ((x - lastSample.x) / dt) * 16; // vitesse ≈ en px par image
      pointer.vy = ((y - lastSample.y) / dt) * 16;
    }
    pointer.x = x; pointer.y = y; pointer.active = true;
    lastSample = { x, y, t: now };
  }
  function releasePointer() { pointer.active = false; lastSample = null; }

  page.addEventListener("mousemove", (e) => samplePointer(e.clientX, e.clientY));
  page.addEventListener("mouseleave", releasePointer);
  page.addEventListener("touchmove", (e) => {
    if (e.touches[0]) samplePointer(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });
  page.addEventListener("touchend", releasePointer, { passive: true });

  /* ---- Gyroscope (téléphone) ---- */
  let gyroEnabled = false;
  const gyroTilt = { x: 0, y: 0 };
  function handleOrientation(e) {
    if (e.beta === null && e.gamma === null) return; // appareil sans capteur : on ignore
    gyroTilt.x = Math.max(-1, Math.min(1, (e.gamma || 0) / 30));
    gyroTilt.y = Math.max(-1, Math.min(1, ((e.beta || 0) - 45) / 30));
  }
  // Sur iOS, doit être appelée depuis un vrai toucher (voir initGyroPopup).
  function requestGyro() {
    if (gyroEnabled) return Promise.resolve(true);
    if (typeof DeviceOrientationEvent === "undefined") return Promise.resolve(false);
    if (typeof DeviceOrientationEvent.requestPermission !== "function") { // Android
      window.addEventListener("deviceorientation", handleOrientation);
      gyroEnabled = true;
      return Promise.resolve(true);
    }
    return DeviceOrientationEvent.requestPermission()
      .then((state) => {
        if (state === "granted") {
          window.addEventListener("deviceorientation", handleOrientation);
          gyroEnabled = true;
        }
        return gyroEnabled;
      })
      .catch(() => false);
  }

  /* ---- Clic sur une lettre ---- */
  if (typeof onLetterClick === "function") {
    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const hit = letters.some((l) => Math.hypot(l.x - x, l.y - y) < Math.max(l.r, fontSize * 0.3));
      if (hit) onLetterClick();
    });
  }

  /* ---- Une image de l'animation ---- */
  function step() {
    pointer.vx *= 0.9; // la vitesse du curseur retombe quand il s'arrête
    pointer.vy *= 0.9;
    const reach = Math.max(fontSize * P.repelRadius, 120);

    letters.forEach((l) => {
      let fx = 0, fy = 0;
      if (touchScreen.matches && gyroEnabled) {
        fx += gyroTilt.x * P.gyroStrength;
        fy += gyroTilt.y * P.gyroStrength;
        l.targetAngle = gyroTilt.x * P.maxTilt;
      } else if (pointer.active) {
        const dx = l.x - pointer.x;
        const dy = l.y - pointer.y;
        const dist = Math.max(Math.hypot(dx, dy), 1);
        const influence = Math.max(0, 1 - dist / reach);   // 1 = tout près, 0 = trop loin
        const speed = Math.min(Math.hypot(pointer.vx, pointer.vy), 40);
        const force = influence * (P.repelStrength + speed * P.speedBoost);
        fx += (dx / dist) * force;
        fy += (dy / dist) * force;
        l.targetAngle = speed > 0.5
          ? Math.max(-P.maxTilt, Math.min(P.maxTilt, Math.atan2(pointer.vy, pointer.vx) * 0.25 * influence))
          : 0;
      } else {
        l.targetAngle = 0;
      }
      // Ressort vers la place de repos + freinage
      fx += (l.homeX - l.x) * P.spring;
      fy += (l.homeY - l.y) * P.spring;
      l.vx = (l.vx + fx) * P.damping;
      l.vy = (l.vy + fy) * P.damping;
      l.x += l.vx;
      l.y += l.vy;
      l.angle += (l.targetAngle - l.angle) * 0.08;
    });

    resolveCollisions();
    draw();
  }

  // Écarte les lettres qui se touchent, puis les garde dans la page.
  function resolveCollisions() {
    for (let pass = 0; pass < 3; pass++) {
      for (let i = 0; i < letters.length; i++) {
        for (let j = i + 1; j < letters.length; j++) {
          const a = letters[i], b = letters[j];
          const minDist = (j === i + 1 && a.gapAfter != null) ? a.gapAfter : (a.r + b.r + settings.baseGap);
          const dx = b.x - a.x, dy = b.y - a.y;
          let dist = Math.hypot(dx, dy);
          if (dist < minDist) {
            if (dist === 0) dist = 0.01;
            const nx = dx / dist, ny = dy / dist;
            const push = (minDist - dist) / 2;
            a.x -= nx * push; a.y -= ny * push;
            b.x += nx * push; b.y += ny * push;
          }
        }
      }
    }
    letters.forEach((l) => {
      l.x = Math.max(l.r, Math.min(W - l.r, l.x));
      l.y = Math.max(l.r, Math.min(H - l.r, l.y));
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = fontAt(fontSize);
    ctx.fillStyle = settings.color || textColor;
    letters.forEach((l) => {
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.angle);
      ctx.fillText(l.char, 0, 0);
      ctx.restore();
    });
  }

  /* ---- Boucle d'animation : ne tourne QUE si la page est à l'écran ---- */
  function loop() { step(); rafId = requestAnimationFrame(loop); }
  function updateRunning() {
    const shouldRun = started && onScreen && !reduceMotion;
    if (shouldRun && rafId === null) rafId = requestAnimationFrame(loop);
    if (!shouldRun && rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }

  watchSize(page, resize);
  watchVisibility(page, (visible) => { onScreen = visible; updateRunning(); });
  resize();

  return {
    start() { started = true; draw(); updateRunning(); },
    requestGyro,
    relayout: resize, // à appeler quand le texte ou la police change
  };
}


/* =====================================================================
   VERSION 2 : « KAYA » QUI TOMBE (physique)
   ---------------------------------------------------------------------
   • Les 4 lettres tombent du haut de la page (gravité), rebondissent un
     peu, s'empilent et s'imbriquent (elles peuvent légèrement se chevaucher).
   • Le curseur / le doigt les repousse ; le gyroscope les fait glisser.
   • La ville, « Qui suis-je » et l'e-mail sont des blocs rigides : les lettres
     et le curseur les poussent (déplacement uniquement, jamais de
     déformation ni de rotation), puis un ressort les ramène à leur place.
   • Quand on quitte la page 1 puis qu'on y revient, les lettres retombent.
   Réglages : constante G ci-dessous + CONFIG.letterPhysics (curseur).
   ===================================================================== */
function createFallingWord(options) {
  const {
    canvasId, page, getChars, fontFamilyVar, fontFamilyFallback,
    textColor = "#fff", textColorVar,
    sizeVar, defaultSize = 0.28, widthVar, defaultWidth = 0.5,
    gapVar, lastGapVar, spacingVar, onLetterClick,
  } = options;

  const canvas = $(canvasId);
  if (!canvas || !page) return null;
  const ctx = canvas.getContext("2d");
  const P = CONFIG.letterPhysics;
  // gravity : chute · bounce : rebond · friction : frottement au sol
  // radius : taille de collision d'une lettre (plus petit = elles s'imbriquent davantage)
  const G = { gravity: 0.6, bounce: 0.28, friction: 0.88, radius: 0.32 };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const touchScreen = window.matchMedia("(hover: none) and (pointer: coarse)");
  const fontFamily = readCSSString(fontFamilyVar, fontFamilyFallback);

  // Ville, ▾ et e-mail : poussés par les lettres (jamais par le curseur), en bloc et sans se déformer,
  // puis ils reviennent à leur place.
  const infos = [...page.querySelectorAll(".contact-left, .about-btn, .scroll-cue, .contact-right")]
    .map((el) => ({ el, fixed: false, x: 0, y: 0, vx: 0, vy: 0, homeX: 0, homeY: 0, hw: 0, hh: 0 }));

  let W = 0, H = 0, fontSize = 0, letters = [], settings = {};
  let started = false, onScreen = false, rafId = null, dropped = false;
  const pointer = { x: -9999, y: -9999, vx: 0, vy: 0, active: false };
  let lastSample = null;
  const fontAt = (size) => `${size}px ${fontFamily}`;

  function readSettings() {
    const baseGap = readCSSNumber(gapVar, 1);
    settings = {
      baseGap,
      lastGap: readCSSNumber(lastGapVar, baseGap),
      extra: readCSSNumber(spacingVar, 0),
      size: readCSSNumber(sizeVar, defaultSize),
      width: readCSSNumber(widthVar, defaultWidth),
      color: textColorVar ? readCSSString(textColorVar, textColor) : textColor,
    };
  }

  // Place « de repos » du mot (utilisée pour la chute et si les animations sont réduites).
  function layoutLetters() {
    const chars = getChars();
    const n = Math.max(chars.length, 1);
    fontSize = Math.min((W * settings.width) / (n * 0.7), H * settings.size);
    const r = fontSize * G.radius;
    const dists = chars.slice(0, -1).map((_, i) =>
      fontSize * 0.72 + (i === chars.length - 2 ? settings.lastGap : settings.baseGap) + settings.extra);
    let x = W / 2 - dists.reduce((a, b) => a + b, 0) / 2;
    letters = chars.map((char, i) => {
      const old = letters[i] && letters[i].char === char ? letters[i] : null;
      const homeX = x;
      if (i < dists.length) x += dists[i];
      return {
        char, r, homeX, homeY: H / 2,
        x: old ? old.x : homeX, y: old ? old.y : -fontSize * (1.5 + i * 1.6),
        vx: old ? old.vx : 0, vy: old ? old.vy : 0, angle: old ? old.angle : 0,
      };
    });
  }

  // Mesure les blocs d'infos à leur place d'origine (sans leur déplacement).
  function measureInfo() {
    infos.forEach((b) => {
      b.el.style.translate = "";
      // offsetLeft / offsetTop ignorent les transformations : la mesure reste juste même
      // pendant la chute des infos (animation CSS « drop-in »). Le ▾ est centré par un
      // translateX(-50%) : son centre est donc son bord gauche.
      const el = b.el;
      b.hw = el.offsetWidth / 2; b.hh = el.offsetHeight / 2;
      b.homeX = el.offsetLeft + (el.classList.contains("scroll-cue") ? 0 : b.hw);
      b.homeY = el.offsetTop + b.hh;
      b.x = b.homeX; b.y = b.homeY; b.vx = b.vy = 0;
    });
  }

  // Fait tomber les lettres depuis le haut de la page.
  function drop() {
    letters.forEach((l, i) => {
      l.x = l.homeX + (Math.random() - 0.5) * fontSize * 0.5;
      l.y = -fontSize * (1 + i * 1.5);
      l.vx = (Math.random() - 0.5) * 2; l.vy = 0;
      l.angle = (Math.random() - 0.5) * 0.6;
    });
    infos.forEach((b) => { b.x = b.homeX; b.y = b.homeY; b.vx = b.vy = 0; });
    // La langue, la ville et l'e-mail tombent aussi du haut de la page (animation CSS « drop-in »).
    page.querySelectorAll(".lang, .contact-left, .contact-right").forEach((el) => {
      el.classList.remove("drop-in"); void el.offsetWidth; el.classList.add("drop-in");
    });
    dropped = true;
  }

  function resize() {
    W = page.clientWidth; H = page.clientHeight;
    if (!W || !H) return;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const maxPixels = 6e6;
    if (W * H * dpr * dpr > maxPixels) dpr = Math.sqrt(maxPixels / (W * H));
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    readSettings();
    layoutLetters();
    measureInfo();
    if (reduceMotion && started) letters.forEach((l) => { l.x = l.homeX; l.y = l.homeY; });
    draw();
  }

  /* ---- Curseur / doigt ---- */
  function samplePointer(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left, y = clientY - rect.top, now = performance.now();
    if (lastSample) {
      const dt = Math.max(now - lastSample.t, 1);
      pointer.vx = ((x - lastSample.x) / dt) * 16;
      pointer.vy = ((y - lastSample.y) / dt) * 16;
    }
    pointer.x = x; pointer.y = y; pointer.active = true;
    lastSample = { x, y, t: now };
  }
  function releasePointer() { pointer.active = false; lastSample = null; }
  page.addEventListener("mousemove", (e) => samplePointer(e.clientX, e.clientY));
  page.addEventListener("mouseleave", releasePointer);
  page.addEventListener("touchmove", (e) => { if (e.touches[0]) samplePointer(e.touches[0].clientX, e.touches[0].clientY); }, { passive: true });
  page.addEventListener("touchend", releasePointer, { passive: true });

  /* ---- Gyroscope (téléphone) ---- */
  let gyroEnabled = false;
  const gyroTilt = { x: 0, y: 0 };
  function handleOrientation(e) {
    if (e.beta === null && e.gamma === null) return; // appareil sans capteur : on ignore
    gyroTilt.x = Math.max(-1, Math.min(1, (e.gamma || 0) / 30));
    gyroTilt.y = Math.max(-1, Math.min(1, ((e.beta || 0) - 45) / 30));
  }
  function requestGyro() {
    if (gyroEnabled) return Promise.resolve(true);
    if (typeof DeviceOrientationEvent === "undefined") return Promise.resolve(false);
    if (typeof DeviceOrientationEvent.requestPermission !== "function") {
      window.addEventListener("deviceorientation", handleOrientation);
      gyroEnabled = true;
      return Promise.resolve(true);
    }
    return DeviceOrientationEvent.requestPermission()
      .then((state) => {
        if (state === "granted") { window.addEventListener("deviceorientation", handleOrientation); gyroEnabled = true; }
        return gyroEnabled;
      })
      .catch(() => false);
  }

  /* ---- Clic sur une lettre ---- */
  if (typeof onLetterClick === "function") {
    canvas.addEventListener("click", (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left, y = e.clientY - rect.top;
      if (letters.some((l) => Math.hypot(l.x - x, l.y - y) < Math.max(l.r, fontSize * 0.3))) onLetterClick();
    });
  }

  /* ---- Collisions ---- */
  function collideCircles(a, b) {
    let dx = b.x - a.x, dy = b.y - a.y;
    let d = Math.hypot(dx, dy);
    const min = a.r + b.r;
    if (d >= min) return;
    if (d < 0.01) { dx = 0.01; dy = -0.01; d = Math.hypot(dx, dy); }
    const nx = dx / d, ny = dy / d, push = (min - d) / 2;
    a.x -= nx * push; a.y -= ny * push;
    b.x += nx * push; b.y += ny * push;
    const vn = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
    if (vn < 0) {
      const j = (-(1 + 0.15) * vn) / 2;
      a.vx -= j * nx; a.vy -= j * ny; b.vx += j * nx; b.vy += j * ny;
    }
  }
  // Lettre (cercle) contre bloc d'info (rectangle, 3 fois plus lourd).
  function collideRect(l, b) {
    const cx = Math.max(b.x - b.hw, Math.min(b.x + b.hw, l.x));
    const cy = Math.max(b.y - b.hh, Math.min(b.y + b.hh, l.y));
    let dx = l.x - cx, dy = l.y - cy;
    const d = Math.hypot(dx, dy);
    if (d >= l.r) return;
    let nx, ny, overlap;
    if (d > 0.001) { nx = dx / d; ny = dy / d; overlap = l.r - d; }
    else { // centre de la lettre à l'intérieur du bloc : on sort par la face la plus proche
      dx = l.x - b.x; dy = l.y - b.y;
      if (Math.abs(dx) / b.hw > Math.abs(dy) / b.hh) { nx = Math.sign(dx) || 1; ny = 0; overlap = b.hw + l.r - Math.abs(dx); }
      else { nx = 0; ny = Math.sign(dy) || -1; overlap = b.hh + l.r - Math.abs(dy); }
    }
    const share = b.fixed ? 1 : 0.75;
    l.x += nx * overlap * share; l.y += ny * overlap * share;
    if (!b.fixed) { b.x -= nx * overlap * 0.25; b.y -= ny * overlap * 0.25; }
    const vn = (l.vx - b.vx) * nx + (l.vy - b.vy) * ny;
    if (vn < 0) {
      const j = (-(1 + 0.2) * vn) / (1 + 1 / 3);
      l.vx += j * nx; l.vy += j * ny;
      if (!b.fixed) { b.vx -= (j / 3) * nx; b.vy -= (j / 3) * ny; }
    }
  }

  /* ---- Une image de l'animation ---- */
  function step() {
    pointer.vx *= 0.9; pointer.vy *= 0.9;
    const reach = Math.max(fontSize * P.repelRadius, 120);
    const speed = Math.min(Math.hypot(pointer.vx, pointer.vy), 40);
    const gyro = touchScreen.matches && gyroEnabled;
    const push = (o, k) => {
      if (!pointer.active) return;
      const dx = o.x - pointer.x, dy = o.y - pointer.y;
      const dist = Math.max(Math.hypot(dx, dy), 1);
      const influence = Math.max(0, 1 - dist / reach);
      if (!influence) return;
      const force = influence * (P.repelStrength + speed * P.speedBoost) * k;
      o.vx += (dx / dist) * force; o.vy += (dy / dist) * force;
    };

    letters.forEach((l) => {
      push(l, 1);
      l.vy += G.gravity;
      if (gyro) { l.vx += gyroTilt.x * P.gyroStrength * 0.15; l.vy += gyroTilt.y * P.gyroStrength * 0.15; }
      l.vx *= 0.995; l.vy *= 0.995;
      l.x += l.vx; l.y += l.vy;
    });
    infos.forEach((b) => {
      if (b.fixed) return;
      b.vx += (b.homeX - b.x) * 0.04; b.vy += (b.homeY - b.y) * 0.04;
      b.vx *= 0.82; b.vy *= 0.82;
      b.x += b.vx; b.y += b.vy;
    });

    for (let pass = 0; pass < 4; pass++) {
      for (let i = 0; i < letters.length; i++)
        for (let j = i + 1; j < letters.length; j++) collideCircles(letters[i], letters[j]);
      letters.forEach((l) => infos.forEach((b) => collideRect(l, b)));
      letters.forEach((l) => {
        l.x = Math.max(l.r, Math.min(W - l.r, l.x));
        if (l.y > H - l.r) l.y = H - l.r;
      });
      infos.forEach((b) => {
        b.x = Math.max(b.hw, Math.min(W - b.hw, b.x));
        b.y = Math.max(b.hh, Math.min(H - b.hh, b.y));
      });
    }

    letters.forEach((l) => {
      if (l.y >= H - l.r - 0.5) { // au sol
        l.vy = l.vy > 2 ? -l.vy * G.bounce : 0;
        l.vx *= G.friction;
      }
      if (l.x <= l.r + 0.5 && l.vx < 0) l.vx = -l.vx * 0.3;
      if (l.x >= W - l.r - 0.5 && l.vx > 0) l.vx = -l.vx * 0.3;
      const tilt = Math.max(-P.maxTilt, Math.min(P.maxTilt, l.vx * 0.06));
      l.angle += (tilt - l.angle) * 0.1;
    });
    // Les blocs d'infos : déplacement seulement (propriété CSS « translate »).
    infos.forEach((b) => { if (!b.fixed) b.el.style.translate = (b.x - b.homeX).toFixed(1) + "px " + (b.y - b.homeY).toFixed(1) + "px"; });
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = fontAt(fontSize);
    ctx.fillStyle = settings.color || textColor;
    letters.forEach((l) => {
      ctx.save();
      ctx.translate(l.x, l.y);
      ctx.rotate(l.angle);
      ctx.fillText(l.char, 0, 0);
      ctx.restore();
    });
  }

  function loop() { step(); rafId = requestAnimationFrame(loop); }
  function updateRunning() {
    const shouldRun = started && onScreen && !reduceMotion;
    if (shouldRun && rafId === null) {
      if (!dropped) drop();
      rafId = requestAnimationFrame(loop);
    }
    if (!shouldRun && rafId !== null) { cancelAnimationFrame(rafId); rafId = null; }
  }

  watchSize(page, resize);
  watchVisibility(page, (visible) => {
    if (!visible) dropped = false; // au retour, les lettres retombent
    onScreen = visible;
    updateRunning();
  }, 0.3);
  resize();
  onContactLayoutChange = measureInfo; // si les infos s'empilent, on remesure

  return {
    start() {
      started = true;
      if (reduceMotion) letters.forEach((l) => { l.x = l.homeX; l.y = l.homeY; });
      draw();
      updateRunning();
    },
    requestGyro,
    relayout: resize,
  };
}


/* =====================================================================
   4. PAGES PROJETS
   ---------------------------------------------------------------------
   Une page est créée pour chaque bloc de PROJECT_IMAGES. Elle contient :
   le carrousel, les deux flèches et, si besoin, la liste des images
   introuvables. Le texte du projet s'ouvre dans l'image agrandie (« ? »).
   ===================================================================== */

let openInfoRefresh = () => {};  // remplacée par initLightbox() : réécrit le texte du « ? » après un changement de langue
let openLightbox = () => {};     // (éléments, position, quandOnChange, n° du projet)
let lightboxOpen = false;        // true tant que l'image agrandie est ouverte
let activeCarousel = null;       // le carrousel de la page actuellement à l'écran (touches ← →)

/* ---- Carrousel d'une page -------------------------------------------
   items = [{ kind: "image" | "video", url }]
   • défilement automatique uniquement quand la page est à l'écran ;
   • une vidéo repart du début à chaque fois que la page redevient visible
     (sinon elle pouvait finir hors écran et bloquer le carrousel) ;
   • clic = agrandit l'élément VISIBLE ;
   • couleur de contraste des flèches et du texte.
   Renvoie { updateContrast } ou null si la page est vide.
   ---------------------------------------------------------------------- */
function buildCarousel(section, items, projectIndex) {
  const slidesBox = section.querySelector(".slides");
  const prevBtn = section.querySelector(".carousel-arrow.prev");
  const nextBtn = section.querySelector(".carousel-arrow.next");
  if (!items.length) return null;

  const slides = items.map((item) => {
    let el;
    if (item.kind === "video") {
      el = document.createElement("video");
      el.src = item.url;
      el.muted = true;       // obligatoire pour la lecture automatique
      el.playsInline = true; // iOS : pas de plein écran forcé
      el.preload = "metadata";
    } else {
      el = document.createElement("img");
      el.src = item.url;
      el.decoding = "async";
      el.alt = "";
    }
    slidesBox.appendChild(el);
    return el;
  });

  let current = 0;
  let visible = false;
  let autoTimer = null;
  let videoEnd = null;       // écoute de la fin de la vidéo en cours
  let contrastTimer = null;

  /* -- Couleur de contraste -- */
  function updateContrast() {
    const media = slides[current];
    [prevBtn, nextBtn].forEach((el) => {
      if (!el || el.hidden) return;
      // On mesure sous le SYMBOLE de la flèche (pas sous toute sa zone de clic, plus large).
      const range = document.createRange();
      range.selectNodeContents(el);
      const lum = sampleLuminance(media, slidesBox, range.getBoundingClientRect());
      if (lum === null) return;
      el.style.setProperty("--auto-color",
        lum > CONFIG.contrastThreshold ? CONFIG.contrastColors.onLight : CONFIG.contrastColors.onDark);
    });
  }
  function startContrastWatch() {
    clearInterval(contrastTimer);
    updateContrast();
    contrastTimer = setInterval(updateContrast, CONFIG.contrastRefresh);
  }
  function stopContrastWatch() { clearInterval(contrastTimer); contrastTimer = null; }

  /* -- Passage automatique à l'élément suivant -- */
  function clearAutoAdvance() {
    clearTimeout(autoTimer);
    autoTimer = null;
    if (videoEnd) {
      videoEnd.el.removeEventListener("ended", videoEnd.fn);
      clearTimeout(videoEnd.safety);
      videoEnd = null;
    }
  }
  function scheduleAdvance(delay) {
    clearAutoAdvance();
    if (!visible || slides.length < 2) return;
    const el = slides[current];
    if (el.tagName === "VIDEO") {
      const safety = setTimeout(autoNext, CONFIG.videoFallbackDuration);
      const fn = () => { clearTimeout(safety); autoNext(); };
      el.addEventListener("ended", fn, { once: true });
      videoEnd = { el, fn, safety };
    } else {
      autoTimer = setTimeout(autoNext, delay);
    }
  }

  function next() { show((current + 1) % slides.length, CONFIG.slideInterval); }
  function prev() { show((current - 1 + slides.length) % slides.length, CONFIG.slideIntervalAfterClick); }
  // Navigation manuelle (clavier, trackpad, glissement) : -1 = précédent, +1 = suivant.
  function go(step) {
    if (slides.length < 2) return;
    show((current + step + slides.length) % slides.length, CONFIG.slideIntervalAfterClick);
  }
  // Défilement automatique : on attend tant que l'image agrandie est ouverte.
  function autoNext() {
    if (lightboxOpen) { clearAutoAdvance(); autoTimer = setTimeout(autoNext, 500); return; }
    next();
  }

  // Affiche l'élément n° n ; "delayAfter" = durée avant le suivant.
  function show(n, delayAfter) {
    current = n;
    slides.forEach((el, k) => {
      const isCurrent = k === n;
      el.classList.toggle("on", isCurrent);
      if (el.tagName === "VIDEO") {
        if (isCurrent && visible) { el.currentTime = 0; el.play().catch(() => {}); }
        else el.pause();
      }
    });
    const el = slides[n];
    if (el.tagName === "IMG" && !el.complete) el.addEventListener("load", updateContrast, { once: true });
    else if (el.tagName === "VIDEO" && el.readyState < 2) el.addEventListener("loadeddata", updateContrast, { once: true });
    updateContrast();
    scheduleAdvance(delayAfter);
  }

  show(0, CONFIG.slideInterval);

  if (slides.length < 2) {
    if (prevBtn) prevBtn.hidden = true;
    if (nextBtn) nextBtn.hidden = true;
  } else {
    if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); show((current + 1) % slides.length, CONFIG.slideIntervalAfterClick); });
    if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); prev(); });
  }

  // Clic sur le carrousel : agrandit l'élément actuellement visible.
  slidesBox.addEventListener("click", () =>
    openLightbox(slides, current, (i) => show(i, CONFIG.slideIntervalAfterClick), projectIndex));

  // Trackpad (glisser à droite / à gauche) et glissement du doigt : image suivante / précédente.
  onHorizontalGesture(section, (dir) => { if (!lightboxOpen) go(dir); });

  const api = { updateContrast, go };

  // Page à l'écran : on (re)lance ; hors écran : tout est mis en pause.
  watchVisibility(section, (isVisible) => {
    visible = isVisible;
    if (visible) activeCarousel = api;
    else if (activeCarousel === api) activeCarousel = null;
    if (visible) { show(current, CONFIG.slideInterval); startContrastWatch(); }
    else {
      clearAutoAdvance();
      stopContrastWatch();
      slides.forEach((el) => { if (el.tagName === "VIDEO") el.pause(); });
    }
  }, 0.5);

  return api;
}

function initProjects() {
  const footer = document.querySelector(".footer");

  PROJECT_IMAGES.forEach((entries, index) => {
    // 1) Créer la page, juste avant la dernière page.
    const section = document.createElement("section");
    section.className = "page project";
    section.id = "projet-" + (index + 1);
    section.innerHTML =
      '<div class="slides"></div>' +
      '<button type="button" class="carousel-arrow prev" aria-label="Précédent">&gt;</button>' +
      '<button type="button" class="carousel-arrow next" aria-label="Suivant">&gt;</button>' +
      '<p class="notice" hidden></p>';
    footer.before(section);

    const notice = section.querySelector(".notice");

    // 2) Vérifier les images, puis construire le carrousel.
    Promise.all(entries.map(async (entry) => {
      if (entry && typeof entry === "object" && entry.video) {
        return { path: entry.video, kind: "video", url: entry.video };
      }
      return { path: entry, kind: "image", url: await resolveImage(entry) };
    })).then((results) => {
      buildCarousel(section, results.filter((r) => r.url).map((r) => ({ kind: r.kind, url: r.url })), index);
      const missing = results.filter((r) => !r.url).map((r) => r.path);
      if (CONFIG.showMissingImages && missing.length) {
        notice.textContent = "Éléments introuvables (projet " + (index + 1) + ") :\n" + missing.join("\n");
        notice.hidden = false;
      }
    });

  });
}

/* ---- Geste horizontal (trackpad ou doigt) ------------------------------
   Appelle callback(+1) pour « suivant » (glisser vers la gauche / le
   trackpad vers la droite) et callback(-1) pour « précédent ». Un seul
   changement par geste, même si le trackpad continue sur son élan.
   Les gestes verticaux ne sont pas touchés : la page défile normalement.
   ---------------------------------------------------------------------- */
function onHorizontalGesture(element, callback) {
  let locked = false, timer = null;
  element.addEventListener("wheel", (e) => {
    if (Math.abs(e.deltaX) <= Math.abs(e.deltaY) || Math.abs(e.deltaX) < 4) return;
    e.preventDefault();
    if (!locked && Math.abs(e.deltaX) >= 8) { locked = true; callback(e.deltaX > 0 ? 1 : -1); }
    clearTimeout(timer);
    timer = setTimeout(() => { locked = false; }, 180);
  }, { passive: false });

  let start = null;
  element.addEventListener("touchstart", (e) => {
    const t = e.touches[0];
    start = t && e.touches.length === 1 ? { x: t.clientX, y: t.clientY } : null;
  }, { passive: true });
  element.addEventListener("touchend", (e) => {
    const t = e.changedTouches[0];
    if (!start || !t) { start = null; return; }
    const dx = t.clientX - start.x, dy = t.clientY - start.y;
    start = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) callback(dx < 0 ? 1 : -1);
  }, { passive: true });
}

/* ---- Touches ← → : image précédente / suivante du carrousel affiché ---- */
function initCarouselKeys() {
  document.addEventListener("keydown", (e) => {
    if (lightboxOpen || !activeCarousel) return;
    const about = $("about");
    if (about && about.classList.contains("open")) return;
    if (e.key === "ArrowRight") { e.preventDefault(); activeCarousel.go(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); activeCarousel.go(-1); }
  });
}

/* ---- Image agrandie (lightbox), commune à tous les carrousels ----
   Ouverture : clic sur le carrousel. Fermeture : nouveau clic n'importe
   où, la croix ou la touche Échap. Image suivante / précédente : flèches
   (mêmes symboles que le carrousel), touches ← →, trackpad ou glissement. */
function initLightbox() {
  const overlay = $("lightbox");
  const content = $("lightbox-content");
  const closeBtn = $("lightbox-close");
  const prevBtn = $("lightbox-prev");
  const nextBtn = $("lightbox-next");
  const infoBtn = $("lightbox-info-btn");
  const info = $("lightbox-info");
  if (!overlay || !content || !infoBtn || !info) return null;
  const shown = info.querySelector(".shown");
  const rest = info.querySelector(".rest");

  let list = [], index = 0, onChange = null, projectIndex = -1;
  let typingToken = {};
  const infoIsOpen = () => info.classList.contains("open");
  const entry = () => (CONFIG.i18n[currentLang].projects || [])[projectIndex] || null;

  /* -- Texte du projet : l'image devient un fond noir, texte blanc (Alaska),
        écrit en machine à écrire, à la plus grande taille qui tient dans le cadre. -- */
  function fitInfo() {
    const media = content.firstElementChild;
    if (!media) return;
    const r = media.getBoundingClientRect();
    info.style.left = r.left + "px"; info.style.top = r.top + "px";
    info.style.width = r.width + "px"; info.style.height = r.height + "px";
    let lo = 9, hi = Math.min(r.height * 0.5, 150);
    while (hi - lo > 0.5) {
      const mid = (lo + hi) / 2;
      info.style.fontSize = mid + "px";
      if (info.scrollHeight <= info.clientHeight + 1 && info.scrollWidth <= info.clientWidth + 1) lo = mid; else hi = mid;
    }
    info.style.fontSize = lo + "px";
  }
  function typeInfo(fullText) {
    const token = {};
    typingToken = token;
    const perTick = Math.max(1, Math.ceil(fullText.length / 260)); // les longs textes restent rapides
    let i = 0;
    (function tick() {
      if (typingToken !== token) return;
      i = Math.min(fullText.length, i + perTick);
      shown.textContent = fullText.slice(0, i);
      rest.textContent = fullText.slice(i);
      if (i < fullText.length) setTimeout(tick, CONFIG.typeSpeed);
    })();
  }
  function openInfo() {
    const e = entry();
    if (!e || !content.firstElementChild) return;
    const fullText = (e.title ? e.title + "\n\n" : "") + e.text;
    shown.textContent = "";
    rest.textContent = fullText; // la place du texte est réservée dès le début : rien ne bouge
    info.classList.add("open");
    infoBtn.setAttribute("aria-expanded", "true");
    fitInfo();
    typeInfo(fullText);
  }
  function closeInfo() {
    typingToken = {};
    info.classList.remove("open");
    infoBtn.setAttribute("aria-expanded", "false");
  }

  function render() {
    closeInfo();
    content.innerHTML = ""; // arrête aussi une vidéo en cours
    const source = list[index];
    if (!source) return;
    const clone = source.cloneNode(true);
    clone.classList.remove("on");
    clone.removeAttribute("style");
    if (clone.tagName === "VIDEO") {
      clone.muted = false; // le son est autorisé ici, car l'ouverture vient d'un clic
      clone.loop = true;
      clone.play().catch(() => {});
    }
    content.appendChild(clone);
    const several = list.length > 1;
    if (prevBtn) prevBtn.hidden = !several;
    if (nextBtn) nextBtn.hidden = !several;
    infoBtn.hidden = !entry();
  }

  function go(step) {
    if (list.length < 2) return;
    index = (index + step + list.length) % list.length;
    render();
    if (onChange) onChange(index); // le carrousel suit
  }

  function close() {
    closeInfo();
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    content.innerHTML = "";
    lightboxOpen = false;
    list = []; onChange = null; projectIndex = -1;
  }

  // elements = images/vidéos du carrousel · start = position · change = appelée quand on change d'image
  function open(elements, start, change, project) {
    if (!elements || !elements.length) return;
    list = elements; index = start || 0; onChange = change || null; projectIndex = project;
    render();
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    lightboxOpen = true;
    infoBtn.classList.remove("drop"); // le « ? » tombe du haut de la page
    void infoBtn.offsetWidth;
    infoBtn.classList.add("drop");
  }

  overlay.addEventListener("click", close);
  closeBtn.addEventListener("click", (e) => { e.stopPropagation(); close(); });
  if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); go(-1); });
  if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); go(1); });
  infoBtn.addEventListener("click", (e) => { e.stopPropagation(); if (infoIsOpen()) closeInfo(); else openInfo(); });
  info.addEventListener("click", (e) => { e.stopPropagation(); closeInfo(); });
  onHorizontalGesture(overlay, go);
  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") { if (infoIsOpen()) closeInfo(); else close(); }
    else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  });
  window.addEventListener("resize", () => { if (lightboxOpen && infoIsOpen()) fitInfo(); });

  openInfoRefresh = () => { if (lightboxOpen && infoIsOpen()) openInfo(); }; // changement de langue
  return open;
}


/* =====================================================================
   5. « QUI SUIS-JE »
   ---------------------------------------------------------------------
   Deux boutons (page 1 et dernière page). Au clic, l'image de la langue
   en cours s'affiche en plein écran (CONFIG.aboutImages).
   ===================================================================== */
let refreshAboutImage = () => {};
let openAboutFromWord = () => {};

function initAbout() {
  const overlay = $("about");
  const image = $("about-img");
  const missing = $("about-missing");
  const closeButton = $("about-close");
  const openButtons = document.querySelectorAll(".about-btn");
  if (!overlay || !openButtons.length) return;

  let lastOpener = null;
  let requestId = 0; // évite qu'une réponse lente remplace une plus récente
  refreshAboutImage = async () => {
    const thisRequest = ++requestId;
    const wanted = CONFIG.aboutImages[currentLang];
    const url = await resolveImage(wanted);
    if (thisRequest !== requestId) return;
    if (url) {
      image.src = url;
      image.hidden = false;
      missing.hidden = true;
    } else {
      image.removeAttribute("src");
      image.hidden = true;
      missing.textContent = "Image introuvable : " + wanted;
      missing.hidden = false;
    }
  };

  function open(e) {
    lastOpener = e && e.currentTarget;
    refreshAboutImage();
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    closeButton.focus({ preventScroll: true });
  }
  function close() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    if (lastOpener && lastOpener.focus) lastOpener.focus({ preventScroll: true });
  }

  openButtons.forEach((btn) => btn.addEventListener("click", open));
  // Clic sur le mot « kaya » (page 1) : même image que le bouton « Qui suis-je ».
  openAboutFromWord = () => open({ currentTarget: document.activeElement && document.activeElement !== document.body ? document.activeElement : null });
  overlay.addEventListener("click", close);
  closeButton.addEventListener("click", (e) => { e.stopPropagation(); close(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) close();
  });
}


/* =====================================================================
   6. PAGE 1 & DERNIÈRE PAGE
   ===================================================================== */

function initFixedImages() {
  refreshHeroImage(); // page 1 : image « Qui suis-je » sous les infos
}

/* ---- E-mail à l'épreuve des robots ------------------------------------
   Rien n'est écrit en clair dans index.html : le script assemble l'adresse
   à partir de CONFIG.contactEmail. Le « @ » affiché vient du CSS, et le
   lien mailto: n'est créé qu'au survol, au toucher ou au clic.
   Le clic ouvre la messagerie par défaut (ordinateur, téléphone, tablette).
   ---------------------------------------------------------------------- */
function applyContactEmail() {
  [$("contact-email"), $("footer-email")].forEach((link) => {
    if (!link) return;
    const user = document.createElement("span");
    const at = document.createElement("span");
    const domain = document.createElement("span");
    user.textContent = CONFIG.contactEmail.user;
    at.className = "m-at";
    at.setAttribute("aria-hidden", "true");
    domain.textContent = CONFIG.contactEmail.domain;
    link.append(user, at, domain);
    const arm = () => { link.href = "mailto:" + mailAddress(); }; // clic droit, appui long…
    ["pointerenter", "touchstart", "focus"].forEach((type) => link.addEventListener(type, arm, { passive: true }));
    link.addEventListener("click", (e) => { e.preventDefault(); openMail(); });
  });
}

/* ---- Bas de page : une ligne, ou empilé à droite ? --------------------
   Sur la page 1 et la dernière page, on vérifie si ville (gauche),
   « Qui suis-je » (centre) et e-mail (droite) tiennent sur UNE ligne sans
   se toucher. Sinon, la classe .contact-stacked est ajoutée à la page et
   le CSS les empile à droite (voir style.css, section 4).
   Revérifié à chaque changement de taille d'écran, de langue ou de police.
   ---------------------------------------------------------------------- */
let refreshContactLayout = () => {};
let onContactLayoutChange = () => {}; // remplacée par la physique de la page 1

function initContactLayout() {
  const MIN_GAP = 16; // espace minimum (px) entre deux éléments sur la même ligne
  const sections = [...document.querySelectorAll(".hero, .footer")];

  function check(section) {
    const left = section.querySelector(".contact-left");
    const middle = section.querySelector(".about-btn, .scroll-cue");
    const right = section.querySelector(".contact-right");
    if (!left || !middle || !right) return;
    section.classList.remove("contact-stacked"); // on mesure d'abord la disposition sur une ligne
    const saved = [left, middle, right].map((el) => el.style.translate);
    [left, middle, right].forEach((el) => { el.style.translate = ""; }); // sans le déplacement physique
    const a = left.getBoundingClientRect();
    const b = middle.getBoundingClientRect();
    const c = right.getBoundingClientRect();
    const fitsOnOneLine = a.right + MIN_GAP <= b.left && b.right + MIN_GAP <= c.left;
    section.classList.toggle("contact-stacked", !fitsOnOneLine);
    [left, middle, right].forEach((el, i) => { el.style.translate = saved[i]; });
    if (section.classList.contains("hero")) onContactLayoutChange();
  }

  refreshContactLayout = () => sections.forEach(check);
  sections.forEach((section) => watchSize(section, () => check(section)));
  refreshContactLayout();
}


/* =====================================================================
   7. CURSEUR, LANGUE, iOS, DÉMARRAGE
   ===================================================================== */

/* =====================================================================
   GLITCH DE LA PAGE D'ACCUEIL
   ---------------------------------------------------------------------
   Quand on entre sur la page 1 (au chargement, et à chaque retour), la
   page « glitche » : elle bascule plusieurs fois entre sa version normale
   (fond noir, infos blanches) et sa version inversée (fond blanc, infos
   noires), avec des bandes inversées et un léger décalage horizontal.
   Un changement de langue rejoue le glitch (playGlitch).
   Pendant le glitch, l'image de « Qui suis-je » apparaît sous les infos
   (en couleurs inversées). Durée et rythme : tableau « times » ci-dessous.
   ===================================================================== */
let playGlitch = () => {};
function initGlitch() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const bands = [];
  for (let i = 0; i < 5; i++) {
    const band = document.createElement("div");
    band.className = "glitch-band";
    hero.appendChild(band);
    bands.push(band);
  }
  let timers = [];
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

  function frame(inverted) {
    hero.classList.toggle("inverted", inverted);
    hero.style.setProperty("--gx", ((Math.random() - 0.5) * 40).toFixed(1) + "px");
    bands.forEach((band) => {
      band.style.display = Math.random() < 0.6 ? "block" : "none";
      band.style.top = (Math.random() * 95).toFixed(1) + "%";
      band.style.height = (2 + Math.random() * 14).toFixed(1) + "%";
    });
  }
  function end() {
    hero.classList.remove("glitching", "inverted");
    hero.style.removeProperty("--gx");
    bands.forEach((band) => { band.style.display = "none"; });
  }
  function play() {
    clearTimers();
    if (reduce) { hero.classList.add("revealed"); return; }
    hero.classList.add("glitching");
    const times = [0, 80, 150, 260, 330, 450, 540, 680, 780, 900]; // ms
    times.forEach((t, i) => timers.push(setTimeout(() => {
      frame(i % 2 === 0);
      if (i === 3) hero.classList.add("revealed"); // l'image apparaît
    }, t)));
    timers.push(setTimeout(end, 1000));
  }

  playGlitch = () => { hero.classList.add("revealed"); if (!reduce) play(); };
  watchVisibility(hero, (visible) => {
    if (visible) play();
    else { clearTimers(); end(); hero.classList.remove("revealed"); }
  }, 0.6);
}

// Image de fond de la page 1 = l'image « Qui suis-je » de la langue en cours.
function refreshHeroImage() {
  setImage($("hero-bg"), CONFIG.aboutImages[currentLang]);
}

// Signe ▾ en bas de la page 1 : un clic descend à la page suivante.
function initScrollCue() {
  const cue = $("scroll-cue");
  if (!cue) return;
  cue.addEventListener("click", () => {
    const next = document.getElementById("projet-1") || document.querySelector(".footer");
    if (next) next.scrollIntoView({ behavior: "smooth" });
  });
}

// Rond qui suit la souris (taille : --cursor-size dans style.css ; caché sur les écrans tactiles).
function initCursor() {
  const dot = $("cursor");
  if (!dot) return;
  const half = readCSSNumber("--cursor-size", 24) / 2;
  window.addEventListener("mousemove", (e) => {
    dot.style.transform = `translate(${e.clientX - half}px, ${e.clientY - half}px)`;
  });
}

let talkWord = null;
let kayaWord = null;

// Titre « Let's talk! » : police Africa, centré dans la dernière page
// (réglages : style.css, variables --talk-…).
function initTalkWord() {
  const footer = document.querySelector(".footer");
  if (!footer) return;
  talkWord = createInteractiveWord({
    canvasId: "talk-canvas",
    page: footer,
    getChars: () => (CONFIG.i18n[currentLang].letsTalkTitle || "").split(""),
    fontFamilyVar: "--font-africa",
    fontFamilyFallback: "Georgia, serif",
    textColorVar: "--color-footer-text", // blanc (réglé dans style.css)
    sizeVar: "--talk-size",
    widthVar: "--talk-width",
    measureGlyphs: true,
    trackingVar: "--talk-tracking",
    gapVar: "--talk-gap",
    lastGapVar: "--talk-gap",
    spacingVar: "--talk-letter-spacing",
    onLetterClick: openMail,
  });
}

// Applique une langue à tout le site.
function applyLang(lang) {
  if (!CONFIG.i18n[lang]) return;
  currentLang = lang;
  document.documentElement.lang = lang;
  try { localStorage.setItem("kaya-lang", lang); } catch (e) { /* stockage bloqué : sans importance */ }

  // Chaque élément <… data-i18n="clé"> reçoit le texte de cette clé.
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const value = CONFIG.i18n[lang][el.dataset.i18n];
    if (value !== undefined) el.textContent = value;
  });
  document.querySelectorAll(".lang button").forEach((button) => {
    button.setAttribute("aria-current", button.dataset.lang === lang ? "true" : "false");
  });
  openInfoRefresh(); // le texte du « ? » ouvert est réécrit dans la nouvelle langue
  refreshAboutImage();
  refreshContactLayout(); // les textes ont changé de longueur
  if (talkWord) talkWord.relayout();
  if (kayaWord) kayaWord.relayout();
  refreshHeroImage();
  if (langReady) playGlitch(); // nouveau glitch à chaque changement de langue (pas au premier affichage)
  langReady = true;
}
let langReady = false;

function initLang() {
  document.querySelectorAll(".lang button").forEach((button) => {
    button.addEventListener("click", () => applyLang(button.dataset.lang));
  });
  let saved = null;
  try { saved = localStorage.getItem("kaya-lang"); } catch (e) { /* ignoré */ }
  applyLang(saved && CONFIG.i18n[saved] ? saved : CONFIG.defaultLang);
}

// iOS demande l'autorisation du gyroscope : petit message au 1er toucher.
function initGyroPopup(words) {
  const popup = $("gyro-popup");
  const list = words.filter(Boolean);
  if (!popup || !list.length) return;
  const needsPermission = typeof DeviceOrientationEvent !== "undefined" &&
                          typeof DeviceOrientationEvent.requestPermission === "function";
  if (!needsPermission) { list.forEach((w) => w.requestGyro()); return; }

  window.addEventListener("touchstart", () => { popup.hidden = false; }, { once: true, passive: true });
  $("gyro-allow").addEventListener("click", () => {
    Promise.all(list.map((w) => w.requestGyro())).then(() => { popup.hidden = true; });
  });
  $("gyro-decline").addEventListener("click", () => { popup.hidden = true; });
}

/* ---- DÉMARRAGE (quand la page HTML est prête) ---- */
document.addEventListener("DOMContentLoaded", () => {
  openLightbox = initLightbox() || (() => {});
  initProjects();       // crée les pages projets
  initAbout();
  initFixedImages();
  applyContactEmail();
  initCursor();
  initTalkWord();
  initContactLayout();
  initLang();           // remplit tous les textes (à faire après la création des pages)

  const kaya = createFallingWord({
    canvasId: "kaya-canvas",
    page: $("page1"),
    getChars: () => ["k", "a", "y", "a"],
    fontFamilyVar: "--font-africa",
    fontFamilyFallback: "Georgia, serif",
    textColorVar: "--ink", // couleur du texte de la page 1 (style.css)
    sizeVar: "--kaya-size",
    widthVar: "--kaya-width",
    gapVar: "--kaya-gap",
    lastGapVar: "--kaya-last-gap",
    spacingVar: "--kaya-letter-spacing",
    onLetterClick: () => openAboutFromWord(),
  });
  kayaWord = kaya;
  initGyroPopup([kaya, talkWord]);

  // On attend la police Africa : les mots sont recalculés avec les vraies
  // lettres, puis l'animation démarre. (Si la police ne charge pas, le
  // site démarre quand même avec la police de secours.)
  const onFontReady = () => {
    [kaya, talkWord].forEach((w) => { if (w) { w.relayout(); w.start(); } });
  };
  if (document.fonts && document.fonts.load) document.fonts.load('100px "Africa"').then(onFontReady, onFontReady);
  else onFontReady();

  initGlitch();
  initScrollCue();
  initCarouselKeys();

  // La police Alaska change la largeur des textes du bas de page : on revérifie.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { refreshContactLayout(); if (kayaWord) kayaWord.relayout(); });
});
