/**
 * 底部标签栏组件 (移动端)
 */
import React from 'react';
import clsx from 'clsx';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface BottomTabBarProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  tabs,
  activeTab,
  onChange,
}) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-theme-surface border-t border-theme-border md:hidden z-50">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={clsx(
              'flex flex-col items-center justify-center flex-1 h-full px-2 py-1 transition-colors',
              activeTab === tab.id
                ? 'text-theme-primary'
                : 'text-theme-text-muted hover:text-theme-text'
            )}
          >
            {tab.icon && (
              <span className="mb-1">{tab.icon}</span>
            )}
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};
