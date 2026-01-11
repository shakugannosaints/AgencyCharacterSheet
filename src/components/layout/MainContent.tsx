/**
 * 主内容区域组件
 */
import React from 'react';
import { useUIStore } from '@/stores';
import { Tabs, BottomTabBar } from '@/components/ui';
import { 
  ProfilePanel, 
  AttributesPanel, 
  AnomalyPanel, 
  RelationsPanel, 
  ItemsPanel,
  QuestionnairePanel 
} from '@/components/panels';
import type { TabType } from '@/types';

// 标签页配置
const TABS = [
  { 
    id: 'profile' as TabType, 
    label: '档案',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )
  },
  { 
    id: 'attributes' as TabType, 
    label: '属性',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  { 
    id: 'anomaly' as TabType, 
    label: '异常',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    )
  },
  { 
    id: 'relations' as TabType, 
    label: '现实',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )
  },
  { 
    id: 'items' as TabType, 
    label: '物品',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    )
  },
  { 
    id: 'questionnaire' as TabType, 
    label: '问卷',
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )
  },
];

// 根据标签页ID获取对应的面板组件
function getPanelComponent(tabId: TabType) {
  switch (tabId) {
    case 'profile':
      return <ProfilePanel />;
    case 'attributes':
      return <AttributesPanel />;
    case 'anomaly':
      return <AnomalyPanel />;
    case 'relations':
      return <RelationsPanel />;
    case 'items':
      return <ItemsPanel />;
    case 'questionnaire':
      return <QuestionnairePanel />;
    default:
      return <ProfilePanel />;
  }
}

export const MainContent: React.FC = () => {
  const activeTab = useUIStore((state) => state.activeTab);
  const setActiveTab = useUIStore((state) => state.setActiveTab);

  return (
    <>
      <main className="container mx-auto px-4 py-6 pb-24 md:pb-6">
        {/* 桌面版标签页导航 */}
        <div className="hidden md:block mb-6">
          <Tabs
            tabs={TABS}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="default"
          />
        </div>

        {/* 内容区域 */}
        <div className="max-w-4xl mx-auto">
          {getPanelComponent(activeTab)}
        </div>
      </main>

      {/* 移动端底部标签栏 */}
      <BottomTabBar
        tabs={TABS}
        activeTab={activeTab}
        onChange={setActiveTab}
      />
    </>
  );
};
