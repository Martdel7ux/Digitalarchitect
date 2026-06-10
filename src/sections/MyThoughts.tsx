import { useState, useEffect, useCallback } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { ArrowRight, RotateCcw, X, Share2, Download } from 'lucide-react';

/* ========================================================================
   EDIT YOUR ARTICLES HERE.
   `body` is an array of paragraphs shown in the reader when a card is opened.
   These are first drafts — rewrite them in your own voice.
   ======================================================================== */

type Thought = {
  id: string;
  topic: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  body: string[];
};

const THOUGHTS: Thought[] = [
  {
    id: 't1',
    topic: 'AI',
    title: 'Will AI replace developers, or rewrite the job?',
    excerpt:
      'The fear is replacement. The reality is leverage. What changes when typing code stops being the bottleneck.',
    date: 'Jun 2026',
    readTime: '3 min',
    image: '/thought-1.png',
    body: [
      'Every few months, someone announces the end of the developer. The demos are impressive: describe an app in a sentence, watch it appear. It is easy to look at that and assume the profession has an expiry date.',
      'But that reading confuses the tool with the job. Writing code was never the point. It was always the expensive, slow step between an idea and a working product. If something makes that step cheaper, it does not delete the work, it moves it.',
      'AI is genuinely good at the things that used to eat our days: boilerplate, syntax, translating a known pattern into a new file. It is far weaker at the things that actually decide whether software is good, knowing what to build, what to leave out, and why a particular trade-off matters for this specific business.',
      'So the job rewrites itself. Less time spent typing, more time spent deciding. The developer moves closer to an architect and an editor, someone who sets direction, reviews what the machine produces, and takes responsibility for the result.',
      'The people who struggle will be the ones who only ever sold their typing speed. The people who thrive will be the ones who understood the problem better than anyone else in the room, because that judgment is exactly what AI cannot hand you.',
      'Replacement is the lazy headline. Leverage is the real story. The same hour of work now reaches further than it ever has, and that has always been good news for people who actually like building things.',
    ],
  },
  {
    id: 't2',
    topic: 'Design',
    title: 'The blank canvas is dead. Long live the prompt.',
    excerpt:
      'When anyone can generate a layout in seconds, taste and intent become the real differentiators.',
    date: 'May 2026',
    readTime: '3 min',
    image: '/thought-2.png',
    body: [
      'For a long time, the blank canvas was sacred and a little terrifying. A new file, an empty artboard, a cursor blinking on line one. Half the craft was simply having the nerve and the skill to make the first mark.',
      'That friction is mostly gone. Today you can describe a layout, a logo, a whole colour world in a sentence and get ten versions back before your coffee is cold. The cost of producing something has collapsed.',
      'When production becomes free, it stops being the differentiator. If everyone can generate a competent design in seconds, then competence is no longer the prize. What is left is intent: knowing which of the ten versions is actually right, and why.',
      'This is good news for designers who think, and uncomfortable for designers who only execute. The valuable question shifts from can you make this, to should it exist, who is it for, and what feeling should it leave behind.',
      'The prompt did not kill design. It killed the excuse that the hard part was the blank canvas. The hard part was always taste and judgment, and now there is nowhere left to hide from it.',
    ],
  },
  {
    id: 't3',
    topic: 'Tech',
    title: 'Why every business will need a digital architect',
    excerpt:
      'Tools are getting cheaper and more powerful. The scarce skill is knowing what to build and why.',
    date: 'May 2026',
    readTime: '3 min',
    image: '/thought-3.png',
    body: [
      'Software has never been cheaper to make. Tools are powerful, templates are everywhere, and a small team can ship in weeks what used to take a year. You would think this makes everything easier.',
      'In practice it creates a new problem: paralysis by abundance. When you can build almost anything, the hard question is no longer how, it is what. Which thing actually moves the business, and which is just expensive noise.',
      'That gap is where most projects quietly fail. Not because the code was bad, but because nobody asked whether the thing should have been built that way, or at all. Effort gets spent in the wrong direction, very efficiently.',
      'This is the role I think of as a digital architect. Someone who sits between the business and the technology, understands both languages, and translates a real goal into the right system, not just a working one.',
      'As building gets easier, deciding what to build gets more valuable, not less. Every business will need someone who can hold the whole picture and point the tools at the right target. That is the work I care about most.',
    ],
  },
  {
    id: 't4',
    topic: 'AI',
    title: 'Taste is the last moat',
    excerpt:
      'As generation becomes a commodity, judgment is what is left. A short note on building things people feel.',
    date: 'Apr 2026',
    readTime: '2 min',
    image: '/thought-4.png',
    body: [
      'When a capability becomes available to everyone, it stops being an advantage. We are watching that happen with generation right now. Anyone can produce text, images, code, and design at volume, almost for free.',
      'So what is left when the output is a commodity? Judgment. The ability to look at a hundred options and know which one is right. Taste is simply judgment applied consistently, and it does not come out of a model.',
      'Taste sounds soft, but it is built like anything else, by paying attention. By noticing why one layout feels effortless and another feels heavy. By caring about the small decisions long after most people would have called it good enough.',
      'That caring is hard to automate because it is personal. It comes from what you have seen, what you have made, and what you refuse to ship. A machine can generate a thousand variations; it cannot tell you which one you should be proud of.',
      'As generation gets cheaper, taste gets rarer and more valuable. It is the last moat, and the good news is that it is one you can keep widening for the rest of your life.',
    ],
  },
];

