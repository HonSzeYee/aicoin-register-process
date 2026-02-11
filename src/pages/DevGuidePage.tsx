import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/context/AppStateContext";
import type { DevReadMap } from "@/context/AppStateContext";
import { useScrollTakeoverContext } from "@/context/ScrollTakeoverContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Segmented } from "antd";
import {
  ArrowLeft,
  Code2,
  Monitor,
  Smartphone,
  Tablet,
  Terminal,
  GitBranch,
  GitCommit,
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
import gitlabMrDetailsImg from "@/assets/gitlab-mr-details.png";
import itaskNodeImg from "@/assets/itask-node.png";
import appMainNameImg from "@/assets/app-main-name.png";
import appMainNameImg2 from "@/assets/app-main-name2.png";
import appMainMrImg from "@/assets/app-main-mr.png";
import appMainMrImg2 from "@/assets/image.png";
import vxApplyImg from "@/assets/vx-apply.png";
import vxDetailsImg from "@/assets/vx-details.png";

// 全局图查看回调占位，用于顶部静态内容触发弹窗
let lightboxSetter: ((src: string | null) => void) | null = null;
const openImage = (src: string) => {
  if (lightboxSetter) lightboxSetter(src);
};

// 定义数据结构
type Platform = "PC" | "iOS" | "Android";
type SectionId = "pre" | "env" | "flow" | "branch" | "commit";

const PLATFORMS: { id: Platform; label: string; icon: React.ElementType }[] = [
  { id: "PC", label: "PC 端", icon: Monitor },
  { id: "iOS", label: "iOS 端", icon: Tablet },
  { id: "Android", label: "Android 端", icon: Smartphone },
];

type DevGuideHeaderProps = {
  takenOver: boolean;
  isScrolling: boolean;
  onBack: () => void;
  center?: React.ReactNode;
};

const DevGuideHeader = React.memo(
  React.forwardRef<HTMLElement, DevGuideHeaderProps>(function DevGuideHeader(
    { takenOver, isScrolling, onBack, center },
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
        <div className="mx-auto flex h-[58.5px] max-w-7xl items-center justify-between px-4 transition-all duration-200">
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

          <div className="flex items-center gap-2" />
        </div>
      </header>
    );
  })
);

DevGuideHeader.displayName = "DevGuideHeader";

const SECTIONS: { id: SectionId; title: string; icon: React.ElementType }[] = [
  { id: "pre", title: "前置准备", icon: MessageCircle },
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
      <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
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
          <div className="mt-1 text-foreground/90">
            如果是需要主管审核的需求，合并到 demo target 并通过评审后，还需要手动创建一个新的 MR，Target Branch 选择 develop 分支，将之前的 commit 内容复制到新的 MR 中。
          </div>
          <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
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
            <button
              type="button"
              className="inline-flex"
              onClick={() => openImage(gitlabMrDetailsImg)}
              aria-label="放大 MR 详情示例"
            >
              <img
                src={gitlabMrDetailsImg}
                alt="MR 详情示例"
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
      <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
        <li>在企微找到「贺举锋」，描述你的 demo 任务，由他帮忙创建新的 iOS 开发分支。</li>
        <li>
          在 IDE 拉取最新代码并切到自己的开发分支。
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
        <li>
          创建 MR：具体 Target Branch 向「贺举锋」确认后再选择。
          <div className="mt-2">
            <button
              type="button"
              className="inline-flex"
              onClick={() => openImage(gitlabMrDetailsImg)}
              aria-label="放大 MR 详情示例"
            >
              <img
                src={gitlabMrDetailsImg}
                alt="MR 详情示例"
                className="w-full max-w-xl rounded-xl border shadow-sm"
                loading="lazy"
                decoding="async"
              />
            </button>
          </div>
        </li>
      </ol>
    </div>
    <div className="rounded-2xl border bg-primary/5 px-4 py-3 text-sm text-foreground/80 shadow-sm">
      <div className="font-semibold text-foreground mb-1">Tips</div>
      <p>
        当「开发分支」合并到「测试分支」后，进行测试。如果测试没问题，端负责人会自动合并到正式版中，届时请关注企微邮件通知。
      </p>
    </div>
  </div>
);

