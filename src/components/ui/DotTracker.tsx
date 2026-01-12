/**
 * 属性点数追踪器组件
 * 用于显示和编辑资质保证的当前值/最大值
 */
import React from 'react';
import clsx from 'clsx';

interface DotTrackerProps {
  current: number;
  max: number;
  marked?: boolean;
  onChange?: (current: number) => void;
  onMaxChange?: (max: number) => void;
  onToggleMarked?: () => void;
  size?: 'sm' | 'md' | 'lg';
  color?: 'red' | 'blue' | 'orange' | 'gray';
  readonly?: boolean;
}

export const DotTracker: React.FC<DotTrackerProps> = ({
  current,
  max,
  marked = false,
  onChange,
  onMaxChange,
  onToggleMarked,
  size = 'md',
  color = 'red',
  readonly = false,
}) => {
  const handleDotClick = (index: number) => {
    if (readonly || !onChange) return;
    
    // 点击已填充的点会取消填充到该点
    // 点击空心点会填充到该点
    if (index + 1 <= current) {
      // 如果点击的是已填充的点，则设置到该点之前
      onChange(index);
    } else {
      // 如果点击的是空心点，则填充到该点
      onChange(index + 1);
    }
  };

  const handleMaxChange = (delta: number) => {
    if (readonly || !onMaxChange) return;
    const newMax = Math.max(1, Math.min(10, max + delta));
    onMaxChange(newMax);
  };

  const sizeStyles = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const colorStyles = {
    red: {
      filled: 'bg-theme-primary border-theme-primary',
      empty: 'border-theme-primary/50',
      marked: 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-theme-surface',
    },
    blue: {
      filled: 'bg-anomaly border-anomaly',
      empty: 'border-anomaly/50',
      marked: 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-theme-surface',
    },
    orange: {
      filled: 'bg-reality border-reality',
      empty: 'border-reality/50',
      marked: 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-theme-surface',
    },
    gray: {
      filled: 'bg-theme-text-muted border-theme-text-muted',
      empty: 'border-theme-text-muted/50',
      marked: 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-theme-surface',
    },
  };

  const dots = Array.from({ length: max }, (_, i) => {
    const isFilled = i < current;
    return (
      <button
        key={i}
        type="button"
        onClick={() => handleDotClick(i)}
        disabled={readonly}
        className={clsx(
          'rounded-full border-2 transition-all duration-150',
          sizeStyles[size],
          isFilled ? colorStyles[color].filled : colorStyles[color].empty,
          !readonly && 'hover:scale-110 cursor-pointer',
          readonly && 'cursor-default'
        )}
        title={`${i + 1}/${max}`}
      />
    );
  });

  return (
    <div className="flex flex-wrap items-center gap-2 justify-center">
      <div className="flex flex-wrap gap-1 justify-center">
        {dots}
      </div>
      
      {/* 标记指示器 */}
      {onToggleMarked && (
        <button
          type="button"
          onClick={onToggleMarked}
          disabled={readonly}
          className={clsx(
            'w-4 h-4 rounded border-2 flex items-center justify-center text-xs flex-shrink-0',
            marked
              ? 'bg-yellow-500 border-yellow-400 text-theme-bg'
              : 'border-theme-text-muted/50 text-theme-text-muted hover:border-yellow-500',
            !readonly && 'cursor-pointer',
            readonly && 'cursor-default'
          )}
          title={marked ? '取消标记' : '标记'}
        >
          {marked && '✓'}
        </button>
      )}
      
      {/* 最大值调整按钮 */}
      {onMaxChange && !readonly && (
        <div className="flex gap-0.5 flex-shrink-0">
          <button
            type="button"
            onClick={() => handleMaxChange(-1)}
            className="w-5 h-5 text-xs text-theme-text-muted hover:text-theme-text hover:bg-theme-hover rounded transition-colors"
            title="减少最大值"
          >
            −
          </button>
          <button
            type="button"
            onClick={() => handleMaxChange(1)}
            className="w-5 h-5 text-xs text-theme-text-muted hover:text-theme-text hover:bg-theme-hover rounded transition-colors"
            title="增加最大值"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
};

/**
 * 数值计数器组件
 */
interface CounterProps {
  value: number;
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  size?: 'sm' | 'md';
  readonly?: boolean;
}

export const Counter: React.FC<CounterProps> = ({
  value,
  onChange,
  min = 0,
  max = 999,
  label,
  size = 'md',
  readonly = false,
}) => {
  const handleChange = (delta: number) => {
    if (readonly || !onChange) return;
    const newValue = Math.max(min, Math.min(max, value + delta));
    onChange(newValue);
  };

  const sizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
  };

  const buttonSize = {
    sm: 'w-6 h-6 text-sm',
    md: 'w-8 h-8 text-lg',
  };

  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className={clsx('text-theme-text-muted', sizeStyles[size])}>{label}</span>
      )}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => handleChange(-1)}
          disabled={readonly || value <= min}
          className={clsx(
            'flex items-center justify-center rounded bg-theme-hover text-theme-text transition-colors',
            buttonSize[size],
            'hover:bg-theme-border disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          −
        </button>
        <span
          className={clsx(
            'min-w-[2.5rem] text-center font-mono font-bold text-theme-text',
            sizeStyles[size]
          )}
        >
          {value}
        </span>
        <button
          type="button"
          onClick={() => handleChange(1)}
          disabled={readonly || value >= max}
          className={clsx(
            'flex items-center justify-center rounded bg-theme-hover text-theme-text transition-colors',
            buttonSize[size],
            'hover:bg-theme-border disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        >
          +
        </button>
      </div>
    </div>
  );
};
