import { useState, useEffect, useRef, Fragment } from 'react';
import { motion, AnimatePresence, useReducedMotion, useInView } from 'framer-motion';
import { Send, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

/* ========================================================================
   INTEGRATIONS — fill these in.

   1) CALENDLY_URL: your scheduling link, e.g.
      'https://calendly.com/yourname/discovery-call'

   2) Google Form: create a Form with Name / Email / Service / Summary fields,
      then open its prefilled-link tool (or "Get pre-filled link") to read the
      entry IDs. Put the formResponse URL + entry IDs below.
      GOOGLE_FORM_ACTION example:
      'https://docs.google.com/forms/d/e/FORM_ID/formResponse'
   ======================================================================== */

const CALENDLY_URL = 'https://calendly.com/martinahoto4/30min';
const GOOGLE_FORM_ACTION =
  'https://docs.google.com/forms/d/e/1FAIpQLSfCW-94xlBYOIre0yiVh9HWwGcPtfjJDXR04lVzaP02lYVlWQ/formResponse';
const GOOGLE_FORM_ENTRIES = {
  name: 'entry.785570178',
  email: 'entry.1005726310',
  service: 'entry.693360791',
  summary: 'entry.1344761999',
};

const ACCENT = '#0000FF';
const PORTRAIT_URL = '/dela-portrait.png';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Must match the Google Form's multiple-choice options exactly.
const SERVICES = [
  'Website Design/Development',
  'Mobile App Development',
  'Software Development',
];

type Answers = { name: string; email: string; service: string; summary: string };

type Question = {
  key: keyof Answers;
  type: 'text' | 'email' | 'choice' | 'textarea';
  prompt: (a: Answers) => string;
  placeholder?: string;
};

const QUESTIONS: Question[] = [
  {
    key: 'name',
    type: 'text',
    prompt: () => "Hey, glad you stopped by. What should I call you?",
    placeholder: 'Your name',
  },
  {
    key: 'email',
    type: 'email',
    prompt: (a) =>
      `Nice to meet you, ${a.name.split(' ')[0] || 'there'}! What's the best email to reach you?`,
    placeholder: 'you@email.com',
  },
  {
    key: 'service',
    type: 'choice',
    prompt: () => 'What are we cooking up together?',
  },
  {
    key: 'summary',
    type: 'textarea',
    prompt: () =>
      'Tell me a bit about it — what are you trying to build, and what does success look like?',
    placeholder: 'A short summary of your project…',
  },
];

const SUBMITTING = QUESTIONS.length; // host is "cooking"
const BOOKING = QUESTIONS.length + 1; // show Calendly

function celebrate() {
  const colors = ['#0000FF', '#4D6BFF', '#FFFFFF', '#A78BFA', '#D7E2EA'];
  confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 }, colors });
  confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors });
  confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors });
}

async function submitToGoogleForm(a: Answers) {
  if (!GOOGLE_FORM_ACTION) return;
  const fd = new FormData();
  fd.append(GOOGLE_FORM_ENTRIES.name, a.name);
  fd.append(GOOGLE_FORM_ENTRIES.email, a.email);
  fd.append(GOOGLE_FORM_ENTRIES.service, a.service);
  fd.append(GOOGLE_FORM_ENTRIES.summary, a.summary);
  try {
    await fetch(GOOGLE_FORM_ACTION, { method: 'POST', mode: 'no-cors', body: fd });
  } catch {
    /* opaque response — submission still registers */
  }
}

/* ------------------------------ Typewriter ----------------------------- */

function TypedText({
  text,
  reduced,
  run = true,
  onDone,
}: {
  text: string;
  reduced: boolean;
  run?: boolean;
  onDone?: () => void;
}) {
  const [out, setOut] = useState('');
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    if (!run) {
      setOut('');
      return;
    }
    if (reduced) {
      setOut(text);
      doneRef.current?.();
      return;
    }
    setOut('');
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
        doneRef.current?.();
      }
    }, 18);
    return () => window.clearInterval(id);
  }, [text, reduced, run]);

  return <>{out}</>;
}

/* ------------------------------ Bubbles -------------------------------- */

function HostBubble({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex items-start gap-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className="mt-0.5 h-9 w-9 shrink-0 overflow-hidden rounded-full"
        style={{ border: `1.5px solid ${ACCENT}` }}
      >
        <img
          src={PORTRAIT_URL}
          alt="Dela"
          className="h-full w-full object-cover object-top"
          draggable={false}
        />
      </div>
      <div
        className="max-w-[80%] rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed text-white sm:text-base"
        style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}
      >
        {children}
      </div>
    </motion.div>
  );
}

