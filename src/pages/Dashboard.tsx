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
  pickNextAction,
  sectionProgress,
} from "@/lib/onboardingSections";
import {
  ArrowRight,
  CalendarClock,
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

export default function AiCoinOnboardingDashboard() {
  const navigate = useNavigate();
  const {
    userName,
    setUserName,
    accountItems,
    devReadMap,
    toolsRead,
    workflowRead,
  } = useAppState();

  const [roleDialogOpen, setRoleDialogOpen] = useState(false);
  const [showWelcome, setShowWelcome] = useState(userName === "新用户");
  const [activeCoreTask, setActiveCoreTask] = useState("prd");

  useEffect(() => {
    if (userName !== "新用户") setShowWelcome(false);
  }, [userName]);

  const sections = useMemo(
    () => buildSections(accountItems, devReadMap, toolsRead, workflowRead),
    [accountItems, devReadMap, toolsRead, workflowRead]
  );

  const nextAction = useMemo(() => pickNextAction(sections), [sections]);

  const handleGoToSection = useCallback(
    (sectionId: string) => {
      const path = SECTION_ROUTE_MAP[sectionId];
      if (path) navigate(path);
    },
    [navigate]
  );

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-2xl font-semibold tracking-tight">
              <span role="img" aria-label="wave">👋</span>
              <span>欢迎你，{userName}</span>
            </div>
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
            const canNavigate = !!SECTION_ROUTE_MAP[s.id];
            return (
              <Card
                key={s.id}
                className={`rounded-2xl transition ${
                  canNavigate ? "cursor-pointer hover:border-primary/40 hover:bg-primary/5" : ""
                }`}
                role={canNavigate ? "button" : undefined}
                tabIndex={canNavigate ? 0 : undefined}
                onClick={canNavigate ? () => handleGoToSection(s.id) : undefined}
                onKeyDown={
                  canNavigate
                    ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleGoToSection(s.id);
                        }
                      }
                    : undefined
                }
              >
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
                </CardContent>
              </Card>
            );
          })}
        </CardContent>
      </Card>

      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">核心任务逻辑图</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="split-tree">
            <div className="split-tree-nav">
              <button
                type="button"
                onClick={() => setActiveCoreTask("prd")}
                className={`split-tree-item ${activeCoreTask === "prd" ? "is-active" : ""}`}
              >
                <span className="split-tree-index">01</span>
                <span>撰写 PRD</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCoreTask("prototype")}
                className={`split-tree-item ${activeCoreTask === "prototype" ? "is-active" : ""}`}
              >
                <span className="split-tree-index">02</span>
                <span>制作原型图、部分设计图</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCoreTask("sync")}
                className={`split-tree-item ${activeCoreTask === "sync" ? "is-active" : ""}`}
              >
                <span className="split-tree-index">03</span>
                <span>需求同步，跟进开发、测试</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveCoreTask("accept")}
                className={`split-tree-item ${activeCoreTask === "accept" ? "is-active" : ""}`}
              >
                <span className="split-tree-index">04</span>
                <span>产品验收</span>
              </button>
            </div>

            <div className="split-tree-panel split-tree-panel--auto">
              {activeCoreTask === "prd" && (
                <div className="space-y-3">
                  <div className="split-tree-section">
                  <div className="split-tree-title">需求分析</div>
                    <p className="split-tree-paragraph">
                      问题/痛点/场景、需求目标
                    </p>
                  </div>
                  <div className="split-tree-section">
                    <div className="split-tree-title">竞品分析</div>
                    <p className="split-tree-paragraph">
                      确定竞品范围（具备xxx功能，参考xxx设计）、寻找并识别竞品、解构竞品的功能与设计、SWOT分析，确定产品方向
                    </p>
                  </div>
                  <div className="split-tree-section">
                    <div className="split-tree-title">产品策划</div>
                    <p className="split-tree-paragraph">
                      具体的功能点、串联起功能点的流程图
                    </p>
                  </div>
                </div>
              )}

              {activeCoreTask === "prototype" && (
                <div className="split-tree-section">
                  <div className="split-tree-title">原型与设计</div>
                  <p className="split-tree-paragraph">
                    将产品功能具像化、页面布局、交互逻辑
                  </p>
                </div>
              )}

              {activeCoreTask === "sync" && (
                <div className="split-tree-section">
                  <div className="split-tree-title">需求同步</div>
                  <p className="split-tree-paragraph">
                    需求讲解，信息同步至执行同事；需求跟进，信息同步至主管
                  </p>
                </div>
              )}

              {activeCoreTask === "accept" && (
                <div className="split-tree-section">
                  <div className="split-tree-title">产品验收</div>
                  <p className="split-tree-paragraph">
                    视觉效果是否符合预期；交互逻辑是否有 bug
                  </p>
                </div>
              )}
            </div>
          </div>
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
