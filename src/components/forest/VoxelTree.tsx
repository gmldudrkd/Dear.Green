"use client";

import { useState, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import type { Group } from "three";
import type { ForestUser } from "@/types/forest";

interface Props {
  user: ForestUser;
  onSelect: (user: ForestUser) => void;
  surfaceY?: number;
  hideLabels?: boolean;
}

/* ── Lv.1 씨앗 ─────────────────────────────── */
function SeedTree() {
  return (
    <group>
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.4, 0.3, 0.4]} />
        <meshStandardMaterial color="#8B6914" />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[0.2, 0.1, 0.2]} />
        <meshStandardMaterial color="#6B8E23" />
      </mesh>
    </group>
  );
}

/* ── Lv.2 새싹 ─────────────────────────────── */
function SproutTree() {
  return (
    <group>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[0.2, 0.6, 0.2]} />
        <meshStandardMaterial color="#6B4226" />
      </mesh>
      <mesh position={[0, 0.8, 0]}>
        <boxGeometry args={[0.7, 0.7, 0.7]} />
        <meshStandardMaterial color="#7BC043" />
      </mesh>
    </group>
  );
}

/* ── Lv.3 어린 나무 ────────────────────────── */
function YoungTree() {
  return (
    <group>
      <mesh position={[0, 0.5, 0]}>
        <boxGeometry args={[0.3, 1, 0.3]} />
        <meshStandardMaterial color="#704214" />
      </mesh>
      <mesh position={[0, 1.3, 0]}>
        <boxGeometry args={[1.4, 0.8, 1.4]} />
        <meshStandardMaterial color="#5B9E2D" />
      </mesh>
      <mesh position={[0, 2, 0]}>
        <boxGeometry args={[0.9, 0.7, 0.9]} />
        <meshStandardMaterial color="#7BC043" />
      </mesh>
    </group>
  );
}

/* ── Lv.4 큰 나무 ──────────────────────────── */
function BigTree() {
  return (
    <group>
      <mesh position={[0, 0.7, 0]}>
        <boxGeometry args={[0.5, 1.4, 0.5]} />
        <meshStandardMaterial color="#5C3317" />
      </mesh>
      <mesh position={[0, 1.8, 0]}>
        <boxGeometry args={[2, 0.9, 2]} />
        <meshStandardMaterial color="#4A8C1C" />
      </mesh>
      <mesh position={[0, 2.6, 0]}>
        <boxGeometry args={[1.4, 0.8, 1.4]} />
        <meshStandardMaterial color="#5B9E2D" />
      </mesh>
      <mesh position={[0, 3.2, 0]}>
        <boxGeometry args={[0.8, 0.6, 0.8]} />
        <meshStandardMaterial color="#7BC043" />
      </mesh>
      <mesh position={[0.6, 2.8, 0.5]}>
        <boxGeometry args={[0.25, 0.25, 0.25]} />
        <meshStandardMaterial color="#FFB7C5" />
      </mesh>
      <mesh position={[-0.5, 2.2, -0.4]}>
        <boxGeometry args={[0.25, 0.25, 0.25]} />
        <meshStandardMaterial color="#FFB7C5" />
      </mesh>
    </group>
  );
}

