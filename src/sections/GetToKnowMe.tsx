import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion';

/* ========================================================================
   EDIT YOUR ANSWERS HERE.
   Each node = one of your replies + the questions the visitor can ask next.
   `to` points at another node id. Keep at least a path back to "start".
   ======================================================================== */

type Choice = { label: string; to: string };
type Node = { answer: string; choices: Choice[] };

const DIALOGUE: Record<string, Node> = {
  start: {
    answer: "Hey, I'm Dela. Good to have you here. What do you want to know?",
    choices: [
      { label: 'Who are you?', to: 'who' },
      { label: 'What do you do?', to: 'work' },
      { label: 'Why web & software?', to: 'why' },
      { label: 'How do you work?', to: 'vibe' },
    ],
  },
  who: {
    answer:
      "I'm a digital architect based in Nicosia, Cyprus, with a BSc in Management Information Systems. That degree sits me right between business and technology, so I don't just build what's asked, I understand why it matters.",
    choices: [
      { label: 'What drives you?', to: 'drives' },
      { label: 'Ask something else', to: 'start' },
    ],
  },
  work: {
    answer:
      'I design and build across the stack: web, software, and mobile apps. 20+ projects shipped, from brand driven websites to full product builds. If it lives on a screen, I can architect it end to end.',
    choices: [
      { label: 'Why web & software?', to: 'why' },
      { label: 'Ask something else', to: 'start' },
    ],
  },
  why: {
    answer:
      'Because I like making ideas real. Design decides how it feels, code decides how it works, and I refuse to choose between them. Owning both is how I make products that are equal parts beautiful and solid.',
    choices: [
      { label: 'How do you work?', to: 'vibe' },
      { label: 'Ask something else', to: 'start' },
    ],
  },
  vibe: {
    answer:
      "Curious, direct, and a little obsessed with the details most people skip. I treat your project like it's my own, keep communication clear, and I'm currently open to new work, so the timing's good.",
    choices: [
      { label: "Let's cook 🔥", to: 'end' },
      { label: 'Ask something else', to: 'start' },
    ],
  },
  drives: {
    answer:
      "Building things that outlive the brief. I want someone to use what I made and think 'this just works', without ever noticing how much thought went into making it feel effortless.",
    choices: [{ label: 'Ask something else', to: 'start' }],
  },
  end: {
    answer:
      "Love that. Head to 'Let's Cook' and tell me what you're building, let's make it real.",
    choices: [{ label: 'Start over', to: 'start' }],
  },
};

const ACCENT = '#0000FF';

const PORTRAIT_URL = '/dela-portrait.png';

/* ----------------------------- Typewriter ------------------------------ */

function useTypewriter(text: string, run: boolean, instant: boolean) {
  const [out, setOut] = useState('');
  const [done, setDone] = useState(false);
  const intervalRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current !== null) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    stop();
    if (!run) {
      setOut('');
      setDone(false);
      return;
    }
    if (instant) {
      setOut(text);
      setDone(true);
      return;
    }
    setOut('');
    setDone(false);
    let i = 0;
    intervalRef.current = window.setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        stop();
        setDone(true);
      }
    }, 18);
    return stop;
  }, [text, run, instant, stop]);

  const skip = useCallback(() => {
    stop();
    setOut(text);
    setDone(true);
  }, [text, stop]);

  return { out, done, skip };
}

/* ------------------------------ HUD bracket ----------------------------- */

