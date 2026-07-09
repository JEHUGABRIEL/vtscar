import { useState, useMemo, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImageOff, ImageIcon, Calendar, Check, Dumbbell, ArrowRight, UserPlus, Send, Loader2, Smartphone, CreditCard, X } from "lucide-react";
import { FacebookIcon, InstagramIcon, XIcon } from "../../components/SocialIcons";
import { useTranslation } from "react-i18next";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import EventCard from "../../components/EventCard";
import SafeImg from "../../components/SafeImg";
import GalleryLightbox from "../../components/GalleryLightbox";
import HeroSlider from "../../components/HeroSlider";
import { supabase } from "../../lib/supabase.js";
import useScrollReveal from "../../hooks/useScrollReveal";
import useFormValidation from "../../hooks/useFormValidation";

const CONTACT_STORAGE_KEY = "gfit-registration-data";

const getSavedRegistrationData = () => {
  try {
    const d = JSON.parse(localStorage.getItem(CONTACT_STORAGE_KEY) || "{}");
    return { name: d.name || "", email: d.email || "", phone: d.phone || "", plan: d.plan || "" };
  } catch {
    return { name: "", email: "", phone: "", plan: "" };
  }
};

/**
 * FitnessDomain — page sur-mesure pour G-Fitness.
 * Identité distincte du reste du site : fond encre foncé, typographie
 * condensée en majuscules façon panneau de salle de sport, tableau de
 * planning hebdomadaire plutôt que le template générique.
 */
