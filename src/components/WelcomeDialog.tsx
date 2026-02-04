import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Sparkles } from "lucide-react";

interface WelcomeDialogProps {
  open: boolean;
  onComplete: (name: string) => void;
}

export default function WelcomeDialog({ open, onComplete }: WelcomeDialogProps) {
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    
    if (!trimmedName) {
      setError("请输入你的名字");
      return;
    }
    
    if (trimmedName.length > 20) {
      setError("名字不能超过20个字符");
      return;
    }

    onComplete(trimmedName);
  };

  if (!open) return null;

  return createPortal(
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 z-[100] backdrop-blur-[2px]"
        style={{
          background:
            "radial-gradient(900px 520px at 50% -10%, rgba(59,130,246,0.12), transparent 60%), rgba(15,23,42,0.45)",
        }}
        aria-hidden="true"
      />
      
      {/* 对话框 */}
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        <Card className="w-full max-w-md rounded-2xl bg-card shadow-xl backdrop-blur-0">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">欢迎加入 AiCoin</CardTitle>
            <p className="mt-2 text-sm text-muted-foreground">
              请先设置你的名字，以便我们更好地为你提供服务
            </p>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  你的名字
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setError("");
                    }}
                    placeholder="请输入你的名字"
                    className="rounded-xl pl-10"
                    maxLength={20}
                    autoFocus
                  />
                </div>
                {error && (
                  <p className="text-sm text-destructive">{error}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  这个名字将显示在页面上，你可以稍后在设置中修改
                </p>
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl"
                disabled={!name.trim()}
              >
                开始使用
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>,
    document.body
  );
}
