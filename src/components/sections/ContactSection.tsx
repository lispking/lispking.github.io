"use client";
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiGithub, FiTwitter } from "react-icons/fi";
import { FaWeixin } from "react-icons/fa";
import Image from "next/image";

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  return (
    <section id="contact" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4"
          >
            联系我
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
            无论是项目合作、技术交流还是职业机会，都欢迎通过以下方式与我联系。
          </motion.p>
        </div>

        <div ref={ref} className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-gray-900 rounded-xl shadow-xl p-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">联系方式</h3>
                <div className="space-y-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
                      <FiGithub className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">GitHub</h4>
                      <a href="https://github.com/lispking" target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400">
                        github.com/lispking
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-4">
                      <FiTwitter className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Twitter</h4>
                      <a href="https://x.com/lispking" target="_blank" rel="noopener noreferrer" className="text-gray-900 dark:text-white hover:text-purple-600 dark:hover:text-purple-400">
                        @lispking
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col justify-center items-center">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <FaWeixin className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">微信公众号</h4>
                </div>
                <div className="mt-4 relative w-48 h-48 rounded-xl overflow-hidden border-4 border-green-100 dark:border-green-900/30 shadow-lg hover:shadow-2xl transition-shadow duration-300">
                  <Image
                    src="/images/contact/qrcode.png"
                    alt="微信公众号二维码"
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>
                <p className="mt-4 text-center text-gray-700 dark:text-gray-300">
                  <span className="font-medium text-green-600 dark:text-green-400">猿禹宙</span>
                </p>
              </div>
            </div>
            
            <div className="mt-10 pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-600 dark:text-gray-400">
                期待与您的交流与合作！
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
