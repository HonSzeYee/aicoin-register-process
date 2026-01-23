import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Monitor,
  Smartphone,
  Tablet,
  Terminal,
  GitBranch,
  GitCommit,
  CheckCircle2,
  GitPullRequest,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import iOSTutorialImg from "@/assets/iOS-tutorial.png";
import androidTutorialImg from "@/assets/android-tutorial.png";
import pcTutorialImg from "@/assets/pc-tutorial.png";
import gitlabMrImg from "@/assets/gitlab-mr.png";
import gitlabCommitRulesImg from "@/assets/gitlab-commit-rules.png";
import gitlabCreateImg from "@/assets/gitlab-create.png";
import gitlabCreateBranchImg from "@/assets/gitlab-create-branch.png";

// 全局图查看回调占位，用于顶部静态内容触发弹窗
let lightboxSetter: ((src: string | null) => void) | null = null;
const openImage = (src: string) => {
  if (lightboxSetter) lightboxSetter(src);
};

// 定义数据结构
type Platform = "PC" | "iOS" | "Android";

const PLATFORMS: { id: Platform; label: string; icon: React.ElementType }[] = [
  { id: "PC", label: "PC 端", icon: Monitor },
  { id: "iOS", label: "iOS 端", icon: Tablet },
  { id: "Android", label: "Android 端", icon: Smartphone },
];

const SECTIONS = [
  { id: "env", title: "开发环境搭建", icon: Terminal },
  { id: "flow", title: "整体流程", icon: GitPullRequest },
  { id: "branch", title: "GitLab 分支规范", icon: GitBranch },
  { id: "commit", title: "Commit 规范", icon: GitCommit },
];

const branchContent = (
  <div className="space-y-4">
    <div className="rounded-2xl border bg-muted/30 px-4 py-3">
      <div className="text-sm font-semibold text-foreground">分支策略（3 主线）</div>
      <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
        <li><span className="font-medium text-foreground">master</span>：正式版本分支，用于发布正式版本。</li>
        <li><span className="font-medium text-foreground">demo</span>：Demo 版本分支，用于主管评审（新板块设计 / 功能改动审核）。</li>
        <li><span className="font-medium text-foreground">develop</span>：开发测试分支，日常开发与测试主干。</li>
      </ul>
    </div>

    <div className="rounded-2xl border px-4 py-3">
      <div className="text-sm font-semibold text-foreground">操作步骤（新任务）</div>
      <ol className="mt-2 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
        <li>从 <span className="font-medium text-foreground">develop</span> 拉取最新代码。</li>
        <li>以 <span className="font-medium text-foreground">develop</span> 为 source branch 创建个人开发分支（例如 <code className="rounded bg-muted px-1">fix-task-key</code>）。</li>
        <li>在个人分支完成开发与自测，按规范提交。</li>
        <li>创建 MR：需要主管评审 → target 选 <span className="font-medium text-foreground">demo</span>；否则选 <span className="font-medium text-foreground">develop</span>。</li>
        <li className="list-none">
          <div className="mt-3 flex justify-center">
            <img
              src={gitlabMrImg}
              alt="GitLab MR 目标分支示例"
              className="w-full max-w-2xl mx-auto rounded-xl border shadow-sm"
              loading="lazy"
              decoding="async"
            />
          </div>
        </li>
      </ol>
    </div>

  </div>
);

const flowContent = (
  <div className="space-y-4">
    <div className="rounded-2xl border px-4 py-3">
      <div className="text-sm font-semibold text-foreground">从需求到合并的整体流程</div>
      <ol className="mt-2 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
        <li>以 <span className="font-medium text-foreground">develop</span> 作为 source branch 拉取一条自己的开发分支。
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="flex justify-center"
              onClick={() => openImage(gitlabCreateImg)}
            >
              <img
                src={gitlabCreateImg}
                alt="GitLab 创建开发分支示意"
                className="w-full max-w-xl rounded-xl border shadow-sm"
                loading="lazy"
                decoding="async"
              />
            </button>
            <button
              type="button"
              className="flex justify-center"
              onClick={() => openImage(gitlabCreateBranchImg)}
            >
              <img
                src={gitlabCreateBranchImg}
                alt="GitLab 选择 source/target 分支示意"
                className="w-full max-w-xl rounded-xl border shadow-sm"
                loading="lazy"
                decoding="async"
              />
            </button>
          </div>
        </li>
        <li>分支命名遵循 <code className="rounded bg-muted px-1">fix-xxx-xxx</code> 格式（以 fix 为前缀）。</li>
        <li>在 IDE 拉取最新代码并切到自己的开发分支。</li>
        <li>进行代码修改。</li>
        <li>创建 MR：需要主管评审 → target 选 <span className="font-medium text-foreground">demo</span>；否则选 <span className="font-medium text-foreground">develop</span>。</li>
        <li>合并成功后，在 iTask 将任务改为「待测试」。测试会自动分配，产品经理需跟进；若有 bug，继续在该分支修复；测试通过且已合入 develop 后等待正式版发布。</li>
      </ol>
    </div>
  </div>
);

