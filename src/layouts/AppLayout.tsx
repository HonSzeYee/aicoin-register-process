import React, { useCallback, useMemo, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import SettingsPanel from "@/components/SettingsPanel";
import { useAppState } from "@/context/AppStateContext";
import { useScrollTakeoverContext } from "@/context/ScrollTakeoverContext";
import { buildSections, sectionProgress } from "@/lib/onboardingSections";
import {
  LayoutDashboard,
  KeyRound,
  Code2,
  Wrench,
  GitPullRequest,
  HelpCircle,
  Settings,
  Search,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type GlobalHeaderProps = {
  collapsed: boolean;
  takenOver: boolean;
  isScrolling: boolean;
  query: string;
  userName: string;
  onQueryChange: (value: string) => void;
  onOpenSettings: () => void;
};

const GlobalHeader = React.memo(function GlobalHeader({
  collapsed,
  takenOver,
  isScrolling,
  query,
  userName,
  onQueryChange,
  onOpenSettings,
}: GlobalHeaderProps) {
  const transitionClass = isScrolling
    ? "transition-none"
    : "transition-[opacity,transform] duration-200";
  const willChangeClass = takenOver || isScrolling ? "will-change-[transform]" : "";
  return (
    <header
      className={`sticky top-0 z-20 border-b ${transitionClass} ${willChangeClass} ${
        takenOver
          ? "opacity-0 -translate-y-full pointer-events-none backdrop-blur-none"
          : collapsed
            ? "bg-background/95 shadow-sm backdrop-blur"
            : "bg-background/80 backdrop-blur"
      }`}
    >
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-200 ${
          collapsed ? "py-2 gap-2" : "py-3 gap-3"
        }`}
      >
        <div className={`flex items-center ${collapsed ? "gap-2" : "gap-3"}`}>
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl border shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          {collapsed ? (
            <div className="flex items-center gap-2">
              <div className="text-sm font-semibold leading-tight">AICoin · 新人入职指南</div>
            </div>
          ) : (
            <div>
              <div className="text-sm text-muted-foreground">AICoin</div>
              <div className="text-lg font-semibold leading-tight">新人入职指南</div>
            </div>
          )}
        </div>

        <div className={`flex items-center ${collapsed ? "gap-2" : "gap-3"}`}>
          <div
            className={`hidden md:flex items-center gap-2 rounded-2xl border px-3 shadow-sm transition-all duration-200 ${
              collapsed ? "py-1.5" : "py-2"
            }`}
          >
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="搜索步骤 / 工具 / 关键词"
              className={`h-7 border-0 p-0 shadow-none focus-visible:ring-0 transition-all duration-200 ${
                collapsed ? "w-[180px]" : "w-[260px]"
              }`}
            />
          </div>
          <Button variant="outline" size="icon" className="rounded-2xl" onClick={onOpenSettings}>
            <Settings className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 rounded-2xl border px-3 py-2 shadow-sm">
            <div className="hidden sm:block">
              <div className="text-sm font-medium leading-tight">{userName}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
});

GlobalHeader.displayName = "GlobalHeader";

const NAV = [
  { id: "dashboard", label: "入职总览", icon: LayoutDashboard, path: "/" },
  { id: "accounts", label: "账号注册", icon: KeyRound, path: "/accounts" },
  { id: "dev", label: "开发指南", icon: Code2, path: "/dev" },
  { id: "tools", label: "软件使用", icon: Wrench, path: "/tools" },
  { id: "workflow", label: "工作流程", icon: GitPullRequest, path: "/workflow" },
  { id: "faq", label: "常见问题", icon: HelpCircle, path: "/faq" },
] as const;

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, searchQuery, setSearchQuery, accountItems, devReadMap } = useAppState();
  const { takenOver: scrolledPast, isScrolling } = useScrollTakeoverContext();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isSubpage = useMemo(() => {
    return location.pathname.startsWith("/accounts") || location.pathname.startsWith("/dev");
  }, [location.pathname]);
  const headerCollapsed = scrolledPast;
  const globalTakenOver = isSubpage && scrolledPast;

  const sections = useMemo(() => buildSections(accountItems, devReadMap), [accountItems, devReadMap]);
  const overall = useMemo(() => {
    const totals = sections.map(sectionProgress);
    const total = totals.reduce((a, b) => a + b.total, 0);
    const done = totals.reduce((a, b) => a + b.done, 0);
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, pct };
  }, [sections]);

  const handleQueryChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, [setSearchQuery]);

  const isActivePath = useCallback(
    (path: string) => {
      if (path === "/") return location.pathname === "/";
      return location.pathname.startsWith(path);
    },
    [location.pathname]
  );

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader
        collapsed={headerCollapsed}
        takenOver={globalTakenOver}
        query={searchQuery}
        userName={userName}
        isScrolling={isScrolling}
        onQueryChange={handleQueryChange}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <div
        className={`mx-auto flex max-w-7xl px-4 py-6 transition-[gap] duration-200 ${
          sidebarCollapsed ? "gap-2 md:gap-3" : "gap-4"
        }`}
      >
        <aside
          className={`md:sticky md:top-20 md:h-[calc(100vh-5rem)] transition-all duration-300 ease-in-out will-change-[width] ${
            sidebarCollapsed ? "w-[52px]" : "w-[220px]"
          } shrink-0`}
        >
          {sidebarCollapsed ? (
            <div className="flex h-full flex-col items-center pt-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg"
                onClick={() => setSidebarCollapsed(false)}
                title="展开侧边栏"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <Card className="rounded-2xl shadow-sm">
                <CardHeader className="pb-3 transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base transition-opacity duration-300">导航</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 shrink-0 rounded-lg"
                      onClick={() => setSidebarCollapsed(true)}
                      title="收起侧边栏"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-1 transition-all duration-300">
                  {NAV.map((n) => {
                    const Icon = n.icon;
                    const active = isActivePath(n.path);
                    return (
                      <button
                        key={n.id}
                        onClick={() => navigate(n.path)}
                        className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm transition-colors ${
                          active ? "bg-accent text-accent-foreground" : "hover:bg-accent/60"
                        }`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span
                          className={`flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis transition-opacity duration-500 ${
                            sidebarCollapsed ? "opacity-0 pointer-events-none select-none" : "opacity-100"
                          }`}
                        >
                          {n.label}
                        </span>
                        <span
                          className={`text-xs text-muted-foreground transition-opacity duration-500 ${
                            sidebarCollapsed || n.id === "dashboard"
                              ? "opacity-0 pointer-events-none select-none"
                              : "opacity-100"
                          }`}
                        >
                          →
                        </span>
                      </button>
                    );
                  })}
                </CardContent>
              </Card>

              <div className="mt-4 transition-all duration-300">
                <Card className="rounded-2xl shadow-sm">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">总进度</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">已完成</div>
                      <div className="text-sm font-medium">
                        {overall.done} / {overall.total}
                      </div>
                    </div>
                    <Progress value={clamp(overall.pct, 0, 100)} />
                    <div className="text-xs text-muted-foreground">完成度 {overall.pct}%</div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </aside>

        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      <div className="md:hidden px-4 pb-6">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索步骤 / 工具 / 关键词"
                className="rounded-2xl"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </div>
  );
}
