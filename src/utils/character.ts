/**
 * 角色数据工具函数
 */
import { v4 as uuidv4 } from 'uuid';
import type { CharacterData, Attributes, AttributeName } from '@/types';
import { ATTRIBUTE_NAMES, DEFAULT_ATTRIBUTE_MAX } from '@/data';

/**
 * 创建默认的属性集合
 */
export function createDefaultAttributes(): Attributes {
  const attrs: Partial<Attributes> = {};
  for (const name of ATTRIBUTE_NAMES) {
    attrs[name as AttributeName] = {
      current: 0,
      max: DEFAULT_ATTRIBUTE_MAX,
      marked: false,
    };
  }
  return attrs as Attributes;
}

/**
 * 创建新的空白角色卡
 */
export function createNewCharacter(): CharacterData {
  const now = new Date().toISOString();
  
  return {
    id: uuidv4(),
    version: '2.0.0',
    createdAt: now,
    updatedAt: now,

    // 基础信息
    name: '',
    pronouns: '',
    genderPronoun: '',
    portrait: '',

    // 核心身份
    anomalyType: '',
    realityType: '',
    functionType: '',

    // 授权
    permissions: ['', '', ''],
    permissionCounts: {
      perm1: 0,
      perm2: 0,
      perm3: 0,
    },

    // 资源
    commendations: 0,
    reprimands: 0,
    mvpCount: 0,
    watchCount: 0,

    // 属性
    attributes: createDefaultAttributes(),

    // 进度轨道
    progressTracks: {
      functional: { filled: [], ignored: [] },
      reality: { filled: [], ignored: [] },
      anomaly: { filled: [], ignored: [] },
    },

    // 崩溃进度
    collapseProgress: {
      slots: [false, false, false, false],
    },

    // 槽位数
    anomalySlots: 1,
    realitySlots: 1,

    // 列表
    anomalies: [],
    realities: [],
    relationships: [],
    items: [],

    // 笔记
    notes: ['', '', '', '', ''],

    // 问答
    questions: {
      q1: '',
      q2: '',
      q3: '',
      q4: '',
      q5: '',
      q6: '',
      q7: '',
      q8: '',
      q9: '',
    },
  };
}

/**
 * 验证角色数据是否有效
 */
export function validateCharacterData(data: unknown): data is CharacterData {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  
  // 检查必需字段
  if (typeof d.id !== 'string') return false;
  if (typeof d.version !== 'string') return false;
  if (typeof d.name !== 'string') return false;
  
  return true;
}

/**
 * 迁移旧版本数据到新版本
 */
export function migrateCharacterData(data: Record<string, unknown>): CharacterData {
  // 如果没有版本号，假设是1.0版本（原始系统）
  const version = (data.version as string) || '1.0.0';
  
  if (version.startsWith('1.')) {
    return migrateFromV1(data);
  }
  
  // 已经是2.0版本
  return data as unknown as CharacterData;
}

/**
 * 从1.0版本迁移数据
 * 原始数据格式来自 gatherData() 函数
 */
