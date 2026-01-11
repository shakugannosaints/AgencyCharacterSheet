/**
 * 三角机构角色卡 2.0 - 主应用组件
 */
import React, { useEffect } from 'react';
import { Header, MainContent, NotificationContainer } from '@/components';
import { useCharacterStore, useUIStore } from '@/stores';
import { parseShareLink } from '@/utils/export';

/**
 * 处理分享链接
 */
function handleShareLink() {
  const params = new URLSearchParams(window.location.search);
  const shareData = params.get('share');
  
  if (shareData) {
    try {
      const characterData = parseShareLink(shareData);
      if (characterData) {
        // 导入分享的角色数据
        const store = useCharacterStore.getState();
        store.importCharacter(characterData);
        
        // 清除 URL 参数
        window.history.replaceState({}, '', window.location.pathname);
        
        // 显示成功通知
        useUIStore.getState().addNotification({
          type: 'success',
          message: `成功导入角色: ${characterData.name || '未命名'}`,
        });
      }
    } catch (error) {
      console.error('Failed to parse share link:', error);
      useUIStore.getState().addNotification({
        type: 'error',
        message: '无效的分享链接',
      });
    }
  }
}

/**
 * 处理响应式布局
 */
function useResponsive() {
  const setIsMobile = useUIStore((state) => state.setIsMobile);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [setIsMobile]);
}

/**
 * 初始化应用状态
 */
function useAppInitialization() {
  useEffect(() => {
    // 处理分享链接
    handleShareLink();

    // 加载当前角色（如果有分享链接，会在上面处理）
    const store = useCharacterStore.getState();
    if (!store.isLoaded) {
      store.loadCharacter();
    }
  }, []);
}

/**
 * 主题管理 Hook
 */
function useThemeEffect() {
  const theme = useUIStore((state) => state.theme);

  useEffect(() => {
    // 将主题应用到 document.documentElement
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
}

export const App: React.FC = () => {
  // 响应式布局处理
  useResponsive();
  
  // 应用初始化
  useAppInitialization();
  
  // 主题管理
  useThemeEffect();
  
  const theme = useUIStore((state) => state.theme);

  return (
    <div 
      className="min-h-screen bg-theme-bg text-theme-text transition-colors duration-300"
      data-theme={theme}
    >
      {/* 页头 */}
      <Header />
      
      {/* 主内容区域 */}
      <MainContent />
      
      {/* 通知容器 */}
      <NotificationContainer />
    </div>
  );
};

export default App;
