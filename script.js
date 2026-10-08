/* =====================================================================
   PROJET KAYA — script.js
   ---------------------------------------------------------------------
   COMMENT LIRE CE FICHIER
   • Sections 0 et 1 (marquées ★) : c'est là que tu modifies le contenu
     du site (images, vidéos, textes, e-mail, vitesses, réglages).
   • Sections 2 à 7 : le « moteur » du site. Chaque bloc commence par un
     commentaire qui explique ce qu'il fait. Pas besoin d'y toucher pour
     changer le contenu.
   • Les tailles et positions à l'écran se règlent dans style.css,
     section 1 : le script les lit directement là-bas.

   PLAN
     0. ★ IMAGES / VIDÉOS DES PROJETS          (PROJECT_IMAGES)
     1. ★ RÉGLAGES ET TEXTES FR / EN / ES / IT (CONFIG)
     2. OUTILS                                 typographie, chargement des images
     3. MOTS INTERACTIFS                       « kaya » et « Let's talk »
     4. PROJETS                                défilement fluide, bandes horizontales, image agrandie
     5. « QUI SUIS-JE »
     6. PAGE 1 & DERNIÈRE PAGE                 e-mail, bas de page
     7. CURSEUR, LANGUE, iOS, DÉMARRAGE
   ===================================================================== */
"use strict";

/* =====================================================================
   0. ★ IMAGES / VIDÉOS DES PROJETS
   ---------------------------------------------------------------------
   • Chaque bloc [ ... ] = UN projet (le 1er bloc = projet 01, etc.).
     Toutes ses images sont affichées ensemble, entières, dans l'ordre.
   • "images/nom.jpg"             = une image.
   • { video: "images/nom.mp4" }  = une vidéo (en boucle, sans son ;
                                    avec le son dans l'image agrandie).
   • Ajouter un projet : copie un bloc entier, colle-le à la suite, puis
     ajoute son titre et son texte dans CONFIG.i18n.fr/en/es/it.projects,
     à la même position (3e bloc = 3e texte).
   • L'extension des IMAGES est retrouvée toute seule (.jpg, .webp, .png…).
     Pour les VIDÉOS, le chemin doit être exact.
   • Chemins relatifs à index.html : le dossier « images » est à côté.
   ===================================================================== */
