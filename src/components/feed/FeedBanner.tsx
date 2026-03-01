"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { autoMessages } from "@/lib/feedMessages";

export default function FeedBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % autoMessages.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="w-full overflow-hidden rounded-xl bg-sage-50 px-4 py-3">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          className="text-center text-xs text-sage-700"
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          🌍 {autoMessages[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
