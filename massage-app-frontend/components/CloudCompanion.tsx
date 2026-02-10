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
  const [mounted, setMounted] = useState(false);

  // Use a ref for the spotlight to update it without re-renders
  const spotlightRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const size = useRef({ width: 220, height: 90 });
  const mood = useMemo(() => moods[index % moods.length], [index]);

  useEffect(() => {
    setMounted(true);

    // Initial measurement
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      size.current = { width: rect.width, height: rect.height };
    }
  }, []);

  const handleDrag = (event: any, info: any) => {
    if (!spotlightRef.current || !buttonRef.current) return;

    // Calculate center of the element
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    spotlightRef.current.style.setProperty("--spot-x", `${centerX}px`);
    spotlightRef.current.style.setProperty("--spot-y", `${centerY}px`);
    spotlightRef.current.style.opacity = "1";
  };

  if (!mounted) return null;

  return (
    <>
      <div
        ref={spotlightRef}
        className="cloud-spotlight opacity-0"
        style={
          {
            "--spot-x": "0px",
            "--spot-y": "0px",
          } as React.CSSProperties
        }
      />
      <motion.button
        type="button"
        ref={buttonRef}
        onClick={() => setIndex((prev) => prev + 1)}
        className="cloud-lamp fixed z-40 flex items-center gap-3 rounded-full border border-[color:var(--surface-muted)] bg-[color:var(--card)]/90 px-4 py-3 shadow-lg backdrop-blur-md"
        // Initial position bottom-right
        initial={{ bottom: 24, right: 24, x: 0, y: 0, opacity: 0 }}
        animate={{ opacity: 1 }}
        drag
        dragMomentum={true}
        dragElastic={0.1}
        onDragStart={() => {
          if (spotlightRef.current) spotlightRef.current.style.opacity = "1";
        }}
        onDrag={handleDrag}
        onDragEnd={(e, info) => {
          // Ensure final position is recorded for the light
          handleDrag(e, info);
          // Keep light visible, do not set opacity to 0
        }}
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