const flowContentAndroid = (
  <div className="space-y-4">
    <div className="rounded-2xl border px-4 py-3">
      <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
        <li>
          在 <span className="font-medium text-foreground">develop-normal</span> 拉取一条新的开发分支，
          命名遵循 <code className="rounded bg-muted px-1">dev-normal-xxx-a.b.c-feature</code>。
          其中 <strong>xxx</strong> 为个人名字缩写，<strong>a.b.c</strong> 为对应版本号，<strong>feature</strong> 为修改功能。
          示例：<code className="rounded bg-muted px-1">dev-normal-hsy-2.6.6-threedaylist</code>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              className="inline-flex"
              onClick={() => openImage(appMainNameImg)}
              aria-label="放大分支创建示意"
            >
              <img
                src={appMainNameImg}
                alt="分支创建与命名示意"
                className="w-full max-w-xl rounded-xl border shadow-sm"
                loading="lazy"
                decoding="async"
              />
            </button>
            <button
              type="button"
              className="inline-flex"
              onClick={() => openImage(appMainNameImg2)}
              aria-label="放大分支创建与命名示意 2"
            >
              <img
                src={appMainNameImg2}
                alt="分支创建与命名示意 2"
                className="w-full max-w-xl rounded-xl border shadow-sm"
                loading="lazy"
                decoding="async"
              />
            </button>
          </div>
        </li>
        <li>进行代码修改。</li>
        <li>
          创建 MR：Target Branch 选择 <span className="font-medium text-foreground">develop_normal</span>。
          <div className="mt-2 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <button
              type="button"
              className="inline-flex"
              onClick={() => openImage(appMainMrImg)}
              aria-label="放大 MR 创建示意"
            >
              <img
                src={appMainMrImg}
                alt="MR 创建与目标分支选择示意"
                className="w-full max-w-xl rounded-xl border shadow-sm"
                loading="lazy"
                decoding="async"
              />
            </button>
            <button
              type="button"
              className="inline-flex"
              onClick={() => openImage(appMainMrImg2)}
              aria-label="放大 MR 创建示意 2"
            >
              <img
                src={appMainMrImg2}
                alt="MR 创建与目标分支选择示意 2"
                className="w-full max-w-xl rounded-xl border shadow-sm"
                loading="lazy"
                decoding="async"
              />
            </button>
            <button
              type="button"
              className="inline-flex"
              onClick={() => openImage(gitlabMrDetailsImg)}
              aria-label="放大 MR 详情示例"
            >
              <img
                src={gitlabMrDetailsImg}
                alt="MR 详情示例"
                className="w-full max-w-xl rounded-xl border shadow-sm"
                loading="lazy"
                decoding="async"
              />
            </button>
          </div>
        </li>
        <li>
          合并成功后，在 iTask 将任务改为「待测试」。测试部门会自动分配测试人员，产品经理需跟进；若有 bug，继续在该分支修复；测试通过且已合入
          <span className="font-medium text-foreground"> develop_normal</span> 后等待正式版发布。
        </li>
      </ol>
    </div>
  </div>
);

const branchContentIOS = (
  <div className="space-y-4">
    <div className="rounded-2xl border bg-muted/30 px-4 py-3">
      <div className="text-sm font-semibold text-foreground">iOS 分支策略</div>
      <div className="mt-2 text-sm text-muted-foreground space-y-1">
        <p>遵循发布/开发双轨，命名规范如下：</p>
        <ul className="list-disc list-inside space-y-1">
          <li>
            <code className="rounded bg-muted px-1">master</code>：生产环境代码。
          </li>
          <li>
            <code className="rounded bg-muted px-1">pro-x.y.z</code>：正式版发布分支。
          </li>
          <li>
            <code className="rounded bg-muted px-1">dev-x.y.z</code>：开发测试分支。
          </li>
          <li>
            <code className="rounded bg-muted px-1">dev-x.y.z-功能名</code>：个人开发分支。
          </li>
        </ul>
      </div>
    </div>
  </div>
);

const branchContentAndroid = (
  <div className="space-y-4">
    <div className="rounded-2xl border bg-muted/30 px-4 py-3">
      <div className="text-sm font-semibold text-foreground">Android 分支策略</div>
      <div className="mt-2 text-sm text-muted-foreground space-y-1">
        <ul className="list-disc list-inside space-y-1">
          <li>从 <code className="rounded bg-muted px-1">develop-normal</code> 拉取一条新的开发分支。</li>
          <li>申请 MR 时 Target Branch 选择 <code className="rounded bg-muted px-1">develop-normal</code>，合并后进行测试。</li>
          <li><code className="rounded bg-muted px-1">master</code> 为正式版本分支。</li>
        </ul>
      </div>
    </div>
  </div>
);

