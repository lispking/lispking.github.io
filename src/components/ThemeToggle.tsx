"use client";

import { useState, useRef, useEffect } from "react";
import { FiSun, FiMoon } from "react-icons/fi";
import { MdMonitor } from "react-icons/md";
import { useTheme, type Theme } from "./ThemeProvider";

const options: { value: Theme; label: string; Icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "light", label: "浅色", Icon: FiSun },
  { value: "dark", label: "深色", Icon: FiMoon },
  { value: "system", label: "系统", Icon: MdMonitor },
];

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const activeOption = options.find((o) => o.value === theme) ?? options[2];
  const ActiveIcon = activeOption.Icon;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-10 h-10 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        title="切换主题"
        aria-label="切换主题"
        aria-expanded={open}
      >
        <ActiveIcon className="w-5 h-5" />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
          {options.map(({ value, label, Icon }) => (
            <button
              key={value}
              onClick={() => {
                setTheme(value);
                setOpen(false);
              }}
              className={`flex items-center w-full px-3 py-2 text-sm transition-colors ${
                theme === value
                  ? "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-gray-700"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ThemeToggle;
