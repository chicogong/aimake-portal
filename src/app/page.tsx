import { Hero } from "@/components/Hero";
import { ProjectGrid } from "@/components/ProjectGrid";
import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { MouseGlow } from "@/components/MouseGlow";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      <MouseGlow />
      <Hero />
      <ProjectGrid />
      <About />
      <Contact />
      <Footer />
    </main>
  );
}
