import React, { useMemo, useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppState } from "@/context/AppStateContext";
import { useScrollTakeoverContext } from "@/context/ScrollTakeoverContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  CheckCircle2,
  Circle,
  KeyRound,
  Lock,
  Search,
  ShieldCheck,
  Users,
  ExternalLink,
} from "lucide-react";
import vxEmailImg from "@/assets/vx_email.png";
import vxVpnImg from "@/assets/vx-vpn.png";
import vxVpnAppImg from "@/assets/vx-vpn-app.png";
import clashpartyGlobal from "@/assets/clashparty_global.png";
import aicoinDownload from "@/assets/aicoin-download.png";
import vxAICoinTestDownload from "@/assets/vx-aicoin-testdownload.png";
import itaskNameImg from "@/assets/itask-name.png";
import itaskInstructionImg from "@/assets/itask-instruction.png";
import vxHuiquanImg from "@/assets/vx-huiquan.png";
import mirAuthImg from "@/assets/mir-auth.jpg";
import gitlabRegisterImg from "@/assets/gitlab-register.png";
import figmaRegisterImg from "@/assets/figma-register.png";
import vxShutingImg from "@/assets/vx-shuting.png";
import figmaDraftImg from "@/assets/figma-draft.png";
import figmaRulesImg from "@/assets/figma-rules.png";

type ChecklistItem = {
  id: string;
  title: string;
  etaMinutes?: number;
  done: boolean;
  locked?: boolean;
};

type AccountsHeaderProps = {
  takenOver: boolean;
  isScrolling: boolean;
  onBack?: () => void;
  done: number;
  total: number;
};

