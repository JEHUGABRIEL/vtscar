/**
 * Module chatbot intelligent pour TVS Bangui.
 * Utilise Gemini API si une clé est configurée, sinon répond via la base de connaissances locale.
 */

const KNOWLEDGE = {
  entreprise: {
    nom: 'TVS Bangui',
    description:
      "Distributeur officiel TVS Motor à Bangui, République Centrafricaine. Motos, moteurs, tricycles utilitaires et pièces détachées.",
    adresse: "Avenue de l'Indépendance, PK0, Bangui",
    telephone: '+236 70 00 00 00',
    horaires: 'Lundi–Samedi, 8h–18h',
  },
  commande: {
    paiement: 'Aucun paiement en ligne requis. Paiement à la livraison ou au retrait.',
  },
}

/**
 * Construit le system prompt pour Gemini.
 */
function buildSystemPrompt() {
  return `Tu es l'assistant virtuel officiel de TVS Bangui, distributeur TVS Motor en République Centrafricaine.

**Règles :**
1. Réponds toujours en français, de façon chaleureuse et professionnelle.
2. Tu as accès aux informations suivantes sur l'entreprise :
   - Nom : ${KNOWLEDGE.entreprise.nom}
   - Adresse : ${KNOWLEDGE.entreprise.adresse}
   - Téléphone : ${KNOWLEDGE.entreprise.telephone}
   - Horaires : ${KNOWLEDGE.entreprise.horaires}
   - Paiement : ${KNOWLEDGE.commande.paiement}
3. Pour les questions sur les produits, pièces, événements, renvoie l'utilisateur vers les pages correspondantes du site.
4. Si l'utilisateur demande un prix précis, donne une estimation et invite à contacter le showroom.
5. Sois concis mais amical. Utilise des émojis avec parcimonie.
6. Si tu ne sais pas répondre, suggère de contacter le showroom par téléphone.`
}

/**
 * Répond via l'API Gemini (si clé configurée).
 */
async function geminiReply(messages, apiKey) {
  if (!apiKey) return null

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai')
    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    // Préparer l'historique pour Gemini
    const history = messages.slice(0, -1).map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))

    // Dernier message utilisateur
    const lastMessage = messages[messages.length - 1]?.content || ''

    const chat = model.startChat({
      history,
      systemInstruction: buildSystemPrompt(),
    })

    const result = await chat.sendMessage(lastMessage)
    const response = await result.response
    const text = response.text()

    if (text && text.trim()) {
      return text.trim()
    }
    return null
  } catch (err) {
    console.error('[chatbot] Gemini API error:', err.message)
    return null
  }
}

/**
 * Réponse locale intelligente basée sur la base de connaissances.
 */
