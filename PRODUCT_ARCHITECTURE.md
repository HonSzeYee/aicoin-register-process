# AiCoin 入职指南：产品架构 + 技术架构

本文档用于快速理解 **产品信息架构** 与 **代码架构**。内容基于当前代码结构（React + Vite）。

---

## 一、产品架构（用户视角）

### 1. 产品定位
为新员工提供完整的入职指引、账号注册流程、开发/协作规范与常见问题解答，并记录完成进度。

### 2. 主要模块（信息架构）
- **入职总览（Dashboard）**
  - 欢迎与角色说明入口
  - 下一步推荐行动
  - 进度概览
  - 核心任务逻辑（分栏树）
  - 清单示例（可勾选）
- **账号注册（Accounts）**
  - 逐项注册清单
  - 操作指引（图文+步骤）
  - 预计耗时/完成状态
  - 右侧步骤清单（分组、编号、推荐）
- **开发指南（Dev Guide）**
  - 前置准备
  - 开发环境搭建
  - 整体流程
  - GitLab 分支规范
  - Commit 规范
  - PC/iOS/Android 端切换
- **软件使用（Tools）**
  - 常用工具说明与入口
- **工作流程（Workflow）**
  - 详细步骤指引（支持跳转）
- **常见问题（FAQ）**
  - 折叠式问答
  - 支持图片说明
- **设置（Settings）**
  - 用户名
  - 字体大小
- **弹窗层**
  - 欢迎弹窗（首次填写用户名）
  - 角色说明弹窗

### 3. 核心用户流程
1. 进入首页（Dashboard）
2. 设置用户名（Welcome）
3. 从「账号注册」开始完成清单
4. 按推荐进入开发指南/工作流程
5. 查阅 FAQ / 工具使用
6. 进度自动记录并可同步

### 4. 关键数据/状态
- **用户信息**：用户名
- **账号注册清单**：完成状态/预计时长
- **开发指南阅读状态**
- **搜索关键词**
- **进度同步时间戳**

---

## 二、技术架构（实现视角）

### 1. 技术栈
- **React 18 + TypeScript**
- **Vite** 构建
- **Tailwind CSS** 样式
- **Ant Design**（部分 UI，如 Collapse/Segmented）
- **Lucide Icons**

### 2. 路由结构（src/App.tsx）
- `/` → Dashboard
- `/accounts` → 账号注册
- `/dev` → 开发指南
- `/tools` → 软件使用
- `/workflow` → 工作流程
- `/faq` → 常见问题

### 3. 全局状态（src/context/AppStateContext.tsx）
集中管理：
- `userName`
- `accountItems`（账号清单）
- `devReadMap`（开发指南阅读）
- `searchQuery`
- 进度同步逻辑（本地 + 远端）

### 4. 数据持久化与同步
- **本地缓存**：localStorage
  - 用户名/清单/阅读状态/同步时间戳
- **远端同步**：`src/lib/progressSync.ts`
  - GET/PUT `/api/onboarding/progress`
  - 有防抖保存逻辑（600ms）

### 5. 页面与组件分层
- **页面（src/pages）**：核心业务 UI
- **布局（src/layouts/AppLayout.tsx）**：全局导航 + Header
- **组件（src/components）**：
  - 通用 UI：Button、Card、Badge、Input…
  - 业务弹窗：WelcomeDialog、RoleDescriptionDialog
- **样式（src/styles/globals.css）**：
  - 主题变量
  - 全局工具类
  - 自定义交互/版式样式

### 6. 视觉/交互约定
- 统一 8px 圆角
- 全局 `interactive-glow` hover 光圈
- 轻量玻璃/浅灰边框体系
- 背景统一白色

---

## 三、关键文件索引

- `src/App.tsx`：路由入口
- `src/context/AppStateContext.tsx`：全局状态与同步
- `src/layouts/AppLayout.tsx`：侧边栏/头部布局
- `src/pages/Dashboard.tsx`：入职总览与核心任务
- `src/pages/AccountsRegistrationPage.tsx`：账号注册流程
- `src/pages/DevGuidePage.tsx`：开发指南
- `src/pages/WorkflowPage.tsx`：工作流程
- `src/pages/FaqPage.tsx`：常见问题
- `src/components/WelcomeDialog.tsx`：欢迎弹窗
- `src/components/RoleDescriptionDialog.tsx`：角色说明
- `src/styles/globals.css`：全局样式

---

如果你希望把这份文档进一步拆成 “产品说明书 / 技术说明书”，或补充流程图与用户旅程图，我可以继续扩展。
