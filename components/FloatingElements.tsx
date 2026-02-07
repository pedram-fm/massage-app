"use client";

import { motion } from 'motion/react';

interface FloatingElementsProps {
  isDark: boolean;
}

export function FloatingElements({ isDark }: FloatingElementsProps) {
  const elements = [
    { size: 100, x: '10%', y: '20%', delay: 0, duration: 20 },
    { size: 60, x: '80%', y: '70%', delay: 2, duration: 25 },
    { size: 80, x: '70%', y: '10%', delay: 4, duration: 22 },
    { size: 50, x: '20%', y: '80%', delay: 6, duration: 28 },
    { size: 70, x: '90%', y: '40%', delay: 1, duration: 24 },
    { size: 40, x: '5%', y: '60%', delay: 3, duration: 26 },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className={`absolute rounded-full ${
            isDark
              ? 'bg-gradient-to-br from-amber-500/5 to-orange-500/5'
              : 'bg-gradient-to-br from-amber-200/20 to-orange-200/20'
          } blur-3xl`}
          style={{
            width: element.size,
            height: element.size,
            left: element.x,
            top: element.y,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
      
      {/* Decorative sparkles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`sparkle-${i}`}
          className={`absolute w-1 h-1 rounded-full ${
            isDark ? 'bg-amber-400/40' : 'bg-amber-500/60'
          }`}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            delay: Math.random() * 5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
