import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/context/AppStateContext";
import { useScrollTakeoverContext } from "@/context/ScrollTakeoverContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Code2,
  Monitor,
  Smartphone,
  Tablet,
  Terminal,
  GitBranch,
  GitCommit,
  CheckCircle2,
  GitPullRequest,
  MessageCircle,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import iOSTutorialImg from "@/assets/iOS-tutorial.png";
import androidTutorialImg from "@/assets/android-tutorial.png";
import pcTutorialImg from "@/assets/pc-tutorial.png";
import gitlabMrImg from "@/assets/gitlab-mr.png";
import gitlabCommitRulesImg from "@/assets/gitlab-commit-rules.png";
import gitlabCreateImg from "@/assets/gitlab-create.png";
import gitlabCreateBranchImg from "@/assets/gitlab-create-branch.png";
import pullCodeImg from "@/assets/pull-code.png";
import gitlabMrCreateImg from "@/assets/gitlab-mr-create.png";
import gitlabMrCreateXImg from "@/assets/gitlab-mr-create-x.png";
import itaskNodeImg from "@/assets/itask-node.png";

// 全局图查看回调占位，用于顶部静态内容触发弹窗
let lightboxSetter: ((src: string | null) => void) | null = null;
const openImage = (src: string) => {
  if (lightboxSetter) lightboxSetter(src);
};

// 定义数据结构
type Platform = "PC" | "iOS" | "Android" | "Chat";

const PLATFORMS: { id: Platform; label: string; icon: React.ElementType }[] = [
  { id: "PC", label: "PC 端", icon: Monitor },
  { id: "iOS", label: "iOS 端", icon: Tablet },
  { id: "Android", label: "Android 端", icon: Smartphone },
  { id: "Chat", label: "聊天室", icon: MessageCircle },
];

type DevGuideHeaderProps = {
  takenOver: boolean;
  isScrolling: boolean;
  onBack: () => void;
  done: number;
  total: number;
  center?: React.ReactNode;
};

const DevGuideHeader = React.memo(
  React.forwardRef<HTMLElement, DevGuideHeaderProps>(function DevGuideHeader(
    { takenOver, isScrolling, onBack, done, total, center },
    ref
  ) {
    const compactHeader = takenOver;
    const transitionClass = isScrolling ? "transition-none" : "transition-all duration-200";
    const willChangeClass = takenOver || isScrolling ? "will-change-[transform]" : "";
    const surfaceClass = takenOver
      ? "border-b bg-background/80 backdrop-blur"
      : "border-transparent bg-transparent backdrop-blur-0";
    return (
      <header
        ref={ref}
        className={`z-30 ${surfaceClass} ${transitionClass} ${willChangeClass} ${
          takenOver ? "fixed top-0 left-0 right-0" : "relative w-full"
        }`}
      >
        <div
          className={`mx-auto flex max-w-7xl items-center justify-between px-4 transition-all duration-200 ${
            compactHeader ? "py-2" : "py-3"
          }`}
        >
          <div className={`flex items-center ${compactHeader ? "gap-2" : "gap-3"}`}>
            <Button
              variant="outline"
              size="icon"
              className="rounded-2xl"
              title="返回"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <div className="flex h-10 w-10 items-center justify-center rounded-2xl border shadow-sm">
              <Code2 className="h-5 w-5" />
            </div>
            {compactHeader ? (
              <div className="text-sm font-semibold leading-tight">入职第二步 · 开发指南</div>
            ) : (
              <div>
                <div className="text-sm text-muted-foreground">入职第二步</div>
                <div className="text-lg font-semibold leading-tight">开发指南</div>
              </div>
            )}
          </div>

          <div className="flex-1 flex items-center justify-center px-3">
            {center}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-xl">
              {done} / {total}
            </Badge>
          </div>
        </div>
      </header>
    );
  })
);

