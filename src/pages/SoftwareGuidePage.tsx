import React, { useMemo, useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Figma, GitBranch, Users } from "lucide-react";
import figmaStep1Img from "@/assets/figma1.png";
import figmaStep2Img from "@/assets/figma2.png";
import figmaStep3Img from "@/assets/figma3.png";
import figmaStep4Img from "@/assets/figma4.png";
import figmaStep5Img from "@/assets/figma5.png";
import itaskStep1Img from "@/assets/gitlab1.png";
import itaskStep2Img from "@/assets/gitlab2.png";
import gitlabStep1Img from "@/assets/gitlab3.png";
import gitlabStep2Img from "@/assets/gitlab4.png";
import gitlabStep3Img from "@/assets/gitlab5.png";
import gitlabStep4Img from "@/assets/gitlab6.png";
import gitlabStep5Img from "@/assets/gitlab7.png";
import gitlabStep6Img from "@/assets/vx1.png";
import groupStep1Img from "@/assets/vx2.png";
import prdStep1Img from "@/assets/prd6.png";
import prdStep2Img from "@/assets/prd1.png";
import prdStep3Img from "@/assets/prd2.png";
import prdStep4Img from "@/assets/prd3.png";
import prdStep5Img from "@/assets/prd4.png";
import prdStep6Img from "@/assets/prd5.png";
import weipanStep1Img from "@/assets/vx-3.png";
import weipanStep2Img from "@/assets/vx-4.png";

type GuideStep = {
  title: string;
  desc: string;
  link?: { label: string; href: string };
  images?: { src: string; alt: string }[];
};

type GuideSection = {
  id: string;
  title: string;
  note: string;
  icon: React.ElementType;
  steps: GuideStep[];
};

const GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "figma",
    title: "Figma 教程",
    note: "从基础操作到交付规范",
    icon: Figma,
    steps: [
      {
        title: "账号与文件结构",
        desc: "使用企业微信邮箱登录Figma，并点击下面链接后，向「卢淑婷」请求访问权限。",
        link: {
          label: "打开 Figma 团队项目",
          href: "https://www.figma.com/files/team/1243392030691625763/project/263094631/0%E8%A7%84%E8%8C%83?fuid=1410466200002976152",
        },
        images: [
          {
            src: figmaStep1Img,
            alt: "Figma 团队项目示意",
          },
          {
            src: figmaStep2Img,
            alt: "Figma 访问权限申请示意",
          },
          {
            src: figmaStep3Img,
            alt: "Figma 项目示意 3",
          },
        ],
      },
      {
        title: "标注组件",
        desc: "使用Figma做标注会用到的组件。",
        images: [
          {
            src: figmaStep4Img,
            alt: "Figma 组件与规范示意 1",
          },
          {
            src: figmaStep5Img,
            alt: "Figma 组件与规范示意 2",
          },
        ],
      },
    ],
  },
  {
    id: "itask",
    title: "iTask 教程",
    note: "节点填写与任务同步",
    icon: Users,
    steps: [
      {
        title: "常用功能",
        desc: "在Gitlab的PM创建过新的issue之后，会自动将issue关联到iTask。届时，我们需要填写对应的版本号、需求状态还有需求优先级。以及预估开始/预估结束时间。",
        images: [
          {
            src: itaskStep1Img,
            alt: "iTask 未上线需求填写示意",
          },
        ],
      },
      {
        title: "任务节点配置",
        desc: "填写各部门节点，并设置任务执行人。",
        images: [
          {
            src: itaskStep2Img,
            alt: "iTask 任务节点配置示意",
          },
        ],
      },
    ],
  },
  {
    id: "gitlab",
    title: "GitLab 使用教程",
    note: "Issue 创建与规范",
    icon: GitBranch,
    steps: [
      {
        title: "仓库介绍",
        desc: "",
        images: [
          {
            src: gitlabStep1Img,
            alt: "GitLab 仓库介绍示意",
          },
        ],
      },
      {
        title: "新建issue",
        desc: "所有仓库的新建issue按钮都在这边。",
        images: [
          {
            src: gitlabStep2Img,
            alt: "GitLab 新建 issue 按钮示意",
          },
        ],
      },
      {
        title: "PM的issue内容填写方法",
        desc: "",
        images: [
          {
            src: gitlabStep3Img,
            alt: "PM issue 内容填写示意 1",
          },
          {
            src: gitlabStep4Img,
            alt: "PM issue 内容填写示意 2",
          },
          {
            src: gitlabStep5Img,
            alt: "PM issue 内容填写示意 3",
          },
        ],
      },
      {
        title: "检查issue是否关联到iTask",
        desc: "如果issue成功关联到iTask，则会在企业微信的邮件中收到该邮件。如果失败，则需要检查issue中的label是否填写有误？然后再close issue -> reopen issue。",
        images: [
          {
            src: gitlabStep6Img,
            alt: "Issue 关联 iTask 邮件示意",
          },
        ],
      },
    ],
  },
  {
    id: "group",
    title: "单个需求群",
    note: "建群规范与协作方式",
    icon: Users,
    steps: [
      {
        title: "建群与命名",
        desc: "按发版日期、端别、需求名称命名并创建群。由产品经理针对自己负责的需求拉群，沟通每个需求的进度、问题（实习生拉带教，如果需要「洁丽」协调资源拉「洁丽」）。",
        images: [
          {
            src: groupStep1Img,
            alt: "需求群建群与命名示意",
          },
        ],
      },
      {
        title: "公告与资料",
        desc: "群公告中放入需求 issue、原型、设计图与讲解录屏。",
      },
      {
        title: "进度同步",
        desc: "在群内同步进度、延期原因与验收标准。",
      },
    ],
  },
  {
    id: "prd",
    title: "PRD 集合文档解读",
    note: "字段说明与使用规则",
    icon: FileText,
    steps: [
      {
        title: "文档入口",
        desc: "定位最新 PRD 集合文档与对应版本。",
        images: [
          {
            src: prdStep1Img,
            alt: "PRD 集合文档入口示意",
          },
        ],
      },
      {
        title: "文档的表格解读",
        desc: "解释sheet的功能。",
        images: [
          {
            src: prdStep2Img,
            alt: "PRD 表格解读示意",
          },
          {
            src: prdStep3Img,
            alt: "PRD 表格解读示意 2",
          },
          {
            src: prdStep4Img,
            alt: "PRD 表格解读示意 3",
          },
          {
            src: prdStep5Img,
            alt: "PRD 表格解读示意 4",
          },
          {
            src: prdStep6Img,
            alt: "PRD 表格解读示意 5",
          },
        ],
      },
    ],
  },
  {
    id: "weipan",
    title: "微盘",
    note: "文件上传与查看",
    icon: FileText,
    steps: [
      {
        title: "产品部门微盘",
        desc: "产品部门相关文档的汇总，PRD文档、埋点相关文档、会议纪要、讲解会等重要文件都在产品部微盘中，入职初期可以通过学习这些文档中的内容熟悉部门工作。",
        images: [
          {
            src: weipanStep2Img,
            alt: "产品部微盘上传示意 2",
          },
          {
            src: weipanStep1Img,
            alt: "产品部微盘上传示意",
          },
        ],
      },
    ],
  },
];

