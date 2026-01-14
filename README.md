# 三角机构 角色卡 (Triangle Agency Character Sheet) ⚔️

![预览图](https://s2.loli.net/2026/01/15/gYQKf91PJusGrVv.png)

**一个面向桌面角色扮演游戏（TTRPG）的前端角色卡系统，基于 React + Vite + TypeScript 构建，强调模块化与可扩展性。**

---

## ✨ 特性

- 基于 React + TypeScript 的现代前端实现
- 使用 Vite 进行快速开发与构建
- Tailwind CSS 进行样式管理，符合项目主题的视觉系统
- Zustand + Immer 做为状态管理（Thick Store 模式）
- 支持导出（PDF/图片）、角色数据持久化与压缩（lz-string）
- 模块化的数据源（anomalies / functions / realities）便于扩展

---

## 🛠 技术栈

- 框架：React
- 构建工具：Vite
- 语言：TypeScript
- 样式：Tailwind CSS
- 状态管理：Zustand + Immer
- 其他：html2canvas、jspdf、uuid 等

---

## 🚀 本地运行

克隆仓库并安装依赖：

```bash
git clone <repo-url>
cd triangle-agency-character-sheet
npm install
```

开发服务器：

```bash
npm run dev
```

构建与预览：

```bash
npm run build
npm run preview
```

代码检查（ESLint）：

```bash
npm run lint
```

---

## 📁 项目结构（简要）

- `src/` - 源代码
  - `components/` - UI 组件与面板
  - `data/` - 静态数据（功能、异常、现实等）
  - `stores/` - 应用状态（Zustand）
  - `utils/` - 工具函数（导出、存储、初始化等）
- `public/` - 静态资源

---

