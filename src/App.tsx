import { useEffect } from 'react';
import HeroSection from './sections/HeroSection';
import GetToKnowMe from './sections/GetToKnowMe';
import HowIWork from './sections/HowIWork';
import ProjectsScroll from './sections/ProjectsScroll';
import MyThoughts from './sections/MyThoughts';
import LetsCook from './sections/LetsCook';
import LetsConnect from './sections/LetsConnect';

export default function App() {
  // Always open at the top — don't let the browser restore a prior scroll
  // position or any mount-time layout shift land the visitor mid-page.
  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  return (
    <main style={{ background: '#0C0C0C', overflowX: 'clip' }}>
      <HeroSection />
      <GetToKnowMe />
      <HowIWork />
      <ProjectsScroll />
      <MyThoughts />
      <LetsCook />
      <LetsConnect />
    </main>
  );
}
