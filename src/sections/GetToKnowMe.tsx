import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react';
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion';
import { Send, RotateCcw } from 'lucide-react';
import { findAnswer, DEFAULT_SUGGESTIONS } from '../data/assistant';

/* ========================================================================
   ASSISTANT SECTION.
   Answers come from the knowledge base in src/data/assistant.ts — edit that
   file to change what DM-01 knows. No AI / API key involved.
   ======================================================================== */

const ASSISTANT_NAME = 'DM-01';

const GREETING = `Hey! I'm ${ASSISTANT_NAME}, Dela's assistant. Ask me anything about Dela: skills, projects, how Dela works, or whether Dela is free for your next build.`;

const ACCENT = '#0000FF';
const PORTRAIT_URL = '/dela-portrait.png';
const MAX_CHARS = 300;

// Feather the cutout portrait into the stage (bottom fade + soft vignette).
const AVATAR_MASK =
  'linear-gradient(to bottom, #000 0%, #000 45%, rgba(0,0,0,0.4) 72%, transparent 92%), ' +
  'radial-gradient(85% 90% at 50% 38%, #000 38%, rgba(0,0,0,0.35) 68%, transparent 96%)';

type Status = 'idle' | 'thinking' | 'speaking';

/* ----------------------------- Typewriter ------------------------------ */

function useTypewriter(text: string, run: boolean, instant: boolean) {
  const [out, setOut] = useState('');
  const [done, setDone] = useState(false);
  const timer = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (timer.current !== null) {
      window.clearInterval(timer.current);
      timer.current = null;
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
    timer.current = window.setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        stop();
        setDone(true);
      }
    }, 16);
    return stop;
  }, [text, run, instant, stop]);

  const skip = useCallback(() => {
    stop();
    setOut(text);
    setDone(true);
  }, [text, stop]);

  return { out, done, skip };
}

/* ------------------------------ Pieces --------------------------------- */

