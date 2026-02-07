"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";

const moods = [
  { label: "شاد", face: "^_^", bubble: "امروز بانانا تایم!" },
  { label: "آرام", face: "-_-", bubble: "آروم آروم" },
  { label: "پر انرژی", face: "o_o", bubble: "پاور بانانا" },
  { label: "متعجب", face: "O_O", bubble: "واو!" },
  { label: "مهربان", face: "^‿^", bubble: "حالت چطوره؟" },
];

export function CloudCompanion() {
  const [index, setIndex] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);
  const [bounds, setBounds] = useState({ left: 12, top: 12, right: 0, bottom: 0 });
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const size = useRef({ width: 220, height: 90 });
  const mood = useMemo(() => moods[index % moods.length], [index]);

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  useEffect(() => {
    const updateBounds = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const elementWidth = size.current.width;
      const elementHeight = size.current.height;
      setBounds({
        left: -elementWidth / 2 + 12,
        top: -elementHeight / 2 + 12,
        right: Math.max(12, width - elementWidth / 2 - 12),
        bottom: Math.max(12, height - elementHeight / 2 - 12),
      });
      setPosition({ x: Math.max(12, width - elementWidth), y: Math.max(12, height - elementHeight) });
    };

    updateBounds();
    const measure = () => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      size.current = { width: rect.width, height: rect.height };
      updateBounds();
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("resize", updateBounds);
    return () => {
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <>
      {pointer && (
        <div
          className="cloud-spotlight"
          style={
            {
              "--spot-x": `${pointer.x}px`,
              "--spot-y": `${pointer.y}px`,
            } as React.CSSProperties
          }
        />
      )}
      <motion.button
        type="button"
        onClick={() => setIndex((prev) => prev + 1)}
        ref={buttonRef}
        className="cloud-lamp fixed z-40 flex items-center gap-3 rounded-full border border-[color:var(--surface-muted)] bg-[color:var(--card)]/90 px-4 py-3 shadow-lg backdrop-blur-md"
        style={{ left: position.x, top: position.y }}
        drag
        dragMomentum={false}
        dragConstraints={bounds}
        dragElastic={0}
        onDragStart={(_, info) => {
          setPointer({ x: info.point.x, y: info.point.y });
        }}
        onDrag={(_, info) => {
          setPointer({ x: info.point.x, y: info.point.y });
          const nextX = clamp(
            info.point.x - size.current.width / 2,
            bounds.left,
            bounds.right
          );
          const nextY = clamp(
            info.point.y - size.current.height / 2,
            bounds.top,
            bounds.bottom
          );
          setPosition({ x: nextX, y: nextY });
        }}
        onDragEnd={() => setPointer(null)}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative">
          <motion.div
            className="cloud-buddy"
            animate={{ y: [0, -3, 0], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="text-[11px] font-semibold text-[#6b4f1d]">{mood.face}</div>
          </motion.div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[color:var(--muted-text)]">ابرک همراه</div>
          <div className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            {mood.label}
          </div>
          <div className="text-[10px] text-[color:var(--muted-text)]">{mood.bubble}</div>
        </div>
      </motion.button>
    </>
  );
}
