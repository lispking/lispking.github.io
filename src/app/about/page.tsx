import AboutSection from "@/components/sections/AboutSection";
import ScrollReveal from "@/components/animations/ScrollReveal";

export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <ScrollReveal>
        <AboutSection />
      </ScrollReveal>
    </main>
  );
}