DevGuideHeader.displayName = "DevGuideHeader";

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
        <li>在 IDE 拉取最新代码并切到自己的开发分支。
          <div className="mt-2">
            <button
              type="button"
              onClick={() => openImage(pullCodeImg)}
              className="inline-flex"
              aria-label="放大 IDE 拉取并切换分支示意"
            >
              <img
                src={pullCodeImg}
                alt="IDE 拉取并切换分支示意"
                className="w-full max-w-lg rounded-xl border shadow-sm"
                loading="lazy"
                decoding="async"
              />
            </button>
          </div>
        </li>
        <li>进行代码修改。</li>
        <li>创建 MR：需要主管评审 → target 选 <span className="font-medium text-foreground">demo</span>；否则选 <span className="font-medium text-foreground">develop</span>。
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="inline-flex"
              onClick={() => openImage(gitlabMrCreateImg)}
              aria-label="放大 MR 创建示例"
            >
              <img
                src={gitlabMrCreateImg}
                alt="MR 创建示例"
                className="w-full max-w-xl rounded-xl border shadow-sm"
                loading="lazy"
                decoding="async"
              />
            </button>
            <button
              type="button"
              className="inline-flex"
              onClick={() => openImage(gitlabMrCreateXImg)}
              aria-label="放大 MR 创建示例2"
            >
              <img
                src={gitlabMrCreateXImg}
                alt="MR 创建示例 2"
                className="w-full max-w-xl rounded-xl border shadow-sm"
                loading="lazy"
                decoding="async"
              />
            </button>
          </div>
        </li>
        <li>合并成功后，在 iTask 将任务改为「待测试」。测试会自动分配，产品经理需跟进；若有 bug，继续在该分支修复；测试通过且已合入 develop 后等待正式版发布。
          <div className="mt-2">
            <button
              type="button"
              className="inline-flex"
              onClick={() => openImage(itaskNodeImg)}
              aria-label="放大 iTask 节点示意"
            >
              <img
                src={itaskNodeImg}
                alt="iTask 节点示意"
                className="w-full max-w-xl rounded-xl border shadow-sm"
                loading="lazy"
                decoding="async"
              />
            </button>
          </div>
        </li>
      </ol>
    </div>
  </div>
);

const flowContentIOS = (
  <div className="space-y-4">
    <div className="rounded-2xl border px-4 py-3">
      <div className="text-sm font-semibold text-foreground">iOS 端流程说明</div>
      <ol className="mt-2 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
        <li>在 iOS 任务群确认需求范围与验收口径。</li>
        <li>从 <span className="font-medium text-foreground">develop</span> 创建 iOS 分支并同步最新代码。</li>
        <li>完成开发后自测真机与模拟器，确保基础功能可用。</li>
        <li>创建 MR：需要主管评审则 target 选 <span className="font-medium text-foreground">demo</span>。</li>
      </ol>
    </div>
  </div>
);

const flowContentAndroid = (
  <div className="space-y-4">
    <div className="rounded-2xl border px-4 py-3">
      <div className="text-sm font-semibold text-foreground">Android 端流程说明</div>
      <ol className="mt-2 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
        <li>在 Android 任务群同步需求细节与提测时间。</li>
        <li>从 <span className="font-medium text-foreground">develop</span> 拉取代码并创建分支。</li>
        <li>完成开发后进行本地自测与关键机型验证。</li>
        <li>创建 MR：需要主管评审则 target 选 <span className="font-medium text-foreground">demo</span>。</li>
      </ol>
    </div>
  </div>
);

const flowContentChat = (
  <div className="space-y-4">
    <div className="rounded-2xl border px-4 py-3">
      <div className="text-sm font-semibold text-foreground">聊天室流程说明</div>
      <ol className="mt-2 space-y-2 text-sm text-muted-foreground list-decimal list-inside">
        <li>在聊天室确认需求背景、范围与优先级。</li>
        <li>汇总关键决策与时间点，记录到任务说明中。</li>
        <li>与相关端协同验收标准，避免口径不一致。</li>
        <li>需求完成后在群内同步结果与回归信息。</li>
      </ol>
    </div>
  </div>
);

const branchContentIOS = (
  <div className="space-y-4">
    <div className="rounded-2xl border bg-muted/30 px-4 py-3">
      <div className="text-sm font-semibold text-foreground">iOS 分支策略</div>
      <div className="mt-2 text-sm text-muted-foreground">
        iOS 端遵循主干策略，开发分支以 <span className="font-medium text-foreground">fix-ios-xxx</span> 命名。
      </div>
    </div>
  </div>
);

const branchContentAndroid = (
  <div className="space-y-4">
    <div className="rounded-2xl border bg-muted/30 px-4 py-3">
      <div className="text-sm font-semibold text-foreground">Android 分支策略</div>
      <div className="mt-2 text-sm text-muted-foreground">
        Android 端开发分支建议以 <span className="font-medium text-foreground">fix-android-xxx</span> 命名。
      </div>
    </div>
  </div>
);

const branchContentChat = (
  <div className="space-y-4">
    <div className="rounded-2xl border bg-muted/30 px-4 py-3">
      <div className="text-sm font-semibold text-foreground">聊天室分支策略</div>
      <div className="mt-2 text-sm text-muted-foreground">
        讨论记录以任务名称归档，保持与代码分支一致的命名。
      </div>
    </div>
  </div>
);