// 模拟文档内容
const GUIDE_CONTENT: Record<Platform, Record<string, React.ReactNode>> = {
  PC: {
    env: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          在企业微信中打开「微盘」，查看产品部门的「产品AI化」文件夹中的视频教程。
        </p>
        <div className="space-y-4">
          <div>
            <button
              type="button"
              className="w-full flex justify-center"
              onClick={() => openImage(pcTutorialImg)}
              aria-label="放大 PC 端开发环境搭建教程"
            >
              <img 
                src={pcTutorialImg} 
                alt="PC 端开发环境搭建教程" 
                className="w-full max-w-2xl mx-auto rounded-xl border shadow-sm"
                loading="lazy"
                decoding="async"
              />
            </button>
          </div>
        </div>
      </div>
    ),
    flow: flowContent,
    branch: branchContent,
    commit: (
      <div className="space-y-4">
        <div className="rounded-2xl border px-4 py-3 text-sm text-foreground/80">
          约定：尽量使用 <span className="font-semibold">fix</span> 作为分支名与 commit 的前缀，并标明作用域。示例：
          <span className="ml-1 rounded bg-muted px-2 py-0.5 font-mono text-xs">fix(聊天室): 增加一个滑动条</span>（括号与冒号均为英文符号）
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => openImage(gitlabCommitRulesImg)}
            aria-label="放大 GitLab Commit 规范示例"
            className="w-full flex justify-center"
          >
            <img
              src={gitlabCommitRulesImg}
              alt="GitLab Commit 规范示例"
              className="w-full max-w-2xl mx-auto rounded-xl border shadow-sm transition-transform duration-200 hover:scale-[1.01]"
              loading="lazy"
              decoding="async"
            />
          </button>
        </div>
      </div>
    ),
  },
  iOS: {
    env: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          在企业微信中打开「产品打通iOS开发咨询」，查看群公告教程文档。
        </p>
        <div className="space-y-4">
          <div>
            <button
              type="button"
              className="w-full flex justify-center"
              onClick={() => openImage(iOSTutorialImg)}
              aria-label="放大 iOS 开发环境搭建教程"
            >
              <img 
                src={iOSTutorialImg} 
                alt="iOS 开发环境搭建教程" 
                className="w-full max-w-2xl mx-auto rounded-xl border shadow-sm"
                loading="lazy"
                decoding="async"
              />
            </button>
          </div>
        </div>
      </div>
    ),
    flow: flowContent,
    branch: branchContent,
    commit: (
      <div className="space-y-4">
        <div className="rounded-2xl border px-4 py-3 text-sm text-foreground/80">
          约定：尽量使用 <span className="font-semibold">fix</span> 作为分支名与 commit 的前缀，并标明作用域。示例：
          <span className="ml-1 rounded bg-muted px-2 py-0.5 font-mono text-xs">fix(聊天室): 增加一个滑动条</span>（括号与冒号均为英文符号）
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => openImage(gitlabCommitRulesImg)}
            aria-label="放大 GitLab Commit 规范示例"
            className="w-full flex justify-center"
          >
            <img
              src={gitlabCommitRulesImg}
              alt="GitLab Commit 规范示例"
              className="w-full max-w-2xl mx-auto rounded-xl border shadow-sm transition-transform duration-200 hover:scale-[1.01]"
              loading="lazy"
              decoding="async"
            />
          </button>
        </div>
      </div>
    ),
  },
  Android: {
    env: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          在企业微信中打开「产品打通安卓开发咨询」，查看群公告教程文档。
        </p>
        <div className="space-y-4">
          <div>
            <button
              type="button"
              className="w-full flex justify-center"
              onClick={() => openImage(androidTutorialImg)}
              aria-label="放大 Android 开发环境搭建教程"
            >
              <img 
                src={androidTutorialImg} 
                alt="Android 开发环境搭建教程" 
                className="w-full max-w-2xl mx-auto rounded-xl border shadow-sm"
                loading="lazy"
                decoding="async"
              />
            </button>
          </div>
        </div>
      </div>
    ),
    flow: flowContent,
    branch: branchContent,
    commit: (
      <div className="space-y-4">
        <div className="rounded-2xl border px-4 py-3 text-sm text-foreground/80">
          约定：尽量使用 <span className="font-semibold">fix</span> 作为分支名与 commit 的前缀，并标明作用域。示例：
          <span className="ml-1 rounded bg-muted px-2 py-0.5 font-mono text-xs">fix(聊天室): 增加一个滑动条</span>（括号与冒号均为英文符号）
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => openImage(gitlabCommitRulesImg)}
            aria-label="放大 GitLab Commit 规范示例"
            className="w-full flex justify-center"
          >
            <img
              src={gitlabCommitRulesImg}
              alt="GitLab Commit 规范示例"
                className="w-full max-w-2xl mx-auto rounded-xl border shadow-sm"
              loading="lazy"
              decoding="async"
            />
          </button>
        </div>
      </div>
    ),
  },
};

