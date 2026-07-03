import ContactSection from "@/components/sections/ContactSection";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "联系",
  description:
    "通过 GitHub、X 或微信公众号联系 King，交流开源项目、技术合作、Rust、Web3 与全栈开发话题。",
  path: "/contact",
  keywords: ["联系King", "技术交流", "项目合作", "GitHub", "微信公众号"],
});

export default function Contact() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <ScrollReveal>
        <ContactSection />
      </ScrollReveal>
    </main>
  );
}