const commitContentBase = (
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
);

const commitContentIOS = commitContentBase;
const commitContentAndroid = commitContentBase;
const commitContentChat = commitContentBase;

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
    commit: commitContentBase,
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
    flow: flowContentIOS,
    branch: branchContentIOS,
    commit: commitContentIOS,
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
    flow: flowContentAndroid,
    branch: branchContentAndroid,
    commit: commitContentAndroid,
  },
  Chat: {
    env: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          在企业微信中找到对应产品聊天室，查看群公告与历史决策记录。
        </p>
      </div>
    ),
    flow: flowContentChat,
    branch: branchContentChat,
    commit: commitContentChat,
  },
};

export default function DevGuidePage() {
  const navigate = useNavigate();
  const { devReadMap, setDevReadMap } = useAppState();
  const { takenOver, isScrolling } = useScrollTakeoverContext();
  const headerRef = useRef<HTMLElement | null>(null);
  const [subHeaderHeight, setSubHeaderHeight] = useState(0);
  const [platform, setPlatform] = useState<Platform>("PC");
  const [activeSection, setActiveSection] = useState("env");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const tabRefs = useRef<Record<Platform, HTMLButtonElement | null>>({
    PC: null,
    iOS: null,
    Android: null,
    Chat: null,
  });
  const [tabIndicator, setTabIndicator] = useState<{ left: number; width: number }>({
    left: 0,
    width: 0,
  });
  const readSections = devReadMap;

  const READABLE_SECTIONS = ["env", "flow", "branch", "commit"] as const;

  const goNextSection = () => {
    const idx = SECTIONS.findIndex((s) => s.id === activeSection);
    const next = SECTIONS[(idx + 1) % SECTIONS.length];
    setActiveSection(next.id);
  };

  const markActiveRead = () => {
    setDevReadMap((prev) => ({
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

  // 返回上一级
  const handleBack = useCallback(() => {
    navigate("/");
  }, [navigate]);

  // 更新平台 Tab 背景滑块位置
  useEffect(() => {
    const el = tabRefs.current[platform];
    if (el) {
      const { offsetLeft, offsetWidth } = el;
      setTabIndicator({ left: offsetLeft, width: offsetWidth });
    }
    const handleResize = () => {
      const el = tabRefs.current[platform];
      if (el) {
        setTabIndicator({ left: el.offsetLeft, width: el.offsetWidth });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [platform]);

  const currentPlatform = PLATFORMS.find(p => p.id === platform);
  const takeoverHeader = takenOver;

  const platformTabs = (
    <div className="hidden md:flex items-center gap-2 rounded-full border px-2 py-1 bg-card shadow-sm">
      <div className="relative flex items-center gap-2">
        <span
          className="absolute inset-y-0 rounded-full bg-primary/10 transition-all duration-250 ease-in-out"
          style={{ left: tabIndicator.left, width: tabIndicator.width }}
        />
        {PLATFORMS.map((p) => (
          <Button
            key={p.id}
            ref={(el) => (tabRefs.current[p.id] = el)}
            variant="ghost"
            size="sm"
            className={`relative rounded-full px-3 ${
              platform === p.id
                ? "bg-transparent text-primary shadow-sm hover:bg-transparent hover:text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setPlatform(p.id)}
            title={p.label}
          >
            <p.icon className="mr-1 h-4 w-4" />
            {!takeoverHeader && p.label}
          </Button>
        ))}
      </div>
    </div>
  );

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => setSubHeaderHeight(el.getBoundingClientRect().height);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* 子页接管式吸顶：滚动后固定在顶部 */}
      <DevGuideHeader
        ref={headerRef}
        takenOver={takeoverHeader}
        isScrolling={isScrolling}
        onBack={handleBack}
        done={readCount}
        total={totalReadable}
        center={platformTabs}
      />
      {takeoverHeader && <div aria-hidden="true" style={{ height: subHeaderHeight }} />}

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-4">
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
                      <CheckCircle2 className="h-4 w-4 text-[#2e7d32]" />
                    )}
                  </Button>
                );
                })}
              </div>
              {READABLE_SECTIONS.includes(activeSection as any) && (
                <div className="ml-auto flex items-center gap-3">
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
              <div className="pt-4 flex justify-center">
                <Button className="rounded-full px-5" variant="outline" onClick={goNextSection}>
                  切到下一项
                </Button>
              </div>
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
