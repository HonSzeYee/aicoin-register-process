import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import AccountsRegistrationPage from "./AccountsRegistrationPage";
import {
  LayoutDashboard,
  KeyRound,
  Code2,
  Wrench,
  GitPullRequest,
  HelpCircle,
  Bell,
  Search,
  ArrowRight,
  CheckCircle2,
  Circle,
  Lock,
  CalendarClock,
  Sparkles,
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

const NAV = [
  { id: "dashboard", label: "入职总览", icon: LayoutDashboard },
  { id: "accounts", label: "账号注册", icon: KeyRound },
  { id: "dev", label: "开发指南", icon: Code2 },
  { id: "tools", label: "软件使用", icon: Wrench },
  { id: "workflow", label: "工作流程", icon: GitPullRequest },
  { id: "faq", label: "常见问题", icon: HelpCircle },
] as const;

export default function AICoinOnboardingDashboard() {
  const [user] = useState({
    name: "Han Si Yi",
    role: "Android" as Role,
  });

  const [sections, setSections] = useState<Section[]>(() => {
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

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border shadow-sm">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">AICoin</div>
              <div className="text-lg font-semibold leading-tight">新人入职指南</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 rounded-2xl border px-3 py-2 shadow-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索步骤 / 工具 / 关键词"
                className="h-7 w-[260px] border-0 p-0 shadow-none focus-visible:ring-0"
              />
            </div>
            <Button variant="outline" size="icon" className="rounded-2xl">
              <Bell className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-2 rounded-2xl border px-3 py-2 shadow-sm">
              <div className="hidden sm:block">
                <div className="text-sm font-medium leading-tight">{user.name}</div>
                <div className="text-xs text-muted-foreground leading-tight">{ROLE_BADGE[user.role]}</div>
              </div>
              <Badge className="rounded-xl" variant="secondary">
                {ROLE_BADGE[user.role]}
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-6 md:grid-cols-[260px_1fr]">
        <aside className="md:sticky md:top-20 md:h-[calc(100vh-5rem)]">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">导航</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1">
              {NAV.map((n) => {
                const Icon = n.icon;
                const active = activeNav === n.id;
                return (
                  <button
                    key={n.id}
                    onClick={() => setActiveNav(n.id)}
                    className={`flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm transition ${
                      active ? "bg-accent text-accent-foreground" : "hover:bg-accent/60"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="flex-1 text-left">{n.label}</span>
                    {n.id !== "dashboard" && <span className="text-xs text-muted-foreground">→</span>}
                  </button>
                );
              })}
            </CardContent>
          </Card>

          <div className="mt-4">
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
        </aside>

        {/* Main */}
        {activeNav === "dashboard" && (
          <main className="space-y-4">
            <Card className="rounded-2xl shadow-sm">
              <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-sm text-muted-foreground">👋 欢迎你</div>
                  <div className="text-2xl font-semibold tracking-tight">{user.name}</div>
                  <div className="mt-1 text-sm text-muted-foreground">
                    你当前的角色是 <span className="font-medium text-foreground">{ROLE_BADGE[user.role]}</span>。
                    下面是你的入职进度与下一步建议。
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="rounded-xl" variant="secondary">
                    {ROLE_BADGE[user.role]}
                  </Badge>
                  <Button className="rounded-2xl" variant="outline">
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
                    <Card key={s.id} className="rounded-2xl border shadow-none">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-accent">
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

                    <div className="rounded-2xl border p-2">
                      {s.items.slice(0, 6).map((it) => (
                        <button
                          key={it.id}
                          onClick={() => toggleItem(s.id, it.id)}
                          className="flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm hover:bg-accent/60"
                          title={it.locked ? "该步骤当前被锁定" : "点击切换完成状态"}
                        >
                          {it.locked ? (
                            <Lock className="h-4 w-4 text-muted-foreground" />
                          ) : it.done ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Circle className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className={`flex-1 ${it.done ? "line-through text-muted-foreground" : ""}`}>
                            {it.title}
                          </span>
                          {typeof it.etaMinutes === "number" && (
                            <span className="text-xs text-muted-foreground">{it.etaMinutes} 分钟</span>
                          )}
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
              建议把“步骤详情页”做成可维护的模块：目的说明 / 操作步骤 / 常见坑 / 负责人。
            </div>
          </main>
        )}

        {activeNav === "accounts" && (
          <AccountsRegistrationPage onBack={() => setActiveNav("dashboard")} />
        )}
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
    </div>
  );
}
