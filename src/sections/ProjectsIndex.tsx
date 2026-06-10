import { useState, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from 'framer-motion';

/* ========================================================================
   EDIT YOUR PROJECTS HERE.
   `image` is the preview shown on hover. `href` is where the row links to.
   ======================================================================== */

type Project = {
  number: string;
  name: string;
  category: string;
  year: string;
  image: string;
  href: string;
};

const PROJECTS: Project[] = [
  {
    number: '01',
    name: 'Nextlevel Studio',
    category: 'Client',
    year: '2026',
    image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
    href: '#',
  },
  {
    number: '02',
    name: 'Aura Brand Identity',
    category: 'Personal',
    year: '2026',
    image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
    href: '#',
  },
  {
    number: '03',
    name: 'Solaris Digital',
    category: 'Client',
    year: '2026',
    image:
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
    href: '#',
  },
];

const ACCENT = '#0000FF';

export default function ProjectsIndex() {
  const reduced = useReducedMotion() ?? false;
  const [active, setActive] = useState<number | null>(null);

  // Cursor-following preview position (viewport coordinates).
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 150, damping: 20, mass: 0.5 });
  const y = useSpring(my, { stiffness: 150, damping: 20, mass: 0.5 });

  const handleMove = useCallback(
    (e: React.PointerEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
    },
    [mx, my]
  );

  return (
    <section
      id="projects"
      onPointerMove={reduced ? undefined : handleMove}
      className="relative min-h-screen px-5 py-24 sm:px-8 md:px-10"
      style={{ background: '#0C0C0C' }}
    >
      <div className="mx-auto w-full max-w-6xl">
        <h2
          className="hero-heading mb-12 font-black uppercase leading-none tracking-tight sm:mb-16"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 110px)' }}
        >
          Projects
        </h2>

        {/* Index list */}
        <ul
          className="border-t border-white/10"
          onPointerLeave={() => setActive(null)}
        >
          {PROJECTS.map((project, i) => {
            const dimmed = active !== null && active !== i;
            return (
              <li key={project.number} className="border-b border-white/10">
                <a
                  href={project.href}
                  onPointerEnter={() => setActive(i)}
                  className="group flex items-center gap-4 py-6 transition-opacity duration-300 sm:gap-8 sm:py-8 md:py-10"
                  style={{ opacity: dimmed ? 0.35 : 1 }}
                >
                  {/* Number */}
                  <span
                    className="font-mono text-xs font-medium tracking-widest text-white/40 transition-colors duration-300 sm:text-sm"
                    style={{ color: active === i ? ACCENT : undefined }}
                  >
                    {project.number}
                  </span>

                  {/* Name */}
                  <motion.span
                    className="flex-1 font-medium uppercase leading-none tracking-tight text-[#D7E2EA] transition-colors duration-300 group-hover:text-white"
                    style={{ fontSize: 'clamp(1.6rem, 5vw, 4.5rem)' }}
                    animate={
                      reduced
                        ? undefined
                        : { x: active === i ? 16 : 0 }
                    }
                    transition={{ type: 'spring', stiffness: 300, damping: 26 }}
                  >
                    {project.name}
                  </motion.span>

                  {/* Category + year */}
                  <span className="hidden shrink-0 text-right text-xs font-medium uppercase tracking-[0.2em] text-white/40 sm:block sm:text-sm">
                    {project.category}
                    <span className="mx-2 text-white/20">/</span>
                    {project.year}
                  </span>

                  {/* Arrow */}
                  <span
                    className="shrink-0 text-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 sm:text-2xl"
                    style={{ color: active === i ? ACCENT : 'rgba(255,255,255,0.4)' }}
                  >
                    ↗
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Cursor-following preview */}
      {!reduced && (
        <motion.div
          className="pointer-events-none fixed left-0 top-0 z-50 -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl"
          style={{
            x,
            y,
            width: 360,
            height: 240,
            border: `1.5px solid ${ACCENT}`,
            boxShadow: '0 20px 60px rgba(0,0,0,0.6), 0 0 40px rgba(0,0,30,0.5)',
          }}
          initial={false}
          animate={{
            opacity: active !== null ? 1 : 0,
            scale: active !== null ? 1 : 0.85,
          }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <AnimatePresence mode="popLayout">
            {active !== null && (
              <motion.img
                key={PROJECTS[active].number}
                src={PROJECTS[active].image}
                alt={PROJECTS[active].name}
                className="h-full w-full object-cover"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                draggable={false}
              />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
