/**
 * 卡片组件
 */
import React from 'react';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
}) => {
  const variantStyles = {
    default: 'bg-theme-surface',
    bordered: 'bg-theme-surface border border-theme-border',
    elevated: 'bg-theme-surface shadow-lg shadow-black/10',
  };
  
  const paddingStyles = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };

  return (
    <div
      className={clsx(
        'rounded-lg',
        variantStyles[variant],
        paddingStyles[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

/**
 * 卡片头部
 */
interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export const CardHeader: React.FC<CardHeaderProps> = ({
  title,
  subtitle,
  action,
  className,
}) => {
  return (
    <div className={clsx('flex items-start justify-between mb-4', className)}>
      <div>
        <h3 className="text-lg font-semibold text-theme-text">{title}</h3>
        {subtitle && (
          <p className="text-sm text-theme-text-muted mt-0.5">{subtitle}</p>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

/**
 * 可折叠卡片
 */
interface CollapsibleCardProps extends CardProps {
  title: string;
  defaultOpen?: boolean;
  badge?: React.ReactNode;
  action?: React.ReactNode;
}

export const CollapsibleCard: React.FC<CollapsibleCardProps> = ({
  title,
  defaultOpen = true,
  badge,
  action,
  children,
  className,
  ...props
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <Card className={className} {...props}>
      <div className="flex items-center justify-between">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 flex items-center gap-2 text-left"
        >
          <span className="text-lg font-semibold text-theme-text">{title}</span>
          {badge}
        </button>
        <div className="flex items-center gap-2">
          {action && <div onClick={(e) => e.stopPropagation()}>{action}</div>}
          <button onClick={() => setIsOpen(!isOpen)}>
            <svg
              className={clsx(
                'w-5 h-5 text-theme-text-muted transition-transform duration-200',
                isOpen && 'rotate-180'
              )}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
      
      {isOpen && (
        <div className="mt-4 pt-4 border-t border-theme-border">
          {children}
        </div>
      )}
    </Card>
  );
};
