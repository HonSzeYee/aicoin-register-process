import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

export default function FaqPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-4">
      <Card className="rounded-2xl shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">常见问题</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {FAQS.map((item, index) => (
            <details
              key={item.id}
              open={index === 0}
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
            </details>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
