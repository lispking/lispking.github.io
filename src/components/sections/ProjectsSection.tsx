"use client";
import { useRef } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";

const projects = [
  {
    title: "Gas Dog",
    description: "一个Monad链Gas费用分析工具，帮助用户追踪和分析Monad网络上的Gas消耗情况。",
    image: "/images/projects/gas-dog.svg",
    tags: ["Web3", "React", "TypeScript", "Monad"],
    github: "https://github.com/lispking/gas-dog",
    demo: "https://gas-dog.netlify.app",
  },
  {
    title: "Rust Tips",
    description: "分享实用的 Rust 编程技巧和示例代码，帮助开发者提升 Rust 编程技能。深耕技术领域，将知识分享给更多人。",
    image: "/images/projects/rust-tips.svg",
    tags: ["Rust", "技术分享", "教程"],
    github: "https://github.com/lispking/rust-tips",
    demo: "https://github.com/lispking/rust-tips",
  },
  {
    title: "Browser JSON",
    description: "一个美观、实用的 Chrome 扩展，用于格式化和高亮显示JSON内容。",
    image: "/images/projects/browser-json.svg",
    tags: ["Chrome扩展", "JavaScript", "JSON"],
    github: "https://github.com/lispking/browser-json",
    demo: "https://github.com/lispking/browser-json",
  },
  {
    title: "Browser Proxy",
    description: "一个简单的 Chrome 浏览器代理管理插件，可以帮助用户快速切换和管理代理设置。",
    image: "/images/projects/browser-proxy.svg",
    tags: ["Chrome扩展", "JavaScript", "浏览器代理"],
    github: "https://github.com/lispking/browser-proxy",
    demo: "https://github.com/lispking/browser-proxy",
  },
];

const ProjectsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            精选项目
          </motion.h2>
          <motion.div
            initial={{ opacity: 0, width: 0 }}
            animate={isInView ? { opacity: 1, width: "80px" } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1 bg-gradient-to-r from-purple-600 to-blue-500 mx-auto mb-6"
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            探索我的创新项目，每个项目都融合了最新技术和创意设计，解决实际问题。
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {projects.map((project) => (
            <motion.div
              key={project.title}
              variants={itemVariants}
              className="bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative h-60 w-full">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs font-medium px-2 py-1 rounded-full bg-purple-500/30 text-purple-100"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-400 mb-6">{project.description}</p>
                <div className="flex justify-between items-center">
                  <div className="flex space-x-4">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      <FiGithub className="h-6 w-6" />
                    </a>
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                    >
                      <FiExternalLink className="h-6 w-6" />
                    </a>
                  </div>
                  <a
                    href={project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  >
                    查看详情
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="text-center mt-12">
          <motion.a
            href="/projects"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="inline-block px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            查看更多项目
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;
