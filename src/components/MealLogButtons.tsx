"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import MealLogModal from "@/components/MealLogModal";

function SunriseIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path d="M6 26h24" stroke="#FB923C" strokeWidth="2" strokeLinecap="round" />
      <path d="M9 26a9 9 0 0118 0" fill="#FBBF24" />
      <path d="M18 10v-4M26 14l2.5-2.5M10 14L7.5 11.5M30 22h3M3 22h3" stroke="#FB923C" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <circle cx="18" cy="18" r="7" fill="#FBBF24" />
      <path d="M18 5v4M18 27v4M5 18h4M27 18h4M9.3 9.3l2.8 2.8M23.9 23.9l2.8 2.8M9.3 26.7l2.8-2.8M23.9 12.1l2.8-2.8" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <path d="M27 20.5A10 10 0 1115.5 9a8 8 0 0011.5 11.5z" fill="#A78BFA" />
      <circle cx="25" cy="10" r="1" fill="#C4B5FD" />
      <circle cx="29" cy="16" r="0.7" fill="#C4B5FD" />
    </svg>
  );
}

const meals = [
  { id: "breakfast", label: "아침", Icon: SunriseIcon },
  { id: "lunch", label: "점심", Icon: SunIcon },
  { id: "dinner", label: "저녁", Icon: MoonIcon },
] as const;

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function getLoggedMeals(): Record<string, boolean> {
  try {
    const raw = localStorage.getItem("dear-earth-meals");
    if (!raw) return {};
    const data = JSON.parse(raw);
    if (data.date !== getTodayKey()) return {};
    return data.meals ?? {};
  } catch {
    return {};
  }
}

function saveLoggedMeal(mealId: string) {
  const current = getLoggedMeals();
  current[mealId] = true;
  localStorage.setItem(
    "dear-earth-meals",
    JSON.stringify({ date: getTodayKey(), meals: current })
  );
}

export default function MealLogButtons() {
  const [selectedMeal, setSelectedMeal] = useState<
    (typeof meals)[number] | null
  >(null);
  const [logged, setLogged] = useState<Record<string, boolean>>({});

  useEffect(() => {
    setLogged(getLoggedMeals());
  }, []);

  const handleClose = useCallback((mealId?: string) => {
    if (mealId) {
      saveLoggedMeal(mealId);
      setLogged(getLoggedMeals());
    }
    setSelectedMeal(null);
  }, []);

  return (
    <div className="w-full px-6">
      <h2 className="mb-4 text-center text-lg font-semibold text-earth-800">
        오늘의 한 끼를 기록해보세요
      </h2>
      <div className="flex gap-3">
        {meals.map((meal, index) => {
          const done = !!logged[meal.id];

          return (
            <motion.button
              key={meal.id}
              onClick={() => !done && setSelectedMeal(meal)}
              disabled={done}
              className={`flex flex-1 flex-col items-center gap-2 rounded-2xl px-4 py-5 shadow-sm transition-colors ${
                done
                  ? "bg-sand-100 opacity-60"
                  : "bg-white hover:bg-sage-50 active:bg-sage-100"
              }`}
              whileTap={done ? {} : { scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className={`${done ? "grayscale opacity-50" : ""}`}>
                <meal.Icon />
              </span>
              <span
                className={`text-sm font-medium ${done ? "text-earth-400" : "text-earth-700"}`}
              >
                {meal.label}
              </span>
              {done && (
                <span className="text-[10px] text-sage-500">기록완료</span>
              )}
            </motion.button>
          );
        })}
      </div>

      {selectedMeal && (
        <MealLogModal
          meal={selectedMeal}
          onClose={() => handleClose()}
          onRecord={() => handleClose(selectedMeal.id)}
        />
      )}
    </div>
  );
}
