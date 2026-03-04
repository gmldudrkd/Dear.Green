"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ── 간이 대륙 맵 (위도/경도 → 육지 여부) ──────── */
// 위도 -90~90을 row 0~11, 경도 -180~180을 col 0~23으로 매핑
// 1 = 육지, 0 = 바다
const LAND_MAP: number[][] = [
  // 남극
  [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  // -75
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // -60
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
  // -45 남미 하단, 호주
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
  // -30 남미, 남아프리카, 호주
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
  // -15 남미, 아프리카
  [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
  // 0 적도: 남미, 아프리카
  [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  // 15 중미, 아프리카, 인도
  [0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
  // 30 북미, 북아프리카, 중동, 중국
  [0, 1, 1, 1, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
  // 45 북미, 유럽, 아시아
  [0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0],
  // 60 캐나다, 스칸디나비아, 러시아
  [0, 1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
  // 북극
  [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
];

function isLand(lat: number, lon: number): boolean {
  // lat: -90~90 → row: 0~11
  const row = Math.min(11, Math.max(0, Math.floor((lat + 90) / 15)));
  // lon: -180~180 → col: 0~23
  const col = Math.min(23, Math.max(0, Math.floor((lon + 180) / 15)));
  return LAND_MAP[row]?.[col] === 1;
}

/* ── 복셀 지구 컴포넌트 ──────────────────────── */
export default function VoxelEarth() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
  });

  const voxels = useMemo(() => {
    const result: {
      pos: [number, number, number];
      color: string;
      emissive: string;
    }[] = [];
    const radius = 3;
    const step = 0.5; // 복셀 크기

    for (let x = -radius; x <= radius; x += step) {
      for (let y = -radius; y <= radius; y += step) {
        for (let z = -radius; z <= radius; z += step) {
          const dist = Math.sqrt(x * x + y * y + z * z);
          // 구 표면 근처의 복셀만 생성 (속이 빈 구)
          if (dist < radius - step * 0.6 || dist > radius + step * 0.3)
            continue;

          // 구면 좌표로 변환 → 위도/경도
          const lat = (Math.asin(y / dist) * 180) / Math.PI;
          const lon = (Math.atan2(z, x) * 180) / Math.PI;

          const land = isLand(lat, lon);

          if (land) {
            // 위도에 따라 육지 색상 변화
            const absLat = Math.abs(lat);
            if (absLat > 65) {
              // 극지방 - 눈/얼음
              result.push({
                pos: [x, y, z],
                color: "#E8E8E8",
                emissive: "#FFFFFF",
              });
            } else if (absLat > 45) {
              // 고위도 - 짙은 녹색
              result.push({
                pos: [x, y, z],
                color: "#3A7D44",
                emissive: "#2D5F33",
              });
            } else if (absLat > 20) {
              // 중위도 - 녹색
              result.push({
                pos: [x, y, z],
                color: "#5C9E4C",
                emissive: "#3A7D44",
              });
            } else {
              // 열대 - 밝은 녹색
              result.push({
                pos: [x, y, z],
                color: "#6BBF59",
                emissive: "#4A9E3C",
              });
            }
          } else {
            // 바다 - 깊이감 있는 파란색
            const shade = 0.7 + Math.random() * 0.3;
            const r = Math.round(30 * shade);
            const g = Math.round(100 * shade);
            const b = Math.round(180 * shade);
            result.push({
              pos: [x, y, z],
              color: `rgb(${r},${g},${b})`,
              emissive: "#1A4A7A",
            });
          }
        }
      }
    }
    return result;
  }, []);

  return (
    <group ref={groupRef}>
      {voxels.map((v, i) => (
        <mesh key={i} position={v.pos}>
          <boxGeometry args={[0.48, 0.48, 0.48]} />
          <meshStandardMaterial
            color={v.color}
            emissive={v.emissive}
            emissiveIntensity={0.15}
          />
        </mesh>
      ))}
    </group>
  );
}
