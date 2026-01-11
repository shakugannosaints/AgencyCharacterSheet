/**
 * 选择器组件
 * 支持普通选择和带自定义输入的混合选择
 */
import React, { useState, forwardRef } from 'react';
import clsx from 'clsx';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  helperText?: string;
  onChange?: (value: string) => void;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, helperText, className, id, value, onChange, ...props }, ref) => {
    const inputId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-theme-text-muted mb-1.5"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={inputId}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className={clsx(
            'w-full px-3 py-2 bg-theme-surface border rounded transition-colors duration-200',
            'text-theme-text appearance-none cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent',
            error ? 'border-red-500' : 'border-theme-border hover:border-theme-text-muted',
            className
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23999' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem',
          }}
          {...props}
        >
          <option value="">请选择...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
        {helperText && !error && (
          <p className="mt-1 text-sm text-theme-text-muted">{helperText}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

/**
 * 混合选择器：支持从列表选择或自定义输入
 */
interface HybridSelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  error?: string;
}

export const HybridSelect: React.FC<HybridSelectProps> = ({
  label,
  options,
  value,
  onChange,
  placeholder = '选择或输入...',
  className,
  error,
}) => {
  const [isCustom, setIsCustom] = useState(() => {
    return value !== '' && !options.some(opt => opt.value === value);
  });

  const handleSelectChange = (newValue: string) => {
    if (newValue === '__custom__') {
      setIsCustom(true);
      onChange('');
    } else {
      setIsCustom(false);
      onChange(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleBackToSelect = () => {
    setIsCustom(false);
    onChange('');
  };

  return (
    <div className={clsx('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-theme-text-muted mb-1.5">
          {label}
        </label>
      )}
      
      {isCustom ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={value}
            onChange={handleInputChange}
            placeholder={placeholder}
            className={clsx(
              'flex-1 px-3 py-2 bg-theme-surface border rounded transition-colors duration-200',
              'text-theme-text placeholder-theme-text-muted',
              'focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent',
              error ? 'border-red-500' : 'border-theme-border hover:border-theme-text-muted'
            )}
          />
          <button
            type="button"
            onClick={handleBackToSelect}
            className="px-3 py-2 bg-theme-surface border border-theme-border rounded text-theme-text-muted hover:text-theme-text hover:bg-theme-hover transition-colors"
            title="返回选择"
          >
            ↩
          </button>
        </div>
      ) : (
        <select
          value={value}
          onChange={(e) => handleSelectChange(e.target.value)}
          className={clsx(
            'w-full px-3 py-2 bg-theme-surface border rounded transition-colors duration-200',
            'text-theme-text appearance-none cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent',
            error ? 'border-red-500' : 'border-theme-border hover:border-theme-text-muted'
          )}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23999' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
            backgroundPosition: 'right 0.5rem center',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '1.5em 1.5em',
            paddingRight: '2.5rem',
          }}
        >
          <option value="">请选择...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
          <option value="__custom__">✏️ 自定义输入...</option>
        </select>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};
