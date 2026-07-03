import AboutSection from "@/components/sections/AboutSection";
import ScrollReveal from "@/components/animations/ScrollReveal";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata({
  title: "关于",
  description:
    "了解 King 的技术方向、开源项目、Web3、Rust、全栈开发与技术写作经历。",
  path: "/about",
  keywords: ["关于King", "开发者简介", "技术写作", "开源贡献"],
});

export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <ScrollReveal>
        <AboutSection />
      </ScrollReveal>
    </main>
  );
}
