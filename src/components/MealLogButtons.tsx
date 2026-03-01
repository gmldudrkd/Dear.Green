"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import MealLogModal from "@/components/MealLogModal";

const meals = [
  { id: "breakfast", label: "아침", icon: "🌅" },
  { id: "lunch", label: "점심", icon: "☀️" },
  { id: "dinner", label: "저녁", icon: "🌙" },
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
              <span className={`text-3xl ${done ? "grayscale" : ""}`}>
                {meal.icon}
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
