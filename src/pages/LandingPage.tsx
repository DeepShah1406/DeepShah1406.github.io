import { useState } from 'react';
import type { Variants } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

type View = 'landing' | 'simple' | 'obsidian';

interface LandingPageProps {
  onSelect: (view: View) => void;
  isDark: boolean;
  onToggleDark: () => void;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } },
};

const titleVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } },
};

interface PortalCard {
  id: View | 'anime';
  icon: string;
  title: string;
  subtitle: string;
  description: string;
  tag: string;
  tagColor: 'teal' | 'purple' | 'amber';
  disabled?: boolean;
  comingSoon?: boolean;
}

const cards: PortalCard[] = [
  {
    id: 'simple',
    icon: '🌿',
    title: 'Simple Portfolio',
    subtitle: 'Clean & Accessible',
    description: 'A crisp, easy-to-navigate overview built for everyone - recruiters, HRs, and curious minds.',
    tag: 'HR Friendly',
    tagColor: 'teal',
  },
  {
    id: 'obsidian',
    icon: '🧠',
    title: 'Digital Brain',
    subtitle: 'Obsidian-Style Vault',
    description: 'A full technical knowledge vault with graph view, markdown notes, and the complete deep-dive.',
    tag: 'Tech Savvy',
    tagColor: 'purple',
  },
  {
    id: 'anime',
    icon: '✨',
    title: 'Anime.js Portfolio',
    subtitle: 'The Extraordinary One',
    description: 'Floating menus, dome gallery, pixel transitions, SVGator animations - the full creative experience.',
    tag: 'Coming Soon',
    tagColor: 'amber',
    disabled: true,
    comingSoon: true,
  },
];

const getTagColor = (color: 'teal' | 'purple' | 'amber', isDark: boolean) => {
  if (color === 'teal') {
    return isDark
      ? 'bg-teal-500/20 text-teal-300 border-teal-500/30'
      : 'bg-teal-600/10 text-teal-700 border-teal-600/20';
  }
  if (color === 'purple') {
    return isDark
      ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
      : 'bg-purple-600/10 text-purple-700 border-purple-600/20';
  }
  return isDark
    ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    : 'bg-amber-600/10 text-amber-700 border-amber-600/20';
};