const devGuideStorageKey = "dev-guide-read";

export default function DevGuidePage({
  onBack,
  onDevReadChange,
}: {
  onBack: () => void;
  onDevReadChange?: (readMap: Record<string, boolean>) => void;
}) {
  const [platform, setPlatform] = useState<Platform>("PC");
  const [activeSection, setActiveSection] = useState("env");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [readSections, setReadSections] = useState<Record<string, boolean>>(() => {
    if (typeof window === "undefined") return { env: false, flow: false, branch: false, commit: false };
    try {
      const stored = window.localStorage.getItem(devGuideStorageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as Record<string, boolean>;
        return {
          env: !!parsed.env,
          flow: !!parsed.flow,
          branch: !!parsed.branch,
          commit: !!parsed.commit,
        };
      }
    } catch {
      /* ignore */
    }
    return { env: false, flow: false, branch: false, commit: false };
  });

  const READABLE_SECTIONS = ["env", "flow", "branch", "commit"] as const;

  const markActiveRead = () => {
    setReadSections((prev) => ({
      ...prev,
      [activeSection]: true,
    }));
  };

  const readCount = READABLE_SECTIONS.filter((id) => readSections[id]).length;
  const totalReadable = READABLE_SECTIONS.length;
  const activeRead = readSections[activeSection];

  // 供顶层静态内容使用的弹窗 setter
  useEffect(() => {
    lightboxSetter = setLightboxImage;
    return () => {
      if (lightboxSetter === setLightboxImage) lightboxSetter = null;
    };
  }, []);

  // 同步已读状态到 localStorage + 父组件
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(devGuideStorageKey, JSON.stringify(readSections));
      } catch {
        /* ignore */
      }
    }
    onDevReadChange?.(readSections);
  }, [readSections, onDevReadChange]);

  const currentPlatform = PLATFORMS.find(p => p.id === platform);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold">开发指南</h1>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-4">
        {/* 顶部平台切换 */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="space-y-1" />
          <div className="flex items-center gap-2 rounded-full border px-2 py-1 bg-card shadow-sm">
            {PLATFORMS.map((p) => (
              <Button
                key={p.id}
                variant={platform === p.id ? "default" : "ghost"}
                size="sm"
                className={`rounded-full px-3 ${
                  platform === p.id ? "bg-primary text-primary-foreground" : "text-muted-foreground"
                }`}
                onClick={() => setPlatform(p.id)}
              >
                <p.icon className="mr-1 h-4 w-4" />
                {p.label}
              </Button>
            ))}
          </div>
        </div>

        {/* 导航 + 正文合并为单卡片 */}
        <Card className="rounded-3xl shadow-sm">
          <CardContent className="space-y-4 p-4 sm:p-6">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex flex-wrap gap-2">
                {SECTIONS.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                const isRead = readSections[section.id];
                return (
                  <Button
                    key={section.id}
                    variant={isActive ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setActiveSection(section.id)}
                    className={`group rounded-full px-3 shadow-none ${
                      isActive ? "border-primary/50 text-primary bg-primary/10" : ""
                    }`}
                  >
                    <span className="mr-1 flex items-center gap-1">
                      <Icon className="h-4 w-4" />
                      {section.title}
                    </span>
                    {isRead && (
                      <CheckCircle2 className="h-4 w-4 text-green-600" />
                    )}
                  </Button>
                );
                })}
              </div>
              {READABLE_SECTIONS.includes(activeSection as any) && (
                <div className="ml-auto flex items-center gap-3">
                  <div className="hidden sm:flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground">
                    <span>已读 {readCount} / {totalReadable}</span>
                    <Progress value={(readCount / totalReadable) * 100} className="h-1 w-16" />
                  </div>
                  <Button
                    variant="default"
                    className="rounded-full px-5"
                    onClick={markActiveRead}
                    disabled={!!activeRead}
                  >
                    {activeRead ? "已阅读" : "标记为已阅读"}
                  </Button>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="rounded-full bg-muted text-xs font-semibold">
                  {currentPlatform?.label}
                </Badge>
                <CardTitle className="text-2xl">
                  {SECTIONS.find(s => s.id === activeSection)?.title}
                </CardTitle>
              </div>
              <div className="prose prose-sm max-w-none leading-relaxed text-foreground/80">
                {GUIDE_CONTENT[platform][activeSection]}
              </div>
              {READABLE_SECTIONS.includes(activeSection as any) && (
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2" />
              )}
            </div>
          </CardContent>
        </Card>
      </main>

      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setLightboxImage(null)}
          role="presentation"
        >
          <div
            className="relative max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-3 top-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-muted-foreground transition hover:bg-background"
              onClick={() => setLightboxImage(null)}
            >
              关闭
            </button>
            <img
              src={lightboxImage}
              alt="放大图"
              className="h-full w-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}
