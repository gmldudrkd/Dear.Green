"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { FeedItem } from "@/types/feed";
import HeartButton from "./HeartButton";
import { quickReplies } from "@/lib/feedMessages";

const dietLabels: Record<string, { label: string; color: string }> = {
  vegan: { label: "비건", color: "bg-sage-100 text-sage-700" },
  "ovo-lacto": { label: "오보-락토", color: "bg-sage-50 text-sage-600" },
  pesco: { label: "페스코", color: "bg-blue-50 text-blue-600" },
  pollo: { label: "폴로", color: "bg-sand-100 text-earth-600" },
  flexitarian: { label: "플렉시테리언", color: "bg-sand-50 text-earth-500" },
};

const mealLabels: Record<string, string> = {
  breakfast: "아침",
  lunch: "점심",
  dinner: "저녁",
};

function relativeTime(ts: number): string {
  const diff = Math.floor((Date.now() - ts) / 60000);
  if (diff < 1) return "방금";
  if (diff < 60) return `${diff}분 전`;
  const hours = Math.floor(diff / 60);
  if (hours < 24) return `${hours}시간 전`;
  return `${Math.floor(hours / 24)}일 전`;
}

interface Props {
  item: FeedItem;
  index: number;
  onLike: (id: string) => void;
  onComment: (id: string, text: string) => void;
}

export default function FeedCard({ item, index, onLike, onComment }: Props) {
  const [showReplies, setShowReplies] = useState(false);
  const diet = dietLabels[item.dietLevel];
  const hasPhoto = !!item.photoPlaceholder;

  const summaryText = `${item.nickname}님은 오늘 ${mealLabels[item.mealType]}으로 ${diet.label} 식을 먹었어요!`;
  const summaryEmoji = item.dietLevel === "vegan" ? "🥗" : item.dietLevel === "ovo-lacto" ? "🥚" : item.dietLevel === "pesco" ? "🐟" : item.dietLevel === "pollo" ? "🍗" : "🌿";

  return (
    <motion.div
      className="rounded-2xl bg-white p-4 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{item.avatarEmoji}</span>
          <span className="text-sm font-medium text-earth-700">
            {item.nickname}
          </span>
        </div>
        <span className="text-[10px] text-earth-300">
          {relativeTime(item.timestamp)}
        </span>
      </div>

      {hasPhoto ? (
        <>
          {item.autoMessage && (
            <p className="mt-2 text-xs text-earth-500">{item.autoMessage}</p>
          )}
          <div className="mt-3 flex h-32 items-center justify-center rounded-xl bg-sage-50 text-4xl">
            {item.photoPlaceholder}
          </div>
        </>
      ) : (
        <p className="mt-3 text-sm text-earth-600">
          {summaryText} {summaryEmoji}
        </p>
      )}

      {/* 하단 */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${diet.color}`}>
            {diet.label}
          </span>
          <span className="text-[10px] text-earth-300">
            {mealLabels[item.mealType]}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowReplies((v) => !v)}
            className="flex items-center gap-1 text-earth-400"
          >
            <span className="text-sm">💬</span>
            {item.comments.length > 0 && (
              <span className="text-xs">{item.comments.length}</span>
            )}
          </button>
          <HeartButton
            liked={item.hasLiked}
            count={item.likes}
            onToggle={() => onLike(item.id)}
          />
        </div>
      </div>

      {/* 댓글 목록 */}
      {item.comments.length > 0 && (
        <div className="mt-2 flex flex-col gap-1.5 border-t border-sand-100 pt-2">
          {item.comments.map((c) => (
            <p key={c.id} className="text-xs text-earth-500">
              <span className="font-medium text-earth-600">나</span>{" "}
              {c.text}
            </p>
          ))}
        </div>
      )}

      {/* 빠른 댓글 */}
      <AnimatePresence>
        {showReplies && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-2 flex flex-wrap gap-1.5 border-t border-sand-100 pt-2">
              {quickReplies.map((text) => (
                <button
                  key={text}
                  onClick={() => {
                    onComment(item.id, text);
                    setShowReplies(false);
                  }}
                  className="rounded-full bg-sage-50 px-3 py-1.5 text-[11px] text-sage-700 transition-colors hover:bg-sage-100 active:bg-sage-200"
                >
                  {text}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
