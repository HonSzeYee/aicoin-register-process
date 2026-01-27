import React, { useMemo, useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import AccountsRegistrationPage from "./AccountsRegistrationPage";
import DevGuidePage from "./DevGuidePage";
import SettingsPanel from "@/components/SettingsPanel";
import WelcomeDialog from "@/components/WelcomeDialog";
import RoleDescriptionDialog from "@/components/RoleDescriptionDialog";
import { detectDeviceType, DeviceRole } from "@/lib/deviceDetection";
import { useScrollTakeoverContext } from "@/context/ScrollTakeoverContext";
import {
  LayoutDashboard,
  KeyRound,
  Code2,
  Wrench,
  GitPullRequest,
  HelpCircle,
  Settings,
  Search,
  ArrowRight,
  CheckCircle2,
  Circle,
  Lock,
  CalendarClock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

type Role = "PC" | "iOS" | "Android" | "PM" | "QA";

type ChecklistItem = {
  id: string;
  title: string;
  etaMinutes?: number;
  done: boolean;
  locked?: boolean;
};

type Section = {
  id: string;
  title: string;
  icon: React.ReactNode;
  items: ChecklistItem[];
};

type UpdateItem = {
  id: string;
  date: string;
  title: string;
  tag?: string;
};

const ROLE_BADGE: Record<Role, string> = {
  PC: "PC 端",
  iOS: "iOS",
  Android: "Android",
  PM: "产品",
  QA: "测试",
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function sectionProgress(section: Section) {
  const total = section.items.length;
  const done = section.items.filter((i) => i.done).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return { total, done, pct };
}

function pickNextAction(sections: Section[]) {
  for (const s of sections) {
    const item = s.items.find((i) => !i.done && !i.locked);
    if (item) return { section: s, item };
  }
  return null;
}

const devGuideStorageKey = "dev-guide-read";

const NAV = [
  { id: "dashboard", label: "入职总览", icon: LayoutDashboard },
  { id: "accounts", label: "账号注册", icon: KeyRound },
  { id: "dev", label: "开发指南", icon: Code2 },
  { id: "tools", label: "软件使用", icon: Wrench },
  { id: "workflow", label: "工作流程", icon: GitPullRequest },
  { id: "faq", label: "常见问题", icon: HelpCircle },
] as const;

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
  const transitionClass = isScrolling ? "transition-none" : "transition-[opacity,transform] duration-200";
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
          <Button
            variant="outline"
            size="icon"
            className="rounded-2xl"
            onClick={onOpenSettings}
          >
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

export default function AICoinOnboardingDashboard() {
  const [user, setUser] = useState(() => {
    const detectedDevice = detectDeviceType(); // PC | iOS | Android
    // 从 localStorage 读取保存的名字，如果没有则使用默认值
    const savedName =
      typeof window !== "undefined" ? localStorage.getItem("userName") : null;
    return {
      name: savedName || "新用户",
      role: "PM" as Role, // 固定为产品经理
      deviceType: detectedDevice, // 设备类型：PC | iOS | Android
    };
  });

  // 监听 localStorage 变化，更新用户名
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorageChange = () => {
      const savedName = localStorage.getItem("userName");
      if (savedName) {
        setUser((prev) => ({ ...prev, name: savedName }));
      }
    };
    // 监听 storage 事件（跨标签页同步）
    window.addEventListener("storage", handleStorageChange);
    // 定期检查（同标签页更新）
    const interval = setInterval(handleStorageChange, 500);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const [sections, setSections] = useState<Section[]>(() => {
    const loadDevRead = () => {
      if (typeof window === "undefined") return {};
      try {
        const stored = window.localStorage.getItem(devGuideStorageKey);
        if (!stored) return {};
        return JSON.parse(stored) as Record<string, boolean>;
      } catch {
        return {};
      }
    };

    const devReadMap = loadDevRead();

    const savedChecklist = (() => {
      if (typeof window === "undefined") return null;
      try {
        const stored = window.localStorage.getItem("accounts-registration-checklist");
        if (!stored) return null;
        return JSON.parse(stored) as ChecklistItem[];
      } catch {
        return null;
      }
    })();

    const accountDoneMap = savedChecklist
      ? Object.fromEntries(savedChecklist.map((it) => [it.id, it.done]))
      : {};

    return [
      {
        id: "accounts",
        title: "账号注册",
        icon: <KeyRound className="h-4 w-4" />,
        items: [
          {
            id: "corp-email",
            title: "查找企业邮箱",
            etaMinutes: 3,
            done: accountDoneMap["corp-email"] ?? true,
          },
          {
            id: "vpn",
            title: "安装翻墙软件",
            etaMinutes: 8,
            done: accountDoneMap["vpn"] ?? false,
          },
          {
            id: "aicoin",
            title: "安装 AICoin 软件",
            etaMinutes: 5,
            done: accountDoneMap["aicoin"] ?? false,
          },
          {
            id: "itask",
            title: "注册 iTask 账号",
            etaMinutes: 5,
            done: accountDoneMap["itask"] ?? false,
          },
          {
            id: "gitlab",
            title: "注册 GitLab 账号",
            etaMinutes: 5,
            done: accountDoneMap["gitlab"] ?? false,
          },
          {
            id: "figma",
            title: "注册 Figma 账号",
            etaMinutes: 4,
            done: accountDoneMap["figma"] ?? false,
          },
          {
            id: "wechat",
            title: "加入企业微信群",
            etaMinutes: 6,
            done: accountDoneMap["wechat"] ?? false,
          },
        ],
      },
      {
        id: "dev",
        title: "开发指南",
        icon: <Code2 className="h-4 w-4" />,
        items: [
          { id: "env-read", title: "开发环境搭建", etaMinutes: 8, done: !!devReadMap["env"] },
          { id: "flow-read", title: "整体流程", etaMinutes: 6, done: !!devReadMap["flow"] },
          { id: "branch-read", title: "GitLab 分支规范", etaMinutes: 6, done: !!devReadMap["branch"] },
          { id: "commit-read", title: "Commit 规范", etaMinutes: 5, done: !!devReadMap["commit"] },
          { id: "common", title: "通用开发规范（分支 / MR / Review）", etaMinutes: 10, done: false },
          { id: "android-setup", title: "Android 环境搭建", etaMinutes: 20, done: false, locked: false },
          { id: "android-run", title: "Android 项目启动与运行", etaMinutes: 15, done: false, locked: false },
          { id: "android-faq", title: "Android 常见问题", etaMinutes: 8, done: false, locked: false },
        ],
      },
      {
        id: "tools",
        title: "软件使用",
        icon: <Wrench className="h-4 w-4" />,
        items: [
          { id: "figma-use", title: "Figma：看稿、标注、切图规则", etaMinutes: 12, done: false },
          { id: "itask-use", title: "iTask：任务状态流转与协作", etaMinutes: 10, done: false },
          { id: "gitlab-use", title: "GitLab：提 MR 与 Code Review", etaMinutes: 12, done: false },
        ],
      },
      {
        id: "workflow",
        title: "工作流程",
        icon: <GitPullRequest className="h-4 w-4" />,
        items: [
          { id: "demo-flow", title: "Demo 版本工作流程", etaMinutes: 10, done: false },
          { id: "classic-flow", title: "传统版本工作流程", etaMinutes: 12, done: false },
        ],
      },
    ];
  });

  const applyDevRead = (readMap: Record<string, boolean>) => {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== "dev") return s;
        return {
          ...s,
          items: s.items.map((it) => {
            if (it.id === "env-read") return { ...it, done: !!readMap.env };
            if (it.id === "flow-read") return { ...it, done: !!readMap.flow };
            if (it.id === "branch-read") return { ...it, done: !!readMap.branch };
            if (it.id === "commit-read") return { ...it, done: !!readMap.commit };
            return it;
          }),
        };
      })
    );
  };

  const [updates] = useState<UpdateItem[]>([
    { id: "u1", date: "2026-01-18", title: "更新：Android 环境搭建说明（Gradle 镜像）", tag: "开发" },
    { id: "u2", date: "2026-01-15", title: "新增：Demo 版本工作流程说明", tag: "流程" },
    { id: "u3", date: "2026-01-12", title: "补充：GitLab MR 命名规范示例", tag: "工具" },
  ]);

  const nextAction = useMemo(() => pickNextAction(sections), [sections]);

  const overall = useMemo(() => {
    const totals = sections.map(sectionProgress);
    const total = totals.reduce((a, b) => a + b.total, 0);
    const done = totals.reduce((a, b) => a + b.done, 0);
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, pct };
  }, [sections]);

  const [activeNav, setActiveNav] = useState<(typeof NAV)[number]["id"]>("dashboard");
  const [query, setQuery] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  
  // 检查是否是第一次访问（没有设置名字）
  const [showWelcome, setShowWelcome] = useState(() => {
    if (typeof window === "undefined") return false;
    const savedName = localStorage.getItem("userName");
    return !savedName;
  });

  function toggleItem(sectionId: string, itemId: string) {
    setSections((prev) =>
      prev.map((s) => {
        if (s.id !== sectionId) return s;
        return {
          ...s,
          items: s.items.map((it) => {
            if (it.id !== itemId) return it;
            if (it.locked) return it;
            return { ...it, done: !it.done };
          }),
        };
      })
    );
  }

  useEffect(() => {
    if (typeof window === "undefined") return;
    const accounts = sections.find((s) => s.id === "accounts");
    if (!accounts) return;
    const payload = accounts.items.map(({ id, title, etaMinutes, done }) => ({
      id,
      title,
      etaMinutes,
      done,
    }));
    try {
      window.localStorage.setItem("accounts-registration-checklist", JSON.stringify(payload));
    } catch {
      // ignore storage errors
    }
  }, [sections]);

  // 当从子页面返回 dashboard 时，重新读取 localStorage 更新状态，确保数据同步
  useEffect(() => {
    if (activeNav === "dashboard" && typeof window !== "undefined") {
      try {
        const stored = window.localStorage.getItem("accounts-registration-checklist");
        if (stored) {
          const parsed = JSON.parse(stored) as ChecklistItem[];
          const accountDoneMap = Object.fromEntries(parsed.map((it) => [it.id, it.done]));
          
          setSections((prev) =>
            prev.map((s) => {
              if (s.id !== "accounts") return s;
              // 只有当状态真的改变时才更新，避免不必要的渲染（虽然 React 会处理）
              const hasChanges = s.items.some(it => (accountDoneMap[it.id] ?? it.done) !== it.done);
              if (!hasChanges) return s;

              return {
                ...s,
                items: s.items.map((it) => ({
                  ...it,
                  done: accountDoneMap[it.id] ?? it.done,
                })),
              };
            })
          );
        }
      } catch {
        // ignore
      }
    }
  }, [activeNav]);

  const filteredSections = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sections;
    return sections
      .map((s) => ({
        ...s,
        items: s.items.filter((i) => i.title.toLowerCase().includes(q)),
      }))
      .filter((s) => s.items.length > 0);
  }, [sections, query]);

  // 顶栏滚动状态：收起成单行
  const { takenOver: scrolledPast, isScrolling } = useScrollTakeoverContext();
  const headerCollapsed = scrolledPast;

  const isSubpage = useMemo(
    () => activeNav === "accounts" || activeNav === "dev",
    [activeNav]
  );
  const takenOver = useMemo(() => isSubpage && headerCollapsed, [isSubpage, headerCollapsed]);

  const handleNameChange = useCallback(() => {
    if (typeof window === "undefined") return;
    const savedName = localStorage.getItem("userName");
    if (savedName) {
      setUser((prev) => ({ ...prev, name: savedName }));
    }
  }, []);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const handleOpenSettings = useCallback(() => {
    setSettingsOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <GlobalHeader
        collapsed={headerCollapsed}
        takenOver={takenOver}
        query={query}
        userName={user.name}
        isScrolling={isScrolling}
        onQueryChange={handleQueryChange}
        onOpenSettings={handleOpenSettings}
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
                    <CardTitle className="text-base transition-opacity duration-300">
                      导航
                    </CardTitle>
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
                    const active = activeNav === n.id;
                    return (
                      <button
                        key={n.id}
                        onClick={() => setActiveNav(n.id)}
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
        {activeNav === "dashboard" && (
          <div className="space-y-4">
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">👋 欢迎你</div>
                  <div className="text-2xl font-semibold tracking-tight">{user.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    你当前的角色是 <span className="font-medium text-foreground">产品经理</span>。
                    下面是你的入职进度与下一步建议。
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    className="rounded-2xl" 
                    variant="outline"
                    onClick={() => setRoleDialogOpen(true)}
                  >
                    查看角色说明
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <ArrowRight className="h-4 w-4" /> 下一步推荐行动
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {nextAction ? (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">建议你优先完成：</div>
                    <div className="text-lg font-semibold">
                      {nextAction.section.title} · {nextAction.item.title}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarClock className="h-4 w-4" /> 预计耗时 {nextAction.item.etaMinutes ?? 5} 分钟
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-lg font-semibold">🎉 你已完成所有入职步骤</div>
                    <div className="text-sm text-muted-foreground">可以开始领取你的第一个任务了。</div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    className="rounded-2xl"
                    disabled={!nextAction}
                    onClick={() => {
                      if (!nextAction) return;
                      setActiveNav(nextAction.section.id as any);
                    }}
                  >
                    立刻去完成
                  </Button>
                  <Button className="rounded-2xl" variant="outline">
                    查看全部清单
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">入职进度概览</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-2">
                {sections.map((s) => {
                  const p = sectionProgress(s);
                  return (
                    <Card key={s.id} className="rounded-2xl">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground">
                            {s.icon}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <div className="font-medium">{s.title}</div>
                              <div className="text-sm text-muted-foreground">
                                {p.done} / {p.total}
                              </div>
                            </div>
                            <div className="mt-2">
                              <Progress value={clamp(p.pct, 0, 100)} />
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="text-xs text-muted-foreground">完成度 {p.pct}%</div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="rounded-2xl"
                            onClick={() => setActiveNav(s.id as any)}
                          >
                            进入
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="rounded-2xl shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">清单（可勾选示例）</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  这里展示“账号注册”等清单的交互方式。实际产品中可在各模块内展开完整指引页面。
                </div>

                {filteredSections.map((s, idx) => (
                  <div key={s.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-accent">
                          {s.icon}
                        </div>
                        <div className="font-medium">{s.title}</div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {sectionProgress(s).done} / {sectionProgress(s).total}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {s.items.slice(0, 6).map((it) => (
                        <button
                          key={it.id}
                          onClick={() => toggleItem(s.id, it.id)}
                          className="flex w-full items-center gap-2 rounded-2xl border bg-card px-3 py-2 text-left text-sm transition active:shadow-none"
                          title={it.locked ? "该步骤当前被锁定" : "点击切换完成状态"}
                        >
                          {it.locked ? (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          ) : it.done ? (
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          )}
                          <div className="flex-1">
                            <div className={`font-medium ${it.done ? "line-through text-muted-foreground" : "text-foreground"}`}>
                              {it.title}
                            </div>
                            <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                              {typeof it.etaMinutes === "number" && (
                                <span>预计 {it.etaMinutes} 分钟</span>
                              )}
                              {it.done && <span>已完成</span>}
                              {!it.done && !it.locked && <span>未完成</span>}
                              {it.locked && <span>已锁定</span>}
                            </div>
                          </div>
                        </button>
                      ))}

                      {s.items.length > 6 && (
                        <div className="px-3 py-2 text-xs text-muted-foreground">
                          还有 {s.items.length - 6} 项未展示…
                        </div>
                      )}
                    </div>

                    {idx !== filteredSections.length - 1 && <Separator className="my-2" />}
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2">
              <Card className="rounded-2xl shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">今日提示</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="rounded-2xl border p-3">
                    ⚠️ 提交代码前请先同步 <span className="font-medium">develop</span> 分支，避免冲突。
                  </div>
                  <div className="rounded-2xl border p-3">
                    💡 Demo 项目通常不走完整测试流程，但仍需保持 MR 规范。
                  </div>
                  <div className="rounded-2xl border p-3">
                    ✅ 不确定找谁？优先在 iTask 评论 @ 负责人，保留沟通记录。
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-2xl shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">最近更新</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {updates.slice(0, 5).map((u) => (
                    <div key={u.id} className="rounded-2xl border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-medium">{u.title}</div>
                        {u.tag && (
                          <Badge className="rounded-xl" variant="secondary">
                            {u.tag}
                          </Badge>
                        )}
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">{u.date}</div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full rounded-2xl">
                    查看更多更新
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="pb-6 text-center text-xs text-muted-foreground">
              建议把"步骤详情页"做成可维护的模块：目的说明 / 操作步骤 / 常见坑 / 负责人。
            </div>
          </div>
        )}

        {activeNav === "accounts" && (
          <AccountsRegistrationPage
            onBack={() => setActiveNav("dashboard")}
            onAllDone={() => setActiveNav("dev")}
          />
        )}

        {activeNav === "dev" && (
          <DevGuidePage
            onBack={() => setActiveNav("dashboard")}
            onDevReadChange={applyDevRead}
          />
        )}
        </main>
      </div>

      <div className="md:hidden px-4 pb-6">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索步骤 / 工具 / 关键词"
                className="rounded-2xl"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onNameChange={handleNameChange}
      />

      <WelcomeDialog
        open={showWelcome}
        onComplete={(name) => {
          setUser((prev) => ({ ...prev, name }));
          setShowWelcome(false);
        }}
      />

      <RoleDescriptionDialog
        open={roleDialogOpen}
        onClose={() => setRoleDialogOpen(false)}
      />
    </div>
  );
}
