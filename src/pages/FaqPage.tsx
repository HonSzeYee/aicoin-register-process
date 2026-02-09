import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScrollTakeoverContext } from "@/context/ScrollTakeoverContext";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, HelpCircle } from "lucide-react";
import { CaretRightOutlined } from "@ant-design/icons";
import type { CollapseProps } from "antd";
import { Collapse, theme } from "antd";
import vxFqa1 from "@/assets/vx-fqa-1.png";
import vxFqa2 from "@/assets/vx-fqa-2.png";
import demoImage from "@/assets/image-copy.png";
import vxDemo from "@/assets/vx-demo.png";
import imageCopy2 from "@/assets/image-copy-2.png";

const FAQS = [
  {
    id: "pc-release",
    question:
      "AiCoin PC端的开发，如果合并到develop并已经完成了测试之后，还需要手动合并到正式版吗？",
    answer: [
      {
        text: "端负责人会在发版前，将你合并到 develop 的开发分支再合并到一个 sync-日期 的分支。",
        image: vxFqa1,
        alt: "sync 分支邮件示例",
      },
      {
        text: "并且，在正式版发版的时候，会合并到正式版的版本号中。（注意观察企业微信邮箱）",
        image: vxFqa2,
        alt: "正式版本号邮件示例",
      },
    ],
  },
  {
    id: "go-pc-api-quickstart",
    question: "如何快速上手PC后端接口go-pc-api项目？",
    answer: [
      {
        text: "",
      },
      {
        text: "1）在 GitLab 中获取 HTTPS 链接，使用 git clone 将 go-pc-api 后端代码克隆到本地 IDE。",
        image: imageCopy2,
        alt: "GitLab 获取 HTTPS 链接示例",
      },
      {
        text: "2）在 IDE 的终端执行 `git clone <https链接>`，把后端代码复制到本地工作区。",
      },
      {
        text: "3）想新增「三日涨幅」指标时，先让 AI 阅读已有的「七日涨幅」实现，理解它的数据获取与返回字段逻辑，再让 AI 协助按同样模式修改。",
      },
      {
        text: "4）可用的提示语示例：我正在开发一个后端接口，目标是新增「三日涨幅」指标。我需要查看和理解「七日涨幅」的实现，尤其是如何获取数据和如何返回字段给前端。请帮助我理解「七日涨幅」接口的实现方式，包括数据获取、计算和返回字段的逻辑，之后指导我如何新增一个「三日涨幅」接口，并确保它与「七日涨幅」的处理逻辑一致。",
      },
    ],
  },
  {
    id: "repo-structure",
    question: "这么多项目（iOS/Android/PC）要怎么分辨每个项目的结构呢？",
    answer: [
      {
        text: "打开 GitLab 中对应的项目代码仓库，项目中会有 markdown 文档解释整份仓库。",
        image: demoImage,
        alt: "项目结构说明示例",
      },
    ],
  },
  {
    id: "demo-flow",
    question: "怎么确定是不是走产品Demo流程？",
    answer: [
      {
        text: "查看PRD集合文档，如果技术安排写的是「走demo流程」，就是产品经理独立完成代码。反之，如果有安排技术人员的话，产品经理就不需要写代码，只需要负责监控整个需求周期是否准时。",
        image: vxDemo,
        alt: "PRD 集合文档示例",
      },
    ],
  },
  {
    id: "wrong-branch-merge",
    question: "本应合并到 master 分支，但把 develop 的内容也带进来了，怎么办？",
    answer: [
      {
        text: "记录该 MR 的 Target Branch，从这个 Target Branch 作为新的 Source Branch 拉取一条开发分支，使用 git cherry-pick [commit id] 将之前的改动复制过来，再重新提 MR。",
      },
    ],
  },
  {
    id: "mr-conflict",
    question: "申请 MR 后提示有冲突（conflicts）要怎么办？",
    answer: [
      {
        text: "先在本地拉取最新代码，让 AI 帮你定位冲突内容和原因，再根据实际情况决定保留 HEAD 还是 commit 的内容，解决冲突后重新提交。",
      },
    ],
  },
  {
    id: "temp-request-approval",
    question: "如果走「临时需求」插入审批？",
    answer: [
      {
        text: "1）在 GitLab 的 PM 仓库中创建 issue，填好相关需求内容。（如有产品建议的 issue 需要关联，需求内容要和需求提出者沟通确认）",
      },
      {
        text: "2）打开企业微信的工作台，在「审批」类别中的「临时需求插入审批」按要求填好相关内容，并上传「GitLab 的 PM 仓库中创建 issue 需求」的截图。",
      },
      {
        text: "3）审批通过后，将审批通过的截图贴在 GitLab 的 PM 仓库的评论区。",
      },
    ],
  },
];

type FaqHeaderProps = {
  takenOver: boolean;
  isScrolling: boolean;
  onBack: () => void;
  total: number;
};

const FaqHeader = React.memo(
  React.forwardRef<HTMLElement, FaqHeaderProps>(function FaqHeader(
    { takenOver, isScrolling, onBack, total },
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
              <HelpCircle className="h-5 w-5" />
            </div>
            {compactHeader ? (
              <div className="text-sm font-semibold leading-tight">入职答疑 · 常见问题</div>
            ) : (
              <div>
                <div className="text-lg font-semibold leading-tight">常见问题</div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-xl">
              {total} 项
            </Badge>
          </div>
        </div>
      </header>
    );
  })
);

FaqHeader.displayName = "FaqHeader";

export default function FaqPage() {
  const navigate = useNavigate();
  const { takenOver, isScrolling } = useScrollTakeoverContext();
  const headerRef = useRef<HTMLElement | null>(null);
  const [subHeaderHeight, setSubHeaderHeight] = useState(0);
  const total = FAQS.length;
  const { token } = theme.useToken();

  const panelStyle: React.CSSProperties = {
    marginBottom: 14,
  };

  const items: CollapseProps["items"] = FAQS.map((item) => ({
    key: item.id,
    className: "faq-item interactive-glow",
    label: (
      <div className="text-sm font-medium text-foreground">
        <span className="mr-2 text-muted-foreground">Q:</span>
        {item.question}
      </div>
    ),
    children: (
      <div className="space-y-2 text-sm text-muted-foreground">
        {item.answer.map((line, lineIndex) => (
          <React.Fragment key={`${item.id}-line-${lineIndex}`}>
            <p>
              {lineIndex === 0 && <span className="mr-2 text-muted-foreground">A:</span>}
              {line.text}
            </p>
            {line.image && (
              <img
                src={line.image}
                alt={line.alt ?? ""}
                className="mt-2 w-full max-w-3xl rounded-xl border"
                loading="lazy"
                decoding="async"
              />
            )}
          </React.Fragment>
        ))}
      </div>
    ),
    style: panelStyle,
  }));

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => setSubHeaderHeight(el.getBoundingClientRect().height);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleBack = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <FaqHeader
        ref={headerRef}
        takenOver={takenOver}
        isScrolling={isScrolling}
        onBack={handleBack}
        total={total}
      />
      {takenOver && <div aria-hidden="true" style={{ height: subHeaderHeight }} />}

      <main className="mx-auto max-w-7xl px-4 py-6 space-y-4">
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="space-y-3 pt-6">
            <Collapse
              bordered={false}
              expandIconPosition="end"
              expandIcon={({ isActive }) => (
                <CaretRightOutlined
                  rotate={isActive ? 90 : 0}
                  style={{ color: token.colorTextSecondary }}
                />
              )}
              style={{ background: "transparent" }}
              items={items}
            />
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
