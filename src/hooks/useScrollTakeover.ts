import { useEffect, useRef, useState } from "react";

type TakeoverOptions = {
  threshold?: number;
  hysteresis?: number;
  exitDelayMs?: number;
  stopDelayMs?: number;
};

export default function useScrollTakeover(options: number | TakeoverOptions = 72) {
  const resolved = typeof options === "number" ? { threshold: options } : options;
  const threshold = resolved.threshold ?? 72;
  const hysteresis = resolved.hysteresis ?? 12;
  const exitDelayMs = resolved.exitDelayMs ?? 120;
  const stopDelayMs = resolved.stopDelayMs ?? 120;

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const [takenOver, setTakenOver] = useState(false);
  const [observedOver, setObservedOver] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const pendingOff = useRef<number | null>(null);
  const scrollingRef = useRef(false);
  const stopTimer = useRef<number | null>(null);
  const ticking = useRef(false);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const marginBase = takenOver ? threshold - hysteresis : threshold;
    const margin = Math.max(marginBase, 0);

    const observer = new IntersectionObserver(
      ([entry]) => setObservedOver(!entry.isIntersecting),
      { root: null, rootMargin: `${margin}px 0px 0px 0px`, threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, hysteresis, takenOver]);

  useEffect(() => {
    if (observedOver) {
      if (pendingOff.current !== null) {
        window.clearTimeout(pendingOff.current);
        pendingOff.current = null;
      }
      setTakenOver(true);
      return;
    }

    if (pendingOff.current !== null) return;
    pendingOff.current = window.setTimeout(() => {
      pendingOff.current = null;
      setTakenOver(false);
    }, exitDelayMs);
  }, [observedOver, exitDelayMs]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        if (!scrollingRef.current) {
          scrollingRef.current = true;
          setIsScrolling(true);
        }
        if (stopTimer.current !== null) {
          window.clearTimeout(stopTimer.current);
        }
        stopTimer.current = window.setTimeout(() => {
          scrollingRef.current = false;
          setIsScrolling(false);
        }, stopDelayMs);
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (stopTimer.current !== null) {
        window.clearTimeout(stopTimer.current);
      }
    };
  }, [stopDelayMs]);

  return { sentinelRef, takenOver, isScrolling };
}
