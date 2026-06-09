import { useState, useRef, useEffect, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from 'framer-motion';

type AvatarMenuProps = {
  src: string;
};

const PILLS = [
  { label: 'Mobile App Development', angle: 158 },
  { label: 'Web Design & Development', angle: 90 },
  { label: 'Software Development', angle: 22 },
];

// Fraction of avatar width used as the radial menu radius.
const RADIUS_RATIO = 0.62;
// Vertical anchor of the mouth (fraction of avatar height).
const MOUTH_TOP = '62%';
// Springy entrance: damping 18 under stiffness 300 gives a slight overshoot.
const SPRING = { type: 'spring' as const, stiffness: 300, damping: 18 };

// Two intersecting gradient masks feather the portrait into the background:
// a strong bottom fade (so the shoulders dissolve into the dark) plus a soft
// vignette that softens the side/top edges of the cutout.
const AVATAR_MASK =
  'linear-gradient(to bottom, #000 0%, #000 52%, rgba(0,0,0,0.55) 78%, transparent 96%), ' +
  'radial-gradient(115% 100% at 50% 40%, #000 52%, rgba(0,0,0,0.4) 82%, transparent 100%)';

const glassBase: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.08)',
  border: '1px solid rgba(255, 255, 255, 0.25)',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.25)',
};

const glassHover: React.CSSProperties = {
  backgroundColor: 'rgba(139, 92, 246, 0.16)',
  border: '1px solid rgba(167, 139, 250, 0.95)',
  boxShadow:
    '0 0 24px rgba(139, 92, 246, 0.7), inset 0 0 0 1px rgba(167, 139, 250, 0.6)',
};

/* ----------------------------- Service pill ----------------------------- */

type PillProps = {
  label: string;
  tx: number;
  ty: number;
  index: number;
  open: boolean;
  reduced: boolean;
};

function ServicePill({ label, tx, ty, index, open, reduced }: PillProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, SPRING);
  const y = useSpring(my, SPRING);

  const handleMove = useCallback(
    (e: React.PointerEvent) => {
      if (reduced || !ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      mx.set((e.clientX - cx) * 0.35);
      my.set((e.clientY - cy) * 0.35);
    },
    [reduced, mx, my]
  );

  const handleLeave = useCallback(() => {
    mx.set(0);
    my.set(0);
    setHovered(false);
  }, [mx, my]);

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <motion.div
        className="pointer-events-auto"
        initial={{ x: 0, y: 0, scale: 0.4, opacity: 0 }}
        animate={
          open
            ? { x: tx, y: ty, scale: 1, opacity: 1 }
            : { x: 0, y: 0, scale: 0.4, opacity: 0 }
        }
        transition={
          reduced
            ? { duration: 0.18 }
            : { ...SPRING, delay: open ? index * 0.12 : 0 }
        }
      >
        <motion.button
          ref={ref}
          type="button"
          style={{
            x: reduced ? 0 : x,
            y: reduced ? 0 : y,
            ...(hovered ? glassHover : glassBase),
          }}
          onPointerMove={handleMove}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={handleLeave}
          className="whitespace-nowrap rounded-full px-4 py-2 text-xs font-medium text-white backdrop-blur-md transition-[background-color,border-color,box-shadow] duration-200 sm:px-5 sm:py-2.5 sm:text-sm"
        >
          {label}
        </motion.button>
      </motion.div>
    </div>
  );
}

/* ----------------------------- Speech bubble ---------------------------- */

function SpeechBubble({ open, reduced }: { open: boolean; reduced: boolean }) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="pointer-events-none absolute left-1/2 z-30"
          style={{ top: MOUTH_TOP }}
          initial={{ opacity: 0, scale: reduced ? 1 : 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: reduced ? 1 : 0.5 }}
          transition={reduced ? { duration: 0.18 } : SPRING}
        >
          <div
            className="relative -translate-x-1/2 rounded-2xl px-4 py-3 backdrop-blur-md"
            style={{
              ...glassBase,
              transform: 'translate(-50%, calc(-100% - 14px))',
              transformOrigin: 'bottom center',
              maxWidth: 230,
            }}
          >
            <p className="text-center text-sm font-medium leading-snug text-white">
              What services do you want to hire me for?
            </p>
            {/* tail pointing down at the mouth */}
            <div
              className="absolute left-1/2 h-4 w-4 -translate-x-1/2 backdrop-blur-md"
              style={{
                bottom: -8,
                transform: 'translateX(-50%) rotate(45deg)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRight: '1px solid rgba(255, 255, 255, 0.25)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.25)',
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------ Avatar menu ----------------------------- */

export default function AvatarMenu({ src }: AvatarMenuProps) {
  const reduced = useReducedMotion() ?? false;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(0);
  const closeTimer = useRef<number | null>(null);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const update = () => setWidth(el.getBoundingClientRect().width);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
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

  const radius = width * RADIUS_RATIO;

  return (
    <div
      ref={rootRef}
      className="relative w-full"
      onPointerEnter={handleEnter}
      onPointerLeave={handleLeave}
    >
      {/* generous invisible hit area so moving onto pills keeps the menu open */}
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
        <motion.div
          animate={{ scale: open ? 1.03 : 1 }}
          transition={SPRING}
        >
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

      <SpeechBubble open={open} reduced={reduced} />

      <div className="absolute inset-0 z-20">
        {PILLS.map((pill, i) => {
          const rad = (pill.angle * Math.PI) / 180;
          const tx = Math.cos(rad) * radius;
          const ty = -Math.sin(rad) * radius;
          return (
            <ServicePill
              key={pill.label}
              label={pill.label}
              tx={tx}
              ty={ty}
              index={i}
              open={open}
              reduced={reduced}
            />
          );
        })}
      </div>
    </div>
  );
}
