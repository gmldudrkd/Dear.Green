"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* ── 서울 기준 일출/일몰 계산 (간이 공식) ────────── */
function getSunTimes(): { sunrise: number; sunset: number } {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const dayOfYear =
    Math.floor((now.getTime() - start.getTime()) / 86400000) + 1;

  // 서울 위도 37.5°N 기준 간이 일출/일몰 시간 (시 단위)
  const lat = 37.5;
  const declination =
    23.45 * Math.sin(((2 * Math.PI) / 365) * (dayOfYear - 81));
  const latRad = (lat * Math.PI) / 180;
  const declRad = (declination * Math.PI) / 180;
  const hourAngle =
    Math.acos(-Math.tan(latRad) * Math.tan(declRad)) * (180 / Math.PI);
  const sunrise = 12 - hourAngle / 15; // UTC 기준
  const sunset = 12 + hourAngle / 15;

  // UTC → KST (+9)
  return { sunrise: sunrise + 9, sunset: sunset + 9 };
}

function isDaytime(): boolean {
  const { sunrise, sunset } = getSunTimes();
  const now = new Date();
  const currentHour = now.getHours() + now.getMinutes() / 60;
  return currentHour >= sunrise && currentHour < sunset;
}

/* ── 복셀 해 ──────────────────────────────── */
function VoxelSun({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* 중심 코어 */}
      <mesh>
        <boxGeometry args={[1.2, 1.2, 1.2]} />
        <meshStandardMaterial
          color="#FFD700"
          emissive="#FFA500"
          emissiveIntensity={0.8}
        />
      </mesh>

      {/* 광선 - 상하좌우전후 돌출 */}
      {[
        [1, 0, 0],
        [-1, 0, 0],
        [0, 1, 0],
        [0, -1, 0],
        [0, 0, 1],
        [0, 0, -1],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x * 0.9, y * 0.9, z * 0.9]}>
          <boxGeometry args={[0.4, 0.4, 0.4]} />
          <meshStandardMaterial
            color="#FFEC8B"
            emissive="#FFD700"
            emissiveIntensity={0.6}
          />
        </mesh>
      ))}

      {/* 대각선 광선 (작은 큐브) */}
      {[
        [1, 1, 0],
        [-1, 1, 0],
        [1, -1, 0],
        [-1, -1, 0],
        [0, 1, 1],
        [0, -1, 1],
        [0, 1, -1],
        [0, -1, -1],
      ].map(([x, y, z], i) => (
        <mesh key={`d${i}`} position={[x * 0.85, y * 0.85, z * 0.85]}>
          <boxGeometry args={[0.25, 0.25, 0.25]} />
          <meshStandardMaterial
            color="#FFF8DC"
            emissive="#FFD700"
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}

      {/* 글로우 포인트라이트 */}
      <pointLight color="#FFD700" intensity={2} distance={15} />
    </group>
  );
}

/* ── 복셀 달 ──────────────────────────────── */
function VoxelMoon({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.15;
    }
  });

  // 초승달 형태: 구체에서 한쪽을 파낸 모양을 복셀로 표현
  const moonBlocks = useMemo(() => {
    const blocks: [number, number, number][] = [];
    const size = 3; // 3x3x3 그리드
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // 구형 마스크
          if (x * x + y * y + z * z > 2) continue;
          // 오른쪽 위를 파서 초승달 효과
          if (x === 1 && y === 1) continue;
          if (x === 1 && z === -1) continue;
          blocks.push([x * 0.45, y * 0.45, z * 0.45]);
        }
      }
    }
    return blocks;
  }, []);

  return (
    <group ref={groupRef} position={position}>
      {moonBlocks.map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]}>
          <boxGeometry args={[0.42, 0.42, 0.42]} />
          <meshStandardMaterial
            color="#F0E68C"
            emissive="#FFE4B5"
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* 별 장식 (작은 복셀) */}
      {[
        [-1.2, 0.8, 0.3],
        [0.9, 1.3, -0.5],
        [-0.5, -1.1, 0.7],
      ].map(([x, y, z], i) => (
        <mesh key={`s${i}`} position={[x, y, z]}>
          <boxGeometry args={[0.12, 0.12, 0.12]} />
          <meshStandardMaterial
            color="#FFFACD"
            emissive="#FFFACD"
            emissiveIntensity={1}
          />
        </mesh>
      ))}

      <pointLight color="#FFE4B5" intensity={0.8} distance={12} />
    </group>
  );
}

/* ── 메인 컴포넌트 ────────────────────────── */
export default function VoxelCelestial() {
  const daytime = useMemo(() => isDaytime(), []);

  // 오른쪽 상단 위치
  const celestialPosition: [number, number, number] = [12, 14, -8];

  return daytime ? (
    <VoxelSun position={celestialPosition} />
  ) : (
    <VoxelMoon position={celestialPosition} />
  );
}
