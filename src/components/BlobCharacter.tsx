"use client";

import { motion } from "framer-motion";
import { usePoints } from "@/context/PointsContext";
import { getStage } from "@/lib/growth";

function Seed() {
  return (
    <motion.div
      className="relative flex h-28 w-28 items-center justify-center"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* 흙 */}
      <div className="absolute bottom-2 h-8 w-24 rounded-[50%] bg-earth-300 opacity-70" />
      {/* 씨앗 */}
      <motion.div
        className="absolute bottom-6 h-6 w-5 rounded-[50%_50%_50%_50%/60%_60%_40%_40%] bg-gradient-to-b from-earth-400 to-earth-600"
        animate={{ rotate: [-3, 3, -3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* 살짝 나온 싹 */}
      <div className="absolute bottom-10 h-3 w-1 rounded-full bg-sage-400" />
    </motion.div>
  );
}

function Sprout() {
  return (
    <motion.div
      className="relative flex h-28 w-28 items-center justify-center"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
    >
      <div className="absolute bottom-0 left-1/2 h-10 w-1.5 -translate-x-1/2 rounded-full bg-sage-500" />
      <motion.div
        className="absolute bottom-6 left-1/2 h-12 w-7 -translate-x-[120%] rounded-[50%] bg-gradient-to-tr from-sage-500 to-sage-300 rotate-[-25deg]"
        animate={{ rotate: [-25, -20, -25] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-6 left-1/2 h-12 w-7 translate-x-[20%] rounded-[50%] bg-gradient-to-tl from-sage-500 to-sage-400 rotate-[25deg]"
        animate={{ rotate: [25, 20, 25] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
    </motion.div>
  );
}

function YoungTree() {
  return (
    <motion.div
      className="relative flex h-36 w-36 items-center justify-center"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* 줄기 */}
      <div className="absolute bottom-0 left-1/2 h-14 w-2.5 -translate-x-1/2 rounded-full bg-earth-500" />
      {/* 잎 무성 */}
      <motion.div
        className="absolute bottom-10 left-1/2 h-10 w-7 -translate-x-[140%] rounded-[50%] bg-gradient-to-tr from-sage-600 to-sage-300 rotate-[-30deg]"
        animate={{ rotate: [-30, -24, -30] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-12 left-1/2 h-12 w-8 -translate-x-[110%] rounded-[50%] bg-gradient-to-tr from-sage-500 to-sage-200 rotate-[-15deg]"
        animate={{ rotate: [-15, -10, -15] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
      />
      <motion.div
        className="absolute bottom-10 left-1/2 h-10 w-7 translate-x-[40%] rounded-[50%] bg-gradient-to-tl from-sage-600 to-sage-400 rotate-[30deg]"
        animate={{ rotate: [30, 24, 30] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
      />
      <motion.div
        className="absolute bottom-12 left-1/2 h-12 w-8 translate-x-[10%] rounded-[50%] bg-gradient-to-tl from-sage-500 to-sage-300 rotate-[15deg]"
        animate={{ rotate: [15, 10, 15] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
      {/* 위쪽 잎 */}
      <div className="absolute bottom-16 left-1/2 h-8 w-6 -translate-x-1/2 rounded-[50%] bg-gradient-to-t from-sage-500 to-sage-200" />
    </motion.div>
  );
}

function BloomingTree() {
  return (
    <motion.div
      className="relative flex h-40 w-40 items-center justify-center"
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* 줄기 */}
      <div className="absolute bottom-0 left-1/2 h-16 w-3 -translate-x-1/2 rounded-full bg-earth-500" />
      {/* 수관 */}
      <div className="absolute bottom-12 left-1/2 h-20 w-28 -translate-x-1/2 rounded-full bg-gradient-to-t from-sage-500 to-sage-300" />
      {/* 꽃 */}
      <motion.div
        className="absolute bottom-24 left-4 h-4 w-4 rounded-full bg-pink-300 opacity-80"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-5 h-3 w-3 rounded-full bg-pink-200 opacity-70"
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-26 left-1/2 h-3.5 w-3.5 -translate-x-1/2 rounded-full bg-pink-300 opacity-75"
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
      />
      {/* 새 */}
      <motion.div
        className="absolute bottom-28 right-2 text-sm"
        animate={{ x: [0, 3, 0], y: [0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      >
        🐦
      </motion.div>
    </motion.div>
  );
}

function WorldTree() {
  return (
    <motion.div
      className="relative flex h-44 w-44 items-center justify-center"
      animate={{ y: [0, -3, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      {/* 줄기 */}
      <div className="absolute bottom-0 left-1/2 h-18 w-4 -translate-x-1/2 rounded-full bg-earth-600" />
      {/* 큰 수관 */}
      <div className="absolute bottom-14 left-1/2 h-24 w-36 -translate-x-1/2 rounded-full bg-gradient-to-t from-sage-600 to-sage-300 shadow-md" />
      {/* 하이라이트 */}
      <div className="absolute bottom-24 left-1/2 h-12 w-20 -translate-x-1/2 rounded-full bg-sage-200 opacity-30" />
      {/* 꽃 */}
      <div className="absolute bottom-30 left-5 h-3 w-3 rounded-full bg-pink-300 opacity-60" />
      <div className="absolute bottom-26 right-6 h-3 w-3 rounded-full bg-pink-200 opacity-60" />
      <div className="absolute bottom-32 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-yellow-200 opacity-60" />
      {/* 동물들 */}
      <motion.div
        className="absolute bottom-28 right-1 text-sm"
        animate={{ x: [0, 2, 0], y: [0, -2, 0] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
      >
        🐦
      </motion.div>
      <motion.div
        className="absolute bottom-4 right-3 text-xs"
        animate={{ x: [0, 2, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      >
        🐿️
      </motion.div>
      <motion.div
        className="absolute bottom-2 left-2 text-xs"
        animate={{ x: [0, -2, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      >
        🦌
      </motion.div>
    </motion.div>
  );
}

const characterByLevel: Record<number, () => React.ReactNode> = {
  1: Seed,
  2: Sprout,
  3: YoungTree,
  4: BloomingTree,
  5: WorldTree,
};

export default function BlobCharacter() {
  const { ip } = usePoints();
  const stage = getStage(ip);
  const Character = characterByLevel[stage.level] ?? Seed;

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      <Character />

      {stage.level <= 2 && (
        <div className="h-4 w-16 rounded-[50%] bg-earth-300 opacity-70" />
      )}

      <p className="text-sm text-earth-600">{stage.greeting}</p>
    </div>
  );
}
