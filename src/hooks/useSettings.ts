import { useEffect } from "react";

export function useSettingsInit() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 应用主题
    const theme = (localStorage.getItem("theme") || "system") as "light" | "dark" | "system";
    const root = document.documentElement;
    
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // system
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }

    // 监听系统主题变化
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        if (e.matches) {
          root.classList.add("dark");
        } else {
          root.classList.remove("dark");
        }
      }
    };
    mediaQuery.addEventListener("change", handleChange);

    // 应用字体大小
    const fontSize = (localStorage.getItem("fontSize") || "medium") as "small" | "medium" | "large";
    const fontSizeMap = {
      small: "14px",
      medium: "16px",
      large: "18px",
    };
    root.style.fontSize = fontSizeMap[fontSize];

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []);
}
