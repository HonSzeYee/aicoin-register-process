import React, { createContext, useContext, useMemo } from "react";
import useScrollTakeover from "@/hooks/useScrollTakeover";

type ScrollTakeoverState = {
  sentinelRef: React.RefObject<HTMLDivElement>;
  takenOver: boolean;
  isScrolling: boolean;
};

const ScrollTakeoverContext = createContext<ScrollTakeoverState | null>(null);

type ScrollTakeoverProviderProps = {
  children: React.ReactNode;
  threshold?: number;
  hysteresis?: number;
  exitDelayMs?: number;
  stopDelayMs?: number;
};

export function ScrollTakeoverProvider({
  children,
  threshold = 56,
  hysteresis = 12,
  exitDelayMs = 120,
  stopDelayMs = 120,
}: ScrollTakeoverProviderProps) {
  const { sentinelRef, takenOver, isScrolling } = useScrollTakeover({
    threshold,
    hysteresis,
    exitDelayMs,
    stopDelayMs,
  });

  const value = useMemo(
    () => ({ sentinelRef, takenOver, isScrolling }),
    [sentinelRef, takenOver, isScrolling]
  );

  return (
    <ScrollTakeoverContext.Provider value={value}>
      <div ref={sentinelRef} aria-hidden="true" className="h-px w-px" />
      {children}
    </ScrollTakeoverContext.Provider>
  );
}

export function useScrollTakeoverContext() {
  const ctx = useContext(ScrollTakeoverContext);
  if (!ctx) {
    throw new Error("useScrollTakeoverContext must be used within ScrollTakeoverProvider");
  }
  return ctx;
}
