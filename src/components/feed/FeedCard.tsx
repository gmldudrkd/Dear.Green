"use client";

import { motion } from "framer-motion";
import type { FeedItem } from "@/types/feed";
import HeartButton from "./HeartButton";

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
}

export default function FeedCard({ item, index, onLike }: Props) {
  const diet = dietLabels[item.dietLevel];

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

      {/* 메시지 */}
      {item.autoMessage && (
        <p className="mt-2 text-xs text-earth-500">{item.autoMessage}</p>
      )}

      {/* 사진 플레이스홀더 */}
      <div className="mt-3 flex h-32 items-center justify-center rounded-xl bg-sage-50 text-4xl">
        {item.photoPlaceholder}
      </div>

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
        <HeartButton
          liked={item.hasLiked}
          count={item.likes}
          onToggle={() => onLike(item.id)}
        />
      </div>
    </motion.div>
  );
}
