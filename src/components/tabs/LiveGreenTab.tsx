"use client";

import { useState, useMemo } from "react";
import FeedBanner from "@/components/feed/FeedBanner";
import FeedCard from "@/components/feed/FeedCard";
import { generateMockFeed } from "@/lib/mockFeed";

export default function LiveGreenTab() {
  const [feed, setFeed] = useState(() => generateMockFeed());

  const handleLike = (id: string) => {
    setFeed((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              hasLiked: !item.hasLiked,
              likes: item.hasLiked ? item.likes - 1 : item.likes + 1,
            }
          : item
      )
    );
  };

  const handleComment = (id: string, text: string) => {
    setFeed((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              comments: [
                ...item.comments,
                { id: `c-${Date.now()}`, text, timestamp: Date.now() },
              ],
            }
          : item
      )
    );
  };

  const totalToday = useMemo(
    () => feed.filter((f) => Date.now() - f.timestamp < 86400000).length,
    [feed]
  );

  return (
    <div className="flex flex-col pb-2">
      <div className="sticky top-0 z-10 flex flex-col gap-3 bg-sand-50 px-4 pt-4 pb-3">
        <FeedBanner />
        <p className="text-center text-xs text-earth-400">
          오늘 <span className="font-semibold text-sage-600">{totalToday}명</span>
          이 다정한 한 끼를 기록했어요
        </p>
      </div>

      <div className="flex flex-col gap-3 px-4 pt-1">
        {feed.map((item, i) => (
          <FeedCard key={item.id} item={item} index={i} onLike={handleLike} onComment={handleComment} />
        ))}
      </div>
    </div>
  );
}
