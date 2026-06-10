import { useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import { Instagram, Facebook, Linkedin, Github, ArrowUp } from 'lucide-react';

/* ========================================================================
   EDIT YOUR SOCIAL HANDLES HERE.
   Replace `handle` (shown on screen) and `href` (the link) for each.
   ======================================================================== */

type Social = {
  name: string;
  handle: string;
  href: string;
  color: string;
  Icon: typeof Instagram;
};

const SOCIALS: Social[] = [
  {
    name: 'Instagram',
    handle: '@delamarttin',
    href: 'https://www.instagram.com/delamarttin/',
    color: '#E1306C',
    Icon: Instagram,
  },
  {
    name: 'Facebook',
    handle: 'Dela Martin',
    href: 'https://www.facebook.com/ahotom',
    color: '#1877F2',
    Icon: Facebook,
  },
  {
    name: 'LinkedIn',
    handle: 'Martin Ahoto',
    href: 'https://www.linkedin.com/in/martin-ahoto-5b07561a3/',
    color: '#0A66C2',
    Icon: Linkedin,
  },
  {
    name: 'GitHub',
    handle: 'Martdel7ux',
    href: 'https://github.com/Martdel7ux',
    color: '#FFFFFF',
    Icon: Github,
  },
];

const ACCENT = '#0000FF';

function MagneticSocial({ social, reduced }: { social: Social; reduced: boolean }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 200, damping: 15, mass: 0.4 });
  const y = useSpring(my, { stiffness: 200, damping: 15, mass: 0.4 });
  const [hover, setHover] = useState(false);
  const { Icon } = social;

  const handleMove = (e: React.PointerEvent) => {
    if (reduced || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    mx.set((e.clientX - (r.left + r.width / 2)) * 0.4);
    my.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
    setHover(false);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <motion.a
        ref={ref}
        href={social.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={social.name}
        onPointerMove={handleMove}
        onPointerEnter={() => setHover(true)}
        onPointerLeave={reset}
        style={{
          x: reduced ? 0 : x,
          y: reduced ? 0 : y,
          backgroundColor: 'rgba(255,255,255,0.05)',
          borderColor: hover ? social.color : 'rgba(255,255,255,0.15)',
          boxShadow: hover ? `0 0 34px ${social.color}55` : '0 0 0 transparent',
        }}
        className="grid h-16 w-16 place-items-center rounded-2xl border-2 backdrop-blur-md transition-[box-shadow,border-color] duration-300 sm:h-20 sm:w-20"
      >
        <motion.span
          animate={{
            color: hover ? social.color : '#D7E2EA',
            scale: hover && !reduced ? 1.12 : 1,
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 18 }}
        >
          <Icon size={30} />
        </motion.span>
      </motion.a>

      <div className="text-center">
        <div className="text-xs font-semibold uppercase tracking-widest text-white/70">
          {social.name}
        </div>
        <div className="text-[11px] text-white/40">{social.handle}</div>
      </div>
    </div>
  );
}

export default function LetsConnect() {
  const reduced = useReducedMotion() ?? false;

  return (
    <footer
      id="connect"
      className="px-5 py-16 sm:px-8 sm:py-20 md:px-10"
      style={{ background: '#0C0C0C' }}
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center text-center">
        <motion.h2
          className="hero-heading font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 9vw, 120px)' }}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
        >
          Let&apos;s Connect
        </motion.h2>

        <p className="mt-5 max-w-md text-sm font-light uppercase tracking-wide text-white/50">
          Find me around the internet or just say hi.
        </p>

        {/* Social icons */}
        <div className="mt-14 flex flex-wrap items-start justify-center gap-8 sm:gap-12">
          {SOCIALS.map((s) => (
            <MagneticSocial key={s.name} social={s} reduced={reduced} />
          ))}
        </div>
      </div>

      {/* Footer bar */}
      <div className="mx-auto mt-14 flex w-full max-w-5xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
        <span className="text-xs uppercase tracking-widest text-white/40">
          © 2026 Dela · The Digital Architect
        </span>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/50 transition-colors hover:text-white"
        >
          Back to top
          <span
            className="grid h-7 w-7 place-items-center rounded-full border transition-transform duration-200 group-hover:-translate-y-0.5"
            style={{ borderColor: ACCENT }}
          >
            <ArrowUp size={14} />
          </span>
        </button>
      </div>
    </footer>
  );
}
