import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import LiveProjectButton from '../components/LiveProjectButton';

export type Project = {
  number: string;
  name: string;
  category: string;
  col1: [string, string];
  col2: string;
};

type ProjectCardProps = {
  project: Project;
  index: number;
  totalCards: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  range: [number, number];
  targetScale: number;
};

const cardRadius =
  'rounded-[40px] sm:rounded-[50px] md:rounded-[60px]';

export default function ProjectCard({
  project,
  index,
  progress,
  range,
  targetScale,
}: ProjectCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={containerRef}
      className="sticky top-24 flex h-[85vh] items-start justify-center md:top-32"
    >
      <motion.div
        style={{
          scale,
          top: `${index * 28}px`,
          background: '#0C0C0C',
        }}
        className={`relative w-full origin-top border-2 border-[#D7E2EA] p-4 sm:p-6 md:p-8 ${cardRadius}`}
      >
        {/* Top row */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
            <span
              className="font-black leading-none text-[#D7E2EA]"
              style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
            >
              {project.number}
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-xs font-light uppercase tracking-widest text-[#D7E2EA]/60 sm:text-sm">
                {project.category}
              </span>
              <span
                className="font-medium uppercase text-[#D7E2EA]"
                style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
              >
                {project.name}
              </span>
            </div>
          </div>
          <LiveProjectButton />
        </div>

        {/* Bottom row — image grid */}
        <div className="mt-6 flex gap-3 sm:gap-4 md:gap-5">
          {/* Left column 40% */}
          <div className="flex w-2/5 flex-col gap-3 sm:gap-4 md:gap-5">
            <img
              src={project.col1[0]}
              alt={`${project.name} 1`}
              loading="lazy"
              className={`w-full object-cover ${cardRadius}`}
              style={{ height: 'clamp(130px, 16vw, 230px)' }}
            />
            <img
              src={project.col1[1]}
              alt={`${project.name} 2`}
              loading="lazy"
              className={`w-full object-cover ${cardRadius}`}
              style={{ height: 'clamp(160px, 22vw, 340px)' }}
            />
          </div>
          {/* Right column 60% */}
          <div className="w-3/5">
            <img
              src={project.col2}
              alt={`${project.name} 3`}
              loading="lazy"
              className={`h-full w-full object-cover ${cardRadius}`}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
