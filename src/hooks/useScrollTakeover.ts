import { useEffect, useRef, useState } from "react";

type TakeoverOptions = {
  threshold?: number;
  hysteresis?: number;
  exitDelayMs?: number;
  minToggleIntervalMs?: number;
};

export default function useScrollTakeover(options: number | TakeoverOptions = 72) {
  const resolved =
    typeof options === "number" ? { threshold: options } : options;
  const threshold = resolved.threshold ?? 72;
  const hysteresis = resolved.hysteresis ?? 12;
  const exitDelayMs = resolved.exitDelayMs ?? 80;
  const minToggleIntervalMs = resolved.minToggleIntervalMs ?? 120;

  const [takenOver, setTakenOver] = useState(false);
  const ticking = useRef(false);
  const pendingOff = useRef<number | null>(null);
  const lastScrollY = useRef(0);
  const lastToggleAt = useRef(0);
  const takenOverRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    takenOverRef.current = takenOver;

    const clearPendingOff = () => {
      if (pendingOff.current !== null) {
        window.clearTimeout(pendingOff.current);
        pendingOff.current = null;
      }
    };

    const scheduleOff = () => {
      if (pendingOff.current !== null) return;
      pendingOff.current = window.setTimeout(() => {
        pendingOff.current = null;
        const y = window.scrollY;
        if (y < threshold - hysteresis) {
          const now = performance.now();
          if (now - lastToggleAt.current >= minToggleIntervalMs) {
            lastToggleAt.current = now;
            setTakenOver(false);
          }
        }
      }, exitDelayMs);
    };

    const update = () => {
      const y = window.scrollY;
      const lastY = lastScrollY.current;
      const direction = y > lastY ? "down" : y < lastY ? "up" : "none";
      lastScrollY.current = y;

      const shouldTake = y > threshold;
      const shouldRelease = y < threshold - hysteresis;
      const now = performance.now();

      if (!takenOverRef.current) {
        if (direction === "down" && shouldTake && now - lastToggleAt.current >= minToggleIntervalMs) {
          lastToggleAt.current = now;
          setTakenOver(true);
          return;
        }
        return;
      }

      if (direction === "up" && shouldRelease) {
        scheduleOff();
      } else {
        clearPendingOff();
      }
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        update();
        ticking.current = false;
      });
    };

    lastScrollY.current = window.scrollY;
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearPendingOff();
    };
  }, [threshold, hysteresis, exitDelayMs, minToggleIntervalMs]);

  useEffect(() => {
    takenOverRef.current = takenOver;
  }, [takenOver]);

  return takenOver;
}
