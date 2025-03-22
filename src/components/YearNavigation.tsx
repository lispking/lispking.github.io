"use client";
import { PostData } from '@/lib/posts';
import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface YearNavigationProps {
  years: string[];
  postsByYear: Record<string, Omit<PostData, 'contentHtml'>[]>;
}

export default function YearNavigation({ years, postsByYear }: YearNavigationProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleYearClick = (year: string) => {
    const element = document.getElementById(year);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false); // 移动端点击后关闭菜单
    }
  };

  return (
    <>
      {/* 移动端折叠菜单按钮 */}
      <button
        className="md:hidden fixed right-4 bottom-20 z-50 bg-white dark:bg-gray-800 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FiChevronDown className="w-6 h-6 text-gray-600 dark:text-gray-300" /> : <FiChevronUp className="w-6 h-6 text-gray-600 dark:text-gray-300" />}
      </button>

      {/* 年份导航时间线 */}
      <div className={`
        fixed top-24 right-0 z-40
        w-56
        bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm
        shadow-lg
        rounded-l-lg
        p-4
        transition-all duration-300 ease-in-out
        transform ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        md:translate-x-0 md:fixed md:right-4 md:top-24 md:w-48
      `}>
        <div className="relative flex flex-col gap-4">
          <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />
          {years.map((year) => (
            <div key={year} className="relative flex items-center">
              <div className="absolute left-2 w-2 h-2 rounded-full bg-indigo-500 transform -translate-x-1/2" />
              <button
                className="w-full ml-6 px-4 py-2.5 rounded-lg bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm shadow-sm hover:shadow-md transition-all duration-200 transform hover:scale-105 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium text-left"
                onClick={() => handleYearClick(year)}
              >
                <span className="flex items-center justify-between w-full gap-2">
                  <span>{year}年</span>
                  <span className="px-2.5 py-1 text-xs rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 whitespace-nowrap">
                    {postsByYear[year].length}
                  </span>
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );

}