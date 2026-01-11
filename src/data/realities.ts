/**
 * 现实数据配置
 * 直接从原始 JSON 导入
 */
import type { RealityType } from '@/types';

// @ts-ignore - JSON import
import realitiesData from './realities.json';

// 类型转换
export const realities: RealityType[] = realitiesData as RealityType[];

/**
 * 根据名称查找现实
 */
export function findRealityByName(name: string): RealityType | undefined {
  return realities.find(r => r.name === name);
}

/**
 * 获取所有现实名称
 */
export function getRealityNames(): string[] {
  return realities.map(r => r.name);
}
