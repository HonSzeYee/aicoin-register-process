import React, { useState, useEffect } from "react";
import { useAppState } from "@/context/AppStateContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { X, Sun, Moon, Type, Minus, Plus, User } from "lucide-react";

type Theme = "light" | "dark" | "system";
type FontSize = "small" | "medium" | "large";

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ open, onClose }: SettingsPanelProps) {
  const { userName, setUserName } = useAppState();
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    const saved = localStorage.getItem("theme");
    return (saved as Theme) || "system";
  });

  const [fontSize, setFontSize] = useState<FontSize>(() => {
    if (typeof window === "undefined") return "medium";
    const saved = localStorage.getItem("fontSize");
    return (saved as FontSize) || "medium";
  });

  const [nameInput, setNameInput] = useState(userName);

  const handleSaveName = () => {
    setUserName(nameInput);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSaveName();
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem("theme", theme);
    localStorage.setItem("fontSize", fontSize);

    // 应用主题
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

    // 应用字体大小
    const fontSizeMap = {
      small: "14px",
      medium: "16px",
      large: "18px",
    };
    root.style.fontSize = fontSizeMap[fontSize];
  }, [theme, fontSize]);

  // 监听系统主题变化（仅在 system 模式下）
  useEffect(() => {
    if (typeof window === "undefined" || theme !== "system") return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      const root = document.documentElement;
      if (e.matches) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    };
    
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme]);

  useEffect(() => {
    setNameInput(userName);
  }, [userName]);

  if (!open) return null;

  const fontSizes: { value: FontSize; label: string }[] = [
    { value: "small", label: "小" },
    { value: "medium", label: "中" },
    { value: "large", label: "大" },
  ];

  const themes: { value: Theme; label: string; icon: React.ReactNode }[] = [
    { value: "light", label: "浅色", icon: <Sun className="h-4 w-4" /> },
    { value: "dark", label: "深色", icon: <Moon className="h-4 w-4" /> },
    { value: "system", label: "跟随系统", icon: <Type className="h-4 w-4" /> },
  ];

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* 设置面板 */}
      <div className="fixed right-0 top-0 z-50 h-full w-full max-w-md overflow-y-auto bg-background shadow-xl">
        <Card className="h-full rounded-none border-0 shadow-none">
          <CardHeader className="sticky top-0 z-10 border-b bg-background">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">设置</CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
            {/* 用户信息 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">用户名</div>
                  <div className="text-sm text-muted-foreground">设置你的显示名称</div>
                </div>
              </div>
              <Input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSaveName();
                  }
                }}
                onBlur={handleSaveName}
                placeholder="请输入你的名字"
                className="rounded-xl"
                maxLength={20}
              />
            </div>

            <Separator />

            {/* 颜色主题 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                  <Sun className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">颜色主题</div>
                  <div className="text-sm text-muted-foreground">选择浅色或深色主题</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {themes.map((t) => (
                  <button
                    key={t.value}
                    onClick={() => setTheme(t.value)}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-3 transition ${
                      theme === t.value
                        ? "border-primary bg-primary/10"
                        : "border-border hover:bg-accent"
                    }`}
                  >
                    {t.icon}
                    <span className="text-xs font-medium">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* 字体大小 */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary">
                  <Type className="h-4 w-4" />
                </div>
                <div>
                  <div className="font-medium">字体大小</div>
                  <div className="text-sm text-muted-foreground">调整页面文字大小</div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const sizes: FontSize[] = ["small", "medium", "large"];
                    const currentIndex = sizes.indexOf(fontSize);
                    if (currentIndex > 0) {
                      setFontSize(sizes[currentIndex - 1]);
                    }
                  }}
                  disabled={fontSize === "small"}
                  className="rounded-xl"
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <div className="flex flex-1 gap-2">
                  {fontSizes.map((fs) => (
                    <button
                      key={fs.value}
                      onClick={() => setFontSize(fs.value)}
                      className={`flex-1 rounded-xl border px-4 py-2 text-sm font-medium transition ${
                        fontSize === fs.value
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:bg-accent"
                      }`}
                    >
                      {fs.label}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const sizes: FontSize[] = ["small", "medium", "large"];
                    const currentIndex = sizes.indexOf(fontSize);
                    if (currentIndex < sizes.length - 1) {
                      setFontSize(sizes[currentIndex + 1]);
                    }
                  }}
                  disabled={fontSize === "large"}
                  className="rounded-xl"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="rounded-xl border p-4">
                <div className="text-sm text-muted-foreground">预览效果</div>
                <div className="mt-2 space-y-1">
                  <div className="text-lg font-semibold">标题文字</div>
                  <div className="text-base">正文内容示例</div>
                  <div className="text-sm text-muted-foreground">辅助文字</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
