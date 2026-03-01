"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

const DEFAULT_IP = 10;

interface PointsContextType {
  ip: number;
  addIP: (amount: number) => void;
  ready: boolean;
}

const PointsContext = createContext<PointsContextType>({
  ip: DEFAULT_IP,
  addIP: () => {},
  ready: false,
});

export function PointsProvider({ children }: { children: ReactNode }) {
  const [ip, setIP] = useState(DEFAULT_IP);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("dear-earth-ip");
    if (saved) setIP(Number(saved));
    setReady(true);
  }, []);

  const addIP = (amount: number) => {
    setIP((prev) => {
      const next = prev + amount;
      localStorage.setItem("dear-earth-ip", String(next));
      return next;
    });
  };

  return (
    <PointsContext.Provider value={{ ip, addIP, ready }}>
      {children}
    </PointsContext.Provider>
  );
}

export function usePoints() {
  return useContext(PointsContext);
}
