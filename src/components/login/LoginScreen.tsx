"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useAuth } from "@/context/AuthContext";
import VoxelEarth from "./VoxelEarth";

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 48 48">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export default function LoginScreen() {
  const { signInWithGoogle } = useAuth();

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gradient-to-b from-[#0B1120] via-[#162040] to-[#1A3050]">
      {/* 별 배경 장식 */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: 0.3 + Math.random() * 0.5,
              animation: `twinkle ${2 + Math.random() * 3}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* 3D 복셀 지구 */}
      <div className="relative h-[350px] w-[350px] sm:h-[420px] sm:w-[420px]">
        <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
          <ambientLight intensity={0.4} />
          <directionalLight position={[5, 5, 5]} intensity={1.2} />
          <directionalLight position={[-3, -2, -3]} intensity={0.3} />
          <VoxelEarth />
          <OrbitControls
            enableZoom={false}
            enablePan={false}
            autoRotate={false}
          />
        </Canvas>
      </div>

      {/* 텍스트 */}
      <div className="mt-2 text-center">
        <h1
          className="text-4xl font-bold tracking-wide text-white sm:text-5xl"
          style={{ fontFamily: "var(--font-caveat)" }}
        >
          Dear Earth
        </h1>
        <p className="mt-2 text-sm text-white/60">
          친애하는 지구에게, 오늘의 식탁을 기록합니다
        </p>
      </div>

      {/* Google 로그인 버튼 */}
      <button
        onClick={signInWithGoogle}
        className="mt-8 flex cursor-pointer items-center gap-3 rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-gray-700 shadow-lg transition-all hover:scale-105 hover:shadow-xl active:scale-95"
      >
        <GoogleIcon />
        Google로 시작하기
      </button>
    </div>
  );
}