function Bracket({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute z-10 h-4 w-4 ${className}`}
      style={{ borderColor: ACCENT, borderWidth: 1.5 }}
    />
  );
}

function ThinkingDots({ reduced }: { reduced: boolean }) {
  return (
    <span className="inline-flex items-center gap-1.5 py-2" aria-label="Thinking">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: ACCENT }}
          animate={reduced ? { opacity: 0.8 } : { opacity: [0.25, 1, 0.25], y: [0, -3, 0] }}
          transition={
            reduced ? undefined : { duration: 0.9, repeat: Infinity, delay: i * 0.15 }
          }
        />
      ))}
    </span>
  );
}

function Avatar({ status, reduced }: { status: Status; reduced: boolean }) {
  const glow =
    status === 'thinking'
      ? reduced
        ? { opacity: 0.75 }
        : { opacity: [0.4, 0.9, 0.4] }
      : { opacity: status === 'speaking' ? 0.85 : 0.45 };

  return (
    <div className="relative mx-auto w-[210px] sm:w-[250px] md:w-full md:max-w-[340px]">
      {/* rim light behind the portrait — reacts to the assistant's state */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[42%] h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          filter: 'blur(48px)',
          background:
            'radial-gradient(circle at 50% 45%, rgba(0,0,255,0.6), rgba(139,92,246,0.3) 45%, transparent 72%)',
        }}
        animate={glow}
        transition={
          status === 'thinking' && !reduced
            ? { duration: 1.4, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.5 }
        }
      />

      <motion.div
        className="relative"
        animate={reduced ? undefined : { y: [0, -8, 0] }}
        transition={
          reduced ? undefined : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
        }
      >
        <motion.img
          src={PORTRAIT_URL}
          alt="Dela"
          draggable={false}
          className="w-full select-none"
          animate={{ scale: status === 'speaking' && !reduced ? 1.02 : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          style={{
            filter: 'drop-shadow(0 24px 36px rgba(0,0,0,0.55))',
            WebkitMaskImage: AVATAR_MASK,
            maskImage: AVATAR_MASK,
            WebkitMaskComposite: 'source-in',
            maskComposite: 'intersect',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
          }}
        />
      </motion.div>

      {/* status badge */}
      <div
        className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 backdrop-blur-md"
        style={{
          backgroundColor: 'rgba(12,12,12,0.7)',
          border: '1px solid rgba(255,255,255,0.14)',
        }}
      >
        <span className="relative flex h-2 w-2">
          {!reduced && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" />
          )}
          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">
          {ASSISTANT_NAME} · {status === 'thinking' ? 'Thinking' : 'Online'}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------ Section -------------------------------- */

export default function GetToKnowMe() {
  const reduced = useReducedMotion() ?? false;
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: '-15%' });

  const [question, setQuestion] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [chips, setChips] = useState<string[]>(DEFAULT_SUGGESTIONS);
  const [status, setStatus] = useState<Status>('idle');
  const [input, setInput] = useState('');
  const thinkTimer = useRef<number | null>(null);

  // One typewriter drives the bubble: the greeting first, then each answer.
  const target = question === null ? GREETING : answer;
  const typed = useTypewriter(target, inView && status !== 'thinking', reduced);
  const busy = status !== 'idle';

  useEffect(
    () => () => {
      if (thinkTimer.current !== null) window.clearTimeout(thinkTimer.current);
    },
    []
  );

  // Finished typing an answer → ready for the next question.
  useEffect(() => {
    if (status === 'speaking' && typed.done) setStatus('idle');
  }, [status, typed.done]);

  const ask = useCallback(
    (raw: string) => {
      const q = raw.trim().slice(0, MAX_CHARS);
      if (!q || busy) return;
      const reply = findAnswer(q);
      setQuestion(q);
      setInput('');
      setStatus('thinking');
      // A short "thinking" beat so replies feel considered, not instant.
      thinkTimer.current = window.setTimeout(
        () => {
          setAnswer(reply.text);
          setChips(reply.next);
          setStatus('speaking');
        },
        reduced ? 150 : 550 + Math.random() * 450
      );
    },
    [busy, reduced]
  );

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  const resetChat = () => {
    if (thinkTimer.current !== null) window.clearTimeout(thinkTimer.current);
    setQuestion(null);
    setAnswer('');
    setChips(DEFAULT_SUGGESTIONS);
    setStatus('idle');
  };

  return (
    <section
      id="about"
      ref={sectionRef}
      className="px-5 py-16 sm:px-8 sm:py-20 md:px-10"
      style={{ background: '#0C0C0C' }}
    >
      <div className="mx-auto w-full max-w-5xl">
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 110px)' }}
        >
          Get to Know Me
        </h2>
        <p className="mt-4 max-w-md text-sm font-light uppercase tracking-wide text-white/50">
          Chat with my assistant to learn more about me.
        </p>

        {/* Stage */}
        <div
          className="relative mt-10 overflow-hidden rounded-[28px] p-5 sm:mt-14 sm:p-8 md:p-10"
          style={{
            backgroundColor: 'rgba(255,255,255,0.035)',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}
        >
          <Bracket className="left-3 top-3 border-l border-t" />
          <Bracket className="right-3 top-3 border-r border-t" />
          <Bracket className="bottom-3 left-3 border-b border-l" />
          <Bracket className="bottom-3 right-3 border-b border-r" />

          {/* faint grid + glow backdrop */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                'radial-gradient(60% 55% at 28% 45%, rgba(0,0,255,0.12), transparent 70%), ' +
                'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), ' +
                'linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
              backgroundSize: '100% 100%, 44px 44px, 44px 44px',
            }}
          />

          <div className="relative flex flex-col gap-8 md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:items-center md:gap-12">
            <Avatar status={status} reduced={reduced} />

            {/* Speech bubble */}
            <div className="relative">
              <span
                aria-hidden
                className="absolute -top-[9px] left-1/2 h-4 w-4 -translate-x-1/2 rotate-45 border-l border-t md:-left-[9px] md:top-1/2 md:translate-x-0 md:-translate-y-1/2 md:border-t-0 md:border-b"
                style={{ backgroundColor: '#0E0F1C', borderColor: 'rgba(0,0,255,0.6)' }}
              />
              <div
                className="relative rounded-3xl p-5 sm:p-6"
                style={{
                  backgroundColor: '#0E0F1C',
                  border: '1px solid rgba(0,0,255,0.6)',
                  boxShadow: '0 0 44px rgba(0,0,255,0.16)',
                }}
              >
                <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-[6px] w-[6px] rotate-45"
                      style={{ backgroundColor: ACCENT }}
                    />
                    <span className="text-[11px] font-bold uppercase tracking-[0.3em] text-white">
                      {ASSISTANT_NAME}
                    </span>
                  </div>
                  {question !== null && !busy && (
                    <button
                      type="button"
                      onClick={resetChat}
                      className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-white/40 transition-colors hover:text-white"
                    >
                      <RotateCcw size={12} /> New chat
                    </button>
                  )}
                </div>

                <AnimatePresence mode="wait">
                  {question && (
                    <motion.p
                      key={question}
                      className="mb-2 line-clamp-2 text-xs font-medium uppercase tracking-wider text-white/40"
                      initial={reduced ? false : { opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                    >
                      You asked: “{question}”
                    </motion.p>
                  )}
                </AnimatePresence>

                <div
                  aria-live="polite"
                  onClick={() => !typed.done && typed.skip()}
                  className={`max-h-[15rem] min-h-[6.5rem] overflow-y-auto pr-1 sm:min-h-[7.5rem] ${
                    typed.done ? '' : 'cursor-pointer'
                  }`}
                >
                  {status === 'thinking' ? (
                    <ThinkingDots reduced={reduced} />
                  ) : (
                    <p
                      className="whitespace-pre-line font-medium leading-relaxed text-white"
                      style={{ fontSize: 'clamp(1rem, 1.6vw, 1.25rem)' }}
                    >
                      {typed.out}
                      {!typed.done && (
                        <span
                          className="ml-0.5 inline-block animate-pulse"
                          style={{ color: ACCENT }}
                        >
                          ▍
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick questions + input */}
          <div className="relative mt-8 md:mt-10">
            <div className="flex flex-wrap gap-2">
              {chips.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={busy}
                  onClick={() => ask(s)}
                  className="rounded-full border border-white/10 bg-white/[0.03] px-3.5 py-2 text-xs font-medium text-[#D7E2EA] transition-colors duration-200 hover:border-[color:var(--accent)] hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:opacity-40 sm:text-sm"
                  style={{ ['--accent' as string]: ACCENT }}
                >
                  {s}
                </button>
              ))}
            </div>

            <form
              onSubmit={onSubmit}
              className="mt-4 flex items-center gap-2 rounded-full p-1.5 pl-5 transition-colors focus-within:border-[color:var(--accent)]"
              style={{
                ['--accent' as string]: ACCENT,
                backgroundColor: 'rgba(0,0,0,0.45)',
                border: '1px solid rgba(255,255,255,0.14)',
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={MAX_CHARS}
                placeholder="Ask anything about Dela"
                aria-label="Ask anything about Dela"
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-white/35 sm:text-base"
              />
              <button
                type="submit"
                disabled={busy || !input.trim()}
                className="inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:px-6 sm:text-sm"
                style={{ backgroundColor: ACCENT }}
              >
                <Send size={15} />
                <span className="hidden sm:inline">Send</span>
              </button>
            </form>

            <p className="mt-3 text-center text-[10px] uppercase tracking-widest text-white/30">
              Quick answers from my portfolio. For anything else, reach out in Let&apos;s Cook.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
