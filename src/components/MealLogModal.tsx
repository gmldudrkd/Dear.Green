"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePoints } from "@/context/PointsContext";
import MindfulnessTimer from "@/components/timer/MindfulnessTimer";

const TIMER_BONUS_IP = 5;

const dietLevels = [
  { id: "vegan", label: "비건", desc: "동물성 식품 없음", ip: 30 },
  { id: "ovo-lacto", label: "오보-락토", desc: "달걀·유제품 허용", ip: 25 },
  { id: "pesco", label: "페스코", desc: "생선까지 허용", ip: 20 },
  { id: "pollo", label: "폴로", desc: "닭고기까지 허용", ip: 15 },
  { id: "flexitarian", label: "플렉시테리언", desc: "유연한 채식", ip: 10 },
] as const;

const compromises = [
  "그래도 채소를 많이 먹었어요",
  "고기 양을 줄여봤어요",
] as const;

type Phase = "select" | "timer" | "complete";

interface Props {
  meal: { id: string; label: string; icon: string } | null;
  onClose: () => void;
  onRecord: () => void;
}

export default function MealLogModal({ meal, onClose, onRecord }: Props) {
  const [selectedDiet, setSelectedDiet] = useState<string | null>(null);
  const [checkedCompromises, setCheckedCompromises] = useState<Set<number>>(
    new Set()
  );
  const [phase, setPhase] = useState<Phase>("select");
  const [earnedIP, setEarnedIP] = useState(0);
  const { addIP } = usePoints();

  if (!meal) return null;

  const selectedLevel = dietLevels.find((d) => d.id === selectedDiet);
  const showCompromise =
    selectedDiet === "pollo" || selectedDiet === "flexitarian";
  const baseIP = selectedLevel
    ? selectedLevel.ip + checkedCompromises.size * 3
    : 0;

  const handleStartTimer = () => {
    if (!selectedLevel) return;
    setPhase("timer");
  };

  const handleTimerComplete = useCallback(
    (completed: boolean) => {
      const bonus = completed ? TIMER_BONUS_IP : 0;
      const total = baseIP + bonus;
      addIP(total);
      setEarnedIP(total);
      setPhase("complete");
      onRecord();
    },
    [baseIP, addIP, onRecord]
  );

  const toggleCompromise = (index: number) => {
    setCheckedCompromises((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const handleClose = () => {
    setSelectedDiet(null);
    setCheckedCompromises(new Set());
    setPhase("select");
    setEarnedIP(0);
    onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/30" onClick={handleClose} />

        <motion.div
          className="relative z-10 w-full max-w-md rounded-t-3xl bg-sand-50 px-6 pb-8 pt-4"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-sand-300" />

          {phase === "select" && (
            <>
              <div className="mb-5 text-center">
                <span className="text-3xl">{meal.icon}</span>
                <h2 className="mt-2 text-lg font-bold text-earth-800">
                  {meal.label} 기록
                </h2>
                <p className="mt-1 text-xs text-earth-400">
                  오늘 {meal.label}은 어떤 선택이었나요?
                </p>
              </div>

              <div className="flex flex-col gap-2">
                {dietLevels.map((diet) => (
                  <button
                    key={diet.id}
                    onClick={() => {
                      setSelectedDiet(diet.id);
                      setCheckedCompromises(new Set());
                    }}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-left transition-colors ${
                      selectedDiet === diet.id
                        ? "bg-sage-100 ring-1 ring-sage-400"
                        : "bg-white"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-earth-800">
                        {diet.label}
                      </p>
                      <p className="text-xs text-earth-400">{diet.desc}</p>
                    </div>
                    <span className="text-xs font-semibold text-sage-600">
                      +{diet.ip} IP
                    </span>
                  </button>
                ))}
              </div>

              {showCompromise && (
                <motion.div
                  className="mt-4 rounded-xl bg-sand-100 p-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                >
                  <p className="mb-2 text-xs font-medium text-earth-600">
                    괜찮아요, 작은 노력도 소중해요
                  </p>
                  {compromises.map((text, i) => (
                    <label
                      key={i}
                      className="mt-1 flex items-center gap-2 text-xs text-earth-500"
                    >
                      <input
                        type="checkbox"
                        checked={checkedCompromises.has(i)}
                        onChange={() => toggleCompromise(i)}
                        className="h-4 w-4 rounded accent-sage-500"
                      />
                      {text}
                      <span className="ml-auto text-sage-500">+3 IP</span>
                    </label>
                  ))}
                </motion.div>
              )}

              <button
                onClick={handleStartTimer}
                disabled={!selectedDiet}
                className="mt-5 w-full rounded-xl bg-sage-600 py-3 text-sm font-semibold text-white transition-colors disabled:bg-sand-300 disabled:text-earth-400"
              >
                {selectedDiet
                  ? `기록하기 (+${baseIP} IP)`
                  : "단계를 선택해주세요"}
              </button>
            </>
          )}

          {phase === "timer" && (
            <MindfulnessTimer onComplete={handleTimerComplete} />
          )}

          {phase === "complete" && (
            <motion.div
              className="flex flex-col items-center gap-3 py-6"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <span className="text-5xl">{meal.icon}</span>
              <h2 className="text-lg font-bold text-earth-800">기록 완료!</h2>
              <p className="text-sm text-sage-600">
                +{earnedIP} IP를 획득했어요
              </p>
              <p className="text-xs text-earth-400">
                당신의 다정한 선택이 새싹을 키웁니다
              </p>
              <button
                onClick={handleClose}
                className="mt-4 rounded-xl bg-sage-600 px-8 py-2.5 text-sm font-semibold text-white"
              >
                확인
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
