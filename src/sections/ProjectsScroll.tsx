import { useRef, useState, useEffect, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { Github, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

/* ========================================================================
   EDIT YOUR PROJECTS HERE.
   `images[0]` is the card cover; the rest are extra gallery shots.
   `github` / `href` are optional — buttons only show when present.
   ======================================================================== */

type Project = {
  number: string;
  name: string;
  description: string;
  category: string;
  year: string;
  tech: string[];
  images: string[];
  github?: string;
  href?: string;
};

const PROJECTS: Project[] = [
  {
    number: '01',
    name: 'Off Campus Accommodation Database',
    description:
      'An inhouse database application that helps the University of Nicosia accommodation office manage verified off campus housing all in one place.',
    category: 'Web App',
    year: '2026',
    tech: ['JavaScript', 'HTML', 'CSS', 'SQL'],
    images: [
      '/project-1.png',
      '/project-1-b.png',
      '/project-1-c.png',
      '/project-1-d.png',
      '/project-1-e.png',
    ],
    github: 'https://github.com/Martdel7ux/AccommodationOfficeDashboard',
  },
  {
    number: '02',
    name: 'SCI Physical Academy',
    description:
      'A bold marketing site for a physical training academy, built to convert visitors into members.',
    category: 'Web Design',
    year: '2026',
    tech: ['HTML', 'CSS'],
    images: ['/project-2.png', '/project-2-b.png', '/project-2-c.png'],
    github: 'https://github.com/Martdel7ux/Sci-physical-accademy-gym-website',
    href: 'https://sci-physical-accademy-gym-website.vercel.app/',
  },
  {
    number: '03',
    name: 'Certificate in Legal Teaching & Academic Practice (CLTAP)',
    description:
      'A landing page built to market the certificate course and drive enrolments.',
    category: 'Website',
    year: '2026',
    tech: ['WordPress'],
    images: ['/project-3.png'],
    href: 'https://cltap.cy/',
  },
  {
    number: '04',
    name: 'Sheabliss Cosmetics',
    description:
      'An ecommerce website for a cosmetics business that specialises in making and selling cosmetic products with shea butter.',
    category: 'E-Commerce',
    year: '2026',
    tech: ['WordPress', 'WooCommerce'],
    images: ['/project-4.png'],
    href: 'https://sheablisscosmetics.com/',
  },
];

const ACCENT = '#0000FF';

const glassCard: React.CSSProperties = {
  backgroundColor: 'rgba(255,255,255,0.06)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.14)',
  boxShadow: '0 20px 60px rgba(0,0,0,0.45)',
};

/* --------------------------- Link button ------------------------------- */

function LinkButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors duration-200 hover:border-[color:var(--accent)] hover:bg-white/5"
      style={{ ['--accent' as string]: ACCENT }}
    >
      {icon}
      {label}
    </a>
  );
}

/* -------------------------------- Card --------------------------------- */