function localReply(messages) {
  const lastMessage = messages[messages.length - 1]?.content || ''
  const clean = lastMessage.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')

  // Salutations
  if (/^(bonjour|salut|hello|coucou|hey|bonsoir|bjr)/i.test(clean)) {
    return "Bonjour ! 👋 Je suis l'assistant virtuel de TVS Bangui. Comment puis-je vous aider aujourd'hui ? Vous pouvez me poser des questions sur nos motos, pièces détachées, horaires ou commandes."
  }

  // Remerciements
  if (/merci|mercii|thanks/i.test(clean)) {
    return "Avec plaisir ! 🎉 Si vous avez d'autres questions, je suis là. Vous pouvez aussi nous contacter directement au +236 70 00 00 00."
  }

  // Contact / adresse
  if (/contact|adresse|où\s.*trouve|showroom|localisation|plan|venir|google/i.test(clean)) {
    return `📍 **TVS Bangui**\nAvenue de l'Indépendance, PK0, Bangui\n📞 +236 70 00 00 00\n🕐 Lundi–Samedi, 8h–18h\n\nVous pouvez aussi utiliser le formulaire de contact en haut du site.`
  }

  // Horaires
  if (/horaire|heure|quand\s.*ouvr|ouvert|ferm[eé]/i.test(clean)) {
    return "🕐 **Horaires d'ouverture :**\nLundi–Samedi : 8h–18h\nDimanche : Fermé\n\nNotre showroom est situé à l'Avenue de l'Indépendance, PK0."
  }

  // Commande / livraison / achat
  if (/commande|livraison|livrer|acheter|payer|règlement|réglé|paiement/i.test(clean)) {
    return "📍 **Comment commander :**\n1. Ajoutez vos articles au panier sur notre site\n2. Finalisez la commande (nom, téléphone, quartier)\n3. Choisissez livraison ou retrait showroom\n4. Paiement à la livraison ou au retrait (aucun paiement en ligne)\n\nNotre équipe vous contacte dans la journée pour confirmation. 🚚"
  }

  // Gamme / catalogue / produits
  if (/gamme|catalogue|produits|vous\s.*avez|proposez|vendez|mod[eè]les/i.test(clean)) {
    return "Voici notre gamme TVS :\n\n🏍️ **Motos & scooters** : Apache RTR 160 (1 450 000 FCFA), Raider 125 (980 000 FCFA), Star City Plus (890 000 FCFA), Ntorq 125 (1 050 000 FCFA), Jupiter 125 (1 020 000 FCFA)\n\n🔧 **Moteurs & pièces** : Freinage, transmission, moteur, électrique, pneumatiques\n\n🛺 **Tricycles** : King Cargo (3 200 000 FCFA), King Passenger (3 450 000 FCFA)\n\n👉 Visitez notre page Produits pour plus de détails !"
  }

  // Prix
  if (/prix|tarif|combien|co[uû]te|co[uû]t|frais/i.test(clean)) {
    return "💰 **Nos tarifs :**\n• Motos & scooters : de 890 000 à 1 450 000 FCFA\n• Tricycles : de 3 200 000 à 3 450 000 FCFA\n• Pièces détachées : à partir de 8 500 FCFA\n\nPour un modèle précis, tapez son nom (ex: Apache, Raider, King) !"
  }

  // Pièces détachées
  if (/pi[eè]ce|entretien|r[eé]paration|maintenance|réparer|panne/i.test(clean)) {
    return "🔧 **Pièces détachées disponibles :**\n• Freinage : plaquettes (18 000 FCFA)\n• Transmission : kit chaîne (32 000 FCFA), kit embrayage (45 000 FCFA)\n• Moteur : filtre à air (8 500 FCFA)\n• Électrique : batterie 12V (27 000 FCFA)\n• Pneumatiques : pneu arrière renforcé (65 000 FCFA)\n\n👉 Rendez-vous sur la page Quincaillerie pour voir tout le catalogue."
  }

  // Événements
  if (/[eé]v[eé]nement|event|exposition|salon|journée|portes?\s*ouvertes?|essai/i.test(clean)) {
    return "📅 Consultez notre page Événements pour voir nos prochaines journées portes ouvertes, essais gratuits et tournées régionales."
  }

  // Produit spécifique : recherche par mots-clés
  const productMatch = findProductInMessage(clean)
  if (productMatch) {
    return productMatch
  }

  // Réponse par défaut
  return "Je n'ai pas bien compris votre demande. 😅\n\nVoici ce que je peux vous aider à trouver :\n• **Produits** — tapez le nom d'un modèle (Apache, Raider, King, etc.)\n• **Prix** — demandez les tarifs\n• **Pièces détachées** — parlez-nous de votre besoin\n• **Contact & horaires** — adresse, téléphone\n• **Commandes** — comment commander et payer\n\nOu contactez-nous directement au 📞 +236 70 00 00 00"
}

/**
 * Cherche un produit spécifique dans le message.
 */
function findProductInMessage(clean) {
  const produits = [
    { mots: ['apache', 'rtr'], reponse: '🏍️ **TVS Apache RTR 160** — 1 450 000 FCFA\nSportive urbaine 160cc, freinage ABS, 17.6 ch, vitesse max 110 km/h. Parfaite pour la ville et les trajets routiers.' },
    { mots: ['raider'], reponse: '🏍️ **TVS Raider 125** — 980 000 FCFA\nLa moto la plus populaire de la gamme ! 125cc, 11.4 ch, consommation maîtrisée. Idéale pour un usage quotidien.' },
    { mots: ['star', 'city'], reponse: '🏍️ **TVS Star City Plus** — 890 000 FCFA\nCommuter économique 110cc, 8.2 ch. Parfaite pour le transport moto-taxi et les longs trajets.' },
    { mots: ['ntorq'], reponse: '🛵 **TVS Ntorq 125** — 1 050 000 FCFA\nScooter connecté 125cc, look moderne, coffre sous selle spacieux. Idéal pour les déplacements urbains.' },
    { mots: ['jupiter'], reponse: '🛵 **TVS Jupiter 125** — 1 020 000 FCFA\nScooter familial confortable, selle large, 125cc. Pensé pour toute la famille.' },
    { mots: ['king', 'cargo', 'marchandise'], reponse: '🛺 **TVS King Cargo (3 roues)** — 3 200 000 FCFA\nTricycle utilitaire, 500 kg de charge utile. Châssis renforcé pour les routes de Bangui.' },
    { mots: ['king', 'passenger', 'passagers?', 'transport'], reponse: '🛺 **TVS King Passenger (3 roues)** — 3 450 000 FCFA\nTricycle de transport collectif, 6 passagers. Cabine avec bancs latéraux et bâche de protection.' },
  ]

  for (const p of produits) {
    if (p.mots.some((mot) => new RegExp(mot, 'i').test(clean))) {
      return p.reponse
    }
  }

  return null
}

/**
 * Point d'entrée principal du chatbot.
 * Tente Gemini d'abord, puis fallback local.
 */
export async function chatReply(messages, geminiApiKey = null) {
  // Essayer d'abord Gemini si une clé est configurée
  if (geminiApiKey) {
    const geminiResponse = await geminiReply(messages, geminiApiKey)
    if (geminiResponse) {
      return { reply: geminiResponse, source: 'gemini' }
    }
  }

  // Fallback : réponse locale
  const localResponse = localReply(messages)
  return { reply: localResponse, source: 'local' }
}
