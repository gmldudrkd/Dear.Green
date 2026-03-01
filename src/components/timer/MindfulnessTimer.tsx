"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const DURATION = 10;
const RADIUS = 50;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface Props {
  onComplete: (completed: boolean) => void;
}

export default function MindfulnessTimer({ onComplete }: Props) {
  const [seconds, setSeconds] = useState(DURATION);

  useEffect(() => {
    if (seconds <= 0) {
      onComplete(true);
      return;
    }
    const id = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [seconds, onComplete]);

  const progress = (DURATION - seconds) / DURATION;

  return (
    <motion.div
      className="flex flex-col items-center gap-5 py-6"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
    >
      <p className="text-center text-sm leading-relaxed text-earth-600">
        이 식재료의 여정을
        <br />
        10초만 생각해주세요
      </p>

      {/* 원형 프로그레스 */}
      <div className="relative flex h-32 w-32 items-center justify-center">
        <svg width="128" height="128" className="-rotate-90">
          <circle
            cx="64"
            cy="64"
            r={RADIUS}
            fill="none"
            stroke="#e6ddd0"
            strokeWidth="6"
          />
          <motion.circle
            cx="64"
            cy="64"
            r={RADIUS}
            fill="none"
            stroke="#5c845c"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            animate={{ strokeDashoffset: CIRCUMFERENCE * (1 - progress) }}
            transition={{ duration: 0.3, ease: "linear" }}
          />
        </svg>
        <span className="absolute text-3xl font-bold text-sage-600">
          {seconds}
        </span>
      </div>

      <p className="text-xs text-earth-400">
        완료하면 +5 IP 보너스!
      </p>

      <button
        onClick={() => onComplete(false)}
        className="text-xs text-earth-300 underline underline-offset-2"
      >
        건너뛰기
      </button>
    </motion.div>
  );
}
