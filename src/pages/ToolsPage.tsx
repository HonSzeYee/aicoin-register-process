import React, { useEffect } from "react";
import claudeIcon from "@/assets/claude-color.svg";
import cursorIcon from "@/assets/cursor.svg";
import figmaIcon from "@/assets/figma-color.svg";
import geminiIcon from "@/assets/gemini-color.svg";
import openaiIcon from "@/assets/openai.svg";
import antdIcon from "@/assets/ant-design.svg";
import dockerIcon from "@/assets/docker.svg";
import aistudioIcon from "@/assets/aistudio.svg";
import codiaIcon from "@/assets/codia-logo.png";
import yapiIcon from "@/assets/yapi-logo.png";
import { useAppState } from "@/context/AppStateContext";

type Skill = {
  label: string;
  note: string;
  tag: "AI" | "开发" | "设计" | "协作";
  icon: string;
  desc: string;
  chips: string[];
  badge: string;
  url: string;
};

const SKILLS: Skill[] = [
  {
    label: "Claude",
    note: "AI 工具",
    tag: "AI",
    icon: claudeIcon,
    desc: "文本创作、代码编写模型，擅长处理逻辑性强的问题。",
    chips: ["文本创作", "代码", "逻辑"],
    badge: "PRO 工具",
    url: "https://claude.ai/",
  },
  {
    label: "Gemini",
    note: "AI 工具",
    tag: "AI",
    icon: geminiIcon,
    desc: "Google 多模态模型，擅长图片与设计类需求；灵感不明确时可用 Nano/Banana 模型探索创意。",
    chips: ["多模态", "灵感发散", "设计向"],
    badge: "PRO 工具",
    url: "https://ai.google.dev/",
  },
  {
    label: "AI Studio",
    note: "AI 工具",
    tag: "AI",
    icon: aistudioIcon,
    desc: "Google AI Studio 免费试验场，快速提示、原型并将 Gemini 投入生产。",
    chips: ["Google", "原型设计", "调试"],
    badge: "PRO 工具",
    url: "https://aistudio.google.com/",
  },
  {
    label: "Figma AI",
    note: "设计工具",
    tag: "设计",
    icon: figmaIcon,
    desc: "Figma 推出的 AI 能力，加速界面草图、文案与设计批量处理，提升协作效率。",
    chips: ["设计补全", "UI/UX", "协作"],
    badge: "设计工具",
    url: "https://www.figma.com/",
  },
  {
    label: "Codia AI",
    note: "设计工具",
    tag: "设计",
    icon: codiaIcon,
    desc: "将 PNG、JPG 等格式的图片快速转换为 Figma 中可编辑的设计稿。",
    chips: ["图转稿", "OCR", "Figma"],
    badge: "设计工具",
    url: "https://www.figma.com/community/plugin/1329812760871373657/codia-ai-design-screenshot-to-editable-figma-design",
  },
  {
    label: "OpenAI",
    note: "开发工具",
    tag: "开发",
    icon: openaiIcon,
    desc: "通用大模型平台与 API，支持 GPT 系列、语音与图像，多场景接入工作流。",
    chips: ["OpenAI", "GPT", "API"],
    badge: "开发工具",
    url: "https://platform.openai.com/",
  },
  {
    label: "Cursor",
    note: "开发工具",
    tag: "开发",
    icon: cursorIcon,
    desc: "基于 VS Code 的 AI 编码环境，自动写注释、补全与重构，提升日常开发效率。",
    chips: ["AI 编码", "重构", "代码助手"],
    badge: "开发工具",
    url: "https://cursor.sh/",
  },
  {
    label: "Docker",
    note: "交付工具",
    tag: "开发",
    icon: dockerIcon,
    desc: "「无聊」聊天室等项目需预先安装 Docker 以连接数据库和本地服务。",
    chips: ["容器化", "本地环境", "数据库"],
    badge: "容器工具",
    url: "https://www.docker.com/",
  },
  {
    label: "YApi",
    note: "接口工具",
    tag: "开发",
    icon: yapiIcon,
    desc: "YApi 是高效、易用、功能强大的 API 管理平台，旨在为开发、产品、测试人员提供更优雅的接口管理服务，你可以在 YApi 查看后台接口的细节。",
    chips: ["API 管理", "接口文档", "协作"],
    badge: "开发工具",
    url: "http://yapi.aicoin.com/group/19",
  },
];

export default function ToolsPage() {
  const { setToolsRead } = useAppState();

  useEffect(() => {
    setToolsRead(true);
  }, [setToolsRead]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold leading-tight text-foreground">常用软件</h1>
        </div>
      </header>

      <CardsWall />
    </div>
  );
}

function CardsWall() {
  return (
    <div className="mx-auto max-w-5xl grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {SKILLS.map((skill) => (
        <SkillTile key={skill.label} skill={skill} />
      ))}
    </div>
  );
}

function SkillTile({ skill }: { skill: Skill }) {
  const isYapi = skill.label.toLowerCase() === "yapi";
  return (
    <a
      href={skill.url}
      target="_blank"
      rel="noreferrer"
      className="group flex h-full flex-col gap-3 rounded-2xl border border-border bg-[hsl(var(--card))] p-4 shadow-sm transition-all duration-150 hover:-translate-y-[2px] hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <img
          src={skill.icon}
          alt={skill.label}
          className={`h-9 w-9 object-contain ${isYapi ? "scale-110" : ""}`}
        />
        <div className="leading-tight">
          <div className="text-sm font-semibold text-foreground">{skill.label}</div>
          <div className="text-[11px] text-muted-foreground/80">{skill.note}</div>
        </div>
        <span
          className="ml-auto rounded-full border px-2 py-[2px] text-[11px]"
          style={{
            borderColor: "#b7d6c3",
            color: "#4a7155",
            backgroundColor: "#f2fdf5",
          }}
        >
          {skill.badge}
        </span>
      </div>

      <p className="text-[12px] leading-relaxed text-muted-foreground line-clamp-3">{skill.desc}</p>

      <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground/90">
        {skill.chips.map((chip) => (
          <span key={chip} className="rounded-full border border-border/80 bg-muted/60 px-2 py-[2px]">
            {chip}
          </span>
        ))}
      </div>

      <div className="mt-auto text-[11px] text-muted-foreground">{skill.tag} 工具</div>
    </a>
  );
}
