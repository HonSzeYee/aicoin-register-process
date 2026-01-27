import React from "react";
import { Code2, GitPullRequest, KeyRound, Wrench } from "lucide-react";
import { AccountChecklistItem, DevReadMap } from "@/context/AppStateContext";

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

const DEV_READ_ITEMS = [
  { id: "env-read", title: "开发环境搭建", etaMinutes: 8, key: "env" },
  { id: "flow-read", title: "整体流程", etaMinutes: 6, key: "flow" },
  { id: "branch-read", title: "GitLab 分支规范", etaMinutes: 6, key: "branch" },
  { id: "commit-read", title: "Commit 规范", etaMinutes: 5, key: "commit" },
] as const;

const DEV_EXTRA_ITEMS: ChecklistItem[] = [
  {
    id: "common",
    title: "通用开发规范（分支 / MR / Review）",
    etaMinutes: 10,
    done: false,
  },
  { id: "android-setup", title: "Android 环境搭建", etaMinutes: 20, done: false },
  { id: "android-run", title: "Android 项目启动与运行", etaMinutes: 15, done: false },
  { id: "android-faq", title: "Android 常见问题", etaMinutes: 8, done: false },
];

const TOOL_ITEMS: ChecklistItem[] = [
  { id: "figma-use", title: "Figma：看稿、标注、切图规则", etaMinutes: 12, done: false },
  { id: "itask-use", title: "iTask：任务状态流转与协作", etaMinutes: 10, done: false },
  { id: "gitlab-use", title: "GitLab：提 MR 与 Code Review", etaMinutes: 12, done: false },
];

const WORKFLOW_ITEMS: ChecklistItem[] = [
  { id: "demo-flow", title: "Demo 版本工作流程", etaMinutes: 10, done: false },
  { id: "classic-flow", title: "传统版本工作流程", etaMinutes: 12, done: false },
];

export function buildSections(accountItems: AccountChecklistItem[], devReadMap: DevReadMap): Section[] {
  const devItems: ChecklistItem[] = [
    ...DEV_READ_ITEMS.map((item) => ({
      id: item.id,
      title: item.title,
      etaMinutes: item.etaMinutes,
      done: !!devReadMap[item.key],
    })),
    ...DEV_EXTRA_ITEMS,
  ];

  return [
    {
      id: "accounts",
      title: "账号注册",
      icon: <KeyRound className="h-4 w-4" />,
      items: accountItems,
    },
    {
      id: "dev",
      title: "开发指南",
      icon: <Code2 className="h-4 w-4" />,
      items: devItems,
    },
    {
      id: "tools",
      title: "软件使用",
      icon: <Wrench className="h-4 w-4" />,
      items: TOOL_ITEMS,
    },
    {
      id: "workflow",
      title: "工作流程",
      icon: <GitPullRequest className="h-4 w-4" />,
      items: WORKFLOW_ITEMS,
    },
  ];
}

export function sectionProgress(section: Section) {
  const total = section.items.length;
  const done = section.items.filter((i) => i.done).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return { total, done, pct };
}

export function pickNextAction(sections: Section[]) {
  for (const s of sections) {
    const item = s.items.find((i) => !i.done && !i.locked);
    if (item) return { section: s, item };
  }
  return null;
}

export const DEV_READ_ID_MAP: Record<string, keyof DevReadMap> = {
  "env-read": "env",
  "flow-read": "flow",
  "branch-read": "branch",
  "commit-read": "commit",
};

export type { Section, ChecklistItem };
