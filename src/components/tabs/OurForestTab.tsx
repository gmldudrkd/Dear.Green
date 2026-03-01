"use client";

import dynamic from "next/dynamic";

const ForestCanvas3D = dynamic(
  () => import("@/components/forest/ForestCanvas3D"),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-64 items-center justify-center">
        <p className="text-sm text-earth-400">숲을 불러오는 중...</p>
      </div>
    ),
  }
);

export default function OurForestTab() {
  return (
    <div className="flex h-full flex-col">
      <ForestCanvas3D />
    </div>
  );
}
