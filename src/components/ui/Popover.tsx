'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PopoverProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  triggerRef: React.RefObject<HTMLElement>;
}

export default function Popover({ isOpen, onClose, children, triggerRef }: PopoverProps) {
  const popoverRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    const updatePosition = () => {
      if (triggerRef.current && popoverRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const popoverRect = popoverRef.current.getBoundingClientRect();
        const scrollY = window.scrollY;
        const scrollX = window.scrollX;

        // 计算popover的位置，默认显示在trigger元素的下方
        let top = triggerRect.bottom + scrollY;
        let left = triggerRect.left + scrollX - (popoverRect.width - triggerRect.width) / 2;

        // 确保popover不会超出视窗边界
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        if (left < 0) left = 0;
        if (left + popoverRect.width > viewportWidth) {
          left = viewportWidth - popoverRect.width;
        }

        // 如果下方空间不足，则显示在上方
        if (top + popoverRect.height > viewportHeight + scrollY) {
          top = triggerRect.top + scrollY - popoverRect.height;
        }

        setPosition({ top, left });
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
      updatePosition();
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isOpen, onClose, triggerRef]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={popoverRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            top: position.top,
            left: position.left,
            zIndex: 50,
          }}
          className="bg-white rounded-lg shadow-lg p-4 border border-gray-200"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}