export default function FitnessDomain({ domain, events }) {
  const { t } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [programIdx, setProgramIdx] = useState(0);
  const [programPaused, setProgramPaused] = useState(false);
  const [regForm, setRegForm] = useState(getSavedRegistrationData());
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { errors, touched, hasErrors, validateField, handleBlur, validateAll, resetValidation, setFieldError } = useFormValidation();
  const programsRef = useScrollReveal();
  const pricingRef = useScrollReveal();
  const galleryRef = useScrollReveal();
  const weekRef = useScrollReveal();

  // Sauvegarde un champ dans le state + localStorage (nom/email/téléphone)
  const updateAndSave = (field, value) => {
    setRegForm(p => {
      const next = { ...p, [field]: value };
      localStorage.setItem(CONTACT_STORAGE_KEY, JSON.stringify({ name: next.name, email: next.email, phone: next.phone, plan: next.plan }));
      return next;
    });
    // Validation en temps réel
    setFieldError(field, value);
  };

  // Fermeture avec délai pour laisser l'exit animation se jouer
  const closeForm = () => {
    setShowForm(false);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormLoading(false);
      resetValidation();
      setRegForm(getSavedRegistrationData());
    }, 450);
  };

  // Bloquer le scroll du body quand l'overlay est ouvert
  useEffect(() => {
    if (showForm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [showForm]);

  // Auto-dismiss toast après 4s
  useEffect(() => {
    if (!toast) return;
    const tm = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(tm);
  }, [toast]);

  // Auto-play carousel programmes (6s)
  useEffect(() => {
    if (domain.programs.length <= 1 || programPaused) return;
    const id = setInterval(() => {
      setProgramIdx((prev) => (prev + 1) % domain.programs.length);
    }, 6000);
    return () => clearInterval(id);
  }, [domain.programs.length, programPaused]);

  const currentProgram = domain.programs?.[programIdx];

  const domainEvents = events.filter((e) => e.category?.toLowerCase() === domain.name?.toLowerCase());

  const SLIDE_TEXTS = [
    {
      eyebrow: (
        <span className="inline-flex items-center gap-2 text-brand-500 font-body text-xs font-bold tracking-[0.35em] uppercase">
          <Dumbbell className="w-4 h-4" /> Salle de Fitness — Bangui
        </span>
      ),
      title: "G-FITNESS",
      description: "Une salle de fitness moderne au cœur de Bangui. Cours collectifs, coaching personnalisé et musculation, ouverte à tous.",
    },
    {
      eyebrow: "COURS COLLECTIFS",
      title: "Zumba, Step & Yoga",
      description: "Des séances dynamiques pour tous les niveaux, plusieurs fois par semaine. Viens bouger avec nous !",
    },
    {
      eyebrow: "COACHING",
      title: "Coachs certifiés",
      description: "Un suivi personnalisé pour atteindre tes objectifs, avec nos coachs professionnels et passionnés.",
    },
    {
      eyebrow: "MUSCULATION",
      title: "Plateau complet",
      description: "Matériel moderne, haltères, machines guidées. Accès libre 6 jours sur 7 dans une ambiance motivante.",
    },
  ];

  const gymSlides = useMemo(() => {
    const imgs = domain.gallery.length > 0 ? domain.gallery : [domain.heroImage];
    return imgs.map((img, i) => ({
      image: img,
      width: 1920,
      height: 700,
      ...SLIDE_TEXTS[i % SLIDE_TEXTS.length],
    }));
  }, [domain]);

  return (
    <div className="font-body bg-white">
      <Navbar />

      <HeroSlider
        slides={gymSlides}
        heightClass="h-screen"
        defaultBg={{ type: "gradient", value: "from-ink/80 via-ink/60 to-ink/20" }}
      />

      {/* PROGRAMMES — Carousel (comme Domaines phares home) */}
      <section className="py-24 px-6 bg-white" ref={programsRef}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 text-center reveal">
            <span className="text-brand-500 text-xs font-bold tracking-[0.3em] uppercase">Nos activités</span>
            <h2 className="font-body font-bold uppercase text-4xl text-ink mt-3 tracking-tight">Ce que tu peux faire ici</h2>
          </div>

          <div
            className="relative h-[440px] md:h-[500px] rounded-2xl overflow-hidden shadow-xl reveal group"
            onMouseEnter={() => setProgramPaused(true)}
            onMouseLeave={() => setProgramPaused(false)}
          >
            <AnimatePresence mode="wait">
              {currentProgram && (
                <motion.div
                  key={programIdx}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  {/* Image de fond */}
                  <img
                    src={(domain.gallery?.length > 0 ? domain.gallery : [domain.heroImage])[programIdx % (domain.gallery?.length || 1)]}
                    alt={currentProgram.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />

                  {/* Overlay dégradé */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/50 to-ink/10" />

                  {/* Texte */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 z-10">
                    <p className="text-brand-400 text-xs font-bold tracking-[0.25em] uppercase">
                      Activité {String(programIdx + 1).padStart(2, "0")}
                    </p>
                    <h3 className="text-white font-heading font-bold text-3xl md:text-4xl lg:text-5xl mt-2 leading-tight uppercase">
                      {currentProgram.title}
                    </h3>
                    <p className="text-white/70 mt-4 max-w-xl leading-relaxed line-clamp-2">
                      {currentProgram.description}
                    </p>
                    <div className="inline-flex items-center gap-2 mt-6 px-7 py-3.5 bg-white text-ink font-semibold rounded-full pointer-events-none opacity-90">
                      Découvrir
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </section>

      {/* COACHS — Cartes améliorées avec réseaux sociaux */}
      {domain.trainers && (
        <section className="py-24 px-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="mb-14">
              <span className="text-brand-500 text-xs font-bold tracking-[0.3em] uppercase">L&apos;équipe</span>
              <h2 className="font-body font-bold uppercase text-4xl text-ink mt-3 tracking-tight">Tes coachs</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {domain.trainers.map((c, i) => {
                const socialLinks = c.social || {};
                const socialItems = [
                  { key: "facebook", Icon: FacebookIcon, href: socialLinks.facebook },
                  { key: "instagram", Icon: InstagramIcon, href: socialLinks.instagram },
                  { key: "x", Icon: XIcon, href: socialLinks.x },
                ].filter((s) => s.href);

                return (
                  <div
                    key={c.name}
                    className="group relative bg-white rounded-2xl border border-gray-100 shadow-card overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
                  >
                    {/* Conteneur image */}
                    <div className="relative h-80 overflow-hidden">
                      <SafeImg
                        src={c.image}
                        alt={c.name}
                        className="w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 grayscale group-hover:grayscale-0"
                        icon={ImageOff}
                      />
                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                      {/* Numéro indexé */}
                      <span className="absolute top-4 right-4 font-body font-bold text-5xl text-white/10 group-hover:text-white/20 transition-colors duration-300">
                        {String(i + 1).padStart(2, "0")}
                      </span>

                      {/* Réseaux sociaux — apparaissent au hover */}
                      {socialItems.length > 0 && (
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100                      translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                          {socialItems.map(({ key, Icon, href }) => (
                            <a
                              key={key}
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={key}
                              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-brand-500 hover:border-brand-500 transition-all duration-200 shadow-lg"
                            >
                              <Icon className="w-4 h-4" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Info coach */}
                    <div className="p-5">
                      <h3 className="font-heading font-bold text-lg text-ink group-hover:text-brand-600 transition-colors">{c.name}</h3>
                      <p className="text-brand-500 text-sm font-semibold mt-1">{c.specialty}</p>

                      {/* Réseaux sociaux (version desktop toujours visibles) */}
                      {socialItems.length > 0 && (
                        <div className="flex items-center gap-2.5 pt-4 mt-4 border-t border-gray-100">
                          {socialItems.map(({ key, Icon, href }) => (
                            <a
                              key={key}
                              href={href}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={key}
                              className="w-9 h-9 rounded-lg border border-gray-200 bg-white flex items-center justify-center text-gray-400 hover:text-brand-500 hover:border-brand-200 hover:bg-brand-50/50 transition-all duration-200"
                            >
                              <Icon className="w-4 h-4" />
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* TARIFS + FORMULAIRE D'INSCRIPTION */}
      {domain.pricing && (
        <section className="py-24 px-6 bg-gray-50" ref={pricingRef}>
          <div className="max-w-6xl mx-auto">
            <div className="mb-14 text-center reveal">
              <span className="text-brand-500 text-xs font-bold tracking-[0.3em] uppercase">Tarifs</span>
              <h2 className="font-body font-bold uppercase text-4xl text-ink mt-3 tracking-tight">Rejoins la salle</h2>
              <p className="text-gray-500 text-sm mt-3 max-w-lg mx-auto">
                Choisis le plan qui te correspond et inscris-toi dès aujourd&apos;hui
              </p>
            </div>

            {/* Grille des tarifs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 stagger-children max-w-5xl mx-auto">
              {domain.pricing.map((plan) => {
                const isFeatured = plan.featured;
                return (
                  <div
                    key={plan.plan}
                    className={`reveal relative flex flex-col rounded-2xl transition-all duration-300 ${
                      isFeatured
                        ? "bg-gradient-to-b from-brand-500 to-brand-600 text-white scale-105 shadow-xl ring-4 ring-brand-300/50"
                        : "bg-white text-ink border border-gray-200 hover:shadow-lg hover:-translate-y-1"
                    }`}
                  >
                    {/* Badge */}
                    {isFeatured && (
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                        <span className="inline-flex items-center gap-1.5 bg-white text-brand-600 text-xs font-bold uppercase tracking-wide px-4 py-1.5 rounded-full shadow-lg">
                          <Smartphone className="w-3.5 h-3.5" />
                          Le plus populaire
                        </span>
                      </div>
                    )}

                    {/* En-tête */}
                    <div className="p-8 pb-4">
                      <h3 className={`font-heading font-bold text-lg ${isFeatured ? "text-white" : "text-ink"}`}>{plan.plan}</h3>
                      <div className="mt-4 flex items-baseline gap-1">
                        <span className={`font-body font-bold text-5xl tracking-tight ${isFeatured ? "text-white" : "text-brand-500"}`}>
                          {plan.price}
                        </span>
                        {!isFeatured && <span className="text-gray-400 text-sm">/mois</span>}
                      </div>
                    </div>

                    {/* Features */}
                    <div className="px-8 pb-6 flex-1">
                      <ul className="space-y-3.5">
                        {plan.features.map((f, i) => (
                          <li key={i} className={`flex items-start gap-3 text-sm ${isFeatured ? "text-white/85" : "text-gray-600"}`}>
                            <span className={`mt-0.5 rounded-full p-0.5 ${isFeatured ? "bg-white/20 text-white" : "bg-brand-50 text-brand-500"}`}>
                              <Check className="w-3.5 h-3.5" />
                            </span>
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bouton S'inscrire */}
                    <div className="px-8 pb-8">
                      <button
                        type="button"
                        onClick={() => {
                          updateAndSave("plan", plan.plan);
                          setShowForm(true);
                          setTimeout(() => {
                            document.getElementById("gfit-reg-name")?.focus();
                          }, 100);
                        }}
                        className={`w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${
                          isFeatured
                            ? "bg-white text-brand-600 hover:bg-white/90 shadow-lg"
                            : "bg-brand-500 text-white hover:bg-brand-600 shadow-md hover:shadow-lg"
                        }`}
                      >
                        <UserPlus className="w-4 h-4" />
                        S&apos;inscrire
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </section>
      )}

      {/* MODAL — Overlay + Formulaire centré */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            key="gfit-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={closeForm}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showForm && (
          <motion.div
            id="gfit-registration-form"
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.93 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
          >
            <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-8 md:p-10 relative max-w-2xl w-full max-h-[85vh] overflow-y-auto">
              {/* Bouton close X */}
              <button
                type="button"
                onClick={closeForm}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center transition-all duration-200"
                aria-label="Fermer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-full bg-brand-50 text-brand-500 flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="font-heading font-bold text-xl text-ink">Formulaire d&apos;inscription</h3>
                <p className="text-gray-500 text-sm mt-1">Remplis ce formulaire pour rejoindre G-Fitness</p>
              </div>

              {formSubmitted ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8" />
                  </div>
                  <h4 className="font-heading font-bold text-lg text-ink">Inscription envoyée !</h4>
                  <p className="text-gray-500 text-sm mt-2 max-w-sm mx-auto">
                    Merci ! Nous te contacterons très vite pour confirmer ton abonnement.
                  </p>
                  <button
                    type="button"
                    onClick={() => { localStorage.removeItem(CONTACT_STORAGE_KEY); setFormSubmitted(false); resetValidation(); setRegForm({ name: "", email: "", phone: "", plan: "" }); }}
                    className="mt-6 text-sm text-brand-500 font-semibold hover:underline"
                  >
                    Nouvelle inscription
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const submitErrors = validateAll(regForm);
                    if (submitErrors.name || submitErrors.email || !regForm.plan) return;
                    setFormLoading(true);
                    try {
                      const { error } = await supabase.from("registrations").insert({
                        name: regForm.name,
                        email: regForm.email,
                        phone: regForm.phone,
                        plan: regForm.plan,
                        domain: domain.name,
                        page: "fitness",
                      });
                      if (error) throw error;
                      localStorage.removeItem(CONTACT_STORAGE_KEY);
                      setFormSubmitted(true);
                      setToast({ message: "Inscription réussie ! Nous te contacterons très vite.", type: "success" });
                    } catch (err) {
                      console.error("Erreur inscription:", err);
                      setToast({ message: "Erreur lors de l'inscription. Veuillez réessayer.", type: "error" });
                    } finally {
                      setFormLoading(false);
                    }
                  }}
                  className="space-y-5"
                >
                  {/* Sélection du plan — radio group */}
                  <div>
                    <label className="block text-sm font-semibold text-ink mb-3">
                      Choisis ton abonnement <span className="text-red-400">*</span>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {domain.pricing.map((plan) => {
                        const isSelected = regForm.plan === plan.plan;
                        return (
                          <label
                            key={plan.plan}
                            className={`relative flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                              isSelected
                                ? "border-brand-500 bg-brand-50/60 shadow-sm"
                                : "border-gray-200 bg-white hover:border-gray-300"
                            }`}
                          >
                            <input
                              type="radio"
                              name="gfit-plan"
                              value={plan.plan}
                              checked={isSelected}
                              onChange={() => updateAndSave("plan", plan.plan)}
                              className="mt-0.5 accent-brand-500"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className={`font-semibold text-sm ${isSelected ? "text-brand-600" : "text-ink"}`}>
                                  {plan.plan}
                                </span>
                                <span className={`font-bold text-sm ${isSelected ? "text-brand-600" : "text-brand-500"}`}>
                                  {plan.price}
                                  {!plan.featured && <span className="font-normal text-gray-400 text-xs">/mois</span>}
                                </span>
                              </div>
                              {plan.featured && (
                                <span className="inline-block mt-1 text-xs font-semibold text-brand-500 bg-brand-100 px-2 py-0.5 rounded-full">
                                  Le plus populaire
                                </span>
                              )}
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="gfit-reg-name" className="block text-sm font-semibold text-ink mb-1.5">
                        Nom complet <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="gfit-reg-name"
                        type="text"
                        required
                        value={regForm.name}
                        onChange={(e) => updateAndSave("name", e.target.value)}
                        onBlur={() => handleBlur("name", regForm)}
                        placeholder="Jean Dupont"
                        className={`w-full px-4 py-3 rounded-xl bg-white text-sm outline-none transition-all placeholder:text-gray-300 ${
                          errors.name && touched.name
                            ? "border-2 border-red-300 focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                            : "border-2 border-gray-200 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                        }`}
                      />
                      {errors.name && touched.name && (
                        <p className="text-red-500 text-xs mt-1.5">{errors.name}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="gfit-reg-email" className="block text-sm font-semibold text-ink mb-1.5">
                        Email <span className="text-red-400">*</span>
                      </label>
                      <input
                        id="gfit-reg-email"
                        type="email"
                        required
                        value={regForm.email}
                        onChange={(e) => updateAndSave("email", e.target.value)}
                        onBlur={() => handleBlur("email", regForm)}
                        placeholder="jean@email.com"
                        className={`w-full px-4 py-3 rounded-xl bg-white text-sm outline-none transition-all placeholder:text-gray-300 ${
                          errors.email && touched.email
                            ? "border-2 border-red-300 focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                            : "border-2 border-gray-200 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                        }`}
                      />
                      {errors.email && touched.email && (
                        <p className="text-red-500 text-xs mt-1.5">{errors.email}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="gfit-reg-phone" className="block text-sm font-semibold text-ink mb-1.5">
                      Téléphone
                    </label>                      <input
                        id="gfit-reg-phone"
                        type="tel"
                        value={regForm.phone}
                        onChange={(e) => updateAndSave("phone", e.target.value)}
                        onBlur={() => handleBlur("phone", regForm)}
                        placeholder="+236 XX XX XX XX"
                        className={`w-full px-4 py-3 rounded-xl bg-white text-sm outline-none transition-all placeholder:text-gray-300 ${
                          errors.phone && touched.phone
                            ? "border-2 border-red-300 focus:ring-2 focus:ring-red-500/30 focus:border-red-500"
                            : "border-2 border-gray-200 focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
                        }`}
                      />
                      {errors.phone && touched.phone && (
                        <p className="text-red-500 text-xs mt-1.5">{errors.phone}</p>
                      )}
                  </div>

                  <button
                    type="submit"
                    disabled={formLoading || !regForm.plan || hasErrors}
                    className={`w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-sm uppercase tracking-wide transition-all ${
                      formLoading || !regForm.plan
                        ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                        : "bg-brand-500 text-white hover:bg-brand-600 shadow-lg hover:shadow-xl"
                    }`}
                  >
                    {formLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Envoi en cours…
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        Valider mon inscription
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-400 text-center">
                    En soumettant ce formulaire, tu acceptes d&apos;être contacté par G-Fitness.
                  </p>
                </form>
              )}
              {/* Bouton fermer */}
              <div className="text-center mt-6">
                <button
                  type="button"
                  onClick={closeForm}
                  className="text-sm text-gray-400 hover:text-gray-600 transition-colors underline underline-offset-2"
                >
                  Annuler et fermer
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CETTE SEMAINE — Événements */}
      <section className="py-24 px-6 bg-white" ref={weekRef}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 reveal">
            <span className="text-brand-500 text-xs font-bold tracking-[0.3em] uppercase">{t('domain.week.eyebrow')}</span>
            <h2 className="font-body font-bold uppercase text-4xl text-ink mt-3 tracking-tight">{t('domain.week.title', { domain: domain.name })}</h2>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-5">
              <Calendar className="w-5 h-5 text-brand-500" />
              <h3 className="font-heading font-bold text-lg text-ink">{t('events.title')}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {domainEvents.slice(0, 3).map((e) => <EventCard key={e.slug} event={e} />)}
              {/* Cartes événements statiques G-Fitness */}
              <EventCard
                event={{
                  slug: "marathon-gfit",
                  title: "Marathon de la Forme",
                  description: "Course solidaire de 10 km à travers Bangui. Inscription ouverte à tous les niveaux. Médailles et lots à gagner !",
                  date: "15 Août 2026",
                  location: "Bangui — Départ Place de la République",
                  image: "/images/gfitness/heros/gfitness-hero-3.jpg",
                  category: "G-Fitness",
                  status: "a_venir",
                }}
              />
              <EventCard
                event={{
                  slug: "open-house-gfit",
                  title: "Portes Ouvertes — G-Fitness",
                  description: "Viens essayer gratuitement tous nos cours et découvrir la salle. Coaching offert et cadeaux de bienvenue pour les nouveaux membres.",
                  date: "5 Septembre 2026",
                  location: "G-Fitness — Bangui",
                  image: "/images/gfitness/heros/gfitness-hero-4.jpg",
                  category: "G-Fitness",
                  status: "a_venir",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* GALERIE — grille 2 colonnes (même structure que Miss Centrafrique / O'GAB) */}
      <section className="py-24 px-6 bg-gray-50" ref={galleryRef}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-14 text-center reveal">
            <span className="text-brand-500 text-xs font-bold tracking-[0.3em] uppercase">Dans la salle</span>
            <h2 className="font-body font-bold uppercase text-4xl text-ink mt-3 tracking-tight">Galerie</h2>
          </div>
          {domain.gallery.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 stagger-children">
              {domain.gallery.map((src, i) => {
                const tall = i % 2 === 1;
                return (
                <div key={i} className={`reveal group cursor-pointer ${tall ? "md:translate-y-8" : ""}`} onClick={() => setLightboxIndex(i)}>
                  <div className="relative overflow-hidden rounded-2xl">
                    <img
                      src={src}
                      alt={`${domain.name} ${i + 1}`}
                      width={700}
                      height={tall ? 580 : 420}
                      className={`object-cover w-full transition-all duration-500 group-hover:scale-105 group-hover:shadow-xl ${
                        tall ? "h-[420px] md:h-[520px]" : "h-[380px]"
                      }`}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => { e.target.style.display = "none" }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                        <span className="inline-flex items-center gap-2 bg-white/90 text-gray-900 text-sm font-semibold px-4 py-2 rounded-full shadow-lg">
                          <ImageIcon className="w-4 h-4" />
                          Agrandir
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Légende */}
                  <div className="mt-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                    <span className="text-sm text-gray-500 font-medium">
                      G-Fitness
                    </span>
                    <span className="text-xs text-gray-300 ml-auto">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
                );
              })}
            </div>
          )}
          {domain.gallery.length === 0 && (
            <div className="text-center py-16 text-gray-400">
              <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-gray-500 font-medium">Aucune image pour le moment</p>
              <p className="text-sm mt-1">Les photos seront bientôt disponibles</p>
            </div>
          )}
        </div>
      </section>

      {lightboxIndex !== null && (
        <GalleryLightbox images={domain.gallery} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
      )}

      {/* CTA */}
      <section className="relative bg-brand-500 py-20 px-6 overflow-hidden">
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="font-heading font-bold text-4xl md:text-5xl text-white leading-tight">
            Prêt à passer à l&apos;action ?
          </h2>
          <p className="text-white/80 mt-4 mb-8 max-w-lg mx-auto leading-relaxed">
            Rejoins G-Fitness dès aujourd&apos;hui et transforme ta vie par le sport.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-white text-brand-600 font-bold uppercase tracking-wide hover:bg-white/90 transition-all"
            >
              Nous contacter
            </a>
            <a
              href="tel:+23676000000"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full border-2 border-white/40 text-white font-bold uppercase tracking-wide hover:bg-white/10 transition-all"
            >
              Nous appeler
            </a>
          </div>
        </div>
      </section>

      {/* Toast notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3.5 rounded-xl shadow-xl text-sm font-medium animate-fade-up flex items-center gap-2 ${
            toast.type === "error"
              ? "bg-red-500 text-white"
              : "bg-green-600 text-white"
          }`}
        >
          {toast.type === "success" ? (
            <Check className="w-4 h-4 shrink-0" />
          ) : (
            <span className="w-4 h-4 shrink-0 flex items-center justify-center text-xs font-bold">!</span>
          )}
          {toast.message}
        </div>
      )}

      <Footer hideCTA />
    </div>
  );
}


