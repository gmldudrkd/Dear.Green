"use client";

import { useState, useMemo } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import VoxelTree from "./VoxelTree";
import TreePopup from "./TreePopup";
import { generateForestUsers } from "@/lib/mockForest";
import type { ForestUser } from "@/types/forest";

/* ── 초록 대지 ────────────────────────────── */
function Ground() {
  return (
    <mesh position={[0, -0.25, 0]} receiveShadow>
      <boxGeometry args={[24, 0.5, 24]} />
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

/* ── 장식 세트 (고정 배치) ──────────────────── */
function Decorations() {
  return (
    <>
      {/* 풀 */}
      <Grass position={[-8, 0.15, -5]} />
      <Grass position={[-6, 0.15, 7]} />
      <Grass position={[9, 0.15, -3]} />
      <Grass position={[7, 0.15, 8]} />
      <Grass position={[-3, 0.15, -9]} />
      <Grass position={[5, 0.15, -7]} />
      <Grass position={[-9, 0.15, 2]} />
      <Grass position={[2, 0.15, 9]} />

      {/* 꽃 */}
      <Flower position={[-7, 0, 3]} color="#FFB7C5" />
      <Flower position={[8, 0, 5]} color="#FFD700" />
      <Flower position={[-4, 0, -7]} color="#DDA0DD" />
      <Flower position={[6, 0, -6]} color="#FFB7C5" />

      {/* 돌 */}
      <Rock position={[9, 0.12, -8]} />
      <Rock position={[-8, 0.12, -8]} />
      <Rock position={[3, 0.12, 10]} />
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
        className="relative min-h-0 flex-1 overflow-hidden rounded-2xl"
        style={{
          background: "linear-gradient(to bottom, #D6EAF8, #E8F8E0)",
        }}
      >
        <Canvas
          camera={{ position: [12, 10, 12], fov: 45 }}
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
            />
          ))}

          <OrbitControls
            makeDefault
            enableDamping
            dampingFactor={0.05}
            autoRotate
            autoRotateSpeed={0.5}
            minDistance={8}
            maxDistance={25}
            minPolarAngle={0.3}
            maxPolarAngle={Math.PI * 0.45}
            enablePan={false}
          />
        </Canvas>

        <p className="absolute bottom-2 left-0 right-0 text-center text-[10px] text-earth-400/70">
          드래그로 회전 · 핀치로 확대/축소
        </p>
      </div>

      <TreePopup user={selectedUser} onClose={() => setSelectedUser(null)} />
    </div>
  );
}
