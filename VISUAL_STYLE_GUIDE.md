# AgencyOS 视觉风格指导文档

## 概述

AgencyOS 是一个多主题支持的应用系统，提供多种视觉风格以适应不同的使用场景和用户偏好。本文档详细说明了项目的视觉设计系统、颜色规范、字体系统以及各主题的具体实现。

## 技术栈

- **框架**: React 19 + TypeScript
- **样式**: Tailwind CSS 3.4
- **构建工具**: Vite
- **状态管理**: Zustand
- **UI 组件**: Radix UI

## 主题系统

### 支持的主题模式

| 主题模式 | 描述 | 适用场景 |
|---------|------|---------|
| `night` | 默认深色主题，科技感强 | 日常使用，夜间操作 |
| `day` | 日间/机构主题，明亮清晰 | 白天使用，正式场合 |
| `day` + `flat` | 机构扁平化风格，简洁专业 | 正式文档，简洁界面 |
| `win98` | Windows 98 复古风格 | 怀旧体验，复古风格 |
| `retro` | 复古风格，类似早期 Windows | 怀旧体验 |
| `fluent` | Fluent Design 风格，现代简洁 | 现代化界面，Windows 风格 |
| `siphon` | 深海蓝色风格，科技感 | 科技主题，蓝色系 |

### 主题切换

主题通过 Zustand store 管理，存储在 localStorage 中：

```typescript
import { useThemeStore } from '@/stores/theme-store'

const mode = useThemeStore(state => state.mode)
const setMode = useThemeStore(state => state.setMode)
```

## 颜色系统

### CSS 变量定义

所有颜色通过 CSS 变量定义，支持透明度：

```css
--agency-ink: RGB 值           /* 背景色 */
--agency-panel: RGB 值         /* 面板/卡片背景 */
--agency-border: RGB 值        /* 边框颜色 */
--agency-cyan: RGB 值          /* 主色调 */
--agency-magenta: RGB 值       /* 次要强调色 */
--agency-amber: RGB 值         /* 警告色 */
--agency-muted: RGB 值         /* 次要文字颜色 */
--agency-glow-top: RGB 值      /* 顶部发光效果 */
--agency-glow-bottom: RGB 值   /* 底部发光效果 */
```

### Tailwind 配置

在 `tailwind.config.js` 中扩展颜色系统：

```javascript
colors: {
  agency: {
    ink: withOpacity('--agency-ink'),
    panel: withOpacity('--agency-panel'),
    border: withOpacity('--agency-border'),
    cyan: withOpacity('--agency-cyan'),
    magenta: withOpacity('--agency-magenta'),
    amber: withOpacity('--agency-amber'),
    muted: withOpacity('--agency-muted'),
  },
}
```

### 各主题颜色值

#### Night 主题（默认）
```css
--agency-ink: 13 13 15          /* #0D0D0F */
--agency-panel: 16 17 26        /* #10111A */
--agency-border: 38 40 59       /* #26283B */
--agency-cyan: 7 240 255        /* #07F0FF */
--agency-magenta: 255 15 154    /* #FF0F9A */
--agency-amber: 245 181 76      /* #F5B54C */
--agency-muted: 140 147 176     /* #8C93B0 */
```

#### Day 主题（日间/机构）
```css
--agency-ink: 248 246 244       /* #F8F6F4 */
--agency-panel: 255 255 255     /* #FFFFFF */
--agency-border: 224 214 214    /* #E0D6D6 */
--agency-cyan: 215 38 61        /* #D7263D - 机构红 */
--agency-magenta: 140 28 48     /* #8C1C30 - 深蓝次要色 */
--agency-amber: 210 120 60      /* #D2783C */
--agency-muted: 130 110 120     /* #826E78 */
```

#### Day Flat 主题（机构扁平化）
```css
--agency-ink: 247 247 245       /* #F7F7F5 - 更清爽的背景 */
--agency-panel: 255 255 255     /* 纯白卡片 */
--agency-border: 221 221 221    /* #DDDDDD - 柔和边框 */
--agency-cyan: 217 43 58        /* #D92B3A - 机构红 */
--agency-magenta: 29 53 87      /* #1D3557 - 深蓝次要色 */
--agency-amber: 212 175 55      /* #D4AF37 - 金色强调 */
--agency-muted: 68 68 68        /* #444444 - 深灰次要文字 */
```

