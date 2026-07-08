// Données centrales du site LIAM Groupe
// Images hébergées sur Cloudinary — optimisées avec f_auto,q_auto

const CLOUD_NAME = 'dwmrzp61c'
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`

/**
 * Génère une URL Cloudinary optimisée pour une image.
 * Utilise f_auto (meilleur format), q_auto (qualité optimale)
 * et dpr_auto (adaptation aux écrans retina).
 * @param {string} seed  Identifiant unique de l'image (ex: "home-hero")
 * @param {number} w     Largeur souhaitée
 * @param {number} h     Hauteur souhaitée
 * @param {string} fit   Mode de redimensionnement (fill, scale, etc.)
 * @param {string} quality Qualité Cloudinary (auto, eco, best, good, low)
 */
export const img = (seed, w = 800, h = 600, fit = 'fill', quality = 'auto') =>
  `${BASE_URL}/f_auto,q_${quality},w_${w},h_${h},c_${fit},dpr_auto/v1/liam-groupe/${seed}`

/**
 * Génère une URL de blur placeholder Cloudinary (très petite, qualité basse)
 * pour l'effet de chargement progressif (LQIP).
 */
export const imgBlur = (seed) =>
  `${BASE_URL}/f_auto,q_10,w_200,h_112,c_fill,e_blur:500,dpr_auto/v1/liam-groupe/${seed}`

/**
 * Version optimisée pour les images hero — plus légère et éco.
 */
export const imgHero = (seed) => img(seed, 1600, 900, 'fill', 'eco')

/**
 * Génère les URLs srcSet pour le chargement responsive d'images.
 * Produit des URLs à différentes largeurs pour que le navigateur
 * choisisse la meilleure taille selon l'écran.
 * @param {string} seed  Identifiant unique de l'image
 * @param {number[]} widths  Largeurs à générer (par défaut: 480, 768, 1024, 1280, 1600)
 * @param {number} h    Hauteur
 * @param {string} fit  Mode de redimensionnement
 */
export const imgSrcSet = (seed, widths = [480, 768, 1024, 1280, 1600], h = 600, fit = 'fill') =>
  widths
    .map(w => `${BASE_URL}/f_auto,q_auto,w_${w},h_${h},c_${fit},dpr_auto/v1/liam-groupe/${seed} ${w}w`)
    .join(', ')

/**
 * Attribut sizes pour accompagner srcSet, indiquant la largeur
de rendu de l'image selon la largeur de la fenêtre.
 * @param {string} type  'full' (100vw) | 'half' (50vw) | 'third' (33vw)
 */
export const imgSizes = (type = 'full') => {
  const sizes = {
    full: '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 100vw',
    half: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 50vw',
    third: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  }
  return sizes[type] || sizes.full
}

export const siteInfo = {
  name: "LIAM",
  fullName: "LIAM Groupe",
  tagline: "Révéler les talents, créer des opportunités durables",
  description:
    "Structure pluridisciplinaire développant des projets culturels, sportifs, entrepreneuriaux et gastronomiques à fort impact social en République Centrafricaine.",
  address: ["Avenue des Martyrs, Immeuble Salle King", "Bangui, République Centrafricaine"],
  phones: ["+236 76 00 00 00"],
  emails: ["contact@liamgroupe.org", "partenariat@liamgroupe.org"],
  hours: ["Lundi — Vendredi : 8h00 — 17h00", "Samedi : 9h00 — 13h00"],
  foundingYear: 2015,
  social: {
    whatsapp: "23676000000",
    facebook: "https://www.facebook.com/people/LIAM-Groupe/61585885973346/",
    instagram: "https://instagram.com/liamgroupe",
    x: "https://x.com/liamgroupe",
    youtube: "https://youtube.com/@liamgroupe",
  },
  contactPage: {
    address: ["Secteur 3, Rue des Martyrs", "Bangui, République Centrafricaine"],
    phones: ["+236 76 00 00 00"],
    emails: ["contact@liamgroupe.cf", "partenariats@liamgroupe.cf"],
    hours: ["Lundi — Vendredi : 8h00 — 17h00", "Samedi : 9h00 — 12h00"],
  },
};

export const navLinks = [
  { label: "Accueil", to: "/" },
  { label: "À propos", to: "/a-propos" },
  { label: "Domaines", to: "/domaines", dropdown: true },
  { label: "Événements", to: "/evenements" },
  { label: "Actualités", to: "/actualites" },
];

export const domains = [
  {
    slug: "g-fitness",
    name: "G-Fitness",
    category: "SPORT & BIEN-ÊTRE",
    icon: "heart",
    shortDescription:
      "Promouvoir la santé et le bien-être par le sport, avec des programmes adaptés aux femmes et aux jeunes de Bangui. Tournois de basketball…",
    heroImage: img("gfitness-hero", 1920, 700),
    cardImage: img("gfitness-hero", 800, 500),
    programs: [
      {
        title: "Tournoi Féminin de Basketball",
        description:
          "Compétition inter-quartiers rassemblant 16 équipes féminines à Bangui.",
      },
      {
        title: "G-Fitness Junior",
        description:
          "Programme d'initiation sportive pour les enfants et adolescents des quartiers défavorisés.",
      },
      {
        title: "Santé par le sport",
        description:
          "Ateliers de sensibilisation à l'hygiène de vie et à la nutrition équilibrée.",
      },
    ],
    gallery: [img("gfitness-gallery-1", 700, 500), img("gfitness-gallery-2", 700, 500)],
  },
  {
    slug: "ogab",
    name: "O'GAB",
    category: "GASTRONOMIE SOLIDAIRE",
    icon: "utensils",
    shortDescription:
      "Valoriser la richesse culinaire centrafricaine tout en créant des opportunités économiques pour les femmes. Restauration événementielle, atelie…",
    heroImage: img("ogab-hero", 1920, 700),
    cardImage: img("ogab-hero", 800, 500),
    programs: [
      {
        title: "Ateliers culinaires",
        description:
          "Formation en cuisine traditionnelle et moderne pour les femmes entrepreneures.",
      },
      {
        title: "Restauration événementielle",
        description:
          "Service de traiteur pour les événements, valorisant les produits locaux.",
      },
      {
        title: "Restaurant solidaire",
        description:
          "Établissement proposant une cuisine accessible tout en employant des femmes formées.",
      },
    ],
    gallery: [img("ogab-gallery-1", 700, 500), img("ogab-gallery-2", 700, 500)],
  },
  {
    slug: "entrepreneuriat",
    name: "Entrepreneuriat & Leadership",
    category: "LEADERSHIP FÉMININ",
    icon: "briefcase",
    shortDescription:
      "Autonomiser les femmes centrafricaines par la formation au leadership, l'accompagnement entrepreneurial et la mise en réseau…",
    heroImage: img("entreprenariat-hero", 1920, 700),
    cardImage: img("entreprenariat-hero", 800, 500),
    programs: [
      {
        title: "Conférences « Oser Entreprendre »",
        description:
          "Événements inspirants avec des femmes leaders du secteur privé et public.",
      },
      {
        title: "Programme d'incubation",
        description:
          "Accompagnement de 6 mois pour les projets entrepreneuriaux féminins.",
      },
      {
        title: "Mentorat",
        description:
          "Mise en relation entre entrepreneures débutantes et mentors expérimentés.",
      },
    ],
    gallery: [img("entreprenariat-gallery-1", 700, 500), img("entreprenariat-gallery-2", 700, 500)],
  },
  {
    slug: "formation",
    name: "Formation des Jeunes",
    category: "ÉDUCATION & INSERTION",
    icon: "graduation",
    shortDescription:
      "Offrir aux jeunes centrafricains des formations pratiques et professionnalisantes pour favoriser leur insertion sur le marché du travail. Ateliers,…",
    heroImage: img("formation-hero", 1920, 700),
    cardImage: img("formation-hero", 800, 500),
    programs: [
      {
        title: "Formation professionnelle",
        description:
          "Ateliers pratiques dans les métiers du numérique, de la cuisine, de la communication.",
      },
      {
        title: "Stages en entreprise",
        description:
          "Mise en relation avec des partenaires employeurs pour des stages rémunérés.",
      },
      {
        title: "Programme de mentorat",
        description:
          "Accompagnement individuel des jeunes par des professionnels expérimentés.",
      },
    ],
    gallery: [img("formation-gallery-1", 700, 500), img("formation-gallery-2", 700, 500)],
  },
  {
    slug: "communication",
    name: "Communication",
    category: "VISIBILITÉ & MÉDIAS",
    icon: "megaphone",
    shortDescription:
      "Assurer la visibilité des actions de LIAM Groupe et de ses partenaires à travers une stratégie de communication moderne : relations presse,…",
    heroImage: img("communication-hero", 1920, 700),
    cardImage: img("communication-hero", 800, 500),
    programs: [
      {
        title: "Relations presse",
        description:
          "Couverture médiatique des événements et diffusion des communiqués aux médias locaux et internationaux.",
      },
      {
        title: "Production audiovisuelle",
        description:
          "Création de documentaires, reportages et contenus digitaux mettant en valeur nos actions.",
      },
      {
        title: "Community management",
        description:
          "Gestion des réseaux sociaux et engagement de la communauté en ligne.",
      },
    ],
    gallery: [img("communication-gallery-1", 700, 500), img("communication-gallery-2", 700, 500)],
  },
  {
    slug: "evenementiel",
    name: "Événementiel",
    category: "CULTURE & GALAS",
    icon: "calendar",
    shortDescription:
      "Organiser des événements d'envergure qui rassemblent, inspirent et célèbrent la culture centrafricaine. Miss Centrafrique, galas de…",
    heroImage: img("evenementiel-hero", 1920, 700),
    cardImage: img("evenementiel-hero", 800, 500),
    programs: [
      {
        title: "Miss Centrafrique",
        description: "Concours national de beauté et de culture célébrant la diversité de la RCA.",
      },
      {
        title: "Gala de charité",
        description:
          "Soirée prestigieuse réunissant partenaires et donateurs pour le financement des programmes.",
      },
      {
        title: "Festivals culturels",
        description:
          "Manifestations artistiques mettant en valeur la musique, la danse et les arts locaux.",
      },
    ],
    gallery: [img("evenementiel-gallery-1", 700, 500), img("evenementiel-gallery-2", 700, 500)],
  },
];

// Images du carousel hero de l'accueil
// Utilise les héros des autres pages pour créer une rotation variée
export const homeHeroImages = [
  img('home-hero', 1920, 1080),
  img('apropos-hero', 1920, 1080),
  img('evenements-hero', 1920, 1080),
  img('actualites-hero', 1920, 1080),
  img('partenaires-hero', 1920, 1080),
  img('gfitness-hero', 1920, 1080),
  img('ogab-hero', 1920, 1080),
  img('entreprenariat-hero', 1920, 1080),
  img('formation-hero', 1920, 1080),
  img('communication-hero', 1920, 1080),
  img('evenementiel-hero', 1920, 1080),
];

export const events = [
  {
    slug: "tournoi-feminin-basketball-2026",
    title: "Tournoi Féminin de Basketball — Édition 2026",
    date: "15 Août 2026",
    location: "Gymnase Omnisports de Bangui",
    category: "G-Fitness",
    status: "a_venir",
    image: img("event-basketball", 800, 600),
    description:
      "La 3ème édition du tournoi inter-quartiers de basketball féminin rassemble 16 équipes pour une compétition de haut niveau….",
  },
  {
    slug: "conference-leadership-feminin",
    title: "Conférence Leadership Féminin — « Oser Entreprendre »",
    date: "28 Juin 2026",
    location: "Salle de Conférence ASK Gras Savoye, Bangui",
    category: "Entrepreneuriat",
    status: "a_venir",
    image: img("event-conference", 800, 600),
    description:
      "Une journée de partage et d'inspiration avec des femmes leaders du secteur privé et public centrafricain. Ateliers pratiques,…",
  },
  {
    slug: "atelier-formation-creation-entreprise",
    title: "Atelier Formation — Création d'Entreprise",
    date: "10 Juillet 2026",
    location: "Siège LIAM Groupe, Bangui",
    category: "Formation",
    status: "a_venir",
    image: img("event-formation", 800, 600),
    description:
      "Formation intensive de 3 jours pour les jeunes entrepreneurs. Business model, financement, marketing digital et gestion…",
  },
  {
    slug: "soiree-gala-liam-2025",
    title: "Soirée de Gala — LIAM Groupe 2025",
    date: "20 Décembre 2025",
    location: "Hôtel Ledger Plaza, Bangui",
    category: "Événementiel",
    status: "passe",
    image: img("event-gala", 800, 600),
    description:
      "Une soirée prestigieuse réunissant partenaires, sponsors et personnalités pour célébrer les réalisations de l'année….",
  },
  {
    slug: "atelier-gastronomie-saveurs-centrafrique",
    title: "Atelier Gastronomie — Saveurs de Centrafrique",
    date: "10 Novembre 2025",
    location: "Espace O'GAB, Bangui",
    category: "O'GAB",
    status: "passe",
    image: img("event-gastronomie", 800, 600),
    description:
      "Atelier culinaire mettant à l'honneur les produits locaux et le savoir-faire des femmes centrafricaines. Dégustation et…",
  },
  {
    slug: "miss-centrafrique-2025",
    title: "Miss Centrafrique 2025",
    date: "15 Octobre 2025",
    location: "Salle King, Bangui",
    category: "Événementiel",
    status: "passe",
    image: img("event-miss", 800, 600),
    description:
      "Concours de beauté et de culture célébrant la diversité et la richesse culturelle de la République Centrafricaine. Plus de 5000…",
  },
];

export const news = [
  {
    slug: "prix-innovation-sociale-2026",
    tag: "ACTUALITÉ",
    date: "12 Juin 2026",
    title: "LIAM Groupe remporte le prix de l'Innovation Sociale 2026",
    excerpt:
      "Reconnue pour son impact sur l'entrepreneuriat féminin en Centrafrique, LIAM Groupe a été récompensée lors du…",
    image: img("news-prix", 800, 600),
    author: "Équipe Communication LIAM Groupe",
    content: [
      "Reconnue pour son impact sur l'entrepreneuriat féminin en Centrafrique, LIAM Groupe a été récompensée lors du Forum National de l'Innovation Sociale qui s'est tenu à Bangui. Ce prix salue plus de dix années d'actions concrètes en faveur de l'autonomisation des femmes et des jeunes centrafricains.",
      "Le jury a particulièrement retenu l'approche intégrée de l'organisation, qui combine formation, accompagnement entrepreneurial et mise en réseau à travers ses différents programmes : G-Fitness, O'GAB, Entrepreneuriat & Leadership et Formation des Jeunes.",
      "« Cette distinction appartient avant tout aux centaines de femmes et de jeunes qui, chaque jour, portent nos programmes sur le terrain », a déclaré la Présidente de LIAM Groupe lors de la remise du prix. L'organisation entend désormais accélérer le déploiement de ses initiatives dans d'autres préfectures du pays.",
    ],
  },
  {
    slug: "partenariat-minusca",
    tag: "PARTENARIAT",
    date: "3 Mai 2026",
    title: "Nouveau partenariat avec la MINUSCA pour la paix par le sport",
    excerpt:
      "Un accord de coopération a été signé pour organiser des tournois inter-communautaires dans les préfectures de…",
    image: img("news-minusca", 800, 600),
    author: "Équipe Communication LIAM Groupe",
    content: [
      "Un accord de coopération a été signé entre LIAM Groupe et la MINUSCA pour organiser des tournois sportifs inter-communautaires dans plusieurs préfectures du pays. L'objectif : utiliser le sport comme outil de cohésion sociale et de réconciliation entre les communautés.",
      "Le programme G-Fitness, déjà reconnu à Bangui pour ses tournois féminins de basketball, servira de socle méthodologique à cette initiative élargie. Des rencontres sportives mixtes seront organisées dans les prochains mois, encadrées par des animateurs formés aux enjeux de dialogue communautaire.",
      "Ce partenariat s'inscrit dans la continuité des actions de LIAM Groupe pour une Centrafrique apaisée, où le sport devient un langage commun au-delà des divisions.",
    ],
  },
  {
    slug: "ogab-restaurant-solidaire",
    tag: "O'GAB",
    date: "18 Avril 2026",
    title: "O'GAB ouvre son premier restaurant solidaire à Bangui",
    excerpt:
      "Le restaurant O'GAB emploie 15 femmes formées par LIAM Groupe et propose une cuisine 100% locale à des prix accessibles.",
    image: img("news-ogab", 800, 600),
    author: "Équipe Communication LIAM Groupe",
    content: [
      "Le restaurant O'GAB a ouvert ses portes au cœur de Bangui. Il emploie 15 femmes formées par LIAM Groupe dans le cadre de son programme de gastronomie solidaire, et propose une cuisine 100% locale à des prix accessibles à tous les Banguissois.",
      "Au-delà de la restauration, l'établissement sert de vitrine pour les produits du terroir centrafricain et de lieu de formation continue pour de nouvelles promotions de femmes entrepreneures.",
      "« Chaque plat servi ici raconte une histoire de résilience et de savoir-faire », confie l'une des cheffes formées par le programme O'GAB. Le restaurant est ouvert du lundi au samedi, de 11h à 21h.",
    ],
  },
  {
    slug: "500-jeunes-formes-numerique",
    tag: "FORMATION",
    date: "10 Mars 2026",
    title: "500 jeunes formés aux métiers du numérique en 2025",
    excerpt:
      "Bilan de l'année écoulée pour le programme de formation des jeunes : 500 diplômés, 120 emplois créés et 30 startups…",
    image: img("news-formation", 800, 600),
    author: "Équipe Communication LIAM Groupe",
    content: [
      "Le bilan de l'année 2025 pour le programme Formation des Jeunes de LIAM Groupe est sans appel : 500 jeunes diplômés dans les métiers du numérique, du développement web à la communication digitale en passant par la gestion de projet.",
      "Sur ces 500 diplômés, 120 ont déjà décroché un emploi et une trentaine ont lancé leur propre startup avec l'appui du programme d'incubation de LIAM Groupe. Des résultats qui confirment la pertinence d'une formation courte, pratique et ancrée dans les besoins réels du marché centrafricain.",
      "Pour 2026, l'organisation prévoit de doubler sa capacité d'accueil et d'ouvrir de nouvelles filières, notamment autour du commerce en ligne et du Mobile Money.",
    ],
  },
  {
    slug: "tournoi-basketball-10000-spectateurs",
    tag: "G-FITNESS",
    date: "22 Février 2026",
    title: "Le Tournoi Féminin de Basketball atteint 10 000 spectateurs",
    excerpt:
      "Record d'affluence battu pour la finale du tournoi inter-quartiers. Un événement qui confirme l'engouement croissant pour le…",
    image: img("news-basketball", 800, 600),
    author: "Équipe Communication LIAM Groupe",
    content: [
      "La finale du Tournoi Féminin de Basketball, organisée par le programme G-Fitness de LIAM Groupe, a rassemblé plus de 10 000 spectateurs au Gymnase Omnisports de Bangui, un record d'affluence pour cet événement désormais incontournable.",
      "Seize équipes issues de différents quartiers de la capitale se sont affrontées pendant deux semaines dans une ambiance festive. La finale a été marquée par la présence de plusieurs personnalités publiques venues soutenir l'initiative.",
      "Fort de ce succès, LIAM Groupe annonce déjà une édition 2027 élargie à d'autres villes du pays, avec pour ambition de faire de ce tournoi un rendez-vous national.",
    ],
  },
  {
    slug: "entretien-marie-claire-ngbokoli",
    tag: "PORTRAIT",
    date: "5 Janvier 2026",
    title: "Entretien avec Marie-Claire Ngbokoli : « L'avenir passe par la jeunesse »",
    excerpt:
      "La fondatrice de LIAM Groupe se confie sur les défis de l'ONG, ses réussites et ses projets pour les années à venir.",
    image: img("news-portrait", 800, 600),
    author: "Équipe Communication LIAM Groupe",
    content: [
      "Onze ans après la création de LIAM Groupe, sa fondatrice Marie-Claire Ngbokoli revient sur le chemin parcouru : « Nous sommes partis d'un petit groupe de femmes déterminées à Bangui, et aujourd'hui nos programmes touchent des milliers de bénéficiaires à travers le pays. »",
      "Interrogée sur les défis, elle évoque le manque de financement structurel des ONG centrafricaines et la nécessité de diversifier les partenariats, notamment avec le secteur privé local. « Chaque partenaire qui nous rejoint, c'est un projet de plus qui voit le jour pour une femme ou un jeune de ce pays. »",
      "Pour les années à venir, elle annonce une ambition claire : étendre les programmes de LIAM Groupe à l'ensemble des préfectures de la République Centrafricaine, en s'appuyant sur les relais locaux formés depuis 2015.",
    ],
  },
];

export const team = [
  {
    name: "Marie-Claire Ngbokoli",
    role: "Fondatrice & Présidente",
    image: img("team-marie-claire", 600, 700),
    description:
      "Visionnaire et engagée, elle a fondé LIAM Groupe en 2015 pour offrir aux femmes et aux jeunes centrafricains les outils de leur propre développement.",
    social: {
      linkedin: "https://linkedin.com/in/marie-claire-ngbokoli",
      facebook: "https://facebook.com/marieclaire.ngbokoli",
      instagram: "https://instagram.com/marieclaire.ngbokoli",
      x: "https://x.com/marieclaire_ngb",
    },
  },
  {
    name: "Jean-Pierre Mbaïkoua",
    role: "Directeur Exécutif",
    image: img("team-jean-pierre", 600, 700),
    description:
      "Pilote la stratégie globale de l'organisation et la coordination des six domaines d'intervention de LIAM Groupe.",
    social: {
      linkedin: "https://linkedin.com/in/jean-pierre-mbaikoua",
      facebook: "https://facebook.com/jeanpierre.mbaikoua",
      instagram: "https://instagram.com/jeanpierre.mbaikoua",
      x: "https://x.com/jp_mbaikoua",
    },
  },
  {
    name: "Aminata Koyambou",
    role: "Responsable G-Fitness",
    image: img("team-aminata", 600, 700),
    description:
      "Ancienne athlète, elle anime les programmes sportifs de LIAM Groupe destinés aux femmes et aux jeunes filles de Bangui.",
    social: {
      linkedin: "https://linkedin.com/in/aminata-koyambou",
      facebook: "https://facebook.com/aminata.koyambou",
      instagram: "https://instagram.com/aminata_koyambou",
      x: "https://x.com/aminata_koyambou",
    },
  },
  {
    name: "Florence Dacko-Posso",
    role: "Responsable O'GAB",
    image: img("team-florence", 600, 700),
    description:
      "Chef cuisinière et entrepreneure. Elle développe les programmes de gastronomie solidaire et valorise les produits locaux centrafricains à travers des ateliers et événements culinaires.",
    social: {
      linkedin: "https://linkedin.com/in/florence-dacko-posso",
      facebook: "https://facebook.com/florence.dackoposso",
      instagram: "https://instagram.com/florence_dacko",
      x: "https://x.com/florence_dacko",
    },
  },
  {
    name: "Romain Dologuélé",
    role: "Responsable Événementiel",
    image: img("team-romain", 600, 700),
    description:
      "Organisateur d'événements avec plus de 10 ans d'expérience. Il coordonne les galas, tournois sportifs et manifestations culturelles de LIAM Groupe à travers le pays.",
    social: {
      linkedin: "https://linkedin.com/in/romain-dologuele",
      facebook: "https://facebook.com/romain.dologuele",
      instagram: "https://instagram.com/romain_dologuele",
      x: "https://x.com/romain_dologuele",
    },
  },
  {
    name: "Esther Gbezera",
    role: "Responsable Communication",
    image: img("team-esther", 600, 700),
    description:
      "Journaliste et communicatrice. Elle assure la visibilité des actions de l'ONG et développe les partenariats médias pour amplifier l'impact de nos programmes.",
    social: {
      linkedin: "https://linkedin.com/in/esther-gbezera",
      facebook: "https://facebook.com/esther.gbezera",
      instagram: "https://instagram.com/esther_gbezera",
      x: "https://x.com/esther_gbezera",
    },
  },
];

export const partners = [
  {
    name: "FAFECA",
    initial: "F",
    logo: "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/v1/liam-groupe/fafeca.png",
    color: "#8A0015",
    category: "PARTENAIRE INSTITUTIONNEL",
    subtitle: "Fédération des Associations Féminines de Centrafrique",
    description:
      "FAFECA représente plus de 120 associations féminines à travers la République Centrafricaine. Partenaire historique de LIAM Groupe depuis 2018, elle nous accompagne dans le déploiement de nos programmes de leadership féminin et de formation des jeunes femmes.",
    collaboration: "Programmes conjoints de formation au leadership féminin, mentorat entrepreneurial.",
    website: null,
  },
  {
    name: "ASK Gras Savoye",
    initial: "A",
    logo: "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/v1/liam-groupe/ask-gras-savoye.png",
    color: "#16335B",
    category: "PARTENAIRE CORPORATE",
    subtitle: "ASK Gras Savoye - Bangui",
    description:
      "Leader de l'assurance et de la protection sociale en République Centrafricaine. ASK Gras Savoye nous soutient financièrement et met à disposition ses salles de conférence pour nos événements.",
    collaboration: "Soutien financier, mise à disposition d'espaces événementiels, mentorat entrepreneurial.",
    website: null,
  },
  {
    name: "Salle King",
    initial: "S",
    color: "#C99A2E",
    category: "PARTENAIRE ÉVÉNEMENTIEL",
    subtitle: "Salle King - Complexe Événementiel",
    description:
      "Principal complexe événementiel de Bangui. Salle King accueille nos plus grands événements : galas de charité, concours de beauté, tournois sportifs et conférences internationales.",
    collaboration: "Mise à disposition des salles, équipements audiovisuels, logistique événementielle.",
    website: null,
  },
  {
    name: "Diaspora Multimedia",
    initial: "D",
    color: "#1E5631",
    category: "PARTENAIRE MÉDIA",
    subtitle: "Diaspora Multimedia RCA",
    description:
      "Agence de communication et production audiovisuelle spécialisée dans la promotion de la culture centrafricaine. Diaspora Multimedia assure la couverture médiatique de tous nos événements et la production de nos contenus digitaux.",
    collaboration: "Couverture événementielle, production vidéo, community management, relations presse.",
    website: "#",
  },
  {
    name: "MINUSCA",
    initial: "M",
    logo: "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/v1/liam-groupe/minusca.png",
    color: "#2255A4",
    category: "PARTENAIRE INTERNATIONAL",
    subtitle: "Mission Multidimensionnelle Intégrée des Nations Unies pour la Stabilisation en Centrafrique",
    description:
      "La MINUSCA soutient nos programmes de consolidation de la paix par le sport et la culture. Grâce à leur appui, nous avons pu organiser des événements inter-communautaires dans plusieurs préfectures de la RCA.",
    collaboration: "Financement de projets, sécurité événementielle, appui logistique sur le terrain.",
    website: "#",
  },
  {
    name: "ONG Espoir",
    initial: "E",
    color: "#C9531E",
    category: "PARTENAIRE ASSOCIATIF",
    subtitle: "ONG Espoir pour la Jeunesse",
    description:
      "Organisation non gouvernementale centrafricaine dédiée à l'éducation et à l'insertion professionnelle des jeunes. Ensemble, nous avons formé plus de 500 jeunes aux métiers de la cuisine, de la communication et du sport.",
    collaboration: "Programmes de formation conjoints, bourses d'études, stages professionnels.",
    website: "#",
  },
  {
    name: "Orange Centrafrique",
    initial: "O",
    color: "#FF7900",
    category: "PARTENAIRE CORPORATE",
    subtitle: "Orange Centrafrique — Bangui",
    description:
      "Premier opérateur de télécommunications en République Centrafricaine. Orange Centrafrique soutient nos événements sportifs et culturels en fournissant connectivité, équipements et visibilité sur ses canaux digitaux auprès de millions d'abonnés.",
    collaboration: "Connectivité événementielle, soutien logistique, relais médias digitaux.",
    website: "#",
  },
  {
    name: "UNICEF RCA",
    initial: "U",
    color: "#1CABE2",
    category: "PARTENAIRE INTERNATIONAL",
    subtitle: "Fonds des Nations Unies pour l'Enfance — RCA",
    description:
      "L'UNICEF République Centrafricaine appuie nos programmes de formation des jeunes et de sport au féminin. Grâce à ce partenariat, plus de 200 jeunes filles ont bénéficié d'ateliers de leadership et de sensibilisation aux droits de l'enfant.",
    collaboration: "Co-financement de programmes jeunesse, formation aux droits de l'enfant, plaidoyer.",
    website: "#",
  },
  {
    name: "Radio Centrafrique",
    initial: "R",
    color: "#2E7D32",
    category: "PARTENAIRE MÉDIA",
    subtitle: "Radio Centrafrique — La voix de la Nation",
    description:
      "Première radio nationale de la RCA, Radio Centrafrique est notre partenaire média historique. Elle couvre l'ensemble de nos événements et diffuse nos messages d'intérêt général auprès de millions d'auditeurs à travers le pays.",
    collaboration: "Couverture médiatique, spots radio, interviews, diffusion de nos communiqués.",
    website: "#",
  },
  {
    name: "Hôtel Ledger Plaza",
    initial: "H",
    color: "#8B4513",
    category: "PARTENAIRE ÉVÉNEMENTIEL",
    subtitle: "Ledger Plaza Bangui — Hôtel 5 étoiles",
    description:
      "Principal hôtel de standing de Bangui, le Ledger Plaza accueille nos galas de charité, conférences de presse et réceptions officielles. Leur équipe événementielle nous accompagne dans l'organisation de nos plus grands rendez-vous.",
    collaboration: "Mise à disposition de salles, hébergement de nos invités, offre préférentielle pour nos événements.",
    website: "#",
  },
];

export const testimonials = [
  {
    quote:
      "La formation en bureautique et communication digitale m'a permis de décrocher un stage dans une entreprise de la place. Aujourd'hui je suis autonome et je peux aider ma famille. Merci LIAM Groupe !",
    name: "Christelle Ngoumbango",
    role: "Bénéficiaire, programme Formation des Jeunes",
    image: img("testimonial-christelle", 100, 100),
  },
  {
    quote:
      "O'GAB met en valeur le patrimoine culinaire centrafricain comme personne d'autre. Les ateliers gastronomiques créent des emplois pour les femmes tout en préservant nos traditions — une initiative remarquable.",
    name: "Michel Béranger",
    role: "Chef cuisinier, partenaire O'GAB",
    image: img("testimonial-michel", 100, 100),
  },
  {
    quote:
      "Notre partenariat avec LIAM Groupe démontre comment la société civile peut être un relais efficace pour les initiatives de paix et de développement. Leur connaissance du terrain est exceptionnelle.",
    name: "Fatimé Hassan",
    role: "Représentante, MINUSCA",
    image: img("testimonial-fatime", 100, 100),
  },
];

export const footerLinks = {
  liamGroupe: [
    { label: "Notre mission", to: "/a-propos" },
    { label: "Notre équipe", to: "/a-propos" },
    { label: "Nous soutenir", to: "/a-propos" },
  ],
  domaines: domains.map((d) => ({ label: d.name, to: `/domaines/${d.slug}` })),
  agir: [
    { label: "Événements à venir", to: "/evenements" },
    { label: "Actualités", to: "/actualites" },
  ],
};
