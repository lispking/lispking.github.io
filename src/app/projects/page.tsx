import ScrollReveal from "@/components/animations/ScrollReveal";
import ProjectsGrid from "@/components/ProjectsGrid";
import { personalProjects, contributedProjects } from "@/data/projects";

export default function Projects() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-gray-50">
      <div className="w-full py-12">
        <ScrollReveal>
          <ProjectsGrid
            title="个人开源项目"
            description="我独立开发和维护的开源项目，专注于提供实用工具和技术分享。"
            projects={personalProjects}
          />
          <ProjectsGrid
            title="参与的开源项目精选"
            description="我积极参与和贡献的优秀开源项目，与社区一起推动技术发展。"
            projects={contributedProjects}
          />
        </ScrollReveal>
      </div>
    </main>
  );
}