#### Win98 主题
```css
--agency-ink: 14 1 47           /* #0E012F */
--agency-panel: 192 192 192     /* #C0C0C0 - 经典 Win98 窗口灰 */
--agency-border: 128 128 128    /* #808080 */
--agency-cyan: 0 0 0            /* #000000 - 主文字黑色 */
--agency-magenta: 0 0 128       /* #000080 - 标题栏深蓝 */
--agency-amber: 255 0 0         /* #FF0000 - 警告红 */
--agency-muted: 64 64 64        /* #404040 */
```

#### Retro 主题
```css
--agency-ink: 192 192 192       /* #C0C0C0 - 桌面灰 */
--agency-panel: 236 233 216     /* #ECE9D8 - 窗口背景 */
--agency-border: 128 128 128    /* #808080 */
--agency-cyan: 0 0 0            /* #000000 */
--agency-magenta: 0 0 128       /* #000080 */
--agency-amber: 128 0 0         /* #800000 */
--agency-muted: 80 80 80        /* #505050 */
```

#### Fluent 主题
```css
--agency-ink: 243 243 243       /* #F3F3F3 - Mica Alt background */
--agency-panel: 255 255 255     /* #FFFFFF */
--agency-border: 229 229 229    /* #E5E5E5 */
--agency-cyan: 0 120 212        /* #0078D4 - Windows Blue */
--agency-magenta: 194 57 179    /* #C239B3 */
--agency-amber: 202 80 16       /* #CA5010 */
--agency-muted: 97 97 97        /* #616161 */
```

#### Siphon 主题
```css
--agency-ink: 10 21 37          /* #0A1525 - 深海蓝背景 */
--agency-panel: 13 30 56        /* #0D1E38 - 深蓝面板 */
--agency-border: 39 82 162      /* #2752A2 - Siphon 蓝边框 */
--agency-cyan: 76 201 240       /* #4CC9F0 - 亮蓝强调 */
--agency-magenta: 255 0 85       /* #FF0055 - Siphon 红 */
--agency-amber: 255 215 0       /* #FFD700 - 金色 */
--agency-muted: 144 224 239     /* #90E0EF - 浅蓝说明文字 */
```

## 字体系统

### 字体家族

#### 主字体（Sans-serif）
```css
font-family: 'Inter', 'Segoe UI', system-ui, sans-serif
```

#### 等宽字体（Mono）
```css
font-family: 'IBM Plex Mono', 'JetBrains Mono', ui-monospace, 'SFMono-Regular', monospace
```

### Tailwind 配置

```javascript
fontFamily: {
  mono: ['"IBM Plex Mono"', '"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
  sans: ['"Inter"', '"Segoe UI"', 'system-ui', 'sans-serif'],
}
```

### 各主题字体

| 主题 | 主字体 | 说明 |
|-----|-------|------|
| night | Inter, Segoe UI, system-ui | 默认 |
| day | Inter, Segoe UI, system-ui | 默认 |
| day flat | Helvetica Neue, Helvetica, PingFang SC | 机构风格 |
| win98 | MS Sans Serif, Tahoma, Segoe UI | Win98 风格 |
| retro | Segoe UI, system-ui | 复古风格 |
| fluent | Segoe UI Variable, Segoe UI, system-ui | Fluent Design |
| siphon | Verdana, Microsoft YaHei | 科技风格 |

## 设计元素

### 圆角

#### 现代主题（night, day, fluent, siphon）
- 小元素: `rounded-sm` (2px)
- 按钮: `rounded-xl` (12px)
- 卡片/面板: `rounded-2xl` (16px)

#### 复古主题（win98, retro）
- 所有元素: `rounded-none` (0px)

#### 扁平化主题（day + flat）
- 所有元素: `rounded-none` (0px)

### 阴影

