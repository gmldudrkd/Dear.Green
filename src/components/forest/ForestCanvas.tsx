"use client";

import { useState, useMemo } from "react";
import ForestTree from "./ForestTree";
import TreePopup from "./TreePopup";
import { generateForestUsers } from "@/lib/mockForest";
import type { ForestUser } from "@/types/forest";

export default function ForestCanvas() {
  const users = useMemo(() => generateForestUsers(), []);
  const [selectedUser, setSelectedUser] = useState<ForestUser | null>(null);

  const treeCount = users.length;
  const totalIP = users.reduce((sum, u) => sum + u.ip, 0);

  return (
    <>
      <div className="mb-3 text-center">
        <h2 className="text-lg font-bold text-earth-800">우리의 숲</h2>
        <p className="mt-1 text-xs text-earth-400">
          <span className="font-semibold text-sage-600">{treeCount}그루</span>의
          나무가 함께 자라고 있어요
        </p>
        <p className="text-[10px] text-earth-300">
          총 {totalIP.toLocaleString()} IP의 다정함이 모였습니다
        </p>
      </div>

      <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-b from-sky-100 via-sage-50 to-sage-100">
        {/* 땅 */}
        <div className="absolute bottom-0 h-3/4 w-full rounded-t-[50%] bg-gradient-to-b from-sage-200 to-sage-300" />

        {/* 나무들 */}
        {users.map((user) => (
          <ForestTree key={user.id} user={user} onSelect={setSelectedUser} />
        ))}

        {/* 장식 */}
        <span className="absolute bottom-2 right-3 text-lg opacity-60">🦌</span>
        <span className="absolute top-4 right-6 text-sm opacity-50">🐦</span>
        <span className="absolute bottom-6 left-3 text-sm opacity-50">🐿️</span>
      </div>

      <TreePopup user={selectedUser} onClose={() => setSelectedUser(null)} />
    </>
  );
}