const PROJECT_IMAGES = [
  // ---- Projet 1 ----
  [
    "images/projet1-1.webp",
    { video: "images/projet1-video.mp4" }, // ★ chemin réel de la vidéo (2e élément)
    "images/projet1-2.webp",
  ],
  // ---- Projet 2 ----
  [
    "images/projet2-1.webp",
    "images/projet2-2.png",
    "images/projet2-3.png",
    "images/projet2-4.png",
    
  ],
  // ---- Projet 3 ----
  [
    "images/projet3-1.jpg",
    "images/projet3-2.jpg",
    "images/projet3-3.jpg",
    "images/projet3-4.jpg",
    "images/projet3-5.jpg",
    "images/projet3-6.jpg",
  ],
  // ---- Projet 4 ----
  [
    "images/projet4-1.jpg",
    "images/projet4-2.jpg",
    "images/projet4-3.jpg",
    "images/projet4-4.jpg",
  ],
  // ---- Projet 5 ----
  [
    "images/projet5-1.jpg",
    "images/projet5-2.jpg",
    "images/projet5-3.jpg",
    
  ],
  // ---- Projet 6 ----
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

  // ---- Nom affiché dans l'onglet, sur Google et dans les textes alternatifs ----
  siteName: "Kaya Mahler",

  // ---- Langue affichée à la première visite : "fr", "en", "es" ou "it" ----
  defaultLang: "fr",

  // ---- Projets en défilement horizontal ----
  horizontal: {
    textHold: 1.1,  // temps de lecture du texte, bande immobile (en hauteurs d'écran à faire défiler) :
                    // plus grand = les mots s'allument plus lentement et le texte reste plus longtemps
  },

  // ---- Défilement fluide (ordinateur : souris et trackpad) ----
  smoothScroll: {
    lerp: 0.085,          // douceur : 0.05 = très glissant, 0.2 = plus direct
    wheelMultiplier: 1,   // distance parcourue par cran de molette (1 = normale)
    magnet: true,         // page 1 et dernière page se calent toutes seules
    magnetDelay: 160,     // attente (ms) après le dernier mouvement avant de caler
    magnetThreshold: 0.12,// dès 12 % de page parcourue, on finit le mouvement
    magnetLerp: 0.07,     // douceur du calage
  },

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
  showMissingImages: false, // true = liste les images introuvables à l'écran. Mettre false à la mise en ligne.
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
      // Référencement (Google, partage sur les réseaux) : sous-titre de l'onglet et description.
      tagline: "Graphisme — Lausanne",
      metaDescription: "Portfolio de Kaya Mahler, graphiste à Lausanne : affiches, éditions, typographie et photographie.",
      letsTalkTitle: "Let's talk!", // titre de la dernière page
      mailCopied: "Adresse copiée", // petit message après un clic sur l'e-mail
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
      tagline: "Graphic design — Lausanne",
      metaDescription: "Portfolio of Kaya Mahler, graphic designer in Lausanne: posters, editorial design, typography and photography.",
      letsTalkTitle: "Let's talk!",
      mailCopied: "Address copied",
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
      contactCity: "Lausana, Suiza",
      tagline: "Diseño gráfico — Lausana",
      metaDescription: "Portafolio de Kaya Mahler, diseño gráfico en Lausana: carteles, diseño editorial, tipografía y fotografía.",
      letsTalkTitle: "¡Hablemos!",
      mailCopied: "Dirección copiada",
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
      tagline: "Graphic design — Losanna",
      metaDescription: "Portfolio di Kaya Mahler, graphic designer a Losanna: manifesti, editoria, tipografia e fotografia.",
      letsTalkTitle: "Parliamo!",
      mailCopied: "Indirizzo copiato",
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

/* ---- Microtypographie ---------------------------------------------------
   Appliquée automatiquement à TOUS les textes affichés (boutons, ville,
   textes des projets) : tu peux donc écrire normalement dans CONFIG.
     • apostrophe droite ' → apostrophe typographique ’ ;
     • années 2026-2027 → tiret demi-cadratin 2026–2027 ;
     • espace insécable entre un nombre et le mot qui suit (50 photographies) ;
     • mots d'une ou deux lettres (à, y, de, la, un…) jamais seuls en fin de ligne ;
     • pas de dernier mot court seul sur la dernière ligne d'un paragraphe ;
     • français : espace fine insécable avant ; ! ? et à l'intérieur de « »,
       espace insécable avant « : » ;
     • espagnol et italien : guillemets «…» sans espace.
   ---------------------------------------------------------------------- */
const NBSP = "\u00A0";   // espace insécable
const NNBSP = "\u202F";  // espace fine insécable
function typo(text, lang = currentLang) {
  let t = String(text == null ? "" : text);
  t = t.replace(/'/g, "\u2019");                                   // ’
  t = t.replace(/(\d{4})-(\d{2,4})/g, "$1\u2013$2");              // 2026–2027
  t = t.replace(/(\d) (?=\p{L})/gu, "$1" + NBSP);                  // 50 photographies
  if (lang === "fr") {
    t = t.replace(/(\S)[ \u00A0\u202F]*([;!?])/g, "$1" + NNBSP + "$2");
    t = t.replace(/([^\s\d])[ \u00A0\u202F]*:/g, "$1" + NBSP + ":");
    t = t.replace(/«[ \u00A0\u202F]*/g, "«" + NNBSP).replace(/[ \u00A0\u202F]*»/g, NNBSP + "»");
  } else if (lang === "es" || lang === "it") {
    t = t.replace(/«[ \u00A0\u202F]*/g, "«").replace(/[ \u00A0\u202F]*»/g, "»");
  }
  // Dernier mot court (≤ 7 lettres) rattaché à l'avant-dernier : pas de mot isolé en fin de paragraphe.
  t = t.split("\n").map((line) => {
    const words = line.trim().split(" ");
    if (words.length < 4 || words[words.length - 1].length > 7) return line;
    const i = line.lastIndexOf(" ");
    return line.slice(0, i) + NBSP + line.slice(i + 1);
  }).join("\n");
  // Mots d'une ou deux lettres (à, a, y, de, la, le, un, en, et…) attachés au mot suivant.
  // Deux passages, pour les suites comme « de la crème ».
  for (let k = 0; k < 2; k++) t = t.replace(/(^|[\s\u00A0(«“¿¡])(\p{L}{1,2}) (?=\S)/gmu, "$1$2" + NBSP);
  return t;
}

/* ---- E-mail ----------------------------------------------------------------
   L'adresse est assemblée à la demande (jamais écrite en clair dans la page).
   Ouverture fiable sur ordinateur, téléphone et tablette :
   • les liens e-mail sont de vrais liens <a href="mailto:…"> : l'adresse est
     posée dans le lien au moment même du clic / du toucher, et c'est le
     navigateur qui ouvre la messagerie (méthode la plus compatible, iOS et
     Android compris, y compris dans les navigateurs d'Instagram, etc.) ;
   • les lettres de « Let's talk » (canvas) cliquent un lien de ce type ;
   • en plus, l'adresse est copiée et affichée quelques secondes en bas de
     l'écran : utile sur un ordinateur sans logiciel de messagerie.
   ---------------------------------------------------------------------- */
const mailAddress = () => CONFIG.contactEmail.user + String.fromCharCode(64) + CONFIG.contactEmail.domain;
const mailHref = () => "mailto:" + mailAddress();

let mailToastTimer = null;
function showMailToast() {
  const toast = $("mail-toast");
  if (!toast) return;
  const address = mailAddress();
  const show = (copied) => {
    const label = (CONFIG.i18n[currentLang] && CONFIG.i18n[currentLang].mailCopied) || "";
    toast.textContent = copied && label ? label + " · " + address : address;
    toast.classList.add("show");
    clearTimeout(mailToastTimer);
    mailToastTimer = setTimeout(() => toast.classList.remove("show"), 4500);
  };
  try {
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(address).then(() => show(true), () => show(false));
    else show(false);
  } catch (e) { show(false); }
}

// Ouvre la messagerie depuis du code (lettres de « Let's talk ») : on « clique » un vrai lien.
function openMail() {
  const link = document.createElement("a");
  link.href = mailHref();
  link.rel = "noopener";
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  link.remove();
  showMailToast();
}

// Transforme un lien <a> en lien e-mail fiable (href posé au dernier moment, anti-spam).
function armMailLink(link) {
  if (!link) return;
  const arm = () => { link.href = mailHref(); };
  ["pointerdown", "pointerenter", "touchstart", "focus", "contextmenu"].forEach((type) => link.addEventListener(type, arm, { passive: true }));
  link.addEventListener("click", () => { arm(); showMailToast(); }); // pas de preventDefault : le navigateur suit le lien mailto:
}

/* ---- Chargement fiable des images -------------------------------------
   Avant d'afficher une image, on vérifie qu'elle existe. Si non, on
   essaie la même image avec d'autres extensions (.jpg, .webp…). Le
   résultat (adresse + largeur + hauteur) est mémorisé pour ne jamais
   tester deux fois le même chemin.
   ---------------------------------------------------------------------- */
const imageCache = new Map();

// Renvoie { url, w, h } si l'image existe, sinon null.
function probeImage(url) {
  return new Promise((resolve) => {
    const test = new Image();
    test.onload = () => resolve({ url, w: test.naturalWidth, h: test.naturalHeight });
    test.onerror = () => resolve(null);
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
      const found = await probeImage(url);
      if (found) return found;
    }
    console.warn("[Kaya] image introuvable :", path);
    return null;
  })();
  imageCache.set(path, search);
  return search;
}

async function setImage(imgElement, path) {
  if (!imgElement) return;
  const found = await resolveImage(path);
  if (found) imgElement.src = found.url;
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
    anchor = null,                 // élément-cadre : le mot s'y pose, centré en hauteur
                                   // (taille max = largeur et hauteur du cadre). Sinon : mot centré dans la page.
    anchorAlign = "left",          // "left" = aligné à gauche du cadre, "center" = centré dans le cadre
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

  // Cadre de repos (option anchor), dans le repère de la page ; null = toute la page.
  function anchorBox() {
    if (!anchor) return null;
    const a = anchor.getBoundingClientRect(), p = page.getBoundingClientRect();
    if (!a.width || !a.height) return null;
    return { left: a.left - p.left, top: a.top - p.top, w: a.width, h: a.height };
  }

  // Taille des lettres : la plus grande qui tient dans le cadre
  // (ou qui respecte --…-size ET --…-width quand il n'y a pas de cadre).
  function computeFontSize(chars, box) {
    if (measureGlyphs) {
      ctx.font = fontAt(100);
      const natural = chars.reduce((sum, c) => sum + ctx.measureText(c).width, 0)
                    + settings.tracking * 100 * (chars.length - 1);
      if (box) return Math.min((100 * box.w) / Math.max(natural, 1), box.h);
      return Math.min((100 * W * settings.width) / Math.max(natural, 1), H * settings.size);
    }
    const n = Math.max(chars.length, 1);
    return Math.min((W * settings.width) / (n * 0.7), H * settings.size);
  }

  // Calcule la place « de repos » de chaque lettre.
  function layoutLetters() {
    const chars = getChars();
    const box = anchorBox();
    fontSize = computeFontSize(chars, box);
    const homeY = box ? box.top + box.h / 2 : H / 2; // dans le cadre, ou au milieu de la page

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
    const span = pairDistances.reduce((a, b) => a + b, 0);
    const wordW = span + radiusOf(0) + radiusOf(chars.length - 1);
    let x = box
      ? (anchorAlign === "center"
          ? box.left + (box.w - wordW) / 2 + radiusOf(0)          // centré dans le cadre
          : box.left + radiusOf(0))                               // aligné à gauche du cadre
      : W / 2 - span / 2;                                         // centré dans la page

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
  if (anchor) watchSize(anchor, resize); // le cadre change de taille avec l'écran
  watchVisibility(page, (visible) => { onScreen = visible; updateRunning(); });
  resize();

  return {
    start() { started = true; draw(); updateRunning(); },
    requestGyro,
    relayout: resize, // à appeler quand le texte ou la police change
  };
}



/* =====================================================================
   4. PROJETS : DÉFILEMENT FLUIDE, BANDES HORIZONTALES, IMAGE AGRANDIE
   ---------------------------------------------------------------------
   • Défilement fluide (initSmoothScroll) : sur ordinateur, la molette et
     le trackpad ne font plus « sauter » la page : le site glisse vers la
     position voulue avec de l'inertie (réglages : CONFIG.smoothScroll).
     Les projets défilent librement ; la page 1 et la dernière page se
     calent toutes seules quand on s'en approche.
   • Ordre : page 1 → page « Qui suis-je » (image) → projets → dernière page.
   • Projets (initProjects + initScrollFx) : en faisant défiler vers le bas,
     les images du projet arrivent de côté (bande horizontale, comme sur
     hugeinc.com) ; après la dernière image, le texte entre et ses mots
     s'allument un à un (CONFIG.horizontal).
     Clic sur une image = image agrandie (tous les écrans).
   • Téléphone / tablette : dans un projet, glisser le doigt vers le haut OU
     sur le côté fait avancer la bande (initTouchSwipe).
   ===================================================================== */

let lightboxOpen = false;        // true tant que l'image agrandie est ouverte
let openLightbox = () => {};     // (éléments, position, n° du projet) — remplacée par initLightbox()
let closeLightbox = () => {};    // remplacée par initLightbox()
let smooth = null;               // le défilement fluide (initSmoothScroll)
const projectSections = [];

const projectEntry = (i) => (CONFIG.i18n[currentLang].projects || [])[i] || null;
const isAboutOpen = () => { const a = $("about"); return !!(a && a.classList.contains("open")); };

/* ---- Défilement fluide ----------------------------------------------------
   Ordinateur (souris / trackpad) : chaque cran de molette déplace une
   « cible » ; la page glisse vers elle en douceur (interpolation à chaque
   image, indépendante de la fréquence de l'écran).
   Téléphone / tablette : défilement natif du navigateur (déjà fluide au
   doigt), avec un léger calage de la page 1 et de la dernière page (CSS).
   jumpTo(y) : saut immédiat (utilisé par le retour à l'accueil, sous un voile).
   ---------------------------------------------------------------------- */
function initSmoothScroll() {
  const scroller = $("scroller");
  const hero = $("page1");
  const footer = document.querySelector(".footer");
  const S = CONFIG.smoothScroll;
  const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

  let enabled = false;
  let target = 0, current = 0, ease = S.lerp;
  let rafId = null, lastTime = 0;
  let direction = 1, magnetTimer = null;

  const maxScroll = () => Math.max(0, scroller.scrollHeight - scroller.clientHeight);
  const clamp = (v) => Math.max(0, Math.min(maxScroll(), v));

  function stop() { if (rafId) cancelAnimationFrame(rafId); rafId = null; lastTime = 0; }
  function setEnabled() {
    enabled = fine.matches && !reduce.matches;
    document.documentElement.classList.toggle("smooth-scroll", enabled);
    stop();
    target = current = scroller.scrollTop;
  }

  function frame(now) {
    const dt = lastTime ? Math.min(64, now - lastTime) : 16.7;
    lastTime = now;
    const k = 1 - Math.pow(1 - ease, dt / 16.7); // même douceur à 60 Hz et à 120 Hz
    current += (target - current) * k;
    if (Math.abs(target - current) < 0.4) current = target;
    scroller.scrollTop = current;
    if (current !== target) rafId = requestAnimationFrame(frame);
    else { rafId = null; lastTime = 0; }
  }
  function run() { if (!rafId) rafId = requestAnimationFrame(frame); }

  // Va à la position y (en px depuis le haut du site), en douceur.
  function scrollTo(y, opts = {}) {
    const top = clamp(y);
    if (!enabled) { scroller.scrollTo({ top, behavior: reduce.matches ? "auto" : "smooth" }); return; }
    if (!rafId) target = current = scroller.scrollTop;
    direction = top >= current ? 1 : -1;
    ease = opts.ease || S.lerp;
    target = top;
    run();
  }

  /* -- Calage de la page 1 et de la dernière page (ordinateur) --
     Quand on s'arrête alors que la page 1 (ou la dernière page) est à
     moitié visible, le site finit le mouvement dans le sens où l'on allait. */
  function scheduleMagnet() {
    if (!S.magnet) return;
    clearTimeout(magnetTimer);
    magnetTimer = setTimeout(magnet, S.magnetDelay);
  }
  function magnet() {
    if (!enabled || lightboxOpen || isAboutOpen()) return;
    const H = scroller.clientHeight;
    const y = target;
    // Chaque page plein écran (page 1, « Qui suis-je », dernière page) a deux zones :
    // en train d'arriver (au-dessus d'elle) et en train de partir (en dessous).
    for (const page of document.querySelectorAll("#scroller > .page")) {
      const top = page.offsetTop;
      const zones = [[top - H, top], [top, top + H]];
      for (const [a, b] of zones) {
        if (a < 0 || b > maxScroll() + 1) continue;
        if (y > a + 1 && y < b - 1) {
          const f = (y - a) / (b - a);
          const goDown = direction > 0 ? f > S.magnetThreshold : f > 1 - S.magnetThreshold;
          scrollTo(goDown ? b : a, { ease: S.magnetLerp });
          return;
        }
      }
    }
  }

  /* -- Molette / trackpad -- */
  scroller.addEventListener("wheel", (e) => {
    if (!enabled || e.ctrlKey) return;                         // ctrl + molette = zoom du navigateur
    e.preventDefault();
    // Geste horizontal du trackpad : il fait avancer le site comme un geste vertical
    // (pratique dans les projets, qui défilent de côté).
    let d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (e.deltaMode === 1) d *= 40;                            // molette « par lignes » (Firefox)
    else if (e.deltaMode === 2) d *= scroller.clientHeight;    // « par pages »
    if (!rafId) target = current = scroller.scrollTop;
    target = clamp(target + d * S.wheelMultiplier);
    if (d) direction = d > 0 ? 1 : -1;
    ease = S.lerp;
    run();
    scheduleMagnet();
  }, { passive: false });

  /* -- Clavier : ↑ ↓, Page préc./suiv., Espace, Début, Fin -- */
  document.addEventListener("keydown", (e) => {
    if (!enabled || lightboxOpen || isAboutOpen() || e.defaultPrevented) return;
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    const tag = e.target && e.target.tagName;
    if ((e.key === " " || e.key === "Enter") && (tag === "BUTTON" || tag === "A" || tag === "FIGURE")) return;
    const H = scroller.clientHeight;
    const base = rafId ? target : scroller.scrollTop;
    let y = null;
    switch (e.key) {
      case "ArrowDown": y = base + 120; break;
      case "ArrowUp": y = base - 120; break;
      case "PageDown": y = base + H * 0.9; break;
      case "PageUp": y = base - H * 0.9; break;
      case " ": y = base + (e.shiftKey ? -1 : 1) * H * 0.9; break;
      case "Home": y = 0; break;
      case "End": y = maxScroll(); break;
      default: return;
    }
    e.preventDefault();
    scrollTo(y);
    scheduleMagnet();
  });

  // Défilement fait par quelqu'un d'autre (barre, clavier natif, ancre…) : on se recale.
  scroller.addEventListener("scroll", () => { if (!rafId) target = current = scroller.scrollTop; }, { passive: true });

  fine.addEventListener("change", setEnabled);
  reduce.addEventListener("change", setEnabled);
  setEnabled();

  // Saut immédiat, sans animation (le voile du retour à l'accueil le cache).
  function jumpTo(y) {
    stop();
    clearTimeout(magnetTimer);
    scroller.scrollTo({ top: clamp(y), behavior: "instant" });
    target = current = scroller.scrollTop;
  }

  return { scrollTo, jumpTo, scrollToElement: (el) => { if (el) scrollTo(el.offsetTop); } };
}

/* ---- Projets en défilement horizontal (inspiré de hugeinc.com) -------------
   Chaque projet est une longue section. Pendant qu'on la traverse en faisant
   défiler normalement (molette, trackpad, doigt), un cadre plein écran reste
   fixe et la bande du projet glisse de DROITE à GAUCHE :
       [ n° + titre ]  [ image 1 ]  [ image 2 ]  …  [ dernière image ]  [ texte ]
   Les images arrivent de côté, entières. Quand la dernière image est passée,
   le texte entre à son tour et ses mots s'allument un à un au fil du
   défilement ; la bande reste alors immobile le temps de lire
   (CONFIG.horizontal.textHold), puis le projet suivant arrive.
   Tout suit la position du défilement : en remontant, tout repart en arrière.
   ---------------------------------------------------------------------- */
const REDUCE_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)");
const fx = { projects: [], schedule: () => {} };
const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);

function initScrollFx() {
  const scroller = $("scroller");
  if (!scroller) return;
  let raf = null;

  // Mesure une bande : longueur du glissement et hauteur de la section.
  function measure(pr) {
    pr.section.querySelectorAll(".js-title").forEach(fitTitle);
    const vw = scroller.clientWidth, vh = scroller.clientHeight;
    pr.distance = Math.max(0, pr.track.scrollWidth - vw);       // glissement horizontal total (px)
    pr.hold = vh * CONFIG.horizontal.textHold;                  // temps de lecture, bande immobile
    pr.textStart = Math.max(0, pr.text.offsetLeft - vw * 0.75); // le texte commence à s'allumer
    pr.section.style.height = (vh + pr.distance + pr.hold) + "px";
    pr.measured = true;
  }
  fx.measure = (pr) => { measure(pr); schedule(); };

  function update() {
    raf = null;
    const vw = scroller.clientWidth, vh = scroller.clientHeight;
    const scrollerTop = scroller.getBoundingClientRect().top;

    // Page « Qui suis-je » : l'image se pose en douceur pendant qu'elle arrive.
    const about = $("about-page");
    if (about) {
      const r = about.getBoundingClientRect();
      const ap = REDUCE_MOTION.matches ? 1 : clamp01(1 - (r.top - scrollerTop) / vh);
      about.style.setProperty("--ap", ap.toFixed(4));
    }

    fx.projects.forEach((pr) => {
      if (!pr.measured) measure(pr);
      const r = pr.section.getBoundingClientRect();
      if (r.bottom < scrollerTop - 10 || r.top > scrollerTop + vh + 10) return; // hors écran
      const scrolled = scrollerTop - r.top; // px parcourus dans la section
      const x = Math.max(0, Math.min(pr.distance, scrolled));
      if (pr.x !== x) { pr.x = x; pr.track.style.transform = `translate3d(${-x.toFixed(1)}px, 0, 0)`; }

      // Barre de progression du projet (en bas).
      const total = pr.distance + pr.hold;
      pr.section.style.setProperty("--progress", total ? clamp01(scrolled / total).toFixed(4) : "1");

      // Images : elles grandissent un peu en arrivant de la droite.
      if (!REDUCE_MOTION.matches) {
        pr.figures.forEach((fig) => {
          const left = fig.offsetLeft - x;
          const p = clamp01((vw - left) / (vw * 0.55));
          if (fig._p !== p) { fig._p = p; fig.style.setProperty("--p", p.toFixed(4)); }
        });
      }

      // Texte : les mots s'allument entre son entrée et la fin du temps de lecture.
      const span = Math.max(1, pr.distance + pr.hold * 0.8 - pr.textStart);
      const tp = REDUCE_MOTION.matches ? 1 : clamp01((scrolled - pr.textStart) / span);
      pr.section.style.setProperty("--tp", tp.toFixed(4));
      const n = pr.words.length;
      const lit = tp >= 1 ? n : Math.floor(tp * (n + 3));
      if (lit !== pr.lit) {
        const from = Math.min(lit, pr.lit), to = Math.max(lit, pr.lit);
        for (let i = from; i < to && i < n; i++) pr.words[i].classList.toggle("lit", i < lit);
        pr.lit = lit;
      }
    });
  }

  function schedule() { if (!raf) raf = requestAnimationFrame(update); }
  fx.schedule = schedule;
  scroller.addEventListener("scroll", schedule, { passive: true });
  watchSize(scroller, () => { fx.projects.forEach(measure); schedule(); });
  REDUCE_MOTION.addEventListener("change", schedule);
  schedule();
}

// Titres des projets : jamais coupés (pas de césure). Si un mot est plus large
// que son bloc (téléphone, mot long), la taille du titre diminue juste assez
// pour que le mot tienne en entier.
function fitTitle(el) {
  el.style.fontSize = "";
  let size = parseFloat(getComputedStyle(el).fontSize) || 32;
  let guard = 0;
  while (el.scrollWidth > el.clientWidth + 1 && size > 14 && guard++ < 40) {
    size *= 0.94;
    el.style.fontSize = size.toFixed(1) + "px";
  }
}

/* ---- Téléphone / tablette : glisser sur le côté fait aussi avancer ------------
   Dans un projet, le doigt peut glisser vers le HAUT (défilement normal) ou
   sur le CÔTÉ : vers la gauche = on avance (les images suivantes arrivent),
   vers la droite = on revient. Le geste continue sur son élan quand on lâche.
   ---------------------------------------------------------------------- */
function initTouchSwipe() {
  const scroller = $("scroller");
  if (!scroller) return;
  let start = null, mode = null, lastX = 0, lastT = 0, velocity = 0, glide = null;

  const stopGlide = () => { if (glide) cancelAnimationFrame(glide); glide = null; };
  // Position posée tout de suite (le CSS « scroll-behavior: smooth » animerait chaque pas).
  const jump = (top) => scroller.scrollTo({ top, behavior: "instant" });

  scroller.addEventListener("touchstart", (e) => {
    stopGlide();
    const t = e.touches[0];
    if (e.touches.length !== 1 || !e.target.closest(".project-pin")) { start = null; return; }
    start = { x: t.clientX, y: t.clientY, top: scroller.scrollTop };
    mode = null; lastX = t.clientX; lastT = performance.now(); velocity = 0;
  }, { passive: true });

  scroller.addEventListener("touchmove", (e) => {
    if (!start) return;
    const t = e.touches[0];
    const dx = t.clientX - start.x, dy = t.clientY - start.y;
    if (!mode) {
      if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
      mode = Math.abs(dx) > Math.abs(dy) ? "side" : "down"; // « down » : le navigateur s'en charge
    }
    if (mode !== "side") return;
    if (e.cancelable) e.preventDefault();
    jump(start.top - dx);
    const now = performance.now();
    const dt = Math.max(1, now - lastT);
    velocity = 0.8 * velocity + 0.2 * ((lastX - t.clientX) / dt) * 16.7; // px par image
    lastX = t.clientX; lastT = now;
  }, { passive: false });

  scroller.addEventListener("touchend", () => {
    if (mode === "side" && Math.abs(velocity) > 0.5) {
      let v = velocity;
      const step = () => {
        jump(scroller.scrollTop + v);
        v *= 0.95;
        glide = Math.abs(v) > 0.3 ? requestAnimationFrame(step) : null;
      };
      glide = requestAnimationFrame(step);
    }
    start = null; mode = null;
  }, { passive: true });
}

// Texte alternatif des images d'un projet (lu par Google et les lecteurs d'écran) :
// « Titre du projet — Kaya Mahler (2/4) », dans la langue en cours.
function setProjectAlts(pr) {
  const e = projectEntry(pr.index);
  const n = pr.figures.length;
  pr.figures.forEach((fig, k) => {
    const media = fig.firstElementChild;
    const label = (e ? typo(e.title) + " — " : "") + CONFIG.siteName + " (" + (k + 1) + "/" + n + ")";
    if (media && media.tagName === "IMG") media.alt = label;
    else if (media) media.setAttribute("aria-label", label);
    fig.setAttribute("aria-label", label);
  });
}

// Écrit le titre et le texte d'un projet, le texte découpé en mots (les espaces
// insécables de la microtypographie restent dans le mot).
function fillProjectText(pr) {
  const e = projectEntry(pr.index);
  const title = e ? typo(e.title) : "";
  pr.section.querySelectorAll(".js-title").forEach((el) => { el.textContent = title; });
  const desc = pr.desc;
  desc.lang = currentLang; // césure dans la bonne langue
  desc.textContent = "";
  pr.words = [];
  (e ? typo(e.text) : "").split(/([ \n]+)/).forEach((part) => {
    if (!part) return;
    if (/^[ \n]+$/.test(part)) { desc.appendChild(document.createTextNode(part)); return; }
    const w = document.createElement("span");
    w.className = "w";
    w.textContent = part;
    desc.appendChild(w);
    pr.words.push(w);
  });
  pr.lit = 0;
  setProjectAlts(pr);
  pr.measured = false; // la largeur du texte peut changer avec la langue
  fx.schedule();
}

/* ---- Création des projets ------------------------------------------------ */
function initProjects() {
  const footer = document.querySelector(".footer");
  const total = String(PROJECT_IMAGES.length).padStart(2, "0");

  PROJECT_IMAGES.forEach((entries, index) => {
    const num = String(index + 1).padStart(2, "0");
    const section = document.createElement("section");
    section.className = "project";
    section.id = "projet-" + (index + 1);
    section.dataset.project = String(index);
    section.innerHTML =
      '<div class="project-pin">' +
        '<div class="project-track">' +
          '<header class="project-intro">' +
            '<p class="project-num"></p>' +
            '<h2 class="project-title js-title"></h2>' +
          '</header>' +
          '<div class="project-slides"></div>' +
          '<article class="project-text">' +
            '<p class="project-num"></p>' +
            '<h3 class="project-text-title js-title"></h3>' +
            '<div class="project-rule" aria-hidden="true"></div>' +
            '<p class="project-desc"></p>' +
          '</article>' +
        '</div>' +
        '<div class="project-progress" aria-hidden="true"></div>' +
        '<p class="notice" hidden></p>' +
      '</div>';
    section.querySelectorAll(".project-num").forEach((el) => { el.textContent = num + " / " + total; });
    footer.before(section);
    projectSections.push(section);

    const pr = {
      index, section,
      track: section.querySelector(".project-track"),
      text: section.querySelector(".project-text"),
      desc: section.querySelector(".project-desc"),
      figures: [], words: [], lit: 0, x: null, measured: false,
    };
    fx.projects.push(pr);

    // Vérifier les images (et lire leurs proportions), puis construire la bande.
    Promise.all(entries.map(async (entry) => {
      if (entry && typeof entry === "object" && entry.video) {
        return { path: entry.video, kind: "video", url: entry.video };
      }
      const found = await resolveImage(entry);
      return found ? { path: entry, kind: "image", url: found.url, w: found.w, h: found.h }
                   : { path: entry, kind: "image", url: null };
    })).then((results) => {
      buildGallery(pr, results.filter((r) => r.url));
      const missing = results.filter((r) => !r.url).map((r) => r.path);
      const notice = section.querySelector(".notice");
      if (CONFIG.showMissingImages && missing.length) {
        notice.textContent = "Éléments introuvables (projet " + (index + 1) + ") :\n" + missing.join("\n");
        notice.hidden = false;
      }
      fx.measure(pr);
    });
  });
  refreshProjectTitles();
}

// Titres et textes des projets dans la langue en cours.
function refreshProjectTitles() { fx.projects.forEach(fillProjectText); }

/* ---- Images d'un projet ----------------------------------------------------
   items = [{ kind: "image" | "video", url, w, h }]
   Chaque élément est posé dans un cadre (<figure>, position relative) qui a
   les proportions de l'image (--r = largeur / hauteur) : l'image y est
   toujours entière (object-fit: contain). Hauteur des images : --slide-h.
   Les vidéos tournent en boucle, sans son, seulement quand elles sont à l'écran.
   ---------------------------------------------------------------------- */
function buildGallery(pr, items) {
  const strip = pr.section.querySelector(".project-slides");
  const media = [];

  items.forEach((item, k) => {
    const fig = document.createElement("figure");
    fig.className = "project-item";
    fig.style.setProperty("--p", "1");
    fig.tabIndex = 0;
    fig.setAttribute("role", "button");
    fig.setAttribute("aria-label", (k + 1) + " / " + items.length);

    let el;
    if (item.kind === "video") {
      el = document.createElement("video");
      el.muted = true; el.setAttribute("muted", "");
      el.loop = true;
      el.playsInline = true; el.setAttribute("playsinline", "");
      el.preload = "metadata";
      el.src = item.url;
      fig.style.setProperty("--r", String(16 / 9)); // en attendant les vraies proportions
      el.addEventListener("loadedmetadata", () => {
        if (el.videoWidth && el.videoHeight) fig.style.setProperty("--r", String(el.videoWidth / el.videoHeight));
        fx.measure(pr); // la bande a changé de longueur
      });
      watchVisibility(fig, (visible) => { if (visible) el.play().catch(() => {}); else el.pause(); }, 0.2);
    } else {
      el = document.createElement("img");
      el.decoding = "async";
      el.alt = "";
      el.src = item.url;
      fig.style.setProperty("--r", String(item.w && item.h ? item.w / item.h : 1));
    }
    fig.appendChild(el);
    media.push(el);

    const open = () => openLightbox(media, k, pr.index);
    fig.addEventListener("click", open);
    fig.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); }
    });
    strip.appendChild(fig);
    pr.figures.push(fig);
  });
  setProjectAlts(pr);
}

