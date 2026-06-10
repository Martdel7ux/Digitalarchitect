import { useRef, useState, useEffect, useMemo } from 'react';
import {
  motion,
  useScroll,
  useSpring,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion';
import confetti from 'canvas-confetti';

/* ========================================================================
   EDIT YOUR PROCESS HERE.
   Each step is one checkpoint on the road.
   ======================================================================== */

type Step = {
  title: string;
  description: string;
  deliverable: string;
};

const STEPS: Step[] = [
  {
    title: 'Discovery',
    description:
      'I dig into your goals, your audience, and the problem we are really solving, before a single pixel or line of code.',
    deliverable: 'Goals & scope',
  },
  {
    title: 'Strategy',
    description:
      'I map the architecture and plan the build: what to make, in what order, and why each decision serves the goal.',
    deliverable: 'Roadmap & architecture',
  },
  {
    title: 'Design',
    description:
      'From wireframes to polished UI, I shape how it looks and, more importantly, how it feels to use.',
    deliverable: 'Designs & prototype',
  },
  {
    title: 'Build & Test',
    description:
      'I develop it for real, clean, fast, and responsive, then test on real devices and fix every rough edge.',
    deliverable: 'Working product',
  },
  {
    title: 'Launch & Support',
    description:
      'We ship it live, and I stick around to make sure it keeps performing long after launch day.',
    deliverable: 'Launch & support',
  },
];

const ACCENT = '#0000FF';

type LayoutNode = { x: number; y: number; frac: number; side: 'left' | 'right' };
type Layout = {
  d: string;
  nodes: LayoutNode[];
  dest: { x: number; y: number };
  H: number;
};

function computeLayout(W: number, n: number, compact: boolean): Layout {
  const topPad = 80;
  const gap = compact ? 230 : 250;
  const bottomPad = 150;
  const centerX = W / 2;
  const amp = Math.min(W * 0.3, 220);
  const railX = 48;

  const nodes: LayoutNode[] = [];
  for (let i = 0; i < n; i++) {
    const y = topPad + i * gap;
    const x = compact ? railX : i % 2 === 0 ? centerX - amp : centerX + amp;
    const side: 'left' | 'right' = compact
      ? 'right'
      : i % 2 === 0
      ? 'right'
      : 'left';
    nodes.push({ x, y, frac: 0, side });
  }
  const dest = { x: compact ? railX : centerX, y: topPad + n * gap };

  const pts = [...nodes.map((nd) => ({ x: nd.x, y: nd.y })), dest];
  let d = `M ${pts[0].x} ${pts[0].y}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const cy = (p0.y + p1.y) / 2;
    d += ` C ${p0.x} ${cy}, ${p1.x} ${cy}, ${p1.x} ${p1.y}`;
  }

  const segCount = pts.length - 1;
  nodes.forEach((nd, i) => (nd.frac = i / segCount));

  return { d, nodes, dest, H: dest.y + bottomPad };
}

const CONFETTI_COLORS = ['#0000FF', '#4D6BFF', '#FFFFFF', '#A78BFA', '#D7E2EA'];

function celebrate() {
  confetti({
    particleCount: 130,
    spread: 75,
    startVelocity: 45,
    origin: { y: 0.65 },
    colors: CONFETTI_COLORS,
  });
  confetti({
    particleCount: 60,
    angle: 60,
    spread: 55,
    origin: { x: 0, y: 0.75 },
    colors: CONFETTI_COLORS,
  });
  confetti({
    particleCount: 60,
    angle: 120,
    spread: 55,
    origin: { x: 1, y: 0.75 },
    colors: CONFETTI_COLORS,
  });
  window.setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 100,
      startVelocity: 35,
      origin: { y: 0.6 },
      colors: CONFETTI_COLORS,
    });
  }, 250);
}

export default function HowIWork() {
  const reduced = useReducedMotion() ?? false;
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const totalLen = useRef(0);

  const [width, setWidth] = useState(0);
  const [passed, setPassed] = useState(0);
  const [destActive, setDestActive] = useState(false);
  const firedRef = useRef(false);

  // Fire confetti once each time the journey reaches "Delivered".
  useEffect(() => {
    if (reduced) return;
    if (destActive && !firedRef.current) {
      firedRef.current = true;
      celebrate();
    } else if (!destActive) {
      firedRef.current = false;
    }
  }, [destActive, reduced]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const compact = width > 0 && width < 700;
  const layout = useMemo(
    () => computeLayout(width || 800, STEPS.length, compact),
    [width, compact]
  );

  useEffect(() => {
    if (pathRef.current) totalLen.current = pathRef.current.getTotalLength();
  }, [layout.d]);

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ['start 0.8', 'end 0.62'],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  useMotionValueEvent(progress, 'change', (p) => {
    const clamped = Math.max(0, Math.min(1, p));
    const path = pathRef.current;
    if (path && totalLen.current) {
      const pt = path.getPointAtLength(clamped * totalLen.current);
      mx.set(pt.x);
      my.set(pt.y);
    }
    let c = 0;
    for (const nd of layout.nodes) if (clamped >= nd.frac) c += 1;
    setPassed((prev) => (prev === c ? prev : c));
    setDestActive(clamped > 0.985);
  });

  // Set marker to the first node before any scroll.
  useEffect(() => {
    if (layout.nodes[0]) {
      mx.set(layout.nodes[0].x);
      my.set(layout.nodes[0].y);
    }
  }, [layout, mx, my]);

  const W = width || 800;
  const stepShown = Math.min(Math.max(passed, 1), STEPS.length);

  return (
    <section
      id="how-i-work"
      className="px-5 py-16 sm:px-8 sm:py-20 md:px-10"
      style={{ background: '#0C0C0C' }}
    >
      <div className="mx-auto max-w-3xl">
        {/* Heading */}
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 110px)' }}
        >
          How I Work
        </h2>
        <p className="mt-4 max-w-md text-sm font-light uppercase tracking-wide text-white/50">
          The path I follow to turn an idea into something real and worth shipping.
        </p>

        {/* Sticky progress HUD */}
        <div className="sticky top-6 z-20 mt-10 flex w-fit items-center gap-3 rounded-full px-4 py-2 backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.14)',
          }}
        >
          <span className="font-mono text-xs tracking-widest text-white/70">
            STEP {String(stepShown).padStart(2, '0')} /{' '}
            {String(STEPS.length).padStart(2, '0')}
          </span>
          <div className="h-1.5 w-24 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full origin-left rounded-full"
              style={{ scaleX: progress, backgroundColor: ACCENT }}
            />
          </div>
        </div>

        {/* Road */}
        <div
          ref={wrapRef}
          className="relative mt-8 w-full"
          style={{ height: layout.H }}
        >
          <svg
            width={W}
            height={layout.H}
            viewBox={`0 0 ${W} ${layout.H}`}
            className="absolute inset-0 overflow-visible"
          >
            {/* Dim base road */}
            <path
              ref={pathRef}
              d={layout.d}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={3}
              strokeLinecap="round"
              strokeDasharray="1 14"
            />
            {/* Drawn (active) road */}
            <motion.path
              d={layout.d}
              fill="none"
              stroke={ACCENT}
              strokeWidth={3.5}
              strokeLinecap="round"
              style={{ pathLength: progress }}
            />

            {/* Nodes */}
            {layout.nodes.map((nd, i) => {
              const active = passed >= i + 1;
              return (
                <g key={i}>
                  {active && (
                    <circle
                      cx={nd.x}
                      cy={nd.y}
                      r={26}
                      fill="rgba(0,0,255,0.18)"
                    />
                  )}
                  <circle
                    cx={nd.x}
                    cy={nd.y}
                    r={17}
                    fill="#0C0C0C"
                    stroke={active ? ACCENT : 'rgba(255,255,255,0.25)'}
                    strokeWidth={2.5}
                  />
                  <text
                    x={nd.x}
                    y={nd.y}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={15}
                    fontWeight={800}
                    fill={active ? '#fff' : 'rgba(255,255,255,0.45)'}
                    fontFamily="Kanit, sans-serif"
                  >
                    {i + 1}
                  </text>
                </g>
              );
            })}

            {/* Destination */}
            <g>
              {destActive && (
                <circle
                  cx={layout.dest.x}
                  cy={layout.dest.y}
                  r={34}
                  fill="rgba(0,0,255,0.22)"
                />
              )}
              <circle
                cx={layout.dest.x}
                cy={layout.dest.y}
                r={24}
                fill="#0C0C0C"
                stroke={destActive ? ACCENT : 'rgba(255,255,255,0.25)'}
                strokeWidth={2.5}
              />
              <text
                x={layout.dest.x}
                y={layout.dest.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={22}
              >
                🚀
              </text>
            </g>

            {/* Traveling marker */}
            <motion.g style={{ x: mx, y: my }}>
              {!reduced && (
                <motion.circle
                  r={16}
                  fill="rgba(0,0,255,0.35)"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                  transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              <circle r={9} fill={ACCENT} stroke="#fff" strokeWidth={2} />
            </motion.g>
          </svg>

          {/* Step cards */}
          {layout.nodes.map((nd, i) => {
            const revealed = passed >= i + 1;
            const toRight = nd.side === 'right';
            const cardStyle: React.CSSProperties = toRight
              ? { left: nd.x + 38, right: 8 }
              : { right: W - nd.x + 38, left: 8 };
            return (
              <motion.div
                key={i}
                className="absolute -translate-y-1/2"
                style={{ top: nd.y, ...cardStyle }}
                initial={false}
                animate={{
                  opacity: revealed ? 1 : 0.25,
                  x: revealed || reduced ? 0 : toRight ? -16 : 16,
                }}
                transition={{ type: 'spring', stiffness: 220, damping: 26 }}
              >
                <div
                  className={`rounded-2xl p-4 backdrop-blur-md sm:p-5 ${
                    toRight ? 'text-left' : 'text-right'
                  }`}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.05)',
                    border: `1px solid ${
                      revealed ? 'rgba(0,0,255,0.5)' : 'rgba(255,255,255,0.1)'
                    }`,
                  }}
                >
                  <span
                    className="text-[11px] font-bold uppercase tracking-[0.2em]"
                    style={{ color: revealed ? ACCENT : 'rgba(255,255,255,0.4)' }}
                  >
                    Phase {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3
                    className="mt-1 font-medium uppercase leading-tight tracking-tight text-white"
                    style={{ fontSize: 'clamp(1.1rem, 2.4vw, 1.6rem)' }}
                  >
                    {STEPS[i].title}
                  </h3>
                  <p className="mt-2 text-sm font-light leading-relaxed text-white/55">
                    {STEPS[i].description}
                  </p>
                  <span
                    className={`mt-3 inline-block rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white/70`}
                    style={{ borderColor: 'rgba(255,255,255,0.18)' }}
                  >
                    ✓ {STEPS[i].deliverable}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Destination label */}
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 text-center"
            style={{ top: layout.dest.y + 44 }}
            animate={{ opacity: destActive ? 1 : 0.3, y: destActive ? 0 : 8 }}
            transition={{ type: 'spring', stiffness: 220, damping: 26 }}
          >
            <span
              className="font-black uppercase tracking-tight text-white"
              style={{ fontSize: 'clamp(1.3rem, 3vw, 2rem)' }}
            >
              Delivered
            </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