const ACCENT = '#0000FF';

/* ------------------------------ HUD bracket ----------------------------- */

function Bracket({ className }: { className: string }) {
  return (
    <span
      aria-hidden
      className={`pointer-events-none absolute z-10 h-4 w-4 ${className}`}
      style={{ borderColor: ACCENT, borderWidth: 1.5 }}
    />
  );
}

function TopicChip({ topic }: { topic: string }) {
  return (
    <span
      className="rounded-full bg-black/40 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white backdrop-blur-md"
      style={{ border: `1px solid ${ACCENT}` }}
    >
      {topic}
    </span>
  );
}

/* --------------------- Story image (canvas) ---------------------------- */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCover(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement,
  dx: number,
  dy: number,
  dw: number,
  dh: number
) {
  const ir = img.width / img.height;
  const dr = dw / dh;
  let sx = 0;
  let sy = 0;
  let sw = img.width;
  let sh = img.height;
  if (ir > dr) {
    sw = img.height * dr;
    sx = (img.width - sw) / 2;
  } else {
    sh = img.width / dr;
    sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxW: number
): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// Renders a 1080x1920 (9:16) story graphic for the given article.
async function renderStoryImage(card: Thought): Promise<Blob> {
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no 2d context');

  ctx.fillStyle = '#0C0C0C';
  ctx.fillRect(0, 0, W, H);

  // Cover image
  const img = await loadImage(card.image);
  const IMG_H = 1180;
  drawCover(ctx, img, 0, 0, W, IMG_H);
  const grad = ctx.createLinearGradient(0, IMG_H - 460, 0, IMG_H);
  grad.addColorStop(0, 'rgba(12,12,12,0)');
  grad.addColorStop(1, 'rgba(12,12,12,1)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, IMG_H - 460, W, 460);

  try {
    await document.fonts.ready;
  } catch {
    /* ignore */
  }

  const M = 80;
  let y = IMG_H + 30;

  // Topic chip
  ctx.font = '700 32px Kanit, sans-serif';
  const chipText = card.topic.toUpperCase();
  const chipW = ctx.measureText(chipText).width + 60;
  const chipH = 64;
  ctx.strokeStyle = ACCENT;
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  const r = chipH / 2;
  ctx.moveTo(M + r, y);
  ctx.arcTo(M + chipW, y, M + chipW, y + chipH, r);
  ctx.arcTo(M + chipW, y + chipH, M, y + chipH, r);
  ctx.arcTo(M, y + chipH, M, y, r);
  ctx.arcTo(M, y, M + chipW, y, r);
  ctx.closePath();
  ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.textBaseline = 'middle';
  ctx.fillText(chipText, M + 30, y + chipH / 2 + 2);
  y += chipH + 56;

  // Title (wrapped)
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#fff';
  ctx.font = '600 76px Kanit, sans-serif';
  const lines = wrapText(ctx, card.title.toUpperCase(), W - M * 2);
  const lineH = 86;
  for (const line of lines) {
    ctx.fillText(line, M, y + 64);
    y += lineH;
  }
  y += 26;

  // Meta
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '500 32px Kanit, sans-serif';
  ctx.fillText(
    `${card.date.toUpperCase()}  ·  ${card.readTime.toUpperCase()} READ`,
    M,
    y + 30
  );

  // Branding
  ctx.fillStyle = '#fff';
  ctx.font = '900 60px Kanit, sans-serif';
  ctx.fillText('DELA', M, H - 110);
  ctx.fillStyle = ACCENT;
  ctx.font = '600 32px Kanit, sans-serif';
  ctx.fillText('THE DIGITAL ARCHITECT', M, H - 66);

  // HUD corner brackets
  ctx.strokeStyle = ACCENT;
  ctx.lineWidth = 4;
  const b = 64;
  const off = 44;
  const corner = (cx: number, cy: number, dx: number, dy: number) => {
    ctx.beginPath();
    ctx.moveTo(cx + dx * b, cy);
    ctx.lineTo(cx, cy);
    ctx.lineTo(cx, cy + dy * b);
    ctx.stroke();
  };
  corner(off, off, 1, 1);
  corner(W - off, off, -1, 1);
  corner(off, H - off, 1, -1);
  corner(W - off, H - off, -1, -1);

  return new Promise<Blob>((resolve, reject) =>
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
      'image/png'
    )
  );
}

/* ------------------------------ Share modal ---------------------------- */

function ShareModal({
  card,
  onClose,
  reduced,
}: {
  card: Thought | null;
  onClose: () => void;
  reduced: boolean;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!card) {
      setUrl(null);
      setBlob(null);
      setError(false);
      return;
    }
    let active = true;
    let objUrl = '';
    setUrl(null);
    setBlob(null);
    setError(false);
    renderStoryImage(card)
      .then((b) => {
        if (!active) return;
        setBlob(b);
        objUrl = URL.createObjectURL(b);
        setUrl(objUrl);
      })
      .catch(() => active && setError(true));
    return () => {
      active = false;
      if (objUrl) URL.revokeObjectURL(objUrl);
    };
  }, [card]);

  useEffect(() => {
    if (!card) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [card, onClose]);

  const file =
    blob && card ? new File([blob], `${card.id}-story.png`, { type: 'image/png' }) : null;
  const nav = typeof navigator !== 'undefined' ? (navigator as any) : null;
  const canNativeShare = !!(
    nav &&
    nav.canShare &&
    file &&
    nav.canShare({ files: [file] })
  );

  const nativeShare = async () => {
    if (!file || !nav) return;
    try {
      await nav.share({ files: [file], title: card?.title });
    } catch {
      /* user cancelled */
    }
  };

  const download = () => {
    if (!url || !card) return;
    const a = document.createElement('a');
    a.href = url;
    a.download = `${card.id}-story.png`;
    a.click();
  };

  return (
    <AnimatePresence>
      {card && (
        <motion.div
          className="fixed inset-0 z-[130] flex items-center justify-center overflow-y-auto p-4"
          style={{
            backgroundColor: 'rgba(6,6,6,0.92)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="flex w-full max-w-sm flex-col items-center gap-5"
            onClick={(e) => e.stopPropagation()}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.25 }}
          >
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/50">
              Share to your story
            </span>

            {/* Preview */}
            <div
              className="relative w-full overflow-hidden rounded-2xl"
              style={{
                aspectRatio: '9 / 16',
                maxHeight: '60vh',
                border: `1px solid ${ACCENT}`,
                backgroundColor: '#0C0C0C',
              }}
            >
              {url ? (
                <img
                  src={url}
                  alt="Story preview"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-widest text-white/40">
                  {error ? 'Could not generate' : 'Generating…'}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex w-full flex-col gap-3">
              {canNativeShare && (
                <button
                  type="button"
                  onClick={nativeShare}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold uppercase tracking-widest text-white"
                  style={{ backgroundColor: ACCENT }}
                >
                  <Share2 size={17} /> Share
                </button>
              )}
              <button
                type="button"
                onClick={download}
                disabled={!url}
                className="inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white/5 disabled:opacity-40"
                style={{ borderColor: 'rgba(255,255,255,0.25)' }}
              >
                <Download size={17} /> Download image
              </button>
              <p className="text-center text-[11px] leading-relaxed text-white/40">
                {canNativeShare
                  ? 'Pick Instagram or WhatsApp from the share menu to post it to your story or status.'
                  : 'Download the image, then add it to your Instagram story or WhatsApp status.'}
              </p>
            </div>
          </motion.div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="fixed right-4 top-4 grid h-11 w-11 place-items-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/80"
            style={{ border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <X size={20} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------ Card ----------------------------------- */

function ThoughtCard({
  card,
  index,
  isFront,
  reduced,
  exitDir,
  onDismiss,
  onRead,
  onShare,
}: {
  card: Thought;
  index: number;
  isFront: boolean;
  reduced: boolean;
  exitDir: number;
  onDismiss: (id: string, dir: number) => void;
  onRead: (card: Thought) => void;
  onShare: (card: Thought) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-12, 12]);

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        x: isFront ? x : 0,
        rotate: isFront ? rotate : 0,
        zIndex: 30 - index,
        pointerEvents: isFront ? 'auto' : 'none',
      }}
      initial={false}
      animate={{
        y: index * 16,
        scale: 1 - index * 0.05,
        opacity: index < 3 ? 1 : 0,
      }}
      exit={
        reduced
          ? { opacity: 0 }
          : {
              x: exitDir * 600,
              rotate: exitDir * 18,
              opacity: 0,
              transition: { duration: 0.35 },
            }
      }
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      drag={isFront && !reduced ? 'x' : false}
      dragSnapToOrigin
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.5}
      onDragEnd={(_, info) => {
        if (info.offset.x > 120 || info.velocity.x > 600) onDismiss(card.id, 1);
        else if (info.offset.x < -120 || info.velocity.x < -600)
          onDismiss(card.id, -1);
      }}
    >
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-3xl backdrop-blur-xl"
        style={{
          backgroundColor: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.14)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
          cursor: isFront && !reduced ? 'grab' : 'default',
        }}
      >
        <Bracket className="left-3 top-3 border-l border-t" />
        <Bracket className="right-3 top-3 border-r border-t" />
        <Bracket className="bottom-3 left-3 border-b border-l" />
        <Bracket className="bottom-3 right-3 border-b border-r" />

        {/* Image banner */}
        <div className="relative h-[42%] w-full overflow-hidden">
          <img
            src={card.image}
            alt={card.title}
            draggable={false}
            className="h-full w-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, transparent 55%, rgba(12,12,12,0.85) 100%)',
            }}
          />
          <div className="absolute left-4 top-4">
            <TopicChip topic={card.topic} />
          </div>
          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onShare(card)}
            aria-label="Share to story"
            className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-black/70"
            style={{ border: `1px solid ${ACCENT}` }}
          >
            <Share2 size={15} />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col justify-between p-6 sm:p-7">
          <div>
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
              {card.date} · {card.readTime}
            </span>
            <h3
              className="mt-3 font-medium uppercase leading-tight tracking-tight text-white"
              style={{ fontSize: 'clamp(1.25rem, 2.6vw, 1.9rem)' }}
            >
              {card.title}
            </h3>
            <p className="mt-3 line-clamp-2 text-sm font-light leading-relaxed text-white/55">
              {card.excerpt}
            </p>
          </div>

          <button
            type="button"
            onPointerDown={(e) => e.stopPropagation()}
            onClick={() => onRead(card)}
            className="group mt-5 inline-flex w-fit items-center gap-2 text-sm font-semibold uppercase tracking-widest transition-colors"
            style={{ color: ACCENT }}
          >
            Read full
            <ArrowRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------ Reader --------------------------------- */

function Reader({
  card,
  onClose,
  onShare,
  reduced,
}: {
  card: Thought | null;
  onClose: () => void;
  onShare: (card: Thought) => void;
  reduced: boolean;
}) {
  useEffect(() => {
    if (!card) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [card, onClose]);

  return (
    <AnimatePresence>
      {card && (
        <motion.div
          className="fixed inset-0 z-[110] overflow-y-auto"
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
          <motion.article
            className="mx-auto my-8 w-[92%] max-w-2xl overflow-hidden rounded-3xl sm:my-12"
            style={{
              backgroundColor: 'rgba(18,18,18,0.95)',
              border: '1px solid rgba(255,255,255,0.12)',
              boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
            }}
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-56 w-full overflow-hidden sm:h-72">
              <img
                src={card.image}
                alt={card.title}
                className="h-full w-full object-cover"
                draggable={false}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to bottom, transparent 40%, rgba(18,18,18,1) 100%)',
                }}
              />
              <div className="absolute left-5 top-5">
                <TopicChip topic={card.topic} />
              </div>
            </div>

            <div className="px-6 pb-10 pt-2 sm:px-10">
              <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/40">
                {card.date} · {card.readTime} read
              </span>
              <h1
                className="mt-3 font-medium uppercase leading-tight tracking-tight text-white"
                style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)' }}
              >
                {card.title}
              </h1>
              <div className="mt-6 flex flex-col gap-5">
                {card.body.map((para, i) => (
                  <p
                    key={i}
                    className="text-base font-light leading-relaxed text-white/70 sm:text-lg"
                  >
                    {para}
                  </p>
                ))}
              </div>

              <button
                type="button"
                onClick={() => onShare(card)}
                className="mt-8 inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white/5"
                style={{ borderColor: ACCENT }}
              >
                <Share2 size={16} /> Share to story
              </button>
            </div>
          </motion.article>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close article"
            className="fixed right-4 top-4 z-[120] grid h-11 w-11 place-items-center rounded-full bg-black/50 text-white backdrop-blur-md transition-colors hover:bg-black/80"
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

export default function MyThoughts() {
  const reduced = useReducedMotion() ?? false;
  const [deck, setDeck] = useState<Thought[]>(THOUGHTS);
  const [exitDir, setExitDir] = useState(-1);
  const [reader, setReader] = useState<Thought | null>(null);
  const [share, setShare] = useState<Thought | null>(null);
  const total = THOUGHTS.length;

  const dismiss = useCallback((id: string, dir: number) => {
    setExitDir(dir);
    setDeck((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const next = useCallback(() => {
    if (deck.length > 0) dismiss(deck[0].id, -1);
  }, [deck, dismiss]);

  const restart = useCallback(() => setDeck(THOUGHTS), []);

  // Keyboard: → / space advances the deck (but not while reading).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (reader) return;
      if (e.key === 'ArrowRight' || e.key === ' ') {
        if (deck.length > 0) {
          e.preventDefault();
          next();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [deck.length, next, reader]);

  const current = total - deck.length + 1;

  return (
    <section
      id="thoughts"
      className="flex flex-col items-center px-5 py-16 sm:px-8 sm:py-20 md:px-10"
      style={{ background: '#0C0C0C' }}
    >
      <div className="w-full max-w-xl">
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 110px)' }}
        >
          My Thoughts
        </h2>
        <p className="mt-4 text-sm font-light uppercase tracking-wide text-white/50">
          Notes on technology, AI &amp; building.
        </p>

        {/* Deck */}
        <div className="relative mx-auto mt-10 h-[480px] w-full sm:h-[500px]">
          <AnimatePresence>
            {deck.length > 0 ? (
              deck.map((card, i) =>
                i > 2 ? null : (
                  <ThoughtCard
                    key={card.id}
                    card={card}
                    index={i}
                    isFront={i === 0}
                    reduced={reduced}
                    exitDir={exitDir}
                    onDismiss={dismiss}
                    onRead={setReader}
                    onShare={setShare}
                  />
                )
              )
            ) : (
              <motion.div
                key="end"
                className="absolute inset-0 flex flex-col items-center justify-center gap-5 rounded-3xl text-center backdrop-blur-xl"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <p className="text-lg font-medium uppercase tracking-wide text-white">
                  That&apos;s all for now.
                </p>
                <button
                  type="button"
                  onClick={restart}
                  className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white transition-colors hover:bg-white/5"
                  style={{ borderColor: ACCENT }}
                >
                  <RotateCcw size={15} /> Restart
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-8 flex items-center justify-between">
          <span className="font-mono text-xs tracking-widest text-white/40">
            {deck.length > 0
              ? `${String(current).padStart(2, '0')} / ${String(total).padStart(2, '0')}`
              : `${String(total).padStart(2, '0')} / ${String(total).padStart(2, '0')}`}
          </span>

          <div className="flex items-center gap-3">
            {!reduced && deck.length > 0 && (
              <span className="hidden text-[11px] uppercase tracking-widest text-white/30 sm:block">
                Swipe or press →
              </span>
            )}
            <button
              type="button"
              onClick={deck.length > 0 ? next : restart}
              aria-label={deck.length > 0 ? 'Next thought' : 'Restart deck'}
              className="grid h-12 w-12 place-items-center rounded-full text-white transition-colors hover:bg-white/10"
              style={{ border: `1px solid ${ACCENT}` }}
            >
              {deck.length > 0 ? <ArrowRight size={20} /> : <RotateCcw size={18} />}
            </button>
          </div>
        </div>
      </div>

      <Reader
        card={reader}
        onClose={() => setReader(null)}
        onShare={setShare}
        reduced={reduced}
      />
      <ShareModal card={share} onClose={() => setShare(null)} reduced={reduced} />
    </section>
  );
}
