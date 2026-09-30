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
    { video: "images/projet1-video.mp4" }, // ★ chemin réel de la vidéo
    "images/projet1-1.webp",
    "images/projet1-2.webp",
  ],
  // ---- Projet 2 (page 3) ----
  [
    "images/projet2-1.webp",
    "images/projet2-2.jpg",
    "images/projet2-3.webp",
    "images/projet2-4.png",
    "images/projet2-5.png",
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
    "images/projet5-4.jpg",
  ],
  // ---- Projet 6 (page 7) ----
  [
    "images/projet6-1.jpg",
    "images/projet6-2.jpg",
    "images/projet6-3.jpg",
    "images/projet6-4.jpg",
  ],
];


/* =====================================================================
   1. ★ RÉGLAGES ET TEXTES
   ===================================================================== */
const CONFIG = {
  // ---- Contact : l'adresse e-mail (utilisée partout sur le site) ----
  contactEmail: "your-email@example.com",

  // ---- Langue affichée à la première visite : "fr", "en", "es" ou "it" ----
  defaultLang: "fr",

  // ---- Vitesses (en millisecondes : 1000 ms = 1 seconde) ----
  typeSpeed: 55,                 // texte des projets : délai entre deux lettres
  slideInterval: 2000,           // carrousels : durée d'affichage d'une image
  slideIntervalAfterClick: 4000, // … après un clic sur une flèche
  videoFallbackDuration: 25000,  // sécurité : si une vidéo ne signale pas sa fin, on passe à la suite

  // ---- Indice de défilement sur la page d'accueil ----
  // À l'arrivée, la page monte un peu puis revient, pour montrer qu'il y a
  // une suite. Distance et durée du mouvement : style.css (--peek-…).
  scrollHint: {
    enabled: true, // false = désactivé
    delay: 1200,   // attente avant le mouvement (ms), le temps de voir « kaya »
  },

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
    fr: "images/qui-suis-je-fr.jpg",
    en: "images/qui-suis-je-en.jpg",
    es: "images/qui-suis-je-es.jpg",
    it: "images/qui-suis-je-it.jpg",
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
        { title: "Titre du projet 1", text: "Description du projet : contexte, démarche, matériaux et résultat. Remplacez ce texte." },
        { title: "Titre du projet 2", text: "Description du projet : contexte, démarche, matériaux et résultat. Remplacez ce texte." },
        { title: "Titre du projet 3", text: "Description du projet : contexte, démarche, matériaux et résultat. Remplacez ce texte." },
        { title: "Titre du projet 4", text: "Description du projet : contexte, démarche, matériaux et résultat. Remplacez ce texte." },
        { title: "Titre du projet 5", text: "Description du projet : contexte, démarche, matériaux et résultat. Remplacez ce texte." },
        { title: "Titre du projet 6", text: "Description du projet : contexte, démarche, matériaux et résultat. Remplacez ce texte." },
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
        { title: "Project title 1", text: "Project description: context, approach, materials and result. Replace this text." },
        { title: "Project title 2", text: "Project description: context, approach, materials and result. Replace this text." },
        { title: "Project title 3", text: "Project description: context, approach, materials and result. Replace this text." },
        { title: "Project title 4", text: "Project description: context, approach, materials and result. Replace this text." },
        { title: "Project title 5", text: "Project description: context, approach, materials and result. Replace this text." },
        { title: "Project title 6", text: "Project description: context, approach, materials and result. Replace this text." },
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
        { title: "Título del proyecto 1", text: "Descripción del proyecto: contexto, proceso, materiales y resultado. Sustituye este texto." },
        { title: "Título del proyecto 2", text: "Descripción del proyecto: contexto, proceso, materiales y resultado. Sustituye este texto." },
        { title: "Título del proyecto 3", text: "Descripción del proyecto: contexto, proceso, materiales y resultado. Sustituye este texto." },
        { title: "Título del proyecto 4", text: "Descripción del proyecto: contexto, proceso, materiales y resultado. Sustituye este texto." },
        { title: "Título del proyecto 5", text: "Descripción del proyecto: contexto, proceso, materiales y resultado. Sustituye este texto." },
        { title: "Título del proyecto 6", text: "Descripción del proyecto: contexto, proceso, materiales y resultado. Sustituye este texto." },
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
        { title: "Titolo del progetto 1", text: "Descrizione del progetto: contesto, approccio, materiali e risultato. Sostituisci questo testo." },
        { title: "Titolo del progetto 2", text: "Descrizione del progetto: contesto, approccio, materiali e risultato. Sostituisci questo testo." },
        { title: "Titolo del progetto 3", text: "Descrizione del progetto: contesto, approccio, materiali e risultato. Sostituisci questo testo." },
        { title: "Titolo del progetto 4", text: "Descrizione del progetto: contesto, approccio, materiali e risultato. Sostituisci questo testo." },
        { title: "Titolo del progetto 5", text: "Descrizione del progetto: contesto, approccio, materiali e risultato. Sostituisci questo testo." },
        { title: "Titolo del progetto 6", text: "Descrizione del progetto: contesto, approccio, materiali e risultato. Sostituisci questo testo." },
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

// Relance une animation CSS toutes les "everyMs" millisecondes (astérisque).
function wiggleEvery(element, cssClass, everyMs) {
  setInterval(() => {
    element.classList.remove(cssClass);
    void element.offsetWidth; // oblige le navigateur à repartir de zéro
    element.classList.add(cssClass);
  }, everyMs);
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
   4. PAGES PROJETS
   ---------------------------------------------------------------------
   Une page est créée pour chaque bloc de PROJECT_IMAGES. Elle contient :
   le carrousel, les deux flèches, l'astérisque, le texte (machine à
   écrire) et, si besoin, la liste des images introuvables.
   ===================================================================== */

const projectPages = [];         // sert à réécrire les textes lors d'un changement de langue
let openLightbox = () => {};     // remplacée au démarrage par initLightbox()
const typingTokens = new WeakMap();

// Machine à écrire : le titre, puis le texte. Un nouveau « jeton »
// interrompt l'écriture en cours (fermeture, changement de langue).
function typeText(panel, title, text) {
  const titleEl = panel.querySelector(".panel-title");
  const textEl = panel.querySelector(".panel-text");
  const token = {};
  typingTokens.set(panel, token);
  titleEl.textContent = "";
  textEl.textContent = "";
  const jobs = [[titleEl, title || ""], [textEl, text || ""]];
  let job = 0, index = 0;
  (function typeNext() {
    if (typingTokens.get(panel) !== token) return;
    while (job < jobs.length && index >= jobs[job][1].length) { job++; index = 0; }
    if (job >= jobs.length) return;
    jobs[job][0].textContent += jobs[job][1].charAt(index++);
    setTimeout(typeNext, CONFIG.typeSpeed);
  })();
}

/* ---- Carrousel d'une page -------------------------------------------
   items = [{ kind: "image" | "video", url }]
   • défilement automatique uniquement quand la page est à l'écran ;
   • une vidéo repart du début à chaque fois que la page redevient visible
     (sinon elle pouvait finir hors écran et bloquer le carrousel) ;
   • clic = agrandit l'élément VISIBLE ;
   • couleur de contraste des flèches et du texte.
   Renvoie { updateContrast } ou null si la page est vide.
   ---------------------------------------------------------------------- */
function buildCarousel(section, items) {
  const slidesBox = section.querySelector(".slides");
  const prevBtn = section.querySelector(".carousel-arrow.prev");
  const nextBtn = section.querySelector(".carousel-arrow.next");
  const panel = section.querySelector(".panel");
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
    const targets = [prevBtn, nextBtn];
    if (panel && panel.classList.contains("open")) targets.push(panel);
    targets.forEach((el) => {
      if (!el || el.hidden) return;
      const lum = sampleLuminance(media, slidesBox, el.getBoundingClientRect());
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
      const safety = setTimeout(next, CONFIG.videoFallbackDuration);
      const fn = () => { clearTimeout(safety); next(); };
      el.addEventListener("ended", fn, { once: true });
      videoEnd = { el, fn, safety };
    } else {
      autoTimer = setTimeout(next, delay);
    }
  }

  function next() { show((current + 1) % slides.length, CONFIG.slideInterval); }
  function prev() { show((current - 1 + slides.length) % slides.length, CONFIG.slideIntervalAfterClick); }

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
  slidesBox.addEventListener("click", () => openLightbox(slides[current]));

  // Page à l'écran : on (re)lance ; hors écran : tout est mis en pause.
  watchVisibility(section, (isVisible) => {
    visible = isVisible;
    if (visible) { show(current, CONFIG.slideInterval); startContrastWatch(); }
    else {
      clearAutoAdvance();
      stopContrastWatch();
      slides.forEach((el) => { if (el.tagName === "VIDEO") el.pause(); });
    }
  }, 0.5);

  return { updateContrast };
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
      '<button type="button" class="asterisk" aria-label="Info">*</button>' +
      '<div class="panel" role="region"><h2 class="panel-title"></h2><p class="panel-text"></p></div>' +
      '<p class="notice" hidden></p>';
    footer.before(section);

    const star = section.querySelector(".asterisk");
    const panel = section.querySelector(".panel");
    const notice = section.querySelector(".notice");
    let carousel = null;

    // 2) Vérifier les images, puis construire le carrousel.
    Promise.all(entries.map(async (entry) => {
      if (entry && typeof entry === "object" && entry.video) {
        return { path: entry.video, kind: "video", url: entry.video };
      }
      return { path: entry, kind: "image", url: await resolveImage(entry) };
    })).then((results) => {
      carousel = buildCarousel(section, results.filter((r) => r.url).map((r) => ({ kind: r.kind, url: r.url })));
      const missing = results.filter((r) => !r.url).map((r) => r.path);
      if (CONFIG.showMissingImages && missing.length) {
        notice.textContent = "Éléments introuvables (projet " + (index + 1) + ") :\n" + missing.join("\n");
        notice.hidden = false;
      }
    });

    // 3) L'astérisque bouge toutes les 6 s pour inviter au clic.
    wiggleEvery(star, "tilt", 6000);

    // 4) Clic sur l'astérisque : ouvre / ferme le texte.
    const page = {
      writeText() {
        const entry = (CONFIG.i18n[currentLang].projects || [])[index] || {};
        typeText(panel, entry.title, entry.text);
      },
      isOpen: () => panel.classList.contains("open"),
    };
    projectPages.push(page);

    star.addEventListener("click", () => {
      const nowOpen = panel.classList.toggle("open");
      if (nowOpen) {
        page.writeText();
        if (carousel) carousel.updateContrast();
      } else {
        typingTokens.set(panel, {}); // stoppe l'écriture
      }
    });
  });
}