const commitContentBase = (
  <div className="space-y-4">
    <div className="rounded-2xl border px-4 py-3 text-sm text-foreground/80">
      约定：尽量使用 <span className="font-semibold">fix</span> 作为 commit 的前缀，并标明作用域。示例：
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
    pre: (
      <div className="space-y-3">
        <div className="rounded-2xl border bg-primary/5 px-4 py-3 text-sm text-foreground/80 shadow-sm">
          在开发前，请确保已在企业微信「审批」中提交并通过「产品代码权限申请」。
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            className="inline-flex"
            onClick={() => openImage(vxApplyImg)}
            aria-label="放大审批入口示例"
          >
            <img
              src={vxApplyImg}
              alt="企业微信审批入口示例"
              className="w-full max-w-xl rounded-xl border shadow-sm"
              loading="lazy"
              decoding="async"
            />
          </button>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            className="inline-flex"
            onClick={() => openImage(vxDetailsImg)}
            aria-label="放大审批详情示例"
          >
            <img
              src={vxDetailsImg}
              alt="企业微信审批详情示例"
              className="w-full max-w-xl rounded-xl border shadow-sm"
              loading="lazy"
              decoding="async"
            />
          </button>
        </div>
      </div>
    ),
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
    pre: (
      <div className="space-y-3">
        <div className="rounded-2xl border bg-primary/5 px-4 py-3 text-sm text-foreground/80 shadow-sm">
          在开发前，请确保已在企业微信「审批」中提交并通过「产品代码权限申请」。
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            className="inline-flex"
            onClick={() => openImage(vxApplyImg)}
            aria-label="放大审批入口示例"
          >
            <img
              src={vxApplyImg}
              alt="企业微信审批入口示例"
              className="w-full max-w-xl rounded-xl border shadow-sm"
              loading="lazy"
              decoding="async"
            />
          </button>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            className="inline-flex"
            onClick={() => openImage(vxDetailsImg)}
            aria-label="放大审批详情示例"
          >
            <img
              src={vxDetailsImg}
              alt="企业微信审批详情示例"
              className="w-full max-w-xl rounded-xl border shadow-sm"
              loading="lazy"
              decoding="async"
            />
          </button>
        </div>
      </div>
    ),
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
    pre: (
      <div className="space-y-3">
        <div className="rounded-2xl border bg-primary/5 px-4 py-3 text-sm text-foreground/80 shadow-sm">
          在开发前，请确保已在企业微信「审批」中提交并通过「产品代码权限申请」。
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            className="inline-flex"
            onClick={() => openImage(vxApplyImg)}
            aria-label="放大审批入口示例"
          >
            <img
              src={vxApplyImg}
              alt="企业微信审批入口示例"
              className="w-full max-w-xl rounded-xl border shadow-sm"
              loading="lazy"
              decoding="async"
            />
          </button>
        </div>
        <div className="flex justify-center">
          <button
            type="button"
            className="inline-flex"
            onClick={() => openImage(vxDetailsImg)}
            aria-label="放大审批详情示例"
          >
            <img
              src={vxDetailsImg}
              alt="企业微信审批详情示例"
              className="w-full max-w-xl rounded-xl border shadow-sm"
              loading="lazy"
              decoding="async"
            />
          </button>
        </div>
      </div>
    ),
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
};

export default function DevGuidePage() {
  const navigate = useNavigate();
  const { setDevRead } = useAppState();
  const { takenOver, isScrolling } = useScrollTakeoverContext();
  const headerRef = useRef<HTMLElement | null>(null);
  const [subHeaderHeight, setSubHeaderHeight] = useState(0);
  const [platform, setPlatform] = useState<Platform>("PC");
  const [activeSection, setActiveSection] = useState<SectionId>("pre");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  const goNextSection = () => {
    const idx = SECTIONS.findIndex((s) => s.id === activeSection);
    const next = SECTIONS[(idx + 1) % SECTIONS.length];
    setActiveSection(next.id);
  };

  useEffect(() => {
    const platformKey =
      platform === "PC" ? "pc" : platform === "iOS" ? "ios" : "android";
    const readKey = `${platformKey}_${activeSection}` as keyof DevReadMap;
    setDevRead(readKey, true);
  }, [activeSection, platform, setDevRead]);

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

  const takeoverHeader = takenOver;
  const showPlatformTabs = !takeoverHeader;
  const currentPlatform = PLATFORMS.find(p => p.id === platform);

  const platformOptions = PLATFORMS.map((p) => ({
    value: p.id,
    label: (
      <span className="inline-flex items-center gap-2">
        <p.icon className="h-4 w-4" />
        {p.label}
      </span>
    ),
  }));

  const platformTabs = (
    <div className="hidden md:flex items-center">
      <Segmented
        value={platform}
        options={platformOptions}
        onChange={(value) => setPlatform(value as Platform)}
        className="rounded-lg"
      />
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
        center={showPlatformTabs ? platformTabs : null}
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
                return (
                  <Button
                    key={section.id}
                    variant={isActive ? "secondary" : "outline"}
                    size="sm"
                    onClick={() => setActiveSection(section.id)}
                    className={`group rounded-full px-3 shadow-none ${
                      isActive ? "border-[#E6ECF7] text-accent-foreground bg-[#E6ECF7]" : ""
                    }`}
                  >
                    <span className="mr-1 flex items-center gap-1">
                      <Icon className="h-4 w-4" />
                      {section.title}
                    </span>
                  </Button>
                );
                })}
              </div>
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