const AccountsHeader = React.memo(
  React.forwardRef<HTMLElement, AccountsHeaderProps>(function AccountsHeader(
    { takenOver, isScrolling, onBack, done, total },
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
            <KeyRound className="h-5 w-5 text-foreground" />
            {compactHeader ? (
              <div className="text-sm font-semibold leading-tight">入职第一步 · 账号注册</div>
            ) : (
              <div>
                <div className="text-lg font-semibold leading-tight">账号注册</div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="rounded-xl bg-secondary/70">
              {done} / {total}
            </Badge>
          </div>
        </div>
      </header>
    );
  })
);

AccountsHeader.displayName = "AccountsHeader";

type StepDetail = {
  purpose: string;
  steps: Array<string | { text: string; linkLabel: string; linkHref: string }>;
  pitfalls: string[];
  owner: string;
  links?: { label: string; href: string }[];
};

const stepThumb = (index: number) => {
  // 使用中性灰色调
  const grays = [
    ["#E5E7EB", "#9CA3AF"],
    ["#D1D5DB", "#6B7280"],
    ["#F3F4F6", "#4B5563"],
    ["#E5E7EB", "#374151"],
  ];
  const [from, to] = grays[index % grays.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="112" height="84" viewBox="0 0 112 84">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="112" height="84" rx="14" fill="url(#g)"/>
  <circle cx="26" cy="26" r="10" fill="rgba(255,255,255,0.75)"/>
  <path d="M48 24h40" stroke="rgba(255,255,255,0.8)" stroke-width="6" stroke-linecap="round"/>
  <path d="M48 44h30" stroke="rgba(255,255,255,0.65)" stroke-width="6" stroke-linecap="round"/>
  <text x="22" y="30" text-anchor="middle" font-size="12" font-family="PingFang SC, PingFangSC, Hiragino Sans GB, Microsoft YaHei, Noto Sans CJK SC, Source Han Sans SC, sans-serif" fill="#111827">${
    index + 1
  }</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
};

const stepImageFor = (stepId: string, index: number) => {
  if (stepId === "corp-email" && index === 0) return vxEmailImg;
  if (stepId === "vpn" && index === 0) return vxVpnImg;
  if (stepId === "vpn" && index === 1) return vxVpnAppImg;
  if (stepId === "aicoin" && index === 0) return clashpartyGlobal;
  if (stepId === "aicoin" && index === 1) return aicoinDownload;
  if (stepId === "corp-email" && index === 1) return vxAICoinTestDownload;
  if (stepId === "itask" && index === 0) return itaskNameImg;
  if (stepId === "itask" && index === 1) return itaskInstructionImg;
  if (stepId === "gitlab" && index === 0) return vxHuiquanImg;
  if (stepId === "gitlab" && index === 1) return gitlabRegisterImg;
  if (stepId === "figma" && index === 0) return figmaRegisterImg;
  if (stepId === "figma" && index === 1) return vxShutingImg;
  if (stepId === "figma" && index === 2) return figmaDraftImg;
  if (stepId === "figma" && index === 3) return figmaRulesImg;
  if (stepId === "gitlab" && index === 2) return mirAuthImg;
  return stepThumb(index);
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function calcProgress(items: ChecklistItem[]) {
  const total = items.length;
  const done = items.filter((i) => i.done).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return { total, done, pct };
}

export default function AccountsRegistrationPage() {
  const navigate = useNavigate();
  const { accountItems, toggleAccountItem } = useAppState();
  const { takenOver, isScrolling } = useScrollTakeoverContext();
  const headerRef = useRef<HTMLElement | null>(null);
  const [subHeaderHeight, setSubHeaderHeight] = useState(0);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [lightboxLoaded, setLightboxLoaded] = useState(false); // 控制放大图的淡入时机，避免卡顿
  const [wechatChecklist, setWechatChecklist] = useState<boolean[]>([]);
  const handleCloseLightbox = () => setLightboxImage(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const update = () => setSubHeaderHeight(el.getBoundingClientRect().height);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const takeoverHeader = takenOver;
  const items = accountItems as ChecklistItem[];
  const handleBack = useCallback(() => {
    navigate("/");
  }, [navigate]);

  const details = useMemo<Record<string, StepDetail>>(
    () => ({
      "corp-email": {
        purpose:
          "企业邮箱是所有内部系统的身份凭证。你需要它来接收邀请、登录软件平台、加入群与订阅通知。",
        steps: [
          "点击企业微信的右侧导航栏的「邮件」，查看自己的企业邮箱，这个邮箱用于注册后续软件平台帐号。",
          "企业微信联系陆柏良，让他帮忙将你加入到版本日志的推送，以后 AiCoin PC 端的测试版会通过这个推送下载。",
        ],
        pitfalls: [
          "收不到邀请邮件：检查垃圾箱/拦截规则，再联系 IT/HR 重新发送。",
          "无法登录：确认账号已激活，或先完成密码重置流程。",
        ],
        owner: "IT/HR",
      },
      vpn: {
        purpose: "用于访问受网络限制的开发资源（依赖源、文档、外部服务等）。",
        steps: [
          "点开企业微信的微盘，选择「产品部」中的「梯子下载」。",
          "下载对应版本的软件，请在群中询问最新的yaml文件。",
        ],
        pitfalls: [
          "连上但无法访问：确认系统代理已开启，或切换规则/全局模式。",
          "公司网络限制：联系 IT 走白名单或使用公司 VPN。",
        ],
        owner: "IT",
      },
      aicoin: {
        purpose: "安装 AiCoin 客户端/工具，确保你能进入业务环境并验证权限。",
        steps: [
          {
            text: "在 Clash Party 中开启全局代理后，再访问 AiCoin 官网获取安装资源。",
            linkLabel: "前往 aicoin.com",
            linkHref: "https://www.aicoin.com/",
          },
          "根据自己的机型来选择「AiCoin 正式版」的下载版本。",
        ],
        pitfalls: ["无法登录：确认企业邮箱已激活，检查网络/代理设置。"],
        owner: "业务支持/IT",
      },
      itask: {
        purpose:
          "iTask 用于联动 GitLab 中 PM 仓库的任务协作：生成 PM 仓库 issue 节点、更新任务状态都在这里完成。",
        steps: [
          {
            text: "使用公司企业邮箱，点击注册链接，登陆后在左下角点击头像，将名字改成你的中文名字。",
            linkLabel: "注册链接",
            linkHref: "https://itask.co.link/invite/link?token=8bb9f7d2d80041f1a5476d4b31230c60",
          },
          "查看并了解 iTask 的使用说明。",
        ],
        pitfalls: ["看不到项目：需要项目管理员把你拉进项目空间。"],
        owner: "PM/项目管理员",
      },
      gitlab: {
        purpose: "GitLab 用于代码托管与协作：拉代码、提 MR、做 Review、查看 CI。",
        steps: [
          "提供企业邮箱给李辉全，李辉全帮忙创建 GitLab 账号。",
          {
            text: "创建好后，用企业邮箱和初始密码 11111111 登录 GitLab。",
            linkLabel: "登录 GitLab",
            linkHref: "https://team.applychart.com/lab/aicoin/feedback",
          },
          "登录后会要求扫码并输入 Google 验证码，请在手机应用商店下载 Microsoft Authenticator 进行绑定。",
        ],
        pitfalls: [
          "推送失败：检查权限与分支保护规则。",
          "SSH 连接失败：确认公钥已添加到 GitLab，且本机 ssh-agent 正常。",
        ],
        owner: "技术负责人/仓库管理员",
      },
      figma: {
        purpose: "Figma 用于设计协作：查看设计稿、标注、组件库与交互说明。",
        steps: [
          {
            text: "使用企业邮箱注册 Figma 账号。",
            linkLabel: "打开 Figma 登录",
            linkHref: "https://www.figma.com/login?is_not_gen_0=true&resource_type=team#",
          },
          "提供你的邮箱给卢淑婷，让她把你加入 Figma 团队、开放 0规范 的 Project 权限。",
          "前期先在 Drafts 里画原型和设计图练手，实际开始需求工作时再联系卢淑婷开启对应文件夹权限。",
          "可以在 All projects 里查看产品设计规范以及 Figma 使用教程。",
        ],
        pitfalls: ["打不开文件：需要设计/管理员授权访问或加入团队。"],
        owner: "设计/管理员",
      },
      wechat: {
        purpose: "加入以下企业微信群，阅读群公告。",
        steps: [
          "部门群：产品经理敢问敢答",
          "开发群：产品打通安卓开发咨询 + 产品打通 iOS 开发咨询。",
          "发版群：PC 新功能弹窗及发版日志",
          "对接群：移动端对接群 + 测试需求对接群",
          "审核群：PRD、原型、设计图终稿评审",
          "排期群：App 排期会 + PC 排期会",
        ],
        pitfalls: ["进不了群：联系 HR/导师/群管理员拉你入群。"],
        owner: "HR/群管理员",
      },
    }),
    []
  );

  const [selectedId, setSelectedId] = useState<string>(items[0]?.id ?? "corp-email");
  const [q, setQ] = useState<string>("");

  const progress = useMemo(() => calcProgress(items), [items]);

  const filteredItems = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;
    return items.filter((i) => i.title.toLowerCase().includes(query));
  }, [items, q]);

  const selectedItem = useMemo(
    () => items.find((i) => i.id === selectedId) ?? items[0],
    [items, selectedId]
  );
  const selectedDetail = useMemo(
    () => details[selectedItem?.id ?? ""] ?? null,
    [details, selectedItem]
  );
  const isWechatChecklist = selectedItem?.id === "wechat";
  const checklistProgress = useMemo(() => {
    const total = items.length;
    const done = items.filter((i) => i.done).length;
    const pct = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, pct };
  }, [items]);

  useEffect(() => {
    if (selectedItem?.id === "wechat" && selectedDetail) {
      setWechatChecklist(new Array(selectedDetail.steps.length).fill(false));
    }
  }, [selectedDetail, selectedItem?.id]);

  const handleWechatToggle = (idx: number) => {
    setWechatChecklist((prev) => {
      const next = [...prev];
      next[idx] = !next[idx];
      return next;
    });
  };

  // 预解码放大图，避免首次淡入时出现明显卡顿
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

  // 预加载所有大图，进入放大时更快
  useEffect(() => {
    const urls = items.flatMap((it) =>
      (details[it.id]?.steps ?? []).map((_, idx) => stepImageFor(it.id, idx))
    );
    urls.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, [items, details]);

  const openLightbox = (src: string) => {
    setLightboxLoaded(false);
    setLightboxImage(src);
  };

  function toggleDone(id: string) {
    toggleAccountItem(id);
  }

  function goNextUnfinished() {
    if (!items.length) return;
    const currentIndex = items.findIndex((i) => i.id === selectedId);
    // 从当前的下一项开始向后查找第一个未锁定的步骤
    for (let offset = 1; offset <= items.length; offset++) {
      const next = items[(currentIndex + offset) % items.length];
      if (!next.locked) {
        setSelectedId(next.id);
        return;
      }
    }
    // 如果全部被锁定，保持不变并跳到 Dev 指引
    navigate("/dev");
  }

  return (
    <div className="min-h-screen bg-background">
      {/* 子页接管式吸顶：滚动后固定在顶部 */}
      <AccountsHeader
        ref={headerRef}
        takenOver={takeoverHeader}
        isScrolling={isScrolling}
        onBack={handleBack}
        done={progress.done}
        total={progress.total}
      />
      {takeoverHeader && <div aria-hidden="true" style={{ height: subHeaderHeight }} />}

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 py-6 lg:grid-cols-[1fr_320px]">
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">{selectedItem?.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <ShieldCheck className="h-4 w-4" /> 目的
              </div>
              <div className="mt-2 text-sm text-muted-foreground">
                {selectedDetail?.purpose ?? "（待补充）"}
              </div>
            </div>

            <div className="rounded-2xl border p-4">
              <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
                <Users className="h-4 w-4" /> 操作步骤
                {!isWechatChecklist && (
                  <span className="text-xs font-normal text-muted-foreground">· 点击图片可放大</span>
                )}
              </div>
              <ol className="mt-3 space-y-3 text-sm">
                {(selectedDetail?.steps?.length ? selectedDetail.steps : ["（待补充）"]).map(
                  (s, idx) => {
                    const renderStepDetail = () => {
                      if (typeof s === "string") {
                        return (
                          <div className="mt-1 text-foreground/90">
                            {s}
                          </div>
                        );
                      }
                      return (
                        <div className="mt-1 space-y-1 text-foreground/90">
                          <div>{s.text}</div>
                          <a
                            href={s.linkHref}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 rounded-full border border-input px-3 py-1 text-xs font-medium text-foreground transition hover:border-primary hover:text-primary"
                          >
                            {s.linkLabel} <ExternalLink className="h-3 w-3" />
                          </a>
                        </div>
                      );
                    };
                    if (isWechatChecklist) {
                      const checked = wechatChecklist[idx] ?? false;
                      return (
                        <li
                          key={idx}
                          className="rounded-2xl border border-dashed border-muted-foreground/40 bg-muted/10 p-3 text-foreground/90"
                        >
                          <button
                            type="button"
                            onClick={() => handleWechatToggle(idx)}
                            className="flex w-full items-start gap-3 text-left"
                          >
                            <span
                              className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border ${
                                checked ? "border-primary" : "border-muted-foreground/60"
                              }`}
                            >
                              {checked ? (
                                <CheckCircle2 className="h-3 w-3 text-[#2e7d32]" />
                              ) : (
                                <Circle className="h-3 w-3 text-muted-foreground/60" />
                              )}
                            </span>
                            <div
                              className={`flex-1 text-sm font-medium ${
                                checked ? "text-muted-foreground/80" : "text-foreground/90"
                              }`}
                            >
                              {typeof s === "string" ? s : s.text}
                            </div>
                          </button>
                        </li>
                      );
                    }
                    return (
                      <li key={idx} className="flex gap-3 text-muted-foreground">
                        <img
                          src={stepImageFor(selectedItem?.id ?? "", idx)}
                          alt={`步骤 ${idx + 1}`}
                          loading="lazy"
                          decoding="async"
                          className="h-24 w-40 rounded-xl border object-cover transition-transform duration-200 hover:scale-[1.02]"
                          onClick={() => openLightbox(stepImageFor(selectedItem?.id ?? "", idx))}
                          role="button"
                          aria-label={`放大步骤 ${idx + 1} 图片`}
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              openLightbox(stepImageFor(selectedItem?.id ?? "", idx));
                            }
                          }}
                        />
                        <div className="flex-1">
                          <div className="text-xs font-medium text-muted-foreground/80">
                            步骤 {idx + 1}
                          </div>
                          {renderStepDetail()}
                        </div>
                      </li>
                    );
                  }
                )}
              </ol>
            </div>

            <div className="rounded-2xl border p-4">
              <div className="text-sm font-medium">预计耗时</div>
              <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarClock className="h-4 w-4" /> {selectedItem?.etaMinutes ?? 5} 分钟
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                className="rounded-2xl"
                onClick={() => selectedItem && toggleDone(selectedItem.id)}
                disabled={!!selectedItem?.locked}
              >
                {selectedItem?.done ? "标记为未完成" : "标记为已完成"}
              </Button>
              <Button variant="outline" className="rounded-2xl" onClick={goNextUnfinished}>
                切到下一项
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">步骤清单</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="rounded-2xl border p-4">
              <div className="flex items-center justify-between text-sm font-medium">
                <span>完成度</span>
                <span className="font-semibold">{checklistProgress.pct}%</span>
              </div>
              <div className="mt-2">
                <Progress
                  className="h-3 bg-muted/60"
                  value={clamp(checklistProgress.pct, 0, 100)}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-2xl border px-3 py-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="搜索步骤（邮箱 / GitLab / 群…）"
                className="h-7 border-0 p-0 shadow-none focus-visible:ring-0"
              />
            </div>

            <div className="space-y-2">
              {filteredItems.map((it) => {
                const active = it.id === selectedId;
                return (
                  <div
                    key={it.id}
                    className={`rounded-2xl border transition hover:border-primary/60 hover:bg-primary/5 hover:shadow-[0_0_4px_0_rgba(109,76,255,0.14)] ${
                      active ? "border-foreground/20" : "border-border"
                    } ${it.done ? "bg-muted/10 text-muted-foreground/80" : ""}`}
                  >
                    <div className="flex items-center gap-2 p-2">
                      <button
                        onClick={() => toggleDone(it.id)}
                        className="flex items-center justify-center rounded-xl p-2"
                        title={
                          it.locked
                            ? "该步骤当前被锁定"
                            : it.done
                            ? "点击标记为未完成"
                            : "点击标记为已完成"
                        }
                      >
                        {it.locked ? (
                          <Lock className="h-4 w-4 text-muted-foreground" />
                        ) : it.done ? (
                          <CheckCircle2 className="h-4 w-4 text-[#2e7d32]" />
                        ) : (
                          <Circle className="h-4 w-4 text-muted-foreground" />
                        )}
                      </button>

                      <button
                        onClick={() => setSelectedId(it.id)}
                        className="flex-1 rounded-xl px-2 py-2 text-left text-sm transition"
                      >
                      <div className={`font-medium ${it.done ? "line-through text-muted-foreground/70" : "text-foreground"}`}>
                          {it.title}
                        </div>
                        <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                          {typeof it.etaMinutes === "number" && <span>预计 {it.etaMinutes} 分钟</span>}
                          {it.done && <span>已完成</span>}
                          {!it.done && !it.locked && <span>未完成</span>}
                          {it.locked && <span>已锁定</span>}
                        </div>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </CardContent>
        </Card>
      </div>

      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 transition-opacity duration-200 will-change-opacity"
          onClick={handleCloseLightbox}
          role="presentation"
        >
          <div
            className="relative aspect-[16/9] max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl transform-gpu"
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
              className={`h-full w-full object-contain transform-gpu motion-safe:transition-opacity motion-safe:duration-200 motion-reduce:transition-none ${
                lightboxLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </div>
        </div>
      )}

    </div>
  );
}