#### 面板阴影
```css
box-shadow: 0 0 0 1px rgba(7, 240, 255, 0.16), 0 10px 30px rgba(0, 0, 0, 0.26)
```

#### 扁平化主题
- 移除所有阴影效果

#### Win98 3D 效果
```css
/* Raised (凸起) */
box-shadow: -2px -2px 0 #ffffff, 2px 2px 0 #404040

/* Inset (凹陷) */
box-shadow: inset 1px 1px #404040, inset 2px 2px #808080, inset -1px -1px #ffffff, inset -2px -2px #dfdfdf
```

### 边框

#### 标准边框
```css
border: 1px solid rgb(var(--agency-border) / 1)
```

#### Win98 边框
- 使用 box-shadow 模拟 3D 边框效果，不使用 border 属性

### 间距系统

使用 Tailwind 默认间距系统：
- `p-4`: 1rem (16px)
- `gap-4`: 1rem (16px)
- `space-y-6`: 1.5rem (24px)
- `py-6`: 1.5rem (24px)
- `pb-16`: 4rem (64px)

## 组件样式

### Panel 组件

#### 现代主题
```tsx
className="rounded-2xl border border-agency-border bg-agency-panel/90 p-4 text-agency-cyan shadow-panel backdrop-blur-lg"
```

#### 复古主题
```tsx
className="rounded-none border-2 border-agency-border bg-agency-panel p-3 text-agency-cyan"
```

### StatCard 组件

#### 现代主题
```tsx
className="flex items-center gap-4 rounded-2xl border bg-agency-panel/70 p-4 shadow-panel"
```

#### 复古主题
```tsx
className="flex items-center gap-4 border bg-agency-panel/70 p-4 rounded-none shadow-none border-agency-border/80"
```

### 表单输入框

#### 标准样式
```tsx
className="w-full border bg-agency-ink/60 px-3 py-2 text-sm text-agency-cyan rounded-xl win98:rounded-none focus:outline-none focus:ring-1 focus:ring-agency-cyan/50"
```

#### 错误状态
```tsx
className="border-agency-magenta focus:ring-agency-magenta/50"
```

### 按钮

#### 现代主题
```tsx
className="border border-agency-border px-3 py-1 text-xs uppercase tracking-[0.3em] text-agency-cyan transition hover:border-agency-cyan/60 rounded-2xl"
```

#### Win98 按钮
```tsx
className="win98-raised"
```

## 动画效果

### 定义的关键帧

```css
@keyframes emergency {
  0%, 100% { filter: hue-rotate(0deg) saturate(1) }
  50% { filter: hue-rotate(40deg) saturate(2) }
}

@keyframes pulseGrid {
  0%, 100% { opacity: 0.4 }
  50% { opacity: 0.75 }
}

@keyframes slideInFromRight {
  0% { transform: translateX(100%)', opacity: 0 }
  100% { transform: translateX(0)', opacity: 1 }
}

@keyframes fadeOut {
  0% { opacity: 1 }
  100% { opacity: 0 }
}

@keyframes fadeIn {
  0% { opacity: 0, transform: translateY(-4px) }
  100% { opacity: 1, transform: translateY(0) }
}
```

### Siphon 主题动画

```css
@keyframes siphonOceanWave {
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
}

@keyframes siphonRipple {
  from { transform: rotate(0deg) scale(1.5) }
  to { transform: rotate(360deg) scale(1.5) }
}
```

## 滚动条样式

### 默认滚动条
```css
width: 14px
track: background: rgb(var(--agency-ink))
thumb: background: rgb(var(--agency-border))
```

### Win98 滚动条
```css
width: 16px
track: background: #dfdfdf
thumb: background-color: #c0c0c0 with 3D effect
```

### Fluent 滚动条
```css
width: 12px
track: transparent
thumb: background-color: rgba(0, 0, 0, 0.2) with rounded corners
```

### Siphon 滚动条
```css
width: 10px
track: rgba(39, 82, 162, 0.2)
thumb: background-color: #4CC9F0 with glow effect
```

## 工具函数

### useIsRetroStyle
检查当前主题是否为复古风格（win98 或 retro）