function UserBubble({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="flex justify-end"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div
        className="max-w-[80%] rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed text-white sm:text-base"
        style={{ backgroundColor: 'rgba(0,0,255,0.22)', border: `1px solid ${ACCENT}` }}
      >
        {children}
      </div>
    </motion.div>
  );
}

/* ------------------------------ Calendly ------------------------------- */

function CalendlyEmbed({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!CALENDLY_URL || !ref.current) return;
    const el = ref.current;

    const url = new URL(CALENDLY_URL);
    if (name) url.searchParams.set('name', name);
    if (email) url.searchParams.set('email', email);
    url.searchParams.set('hide_gdpr_banner', '1');
    const fullUrl = url.toString();

    if (!document.querySelector('link[href*="calendly"]')) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://assets.calendly.com/assets/external/widget.css';
      document.head.appendChild(link);
    }

    const init = () => {
      const Cal = (window as any).Calendly;
      if (Cal && el) {
        el.innerHTML = '';
        Cal.initInlineWidget({ url: fullUrl, parentElement: el });
      }
    };

    if ((window as any).Calendly) {
      init();
    } else {
      const s = document.createElement('script');
      s.src = 'https://assets.calendly.com/assets/external/widget.js';
      s.async = true;
      s.onload = init;
      document.body.appendChild(s);
    }
  }, [name, email]);

  if (!CALENDLY_URL) {
    return (
      <div
        className="rounded-2xl p-5 text-center text-sm text-white/60"
        style={{ border: '1px dashed rgba(255,255,255,0.2)' }}
      >
        Booking link coming soon — I&apos;ll reach out by email to lock in a time.
      </div>
    );
  }

  return (
    <div
      ref={ref}
      className="overflow-hidden rounded-2xl"
      style={{ minWidth: 280, height: 660, border: `1px solid ${ACCENT}` }}
    />
  );
}

/* ------------------------------ Section -------------------------------- */

