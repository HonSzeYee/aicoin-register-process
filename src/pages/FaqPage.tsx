import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const FAQS = [
  {
    id: "pc-release",
    question:
      "AiCoin PC端的开发，如果合并到develop并已经完成了测试之后，还需要手动合并到正式版吗？",
    answer: [
      "端负责人会在发版前，将你合并到 develop 的开发分支再合并到一个 sync-日期 的分支。",
      "并且，在正式版发版的时候，会合并到正式版的版本号中。（注意观察企业微信邮箱）",
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
                      {line}
                    </p>
                    {item.id === "pc-release" && lineIndex === 0 && (
                      <img
                        src="/src/assets/vx-fqa-1.png"
                        alt="sync 分支邮件示例"
                        className="mt-2 w-full max-w-3xl rounded-xl border"
                        loading="lazy"
                        decoding="async"
                      />
                    )}
                    {item.id === "pc-release" && lineIndex === 1 && (
                      <img
                        src="/src/assets/vx-fqa-2.png"
                        alt="正式版本号邮件示例"
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
