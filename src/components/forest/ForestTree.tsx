"use client";

import { motion } from "framer-motion";
import type { ForestUser } from "@/types/forest";

const treeSizes: Record<number, { h: number; w: number; emoji: string }> = {
  1: { h: 20, w: 16, emoji: "🌰" },
  2: { h: 28, w: 20, emoji: "🌱" },
  3: { h: 36, w: 26, emoji: "🌿" },
  4: { h: 44, w: 32, emoji: "🌳" },
  5: { h: 52, w: 38, emoji: "🌍" },
};

interface Props {
  user: ForestUser;
  onSelect: (user: ForestUser) => void;
}

export default function ForestTree({ user, onSelect }: Props) {
  const size = treeSizes[user.treeLevel];

  return (
    <motion.button
      className="absolute flex flex-col items-center"
      style={{
        left: `${user.x}%`,
        top: `${user.y}%`,
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: Math.random() * 0.5, type: "spring", stiffness: 200 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onSelect(user)}
    >
      <span
        className="block"
        style={{ fontSize: `${size.h}px`, lineHeight: 1 }}
      >
        {size.emoji}
      </span>
      <span className="mt-0.5 max-w-[60px] truncate text-[8px] text-earth-500">
        {user.nickname}
      </span>
    </motion.button>
  );
}
