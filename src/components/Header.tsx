"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Header({ onLogoClick }: { onLogoClick?: () => void }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, loading, signInWithGoogle, signOut } = useAuth();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const displayName =
    user?.user_metadata?.full_name ??
    user?.user_metadata?.name ??
    user?.email?.split("@")[0] ??
    "사용자";
  const email = user?.email ?? "";
  const avatarUrl: string | undefined = user?.user_metadata?.avatar_url;

  const handleGoogleLogin = async () => {
    setMenuOpen(false);
    await signInWithGoogle();
  };

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut();
  };

  return (
    <header className="sticky top-0 z-30 bg-sand-50/90 px-6 py-4 backdrop-blur-sm">
      <div className="mx-auto flex max-w-md items-center justify-between">
        <button
          onClick={onLogoClick}
          className="cursor-pointer text-3xl font-bold text-earth-500"
          style={{ fontFamily: "var(--font-caveat)" }}
        >
          Dear Earth
        </button>

        {/* 프로필 아이콘 + 드롭다운 */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-sand-100"
          >
            {user && avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-8 w-8 rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="14" cy="14" r="13" fill="#5b9bd5" />
                <ellipse cx="10" cy="10" rx="5" ry="4" fill="#4a8c5c" opacity="0.8" transform="rotate(-10 10 10)" />
                <ellipse cx="18" cy="16" rx="4" ry="3" fill="#3a7d44" opacity="0.7" transform="rotate(15 18 16)" />
                <ellipse cx="12" cy="20" rx="3" ry="2" fill="#5a9c6c" opacity="0.6" transform="rotate(5 12 20)" />
                <circle cx="18" cy="7" r="2" fill="white" opacity="0.15" />
                <circle cx="14" cy="14" r="13" stroke="#4a8c5c" strokeWidth="1" fill="none" />
              </svg>
            )}
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-11 z-50 w-52 rounded-xl bg-white py-2 shadow-lg">
              {user ? (
                <>
                  <div className="border-b border-sand-100 px-4 py-2">
                    <div className="flex items-center gap-2">
                      {avatarUrl && (
                        <img
                          src={avatarUrl}
                          alt=""
                          className="h-6 w-6 rounded-full"
                          referrerPolicy="no-referrer"
                        />
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-earth-700">
                          {displayName}
                        </p>
                        <p className="truncate text-[10px] text-earth-400">
                          {email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left text-sm text-earth-600 hover:bg-sand-50"
                  >
                    로그아웃
                  </button>
                </>
              ) : (
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full px-4 py-2 text-left text-sm text-earth-600 hover:bg-sand-50 disabled:opacity-50"
                >
                  Google로 로그인
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
