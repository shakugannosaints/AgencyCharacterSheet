/**
 * 进度轨道组件
 * 用于显示职能/现实/异常进度
 */
import React from 'react';
import clsx from 'clsx';
import type { ProgressTrackType } from '@/types';

interface ProgressTrackProps {
  type: ProgressTrackType;
  filled: number[];
  ignored: number[];
  size?: number;
  columns?: number;
  onCellClick?: (index: number) => void;
  onCellRightClick?: (index: number) => void;
  readonly?: boolean;
}

export const ProgressTrack: React.FC<ProgressTrackProps> = ({
  type,
  filled,
  ignored,
  size = 30,
  columns = 6,
  onCellClick,
  onCellRightClick,
  readonly = false,
}) => {
  const typeColors = {
    functional: {
      filled: 'bg-functional border-functional',
      ignored: 'bg-theme-hover border-theme-border opacity-50',
      empty: 'border-functional/40',
    },
    reality: {
      filled: 'bg-reality border-reality',
      ignored: 'bg-theme-hover border-theme-border opacity-50',
      empty: 'border-reality/40',
    },
    anomaly: {
      filled: 'bg-anomaly border-anomaly',
      ignored: 'bg-theme-hover border-theme-border opacity-50',
      empty: 'border-anomaly/40',
    },
  };

  const typeLabels = {
    functional: '职能',
    reality: '现实',
    anomaly: '异常',
  };

  const colors = typeColors[type];

  const handleClick = (index: number, e: React.MouseEvent) => {
    if (readonly) return;
    
    if (e.button === 2) {
      // 右键点击
      e.preventDefault();
      onCellRightClick?.(index);
    } else {
      // 左键点击
      onCellClick?.(index);
    }
  };

  const handleContextMenu = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (!readonly) {
      onCellRightClick?.(index);
    }
  };

  const cells = Array.from({ length: size }, (_, i) => {
    const isFilled = filled.includes(i);
    const isIgnored = ignored.includes(i);
    
    let cellStyle: string;
    if (isFilled) {
      cellStyle = colors.filled;
    } else if (isIgnored) {
      cellStyle = colors.ignored;
    } else {
      cellStyle = colors.empty;
    }

    return (
      <button
        key={i}
        type="button"
        onClick={(e) => handleClick(i, e)}
        onContextMenu={(e) => handleContextMenu(i, e)}
        disabled={readonly}
        className={clsx(
          'w-6 h-6 rounded border-2 transition-all duration-150',
          cellStyle,
          !readonly && 'hover:scale-105 cursor-pointer',
          readonly && 'cursor-default',
          isIgnored && 'diagonal-lines'
        )}
        title={`格子 ${i + 1}${isFilled ? ' (已填充)' : isIgnored ? ' (已忽略)' : ''}`}
      />
    );
  });

  // 按行分组显示
  const rows: React.ReactNode[] = [];
  for (let i = 0; i < size; i += columns) {
    rows.push(
      <div key={i} className="flex gap-1">
        {cells.slice(i, i + columns)}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-theme-text-muted">
          {typeLabels[type]} 进度
        </span>
        <span className="text-xs text-theme-text-muted">
          {filled.length}/{size - ignored.length}
        </span>
      </div>
      <div className="space-y-1">
        {rows}
      </div>
      {!readonly && (
        <p className="text-xs text-theme-text-muted mt-1">
          左键填充/取消，右键忽略/取消
        </p>
      )}
    </div>
  );
};

/**
 * 崩溃进度组件（现实过载）
 */
interface CollapseProgressProps {
  slots: boolean[];
  onToggle?: (index: number) => void;
  readonly?: boolean;
}

export const CollapseProgress: React.FC<CollapseProgressProps> = ({
  slots,
  onToggle,
  readonly = false,
}) => {
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-theme-text-muted">崩溃进度</span>
      <div className="flex gap-2">
        {slots.map((filled, i) => (
          <button
            key={i}
            type="button"
            onClick={() => !readonly && onToggle?.(i)}
            disabled={readonly}
            className={clsx(
              'w-8 h-8 rounded border-2 transition-all duration-150 flex items-center justify-center',
              filled
                ? 'bg-red-600 border-red-500 text-white'
                : 'border-red-500/40 text-red-500/40',
              !readonly && 'hover:scale-105 cursor-pointer',
              readonly && 'cursor-default'
            )}
            title={`槽位 ${i + 1}${filled ? ' (已填充)' : ''}`}
          >
            {filled ? '✕' : ''}
          </button>
        ))}
      </div>
    </div>
  );
};
