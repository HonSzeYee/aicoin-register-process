import React from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, ClipboardList, GitPullRequest } from "lucide-react";

const steps = [
  {
    title: "每周五同步 PRD 集合文档",
    detail:
      "每周五在「产品信息同步会」同步 PRD 集合文档中的最新任务，并确认自己负责的事项。",
  },
  {
    title: "创建 Issue（PM 仓库）",
    detail:
      "在 GitLab 的「PM」仓库中创建新任务的 Issue，作为任务的唯一入口。",
  },
  {
    title: "iTask 自动关联",
    detail:
      "Issue 创建成功后会自动关联到 iTask，企业微信会收到 iTask 消息推送。",
  },
  {
    title: "填写节点负责人与时间",
    detail:
      "点击 iTask 消息链接，在 iTask 中填写每个节点的负责人、预计开始时间和预计结束时间。",
  },
  {
    title: "技术人员分配规则",
    detail:
      "若已分配技术人员，在对应技术节点填写技术人员名字；若是 demo 流程，则在技术节点填写自己的名字。",
  },
  {
    title: "进入开发指南",
    detail: "最后参照「开发指南」继续操作。",
  },
];

export default function WorkflowPage() {
  const navigate = useNavigate();
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-4">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">工作流程</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Card className="rounded-2xl">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm font-semibold">流程概览</div>
                </div>
                <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                  {steps.map((step) => (
                    <li key={step.title}>{step.title}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card className="rounded-2xl">
              <CardContent className="space-y-3 p-4">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-muted-foreground" />
                  <div className="text-sm font-semibold">关键提醒</div>
                </div>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="rounded-xl border bg-card/60 px-3 py-2">
                    会议后立即创建 Issue，避免任务遗漏。
                  </div>
                  <div className="rounded-xl border bg-card/60 px-3 py-2">
                    iTask 技术节点负责人必须及时填写，便于技术部门进行排期规划。
                  </div>
                  <div className="rounded-xl border bg-card/60 px-3 py-2">
                    Demo 流程需在技术节点标注自己，确保责任归属明确。
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl">
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center gap-2">
                <GitPullRequest className="h-4 w-4 text-muted-foreground" />
                <div className="text-sm font-semibold">详细步骤</div>
              </div>
              <div className="space-y-3">
                {steps.map((step, index) => {
                  const isDevGuide = step.title === "进入开发指南";
                  return (
                    <div
                      key={step.title}
                      role={isDevGuide ? "button" : undefined}
                      tabIndex={isDevGuide ? 0 : undefined}
                      onClick={
                        isDevGuide ? () => navigate("/dev") : undefined
                      }
                      onKeyDown={
                        isDevGuide
                          ? (e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                navigate("/dev");
                              }
                            }
                          : undefined
                      }
                    className={`rounded-2xl border bg-card/60 p-3 shadow-sm transition hover:border-primary/60 hover:bg-primary/5 hover:shadow-[0_0_4px_0_rgba(109,76,255,0.14)] ${
                      isDevGuide ? "cursor-pointer" : ""
                    }`}
                  >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                          {index + 1}
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="text-sm font-medium text-foreground">
                            {step.title}
                          </div>
                          <div className="text-sm text-muted-foreground">{step.detail}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

        </CardContent>
      </Card>
    </div>
  );
}
