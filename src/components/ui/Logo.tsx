"use client";
import { motion } from "framer-motion";
import Link from "next/link";

interface LogoProps {
  className?: string;
}

const Logo = ({ className = "" }: LogoProps) => {
  return (
    <Link href="/" className={`inline-block ${className}`}>
      <motion.div
        className="flex items-center space-x-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: "#9333EA" }} />
              <stop offset="100%" style={{ stopColor: "#3B82F6" }} />
            </linearGradient>
          </defs>
          
          <motion.rect
            x="2"
            y="2"
            width="28"
            height="28"
            rx="8"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          
          <motion.path
            d="M8 8L8 24M8 16L16 8M8 16L16 24"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
          
          <motion.g
            transform="translate(14, 16)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <circle cx="0" cy="0" r="0.5" fill="url(#gradient)" />
            <circle cx="4" cy="-4" r="0.5" fill="url(#gradient)" />
            <circle cx="4" cy="4" r="0.5" fill="url(#gradient)" />
            <circle cx="8" cy="0" r="0.5" fill="url(#gradient)" />
            <circle cx="12" cy="-4" r="0.5" fill="url(#gradient)" />
            <circle cx="12" cy="4" r="0.5" fill="url(#gradient)" />
            
            <path
              d="M0 0L4 -4L8 0L12 -4M0 0L4 4L8 0L12 4"
              stroke="url(#gradient)"
              strokeWidth="0.5"
              strokeOpacity="0.6"
            />
            
            <text
              x="6"
              y="0"
              style={{
                fontFamily: "Arial, sans-serif",
                fontStyle: "italic",
                fontWeight: "bold",
                fontSize: "6px"
              }}
              fill="url(#gradient)"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              ing
            </text>
          </motion.g>
        </svg>
        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          King
        </span>
      </motion.div>
    </Link>
  );
};

export default Logo;