export default function LetsCook() {
  const reduced = useReducedMotion() ?? false;
  const [answers, setAnswers] = useState<Answers>({
    name: '',
    email: '',
    service: '',
    summary: '',
  });
  const [step, setStep] = useState(0);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [scheduled, setScheduled] = useState(false);
  const anchorRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  // Only start the conversation once the section is scrolled into view, so the
  // page never auto-jumps here (autofocus / scroll-into-view) on initial load.
  const started = useInView(sectionRef, { once: true, margin: '-25%' });
  const didMount = useRef(false);

  // Listen for Calendly's "booking confirmed" event.
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (
        e.origin === 'https://calendly.com' &&
        typeof e.data === 'object' &&
        e.data?.event === 'calendly.event_scheduled'
      ) {
        setScheduled(true);
        if (!reduced) celebrate();
      }
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [reduced]);

  // Reset typing-ready flag whenever a new question appears.
  useEffect(() => {
    setReady(false);
  }, [step]);

  // Keep the latest message in view — but never on the initial mount.
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    anchorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [step, ready, scheduled]);

  // Submit + celebrate when all questions are answered.
  useEffect(() => {
    if (step !== SUBMITTING) return;
    submitToGoogleForm(answers);
    if (!reduced) celebrate();
    const t = window.setTimeout(() => setStep(BOOKING), 1400);
    return () => window.clearTimeout(t);
  }, [step, answers, reduced]);

  const submitText = () => {
    const q = QUESTIONS[step];
    const val = input.trim();
    if (!val) {
      setError('This one is required.');
      return;
    }
    if (q.type === 'email' && !EMAIL_RE.test(val)) {
      setError('That email looks off — mind checking it?');
      return;
    }
    setError('');
    setAnswers((a) => ({ ...a, [q.key]: val }));
    setInput('');
    setStep((s) => s + 1);
  };

  const selectChoice = (value: string) => {
    setAnswers((a) => ({ ...a, service: value }));
    setStep((s) => s + 1);
  };

  const progress = Math.min(step, QUESTIONS.length) / QUESTIONS.length;
  const firstName = answers.name.split(' ')[0] || 'there';

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="flex min-h-screen flex-col justify-center px-5 py-24 sm:px-8 md:px-10"
      style={{ background: '#0C0C0C' }}
    >
      <div className="mx-auto w-full max-w-2xl">
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 110px)' }}
        >
          Let&apos;s Cook
        </h2>
        <p className="mt-4 text-sm font-light uppercase tracking-wide text-white/50">
          Tell me what you&apos;re building and book a discovery call.
        </p>

        {/* Chat card */}
        <div
          className="mt-10 overflow-hidden rounded-3xl backdrop-blur-xl"
          style={{
            backgroundColor: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          {/* progress */}
          <div className="h-1 w-full bg-white/10">
            <motion.div
              className="h-full origin-left"
              style={{ backgroundColor: ACCENT }}
              animate={{ scaleX: progress }}
              initial={{ scaleX: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            />
          </div>

          <div className="flex flex-col gap-5 p-5 sm:p-7">
            {QUESTIONS.map((q, i) => {
              if (i > step) return null;
              const promptText = q.prompt(answers);
              const isCurrent = i === step;
              const answered = i < step;
              return (
                <Fragment key={q.key}>
                  <HostBubble>
                    {isCurrent ? (
                      <TypedText
                        text={promptText}
                        reduced={reduced}
                        run={i > 0 || started}
                        onDone={() => setReady(true)}
                      />
                    ) : (
                      promptText
                    )}
                  </HostBubble>

                  {answered && <UserBubble>{answers[q.key]}</UserBubble>}

                  {isCurrent && ready && (
                    <div className="pl-12">
                      {q.type === 'choice' ? (
                        <div className="flex flex-wrap gap-2.5">
                          {SERVICES.map((opt) => (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => selectChoice(opt)}
                              className="rounded-full border px-4 py-2.5 text-left text-sm font-medium text-[#D7E2EA] transition-colors hover:bg-white/5 hover:text-white"
                              style={{ borderColor: 'rgba(255,255,255,0.2)' }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.borderColor = ACCENT)
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.borderColor =
                                  'rgba(255,255,255,0.2)')
                              }
                            >
                              {opt}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="flex flex-col gap-2">
                          <div className="flex items-end gap-2">
                            {q.type === 'textarea' ? (
                              <textarea
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder={q.placeholder}
                                rows={3}
                                autoFocus
                                className="flex-1 resize-none rounded-2xl bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:bg-white/[0.07] sm:text-base"
                                style={{ border: '1px solid rgba(255,255,255,0.14)' }}
                              />
                            ) : (
                              <input
                                type={q.type}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && submitText()}
                                placeholder={q.placeholder}
                                autoFocus
                                className="flex-1 rounded-full bg-white/[0.04] px-4 py-3 text-sm text-white outline-none placeholder:text-white/30 focus:bg-white/[0.07] sm:text-base"
                                style={{ border: '1px solid rgba(255,255,255,0.14)' }}
                              />
                            )}
                            <button
                              type="button"
                              onClick={submitText}
                              aria-label="Send"
                              className="grid h-12 w-12 shrink-0 place-items-center rounded-full text-white transition-transform hover:scale-105"
                              style={{ backgroundColor: ACCENT }}
                            >
                              <Send size={18} />
                            </button>
                          </div>
                          {error && (
                            <span className="pl-1 text-xs text-red-400">{error}</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </Fragment>
              );
            })}

            {/* Submitting */}
            {step === SUBMITTING && (
              <HostBubble>
                <TypedText
                  text="Perfect — firing up the stove… 🔥"
                  reduced={reduced}
                />
              </HostBubble>
            )}

            {/* Booking */}
            {step === BOOKING && (
              <AnimatePresence>
                <motion.div
                  className="flex flex-col gap-5"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <HostBubble>
                    All set, {firstName}! Grab a time that works for your discovery
                    call below — can&apos;t wait to dig in. 🍳
                  </HostBubble>
                  {!scheduled && (
                    <CalendlyEmbed name={answers.name} email={answers.email} />
                  )}

                  {scheduled && (
                    <motion.div
                      className="flex flex-col items-center gap-4 rounded-2xl p-7 text-center"
                      style={{
                        backgroundColor: 'rgba(0,0,255,0.08)',
                        border: `1px solid ${ACCENT}`,
                      }}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 22 }}
                    >
                      <CheckCircle2 size={44} style={{ color: ACCENT }} />
                      <p
                        className="font-medium uppercase tracking-tight text-white"
                        style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)' }}
                      >
                        You&apos;re booked, {firstName}! 🎉
                      </p>
                      <p className="max-w-md text-sm font-light leading-relaxed text-white/70 sm:text-base">
                        I&apos;ll be in touch by email with the details. Looking
                        forward to working on this amazing project together.
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}

            <div ref={anchorRef} />
          </div>
        </div>
      </div>
    </section>
  );
}
