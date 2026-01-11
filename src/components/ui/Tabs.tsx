/**
 * 标签页导航组件
 */
import React from 'react';
import clsx from 'clsx';
import type { TabType } from '@/types';

interface Tab {
  id: TabType;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: TabType;
  onChange: (tab: TabType) => void;
  variant?: 'default' | 'pills';
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onChange,
  variant = 'default',
}) => {
  if (variant === 'pills') {
    return (
      <div className="flex gap-2 p-1 bg-theme-surface rounded-lg">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200',
              activeTab === tab.id
                ? 'bg-theme-primary text-white shadow-lg'
                : 'text-theme-text-muted hover:text-theme-text hover:bg-theme-hover'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="border-b border-theme-border">
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 -mb-px',
              activeTab === tab.id
                ? 'border-theme-primary text-theme-primary'
                : 'border-transparent text-theme-text-muted hover:text-theme-text hover:border-theme-border'
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

/**
 * 移动端底部标签栏
 */
interface BottomTabBarProps {
  tabs: Tab[];
  activeTab: TabType;
  onChange: (tab: TabType) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  tabs,
  activeTab,
  onChange,
}) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-theme-surface border-t border-theme-border z-40 md:hidden">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors',
              activeTab === tab.id
                ? 'text-theme-primary'
                : 'text-theme-text-muted'
            )}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
