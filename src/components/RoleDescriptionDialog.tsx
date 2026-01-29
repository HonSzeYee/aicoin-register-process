import React from "react";
import { createPortal } from "react-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Users, Briefcase, CheckSquare, Wrench } from "lucide-react";

interface RoleDescriptionDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function RoleDescriptionDialog({ open, onClose }: RoleDescriptionDialogProps) {
  if (!open) return null;

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/55 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
          <CardHeader className="border-b bg-muted/30 pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-xl">产品经理</CardTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">Product Manager</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-muted">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6 p-6">
            {/* 角色职责 - 突出显示 */}
            <div className="rounded-xl bg-secondary/50 p-4 border border-border/50">
              <div className="mb-3 flex items-center gap-2 text-foreground">
                <Briefcase className="h-4 w-4 text-primary" />
                <h3 className="font-semibold">角色职责</h3>
              </div>
              <ul className="grid gap-y-2 gap-x-4 text-sm text-muted-foreground sm:grid-cols-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  负责产品需求规划和管理
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  协调设计和开发团队完成产品迭代
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  跟进项目进度，确保按时交付
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60" />
                  收集用户反馈，优化产品体验
                </li>
              </ul>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* 入职重点 */}
              <div className="rounded-xl border p-4 hover:bg-accent/5 transition-colors">
                <div className="mb-3 flex items-center gap-2 text-foreground">
                  <CheckSquare className="h-4 w-4 text-blue-500" />
                  <h3 className="font-semibold">入职重点</h3>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    完成账号注册（企业邮箱、iTask、Figma、GitLab）
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    学习产品工作流程和需求管理规范
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    熟悉 Demo 版本和传统版本工作流程
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    了解设计规范和开发协作流程
                  </li>
                </ul>
              </div>

              {/* 常用工具 */}
              <div className="rounded-xl border p-4 hover:bg-accent/5 transition-colors">
                <div className="mb-3 flex items-center gap-2 text-foreground">
                  <Wrench className="h-4 w-4 text-orange-500" />
                  <h3 className="font-semibold">常用工具</h3>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex items-center gap-3 rounded-lg bg-secondary/30 p-2 transition-colors hover:bg-secondary/50">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background shadow-sm border">
                      <span className="text-xs font-bold text-blue-600">i</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-xs">iTask</div>
                      <div className="text-[10px] opacity-80">任务管理和协作</div>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 rounded-lg bg-secondary/30 p-2 transition-colors hover:bg-secondary/50">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background shadow-sm border">
                      <span className="text-xs font-bold text-purple-600">F</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-xs">Figma</div>
                      <div className="text-[10px] opacity-80">设计稿查看和标注</div>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 rounded-lg bg-secondary/30 p-2 transition-colors hover:bg-secondary/50">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background shadow-sm border">
                      <span className="text-xs font-bold text-orange-600">G</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-xs">GitLab</div>
                      <div className="text-[10px] opacity-80">需求跟踪和代码审查</div>
                    </div>
                  </li>
                  <li className="flex items-center gap-3 rounded-lg bg-secondary/30 p-2 transition-colors hover:bg-secondary/50">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-background shadow-sm border">
                      <span className="text-xs font-bold text-indigo-600">C</span>
                    </div>
                    <div>
                      <div className="font-medium text-foreground text-xs">Cursor</div>
                      <div className="text-[10px] opacity-80">AI 辅助代码编辑</div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>,
    document.body
  );
}
