/**
 * 职能数据配置
 * 直接从原始 JSON 导入
 */
import type { FunctionType } from '@/types';

// @ts-ignore - JSON import
import functionsData from './functions.json';

// 类型转换
export const functions: FunctionType[] = functionsData as FunctionType[];

/**
 * 根据名称查找职能
 */
export function findFunctionByName(name: string): FunctionType | undefined {
  return functions.find(f => f.name === name);
}

/**
 * 获取所有职能名称
 */
export function getFunctionNames(): string[] {
  return functions.map(f => f.name);
}
