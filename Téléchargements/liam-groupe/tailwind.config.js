/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["Fraunces", "ui-serif", "Georgia", "serif"],
        body: ["Oswald", "ui-sans-serif", "sans-serif"],
        mono: ["\"Space Mono\"", "ui-monospace", "monospace"],
      },
      colors: {
        // Rouge — couleur d'action principale, reprise du drapeau centrafricain
        brand: {
          50: "#FDEAE9",
          100: "#FAD0CD",
          400: "#DE4A3E",
          500: "#CE1126",
          600: "#A80E1F",
          700: "#7D0A17",
        },
        // Bleu ardoise — utilisé pour les badges informatifs (remplace l'ancien violet générique)
        violet: {
          50: "#EAF1F8",
          100: "#CFE0EF",
          200: "#A8C8E0",
          500: "#2E6DA4",
          600: "#24567F",
          700: "#1B4361",
          900: "#0F2A3D",
        },
        // Or — accent secondaire, repris du drapeau centrafricain
        coral: {
          50: "#FFF8E1",
          100: "#FFECB3",
          400: "#FFC933",
          500: "#F4B400",
          600: "#C98E00",
        },
        gold: {
          50: "#FFF8E1",
          100: "#FFECB3",
          400: "#FFC933",
          500: "#F4B400",
          600: "#C98E00",
        },
        // Vert — accent tertiaire, repris du drapeau centrafricain
        green: {
          50: "#E8F5EC",
          100: "#C6E8D0",
          400: "#3FA35F",
          500: "#237A45",
          600: "#1B5E35",
        },
        // Navy — couleur d'encre reprise du logotype LIAM Groupe (texte + fonds sombres)
        ink: {
          DEFAULT: "#0E2A45",
          900: "#081A2C",
          800: "#123354",
        },
        rose: {
          50: "#F1F3F5",
          600: "#64748B",
          700: "#475569",
        },
      },
      boxShadow: {
        card: "0 10px 30px -12px rgba(14,42,69,0.15)",
        "card-hover": "0 20px 50px -16px rgba(14,42,69,0.25)",
        "hero": "0 30px 80px rgba(206,17,38,0.15)",
      },
      animation: {
        "fade-in": "fadeIn 0.6s ease-out forwards",
        "fade-out": "fadeOut 0.3s ease-in forwards",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "fade-down": "fadeDown 0.6s ease-out forwards",
        "fade-left": "fadeLeft 0.6s ease-out forwards",
        "fade-right": "fadeRight 0.6s ease-out forwards",
        "scale-in": "scaleIn 0.5s ease-out forwards",
        "scale-out": "scaleOut 0.3s ease-in forwards",
        "slide-up": "slideUp 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "zoom-in": "zoomIn 0.5s ease-out forwards",
        "blur-in": "blurIn 0.5s ease-out forwards",
        "reveal-strong": "revealStrong 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "scroll": "scroll 30s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeDown: {
          "0%": { opacity: "0", transform: "translateY(-30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeLeft: {
          "0%": { opacity: "0", transform: "translateX(-30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeRight: {
          "0%": { opacity: "0", transform: "translateX(30px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        scaleOut: {
          "0%": { opacity: "1", transform: "scale(1)" },
          "100%": { opacity: "0", transform: "scale(0.95)" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(60px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        zoomIn: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        blurIn: {
          "0%": { opacity: "0", filter: "blur(10px)" },
          "100%": { opacity: "1", filter: "blur(0)" },
        },
        revealStrong: {
          "0%": { opacity: "0", transform: "translateY(45px) scale(0.92)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        scroll: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
}

