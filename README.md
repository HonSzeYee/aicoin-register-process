# AiCoin 新人入职指南 · 前端页面结构（Vite + React + TS + Tailwind）

## 1) 运行方式
```bash
npm i
npm run dev
```

## 2) 说明（关于 shadcn/ui）
本项目页面使用了 shadcn/ui 的组件 import 形式：
- `@/components/ui/card`
- `@/components/ui/button`
- `@/components/ui/badge`
- `@/components/ui/progress`
- `@/components/ui/separator`
- `@/components/ui/input`


## 3) 页面入口
- Dashboard：`src/pages/Dashboard.tsx`
- 账号注册页：`src/pages/AccountsRegistrationPage.tsx`

Dashboard 采用 **activeNav** 状态切换导航：
- 点击侧边栏「账号注册」→ 渲染 AccountsRegistrationPage
- 在账号注册页点击「返回」→ `onBack()` → 回到 Dashboard 首页（activeNav='dashboard')
