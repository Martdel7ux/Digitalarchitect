import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

const LINKS = [
  { label: 'Get to Know Me', href: '#about' },
  { label: 'Projects', href: '#projects' },
  { label: 'My thoughts', href: '#thoughts' },
  { label: "Let's Cook", href: '#contact' },
];

const glass: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.07)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(255, 255, 255, 0.18)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.35)',
};

export default function CircleMenu() {
  const reduced = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const timer = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  }, []);

  const handleEnter = useCallback(() => {
    clearTimer();
    setOpen(true);
  }, [clearTimer]);

  const handleLeave = useCallback(() => {
    clearTimer();
    timer.current = window.setTimeout(() => setOpen(false), 250);
  }, [clearTimer]);

  const layoutTransition = reduced
    ? { duration: 0 }
    : { type: 'spring' as const, stiffness: 260, damping: 24 };

  return (
    <motion.nav
      layout
      transition={layoutTransition}
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
      style={glass}
      className="z-40 flex items-center gap-1 overflow-hidden rounded-full p-2"
    >
      {/* Toggle circle — DM monogram */}
      <motion.button
        layout
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        className="group grid h-12 w-12 shrink-0 place-items-center rounded-full transition-colors duration-200 hover:bg-white/10"
      >
        <span
          className="font-black leading-none transition-transform duration-300 group-hover:scale-105"
          style={{
            fontSize: '1.2rem',
            letterSpacing: '0.04em',
            backgroundImage:
              'linear-gradient(155deg, #FFFFFF 0%, #C7D4DE 48%, #6E7681 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 1px 6px rgba(199, 212, 222, 0.18)',
          }}
        >
          DM
        </span>
      </motion.button>

      {/* Links — revealed on open */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="flex items-center gap-1 whitespace-nowrap pr-1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {LINKS.map((link, i) => (
              <motion.a
                key={link.label}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-sm font-medium uppercase tracking-wider text-[#D7E2EA] transition-colors duration-200 hover:bg-white/10 md:px-4 md:text-base"
                initial={reduced ? false : { opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={reduced ? undefined : { opacity: 0, x: -10 }}
                transition={{
                  delay: reduced ? 0 : 0.08 + i * 0.06,
                  duration: 0.25,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
