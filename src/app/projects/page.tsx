import ProjectsSection from "@/components/sections/ProjectsSection";
import ScrollReveal from "@/components/animations/ScrollReveal";

export default function Projects() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <ScrollReveal>
        <ProjectsSection />
      </ScrollReveal>
    </main>
  );
}
