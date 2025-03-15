"use client";
import Link from "next/link";
import Image from "next/image";
import { FiGithub, FiTwitter } from "react-icons/fi";
import { FaWeixin } from "react-icons/fa";
import Logo from "../ui/Logo";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Logo />
            <p className="mt-4 text-gray-600 dark:text-gray-400 max-w-md">
              分享技术见解，探索创新解决方案，连接志同道合技术爱好者。
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="https://github.com/lispking" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                <FiGithub className="h-6 w-6" />
              </a>
              <a href="https://x.com/lispking" target="_blank" rel="noopener noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                <FiTwitter className="h-6 w-6" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">导航</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  首页
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  关于
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  项目
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400">
                  联系
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">关注公众号</h3>
            <div className="flex flex-col items-start space-y-3">
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <FaWeixin className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="font-medium text-green-600 dark:text-green-400">猿禹宙</span>
              </div>
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-green-100 dark:border-green-900/30 shadow-md hover:shadow-xl transition-shadow duration-300">
                <Image
                  src="/images/contact/qrcode.png"
                  alt="微信公众号二维码"
                  width={128}
                  height={128}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-gray-600 dark:text-gray-400">
          <p>© {currentYear} King. 保留所有权利。</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
