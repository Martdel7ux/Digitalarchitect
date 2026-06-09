import FadeIn from '../components/FadeIn';
import AvatarMenu from '../components/AvatarMenu';
import CircleMenu from '../components/CircleMenu';

const PORTRAIT_URL = '/dela-portrait.png';

export default function HeroSection() {
  return (
    <section
      className="relative flex h-screen flex-col"
      style={{ overflowX: 'clip' }}
    >
      {/* Navbar — circular menu that expands into a glassy nav bar on hover */}
      <FadeIn
        delay={0}
        y={-20}
        className="relative z-40 flex justify-center px-6 pt-6 md:px-10 md:pt-8"
      >
        <CircleMenu />
      </FadeIn>

      {/* Hero Heading */}
      <div className="overflow-hidden">
        <FadeIn
          as="h1"
          delay={0.15}
          y={40}
          className="hero-heading mt-6 w-full whitespace-nowrap text-center font-black uppercase leading-none tracking-tight text-[14vw] sm:mt-4 sm:text-[15vw] md:-mt-5 md:text-[16vw] lg:text-[17.5vw]"
        >
          Hi, i&apos;m Dela
        </FadeIn>
      </div>

      {/* Hero Portrait with interactive service menu */}
      <div className="absolute left-1/2 top-1/2 z-10 w-[280px] -translate-x-1/2 -translate-y-1/2 sm:bottom-0 sm:top-auto sm:translate-y-0 sm:w-[360px] md:w-[440px] lg:w-[520px]">
        <FadeIn delay={0.6} y={30}>
          <AvatarMenu src={PORTRAIT_URL} />
        </FadeIn>
      </div>

      {/* Bottom bar */}
      <div className="mt-auto flex items-end justify-between px-6 pb-7 md:px-10 sm:pb-8 md:pb-10">
        <FadeIn
          as="p"
          delay={0.35}
          y={20}
          className="max-w-[160px] font-light uppercase leading-snug tracking-wide text-[#D7E2EA] sm:max-w-[220px] md:max-w-[260px]"
          style={{ fontSize: 'clamp(0.75rem, 1.4vw, 1.5rem)' }}
        >
          a digital architect crafting creative web &amp; mobile experiences.
        </FadeIn>
      </div>
    </section>
  );
}
