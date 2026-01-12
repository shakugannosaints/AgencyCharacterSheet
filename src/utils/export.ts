/**
 * 导出工具
 * 支持JSON导出、离线HTML导出和PDF导出
 */
import type { CharacterData } from '@/types';
import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { findAnomalyByName, findRealityByName } from '@/data';

/**
 * 导出角色为JSON文件
 */
export function exportToJson(character: CharacterData): void {
  const json = JSON.stringify(character, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${character.name || '角色卡'}_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 从JSON文件导入角色
 */
export function importFromJson(file: File): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = e.target?.result as string;
        const data = JSON.parse(json);
        resolve(data);
      } catch (error) {
        reject(new Error('无效的JSON文件'));
      }
    };
    reader.onerror = () => reject(new Error('文件读取失败'));
    reader.readAsText(file);
  });
}

/**
 * 压缩角色数据用于分享
 */
export function compressCharacterData(character: CharacterData): string {
  const json = JSON.stringify(character);
  return compressToEncodedURIComponent(json);
}

/**
 * 解压分享的角色数据
 */
export function decompressCharacterData(compressed: string): CharacterData | null {
  try {
    const json = decompressFromEncodedURIComponent(compressed);
    if (!json) return null;
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/**
 * 生成分享链接
 */
export function generateShareUrl(character: CharacterData): string {
  const compressed = compressCharacterData(character);
  const baseUrl = window.location.origin + window.location.pathname;
  return `${baseUrl}?share=${compressed}`;
}

/**
 * 导出分享链接数据（别名）
 */
export function exportShareLink(character: CharacterData): string {
  return compressCharacterData(character);
}

/**
 * 从URL解析分享数据
 */
export function parseShareUrl(): CharacterData | null {
  const params = new URLSearchParams(window.location.search);
  const shareData = params.get('share');
  if (!shareData) return null;
  return decompressCharacterData(shareData);
}

/**
 * 解析分享链接数据（别名）
 */
export function parseShareLink(shareData: string): CharacterData | null {
  return decompressCharacterData(shareData);
}

/**
 * 生成离线HTML导出
 */
export function exportToOfflineHtml(character: CharacterData): void {
  // 创建一个完整的HTML页面，包含嵌入的角色数据
  const html = generateOfflineHtml(character);
  
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `${character.name || '角色卡'}_离线版.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * 生成离线HTML内容
 */
function generateOfflineHtml(character: CharacterData): string {
  const dataJson = JSON.stringify(character).replace(/</g, '\\u003c').replace(/>/g, '\\u003e');
  const mainAnomaly = findAnomalyByName(character.anomalyType);
  const mainReality = findRealityByName(character.realityType);
  
  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${character.name || '角色卡'} - 三角机构</title>
  <style>
    :root {
      --signal-red: #c0392b;
      --dark-bg: #0d0d0d;
      --dark-surface: #1a1a1a;
      --dark-border: #3d3d3d;
      --light-text: #e0e0e0;
      --muted-text: #999999;
      --anomaly: #2980b9;
      --reality: #f39c12;
      --functional: #c0392b;
    }
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    
    body {
      font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--dark-bg);
      color: var(--light-text);
      line-height: 1.6;
      padding: 2rem;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
    }
    
    .header {
      text-align: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--signal-red);
    }
    
    .header h1 {
      color: var(--signal-red);
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }
    
    .portrait {
      width: 150px;
      height: 150px;
      border-radius: 50%;
      border: 3px solid var(--signal-red);
      object-fit: cover;
      margin: 1rem auto;
      display: block;
    }
    
    .section {
      background: var(--dark-surface);
      border: 1px solid var(--dark-border);
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .section-title {
      color: var(--signal-red);
      font-size: 1.25rem;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--dark-border);
    }
    
    .field {
      margin-bottom: 0.75rem;
    }
    
    .field-label {
      color: var(--muted-text);
      font-size: 0.875rem;
    }
    
    .field-value {
      color: var(--light-text);
    }
    
    .badge {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.875rem;
      margin-right: 0.5rem;
      margin-bottom: 0.5rem;
    }
    
    .badge-anomaly { background: var(--anomaly); }
    .badge-reality { background: var(--reality); }
    .badge-functional { background: var(--functional); }
    
    .attributes-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }
    
    .attribute-item {
      text-align: center;
      padding: 0.75rem;
      background: var(--dark-bg);
      border-radius: 4px;
    }
    
    .attribute-name {
      color: var(--muted-text);
      font-size: 0.875rem;
    }
    
    .attribute-value {
      font-size: 1.5rem;
      font-weight: bold;
      color: var(--signal-red);
    }
    
    .offline-note {
      text-align: center;
      color: var(--muted-text);
      font-size: 0.75rem;
      margin-top: 2rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>▲ 三角机构 ▲</h1>
      <h2>${character.name || '未命名特工'}</h2>
      ${character.portrait ? `<img class="portrait" src="${character.portrait}" alt="头像">` : ''}
      <p>${character.codename || ''} ${character.genderPronoun || ''}</p>
    </div>
    
    <div class="section">
      <h3 class="section-title">身份</h3>
      <div class="field">
        <span class="badge badge-anomaly">异常体: ${character.anomalyType || '未选择'}</span>
        <span class="badge badge-reality">现实: ${character.realityType || '未选择'}</span>
        <span class="badge badge-functional">职能: ${character.functionType || '未选择'}</span>
      </div>
      
      ${mainAnomaly ? `
        <div style="margin-top: 1rem; padding: 0.75rem; background: var(--dark-bg); border-radius: 4px; border-left: 4px solid var(--anomaly);">
          <div style="font-weight: bold; color: var(--anomaly); margin-bottom: 0.5rem;">${mainAnomaly.name} 能力:</div>
          ${mainAnomaly.abilities.map(ability => `
            <div style="margin-bottom: 0.75rem; padding-bottom: 0.5rem; border-bottom: 1px dashed var(--dark-border);">
              <div style="font-weight: bold; font-size: 0.95rem;">${ability.name} <span style="font-weight: normal; color: var(--muted-text); font-size: 0.8rem;">[触发: ${ability.trig}]</span></div>
              <div style="font-size: 0.85rem; margin-top: 0.25rem;">${ability.qual}</div>
              <div style="font-size: 0.8rem; margin-top: 0.4rem; line-height: 1.4;">
                <div style="margin-bottom: 2px;"><span style="color: var(--signal-red);">成功：</span>${ability.succ}</div>
                <div style="color: var(--muted-text);"><span style="font-weight: bold;">失败：</span>${ability.fail}</div>
              </div>
              ${ability.tdesc ? `
                <div style="margin-top: 0.4rem; font-size: 0.75rem; color: var(--muted-text); font-style: italic;">
                  ${ability.tdesc} (① ${ability.t1} / ② ${ability.t2})
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      ${mainReality ? `
        <div style="margin-top: 1rem; padding: 0.75rem; background: var(--dark-bg); border-radius: 4px; border-left: 4px solid var(--reality);">
          <div style="font-weight: bold; color: var(--reality); margin-bottom: 0.5rem;">${mainReality.name} 详情:</div>
          <div style="margin-bottom: 0.5rem;">
            <div style="color: var(--muted-text); font-size: 0.8rem;">触发:</div>
            <div style="font-size: 0.85rem; white-space: pre-wrap;">${mainReality.trigger}</div>
          </div>
          <div>
            <div style="color: var(--muted-text); font-size: 0.8rem;">过载:</div>
            <div style="font-size: 0.85rem; white-space: pre-wrap;">${mainReality.overload}</div>
          </div>
        </div>
      ` : ''}
    </div>
    
    <div class="section">
      <h3 class="section-title">资质保证</h3>
      <div class="attributes-grid">
        ${Object.entries(character.attributes).map(([name, value]) => `
          <div class="attribute-item">
            <div class="attribute-name">${name}</div>
            <div class="attribute-value">${value.current}/${value.max}</div>
          </div>
        `).join('')}
      </div>
    </div>
      <div class="section">
        <h3 class="section-title">指令</h3>
        <div class="field">
          <div class="field-value">${(character.functionDirective || '-').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\n/g, '<br>')}</div>
        </div>
      </div>
    
    <div class="section">
      <h3 class="section-title">授权</h3>
      ${character.permissions.map((perm, i) => `
        <div class="field">
          <div class="field-label">授权 ${i + 1}</div>
          <div class="field-value">${perm || '-'} (已使用: ${Object.values(character.permissionCounts)[i] || 0})</div>
        </div>
      `).join('')}
    </div>
    
    <div class="section">
      <h3 class="section-title">KPI考核</h3>
      <div class="field">
        <span class="field-label">嘉奖:</span> <span class="field-value">${character.commendations}</span>
        &nbsp;&nbsp;
        <span class="field-label">申诫:</span> <span class="field-value">${character.reprimands}</span>
        &nbsp;&nbsp;
        <span class="field-label">MVP:</span> <span class="field-value">${character.mvpCount}</span>
        &nbsp;&nbsp;
        <span class="field-label">观察:</span> <span class="field-value">${character.watchCount}</span>
      </div>
    </div>
    
    ${character.anomalies.length > 0 ? `
    <div class="section">
      <h3 class="section-title">异常体</h3>
      ${character.anomalies.map(anom => `
        <div class="field" style="margin-bottom: 1rem;">
          <div class="field-value" style="font-weight: bold; color: var(--anomaly);">${anom.name || '未命名'}</div>
          ${anom.notes ? `<div class="field-label" style="margin-top: 0.25rem;">${anom.notes}</div>` : ''}
          ${anom.abilities && anom.abilities.length > 0 ? `
            <div style="margin-top: 0.5rem; padding-left: 1rem; border-left: 2px solid var(--anomaly);">
              ${anom.abilities.map(ability => `
                <div style="margin-bottom: 0.5rem;">
                  <div style="font-weight: bold;">${ability.name}</div>
                  <div class="field-label">触发: ${ability.trig}</div>
                </div>
              `).join('')}
            </div>
          ` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    ${character.realities.length > 0 ? `
    <div class="section">
      <h3 class="section-title">现实身份</h3>
      ${character.realities.map(reality => `
        <div class="field">
          <div class="field-value" style="color: var(--reality);">${reality.name || '未命名'}</div>
          ${reality.notes ? `<div class="field-label">${reality.notes}</div>` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    ${character.relationships.length > 0 ? `
    <div class="section">
      <h3 class="section-title">人际关系</h3>
      ${character.relationships.map(rel => `
        <div class="field">
          <div class="field-value">${rel.name || '未命名'} <span class="field-label">(${rel.type})</span></div>
          ${rel.bondValue ? `<div class="field-label">连结值: ${rel.bondValue}</div>` : ''}
          ${rel.description ? `<div class="field-label">${rel.description}</div>` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    ${character.items.length > 0 ? `
    <div class="section">
      <h3 class="section-title">物品</h3>
      ${character.items.map(item => `
        <div class="field">
          <div class="field-value">${item.name || '未命名物品'}</div>
          ${item.effect ? `<div class="field-label">${item.effect}</div>` : ''}
        </div>
      `).join('')}
    </div>
    ` : ''}
    
    <div class="offline-note">
      <p>此为离线导出版本 | 导出时间: ${new Date().toLocaleString('zh-CN')}</p>
    </div>
  </div>
  
  <script>
    // 嵌入的角色数据，供将来恢复使用
    window.__CHARACTER_DATA__ = ${dataJson};
    console.log('角色数据已嵌入，可通过 window.__CHARACTER_DATA__ 访问');
  </script>
</body>
</html>`;
}

/**
 * 导出角色为PDF文件
 * @param character 角色数据
 * @param theme 主题模式 ('night' | 'day')
 */
export async function exportToPdf(character: CharacterData, theme: 'night' | 'day' = 'night'): Promise<void> {
  // 根据主题获取颜色配置
  const colors = theme === 'day' ? {
    bg: '#ffffff',
    surface: '#f8f9fa',
    surfaceAlt: '#e9ecef',
    border: '#dee2e6',
    text: '#1a1a1a',
    textMuted: '#6c757d',
    primary: '#c0392b',
    anomaly: '#2980b9',
    reality: '#f39c12',
  } : {
    bg: '#0d0d0d',
    surface: '#1a1a1a',
    surfaceAlt: '#252525',
    border: '#3d3d3d',
    text: '#e0e0e0',
    textMuted: '#999999',
    primary: '#c0392b',
    anomaly: '#2980b9',
    reality: '#f39c12',
  };

  // 创建临时容器
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '794px'; // A4 宽度 (210mm at 96dpi)
  container.innerHTML = generatePdfHtml(character, colors);
  document.body.appendChild(container);

  try {
    // 使用 html2canvas 渲染
    const canvas = await html2canvas(container, {
      scale: 2, // 提高清晰度
      useCORS: true,
      allowTaint: true,
      backgroundColor: colors.bg,
    });

    // 计算 PDF 尺寸
    const imgWidth = 210; // A4 宽度 mm
    const pageHeight = 297; // A4 高度 mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // 创建 PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // 计算需要多少页
    const totalPages = Math.ceil(imgHeight / pageHeight);
    
    for (let page = 0; page < totalPages; page++) {
      if (page > 0) {
        pdf.addPage();
      }
      
      // 先填充背景色以避免白色底部
      pdf.setFillColor(colors.bg);
      pdf.rect(0, 0, imgWidth, pageHeight, 'F');
      
      // 计算当前页的位置偏移
      const position = -(page * pageHeight);
      
      // 添加图片
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        0,
        position,
        imgWidth,
        imgHeight
      );
    }

    // 下载 PDF
    pdf.save(`${character.name || '角色卡'}_${new Date().toISOString().split('T')[0]}.pdf`);
  } finally {
    // 清理临时容器
    document.body.removeChild(container);
  }
}

/**
 * PDF颜色配置类型
 */
interface PdfColors {
  bg: string;
  surface: string;
  surfaceAlt: string;
  border: string;
  text: string;
  textMuted: string;
  primary: string;
  anomaly: string;
  reality: string;
}

/**
 * 生成用于PDF的HTML内容
 */
function generatePdfHtml(character: CharacterData, colors: PdfColors): string {
  // 查找主要身份详情
  const mainAnomaly = findAnomalyByName(character.anomalyType);
  const mainReality = findRealityByName(character.realityType);

  // 问卷问题
  const questions = [
    { key: 'q1', label: '你是如何与你的异常体接触的？' },
    { key: 'q2', label: '机构是如何找到你的？' },
    { key: 'q3', label: '你的能力有独特的外在视觉表现吗？' },
    { key: 'q4', label: '你喝咖啡有什么偏好？' },
    { key: 'q5', label: '请描述你过往的工作经历。' },
    { key: 'q6', label: '你对 Adobe、Excel 和 Google 套件的熟悉程度如何？' },
    { key: 'q7', label: '在协作型工作环境中，你能做出什么贡献？' },
  ];

  return `
    <div style="
      font-family: 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif;
      background: ${colors.bg};
      color: ${colors.text};
      padding: 24px;
      line-height: 1.5;
      min-height: 100%;
    ">
      <!-- 头部 -->
      <div style="text-align: center; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid ${colors.primary};">
        <div style="color: ${colors.primary}; font-size: 32px; margin-bottom: 8px;">▲</div>
        <h1 style="color: ${colors.primary}; font-size: 28px; margin: 0 0 4px 0;">${character.name || '未命名特工'}</h1>
        <p style="color: ${colors.textMuted}; font-size: 14px; margin: 0;">三角机构特工档案</p>
      </div>

      <!-- 头像和基本信息 -->
      <div style="display: flex; gap: 24px; margin-bottom: 24px;">
        ${character.portrait ? `
          <img src="${character.portrait}" style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid ${colors.primary}; object-fit: cover;" />
        ` : `
          <div style="width: 120px; height: 120px; border-radius: 50%; border: 3px solid ${colors.primary}; background: ${colors.surface}; display: flex; align-items: center; justify-content: center; color: ${colors.textMuted}; font-size: 12px;">无头像</div>
        `}
        <div style="flex: 1;">
          <div style="background: ${colors.surface}; border: 1px solid ${colors.border}; border-radius: 8px; padding: 16px;">
            <div style="margin-bottom: 8px;"><span style="color: ${colors.textMuted};">代号：</span>${character.codename || '-'}</div>
            <div style="margin-bottom: 8px;"><span style="color: ${colors.textMuted};">性别代词：</span>${character.genderPronoun || '-'}</div>
            <div style="margin-bottom: 8px;"><span style="color: ${colors.textMuted};">异常体：</span><span style="color: ${colors.anomaly};">${character.anomalyType || '-'}</span></div>
            <div style="margin-bottom: 8px;"><span style="color: ${colors.textMuted};">现实身份：</span><span style="color: ${colors.reality};">${character.realityType || '-'}</span></div>
            <div><span style="color: ${colors.textMuted};">职能：</span><span style="color: ${colors.primary};">${character.functionType || '-'}</span></div>
          </div>
        </div>
      </div>

      <!-- 属性 -->
      <div style="background: ${colors.surface}; border: 1px solid ${colors.border}; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <h3 style="color: ${colors.primary}; font-size: 16px; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 1px solid ${colors.border};">资质保证</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
          ${Object.entries(character.attributes).map(([name, attr]) => `
            <div style="background: ${colors.surfaceAlt}; padding: 8px; border-radius: 4px; text-align: center;">
              <div style="font-size: 12px; color: ${colors.textMuted};">${name}</div>
              <div style="font-size: 18px; font-weight: bold; color: ${attr.marked ? colors.primary : colors.text};">${attr.current}/${attr.max}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 授权行为 -->
        <div style="background: ${colors.surface}; border: 1px solid ${colors.border}; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
          <h3 style="color: ${colors.primary}; font-size: 16px; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 1px solid ${colors.border};">指令</h3>
          <div style="white-space: pre-wrap; color: ${colors.text};">${(character.functionDirective || '-').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
        </div>
      <div style="background: ${colors.surface}; border: 1px solid ${colors.border}; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <h3 style="color: ${colors.primary}; font-size: 16px; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 1px solid ${colors.border};">授权行为</h3>
        ${character.permissions.map((perm, i) => `
          <div style="margin-bottom: 8px;">
            <span style="color: ${colors.textMuted};">授权 ${i + 1}：</span>
            <span>${perm || '-'}</span>
            <span style="color: ${colors.textMuted}; margin-left: 8px;">(已使用: ${Object.values(character.permissionCounts)[i] || 0})</span>
          </div>
        `).join('')}
      </div>

      <!-- KPI考核 -->
      <div style="background: ${colors.surface}; border: 1px solid ${colors.border}; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <h3 style="color: ${colors.primary}; font-size: 16px; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 1px solid ${colors.border};">KPI考核</h3>
        <div style="display: flex; gap: 24px;">
          <div><span style="color: ${colors.textMuted};">嘉奖：</span><span style="font-weight: bold;">${character.commendations}</span></div>
          <div><span style="color: ${colors.textMuted};">申诫：</span><span style="font-weight: bold;">${character.reprimands}</span></div>
          <div><span style="color: ${colors.textMuted};">MVP次数：</span><span style="font-weight: bold;">${character.mvpCount}</span></div>
          <div><span style="color: ${colors.textMuted};">观察次数：</span><span style="font-weight: bold;">${character.watchCount}</span></div>
        </div>
      </div>

      <!-- 异常体能力 -->
      ${(mainAnomaly || character.anomalies.length > 0) ? `
        <div style="background: ${colors.surface}; border: 1px solid ${colors.border}; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
          <h3 style="color: ${colors.primary}; font-size: 16px; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 1px solid ${colors.border};">异常体能力</h3>
          
          ${mainAnomaly ? `
            <div style="background: ${colors.surfaceAlt}; padding: 12px; border-radius: 4px; margin-bottom: 12px; border-left: 4px solid ${colors.anomaly};">
              <div style="font-weight: bold; color: ${colors.anomaly}; margin-bottom: 8px; font-size: 14px;">主要异常体：${mainAnomaly.name}</div>
              <div style="padding-left: 8px;">
                ${mainAnomaly.abilities.map(ability => `
                  <div style="margin-bottom: 12px; border-bottom: 1px dashed ${colors.border}; padding-bottom: 8px;">
                    <div style="font-weight: bold; font-size: 13px;">${ability.name} <span style="font-weight: normal; color: ${colors.textMuted}; font-size: 11px;">[触发: ${ability.trig}]</span></div>
                    <div style="font-size: 12px; margin-top: 4px; line-height: 1.4;">${ability.qual}</div>
                    <div style="font-size: 11px; margin-top: 6px; line-height: 1.4;">
                      <div style="margin-bottom: 2px;"><span style="color: ${colors.primary}; font-weight: bold;">成功：</span>${ability.succ}</div>
                      <div><span style="color: ${colors.textMuted}; font-weight: bold;">失败：</span>${ability.fail}</div>
                    </div>
                    ${ability.tdesc ? `
                      <div style="margin-top: 6px; font-size: 10px; color: ${colors.textMuted}; font-style: italic;">
                        ${ability.tdesc} (① ${ability.t1} / ② ${ability.t2})
                      </div>
                    ` : ''}
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          ${character.anomalies.map(anom => `
            <div style="background: ${colors.surfaceAlt}; padding: 12px; border-radius: 4px; margin-bottom: 8px;">
              <div style="font-weight: bold; color: ${colors.anomaly}; margin-bottom: 4px;">${anom.name || '未命名'}</div>
              ${anom.notes ? `<div style="color: ${colors.textMuted}; font-size: 12px; margin-bottom: 8px;">${anom.notes}</div>` : ''}
              ${anom.abilities && anom.abilities.length > 0 ? `
                <div style="border-left: 2px solid ${colors.anomaly}; padding-left: 12px; margin-top: 8px;">
                  ${anom.abilities.map(ability => `
                    <div style="margin-bottom: 8px;">
                      <div style="font-weight: bold; font-size: 13px;">${ability.name} <span style="font-weight: normal; color: ${colors.textMuted}; font-size: 11px;">[触发: ${ability.trig}]</span></div>
                      ${ability.qual ? `<div style="font-size: 12px; margin-top: 4px;">${ability.qual}</div>` : ''}
                    </div>
                  `).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- 现实身份详情 -->
      ${(mainReality || character.realities.length > 0) ? `
        <div style="background: ${colors.surface}; border: 1px solid ${colors.border}; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
          <h3 style="color: ${colors.primary}; font-size: 16px; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 1px solid ${colors.border};">现实身份详情</h3>
          
          ${mainReality ? `
            <div style="background: ${colors.surfaceAlt}; padding: 12px; border-radius: 4px; margin-bottom: 12px; border-left: 4px solid ${colors.reality};">
              <div style="font-weight: bold; color: ${colors.reality}; margin-bottom: 8px; font-size: 14px;">主要身份：${mainReality.name}</div>
              <div style="margin-bottom: 8px;">
                <div style="color: ${colors.textMuted}; font-size: 11px; margin-bottom: 2px;">触发：</div>
                <div style="font-size: 12px; white-space: pre-wrap;">${mainReality.trigger}</div>
              </div>
              <div>
                <div style="color: ${colors.textMuted}; font-size: 11px; margin-bottom: 2px;">过载：</div>
                <div style="font-size: 12px; white-space: pre-wrap;">${mainReality.overload || '-'}</div>
              </div>
            </div>
          ` : ''}

          ${character.realities.map(reality => `
            <div style="background: ${colors.surfaceAlt}; padding: 12px; border-radius: 4px; margin-bottom: 8px;">
              <div style="font-weight: bold; color: ${colors.reality};">${reality.name || '未命名'}</div>
              ${reality.notes ? `<div style="color: ${colors.textMuted}; font-size: 12px; margin-top: 4px;">${reality.notes}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- 人际关系 -->
      ${character.relationships.length > 0 ? `
        <div style="background: ${colors.surface}; border: 1px solid ${colors.border}; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
          <h3 style="color: ${colors.primary}; font-size: 16px; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 1px solid ${colors.border};">人际关系</h3>
          ${character.relationships.map(rel => `
            <div style="background: ${colors.surfaceAlt}; padding: 12px; border-radius: 4px; margin-bottom: 8px;">
              <div style="font-weight: bold; margin-bottom: 4px;">${rel.name || '未命名'} <span style="color: ${colors.textMuted}; font-weight: normal;">(${rel.type})</span></div>
              ${rel.bondValue ? `<div style="color: ${colors.reality}; font-size: 12px;">连结值: ${rel.bondValue}</div>` : ''}
              ${rel.description ? `<div style="color: ${colors.textMuted}; font-size: 12px; margin-top: 4px;">${rel.description}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- 物品 -->
      ${character.items.length > 0 ? `
        <div style="background: ${colors.surface}; border: 1px solid ${colors.border}; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
          <h3 style="color: ${colors.primary}; font-size: 16px; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 1px solid ${colors.border};">物品</h3>
          ${character.items.map(item => `
            <div style="background: ${colors.surfaceAlt}; padding: 12px; border-radius: 4px; margin-bottom: 8px;">
              <div style="font-weight: bold;">${item.name || '未命名物品'}</div>
              ${item.effect ? `<div style="color: ${colors.textMuted}; font-size: 12px; margin-top: 4px;">${item.effect}</div>` : ''}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- 入职问卷 -->
      <div style="background: ${colors.surface}; border: 1px solid ${colors.border}; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
        <h3 style="color: ${colors.primary}; font-size: 16px; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 1px solid ${colors.border};">入职问卷</h3>
        ${questions.map((q, i) => {
          const answer = character.questions[q.key as keyof typeof character.questions];
          return answer ? `
            <div style="margin-bottom: 12px;">
              <div style="color: ${colors.textMuted}; font-size: 12px; margin-bottom: 4px;">${i + 1}. ${q.label}</div>
              <div style="background: ${colors.surfaceAlt}; padding: 8px; border-radius: 4px; font-size: 13px;">${answer}</div>
            </div>
          ` : '';
        }).join('')}
        ${character.questions.q8 ? `
          <div style="margin-bottom: 12px;">
            <div style="color: ${colors.textMuted}; font-size: 12px; margin-bottom: 4px;">补充说明</div>
            <div style="background: ${colors.surfaceAlt}; padding: 8px; border-radius: 4px; font-size: 13px;">${character.questions.q8}</div>
          </div>
        ` : ''}
      </div>

      <!-- 笔记 -->
      ${character.notes.some(n => n) ? `
        <div style="background: ${colors.surface}; border: 1px solid ${colors.border}; border-radius: 8px; padding: 16px; margin-bottom: 16px;">
          <h3 style="color: ${colors.primary}; font-size: 16px; margin: 0 0 12px 0; padding-bottom: 8px; border-bottom: 1px solid ${colors.border};">笔记</h3>
          ${character.notes.filter(n => n).map((note, i) => `
            <div style="background: ${colors.surfaceAlt}; padding: 8px; border-radius: 4px; margin-bottom: 8px; font-size: 13px;">
              <span style="color: ${colors.textMuted};">笔记 ${i + 1}：</span>${note}
            </div>
          `).join('')}
        </div>
      ` : ''}

      <!-- 页脚 -->
      <div style="text-align: center; color: ${colors.textMuted}; font-size: 11px; margin-top: 24px; padding-top: 16px; border-top: 1px solid ${colors.border};">
        <div style="color: ${colors.primary}; margin-bottom: 4px;">▲ 三角机构</div>
        <div>导出时间: ${new Date().toLocaleString('zh-CN')}</div>
      </div>
    </div>
  `;
}
