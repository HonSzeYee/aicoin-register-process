import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useScrollTakeoverContext } from "@/context/ScrollTakeoverContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, HelpCircle } from "lucide-react";

const FAQS = [
  {
    id: "pc-release",
    question:
      "AiCoin PC端的开发，如果合并到develop并已经完成了测试之后，还需要手动合并到正式版吗？",
    answer: [
      {
        text: "端负责人会在发版前，将你合并到 develop 的开发分支再合并到一个 sync-日期 的分支。",
        image: "/src/assets/vx-fqa-1.png",
        alt: "sync 分支邮件示例",
      },
      {
        text: "并且，在正式版发版的时候，会合并到正式版的版本号中。（注意观察企业微信邮箱）",
        image: "/src/assets/vx-fqa-2.png",
        alt: "正式版本号邮件示例",
      },
    ],
  },
  {
    id: "demo-flow",
    question: "怎么确定是不是走产品Demo流程？",
    answer: [
      {
        text: "查看PRD集合文档，如果技术安排写的是「走demo流程」，就是产品经理独立完成代码。反之，如果有安排技术人员的话，产品经理就不需要写代码，只需要负责监控整个需求周期是否准时。",
        image: "/src/assets/vx-demo.png",
        alt: "PRD 集合文档示例",
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
              <HelpCircle className="h-5 w-5" />
            </div>
            {compactHeader ? (
              <div className="text-sm font-semibold leading-tight">入职答疑 · 常见问题</div>
            ) : (
              <div>
                <div className="text-sm text-muted-foreground">入职答疑</div>
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
            {FAQS.map((item, index) => (
              <details
                key={item.id}
                className="group rounded-2xl border bg-card/60 px-4 py-3"
              >
                <summary className="cursor-pointer list-none text-sm font-medium text-foreground">
                  <span className="mr-2 text-muted-foreground">Q:</span>
                  {item.question}
                </summary>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {item.answer.map((line, lineIndex) => (
                    <React.Fragment key={`${item.id}-line-${lineIndex}`}>
                      <p>
                        {lineIndex === 0 && (
                          <span className="mr-2 text-muted-foreground">A:</span>
                        )}
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
              </details>
            ))}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
