// Témoignages clients — à remplacer plus tard par des avis réels
// liés à une base de données ou un formulaire de collecte.

import { placeholderSquare } from '../lib/placeholders.js'

export const TESTIMONIALS = [
  {
    id: 'avis-01',
    name: 'Jean-Paul Ngaïssona',
    role: 'Moto-taximan',
    product: 'TVS Raider 125',
    avatar: placeholderSquare('person-1', 100),
    rating: 5,
    text: "J'ai acheté ma Raider 125 il y a 3 mois pour le transport. Elle consomme très peu et tient bien la route même chargée. Le service après-vente du showroom PK0 est impeccable.",
  },
  {
    id: 'avis-02',
    name: 'Marie-Claire Demba',
    role: 'Commerçante',
    product: 'TVS King Cargo',
    avatar: placeholderSquare('person-2', 100),
    rating: 5,
    text: 'Le King Cargo a changé mon commerce. Je livre mes marchandises au marché central sans problème. Le châssis est solide et le moteur tient bien la charge. Je recommande vivement.',
  },
  {
    id: 'avis-03',
    name: 'Sylvain Koyamba',
    role: 'Étudiant',
    product: 'TVS Apache RTR 160',
    avatar: placeholderSquare('person-3', 100),
    rating: 4,
    text: 'L\'Apache RTR 160 est une vraie sportive. Le freinage ABS m\'a déjà sauvé deux fois sur les routes de Bangui. Seul regret : les vibrations à haute vitesse.',
  },
  {
    id: 'avis-04',
    name: 'Fatima Ousmane',
    role: 'Mère de famille',
    product: 'TVS Jupiter 125',
    avatar: placeholderSquare('person-4', 100),
    rating: 5,
    text: 'Le Jupiter 125, c\'est le confort absolu. Je fais les trajets école-maison-marché tous les jours. Le coffre sous la selle est super pratique pour les courses.',
  },
  {
    id: 'avis-05',
    name: 'David Gambi',
    role: 'Artisan',
    product: 'TVS King Passenger',
    avatar: placeholderSquare('person-5', 100),
    rating: 5,
    text: "J'utilise mon King Passenger pour transporter les ouvriers sur mes chantiers. 6 passagers sans forcer. L'entretien est simple et les pièces sont disponibles au showroom.",
  },
  {
    id: 'avis-06',
    name: 'Aïssatou Bangui',
    role: 'Coiffeuse',
    product: 'TVS Ntorq 125',
    avatar: placeholderSquare('person-6', 100),
    rating: 4,
    text: 'Le Ntorq est hyper maniable en ville. Je me faufile partout avec. La connectivité Bluetooth est gadget mais le look fait son effet ! Un peu petit pour deux personnes.',
  },
]
