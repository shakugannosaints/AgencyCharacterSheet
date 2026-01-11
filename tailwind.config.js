/** @type {import('tailwindcss').Config} */

// 帮助函数：创建支持透明度的 CSS 变量颜色
function withOpacity(variableName) {
  return ({ opacityValue }) => {
    if (opacityValue !== undefined) {
      return `rgba(var(${variableName}), ${opacityValue})`;
    }
    return `rgb(var(${variableName}))`;
  };
}

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 主题化颜色 - 使用 CSS 变量
        'theme': {
          'bg': withOpacity('--theme-bg'),
          'surface': withOpacity('--theme-surface'),
          'border': withOpacity('--theme-border'),
          'hover': withOpacity('--theme-hover'),
          'text': withOpacity('--theme-text'),
          'text-muted': withOpacity('--theme-text-muted'),
          'primary': withOpacity('--theme-primary'),
          'primary-hover': withOpacity('--theme-primary-hover'),
          'accent': withOpacity('--theme-accent'),
        },
        // 系统强调色 - 保持固定
        'anomaly': '#2980b9',    // 异常体 - 蓝色
        'reality': '#f39c12',    // 现实 - 橙色  
        'functional': '#c0392b', // 职能 - 红色
        // 兼容性别名（逐渐迁移）
        'signal-red': 'rgb(var(--theme-primary))',
        'dark-bg': 'rgb(var(--theme-bg))',
        'dark-surface': 'rgb(var(--theme-surface))',
        'dark-border': 'rgb(var(--theme-border))',
        'dark-hover': 'rgb(var(--theme-hover))',
        'light-text': 'rgb(var(--theme-text))',
        'muted-text': 'rgb(var(--theme-text-muted))',
      },
      fontFamily: {
        'mono': ['Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-red': '0 0 20px rgba(192, 57, 43, 0.3)',
        'glow-blue': '0 0 20px rgba(41, 128, 185, 0.3)',
        'glow-orange': '0 0 20px rgba(243, 156, 18, 0.3)',
        'glow-primary': '0 0 20px rgba(var(--theme-primary), 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