/* ── Lv.5 세계수 ────────────────────────────── */
function WorldTree() {
  return (
    <group>
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[0.7, 2, 0.7]} />
        <meshStandardMaterial color="#4A2810" />
      </mesh>
      <mesh position={[0.4, 0.15, 0.3]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#5C3317" />
      </mesh>
      <mesh position={[-0.4, 0.15, -0.3]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#5C3317" />
      </mesh>
      <mesh position={[0, 2.5, 0]}>
        <boxGeometry args={[2.6, 1, 2.6]} />
        <meshStandardMaterial color="#3D7A0F" />
      </mesh>
      <mesh position={[0, 3.3, 0]}>
        <boxGeometry args={[2, 0.8, 2]} />
        <meshStandardMaterial color="#4A8C1C" />
      </mesh>
      <mesh position={[0, 4, 0]}>
        <boxGeometry args={[1.4, 0.7, 1.4]} />
        <meshStandardMaterial color="#5B9E2D" />
      </mesh>
      <mesh position={[0, 4.5, 0]}>
        <boxGeometry args={[0.8, 0.5, 0.8]} />
        <meshStandardMaterial color="#7BC043" />
      </mesh>
      <mesh position={[1, 3.5, 0.8]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#FFB7C5" />
      </mesh>
      <mesh position={[-0.8, 2.9, -0.7]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#FFD700" />
      </mesh>
      <mesh position={[0.7, 3.8, -0.6]}>
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial color="#FFB7C5" />
      </mesh>
      <mesh position={[1.2, 4.2, 0]}>
        <boxGeometry args={[0.25, 0.2, 0.3]} />
        <meshStandardMaterial color="#5DADE2" />
      </mesh>
    </group>
  );
}

/* ── 나무 꼭대기 높이 (닉네임 라벨 위치용) ───── */
const treeLabelY: Record<number, number> = {
  1: 0.9,
  2: 1.6,
  3: 2.8,
  4: 4.0,
  5: 5.3,
};

const treeByLevel: Record<number, () => React.JSX.Element> = {
  1: SeedTree,
  2: SproutTree,
  3: YoungTree,
  4: BigTree,
  5: WorldTree,
};

/* ── 둥둥 떠다니는 닉네임 라벨 ──────────────── */
function FloatingLabel({
  nickname,
  baseY,
  seed,
  onClick,
}: {
  nickname: string;
  baseY: number;
  seed: number;
  onClick: () => void;
}) {
  const ref = useRef<Group>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y =
      baseY + Math.sin(clock.getElapsedTime() * 1.2 + seed) * 0.15;
  });

  return (
    <group ref={ref} position={[0, baseY, 0]}>
      <Html center distanceFactor={15}>
        <div
          onClick={onClick}
          style={{
            background: "rgba(255, 255, 255, 0.88)",
            padding: "3px 10px",
            borderRadius: "10px",
            fontSize: "11px",
            fontWeight: 600,
            whiteSpace: "nowrap",
            color: "#3D5C3A",
            textAlign: "center",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            backdropFilter: "blur(4px)",
            cursor: "pointer",
          }}
        >
          {nickname}
        </div>
      </Html>
    </group>
  );
}

/* ── 클릭 영역 확대용 히트박스 ──────────────── */
const hitboxHeight: Record<number, number> = {
  1: 1.0,
  2: 1.5,
  3: 2.5,
  4: 3.5,
  5: 5.0,
};

function HitBox({ level }: { level: number }) {
  const h = hitboxHeight[level] ?? 2;
  return (
    <mesh position={[0, h / 2, 0]} visible={false}>
      <boxGeometry args={[2, h, 2]} />
      <meshBasicMaterial />
    </mesh>
  );
}

export default function VoxelTree({ user, onSelect, surfaceY = 0, hideLabels = false }: Props) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const baseY = surfaceY;
  const targetY = baseY + (hovered ? 0.3 : 0);

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.position.y +=
      (targetY - groupRef.current.position.y) * 0.1;
  });

  const TreeComponent = treeByLevel[user.treeLevel] ?? SeedTree;
  const labelY = treeLabelY[user.treeLevel] ?? 1.5;
  const seed = parseInt(user.id.replace("forest-", ""), 10) || 0;

  return (
    <group
      ref={groupRef}
      position={[user.x, baseY, user.y]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
        onSelect(user);
      }}
    >
      <HitBox level={user.treeLevel} />
      <TreeComponent />
      {!hideLabels && (
        <FloatingLabel
          nickname={user.nickname}
          baseY={labelY}
          seed={seed}
          onClick={() => onSelect(user)}
        />
      )}
    </group>
  );
}
