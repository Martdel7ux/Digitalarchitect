import { useState, useRef, useEffect, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  type Variants,
} from 'framer-motion';

type AvatarMenuProps = {
  src: string;
};

type Stat = {
  label: string;
  value: string;
  status?: boolean;
};

const STATS: Stat[] = [
  {
    label: 'Speciality',
    value: 'Web, Software & Mobile App Development',
  },
  { label: 'Education', value: 'BSc Management Information Systems' },
  { label: 'Projects', value: '20+ Completed' },
  { label: 'Location', value: 'Nicosia, Cyprus' },
  { label: 'Availability', value: 'Currently open to new projects', status: true },
];

// Springy entrance: damping 18 under stiffness 300 gives a slight overshoot.
const SPRING = { type: 'spring' as const, stiffness: 300, damping: 18 };

// Two intersecting gradient masks feather the portrait into the background:
// a strong bottom fade (so the shoulders dissolve into the dark) plus a soft
// vignette that softens the side/top edges of the cutout.
const AVATAR_MASK =
  'linear-gradient(to bottom, #000 0%, #000 40%, rgba(0,0,0,0.4) 70%, transparent 88%), ' +
  'radial-gradient(82% 88% at 50% 37%, #000 34%, rgba(0,0,0,0.35) 64%, transparent 94%)';

const ACCENT = '#0000FF';

function getVariants(reduced: boolean): { card: Variants; row: Variants } {
  if (reduced) {
    return {
      card: {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { when: 'beforeChildren' } },
        exit: { opacity: 0, transition: { duration: 0.12 } },
      },
      row: { hidden: { opacity: 0 }, show: { opacity: 1 } },
    };
  }
  return {
    // Opacity-only so it never fights the Tailwind centering transform.
    card: {
      hidden: { opacity: 0 },
      show: {
        opacity: 1,
        transition: {
          duration: 0.3,
          staggerChildren: 0.06,
          delayChildren: 0.08,
        },
      },
      exit: { opacity: 0, transition: { duration: 0.2 } },
    },
    row: {
      hidden: { opacity: 0, y: 12 },
      show: {
        opacity: 1,
        y: 0,
        transition: { type: 'spring', stiffness: 300, damping: 22 },
      },
    },
  };
}

/* --------------------------- Character profile -------------------------- */

