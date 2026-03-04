"use client";

import dynamic from "next/dynamic";
import TabShell from "@/components/tabs/TabShell";
import { useAuth } from "@/context/AuthContext";

const LoginScreen = dynamic(() => import("@/components/login/LoginScreen"), {
  ssr: false,
});

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-sage-300 border-t-sage-600" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="flex h-screen flex-col pb-20">
      <TabShell />
    </div>
  );
}
