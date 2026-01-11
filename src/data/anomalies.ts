/**
 * 异常体数据配置
 * 直接从原始 JSON 导入
 */
import type { AnomalyType } from '@/types';

// JSON 会在编译时被处理
// @ts-ignore - JSON import
import anomsData from './anoms.json';

// 类型转换
export const anomalies: AnomalyType[] = anomsData as AnomalyType[];

/**
 * 根据名称查找异常体
 */
export function findAnomalyByName(name: string): AnomalyType | undefined {
  return anomalies.find(a => a.name === name);
}

/**
 * 获取所有异常体名称
 */
export function getAnomalyNames(): string[] {
  return anomalies.map(a => a.name);
}