/* ---- Image agrandie (lightbox), commune à tous les carrousels ----
   Ouverture : clic sur le carrousel. Fermeture : nouveau clic n'importe
   où, la croix ou la touche Échap. */
function initLightbox() {
  const overlay = $("lightbox");
  const content = $("lightbox-content");
  const closeBtn = $("lightbox-close");
  if (!overlay || !content) return null;

  function close() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    content.innerHTML = ""; // arrête aussi une vidéo en cours
  }

  function open(sourceEl) {
    if (!sourceEl) return;
    content.innerHTML = "";
    const clone = sourceEl.cloneNode(true);
    clone.classList.remove("on");
    clone.removeAttribute("style");
    if (clone.tagName === "VIDEO") {
      clone.muted = false; // le son est autorisé ici, car l'ouverture vient d'un clic
      clone.currentTime = sourceEl.currentTime;
      clone.play().catch(() => {});
    }
    content.appendChild(clone);
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
  }

  overlay.addEventListener("click", close);
  closeBtn.addEventListener("click", (e) => { e.stopPropagation(); close(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("open")) close();
  });

  return open;
}


/* =====================================================================
   5. « QUI SUIS-JE »
   ---------------------------------------------------------------------
   Deux boutons (page 1 et dernière page). Au clic, l'image de la langue
   en cours s'affiche en plein écran (CONFIG.aboutImages).
   ===================================================================== */
