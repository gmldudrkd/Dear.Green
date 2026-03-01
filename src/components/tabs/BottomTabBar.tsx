"use client";

import { motion } from "framer-motion";

export type TabId = "my-dear" | "live-green" | "our-forest";

const tabs: { id: TabId; label: string; icon: string }[] = [
  { id: "my-dear", label: "My Dear", icon: "🌱" },
  { id: "live-green", label: "Live Green", icon: "📋" },
  { id: "our-forest", label: "Our Forest", icon: "🌲" },
];

interface Props {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}

export default function BottomTabBar({ activeTab, onChange }: Props) {
  return (
    <nav className="fixed bottom-0 left-1/2 z-20 w-full max-w-md -translate-x-1/2 border-t border-sand-200 bg-sand-50/95 backdrop-blur-sm pb-[env(safe-area-inset-bottom)]">
      <div className="flex">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChange(tab.id)}
              className="relative flex flex-1 flex-col items-center gap-0.5 py-2.5"
            >
              {active && (
                <motion.div
                  layoutId="tab-indicator"
                  className="absolute top-0 h-0.5 w-10 rounded-full bg-sage-500"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="text-lg">{tab.icon}</span>
              <span
                className={`text-[10px] ${active ? "font-semibold text-sage-600" : "text-earth-400"}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
