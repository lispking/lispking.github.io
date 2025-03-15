import ContactSection from "@/components/sections/ContactSection";
import ScrollReveal from "@/components/animations/ScrollReveal";

export default function Contact() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <ScrollReveal>
        <ContactSection />
      </ScrollReveal>
    </main>
  );
}