export default function SoftwareGuidePage() {
  const [activeSectionId, setActiveSectionId] = useState(GUIDE_SECTIONS[0]?.id ?? "figma");
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxLoaded, setLightboxLoaded] = useState(false);

  const sections = useMemo(
    () => GUIDE_SECTIONS.filter((section) => section.id === activeSectionId),
    [activeSectionId]
  );

  useEffect(() => {
    if (!lightboxImage) {
      setLightboxLoaded(false);
      return;
    }
    let cancelled = false;
    const img = new Image();
    img.src = lightboxImage;
    const done = () => {
      if (!cancelled) setLightboxLoaded(true);
    };
    if (img.decode) {
      img.decode().then(done).catch(done);
    } else {
      img.onload = done;
      img.onerror = done;
    }
    return () => {
      cancelled = true;
    };
  }, [lightboxImage]);

  const handleCloseLightbox = () => setLightboxImage(null);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 space-y-6">
      <header className="flex flex-col gap-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold leading-tight text-foreground">图文教程合集</h1>
        </div>
      </header>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {GUIDE_SECTIONS.map((section) => {
            const Icon = section.icon;
            const active = section.id === activeSectionId;
            return (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSectionId(section.id)}
                className={`flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border/60 bg-card/60 text-muted-foreground hover:border-primary/40 hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{section.title}</span>
              </button>
            );
          })}
        </div>

        <div className="space-y-6">
          {sections.map((section) => {
            const Icon = section.icon;
            return (
              <Card key={section.id} id={section.id} className="rounded-2xl">
                <CardHeader className="pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Icon className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base">{section.title}</CardTitle>
                    <Badge variant="secondary" className="rounded-full">
                      {section.steps.length} 步
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {section.steps.map((step, idx) => (
                    <div
                      key={`${section.id}-${step.title}`}
                      className="rounded-2xl border bg-card/60 p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold leading-none text-primary aspect-square">
                          {idx + 1}
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-semibold text-foreground">{step.title}</div>
                          {step.desc ? (
                            <div className="text-sm text-muted-foreground">{step.desc}</div>
                          ) : null}
                          {step.link ? (
                            <a
                              href={step.link.href}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 rounded-full border border-input px-3 py-1 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
                            >
                              {step.link.label}
                            </a>
                          ) : null}
                          {step.images?.length ? (
                            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                              {step.images.map((img) => (
                                <img
                                  key={img.src}
                                  src={img.src}
                                  alt={img.alt}
                                  className="w-full max-w-3xl rounded-xl border shadow-sm cursor-zoom-in transition-transform duration-200 hover:scale-[1.01]"
                                  loading="lazy"
                                  decoding="async"
                                  onClick={() => setLightboxImage(img.src)}
                                  role="button"
                                  aria-label={`放大查看 ${img.alt}`}
                                />
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 transition-opacity duration-200"
          onClick={handleCloseLightbox}
          role="presentation"
        >
          <div
            className="relative aspect-[16/9] max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute right-3 top-3 z-20 rounded-full bg-background/90 px-3 py-1 text-xs font-medium text-muted-foreground shadow-sm transition hover:bg-background"
              onClick={handleCloseLightbox}
            >
              关闭
            </button>
            {!lightboxLoaded && (
              <div className="absolute inset-0 grid place-items-center bg-card/40 backdrop-blur-sm pointer-events-none">
                <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary" />
              </div>
            )}
            <img
              src={lightboxImage}
              alt="放大图"
              decoding="async"
              fetchPriority="high"
              className={`h-full w-full object-contain transition-opacity duration-200 ${
                lightboxLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
