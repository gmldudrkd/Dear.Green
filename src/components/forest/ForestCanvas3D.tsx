"use client";

import { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import VoxelTree from "./VoxelTree";
import TreePopup from "./TreePopup";
import { generateForestUsers } from "@/lib/mockForest";
import type { ForestUser } from "@/types/forest";

/* ── 구면 좌표 계산 ─────────────────────────── */
const SPHERE_RADIUS = 18;

function getSurfaceY(x: number, z: number): number {
  const d2 = x * x + z * z;
  if (d2 >= SPHERE_RADIUS * SPHERE_RADIUS) return 0;
  return -SPHERE_RADIUS + Math.sqrt(SPHERE_RADIUS * SPHERE_RADIUS - d2);
}

/* ── 둥근 대지 (구) ──────────────────────────── */
function Ground() {
  return (
    <mesh position={[0, -SPHERE_RADIUS, 0]} receiveShadow>
      <sphereGeometry args={[SPHERE_RADIUS, 64, 64]} />
      <meshStandardMaterial color="#7BA55E" />
    </mesh>
  );
}

/* ── 장식: 풀 ─────────────────────────────── */
function Grass({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.15, 0.3, 0.15]} />
      <meshStandardMaterial color="#8FBF5A" />
    </mesh>
  );
}

/* ── 장식: 꽃 ─────────────────────────────── */
function Flower({ position, color }: { position: [number, number, number]; color: string }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[0.08, 0.2, 0.08]} />
        <meshStandardMaterial color="#5B9E2D" />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.18, 0.18, 0.18]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  );
}

/* ── 장식: 돌 ─────────────────────────────── */
function Rock({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.4, 0.25, 0.35]} />
      <meshStandardMaterial color="#9E9E9E" />
    </mesh>
  );
}

/* ── 장식 세트 (구면 배치) ───────────────────── */
function Decorations() {
  const grassData: [number, number][] = [
    [-8, -5], [-6, 7], [9, -3], [7, 8],
    [-3, -9], [5, -7], [-9, 2], [2, 9],
  ];
  const flowerData: { xz: [number, number]; color: string }[] = [
    { xz: [-7, 3], color: "#FFB7C5" },
    { xz: [8, 5], color: "#FFD700" },
    { xz: [-4, -7], color: "#DDA0DD" },
    { xz: [6, -6], color: "#FFB7C5" },
  ];
  const rockData: [number, number][] = [
    [9, -8], [-8, -8], [3, 10],
  ];

  return (
    <>
      {grassData.map(([x, z], i) => (
        <Grass key={`g${i}`} position={[x, getSurfaceY(x, z) + 0.15, z]} />
      ))}
      {flowerData.map(({ xz: [x, z], color }, i) => (
        <Flower key={`f${i}`} position={[x, getSurfaceY(x, z), z]} color={color} />
      ))}
      {rockData.map(([x, z], i) => (
        <Rock key={`r${i}`} position={[x, getSurfaceY(x, z) + 0.12, z]} />
      ))}
    </>
  );
}

/* ── 조명 ─────────────────────────────────── */
function Lighting() {
  return (
    <>
      <ambientLight intensity={0.7} color="#F5E6D3" />
      <directionalLight
        position={[8, 12, 8]}
        intensity={1}
        color="#FFE5B4"
        castShadow
      />
      <directionalLight
        position={[-6, 4, -6]}
        intensity={0.3}
        color="#B1E1FF"
      />
    </>
  );
}

/* ── 메인 캔버스 ──────────────────────────── */
export default function ForestCanvas3D() {
  const users = useMemo(() => generateForestUsers(), []);
  const [selectedUser, setSelectedUser] = useState<ForestUser | null>(null);

  const treeCount = users.length;
  const totalIP = users.reduce((sum, u) => sum + u.ip, 0);

  return (
    <div className="flex h-full flex-col">
      <div className="py-2 text-center">
        <h2 className="text-lg font-bold text-earth-800">우리의 숲</h2>
        <p className="mt-0.5 text-xs text-earth-400">
          <span className="font-semibold text-sage-600">{treeCount}그루</span>의
          나무가 함께 자라고 있어요
        </p>
        <p className="text-[10px] text-earth-300">
          총 {totalIP.toLocaleString()} IP의 다정함이 모였습니다
        </p>
      </div>

      <div
        className="relative min-h-0 flex-1 overflow-hidden"
        style={{
          background: "linear-gradient(to bottom, #D6EAF8, #E8F8E0)",
        }}
      >
        <Canvas
          camera={{ position: [14, 12, 14], fov: 45 }}
          style={{ width: "100%", height: "100%" }}
        >
          <Lighting />
          <Ground />
          <Decorations />

          {users.map((user) => (
            <VoxelTree
              key={user.id}
              user={user}
              onSelect={setSelectedUser}
              surfaceY={getSurfaceY(user.x, user.y)}
              hideLabels={!!selectedUser}
            />
          ))}

          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.05}
            minDistance={10}
            maxDistance={35}
            minPolarAngle={0.2}
            maxPolarAngle={Math.PI * 0.48}
            enablePan={false}
          />
        </Canvas>

        <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-earth-400/70">
          드래그로 회전 · 핀치로 확대축소 · 나무를 탭해보세요
        </p>
      </div>

      <TreePopup user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}
