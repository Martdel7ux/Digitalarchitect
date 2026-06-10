import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

/* ========================================================================
   EDIT YOUR SKILLS HERE.
   Professional skills have a `level` (1-5, shown as pips).
   Technical skills are grouped into categories of tags.
   ======================================================================== */

type Skill = { name: string; level: number };
type TechCategory = { name: string; skills: string[] };

const PROFESSIONAL: Skill[] = [
  { name: 'Communication Skills', level: 5 },
  { name: 'Attention to detail and structured work approach', level: 5 },
  { name: 'Time management and ability to meet deadlines', level: 4 },
  {
    name: 'Clear and professional communication (technical & non-technical stakeholders)',
    level: 5,
  },
  {
    name: 'Leadership and initiative (project ownership & independent execution)',
    level: 4,
  },
  { name: 'Adaptability and continuous learning mindset', level: 5 },
];

const TECHNICAL: TechCategory[] = [
  { name: 'Backend & Programming', skills: ['C++', 'C#', '.NET'] },
  {
    name: 'Databases',
    skills: ['SQL', 'Microsoft Access', 'Oracle Cloud (Autonomous Database)'],
  },
  {
    name: 'Web Development',
    skills: ['HTML', 'CSS', 'JavaScript', 'WordPress'],
  },
  {
    name: 'Mobile App Development',
    skills: ['React Native', 'Android Studio'],
  },
  {
    name: 'Other',
    skills: [
      'API Integration',
      'REST APIs',
      'Basic SDLC Understanding',
      'Performance Optimization',
      'SEO Fundamentals',
    ],
  },
];

const ACCENT = '#0000FF';

/* ------------------------------ Node dot ------------------------------- */

function NodeDot() {
  return (
    <div className="flex justify-center">
      <motion.span
        className="block h-3.5 w-3.5 rounded-full"
        initial={{
          backgroundColor: 'rgba(255,255,255,0.18)',
          boxShadow: '0 0 0 rgba(0,0,255,0)',
        }}
        whileInView={{ backgroundColor: ACCENT, boxShadow: `0 0 14px ${ACCENT}` }}
        viewport={{ once: true, margin: '-6%' }}
        transition={{ duration: 0.4, delay: 0.1 }}
      />
    </div>
  );
}

/* -------------------------------- Pips --------------------------------- */

function Pips({ level, delay }: { level: number; delay: number }) {
  return (
    <div className="flex shrink-0 gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <motion.span
          key={n}
          className="h-1.5 w-1.5 rounded-full"
          initial={{ opacity: 0.25, backgroundColor: 'rgba(255,255,255,0.3)' }}
          whileInView={
            n <= level
              ? { opacity: 1, backgroundColor: ACCENT }
              : { opacity: 0.25, backgroundColor: 'rgba(255,255,255,0.18)' }
          }
          viewport={{ once: true }}
          transition={{ duration: 0.3, delay: delay + 0.15 + n * 0.05 }}
        />
      ))}
    </div>
  );
}

/* --------------------------- Professional node ------------------------- */

function SkillNode({ skill, delay }: { skill: Skill; delay: number }) {
  return (
    <motion.div
      className="grid grid-cols-[26px_1fr] items-center gap-4"
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-6%' }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <NodeDot />
      <div
        className="group flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors duration-200 hover:border-[color:var(--accent)] hover:bg-white/[0.06]"
        style={{ ['--accent' as string]: ACCENT }}
      >
        <span className="text-sm font-medium text-[#D7E2EA] transition-colors group-hover:text-white sm:text-base">
          {skill.name}
        </span>
        <Pips level={skill.level} delay={delay} />
      </div>
    </motion.div>
  );
}

/* ---------------------------- Technical node --------------------------- */

function TechCategoryNode({
  category,
  delay,
}: {
  category: TechCategory;
  delay: number;
}) {
  return (
    <motion.div
      className="grid grid-cols-[26px_1fr] items-start gap-4"
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-6%' }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div className="pt-3.5">
        <NodeDot />
      </div>
      <div
        className="group rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 transition-colors duration-200 hover:border-[color:var(--accent)] hover:bg-white/[0.06]"
        style={{ ['--accent' as string]: ACCENT }}
      >
        <h4
          className="text-[11px] font-bold uppercase tracking-[0.18em]"
          style={{ color: '#7E97FF' }}
        >
          {category.name}
        </h4>
        <div className="mt-2.5 flex flex-wrap gap-2">
          {category.skills.map((s) => (
            <span
              key={s}
              className="rounded-full border border-white/[0.12] bg-white/[0.04] px-2.5 py-1 text-[11px] font-medium text-[#D7E2EA]"
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------- Branch -------------------------------- */

function Branch({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="relative">
      {/* trunk line */}
      <div
        className="absolute bottom-3 left-[12px] top-11 w-px"
        style={{
          background:
            'linear-gradient(to bottom, rgba(0,0,255,0.5), rgba(255,255,255,0.06))',
        }}
      />

      <div className="flex flex-col gap-5">
        {/* root / category header */}
        <motion.div
          className="grid grid-cols-[26px_1fr] items-center gap-4"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-6%' }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center">
            <span
              className="block h-5 w-5 rounded-full"
              style={{ backgroundColor: ACCENT, boxShadow: `0 0 20px ${ACCENT}` }}
            />
          </div>
          <h3
            className="font-bold uppercase tracking-[0.2em] text-white"
            style={{ fontSize: 'clamp(0.95rem, 2vw, 1.25rem)' }}
          >
            {title}
          </h3>
        </motion.div>

        {children}
      </div>
    </div>
  );
}

/* ------------------------------ Section -------------------------------- */

export default function WhatIBring() {
  return (
    <section
      id="skills"
      className="px-5 py-16 sm:px-8 sm:py-20 md:px-10"
      style={{ background: '#0C0C0C' }}
    >
      <div className="mx-auto w-full max-w-5xl">
        <h2
          className="hero-heading font-black uppercase leading-[0.95] tracking-tight"
          style={{ fontSize: 'clamp(2.3rem, 7vw, 96px)' }}
        >
          What I Bring to the Table
        </h2>
        <p className="mt-4 max-w-md text-sm font-light uppercase tracking-wide text-white/50">
          The skills I&apos;ve levelled up, professional and technical.
        </p>

        <div className="mt-14 grid gap-12 md:grid-cols-2 md:gap-16">
          <Branch title="Professional">
            {PROFESSIONAL.map((s, i) => (
              <SkillNode key={s.name} skill={s} delay={i * 0.07} />
            ))}
          </Branch>
          <Branch title="Technical">
            {TECHNICAL.map((c, i) => (
              <TechCategoryNode key={c.name} category={c} delay={i * 0.07} />
            ))}
          </Branch>
        </div>
      </div>
    </section>
  );
}