function ProjectCard({
  project,
  variant,
  onExpand,
}: {
  project: Project;
  variant: 'scroll' | 'stack';
  onExpand: (images: string[]) => void;
}) {
  const sizing =
    variant === 'scroll'
      ? 'h-[78vh] w-[86vw] shrink-0 sm:w-[64vw] md:w-[50vw] lg:w-[42vw] max-w-[600px]'
      : 'w-full max-w-3xl';

  const hasLive = project.href && project.href !== '#';
  const extra = project.images.length - 1;

  return (
    <div
      className={`group flex flex-col overflow-hidden rounded-3xl ${sizing}`}
      style={glassCard}
    >
      {/* Cover image — click to open gallery */}
      <button
        type="button"
        onClick={() => onExpand(project.images)}
        aria-label={`View ${project.name} images`}
        className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden p-3 sm:p-4"
      >
        <img
          src={project.images[0]}
          alt={project.name}
          loading="lazy"
          draggable={false}
          className="max-h-full max-w-full rounded-xl object-contain transition-transform duration-500 ease-out group-hover:scale-[1.02]"
        />
        <span
          className="absolute left-5 top-5 rounded-full px-3 py-1 text-xs font-bold tracking-widest backdrop-blur-md"
          style={{
            color: '#fff',
            backgroundColor: 'rgba(0,0,0,0.4)',
            border: `1px solid ${ACCENT}`,
          }}
        >
          {project.number}
        </span>
        <span
          className="absolute bottom-5 right-5 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-white opacity-0 backdrop-blur-md transition-opacity duration-200 group-hover:opacity-100"
          style={{ backgroundColor: 'rgba(0,0,0,0.45)', border: `1px solid ${ACCENT}` }}
        >
          <Maximize2 size={13} /> {extra > 0 ? `View · +${extra}` : 'View'}
        </span>
      </button>

      {/* Info */}
      <div className="flex shrink-0 flex-col gap-3 border-t border-white/10 p-5 sm:p-6">
        <h3
          className="font-medium uppercase leading-tight tracking-tight text-white"
          style={{ fontSize: 'clamp(1.15rem, 2vw, 1.7rem)' }}
        >
          {project.name}
        </h3>

        <p className="text-sm font-light leading-relaxed text-white/55">
          {project.description}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          {project.tech.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/15 px-2.5 py-1 text-[11px] font-medium uppercase tracking-wider text-white/70"
            >
              {t}
            </span>
          ))}
          <span className="ml-auto text-[11px] font-medium uppercase tracking-[0.2em] text-white/35">
            {project.category} / {project.year}
          </span>
        </div>

        {(project.github || hasLive) && (
          <div className="mt-1 flex flex-wrap gap-2.5">
            {project.github && (
              <LinkButton
                href={project.github}
                icon={<Github size={15} />}
                label="Code"
              />
            )}
            {hasLive && (
              <LinkButton
                href={project.href as string}
                icon={<span className="text-sm leading-none">↗</span>}
                label="Live Site"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* --------------------------- Lightbox gallery -------------------------- */

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 320 : -320, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -320 : 320, opacity: 0 }),
};

function Lightbox({
  images,
  onClose,
  reduced,
}: {
  images: string[] | null;
  onClose: () => void;
  reduced: boolean;
}) {
  const [[index, dir], setState] = useState<[number, number]>([0, 0]);
  const count = images?.length ?? 0;

  useEffect(() => {
    setState([0, 0]);
  }, [images]);

  const paginate = useCallback(
    (d: number) => {
      setState(([i]) => [(i + d + count) % count, d]);
    },
    [count]
  );

  useEffect(() => {
    if (!images) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight' && count > 1) paginate(1);
      else if (e.key === 'ArrowLeft' && count > 1) paginate(-1);
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [images, count, onClose, paginate]);

  const multiple = count > 1;

  return (
    <AnimatePresence>
      {images && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4 sm:p-8"
          style={{
            backgroundColor: 'rgba(6,6,6,0.9)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Stage */}
          <div
            className="relative flex h-[78vh] w-full max-w-5xl items-center justify-center overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <AnimatePresence custom={dir} initial={false} mode="popLayout">
              <motion.img
                key={index}
                src={images[index]}
                alt=""
                draggable={false}
                className="absolute max-h-full max-w-full rounded-2xl object-contain"
                style={{ border: `1px solid ${ACCENT}` }}
                custom={dir}
                variants={reduced ? undefined : slideVariants}
                initial={reduced ? { opacity: 0 } : 'enter'}
                animate={reduced ? { opacity: 1 } : 'center'}
                exit={reduced ? { opacity: 0 } : 'exit'}
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                drag={multiple && !reduced ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.2}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -80) paginate(1);
                  else if (info.offset.x > 80) paginate(-1);
                }}
              />
            </AnimatePresence>

            {/* Prev / Next */}
            {multiple && (
              <>
                <button
                  type="button"
                  onClick={() => paginate(-1)}
                  aria-label="Previous image"
                  className="absolute left-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/70"
                  style={{ border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  <ChevronLeft size={24} />
                </button>
                <button
                  type="button"
                  onClick={() => paginate(1)}
                  aria-label="Next image"
                  className="absolute right-2 top-1/2 z-10 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/70"
                  style={{ border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>

          {/* Dots + counter */}
          {multiple && (
            <div
              className="mt-5 flex items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                {images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    aria-label={`Go to image ${i + 1}`}
                    onClick={() => setState([i, i > index ? 1 : -1])}
                    className="h-2 rounded-full transition-all duration-200"
                    style={{
                      width: i === index ? 22 : 8,
                      backgroundColor:
                        i === index ? ACCENT : 'rgba(255,255,255,0.35)',
                    }}
                  />
                ))}
              </div>
              <span className="text-xs font-medium uppercase tracking-widest text-white/50">
                {index + 1} / {count}
              </span>
            </div>
          )}

          {/* Close */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full text-white transition-colors hover:bg-white/10"
            style={{ border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <X size={20} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------ Section -------------------------------- */

export default function ProjectsScroll() {
  const reduced = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);
  const distanceRef = useRef(0);
  const [gallery, setGallery] = useState<string[] | null>(null);

  useEffect(() => {
    if (reduced) return;
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      const d = Math.max(0, track.scrollWidth - window.innerWidth);
      distanceRef.current = d;
      setDistance(d);
    };
    measure();
    window.addEventListener('resize', measure);
    const ro = new ResizeObserver(measure);
    if (trackRef.current) ro.observe(trackRef.current);
    return () => {
      window.removeEventListener('resize', measure);
      ro.disconnect();
    };
  }, [reduced]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const x = useTransform(scrollYProgress, (v) => -v * distanceRef.current);

  // Reduced motion: simple vertical stack, no scroll hijacking.
  if (reduced) {
    return (
      <section
        id="projects"
        className="px-5 py-24 sm:px-8 md:px-10"
        style={{ background: '#0C0C0C' }}
      >
        <h2
          className="hero-heading mb-12 font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 110px)' }}
        >
          Projects
        </h2>
        <div className="flex flex-col items-center gap-10">
          {PROJECTS.map((p) => (
            <ProjectCard
              key={p.number}
              project={p}
              variant="stack"
              onExpand={setGallery}
            />
          ))}
        </div>
        <Lightbox images={gallery} onClose={() => setGallery(null)} reduced />
      </section>
    );
  }

  return (
    <section
      id="projects"
      ref={sectionRef}
      style={{ height: `calc(100vh + ${distance}px)`, background: '#0C0C0C' }}
      className="relative"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex items-center gap-6 px-6 will-change-transform sm:gap-8 md:px-10"
        >
          {/* Intro panel */}
          <div className="flex h-[78vh] w-[78vw] shrink-0 flex-col justify-center sm:w-[44vw] md:w-[34vw] lg:w-[28vw]">
            <h2
              className="hero-heading font-black uppercase leading-none tracking-tight"
              style={{ fontSize: 'clamp(3rem, 9vw, 130px)' }}
            >
              Projects
            </h2>
            <p className="mt-6 max-w-xs text-sm font-light uppercase leading-relaxed tracking-wide text-white/50">
              Some of my recent projects
            </p>
            <div className="mt-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/40">
              <span>Scroll</span>
              <motion.span
                style={{ color: ACCENT }}
                animate={{ x: [0, 8, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                →
              </motion.span>
            </div>
          </div>

          {/* Cards */}
          {PROJECTS.map((p) => (
            <ProjectCard
              key={p.number}
              project={p}
              variant="scroll"
              onExpand={setGallery}
            />
          ))}

          {/* trailing spacer so the last card clears the edge */}
          <div className="w-6 shrink-0 md:w-10" aria-hidden />
        </motion.div>
      </div>

      <Lightbox
        images={gallery}
        onClose={() => setGallery(null)}
        reduced={false}
      />
    </section>
  );
}
