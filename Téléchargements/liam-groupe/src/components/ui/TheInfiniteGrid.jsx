import { useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLangPath } from "../../lib/langPath";
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useAnimationFrame,
} from "framer-motion";
import { ArrowRight } from "lucide-react";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
  },
};

export default function InfiniteGrid() {
  const { t } = useTranslation();
  const p = useLangPath();
  const containerRef = useRef(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e) => {
    const { left, top } = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const gridOffsetX = useMotionValue(0);
  const gridOffsetY = useMotionValue(0);

  const speedX = 0.5;
  const speedY = 0.5;

  useAnimationFrame(() => {
    const currentX = gridOffsetX.get();
    const currentY = gridOffsetY.get();
    gridOffsetX.set((currentX + speedX) % 40);
    gridOffsetY.set((currentY + speedY) % 40);
  });

  const maskImage = useMotionTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-ink"
    >
      {/* Ambient glow blobs */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute right-[-20%] top-[-20%] w-[40%] h-[40%] rounded-full bg-brand-500/30 blur-[120px]" />
        <div className="absolute right-[10%] top-[-10%] w-[20%] h-[20%] rounded-full bg-violet-500/20 blur-[100px]" />
        <div className="absolute left-[-10%] bottom-[-20%] w-[40%] h-[40%] rounded-full bg-coral-500/20 blur-[120px]" />
      </div>

      {/* Subtle background grid layer */}
      <div className="absolute inset-0 z-0 opacity-[0.04]">
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </div>

      {/* Spotlight grid layer — follows mouse */}
      <motion.div
        className="absolute inset-0 z-0 opacity-30"
        style={{ maskImage, WebkitMaskImage: maskImage }}
      >
        <GridPattern offsetX={gridOffsetX} offsetY={gridOffsetY} />
      </motion.div>

      {/* Content avec animations d'entrée staggered */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center text-center px-4 max-w-3xl mx-auto space-y-6"
      >
        {/* Tagline */}
        <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 text-brand-500 font-semibold tracking-[0.25em] text-xs uppercase">
          <span className="h-px w-10 bg-brand-500/60" />
          {t("heroGrid.tagline")}
          <span className="h-px w-10 bg-brand-500/60" />
        </motion.div>

        {/* Title */}
        <motion.h1 variants={itemVariants} className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-white leading-tight drop-shadow-sm">
          {t("heroGrid.title1")}{" "}
          <span className="text-brand-500">{t("heroGrid.title2")}</span>
        </motion.h1>

        {/* Description */}
        <motion.p variants={itemVariants} className="text-white/60 max-w-2xl mx-auto leading-relaxed text-lg">
          {t("heroGrid.description")}
        </motion.p>

        {/* CTAs */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Link
            to={p("/a-propos")}
            className="px-7 py-3.5 rounded-full bg-brand-500 hover:bg-brand-600 text-white font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-brand-500/25 active:scale-95"
          >
            {t("heroGrid.ctaPrimary")}
          </Link>
          <Link
            to={p("/evenements")}
            className="px-7 py-3.5 rounded-full border border-white/30 text-white font-semibold hover:bg-white/10 transition-all duration-300 inline-flex items-center gap-2 active:scale-95"
          >
            {t("heroGrid.ctaSecondary")} <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-5 h-8 rounded-full border border-white/30 flex items-start justify-center pt-1.5"
        >
          <motion.div className="w-1 h-2 rounded-full bg-white/60" />
        </motion.div>
      </div>
    </div>
  );
}

function GridPattern({ offsetX, offsetY }) {
  return (
    <svg className="w-full h-full">
      <defs>
        <motion.pattern
          id="infinite-grid-pattern"
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
          x={offsetX}
          y={offsetY}
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-white/20"
          />
        </motion.pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#infinite-grid-pattern)" />
    </svg>
  );
}
