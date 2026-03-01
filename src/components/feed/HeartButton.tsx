"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  liked: boolean;
  count: number;
  onToggle: () => void;
}

export default function HeartButton({ liked, count, onToggle }: Props) {
  const [particles, setParticles] = useState<number[]>([]);

  const handleClick = () => {
    if (!liked) {
      setParticles((prev) => [...prev, Date.now()]);
    }
    onToggle();
  };

  return (
    <div className="relative flex items-center gap-1">
      <button onClick={handleClick} className="relative text-lg">
        <motion.span
          key={liked ? "filled" : "empty"}
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          className="inline-block"
        >
          {liked ? "💚" : "🤍"}
        </motion.span>
      </button>
      <span className="text-xs text-earth-400">{count}</span>

      <AnimatePresence>
        {particles.slice(-5).map((id) => (
          <motion.span
            key={id}
            className="pointer-events-none absolute -top-2 left-1 text-sm"
            initial={{ opacity: 1, y: 0, x: 0 }}
            animate={{
              opacity: 0,
              y: -30,
              x: (Math.random() - 0.5) * 20,
              rotate: Math.random() * 60 - 30,
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            onAnimationComplete={() =>
              setParticles((prev) => prev.filter((p) => p !== id))
            }
          >
            🍃
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
