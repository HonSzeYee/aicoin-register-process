import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Monitor, 
  Smartphone, 
  Tablet, 
  Terminal, 
  GitBranch, 
  GitCommit, 
  FolderTree,
  ChevronRight
} from "lucide-react";
import iOSTutorialImg from "@/assets/iOS-tutorial.png";
import androidTutorialImg from "@/assets/android-tutorial.png";
import pcTutorialImg from "@/assets/pc-tutorial.png";

// 定义数据结构
type Platform = "PC" | "iOS" | "Android";

const PLATFORMS: { id: Platform; label: string; icon: React.ElementType }[] = [
  { id: "PC", label: "PC 端", icon: Monitor },
  { id: "iOS", label: "iOS 端", icon: Tablet },
  { id: "Android", label: "Android 端", icon: Smartphone },
];

const SECTIONS = [
  { id: "env", title: "开发环境搭建", icon: Terminal },
  { id: "branch", title: "GitLab 分支规范", icon: GitBranch },
  { id: "commit", title: "Commit 规范", icon: GitCommit },
  { id: "structure", title: "项目结构", icon: FolderTree },
];

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
            <img 
              src={pcTutorialImg} 
              alt="PC 端开发环境搭建教程" 
              className="w-full rounded-xl border shadow-sm"
            />
          </div>
        </div>
      </div>
    ),
    branch: <div>PC 端分支管理规范内容...</div>,
    commit: <div>PC 端 Commit 提交规范内容...</div>,
    structure: <div>PC 端项目目录结构说明...</div>,
  },
  iOS: {
    env: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          在企业微信中打开「产品打通iOS开发咨询」，查看群公告教程文档。
        </p>
        <div className="space-y-4">
          <div>
            <img 
              src={iOSTutorialImg} 
              alt="iOS 开发环境搭建教程" 
              className="w-full rounded-xl border shadow-sm"
            />
          </div>
        </div>
      </div>
    ),
    branch: <div>iOS 分支管理规范...</div>,
    commit: <div>iOS Commit 规范...</div>,
    structure: <div>iOS 项目结构...</div>,
  },
  Android: {
    env: (
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          在企业微信中打开「产品打通安卓开发咨询」，查看群公告教程文档。
        </p>
        <div className="space-y-4">
          <div>
            <img 
              src={androidTutorialImg} 
              alt="Android 开发环境搭建教程" 
              className="w-full rounded-xl border shadow-sm"
            />
          </div>
        </div>
      </div>
    ),
    branch: <div>Android 分支管理规范...</div>,
    commit: <div>Android Commit 规范...</div>,
    structure: <div>Android 项目结构...</div>,
  },
};

export default function DevGuidePage({ onBack }: { onBack: () => void }) {
  const [platform, setPlatform] = useState<Platform>("PC");
  const [activeSection, setActiveSection] = useState("env");

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

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Platform Switcher */}
        <div className="mb-8 flex justify-center">
          <div className="inline-flex rounded-2xl border bg-muted/30 p-1">
            {PLATFORMS.map((p) => {
              const Icon = p.icon;
              const isActive = platform === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => setPlatform(p.id)}
                  className={`flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-background text-primary shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[200px_1fr]">
          {/* Sidebar Navigation */}
          <Card className="h-fit rounded-2xl border-none shadow-none lg:border lg:shadow-sm">
            <CardContent className="p-2">
              <div className="space-y-1">
                {SECTIONS.map((section) => {
                  const Icon = section.icon;
                  const isActive = activeSection === section.id;
                  return (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                        {section.title}
                      </div>
                      {isActive && <ChevronRight className="h-4 w-4 opacity-50" />}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Content Area */}
          <Card className="min-h-[500px] rounded-2xl shadow-sm">
            <CardHeader className="border-b pb-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="rounded-lg">
                  {PLATFORMS.find(p => p.id === platform)?.label}
                </Badge>
                <CardTitle className="text-xl">
                  {SECTIONS.find(s => s.id === activeSection)?.title}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {GUIDE_CONTENT[platform][activeSection]}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

