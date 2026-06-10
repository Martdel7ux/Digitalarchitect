import HeroSection from './sections/HeroSection';
import GetToKnowMe from './sections/GetToKnowMe';
import HowIWork from './sections/HowIWork';
import ProjectsScroll from './sections/ProjectsScroll';
import MyThoughts from './sections/MyThoughts';
import LetsCook from './sections/LetsCook';

export default function App() {
  return (
    <main style={{ background: '#0C0C0C', overflowX: 'clip' }}>
      <HeroSection />
      <GetToKnowMe />
      <HowIWork />
      <ProjectsScroll />
      <MyThoughts />
      <LetsCook />
    </main>
  );
}
