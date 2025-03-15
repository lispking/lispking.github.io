"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";

const HeroSection = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (heroRef.current) {
      const ctx = gsap.context(() => {
        gsap.from(".hero-title span", {
          opacity: 0,
          y: 50,
          stagger: 0.05,
          duration: 1,
          ease: "power3.out",
        });
        
        gsap.from(".hero-subtitle", {
          opacity: 0,
          y: 20,
          duration: 1,
          delay: 0.5,
          ease: "power3.out",
        });
        
        gsap.from(".hero-cta", {
          opacity: 0,
          y: 20,
          duration: 0.8,
          delay: 0.8,
          ease: "power3.out",
        });
      }, heroRef);
      
      return () => ctx.revert();
    }
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black py-20"
    >
      {/* Background Animation */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-pattern opacity-5"></div>
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500 rounded-full filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500 rounded-full filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="w-full md:w-1/2 text-center md:text-left">
            <h1 className="hero-title text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {"探索技术的边界，分享创新的见解".split("").map((char, index) => (
                <span key={index} className="inline-block">
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </h1>
            
            <p className="hero-subtitle text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl">
              欢迎来到我的技术世界，这里有前沿的技术分享、深度的项目解析和实用的开发经验。
            </p>
            
            <div className="hero-cta flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <motion.a
                href="#projects"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                查看项目
              </motion.a>
              
              <motion.a
                href="#contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 dark:border-gray-700"
              >
                联系我
              </motion.a>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative z-10"
            >
              <div className="relative w-full h-[400px] md:h-[500px]">
                <Image
                  src="/images/hero-image.svg"
                  alt="Tech Illustration"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </motion.div>
            
            {/* Floating Elements */}
            <motion.div
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="absolute top-10 right-10 w-16 h-16 bg-blue-500 rounded-lg opacity-80 z-0"
            />
            
            <motion.div
              animate={{
                y: [0, 10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1,
              }}
              className="absolute bottom-20 left-10 w-12 h-12 bg-purple-500 rounded-full opacity-80 z-0"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
