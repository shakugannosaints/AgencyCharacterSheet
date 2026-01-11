/**
 * 本地存储服务
 * 负责角色数据的持久化存储
 */
import type { CharacterData } from '@/types';
import { validateCharacterData, migrateCharacterData, createNewCharacter } from './character';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY_PREFIX = 'triangle_character_';
const STORAGE_KEY_LIST = 'triangle_character_list';
const STORAGE_KEY_CURRENT = 'triangle_current_character';

/**
 * 存储管理器
 */
export const storageService = {
  /**
   * 获取所有角色ID列表
   */
  getCharacterList(): string[] {
    try {
      const listJson = localStorage.getItem(STORAGE_KEY_LIST);
      if (!listJson) return [];
      const list = JSON.parse(listJson);
      return Array.isArray(list) ? list : [];
    } catch {
      return [];
    }
  },

  /**
   * 保存角色ID列表
   */
  saveCharacterList(ids: string[]): void {
    localStorage.setItem(STORAGE_KEY_LIST, JSON.stringify(ids));
  },

  /**
   * 获取当前选中的角色ID
   */
  getCurrentCharacterId(): string | null {
    return localStorage.getItem(STORAGE_KEY_CURRENT);
  },

  /**
   * 设置当前选中的角色ID
   */
  setCurrentCharacterId(id: string): void {
    localStorage.setItem(STORAGE_KEY_CURRENT, id);
  },

  /**
   * 保存角色数据
   */
  saveCharacter(character: CharacterData): void {
    // 更新时间戳
    character.updatedAt = new Date().toISOString();
    
    // 保存数据
    const key = STORAGE_KEY_PREFIX + character.id;
    localStorage.setItem(key, JSON.stringify(character));
    
    // 确保ID在列表中
    const list = this.getCharacterList();
    if (!list.includes(character.id)) {
      list.push(character.id);
      this.saveCharacterList(list);
    }
  },

  /**
   * 获取角色数据
   */
  getCharacter(id: string): CharacterData | null {
    try {
      const key = STORAGE_KEY_PREFIX + id;
      const json = localStorage.getItem(key);
      if (!json) return null;
      
      const data = JSON.parse(json);
      
      // 验证并迁移数据
      if (validateCharacterData(data)) {
        return data;
      }
      
      // 尝试迁移旧版本数据
      return migrateCharacterData(data);
    } catch {
      return null;
    }
  },

  /**
   * 删除角色数据
   */
  deleteCharacter(id: string): void {
    // 删除数据
    const key = STORAGE_KEY_PREFIX + id;
    localStorage.removeItem(key);
    
    // 从列表中移除
    const list = this.getCharacterList();
    const index = list.indexOf(id);
    if (index !== -1) {
      list.splice(index, 1);
      this.saveCharacterList(list);
    }
    
    // 如果删除的是当前角色，清除选择
    if (this.getCurrentCharacterId() === id) {
      localStorage.removeItem(STORAGE_KEY_CURRENT);
    }
  },

  /**
   * 获取所有角色数据（用于导出或列表显示）
   */
  getAllCharacters(): CharacterData[] {
    const list = this.getCharacterList();
    const characters: CharacterData[] = [];
    
    for (const id of list) {
      const character = this.getCharacter(id);
      if (character) {
        characters.push(character);
      }
    }
    
    return characters;
  },

  /**
   * 导入角色数据
   */
  importCharacter(data: unknown): CharacterData | null {
    try {
      let character: CharacterData;
      
      if (validateCharacterData(data)) {
        character = data;
      } else if (data && typeof data === 'object') {
        character = migrateCharacterData(data as Record<string, unknown>);
      } else {
        return null;
      }
      
      // 生成新ID以避免冲突
      character.id = uuidv4();
      character.createdAt = new Date().toISOString();
      character.updatedAt = new Date().toISOString();
      
      // 保存
      this.saveCharacter(character);
      
      return character;
    } catch {
      return null;
    }
  },

  /**
   * 导出角色数据为JSON字符串
   */
  exportCharacter(id: string): string | null {
    const character = this.getCharacter(id);
    if (!character) return null;
    return JSON.stringify(character, null, 2);
  },

  /**
   * 清除所有数据
   */
  clearAll(): void {
    const list = this.getCharacterList();
    for (const id of list) {
      const key = STORAGE_KEY_PREFIX + id;
      localStorage.removeItem(key);
    }
    localStorage.removeItem(STORAGE_KEY_LIST);
    localStorage.removeItem(STORAGE_KEY_CURRENT);
  },

  /**
   * 获取或创建默认角色
   * 如果没有角色，创建一个新的
   */
  getOrCreateCurrentCharacter(): CharacterData {
    let currentId = this.getCurrentCharacterId();
    
    if (currentId) {
      const character = this.getCharacter(currentId);
      if (character) return character;
    }
    
    // 尝试获取列表中的第一个
    const list = this.getCharacterList();
    if (list.length > 0) {
      const character = this.getCharacter(list[0]);
      if (character) {
        this.setCurrentCharacterId(character.id);
        return character;
      }
    }
    
    // 创建新角色
    const newCharacter = createNewCharacter();
    this.saveCharacter(newCharacter);
    this.setCurrentCharacterId(newCharacter.id);
    
    return newCharacter;
  },
};

export default storageService;
