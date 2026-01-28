import React, { useMemo, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import WelcomeDialog from "@/components/WelcomeDialog";
import RoleDescriptionDialog from "@/components/RoleDescriptionDialog";
import { useAppState } from "@/context/AppStateContext";
import {
  buildSections,
  DEV_READ_ID_MAP,
  pickNextAction,
  sectionProgress,
} from "@/lib/onboardingSections";
import {
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Circle,
  Lock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";


const SECTION_ROUTE_MAP: Record<string, string> = {
  accounts: "/accounts",
  dev: "/dev",
  tools: "/tools",
  workflow: "/workflow",
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function AICoinOnboardingDashboard() {
  const navigate = useNavigate();
  const {
    userName,
    setUserName,
    accountItems,
    toggleAccountItem,
    devReadMap,
    setDevRead,
    searchQuery,
  } = useAppState();

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(userName === "新用户");
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (userName !== "新用户") setShowWelcome(false);
  }, [userName]);

  const sections = useMemo(() => buildSections(accountItems, devReadMap), [accountItems, devReadMap]);

  const nextAction = useMemo(() => pickNextAction(sections), [sections]);

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sections;
    return sections
      .map((s) => ({
        ...s,
        items: s.items.filter((i) => i.title.toLowerCase().includes(q)),
      }))
      .filter((s) => s.items.length > 0);
  }, [sections, searchQuery]);

  const handleToggleItem = useCallback(
    (sectionId: string, itemId: string) => {
      if (sectionId === "accounts") {
        toggleAccountItem(itemId);
        return;
      }
      if (sectionId === "dev") {
        const key = DEV_READ_ID_MAP[itemId];
        if (!key) return;
        setDevRead(key, !devReadMap[key]);
      }
    },
    [toggleAccountItem, setDevRead, devReadMap]
  );

  const handleGoToSection = useCallback(
    (sectionId: string) => {
      const path = SECTION_ROUTE_MAP[sectionId];
      if (path) navigate(path);
    },
    [navigate]
  );

  const toggleSectionExpanded = useCallback((sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-sm text-muted-foreground">👋 欢迎你</div>
            <div className="text-2xl font-semibold tracking-tight">{userName}</div>
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
              disabled={!nextAction || !SECTION_ROUTE_MAP[nextAction.section.id]}
              onClick={() => {
                if (!nextAction) return;
                handleGoToSection(nextAction.section.id);
              }}
            >
              立刻去完成
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
                      disabled={!SECTION_ROUTE_MAP[s.id]}
                      onClick={() => handleGoToSection(s.id)}
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
                {(expandedSections.has(s.id) ? s.items : s.items.slice(0, 3)).map((it) => (
                  <button
                    key={it.id}
                    onClick={() => handleToggleItem(s.id, it.id)}
                    className="flex w-full items-center gap-2 rounded-2xl border bg-card px-3 py-2 text-left text-sm transition active:shadow-none"
                    title={it.locked ? "该步骤当前被锁定" : "点击切换完成状态"}
                  >
                    {it.locked ? (
                      <Lock className="h-4 w-4 text-muted-foreground" />
                    ) : it.done ? (
                      <CheckCircle2 className="h-4 w-4 text-[#2e7d32]" />
                    ) : (
                      <Circle className="h-4 w-4 text-muted-foreground" />
                    )}
                    <div className="flex-1">
                      <div
                        className={`font-medium ${
                          it.done ? "line-through text-muted-foreground" : "text-foreground"
                        }`}
                      >
                        {it.title}
                      </div>
                      <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                        {typeof it.etaMinutes === "number" && <span>预计 {it.etaMinutes} 分钟</span>}
                        {it.done && <span>已完成</span>}
                        {!it.done && !it.locked && <span>未完成</span>}
                        {it.locked && <span>已锁定</span>}
                      </div>
                    </div>
                  </button>
                ))}

                {s.items.length > 3 && (
                  <button
                    type="button"
                    onClick={() => toggleSectionExpanded(s.id)}
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs text-muted-foreground transition hover:text-foreground"
                  >
                    {expandedSections.has(s.id) ? (
                      <>
                        收起
                        <ChevronUp className="h-3 w-3" />
                      </>
                    ) : (
                      <>
                        展开全部
                        <ChevronDown className="h-3 w-3" />
                      </>
                    )}
                  </button>
                )}
              </div>

              {idx !== filteredSections.length - 1 && <Separator className="my-2" />}
            </div>
          ))}
        </CardContent>
      </Card>

      <WelcomeDialog
        open={showWelcome}
        onComplete={(name) => {
          setUserName(name);
          setShowWelcome(false);
        }}
      />

      <RoleDescriptionDialog open={roleDialogOpen} onClose={() => setRoleDialogOpen(false)} />
    </div>
  );
}
