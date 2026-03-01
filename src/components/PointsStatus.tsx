"use client";

import { useState } from "react";
import { usePoints } from "@/context/PointsContext";
import { getStage, getNextStage } from "@/lib/growth";
import PlantEncyclopedia from "@/components/PlantEncyclopedia";

export default function PointsStatus() {
  const [showEncyclopedia, setShowEncyclopedia] = useState(false);
  const { ip } = usePoints();
  const stage = getStage(ip);
  const nextStage = getNextStage(ip);

  return (
    <div className="w-full px-6">
      <div className="rounded-2xl bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-earth-400">나의 인지 포인트</p>
          <p className="text-2xl font-bold text-sage-600">{ip} IP</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-earth-400">성장 단계</p>
          <button
            onClick={() => setShowEncyclopedia(true)}
            className="text-sm font-medium text-earth-600 underline underline-offset-2"
          >
            {stage.icon} {stage.name}
          </button>
        </div>
      </div>
      {nextStage && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-earth-400">
            <span>Lv.{stage.level}</span>
            <span>Lv.{nextStage.level}</span>
          </div>
          <div className="mt-1 h-1.5 w-full rounded-full bg-sand-200">
            <div
              className="h-1.5 rounded-full bg-sage-400 transition-all"
              style={{
                width: `${Math.min(((ip - stage.minIP) / (nextStage.minIP - stage.minIP)) * 100, 100)}%`,
              }}
            />
          </div>
        </div>
      )}
      <PlantEncyclopedia open={showEncyclopedia} onClose={() => setShowEncyclopedia(false)} />
      </div>
    </div>
  );
}
