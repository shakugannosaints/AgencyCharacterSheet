/**
 * 游戏配置数据统一导出
 */
export { anomalies, findAnomalyByName, getAnomalyNames } from './anomalies';
export { realities, findRealityByName, getRealityNames } from './realities';
export { functions, findFunctionByName, getFunctionNames } from './functions';

import { anomalies } from './anomalies';
import { realities } from './realities';
import { functions } from './functions';
import bonusesData from './bonuses.json';
import type { GameConfig } from '@/types';

/**
 * 连结奖励列表
 */
export const bonuses: string[] = bonusesData;

/**
 * 获取连结奖励选项（用于下拉列表）
 */
export function getBonusOptions() {
  return bonuses.map((bonus, index) => {
    // 从奖励文本中提取名称（冒号前的部分）
    const colonIndex = bonus.indexOf('：');
    const name = colonIndex > 0 ? bonus.substring(0, colonIndex) : `奖励 ${index + 1}`;
    return {
      value: index,
      label: name,
      description: bonus,
    };
  });
}

/**
 * 完整游戏配置数据
 */
export const gameConfig: GameConfig = {
  anomalies,
  realities,
  functions,
};

/**
 * 9大资质保证列表
 */
export const ATTRIBUTE_NAMES = [
  '专注', '欺瞒', '活力',
  '共情', '主动', '坚毅',
  '气场', '专业', '诡秘'
] as const;

/**
 * 关系类型列表
 */
export const RELATIONSHIP_TYPES = [
  '同事', '朋友', '家人',
  '敌人', '恋人', '熟人',
  '其他'
] as const;

/**
 * 进度轨道最大格数
 */
export const PROGRESS_TRACK_SIZE = 30;

/**
 * 崩溃槽位数量
 */
export const COLLAPSE_SLOTS_COUNT = 4;

/**
 * 默认属性最大值（初始上限）
 */
export const DEFAULT_ATTRIBUTE_MAX = 3;
