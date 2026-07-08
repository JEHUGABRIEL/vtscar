// lucide-react a retiré les icônes de marques (Facebook, Instagram, X, YouTube).
// On les recrée ici en SVG simple, dans le même style "outline" que lucide.

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function FacebookIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} {...base}>
      <path d="M14 9h3V6h-3c-1.7 0-3 1.3-3 3v2H8v3h3v6h3v-6h3l1-3h-4V9c0-.6.4-1 1-1z" />
    </svg>
  );
}

export function InstagramIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} {...base}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function XIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M4 4l7.2 9.2L4.4 20h2.6l5.6-6.4L17.6 20H20l-7.5-9.6L19.8 4h-2.6l-5.2 5.9L8.6 4H4z" />
    </svg>
  );
}

export function YoutubeIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} {...base}>
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" />
      <path d="M10.5 9.5l5 2.5-5 2.5v-5z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function LinkedInIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} {...base}>
      <rect x="2" y="2" width="20" height="20" rx="4" />
      <path d="M8 11v5M8 8v.01" />
      <path d="M12 16v-4c0-1.1.9-2 2-2s2 .9 2 2v4" />
    </svg>
  );
}