function Bracket({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute h-4 w-4 ${className}`}
      style={{ borderColor: ACCENT, borderWidth: 1.5 }}
    />
  );
}

/* ------------------------------ Section -------------------------------- */

export default function GetToKnowMe() {
  const reduced = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-15%' });

  const [nodeId, setNodeId] = useState('start');
  const node = DIALOGUE[nodeId];

  const { out, done, skip } = useTypewriter(node.answer, inView, reduced);

  const go = useCallback((to: string) => setNodeId(to), []);

  // Keyboard: number keys pick a choice once the line has finished typing.
  useEffect(() => {
    if (!done) return;
    const onKey = (e: KeyboardEvent) => {
      const n = parseInt(e.key, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= node.choices.length) {
        go(node.choices[n - 1].to);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [done, node.choices, go]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="flex min-h-screen items-center px-5 py-24 sm:px-8 md:px-10"
      style={{ background: '#0C0C0C' }}
    >
      <div className="mx-auto w-full max-w-4xl">
        <h2
          className="hero-heading mb-10 font-black uppercase leading-none tracking-tight sm:mb-14"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 110px)' }}
        >
          Get to Know Me
        </h2>

        <div className="flex flex-col items-stretch gap-5 sm:flex-row sm:items-start sm:gap-6">
          {/* Speaker portrait */}
          <div className="shrink-0">
            <div
              className="relative h-20 w-20 overflow-hidden rounded-2xl sm:h-28 sm:w-28"
              style={{
                border: `1.5px solid ${ACCENT}`,
                boxShadow: '0 0 28px rgba(0,0,0,0.5)',
              }}
            >
              <img
                src={PORTRAIT_URL}
                alt="Dela"
                className="h-full w-full object-cover object-top"
                draggable={false}
              />
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                {!reduced && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
                )}
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/50">
                Dela
              </span>
            </div>
          </div>

          {/* Dialogue box */}
          <div
            className="relative flex-1 rounded-2xl p-5 backdrop-blur-xl sm:p-7"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              boxShadow: '0 10px 44px rgba(0,0,0,0.5)',
            }}
          >
            <Bracket className="left-2 top-2 border-l border-t" />
            <Bracket className="right-2 top-2 border-r border-t" />
            <Bracket className="bottom-2 left-2 border-b border-l" />
            <Bracket className="bottom-2 right-2 border-b border-r" />

            {/* Answer */}
            <div
              onClick={() => !done && skip()}
              className={`min-h-[6.5rem] sm:min-h-[7rem] ${done ? '' : 'cursor-pointer'}`}
            >
              <p
                className="font-medium leading-relaxed text-white"
                style={{ fontSize: 'clamp(1rem, 1.6vw, 1.3rem)' }}
              >
                {out}
                <span
                  className="ml-0.5 inline-block animate-pulse"
                  style={{ color: ACCENT }}
                >
                  ▍
                </span>
              </p>
              {!done && inView && !reduced && (
                <span className="mt-2 block text-[11px] uppercase tracking-widest text-white/30">
                  click to skip
                </span>
              )}
            </div>

            {/* Choices */}
            <div className="mt-5 flex flex-col gap-2.5 border-t border-white/10 pt-5">
              <AnimatePresence mode="wait">
                {done && (
                  <motion.div
                    key={nodeId}
                    className="flex flex-col gap-2.5"
                    initial={reduced ? false : 'hidden'}
                    animate="show"
                    exit={reduced ? undefined : { opacity: 0 }}
                    variants={{
                      show: { transition: { staggerChildren: 0.06 } },
                    }}
                  >
                    {node.choices.map((choice, i) => (
                      <motion.button
                        key={choice.label}
                        type="button"
                        onClick={() => go(choice.to)}
                        className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-left transition-colors duration-200 hover:border-[color:var(--accent)] hover:bg-white/[0.06]"
                        style={{ ['--accent' as string]: ACCENT }}
                        variants={{
                          hidden: { opacity: 0, x: -12 },
                          show: { opacity: 1, x: 0 },
                        }}
                      >
                        <span
                          className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-xs font-bold text-white/80 transition-colors group-hover:text-white"
                          style={{ border: `1px solid ${ACCENT}` }}
                        >
                          {i + 1}
                        </span>
                        <span className="font-medium text-[#D7E2EA] transition-colors group-hover:text-white">
                          {choice.label}
                        </span>
                        <span
                          className="ml-auto translate-x-0 opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
                          style={{ color: ACCENT }}
                        >
                          ▸
                        </span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