```typescript
import { useIsRetroStyle } from '@/lib/theme-utils'

const isRetro = useIsRetroStyle()
```

### useIsTheme
检查当前主题是否为特定模式

```typescript
import { useIsTheme } from '@/lib/theme-utils'

const isWin98 = useIsTheme('win98')
```

### useThemeClassnames
根据当前主题模式应用不同的样式类

```typescript
import { useThemeClassnames } from '@/lib/theme-utils'

const className = useThemeClassnames({
  win98: 'win98-style',
  fluent: 'fluent-style',
  default: 'default-style'
})
```

### useIntentClassnames
根据意图（intent）和主题模式获取对应的样式类

```typescript
import { useIntentClassnames } from '@/lib/theme-utils'

const className = useIntentClassnames('warning')
```

### usePanelClassnames
获取面板组件的基础样式类

```typescript
import { usePanelClassnames } from '@/lib/theme-utils'

const panelClass = usePanelClassnames()
```

## 日间（机构）主题详细说明

### 设计理念
日间主题采用明亮、清晰的配色方案，适合白天使用和正式场合。扁平化变体进一步简化视觉效果，提供类似传统机构文档的简洁专业感。

### 颜色使用指南

#### 主色（机构红）
- 用途：主要操作按钮、重要信息、导航高亮
- 颜色值：`#D7263D`（day） / `#D92B3A`（day flat）
- Tailwind 类：`text-agency-cyan`、`bg-agency-cyan`

#### 次要色（深蓝）
- 用途：次要强调、辅助信息、链接
- 颜色值：`#8C1C30`（day） / `#1D3557`（day flat）
- Tailwind 类：`text-agency-magenta`、`border-agency-magenta`

#### 警告色（金色/琥珀色）
- 用途：警告提示、注意事项
- 颜色值：`#D2783C`（day） / `#D4AF37`（day flat）
- Tailwind 类：`text-agency-amber`、`border-agency-amber`

#### 次要文字
- 用途：说明文字、标签、辅助信息
- 颜色值：`#826E78`（day） / `#444444`（day flat）
- Tailwind 类：`text-agency-muted`

### 扁平化特性

当 `data-day-flat='true'` 时：
- 所有圆角设置为 0
- 移除所有阴影效果
- 使用更柔和的边框颜色（`#DDDDDD`）
- 背景色更清爽（`#F7F7F5`）

### 使用示例

```tsx
<div data-theme="day" data-day-flat="true">
  <Panel>
    <h2 className="text-agency-cyan">标题</h2>
    <p className="text-agency-muted">说明文字</p>
    <button className="border border-agency-border text-agency-cyan">
      操作按钮
    </button>
  </Panel>
</div>
```

## 最佳实践

### 1. 使用主题感知的组件
始终使用 `useThemeClassnames` 或 `useIsTheme` 等工具函数来应用主题特定的样式。

### 2. 避免硬编码颜色
使用 CSS 变量或 Tailwind 的 `agency-*` 颜色类，而不是硬编码颜色值。

### 3. 保持一致性
在相似的场景中使用相同的样式类和设计模式。

### 4. 响应式设计
使用 Tailwind 的响应式前缀（`md:`, `lg:` 等）确保在不同屏幕尺寸下都有良好的显示效果。

### 5. 可访问性
- 确保颜色对比度符合 WCAG 标准
- 为交互元素提供适当的焦点状态
- 使用语义化的 HTML 元素

## 文件结构

```
src/
├── index.css                    # 全局样式和主题变量定义
├── tailwind.config.js           # Tailwind 配置
├── stores/
│   └── theme-store.ts           # 主题状态管理
├── lib/
│   └── theme-utils.ts           # 主题工具函数
└── components/
    └── ui/                      # UI 组件（已应用主题样式）
```

## 参考KPI考核

- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Radix UI 文档](https://www.radix-ui.com/)
- [Zustand 文档](https://zustand-demo.pmnd.rs/)
- [Fluent Design 指南](https://fluent2.microsoft.design/)

## 更新日志

- 2026-01-08: 初始版本，包含所有主题的完整视觉风格指导
