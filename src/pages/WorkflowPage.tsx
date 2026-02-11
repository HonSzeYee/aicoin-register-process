import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, GitPullRequest } from "lucide-react";
import { useAppState } from "@/context/AppStateContext";

const DEMO_STEPS = [
  {
    title: "每周五同步 PRD 集合文档 10:30",
    detail:
      "每周五在「产品信息同步会」同步 PRD 集合文档中的最新任务，并确认自己负责的事项。",
  },
  {
    title: "创建 Issue（PM 仓库）12:30之前",
    detail:
      "在 GitLab 的「PM」仓库中创建新任务的 Issue，作为任务的唯一入口。",
  },
  {
    title: "iTask 自动关联",
    detail:
      "Issue 创建成功后会自动关联到 iTask，企业微信会收到 iTask 消息推送。",
  },
  {
    title: "填写节点负责人与时间 12:30之前",
    detail:
      "点击 iTask 消息链接，在 iTask 中填写每个节点的负责人、预计开始时间和预计结束时间。",
  },
  {
    title: "技术人员分配规则",
    detail:
      "若已分配技术人员，在对应技术节点填写技术人员名字；若是 demo 流程，则在技术节点填写自己的名字。",
  },
];

const DESIGN_STEPS = [
  {
    title: "第零周 · 周五",
    detail: [
      "领取需要负责编写的 PRD",
      "与需求提出者沟通清楚需要写的 PRD 的内容",
      "在 iTask 上设置需要写 PRD 的需求的节点，填写好产品工作的预计开始时间和预计结束时间",
    ],
  },
  {
    title: "第一周 · 周三",
    detail: ["12:00-提交 PRD", "PRD 审核路径：需求提出者--叶洁丽"],
  },
  {
    title: "第一周 · 周五",
    detail: [
      "10:30-开需求同步会，领取需要负责跟进的需求",
      "在 iTask 上设置好评审会通过的需求的节点，注意填写各部门节点和任务执行人",
      "在 iTask 上填写好研发和产品工作的预计开始时间和预计结束时间",
      "与需求提出者沟通清楚需要画原型、设计图的具体需求",
      "查找设计底稿（找 AI/卢淑婷/自行查找）",
    ],
  },
  {
    title: "第二周 · 周五",
    detail: [
      "提交审核原型/设计图",
      "原型图审核路径：需求提出者--叶洁丽",
      "设计稿审核路径：需求提出者--李辉全",
    ],
  },
  {
    title: "第三周 · 周一～周二",
    detail: [
      "周一 12:00-录屏 Figma 上需求演示的方式进行需求讲解",
      "确认需求团队，团队拉群（命名格式：发版日期_【PC/APP/WEB】+需求名称），群公告中放入需求 issue 链接/原型图/设计图/讲解录屏",
      "检查 iTask，跟进开发，在需求群同步信息至组负责人和需求提出者，如是否如期开始；是否延期，延期原因是什么",
      "周一-收集技术、测试反馈需求的结果，确认对需求是否有疑问，统一验收标准",
    ],
  },
  {
    title: "第四周 · 周一",
    detail: ["跟进测试团队反馈情况和进度", "18:00-汇报本周发版需求提测异常情况"],
  },
  {
    title: "第四周 · 周二",
    detail: ["12:00-提交本周发版的日志、弹窗", "完成 PC 端、APP 端的英文翻译"],
  },
  {
    title: "第四周 · 周三",
    detail: [
      "对本周需要发版的需求进行验收，包括产品验收和需求提出者验收",
      "18:00-汇报本周发版需求验收异常情况，需要明确是否可以按时发版",
      "如果不能确保，要找存在哪些问题影响发版，及时沟通处理",
      "如果要延期发版，说明原因，做好对应记录",
    ],
  },
  {
    title: "第四周 · 周四",
    detail: [
      "在 GitLab 产品建设申请中提交本周发版遗留事项 issue，assign 给叶总",
      "18:00-汇报本周发版情况",
      "18:00-发版本上线",
    ],
  },
  {
    title: "第四周 · 周五",
    detail: [
      "正式版验收，回溯需求情况",
      "18:00-在产品设计部群公告中的“产品需求复盘情况”文档中复盘本周发版情况（需求如期上线情况、问题、复盘原因）",
    ],
  },
  {
    title: "第五周 · 周一",
    detail: ["根据事业部回复的遗留事项 issue 情况，安排遗留事项需求走插入还是正常排期"],
  },
];

export default function WorkflowPage() {
  const navigate = useNavigate();
  const { setWorkflowRead } = useAppState();
  const [activeTab, setActiveTab] = useState<"demo" | "design">("demo");

  useEffect(() => {
    setWorkflowRead(true);
  }, [setWorkflowRead]);

  const steps = useMemo(
    () => (activeTab === "demo" ? DEMO_STEPS : DESIGN_STEPS),
    [activeTab]
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-4">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">工作流程</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
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
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab("demo")}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    activeTab === "demo"
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Demo 流程
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("design")}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    activeTab === "design"
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "border border-border text-muted-foreground hover:text-foreground"
                  }`}
                >
                  设计图流程
                </button>
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
                    className={`rounded-2xl border bg-card/60 p-3 shadow-sm transition interactive-glow ${
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
                      {Array.isArray(step.detail) ? (
                        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                          {step.detail.map((line) => (
                            <li key={line}>{line}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-sm text-muted-foreground">{step.detail}</div>
                      )}
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