let refreshAboutImage = () => {};

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
    lastOpener = e.currentTarget;
    refreshAboutImage();
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    closeButton.focus({ preventScroll: true });
  }
  function close() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    if (lastOpener) lastOpener.focus({ preventScroll: true });
  }

  openButtons.forEach((btn) => btn.addEventListener("click", open));
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
  setImage($("hero-bg"), CONFIG.heroImage); // page 1 : image de fond
}

// Remplit les deux liens e-mail à partir de CONFIG.contactEmail.
function applyContactEmail() {
  [$("contact-email"), $("footer-email")].forEach((link) => {
    if (!link) return;
    link.href = "mailto:" + CONFIG.contactEmail;
    link.textContent = CONFIG.contactEmail;
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

function initContactLayout() {
  const MIN_GAP = 16; // espace minimum (px) entre deux éléments sur la même ligne
  const sections = [...document.querySelectorAll(".hero, .footer")];

  function check(section) {
    const left = section.querySelector(".contact-left");
    const middle = section.querySelector(".about-btn");
    const right = section.querySelector(".contact-right");
    if (!left || !middle || !right) return;
    section.classList.remove("contact-stacked"); // on mesure d'abord la disposition sur une ligne
    const a = left.getBoundingClientRect();
    const b = middle.getBoundingClientRect();
    const c = right.getBoundingClientRect();
    const fitsOnOneLine = a.right + MIN_GAP <= b.left && b.right + MIN_GAP <= c.left;
    section.classList.toggle("contact-stacked", !fitsOnOneLine);
  }

  refreshContactLayout = () => sections.forEach(check);
  sections.forEach((section) => watchSize(section, () => check(section)));
  refreshContactLayout();
}


/* =====================================================================
   7. CURSEUR, LANGUE, iOS, DÉMARRAGE
   ===================================================================== */

/* ---- Indice de défilement ---------------------------------------------
   Une seule fois, à l'arrivée sur la page d'accueil : la classe .peek
   fait monter toutes les pages puis les fait redescendre (animation CSS,
   style.css section 3). Rien ne se passe si :
     • le visiteur a déjà fait défiler, touché l'écran ou utilisé le clavier ;
     • le site ne s'ouvre pas sur la page d'accueil ;
     • le visiteur a demandé « réduire les animations » dans son système.
   ---------------------------------------------------------------------- */
function initScrollHint() {
  const scroller = $("scroller");
  if (!scroller || !CONFIG.scrollHint.enabled) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  let cancelled = false;
  const cancel = () => { cancelled = true; };
  ["wheel", "touchstart", "keydown"].forEach((type) =>
    window.addEventListener(type, cancel, { once: true, passive: true }));

  setTimeout(() => {
    if (cancelled || scroller.scrollTop > 5) return;
    scroller.classList.add("peek");
    scroller.addEventListener("animationend", () => scroller.classList.remove("peek"), { once: true });
  }, CONFIG.scrollHint.delay);
}

// Point de 5 px qui suit la souris (caché sur les écrans tactiles, voir CSS).
function initCursor() {
  const dot = $("cursor");
  if (!dot) return;
  window.addEventListener("mousemove", (e) => {
    dot.style.transform = `translate(${e.clientX - 2.5}px, ${e.clientY - 2.5}px)`;
  });
}

let talkWord = null;

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
    onLetterClick: () => { window.location.href = "mailto:" + CONFIG.contactEmail; },
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
  projectPages.forEach((page) => { if (page.isOpen()) page.writeText(); });
  refreshAboutImage();
  refreshContactLayout(); // les textes ont changé de longueur
  if (talkWord) talkWord.relayout();
}

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

  const kaya = createInteractiveWord({
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
    onLetterClick: () => {
      const footer = document.querySelector(".footer");
      if (footer) footer.scrollIntoView({ behavior: "smooth" });
    },
  });
  initGyroPopup([kaya, talkWord]);

  // On attend la police Africa : les mots sont recalculés avec les vraies
  // lettres, puis l'animation démarre. (Si la police ne charge pas, le
  // site démarre quand même avec la police de secours.)
  const onFontReady = () => {
    [kaya, talkWord].forEach((w) => { if (w) { w.relayout(); w.start(); } });
  };
  if (document.fonts && document.fonts.load) document.fonts.load('100px "Africa"').then(onFontReady, onFontReady);
  else onFontReady();

  initScrollHint(); // la page d'accueil glisse un peu vers le haut pour inviter à défiler

  // La police Alaska change la largeur des textes du bas de page : on revérifie.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => refreshContactLayout());
});
