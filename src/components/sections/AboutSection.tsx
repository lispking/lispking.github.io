"use client";
import { useRef, useEffect } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { FiCode, FiDatabase, FiServer, FiGlobe } from "react-icons/fi";

const skills = [
  {
    name: "前端开发",
    icon: <FiCode className="h-8 w-8 text-purple-500" />,
    description: "熟练掌握现代前端技术栈，包括React、Vue、Next.js等框架，以及TypeScript、Tailwind CSS等工具。",
    level: 90,
  },
  {
    name: "后端开发",
    icon: <FiServer className="h-8 w-8 text-blue-500" />,
    description: "擅长后端开发，擅长Rust、Go、Java、Python等语言，曾在阿里巴巴、华为、腾讯等大型企业服务超过10年。",
    level: 95,
  },
  {
    name: "数据库",
    icon: <FiDatabase className="h-8 w-8 text-green-500" />,
    description: "精通SQL和NoSQL数据库，包括MySQL、PostgreSQL、MongoDB等，能够设计高效的数据模型。",
    level: 80,
  },
  {
    name: "Web3技术",
    icon: <FiGlobe className="h-8 w-8 text-yellow-500" />,
    description: "深入研究区块链和Web3技术，包括智能合约开发、DApp构建和去中心化存储解决方案，擅长Solidity、FunC、Move。",
    level: 75,
  },
];

const AboutSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  
  return (
    <section id="about" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            关于我
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
            我是一名充满激情的全栈开发者，专注于创建优雅、高效且用户友好的数字体验。
          </motion.p>
        </div>
        
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
            >
              我的故事
            </motion.h3>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-gray-600 dark:text-gray-400 mb-4"
            >
              作为一名技术爱好者，我始终保持对新技术的好奇心和学习热情。我的技术旅程始于前端开发，随后扩展到全栈领域，并逐渐深入研究Web3和区块链技术。
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-600 dark:text-gray-400 mb-4"
            >
              我相信技术的力量在于解决实际问题和改善用户体验。在我的项目中，我始终注重代码质量、性能优化和用户体验，力求创造出既美观又实用的数字产品。
            </motion.p>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-gray-600 dark:text-gray-400"
            >
              除了编码，我还热衷于分享知识和经验。通过我的博客和开源项目，我希望能够帮助更多的开发者成长，同时也不断完善自己的技术栈。
            </motion.p>
          </div>
          
          <div className="order-1 md:order-2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.8 }}
              className="relative w-full h-[400px] rounded-2xl overflow-hidden shadow-xl"
            >
              <Image
                src="/images/about-image.svg"
                alt="Developer Portrait"
                fill
                className="object-contain"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
            </motion.div>
            
            {/* Decorative elements */}
            <div className="absolute -top-6 -left-6 w-24 h-24 bg-purple-500/20 rounded-full blur-xl"></div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-500/20 rounded-full blur-xl"></div>
          </div>
        </div>
        
        <div className="mt-20">
          <motion.h3 
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-2xl font-bold text-gray-900 dark:text-white mb-12 text-center"
          >
            技能与专长
          </motion.h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="bg-gray-50 dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {skill.icon}
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white ml-3">{skill.name}</h4>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">{skill.description}</p>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: `${skill.level}%` } : {}}
                    transition={{ duration: 1, delay: 0.3 + 0.1 * index }}
                    className="h-2.5 rounded-full bg-gradient-to-r from-purple-600 to-blue-500"
                  ></motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