function ProfileCard({ open, reduced }: { open: boolean; reduced: boolean }) {
  const v = getVariants(reduced);

  return (
    <AnimatePresence>
      {open && (
        <motion.aside
          variants={v.card}
          initial="hidden"
          animate="show"
          exit="exit"
          className="absolute left-1/2 top-[60%] z-40 w-[86vw] max-w-[320px] -translate-x-1/2 -translate-y-1/2 rounded-2xl p-5 sm:left-full sm:top-1/2 sm:ml-3 sm:w-[260px] sm:max-w-none sm:translate-x-0 sm:-translate-y-1/2 lg:ml-6 lg:w-[290px]"
          style={{
            backgroundColor: 'rgba(17, 19, 27, 0.55)',
            backdropFilter: 'blur(22px) saturate(140%)',
            WebkitBackdropFilter: 'blur(22px) saturate(140%)',
            border: '1px solid rgba(255, 255, 255, 0.18)',
            boxShadow:
              '0 10px 44px rgba(0, 0, 0, 0.55), inset 0 1px 0 rgba(255, 255, 255, 0.12), 0 0 32px rgba(139, 92, 246, 0.14)',
          }}
        >
          {/* HUD corner brackets */}
          <Bracket className="left-2 top-2 border-l border-t" />
          <Bracket className="right-2 top-2 border-r border-t" />
          <Bracket className="bottom-2 left-2 border-b border-l" />
          <Bracket className="bottom-2 right-2 border-b border-r" />

          {/* Header */}
          <motion.div
            variants={v.row}
            className="mb-4 flex items-center justify-between border-b border-white/10 pb-3"
          >
            <span
              className="text-[10px] font-semibold uppercase tracking-[0.3em]"
              style={{ color: ACCENT }}
            >
              Profile
            </span>
            <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-white/35">
              DM
            </span>
          </motion.div>

          {/* Stats */}
          <div className="flex flex-col gap-3">
            {STATS.map((stat, i) => (
              <motion.div
                key={stat.label}
                variants={v.row}
                className={i > 0 ? 'border-t border-white/[0.07] pt-3' : ''}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-[5px] w-[5px] rotate-45"
                    style={{ backgroundColor: ACCENT }}
                  />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9aa6b2]">
                    {stat.label}
                  </span>
                </div>
                <div className="mt-1 flex items-start gap-2 pl-[13px]">
                  {stat.status && (
                    <span className="relative mt-[6px] flex h-2 w-2 shrink-0">
                      {!reduced && (
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                      )}
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                    </span>
                  )}
                  <p className="text-[13px] font-medium leading-snug text-white">
                    {stat.value}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}

function Bracket({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute h-3 w-3 ${className}`}
      style={{ borderColor: ACCENT, borderWidth: 1.5 }}
    />
  );
}

/* ------------------------------ Avatar menu ----------------------------- */

export default function AvatarMenu({ src }: AvatarMenuProps) {
  const reduced = useReducedMotion() ?? false;
  const [open, setOpen] = useState(false);
  const [coarse, setCoarse] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | null>(null);

  // Detect touch / coarse-pointer devices (phones, tablets).
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    const update = () => setCoarse(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  const clearCloseTimer = useCallback(() => {
    if (closeTimer.current !== null) {
      window.clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const handleEnter = useCallback(() => {
    clearCloseTimer();
    setOpen(true);
  }, [clearCloseTimer]);

  const handleLeave = useCallback(() => {
    clearCloseTimer();
    closeTimer.current = window.setTimeout(() => setOpen(false), 350);
  }, [clearCloseTimer]);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  // On touch: tapping outside the avatar closes the profile card.
  useEffect(() => {
    if (!coarse || !open) return;
    const onDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('pointerdown', onDown);
    return () => document.removeEventListener('pointerdown', onDown);
  }, [coarse, open]);

  return (
    <div
      ref={rootRef}
      className="relative w-full"
      onPointerEnter={coarse ? undefined : handleEnter}
      onPointerLeave={coarse ? undefined : handleLeave}
      onClick={coarse ? () => setOpen(true) : undefined}
    >
      {/* generous invisible hit area so moving onto the card keeps it open */}
      <div className="absolute -inset-x-32 -inset-y-24 z-0" aria-hidden />

      {/* rim / glow light behind the avatar for depth */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-1/2 z-[5] -translate-x-1/2 -translate-y-1/2"
        style={{
          width: '94%',
          height: '94%',
          borderRadius: '50%',
          filter: 'blur(48px)',
          background:
            'radial-gradient(circle at 50% 42%, rgba(139,92,246,0.55), rgba(59,130,246,0.28) 45%, transparent 72%)',
        }}
        initial={{ opacity: 0.35 }}
        animate={{ opacity: open ? 0.85 : 0.35 }}
        transition={{ duration: 0.5 }}
      />

      {/* idle float + hover pop */}
      <div className="relative z-10">
        <motion.div animate={{ scale: open ? 1.03 : 1 }} transition={SPRING}>
          <motion.div
            style={{ filter: 'drop-shadow(0 28px 38px rgba(0,0,0,0.55))' }}
            animate={reduced ? undefined : { y: [0, -10, 0] }}
            transition={
              reduced
                ? undefined
                : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
            }
          >
            <img
              src={src}
              alt="Dela portrait"
              className="w-full select-none"
              draggable={false}
              style={{
                // Feather the edges into the dark background so the portrait
                // blends in instead of looking like a pasted cutout.
                WebkitMaskImage: AVATAR_MASK,
                maskImage: AVATAR_MASK,
                WebkitMaskComposite: 'source-in',
                maskComposite: 'intersect',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
              }}
            />
          </motion.div>
        </motion.div>
      </div>

      <ProfileCard open={open} reduced={reduced} />
    </div>
  );
}
