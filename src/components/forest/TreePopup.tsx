"use client";

import { motion, AnimatePresence } from "framer-motion";
import type { ForestUser } from "@/types/forest";
import { stages } from "@/lib/growth";

const dietLabels: Record<string, string> = {
  vegan: "비건",
  "ovo-lacto": "오보-락토",
  pesco: "페스코",
  pollo: "폴로",
  flexitarian: "플렉시테리언",
};

interface Props {
  user: ForestUser | null;
  onClose: () => void;
}

export default function TreePopup({ user, onClose }: Props) {
  if (!user) return null;

  const stage = stages.find((s) => s.level === user.treeLevel) ?? stages[0];

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-end justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/20" onClick={onClose} />

        <motion.div
          className="relative z-10 w-full max-w-md rounded-t-3xl bg-white px-6 pb-8 pt-4"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-sand-300" />

          <div className="flex items-center gap-3">
            <span className="text-4xl">{user.avatarEmoji}</span>
            <div>
              <h3 className="text-base font-bold text-earth-800">
                {user.nickname}
              </h3>
              <p className="text-xs text-earth-400">
                {dietLabels[user.dietLevel]} · {user.joinedDaysAgo}일째 함께하는 중
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-sage-50 p-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{stage.icon}</span>
              <div>
                <p className="text-sm font-semibold text-earth-700">
                  Lv.{stage.level} {stage.name}
                </p>
                <p className="text-xs text-earth-400">{user.ip} IP 보유</p>
              </div>
            </div>
            <p className="mt-2 text-xs text-sage-600">{stage.description}</p>
          </div>

          <button
            onClick={onClose}
            className="mt-4 w-full rounded-xl bg-sage-600 py-2.5 text-sm font-semibold text-white"
          >
            닫기
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