export const LandingPage = ({ onSelect, isDark, onToggleDark }: LandingPageProps) => {
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleCardClick = (card: PortalCard) => {
    if (card.disabled) return;
    onSelect(card.id as View);
  };

  const dark = isDark;
  const bg = dark
    ? 'bg-gradient-to-tr from-[#030d14] via-[#0a1628] to-[#041a1a]'
    : 'bg-gradient-to-tr from-[#f0fafa] via-[#e6f7f7] to-[#f5ffff]';
  const textPrimary = dark ? 'text-white' : 'text-[#0a2a2a]';
  const textMuted   = dark ? 'text-[#7fb3b3]' : 'text-[#2a6060]';
  const textMuted2  = dark ? 'text-[#4a8080]' : 'text-[#2a6060]/75';

  return (
    <div className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden transition-colors duration-300 ${bg}`}>
      {/* Theme Toggle */}
      <button
        onClick={onToggleDark}
        className={`fixed top-4 right-4 z-50 p-2.5 rounded-xl border backdrop-blur-md shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 ${
          dark
            ? 'border-[#00CED1]/25 bg-[#030d14]/80 text-[#00CED1] hover:border-[#00CED1]/50 hover:shadow-[#00CED1]/5'
            : 'border-[#008B8B]/20 bg-white/80 text-[#008B8B] hover:border-[#008B8B]/40 hover:shadow-[#008B8B]/5'
        }`}
        title={dark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={dark ? 'moon' : 'sun'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {dark ? <Sun size={15} /> : <Moon size={15} />}
          </motion.div>
        </AnimatePresence>
      </button>

      {/* Animated ambient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {dark && (
          <>
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-[#008B8B]/10 blur-[120px] animate-pulse" style={{ animationDuration: '4s' }} />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-[#00CED1]/8 blur-[100px] animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
            <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] rounded-full bg-[#20B2AA]/5 blur-[80px] animate-pulse" style={{ animationDuration: '5s', animationDelay: '2s' }} />
          </>
        )}
        {/* Grid overlay */}
        <div
          className="absolute inset-0"
          style={{
            opacity: dark ? 0.03 : 0.06,
            backgroundImage: dark
              ? `linear-gradient(rgba(0,206,209,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,206,209,1) 1px, transparent 1px)`
              : `linear-gradient(rgba(0,139,139,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,139,139,1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-8 py-16 flex flex-col items-center gap-16">
        {/* Header */}
        <motion.div
          className="text-center flex flex-col items-center gap-4"
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight ${textPrimary}`}>
            Deep{' '}
            <span
              className="text-transparent bg-clip-text"
              style={{ backgroundImage: 'linear-gradient(135deg, #00CED1, #008B8B, #20B2AA)' }}
            >
              Shah
            </span>
          </h1>

          <p className={`${textMuted} text-base sm:text-lg font-medium tracking-widest uppercase`}>
            AI / ML Engineer &nbsp;·&nbsp; Builder &nbsp;·&nbsp; Automator
          </p>

          <p className={`${textMuted2} text-sm max-w-md text-center leading-relaxed mt-2`}>
            Choose how you'd like to explore - a clean overview or a full deep-dive into the technical vault.
          </p>
        </motion.div>

        {/* Portal Cards */}
        <motion.div
          className="w-full grid grid-cols-1 md:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {cards.map((card) => {
            const isHovered = hoveredCard === card.id;

            return (
              <motion.div
                key={card.id}
                variants={cardVariants}
                onHoverStart={() => setHoveredCard(card.id)}
                onHoverEnd={() => setHoveredCard(null)}
                onClick={() => handleCardClick(card)}
                whileHover={card.disabled ? {} : { y: -8, scale: 1.02 }}
                whileTap={card.disabled ? {} : { scale: 0.98 }}
                className={`
                  relative group rounded-2xl border p-8 flex flex-col gap-5 transition-all duration-300
                  ${card.disabled
                    ? (dark ? 'opacity-55 cursor-not-allowed border-white/10 bg-white/[0.02]' : 'opacity-55 cursor-not-allowed border-black/10 bg-black/[0.01]')
                    : (dark 
                        ? 'cursor-pointer border-[#00CED1]/15 bg-[#008B8B]/[0.04] hover:border-[#00CED1]/40 hover:bg-[#008B8B]/[0.08]' 
                        : 'cursor-pointer border-[#008B8B]/20 bg-white/70 hover:border-[#008B8B]/40 hover:bg-[#008B8B]/[0.05]')
                  }
                `}
                style={{
                  backdropFilter: 'blur(12px)',
                  boxShadow: !card.disabled && isHovered
                    ? (dark
                        ? '0 0 60px rgba(0,139,139,0.15), inset 0 1px 0 rgba(0,206,209,0.1)'
                        : '0 0 60px rgba(0,139,139,0.08), inset 0 1px 0 rgba(255,255,255,0.8)')
                    : (dark
                        ? 'inset 0 1px 0 rgba(255,255,255,0.03)'
                        : 'inset 0 1px 0 rgba(255,255,255,0.5)'),
                }}
              >
                {/* Coming soon badge */}
                {card.comingSoon && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500/20 border border-amber-500/40 rounded-full text-[10px] font-bold uppercase tracking-widest text-amber-300 whitespace-nowrap">
                    🚧 Coming Soon
                  </div>
                )}

                {/* Icon */}
                <div className="text-4xl">{card.icon}</div>

                {/* Text */}
                <div className="flex flex-col gap-2 flex-1">
                  <h2 className={`text-xl font-bold ${textPrimary} group-hover:text-[#00CED1] transition-colors duration-300`}>
                    {card.title}
                  </h2>
                  <p className={`text-xs font-semibold uppercase tracking-widest ${textMuted2}`}>
                    {card.subtitle}
                  </p>
                  <p className={`text-sm ${textMuted} leading-relaxed mt-1`}>
                    {card.description}
                  </p>
                </div>

                {/* Tag + Arrow */}
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border ${getTagColor(card.tagColor, dark)}`}>
                    {card.tag}
                  </span>
                  {!card.disabled && (
                    <motion.span
                      className="text-[#008B8B] text-lg font-bold"
                      animate={{ x: isHovered ? 4 : 0 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      →
                    </motion.span>
                  )}
                </div>

                {/* Bottom glow line on hover */}
                {!card.disabled && (
                  <motion.div
                    className="absolute bottom-0 left-4 right-4 h-[1px] bg-gradient-to-r from-transparent via-[#00CED1]/60 to-transparent rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>

        {/* Footer hint */}
        <motion.p
          className={`${textMuted2} text-xs tracking-widest uppercase`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
        >
          deepshah1406.github.io
        </motion.p>
      </div>
    </div>
  );
};
