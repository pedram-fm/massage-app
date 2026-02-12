"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, useAnimation } from "motion/react";

const moods = [
  { label: "شاد", face: "^‿^", bubble: "امروز عالیه!" },
  { label: "آرام", face: "˘◡˘", bubble: "ریلکس..." },
  { label: "بازیگوش", face: "≧◡≦", bubble: "بزن بریم!" },
  { label: "متعجب", face: "O_O", bubble: "چه جالب!" },
  { label: "خوابالو", face: "(=_=)", bubble: "آرومم..." },
  { label: "عاشق", face: "♥‿♥", bubble: "دوست دارم!" },
  { label: "cool", face: "⌐■_■", bubble: "من باحالم" },
  { label: "گیج", face: "@_@", bubble: "چی شد؟" },
];

export function CloudCompanion() {
  const [index, setIndex] = useState(0);
  const [variant, setVariant] = useState("idle");
  const [mounted, setMounted] = useState(false);
  const controls = useAnimation();

  // Use a ref for the spotlight to update it without re-renders
  const spotlightRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const size = useRef({ width: 220, height: 90 });
  const mood = useMemo(() => moods[index % moods.length], [index]);

  // Only render on client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      size.current = { width: rect.width, height: rect.height };
    }

    // Auto-change mood every 8s
    const moodInterval = setInterval(() => {
      setIndex((prev) => (prev + 1) % moods.length);
      setVariant("bounce"); // Small bounce on change
      setTimeout(() => setVariant("idle"), 1000);
    }, 8000);

    // Random animations every 3-6s
    const animInterval = setInterval(() => {
      const actions = ["wiggle", "spin", "jump", "shake"];
      const match = Math.random() > 0.6; // 40% chance
      if (match) {
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        setVariant(randomAction);
        setTimeout(() => setVariant("idle"), 1500);
      }
    }, 4000);

    return () => {
      clearInterval(moodInterval);
      clearInterval(animInterval);
    };
  }, []);

  const variants = {
    idle: { y: [0, -4, 0], rotate: [0, 1, -1, 0], transition: { duration: 4, repeat: Infinity, ease: "easeInOut" } },
    wiggle: { rotate: [0, -10, 10, -10, 10, 0], transition: { duration: 0.5 } },
    spin: { rotate: [0, 360], transition: { duration: 0.8, ease: "backOut" } },
    jump: { y: [0, -15, 0], scale: [1, 1.1, 1], transition: { duration: 0.6 } },
    bounce: { scale: [1, 1.2, 0.9, 1.05, 1], transition: { duration: 0.6 } },
    shake: { x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4 } },
  };

  const updateSpotlightFromButton = () => {
    if (!spotlightRef.current || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    spotlightRef.current.style.setProperty("--spot-x", `${centerX}px`);
    spotlightRef.current.style.setProperty("--spot-y", `${centerY}px`);
    spotlightRef.current.style.opacity = "1";
  };

  const handleReset = async () => {
    if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
    setVariant("spin");
    await controls.start({
      x: 0,
      y: 0,
      rotate: [0, 360],
      scale: [1, 1.2, 1],
      transition: { type: "spring", stiffness: 200, damping: 20 }
    });
    setVariant("idle");
    // Update spotlight after reset
    if (buttonRef.current && spotlightRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      spotlightRef.current.style.setProperty("--spot-x", `${centerX}px`);
      spotlightRef.current.style.setProperty("--spot-y", `${centerY}px`);
    }
  };

  // Constraint reference
  const constraintsRef = useRef(null);

  // Controls state
  useEffect(() => {
    controls.set({ opacity: 1 });
  }, [controls]);

  // Don't render portal until mounted on client
  if (!mounted) {
    return null;
  }

  return createPortal(
    <>
      <div
        ref={constraintsRef}
        className="fixed inset-4 pointer-events-none z-[9996]"
      />

      <div
        ref={spotlightRef}
        className="cloud-spotlight z-[9997] opacity-0"
        style={{ "--spot-x": "0px", "--spot-y": "0px" } as React.CSSProperties}
      />
      <motion.button
        type="button"
        ref={buttonRef}
        onClick={() => {
          setIndex((prev) => prev + 1);
          setVariant("bounce");
          setTimeout(() => setVariant("idle"), 1000);
        }}
        onDoubleClick={handleReset}
        className="cloud-lamp fixed bottom-6 right-6 z-[9999] flex items-center gap-3 rounded-full border border-[color:var(--surface-muted)] bg-[color:var(--card)]/90 px-4 py-3 shadow-lg backdrop-blur-md"
        // Keep transform animation separate from CSS positioning so placement is stable.
        initial={{ x: 0, y: 0, opacity: 1 }}
        animate={controls}
        drag
        dragConstraints={constraintsRef}
        dragMomentum={false}
        dragElastic={0.1}
        onDragStart={() => {
          if (spotlightRef.current) spotlightRef.current.style.opacity = "1";
          setVariant("wiggle");
        }}
        onDrag={updateSpotlightFromButton}
        onDragEnd={() => {
          updateSpotlightFromButton();
          setVariant("idle");
        }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="relative">
          <motion.div
            className="cloud-buddy"
            variants={variants}
            animate={variant}
          >
            <div className="text-[11px] font-semibold text-[#6b4f1d]">{mood.face}</div>
          </motion.div>
        </div>
        <div className="text-right">
          <div className="text-xs text-[color:var(--muted-text)]">ابرک همراه</div>
          <div className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>
            {mood.label}
          </div>
          <motion.div
            key={mood.bubble} // Animate text change
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[10px] text-[color:var(--muted-text)]"
          >
            {mood.bubble}
          </motion.div>
        </div>
      </motion.button>
    </>
    ,
    document.body
  );
}