/* ---- Geste horizontal (trackpad ou doigt), pour l'image agrandie ----------
   callback(+1) = suivant, callback(-1) = précédent. Un seul changement par geste.
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

/* ---- Image agrandie (lightbox), commune à tous les projets ----------------
   Ouverture : clic sur une image. Fermeture : nouveau clic n'importe où, la
   croix ou Échap. Suivante / précédente : flèches, touches ← →, trackpad ou
   glissement du doigt.
   ---------------------------------------------------------------------- */
function initLightbox() {
  const overlay = $("lightbox");
  const content = $("lightbox-content");
  const closeBtn = $("lightbox-close");
  const prevBtn = $("lightbox-prev");
  const nextBtn = $("lightbox-next");
  if (!overlay || !content) return null;

  let list = [], index = 0;

  function render() {
    content.innerHTML = ""; // arrête aussi une vidéo en cours
    const source = list[index];
    if (!source) return;
    const clone = source.cloneNode(true);
    clone.removeAttribute("style");
    if (clone.tagName === "VIDEO") {
      clone.muted = false; // le son est autorisé ici, car l'ouverture vient d'un clic
      clone.loop = true;
      clone.play().catch(() => { clone.muted = true; clone.play().catch(() => {}); });
    }
    content.appendChild(clone);
    const several = list.length > 1;
    if (prevBtn) prevBtn.hidden = !several;
    if (nextBtn) nextBtn.hidden = !several;
  }

  function go(step) {
    if (list.length < 2) return;
    index = (index + step + list.length) % list.length;
    render();
  }

  function close() {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    content.innerHTML = "";
    lightboxOpen = false;
    list = [];
  }

  // elements = images/vidéos du projet · start = position · project = n° du projet
  function open(elements, start, project) {
    if (!elements || !elements.length) return;
    list = elements; index = start || 0;
    render();
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    lightboxOpen = true;
  }

  overlay.addEventListener("click", close);
  if (closeBtn) closeBtn.addEventListener("click", (e) => { e.stopPropagation(); close(); });
  if (prevBtn) prevBtn.addEventListener("click", (e) => { e.stopPropagation(); go(-1); });
  if (nextBtn) nextBtn.addEventListener("click", (e) => { e.stopPropagation(); go(1); });
  onHorizontalGesture(overlay, go);
  document.addEventListener("keydown", (e) => {
    if (!overlay.classList.contains("open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "ArrowRight") { e.preventDefault(); go(1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); go(-1); }
  });

  closeLightbox = close;
  return open;
}


/* =====================================================================
   5. « QUI SUIS-JE »
   ---------------------------------------------------------------------
   L'image « Qui suis-je » de la langue en cours (CONFIG.aboutImages) est
   affichée sur la page 2 ; un clic sur une lettre de « kaya » l'ouvre
   aussi en plein écran.
   ===================================================================== */
let refreshAboutImage = () => {};
let openAboutFromWord = () => {};

function initAbout() {
  const overlay = $("about");
  const image = $("about-img");
  const missing = $("about-missing");
  const closeButton = $("about-close");
  if (!overlay) return;

  let lastOpener = null;
  let requestId = 0; // évite qu'une réponse lente remplace une plus récente
  refreshAboutImage = async () => {
    const thisRequest = ++requestId;
    const wanted = CONFIG.aboutImages[currentLang];
    const found = await resolveImage(wanted);
    const url = found && found.url;
    if (thisRequest !== requestId) return;
    const aboutPageImg = $("about-page-img"); // page « Qui suis-je » (après la page 1)
    const aboutAlt = CONFIG.siteName + " — " + typo(CONFIG.i18n[currentLang].aboutLabel || "");
    image.alt = aboutAlt;
    if (aboutPageImg) {
      aboutPageImg.alt = aboutAlt;
      if (url) { aboutPageImg.src = url; aboutPageImg.hidden = false; }
      else { aboutPageImg.removeAttribute("src"); aboutPageImg.hidden = true; }
    }
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

  // Clic sur le mot « kaya » (page 1) : l'image « Qui suis-je » en plein écran.
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
  refreshHeroImage(); // page 1 : image d'accueil en fond
}

/* ---- E-mail à l'épreuve des robots ------------------------------------
   Rien n'est écrit en clair dans index.html : le script assemble l'adresse
   à partir de CONFIG.contactEmail. Le « @ » affiché vient du CSS, et le
   lien mailto: n'est posé qu'au survol, au toucher ou au clic (armMailLink,
   section 2). Le clic ouvre la messagerie par défaut sur tous les appareils.
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
    armMailLink(link);
  });
  armMailLink($("talk-link")); // « Let's talk », au centre de la dernière page
}

/* ---- Bas de page : une ligne, ou empilé à droite ? --------------------
   Sur la page 1 et la dernière page, on vérifie si la ville (gauche) et
   l'e-mail (droite) tiennent sur UNE ligne sans se toucher. Sinon, la
   classe .contact-stacked est ajoutée à la page et le CSS les empile à
   droite (voir style.css, section 4).
   Revérifié à chaque changement de taille d'écran, de langue ou de police.
   ---------------------------------------------------------------------- */
let refreshContactLayout = () => {};

function initContactLayout() {
  const MIN_GAP = 16; // espace minimum (px) entre les deux éléments
  const sections = [...document.querySelectorAll(".hero, .footer")];

  function check(section) {
    const left = section.querySelector(".contact-left");
    const right = section.querySelector(".contact-right");
    if (!left || !right) return;
    section.classList.remove("contact-stacked"); // on mesure d'abord la disposition sur une ligne
    const a = left.getBoundingClientRect();
    const c = right.getBoundingClientRect();
    section.classList.toggle("contact-stacked", a.right + MIN_GAP > c.left);
  }

  refreshContactLayout = () => sections.forEach(check);
  sections.forEach((section) => watchSize(section, () => check(section)));
  refreshContactLayout();
}


/* =====================================================================
   7. CURSEUR, LANGUE, iOS, DÉMARRAGE
   ===================================================================== */

// Image de fond de la page 1 : l'image d'accueil (CONFIG.heroImage), à 50 % d'opacité (style.css).
function refreshHeroImage() {
  setImage($("hero-bg"), CONFIG.heroImage);
}

// Signe ▾ en bas de la page 1 : un clic glisse en douceur jusqu'à la page « Qui suis-je ».
function initScrollCue() {
  const cue = $("scroll-cue");
  if (!cue) return;
  cue.addEventListener("click", () => {
    const next = $("about-page") || document.getElementById("projet-1") || document.querySelector(".footer");
    if (!next) return;
    if (smooth) smooth.scrollToElement(next);
    else next.scrollIntoView({ behavior: "smooth" });
  });
}

/* ---- Retour à l'accueil (flèche ▴ de la dernière page) ---------------------
   Doux ET direct : un voile du noir du site se pose (0,35 s), le site saute
   d'un coup en haut (on ne voit pas défiler tous les projets), puis le voile
   se lève et la page 1 apparaît en douceur. Réglages : style.css, section 13
   (.veil, durées). Personnes sensibles au mouvement : retour immédiat.
   ---------------------------------------------------------------------- */
let goingHome = false;
function goHome() {
  const scroller = $("scroller");
  const veil = $("veil");
  const hero = $("page1");
  const jump = () => {
    if (smooth) smooth.jumpTo(0);
    else scroller.scrollTo({ top: 0, behavior: "instant" });
  };
  if (!veil || REDUCE_MOTION.matches) { jump(); return; }
  if (goingHome) return;
  goingHome = true;
  veil.classList.add("on");
  setTimeout(() => {
    jump();
    if (hero) { hero.classList.remove("arrive"); void hero.offsetWidth; hero.classList.add("arrive"); }
    requestAnimationFrame(() => {
      veil.classList.remove("on");
      setTimeout(() => { goingHome = false; if (hero) hero.classList.remove("arrive"); }, 1000);
    });
  }, 380);
}

function initScrollTop() {
  const btn = $("scroll-top");
  if (btn) btn.addEventListener("click", goHome);
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

// Titre « Let's talk! » : police Africa, au centre de la dernière page,
// dans le cadre .talk-link (réglages : style.css, --talk-w, --talk-h, --talk-tracking).
// Clic / toucher sur le cadre ou sur une lettre = ouverture de la messagerie.
function initTalkWord() {
  const footer = document.querySelector(".footer");
  if (!footer) return;
  talkWord = createInteractiveWord({
    canvasId: "talk-canvas",
    page: footer,
    getChars: () => [...typo(CONFIG.i18n[currentLang].letsTalkTitle || "", "en")], // « Let’s » avec apostrophe typographique
    fontFamilyVar: "--font-africa",
    fontFamilyFallback: "Georgia, serif",
    textColorVar: "--color-footer-text", // blanc (réglé dans style.css)
    measureGlyphs: true,
    anchor: $("talk-link"),
    anchorAlign: "center",
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
    if (value !== undefined) el.textContent = typo(value, lang);
  });
  document.querySelectorAll(".lang button").forEach((button) => {
    button.setAttribute("aria-current", button.dataset.lang === lang ? "true" : "false");
  });
  // Référencement : titre de l'onglet, description et Open Graph dans la langue choisie.
  const L = CONFIG.i18n[lang];
  const pageTitle = CONFIG.siteName + " — " + typo(L.tagline || "", lang);
  document.title = pageTitle;
  const setMeta = (sel, value) => { const m = document.querySelector(sel); if (m && value) m.setAttribute("content", value); };
  setMeta('meta[name="description"]', L.metaDescription);
  setMeta('meta[property="og:title"]', pageTitle);
  setMeta('meta[property="og:description"]', L.metaDescription);
  setMeta('meta[property="og:locale"]', { fr: "fr_CH", en: "en_GB", es: "es_ES", it: "it_CH" }[lang]);
  const aboutPage = $("about-page");
  if (aboutPage) aboutPage.setAttribute("aria-label", typo(L.aboutLabel || "", lang));
  const talkLink = $("talk-link");
  if (talkLink) talkLink.setAttribute("aria-label", typo(CONFIG.i18n[lang].letsTalkTitle || "", lang) + " — e-mail");
  refreshProjectTitles();                  // titres des projets
  refreshAboutImage();
  refreshContactLayout(); // les textes ont changé de longueur
  if (talkWord) talkWord.relayout();
  if (kayaWord) kayaWord.relayout();
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
  initScrollFx();                          // animations liées au défilement
  initProjects();                          // crée les projets (textes + galeries)
  smooth = initSmoothScroll();             // défilement fluide
  initTouchSwipe();                        // téléphone : glisser sur le côté fait aussi avancer
  initAbout();
  initFixedImages();
  applyContactEmail();
  initCursor();
  initTalkWord();
  initContactLayout();
  initLang();           // remplit tous les textes (à faire après la création des projets)

  // « kaya » : mêmes lettres mobiles que « Let's talk ». Tailles et écarts : style.css (--kaya-…).
  const kaya = createInteractiveWord({
    canvasId: "kaya-canvas",
    page: $("page1"),
    getChars: () => ["k", "a", "y", "a"],
    fontFamilyVar: "--font-africa",
    fontFamilyFallback: "Georgia, serif",
    textColorVar: "--ink",
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
  // lettres, puis l'animation démarre.
  const onFontReady = () => {
    [kaya, talkWord].forEach((w) => { if (w) { w.relayout(); w.start(); } });
  };
  if (document.fonts && document.fonts.load) document.fonts.load('100px "Africa"').then(onFontReady, onFontReady);
  else onFontReady();

  initScrollCue();
  initScrollTop();

  // La police Alaska change la largeur des textes du bas de page : on revérifie.
  // Elle change aussi la largeur des titres et des textes des projets : on remesure les bandes.
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => {
    refreshContactLayout();
    if (kayaWord) kayaWord.relayout();
    fx.projects.forEach((pr) => { pr.measured = false; });
    fx.schedule();
  });
});