function migrateFromV1(data: Record<string, unknown>): CharacterData {
  const newData = createNewCharacter();
  
  // 基础信息映射
  if (data.pName) newData.name = data.pName as string;
  if (data.pPronouns) newData.pronouns = data.pPronouns as string;
  if (data.pGenderPronoun) newData.genderPronoun = data.pGenderPronoun as string;
  if (data.pPortrait) newData.portrait = data.pPortrait as string;
  
  // 核心身份
  if (data.pAnom) newData.anomalyType = data.pAnom as string;
  if (data.pReal) newData.realityType = data.pReal as string;
  if (data.pFunc) newData.functionType = data.pFunc as string;
  
  // 授权
  if (data.perm1) newData.permissions[0] = data.perm1 as string;
  if (data.perm2) newData.permissions[1] = data.perm2 as string;
  if (data.perm3) newData.permissions[2] = data.perm3 as string;
  
  if (Array.isArray(data.permCounts)) {
    newData.permissionCounts.perm1 = data.permCounts[0] || 0;
    newData.permissionCounts.perm2 = data.permCounts[1] || 0;
    newData.permissionCounts.perm3 = data.permCounts[2] || 0;
  }
  
  // 资源
  if (typeof data.pComm === 'number') newData.commendations = data.pComm;
  if (typeof data.pRep === 'number') newData.reprimands = data.pRep;
  if (typeof data.mvpCount === 'number') newData.mvpCount = data.mvpCount;
  if (typeof data.watchCount === 'number') newData.watchCount = data.watchCount;
  
  // 属性迁移
  if (data.attrs && typeof data.attrs === 'object') {
    const oldAttrs = data.attrs as Record<string, { current?: number; max?: number; marked?: boolean }>;
    for (const attrName of ATTRIBUTE_NAMES) {
      if (oldAttrs[attrName]) {
        newData.attributes[attrName as AttributeName] = {
          current: oldAttrs[attrName].current ?? 0,
          max: oldAttrs[attrName].max ?? DEFAULT_ATTRIBUTE_MAX,
          marked: oldAttrs[attrName].marked ?? false,
        };
      }
    }
  }
  
  // 进度轨道
  if (Array.isArray(data.pf)) {
    newData.progressTracks.functional.filled = data.pf as number[];
  }
  if (Array.isArray(data.pf_ign)) {
    newData.progressTracks.functional.ignored = data.pf_ign as number[];
  }
  if (Array.isArray(data.pr)) {
    newData.progressTracks.reality.filled = data.pr as number[];
  }
  if (Array.isArray(data.pr_ign)) {
    newData.progressTracks.reality.ignored = data.pr_ign as number[];
  }
  if (Array.isArray(data.pa)) {
    newData.progressTracks.anomaly.filled = data.pa as number[];
  }
  if (Array.isArray(data.pa_ign)) {
    newData.progressTracks.anomaly.ignored = data.pa_ign as number[];
  }
  
  // 崩溃进度
  if (Array.isArray(data.collapseProgress)) {
    newData.collapseProgress.slots = (data.collapseProgress as boolean[]).slice(0, 4);
  }
  
  // 槽位数
  if (typeof data.anomSlots === 'number') newData.anomalySlots = data.anomSlots;
  if (typeof data.realSlots === 'number') newData.realitySlots = data.realSlots;
  
  // 异常体列表
  if (Array.isArray(data.anoms)) {
    newData.anomalies = (data.anoms as Array<{ name?: string; notes?: string }>).map(a => ({
      id: uuidv4(),
      name: a.name || '',
      notes: a.notes || '',
    }));
  }
  
  // 现实列表
  if (Array.isArray(data.reals)) {
    newData.realities = (data.reals as Array<{ name?: string; notes?: string }>).map(r => ({
      id: uuidv4(),
      name: r.name || '',
      notes: r.notes || '',
    }));
  }
  
  // 物品列表
  if (Array.isArray(data.items)) {
    newData.items = (data.items as Array<{ name?: string; effect?: string; source?: string }>).map(item => ({
      id: uuidv4(),
      name: item.name || '',
      effect: item.effect || '',
      source: item.source,
    }));
  }
  
  // 笔记
  if (Array.isArray(data.notes)) {
    newData.notes = data.notes as string[];
  }
  
  // 问答
  if (data.qs && typeof data.qs === 'object') {
    const oldQs = data.qs as Record<string, string>;
    for (let i = 1; i <= 9; i++) {
      const key = `q${i}` as keyof typeof newData.questions;
      if (oldQs[key]) {
        newData.questions[key] = oldQs[key];
      }
    }
  }
  
  newData.updatedAt = new Date().toISOString();
  
  return newData;
}

/**
 * 深拷贝角色数据
 */
export function cloneCharacterData(data: CharacterData): CharacterData {
  return JSON.parse(JSON.stringify(data));
}
