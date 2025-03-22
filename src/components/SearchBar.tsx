'use client';

import { useState, useEffect, useRef } from 'react';
import { FiSearch } from 'react-icons/fi';
import Link from 'next/link';

interface Post {
  id: string;
  title: string;
  date: string;
  tags: string[];
}

interface SearchBarProps {
  className?: string;
}

// 高亮文本的辅助函数
const highlightText = (text: string, query: string) => {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, 'gi');
  return text.split(regex).map((part, i) => 
    regex.test(part) ? (
      <span key={i} className="bg-purple-100 text-purple-800 font-medium">
        {part}
      </span>
    ) : part
  );
};

export default function SearchBar({ className = '' }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Post[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/search');
        const posts = await response.json();
        setSearchResults(posts);
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []);

  // 处理键盘快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 按下 Cmd/Ctrl + K 打开搜索框
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsExpanded(true);
        setIsOpen(true);
        setTimeout(() => {
          inputRef.current?.focus();
        }, 100);
      }
      // 按下 Escape 关闭搜索框
      if (e.key === 'Escape' && isExpanded) {
        setIsExpanded(false);
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isExpanded]);

  const filteredResults = searchResults.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className={`relative ${className}`}>
      <div className={`relative transition-all duration-300 ease-in-out ${isExpanded ? 'w-64 md:w-80' : 'w-10'}`}>
        {!isExpanded ? (
          <button
            onClick={() => {
              setIsExpanded(true);
              setIsOpen(true);
              setTimeout(() => {
                inputRef.current?.focus();
              }, 100);
            }}
            className="flex items-center justify-center w-10 h-10 text-gray-500 hover:text-purple-500 dark:text-gray-400 dark:hover:text-purple-400 transition-colors duration-200"
            title="搜索文章 (⌘K)"
          >
            <FiSearch className="w-5 h-5" />
          </button>
        ) : (
          <div className="relative group w-full">
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsOpen(true)}
              onBlur={() => {
                // 延迟关闭，以便点击搜索结果
                setTimeout(() => {
                  if (!searchQuery) {
                    setIsExpanded(false);
                    setIsOpen(false);
                  }
                }, 200);
              }}
              placeholder="搜索文章... (⌘K)"
              className="w-full px-4 py-2 pl-10 pr-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 dark:placeholder-gray-500"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-hover:text-purple-500 transition-colors duration-200" />
          </div>
        )}
      </div>

      {isOpen && searchQuery && (
        <div className="absolute z-50 w-64 md:w-80 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {filteredResults.length > 0 ? (
            filteredResults.map((post) => (
              <Link
                key={post.id}
                href={`/blog/${post.id}`}
                className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700 last:border-0"
                onClick={() => {
                  setIsOpen(false);
                  setIsExpanded(false);
                  setSearchQuery('');
                }}
              >
                <h3 className="font-medium text-gray-900 dark:text-gray-100 line-clamp-1">
                  {highlightText(post.title, searchQuery)}
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <span>{new Date(post.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="line-clamp-1">
                    {post.tags.map((tag, index) => (
                      <span key={tag}>
                        {index > 0 && ', '}
                        {highlightText(tag, searchQuery)}
                      </span>
                    ))}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <div className="px-4 py-3 text-gray-500 dark:text-gray-400">
              没有找到相关文章
            </div>
          )}
        </div>
      )}
    </div>
  );
} 