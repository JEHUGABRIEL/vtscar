// English translations of site data — used as fallback when Supabase is unavailable
// Images hosted on Cloudinary — optimized with f_auto,q_auto

const CLOUD_NAME = 'dwmrzp61c'
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`

export const img = (seed, w = 800, h = 600, fit = 'fill', quality = 'auto') =>
  `${BASE_URL}/f_auto,q_${quality},w_${w},h_${h},c_${fit},dpr_auto/v1/liam-groupe/${seed}`

export const imgBlur = (seed) =>
  `${BASE_URL}/f_auto,q_10,w_200,h_112,c_fill,e_blur:500,dpr_auto/v1/liam-groupe/${seed}`

export const imgHero = (seed) => img(seed, 1600, 900, 'fill', 'eco')

export const imgSrcSet = (seed, widths = [480, 768, 1024, 1280, 1600], h = 600, fit = 'fill') =>
  widths
    .map(w => `${BASE_URL}/f_auto,q_auto,w_${w},h_${h},c_${fit},dpr_auto/v1/liam-groupe/${seed} ${w}w`)
    .join(', ')

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
  tagline: "Revealing talents, creating sustainable opportunities",
  description:
    "A multidisciplinary organization developing cultural, sports, entrepreneurial, and culinary projects with strong social impact in the Central African Republic.",
  address: ["Avenue des Martyrs, Immeuble Salle King", "Bangui, Central African Republic"],
  phones: ["+236 76 00 00 00"],
  emails: ["contact@liamgroupe.org", "partenariat@liamgroupe.org"],
  hours: ["Monday — Friday: 8:00 AM — 5:00 PM", "Saturday: 9:00 AM — 1:00 PM"],
  foundingYear: 2015,
  social: {
    whatsapp: "23676000000",
    facebook: "https://www.facebook.com/people/LIAM-Groupe/61585885973346/",
    instagram: "https://instagram.com/liamgroupe",
    x: "https://x.com/liamgroupe",
    youtube: "https://youtube.com/@liamgroupe",
  },
  contactPage: {
    address: ["Sector 3, Rue des Martyrs", "Bangui, Central African Republic"],
    phones: ["+236 76 00 00 00"],
    emails: ["contact@liamgroupe.cf", "partenariats@liamgroupe.cf"],
    hours: ["Monday — Friday: 8:00 AM — 5:00 PM", "Saturday: 9:00 AM — 12:00 PM"],
  },
};

export const navLinks = [
  { label: "Home", to: "/" },
  { label: "About", to: "/a-propos" },
  { label: "Domains", to: "/domaines", dropdown: true },
  { label: "Events", to: "/evenements" },
  { label: "News", to: "/actualites" },
];

export const domains = [
  {
    slug: "g-fitness",
    name: "G-Fitness",
    category: "SPORTS & WELLNESS",
    icon: "heart",
    shortDescription:
      "Promoting health and well-being through sports, with programs tailored for women and youth in Bangui. Basketball tournaments…",
    heroImage: img("gfitness-hero", 1920, 700),
    cardImage: img("gfitness-hero", 800, 500),
    programs: [
      {
        title: "Women's Basketball Tournament",
        description:
          "Inter-district competition bringing together 16 women's teams in Bangui.",
      },
      {
        title: "G-Fitness Junior",
        description:
          "Sports initiation program for children and teens from underserved neighborhoods.",
      },
      {
        title: "Health through Sports",
        description:
          "Workshops raising awareness about healthy lifestyles and balanced nutrition.",
      },
    ],
    gallery: [img("gfitness-gallery-1", 700, 500), img("gfitness-gallery-2", 700, 500)],
  },
  {
    slug: "ogab",
    name: "O'GAB",
    category: "COMMUNITY GASTRONOMY",
    icon: "utensils",
    shortDescription:
      "Showcasing Central African culinary heritage while creating economic opportunities for women. Event catering, work…",
    heroImage: img("ogab-hero", 1920, 700),
    cardImage: img("ogab-hero", 800, 500),
    programs: [
      {
        title: "Cooking Workshops",
        description:
          "Training in traditional and modern cuisine for women entrepreneurs.",
      },
      {
        title: "Event Catering",
        description:
          "Catering service for events, showcasing local products.",
      },
      {
        title: "Community Restaurant",
        description:
          "An establishment offering affordable cuisine while employing trained women.",
      },
    ],
    gallery: [img("ogab-gallery-1", 700, 500), img("ogab-gallery-2", 700, 500)],
  },
  {
    slug: "entrepreneuriat",
    name: "Entrepreneurship & Leadership",
    category: "WOMEN'S LEADERSHIP",
    icon: "briefcase",
    shortDescription:
      "Empowering Central African women through leadership training, entrepreneurial support, and networking…",
    heroImage: img("entreprenariat-hero", 1920, 700),
    cardImage: img("entreprenariat-hero", 800, 500),
    programs: [
      {
        title: "« Dare to Undertake » Conferences",
        description:
          "Inspiring events led by women leaders from the private and public sectors.",
      },
      {
        title: "Incubation Program",
        description:
          "6-month support program for women-led entrepreneurial projects.",
      },
      {
        title: "Mentorship",
        description:
          "Connecting aspiring entrepreneurs with experienced mentors.",
      },
    ],
    gallery: [img("entreprenariat-gallery-1", 700, 500), img("entreprenariat-gallery-2", 700, 500)],
  },
  {
    slug: "formation",
    name: "Youth Training",
    category: "EDUCATION & EMPLOYMENT",
    icon: "graduation",
    shortDescription:
      "Providing Central African youth with practical, job-oriented training to foster their integration into the job market. Workshops,…",
    heroImage: img("formation-hero", 1920, 700),
    cardImage: img("formation-hero", 800, 500),
    programs: [
      {
        title: "Vocational Training",
        description:
          "Hands-on workshops in digital technology, culinary arts, and communications.",
      },
      {
        title: "Internships",
        description:
          "Connecting youth with employer partners for paid internships.",
      },
      {
        title: "Mentorship Program",
        description:
          "One-on-one guidance for youth by experienced professionals.",
      },
    ],
    gallery: [img("formation-gallery-1", 700, 500), img("formation-gallery-2", 700, 500)],
  },
  {
    slug: "communication",
    name: "Communication",
    category: "VISIBILITY & MEDIA",
    icon: "megaphone",
    shortDescription:
      "Ensuring visibility for LIAM Groupe and its partners through a modern communication strategy: press relations,…",
    heroImage: img("communication-hero", 1920, 700),
    cardImage: img("communication-hero", 800, 500),
    programs: [
      {
        title: "Press Relations",
        description:
          "Media coverage of events and distribution of press releases to local and international media.",
      },
      {
        title: "Audiovisual Production",
        description:
          "Creating documentaries, reports, and digital content showcasing our initiatives.",
      },
      {
        title: "Community Management",
        description:
          "Social media management and online community engagement.",
      },
    ],
    gallery: [img("communication-gallery-1", 700, 500), img("communication-gallery-2", 700, 500)],
  },
  {
    slug: "evenementiel",
    name: "Events",
    category: "CULTURE & GALAS",
    icon: "calendar",
    shortDescription:
      "Organizing large-scale events that bring people together and celebrate Central African culture. Miss Centrafrique, charity gal…",
    heroImage: img("evenementiel-hero", 1920, 700),
    cardImage: img("evenementiel-hero", 800, 500),
    programs: [
      {
        title: "Miss Central African Republic",
        description: "National beauty and culture pageant celebrating the diversity of the CAR.",
      },
      {
        title: "Charity Gala",
        description:
          "Prestigious evening gathering partners and donors to fund our programs.",
      },
      {
        title: "Cultural Festivals",
        description:
          "Artistic events showcasing music, dance, and local arts.",
      },
    ],
    gallery: [img("evenementiel-gallery-1", 700, 500), img("evenementiel-gallery-2", 700, 500)],
  },
];

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
    title: "Women's Basketball Tournament — 2026 Edition",
    date: "August 15, 2026",
    location: "Bangui Omnisports Gymnasium",
    category: "G-Fitness",
    status: "a_venir",
    image: img("event-basketball", 800, 600),
    description:
      "The 3rd edition of the inter-district women's basketball tournament brings together 16 teams for a high-level competition…",
  },
  {
    slug: "conference-leadership-feminin",
    title: "Women's Leadership Conference — « Dare to Undertake »",
    date: "June 28, 2026",
    location: "ASK Gras Savoye Conference Room, Bangui",
    category: "Entrepreneurship",
    status: "a_venir",
    image: img("event-conference", 800, 600),
    description:
      "A day of sharing and inspiration with women leaders from the Central African private and public sectors. Practical workshops,…",
  },
  {
    slug: "atelier-formation-creation-entreprise",
    title: "Training Workshop — Business Creation",
    date: "July 10, 2026",
    location: "LIAM Groupe Headquarters, Bangui",
    category: "Training",
    status: "a_venir",
    image: img("event-formation", 800, 600),
    description:
      "Intensive 3-day training for young entrepreneurs. Business model, financing, digital marketing and management…",
  },
  {
    slug: "soiree-gala-liam-2025",
    title: "Gala Evening — LIAM Groupe 2025",
    date: "December 20, 2025",
    location: "Ledger Plaza Hotel, Bangui",
    category: "Events",
    status: "passe",
    image: img("event-gala", 800, 600),
    description:
      "A prestigious evening bringing together partners, sponsors, and dignitaries to celebrate the year's achievements…",
  },
  {
    slug: "atelier-gastronomie-saveurs-centrafrique",
    title: "Gastronomy Workshop — Flavors of Central Africa",
    date: "November 10, 2025",
    location: "O'GAB Space, Bangui",
    category: "O'GAB",
    status: "passe",
    image: img("event-gastronomie", 800, 600),
    description:
      "Cooking workshop highlighting local products and the know-how of Central African women. Tasting and…",
  },
  {
    slug: "miss-centrafrique-2025",
    title: "Miss Central African Republic 2025",
    date: "October 15, 2025",
    location: "Salle King, Bangui",
    category: "Events",
    status: "passe",
    image: img("event-miss", 800, 600),
    description:
      "Beauty and culture pageant celebrating the diversity and cultural richness of the Central African Republic. Over 5,000…",
  },
];

export const news = [
  {
    slug: "prix-innovation-sociale-2026",
    tag: "NEWS",
    date: "June 12, 2026",
    title: "LIAM Groupe wins the 2026 Social Innovation Award",
    excerpt:
      "Recognized for its impact on women's entrepreneurship in Central Africa, LIAM Groupe was honored at the…",
    image: img("news-prix", 800, 600),
    author: "LIAM Groupe Communications Team",
    content: [
      "Recognized for its impact on women's entrepreneurship in Central Africa, LIAM Groupe was honored at the National Social Innovation Forum held in Bangui. This award celebrates over a decade of concrete actions for the empowerment of Central African women and youth.",
      "The jury particularly highlighted the organization's integrated approach, combining training, entrepreneurial support, and networking across its various programs: G-Fitness, O'GAB, Entrepreneurship & Leadership, and Youth Training.",
      "« This distinction belongs first and foremost to the hundreds of women and young people who carry our programs on the ground every day, » said the President of LIAM Groupe during the award ceremony. The organization now plans to accelerate the rollout of its initiatives in other prefectures across the country.",
    ],
  },
  {
    slug: "partenariat-minusca",
    tag: "PARTNERSHIP",
    date: "May 3, 2026",
    title: "New partnership with MINUSCA for peace through sports",
    excerpt:
      "A cooperation agreement was signed to organize inter-community tournaments in the prefectures of…",
    image: img("news-minusca", 800, 600),
    author: "LIAM Groupe Communications Team",
    content: [
      "A cooperation agreement was signed between LIAM Groupe and MINUSCA to organize inter-community sports tournaments in several prefectures. The goal: to use sports as a tool for social cohesion and reconciliation between communities.",
      "The G-Fitness program, already recognized in Bangui for its women's basketball tournaments, will serve as the methodological foundation for this expanded initiative. Mixed sports events will be organized in the coming months, supervised by facilitators trained in community dialogue.",
      "This partnership continues LIAM Groupe's efforts for a peaceful Central Africa, where sports become a common language beyond divisions.",
    ],
  },
  {
    slug: "ogab-restaurant-solidaire",
    tag: "O'GAB",
    date: "April 18, 2026",
    title: "O'GAB opens its first community restaurant in Bangui",
    excerpt:
      "The O'GAB restaurant employs 15 women trained by LIAM Groupe and serves 100% local cuisine at affordable prices.",
    image: img("news-ogab", 800, 600),
    author: "LIAM Groupe Communications Team",
    content: [
      "The O'GAB restaurant has opened its doors in the heart of Bangui. It employs 15 women trained by LIAM Groupe through its community gastronomy program, and serves 100% local cuisine at prices accessible to all residents of Bangui.",
      "Beyond dining, the establishment serves as a showcase for Central African local products and a venue for ongoing training for new cohorts of women entrepreneurs.",
      "« Every dish served here tells a story of resilience and expertise, » says one of the chefs trained by the O'GAB program. The restaurant is open Monday through Saturday, from 11:00 AM to 9:00 PM.",
    ],
  },
  {
    slug: "500-jeunes-formes-numerique",
    tag: "TRAINING",
    date: "March 10, 2026",
    title: "500 youth trained in digital skills in 2025",
    excerpt:
      "Year-end review of the youth training program: 500 graduates, 120 jobs created, and 30 startups…",
    image: img("news-formation", 800, 600),
    author: "LIAM Groupe Communications Team",
    content: [
      "The 2025 results for LIAM Groupe's Youth Training program are impressive: 500 young graduates in digital skills, from web development to digital communication and project management.",
      "Of these 500 graduates, 120 have already secured employment and about thirty have launched their own startups with support from LIAM Groupe's incubation program. These results confirm the relevance of short, practical training grounded in the real needs of the Central African market.",
      "For 2026, the organization plans to double its capacity and open new fields of study, particularly in e-commerce and Mobile Money.",
    ],
  },
  {
    slug: "tournoi-basketball-10000-spectateurs",
    tag: "G-FITNESS",
    date: "February 22, 2026",
    title: "Women's Basketball Tournament reaches 10,000 spectators",
    excerpt:
      "Attendance record broken for the inter-district tournament final. An event that confirms the growing enthusiasm for…",
    image: img("news-basketball", 800, 600),
    author: "LIAM Groupe Communications Team",
    content: [
      "The Women's Basketball Tournament final, organized by LIAM Groupe's G-Fitness program, drew over 10,000 spectators to the Bangui Omnisports Gymnasium — an attendance record for this now iconic event.",
      "Sixteen teams from different neighborhoods of the capital competed over two weeks in a festive atmosphere. The final was attended by several public figures who came to support the initiative.",
      "Building on this success, LIAM Groupe has already announced an expanded 2027 edition in other cities across the country, with the ambition of making this tournament a national event.",
    ],
  },
  {
    slug: "entretien-marie-claire-ngbokoli",
    tag: "PORTRAIT",
    date: "January 5, 2026",
    title: "Interview with Marie-Claire Ngbokoli: « The future lies with youth »",
    excerpt:
      "The founder of LIAM Groupe shares insights into the NGO's challenges, successes, and plans for the years ahead.",
    image: img("news-portrait", 800, 600),
    author: "LIAM Groupe Communications Team",
    content: [
      "Eleven years after founding LIAM Groupe, founder Marie-Claire Ngbokoli reflects on the journey: « We started as a small group of determined women in Bangui, and today our programs reach thousands of beneficiaries across the country. »",
      "Asked about challenges, she mentions the lack of structural funding for Central African NGOs and the need to diversify partnerships, particularly with the local private sector. « Every partner who joins us means one more project launched for a woman or young person in this country. »",
      "For the years ahead, she announces a clear ambition: to expand LIAM Groupe's programs to all prefectures of the Central African Republic, building on local networks trained since 2015.",
    ],
  },
];

export const team = [
  {
    name: "Marie-Claire Ngbokoli",
    role: "Founder & President",
    image: img("team-marie-claire", 600, 700),
    description:
      "A visionary and committed leader, she founded LIAM Groupe in 2015 to provide Central African women and youth with the tools for their own development.",
    social: {
      linkedin: "https://linkedin.com/in/marie-claire-ngbokoli",
      facebook: "https://facebook.com/marieclaire.ngbokoli",
      instagram: "https://instagram.com/marieclaire.ngbokoli",
      x: "https://x.com/marieclaire_ngb",
    },
  },
  {
    name: "Jean-Pierre Mbaïkoua",
    role: "Executive Director",
    image: img("team-jean-pierre", 600, 700),
    description:
      "Drives the overall strategy of the organization and coordinates LIAM Groupe's six areas of intervention.",
    social: {
      linkedin: "https://linkedin.com/in/jean-pierre-mbaikoua",
      facebook: "https://facebook.com/jeanpierre.mbaikoua",
      instagram: "https://instagram.com/jeanpierre.mbaikoua",
      x: "https://x.com/jp_mbaikoua",
    },
  },
  {
    name: "Aminata Koyambou",
    role: "G-Fitness Program Manager",
    image: img("team-aminata", 600, 700),
    description:
      "A former athlete, she leads LIAM Groupe's sports programs for women and girls in Bangui.",
    social: {
      linkedin: "https://linkedin.com/in/aminata-koyambou",
      facebook: "https://facebook.com/aminata.koyambou",
      instagram: "https://instagram.com/aminata_koyambou",
      x: "https://x.com/aminata_koyambou",
    },
  },
  {
    name: "Florence Dacko-Posso",
    role: "O'GAB Program Manager",
    image: img("team-florence", 600, 700),
    description:
      "Chef and entrepreneur. She develops community gastronomy programs and promotes local Central African products through workshops and culinary events.",
    social: {
      linkedin: "https://linkedin.com/in/florence-dacko-posso",
      facebook: "https://facebook.com/florence.dackoposso",
      instagram: "https://instagram.com/florence_dacko",
      x: "https://x.com/florence_dacko",
    },
  },
  {
    name: "Romain Dologuélé",
    role: "Events Manager",
    image: img("team-romain", 600, 700),
    description:
      "Event organizer with over 10 years of experience. He coordinates LIAM Groupe's galas, sports tournaments, and cultural events across the country.",
    social: {
      linkedin: "https://linkedin.com/in/romain-dologuele",
      facebook: "https://facebook.com/romain.dologuele",
      instagram: "https://instagram.com/romain_dologuele",
      x: "https://x.com/romain_dologuele",
    },
  },
  {
    name: "Esther Gbezera",
    role: "Communications Manager",
    image: img("team-esther", 600, 700),
    description:
      "Journalist and communications specialist. She ensures the visibility of the NGO's actions and develops media partnerships to amplify the impact of our programs.",
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
    category: "INSTITUTIONAL PARTNER",
    subtitle: "Federation of Women's Associations of Central Africa",
    description:
      "FAFECA represents over 120 women's associations across the Central African Republic. A historic partner of LIAM Groupe since 2018, it supports us in deploying our women's leadership and young women's training programs.",
    collaboration: "Joint programs in women's leadership training, entrepreneurial mentorship.",
    website: null,
  },
  {
    name: "ASK Gras Savoye",
    initial: "A",
    logo: "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/v1/liam-groupe/ask-gras-savoye.png",
    color: "#16335B",
    category: "CORPORATE PARTNER",
    subtitle: "ASK Gras Savoye - Bangui",
    description:
      "Leader in insurance and social protection in the Central African Republic. ASK Gras Savoye provides financial support and makes its conference rooms available for our events.",
    collaboration: "Financial support, event space provision, entrepreneurial mentorship.",
    website: null,
  },
  {
    name: "Salle King",
    initial: "S",
    color: "#C99A2E",
    category: "EVENT PARTNER",
    subtitle: "Salle King — Event Complex",
    description:
      "Bangui's premier event complex. Salle King hosts our largest events: charity galas, beauty pageants, sports tournaments, and international conferences.",
    collaboration: "Venue provision, audiovisual equipment, event logistics.",
    website: null,
  },
  {
    name: "Diaspora Multimedia",
    initial: "D",
    color: "#1E5631",
    category: "MEDIA PARTNER",
    subtitle: "Diaspora Multimedia CAR",
    description:
      "Communications and audiovisual production agency specialized in promoting Central African culture. Diaspora Multimedia handles media coverage for all our events and produces our digital content.",
    collaboration: "Event coverage, video production, community management, press relations.",
    website: "#",
  },
  {
    name: "MINUSCA",
    initial: "M",
    logo: "https://res.cloudinary.com/dwmrzp61c/image/upload/f_auto,q_auto/v1/liam-groupe/minusca.png",
    color: "#2255A4",
    category: "INTERNATIONAL PARTNER",
    subtitle: "United Nations Multidimensional Integrated Stabilization Mission in the Central African Republic",
    description:
      "MINUSCA supports our peace-building programs through sports and culture. With their support, we have been able to organize inter-community events in several prefectures of the CAR.",
    collaboration: "Project funding, event security, field logistics support.",
    website: "#",
  },
  {
    name: "ONG Espoir",
    initial: "E",
    color: "#C9531E",
    category: "ASSOCIATION PARTNER",
    subtitle: "ONG Espoir for Youth",
    description:
      "A Central African NGO dedicated to education and professional integration of youth. Together, we have trained over 500 young people in culinary arts, communications, and sports.",
    collaboration: "Joint training programs, scholarships, professional internships.",
    website: "#",
  },
  {
    name: "Orange Centrafrique",
    initial: "O",
    color: "#FF7900",
    category: "CORPORATE PARTNER",
    subtitle: "Orange Centrafrique — Bangui",
    description:
      "Leading telecommunications operator in the Central African Republic. Orange Centrafrique supports our sports and cultural events by providing connectivity, equipment, and visibility on its digital channels reaching millions of subscribers.",
    collaboration: "Event connectivity, logistical support, digital media coverage.",
    website: "#",
  },
  {
    name: "UNICEF CAR",
    initial: "U",
    color: "#1CABE2",
    category: "INTERNATIONAL PARTNER",
    subtitle: "United Nations Children's Fund — CAR",
    description:
      "UNICEF Central African Republic supports our youth training and women's sports programs. Through this partnership, over 200 girls have benefited from leadership workshops and child rights awareness sessions.",
    collaboration: "Co-funding of youth programs, child rights training, advocacy.",
    website: "#",
  },
  {
    name: "Radio Centrafrique",
    initial: "R",
    color: "#2E7D32",
    category: "MEDIA PARTNER",
    subtitle: "Radio Centrafrique — The Voice of the Nation",
    description:
      "The leading national radio station in the CAR, Radio Centrafrique is our historic media partner. It covers all our events and broadcasts our public interest messages to millions of listeners across the country.",
    collaboration: "Media coverage, radio spots, interviews, distribution of press releases.",
    website: "#",
  },
  {
    name: "Hôtel Ledger Plaza",
    initial: "H",
    color: "#8B4513",
    category: "EVENT PARTNER",
    subtitle: "Ledger Plaza Bangui — 5-Star Hotel",
    description:
      "Bangui's premier luxury hotel, the Ledger Plaza hosts our charity galas, press conferences, and official receptions. Their events team supports us in organizing our biggest gatherings.",
    collaboration: "Venue provision, guest accommodation, preferential rates for our events.",
    website: "#",
  },
];

export const testimonials = [
  {
    quote:
      "The training in office skills and digital communication helped me land an internship at a local company. Today I am independent and can support my family. Thank you LIAM Groupe!",
    name: "Christelle Ngoumbango",
    role: "Beneficiary, Youth Training Program",
    image: img("testimonial-christelle", 100, 100),
  },
  {
    quote:
      "O'GAB showcases Central African culinary heritage like no one else. The gastronomy workshops create jobs for women while preserving our traditions — a remarkable initiative.",
    name: "Michel Béranger",
    role: "Chef, O'GAB Partner",
    image: img("testimonial-michel", 100, 100),
  },
  {
    quote:
      "Our partnership with LIAM Groupe demonstrates how civil society can be an effective channel for peace and development initiatives. Their on-the-ground knowledge is exceptional.",
    name: "Fatimé Hassan",
    role: "Representative, MINUSCA",
    image: img("testimonial-fatime", 100, 100),
  },
];

export const footerLinks = {
  liamGroupe: [
    { label: "Our Mission", to: "/a-propos" },
    { label: "Our Team", to: "/a-propos" },
    { label: "Support Us", to: "/a-propos" },
  ],
  domaines: domains.map((d) => ({ label: d.name, to: `/domaines/${d.slug}` })),
  agir: [
    { label: "Upcoming Events", to: "/evenements" },
    { label: "News", to: "/actualites" },
  ],
};
