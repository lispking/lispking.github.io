"use client";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { FiClock, FiArrowRight } from "react-icons/fi";

const blogPosts = [
  {
    title: "用 AI 开发 Chrome 插件：替代 SwitchyOmega",
    excerpt: "介绍如何使用 AI 工具来开发 Chrome 插件，包括需求分析、技术选型、实现步骤和部署方案。",
    image: "/blog/ai-chrome-plugin.svg",
    date: "2025-03-13",
    readTime: "10 分钟",
    category: "Chrome插件",
    slug: "https://mp.weixin.qq.com/s/MeiWk_ps6zUBoBiZoiHT1A",
  },
  {
    title: "全面解读MCP TypeScript SDK：LLM应用开发的终极利器",
    excerpt: "MCP 是一种专为LLM设计的上下文协议，让你能以标准化、安全、高效的方式，为大模型提供数据（资源）、功能（工具）以及交互模式（提示模板）。",
    image: "/blog/mcp-sdk.svg",
    date: "2025-03-12",
    readTime: "12 分钟",
    category: "MCP",
    slug: "https://mp.weixin.qq.com/s/VAWGoBeTnMQKxdMsI-iJgg",
  },
  {
    title: "DeepSeek开启智能PDF问答新时代：从0到1搭建系统全攻略",
    excerpt: "从0到1搭建智能PDF问答系统，包括需求分析、技术选型、实现步骤和部署方案。",
    image: "/blog/deepseek-pdfs.svg",
    date: "2025-02-18",
    readTime: "15 分钟",
    category: "AI",
    slug: "https://mp.weixin.qq.com/s/Z2lX0gopCtgQpjFaKQBnwQ",
  },
];

const BlogSection = () => {
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
    <section id="blog" className="py-20 bg-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
          >
            最新博客
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
            className="text-lg text-gray-600 max-w-2xl mx-auto"
          >
            分享我对技术趋势的见解、开发经验和实用教程，帮助你在技术道路上不断进步。
          </motion.p>
        </div>

        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {blogPosts.map((post) => (
            <motion.article
              key={post.slug}
              variants={itemVariants}
              className="bg-gray-50 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group"
            >
              <Link href={post.slug} className="block" target="_blank">
                <div className="relative h-48 w-full overflow-hidden">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-purple-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                    {post.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-3">
                    <span>{post.date}</span>
                    <span className="mx-2">•</span>
                    <span className="flex items-center">
                      <FiClock className="mr-1" />
                      {post.readTime}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-purple-600 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center text-purple-600 font-medium group-hover:translate-x-1 transition-transform">
                    阅读全文
                    <FiArrowRight className="ml-1" />
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>

        {/* <div className="text-center mt-12">
          <motion.a
            href="/blog"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="inline-block px-8 py-3 bg-white text-gray-900 font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-gray-200"
          >
            查看所有文章
          </motion.a>
        </div> */}
      </div>
    </section>
  );
};

export default BlogSection;
