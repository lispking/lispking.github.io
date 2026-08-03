'use client';

import Link from "next/link";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";

type PostLink = {
  id: string;
  title: string | null;
};

type Props = {
  prev?: PostLink | null;
  next?: PostLink | null;
};

export default function PostNavigation({ prev, next }: Props) {
  // 点击上一篇/下一篇时立即回到页面顶部，避免跳转后仍停留在文章底部
  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <div className="flex justify-between mt-12">
      {prev && (
        <Link
          href={`/blog/${prev.id}`}
          onClick={handleClick}
          className="inline-flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200"
        >
          <FiArrowLeft className="w-5 h-5" />
          <span>上一篇：{prev.title}</span>
        </Link>
      )}
      {next && (
        <Link
          href={`/blog/${next.id}`}
          onClick={handleClick}
          className="inline-flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors duration-200 ml-auto"
        >
          <span>下一篇：{next.title}</span>
          <FiArrowRight className="w-5 h-5" />
        </Link>
      )}
    </div>
  );
}
