/**
 * 应用头部组件
 */
import React, { useRef, useState } from 'react';
import { useCharacterStore, useUIStore } from '@/stores';
import { Button, Modal, useNotification } from '@/components/ui';
import { exportToJson, exportToOfflineHtml, exportToPdf, importFromJson, generateShareUrl, copyToClipboard } from '@/utils';
import { migrateCharacterData, validateCharacterData } from '@/utils/character';

export const Header: React.FC = () => {
  const character = useCharacterStore((state) => state.character);
  const hasUnsavedChanges = useCharacterStore((state) => state.hasUnsavedChanges);
  const save = useCharacterStore((state) => state.save);
  const importCharacter = useCharacterStore((state) => state.importCharacter);
  const createNewCharacter = useCharacterStore((state) => state.createNewCharacter);
  
  // 主题状态
  const theme = useUIStore((state) => state.theme);
  const toggleTheme = useUIStore((state) => state.toggleTheme);
  
  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const notification = useNotification();

  const handleExportJson = () => {
    exportToJson(character);
    notification.success('JSON文件已导出');
    setExportModalOpen(false);
  };

  const handleExportHtml = () => {
    exportToOfflineHtml(character);
    notification.success('离线HTML已导出');
    setExportModalOpen(false);
  };

  const handleExportPdf = async () => {
    try {
      notification.info('正在生成PDF...');
      await exportToPdf(character, theme);
      notification.success('PDF文件已导出');
      setExportModalOpen(false);
    } catch (error) {
      notification.error('PDF导出失败: ' + (error as Error).message);
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await importFromJson(file);
      
      let characterData;
      if (validateCharacterData(data)) {
        characterData = data;
      } else if (data && typeof data === 'object') {
        characterData = migrateCharacterData(data as Record<string, unknown>);
      } else {
        throw new Error('无效的角色数据');
      }
      
      importCharacter(characterData);
      notification.success('角色导入成功');
    } catch (error) {
      notification.error('导入失败: ' + (error as Error).message);
    }
    
    // 重置文件输入
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleShare = () => {
    const url = generateShareUrl(character);
    setShareUrl(url);
    setShareModalOpen(true);
  };

  const handleCopyShareUrl = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      notification.success('链接已复制到剪贴板');
    } else {
      notification.error('复制失败，请手动复制');
    }
  };

  const handleNewCharacter = () => {
    if (hasUnsavedChanges) {
      if (!window.confirm('有未保存的更改，确定要创建新角色吗？')) {
        return;
      }
    }
    createNewCharacter();
    notification.success('已创建新角色');
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-theme-bg/95 backdrop-blur border-b border-theme-border transition-colors duration-300">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <span className="text-2xl text-signal-red">▲</span>
              <div>
                <h1 className="text-lg font-bold text-theme-text">三角机构</h1>
                <p className="text-xs text-theme-text-muted hidden sm:block">半自动角色卡</p>
              </div>
            </div>

            {/* 角色名称 */}
            <div className="hidden md:block text-center">
              <span className="text-theme-text font-medium">
                {character.name || '未命名特工'}
              </span>
              {hasUnsavedChanges && (
                <span className="ml-2 text-xs text-yellow-500">●</span>
              )}
            </div>

            {/* 操作按钮 */}
            <div className="flex items-center gap-2">
              {/* 主题切换按钮 */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                title={theme === 'night' ? '切换到日间模式' : '切换到夜间模式'}
              >
                {theme === 'night' ? (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleNewCharacter}
                title="新建角色"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                <span className="hidden sm:inline">新建</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                title="导入角色"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                <span className="hidden sm:inline">导入</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExportModalOpen(true)}
                title="导出角色"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                <span className="hidden sm:inline">导出</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={handleShare}
                title="分享角色"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span className="hidden sm:inline">分享</span>
              </Button>
              
              <Button
                variant="primary"
                size="sm"
                onClick={save}
                disabled={!hasUnsavedChanges}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
                <span className="hidden sm:inline">保存</span>
              </Button>
            </div>
          </div>
        </div>
        
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          className="hidden"
        />
      </header>

      {/* 导出模态框 */}
      <Modal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="导出角色"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-theme-text-muted text-sm">
            选择导出格式：
          </p>
          
          <div className="space-y-2">
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={handleExportJson}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div className="text-left">
                <div className="font-medium">JSON 格式</div>
                <div className="text-xs text-theme-text-muted">可重新导入的数据文件</div>
              </div>
            </Button>
            
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={handleExportHtml}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <div className="text-left">
                <div className="font-medium">离线 HTML</div>
                <div className="text-xs text-theme-text-muted">可在浏览器查看的独立文件</div>
              </div>
            </Button>
            
            <Button
              variant="secondary"
              className="w-full justify-start"
              onClick={handleExportPdf}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <div className="text-left">
                <div className="font-medium">PDF 文件</div>
                <div className="text-xs text-theme-text-muted">可打印或分享的文档格式</div>
              </div>
            </Button>
          </div>
        </div>
      </Modal>

      {/* 分享模态框 */}
      <Modal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title="分享角色"
        size="md"
      >
        <div className="space-y-4">
          <p className="text-theme-text-muted text-sm">
            复制下方链接分享给其他人。链接中包含完整的角色数据。
          </p>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-3 py-2 bg-theme-hover border border-theme-border rounded text-theme-text text-sm"
            />
            <Button onClick={handleCopyShareUrl}>
              复制
            </Button>
          </div>
          
          <p className="text-xs text-theme-text-muted">
            注意：链接可能较长，部分平台可能无法完整发送。建议使用短链服务或直接分享JSON文件。
          </p>
        </div>
      </Modal>
    </>
  );
};
