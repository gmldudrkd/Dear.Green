"use client";

import { useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Header from "@/components/Header";
import BottomTabBar, { type TabId } from "./BottomTabBar";
import MyDearTab from "./MyDearTab";
import LiveGreenTab from "./LiveGreenTab";
import OurForestTab from "./OurForestTab";

const tabOrder: TabId[] = ["my-dear", "live-green", "our-forest"];

const tabComponents: Record<TabId, React.ComponentType> = {
  "my-dear": MyDearTab,
  "live-green": LiveGreenTab,
  "our-forest": OurForestTab,
};

export default function TabShell() {
  const [activeTab, setActiveTab] = useState<TabId>("my-dear");
  const directionRef = useRef(0);

  const handleTabChange = (tab: TabId) => {
    const prevIdx = tabOrder.indexOf(activeTab);
    const nextIdx = tabOrder.indexOf(tab);
    directionRef.current = nextIdx > prevIdx ? 1 : -1;
    setActiveTab(tab);
  };

  const ActiveComponent = tabComponents[activeTab];

  return (
    <div className="flex h-full flex-col">
      <Header />

      <main className="flex min-h-0 flex-1 flex-col items-center gap-8 overflow-x-hidden overflow-y-auto pb-4">
        <AnimatePresence mode="wait" custom={directionRef.current}>
          <motion.div
            key={activeTab}
            custom={directionRef.current}
            initial={{ x: directionRef.current > 0 ? "20%" : "-20%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: directionRef.current > 0 ? "-20%" : "20%", opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex w-full flex-1 flex-col items-center gap-8"
          >
            <ActiveComponent />
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomTabBar activeTab={activeTab} onChange={handleTabChange} />
    </div>
  );
}
