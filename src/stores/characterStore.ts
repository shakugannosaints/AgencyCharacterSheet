/**
 * 角色状态管理
 * 使用 Zustand 进行状态管理
 */
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { 
  CharacterData, 
  AttributeName, 
  ProgressTrackType,
  CharacterAnomaly,
  CharacterReality,
  CharacterRelationship,
  CharacterItem,
} from '@/types';
import { 
  createNewCharacter, 
  storageService,
  debounce,
} from '@/utils';
import { findFunctionByName } from '@/data';
import { v4 as uuidv4 } from 'uuid';

interface CharacterState {
  // 当前角色数据
  character: CharacterData;
  
  // 是否已加载
  isLoaded: boolean;
  
  // 是否有未保存的更改
  hasUnsavedChanges: boolean;
  
  // 是否正在保存
  isSaving: boolean;
  
  // 错误信息
  error: string | null;

  // === 动作 ===
  
  // 初始化/加载
  loadCharacter: (id?: string) => void;
  createNewCharacter: () => void;
  
  // 基础信息
  setName: (name: string) => void;
  setPronouns: (pronouns: string) => void;
  setGenderPronoun: (genderPronoun: string) => void;
  setPortrait: (portrait: string) => void;
  
  // 核心身份
  setAnomalyType: (type: string) => void;
  setRealityType: (type: string) => void;
  setFunctionType: (type: string, applyDefaults?: boolean) => void;
  
  // 授权
  setPermission: (index: 0 | 1 | 2, value: string) => void;
  incrementPermissionCount: (index: 0 | 1 | 2) => void;
  decrementPermissionCount: (index: 0 | 1 | 2) => void;
  
  // 资源
  setCommendations: (value: number) => void;
  setReprimands: (value: number) => void;
  incrementMvpCount: () => void;
  incrementWatchCount: () => void;
  
  // 属性
  setAttributeCurrent: (name: AttributeName, value: number) => void;
  setAttributeMax: (name: AttributeName, value: number) => void;
  toggleAttributeMarked: (name: AttributeName) => void;
  
  // 进度轨道
  toggleProgressCell: (track: ProgressTrackType, index: number) => void;
  ignoreProgressCell: (track: ProgressTrackType, index: number) => void;
  clearProgressTrack: (track: ProgressTrackType) => void;
  
  // 崩溃进度
  toggleCollapseSlot: (index: number) => void;
  
  // 槽位数
  setAnomalySlots: (count: number) => void;
  setRealitySlots: (count: number) => void;
  
  // 异常体列表
  addAnomaly: (name?: string) => void;
  removeAnomaly: (id: string) => void;
  updateAnomaly: (id: string, updates: Partial<CharacterAnomaly>) => void;
  
  // 现实列表
  addReality: (name?: string) => void;
  removeReality: (id: string) => void;
  updateReality: (id: string, updates: Partial<CharacterReality>) => void;
  
  // 关系列表
  addRelationship: () => void;
  removeRelationship: (id: string) => void;
  updateRelationship: (id: string, updates: Partial<CharacterRelationship>) => void;
  
  // 物品列表
  addItem: (item?: Partial<CharacterItem>) => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, updates: Partial<CharacterItem>) => void;
  
  // 笔记
  setNote: (index: number, value: string) => void;
  addNote: () => void;
  removeNote: (index: number) => void;
  
  // 问答
  setQuestion: (key: keyof CharacterData['questions'], value: string) => void;
  
  // 保存
  save: () => void;
  
  // 导入
  importCharacter: (data: CharacterData) => void;
}

// 防抖保存函数
const debouncedSave = debounce((character: CharacterData) => {
  // 确保保存的是普通对象而不是 immer 代理
  const plainCharacter = JSON.parse(JSON.stringify(character));
  storageService.saveCharacter(plainCharacter);
}, 500);

export const useCharacterStore = create<CharacterState>()(
  immer((set, get) => ({
    character: createNewCharacter(),
    isLoaded: false,
    hasUnsavedChanges: false,
    isSaving: false,
    error: null,

    // === 初始化/加载 ===
    
    loadCharacter: (id?: string) => {
      let character: CharacterData;
      
      if (id) {
        const loaded = storageService.getCharacter(id);
        if (loaded) {
          character = loaded;
          storageService.setCurrentCharacterId(id);
        } else {
          character = storageService.getOrCreateCurrentCharacter();
        }
      } else {
        character = storageService.getOrCreateCurrentCharacter();
      }
      
      set((state) => {
        state.character = character;
        state.isLoaded = true;
        state.hasUnsavedChanges = false;
        state.error = null;
      });
    },

    createNewCharacter: () => {
      const character = createNewCharacter();
      storageService.saveCharacter(character);
      storageService.setCurrentCharacterId(character.id);
      
      set((state) => {
        state.character = character;
        state.hasUnsavedChanges = false;
      });
    },

    // === 基础信息 ===
    
    setName: (name) => {
      set((state) => {
        state.character.name = name;
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    setPronouns: (pronouns) => {
      set((state) => {
        state.character.pronouns = pronouns;
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    setGenderPronoun: (genderPronoun) => {
      set((state) => {
        state.character.genderPronoun = genderPronoun;
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    setPortrait: (portrait) => {
      set((state) => {
        state.character.portrait = portrait;
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    // === 核心身份 ===
    
    setAnomalyType: (type) => {
      set((state) => {
        state.character.anomalyType = type;
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    setRealityType: (type) => {
      set((state) => {
        state.character.realityType = type;
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    setFunctionType: (type, applyDefaults = true) => {
      set((state) => {
        state.character.functionType = type;
        
        // 级联逻辑：自动填充授权和物品
        if (applyDefaults && type) {
          const funcData = findFunctionByName(type);
          if (funcData) {
            // 设置授权
            if (funcData.perms.length >= 3) {
              state.character.permissions = [...funcData.perms.slice(0, 3)];
            }
            
            // 添加职能物品
            for (const item of funcData.items) {
              const exists = state.character.items.some(
                i => i.name === item.item && i.isFromFunction
              );
              if (!exists) {
                state.character.items.push({
                  id: uuidv4(),
                  name: item.item,
                  effect: item.eff,
                  source: type,
                  isFromFunction: true,
                });
              }
            }
          }
        }
        
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    // === 授权 ===
    
    setPermission: (index, value) => {
      set((state) => {
        state.character.permissions[index] = value;
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    incrementPermissionCount: (index) => {
      set((state) => {
        const key = `perm${index + 1}` as keyof typeof state.character.permissionCounts;
        state.character.permissionCounts[key]++;
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    decrementPermissionCount: (index) => {
      set((state) => {
        const key = `perm${index + 1}` as keyof typeof state.character.permissionCounts;
        if (state.character.permissionCounts[key] > 0) {
          state.character.permissionCounts[key]--;
          state.hasUnsavedChanges = true;
        }
      });
      debouncedSave(get().character);
    },

    // === 资源 ===
    
    setCommendations: (value) => {
      set((state) => {
        state.character.commendations = Math.max(0, value);
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    setReprimands: (value) => {
      set((state) => {
        state.character.reprimands = Math.max(0, value);
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    incrementMvpCount: () => {
      set((state) => {
        state.character.mvpCount++;
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    incrementWatchCount: () => {
      set((state) => {
        state.character.watchCount++;
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    // === 属性 ===
    
    setAttributeCurrent: (name, value) => {
      set((state) => {
        const attr = state.character.attributes[name];
        attr.current = Math.max(0, Math.min(value, attr.max));
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    setAttributeMax: (name, value) => {
      set((state) => {
        const attr = state.character.attributes[name];
        attr.max = Math.max(1, value);
        attr.current = Math.min(attr.current, attr.max);
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    toggleAttributeMarked: (name) => {
      set((state) => {
        state.character.attributes[name].marked = !state.character.attributes[name].marked;
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    // === 进度轨道 ===
    
    toggleProgressCell: (track, index) => {
      set((state) => {
        const trackData = state.character.progressTracks[track];
        const filledIndex = trackData.filled.indexOf(index);
        
        if (filledIndex === -1) {
          // 添加到已填充
          trackData.filled.push(index);
          // 从忽略中移除
          const ignIndex = trackData.ignored.indexOf(index);
          if (ignIndex !== -1) {
            trackData.ignored.splice(ignIndex, 1);
          }
          
          // 级联逻辑：填充一个轨道时，忽略其他轨道的相同位置
          const otherTracks: ProgressTrackType[] = ['functional', 'reality', 'anomaly']
            .filter(t => t !== track) as ProgressTrackType[];
          
          for (const otherTrack of otherTracks) {
            const otherData = state.character.progressTracks[otherTrack];
            if (!otherData.filled.includes(index) && !otherData.ignored.includes(index)) {
              otherData.ignored.push(index);
            }
          }
        } else {
          // 从已填充中移除
          trackData.filled.splice(filledIndex, 1);
        }
        
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    ignoreProgressCell: (track, index) => {
      set((state) => {
        const trackData = state.character.progressTracks[track];
        const ignIndex = trackData.ignored.indexOf(index);
        
        if (ignIndex === -1) {
          // 添加到忽略（如果未填充）
          if (!trackData.filled.includes(index)) {
            trackData.ignored.push(index);
          }
        } else {
          // 从忽略中移除
          trackData.ignored.splice(ignIndex, 1);
        }
        
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    clearProgressTrack: (track) => {
      set((state) => {
        state.character.progressTracks[track] = { filled: [], ignored: [] };
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    // === 崩溃进度 ===
    
    toggleCollapseSlot: (index) => {
      set((state) => {
        if (index >= 0 && index < 4) {
          state.character.collapseProgress.slots[index] = 
            !state.character.collapseProgress.slots[index];
          state.hasUnsavedChanges = true;
        }
      });
      debouncedSave(get().character);
    },

    // === 槽位数 ===
    
    setAnomalySlots: (count) => {
      set((state) => {
        state.character.anomalySlots = Math.max(1, count);
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    setRealitySlots: (count) => {
      set((state) => {
        state.character.realitySlots = Math.max(1, count);
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    // === 异常体列表 ===
    
    addAnomaly: (name = '') => {
      set((state) => {
        state.character.anomalies.push({
          id: uuidv4(),
          name,
          notes: '',
        });
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    removeAnomaly: (id) => {
      set((state) => {
        const index = state.character.anomalies.findIndex(a => a.id === id);
        if (index !== -1) {
          state.character.anomalies.splice(index, 1);
          state.hasUnsavedChanges = true;
        }
      });
      debouncedSave(get().character);
    },

    updateAnomaly: (id, updates) => {
      set((state) => {
        const anomaly = state.character.anomalies.find(a => a.id === id);
        if (anomaly) {
          Object.assign(anomaly, updates);
          state.hasUnsavedChanges = true;
        }
      });
      debouncedSave(get().character);
    },

    // === 现实列表 ===
    
    addReality: (name = '') => {
      set((state) => {
        state.character.realities.push({
          id: uuidv4(),
          name,
          notes: '',
        });
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    removeReality: (id) => {
      set((state) => {
        const index = state.character.realities.findIndex(r => r.id === id);
        if (index !== -1) {
          state.character.realities.splice(index, 1);
          state.hasUnsavedChanges = true;
        }
      });
      debouncedSave(get().character);
    },

    updateReality: (id, updates) => {
      set((state) => {
        const reality = state.character.realities.find(r => r.id === id);
        if (reality) {
          Object.assign(reality, updates);
          state.hasUnsavedChanges = true;
        }
      });
      debouncedSave(get().character);
    },

    // === 关系列表 ===
    
    addRelationship: () => {
      set((state) => {
        state.character.relationships.push({
          id: uuidv4(),
          name: '',
          type: '同事',
          description: '',
          bondValue: 0,
          bonusIndex: undefined,
        });
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    removeRelationship: (id) => {
      set((state) => {
        const index = state.character.relationships.findIndex(r => r.id === id);
        if (index !== -1) {
          state.character.relationships.splice(index, 1);
          state.hasUnsavedChanges = true;
        }
      });
      debouncedSave(get().character);
    },

    updateRelationship: (id, updates) => {
      set((state) => {
        const rel = state.character.relationships.find(r => r.id === id);
        if (rel) {
          Object.assign(rel, updates);
          state.hasUnsavedChanges = true;
        }
      });
      debouncedSave(get().character);
    },

    // === 物品列表 ===
    
    addItem: (item = {}) => {
      set((state) => {
        state.character.items.push({
          id: uuidv4(),
          name: item.name || '',
          effect: item.effect || '',
          source: item.source,
          isFromFunction: item.isFromFunction || false,
        });
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    removeItem: (id) => {
      set((state) => {
        const index = state.character.items.findIndex(i => i.id === id);
        if (index !== -1) {
          state.character.items.splice(index, 1);
          state.hasUnsavedChanges = true;
        }
      });
      debouncedSave(get().character);
    },

    updateItem: (id, updates) => {
      set((state) => {
        const item = state.character.items.find(i => i.id === id);
        if (item) {
          Object.assign(item, updates);
          state.hasUnsavedChanges = true;
        }
      });
      debouncedSave(get().character);
    },

    // === 笔记 ===
    
    setNote: (index, value) => {
      set((state) => {
        if (index >= 0 && index < state.character.notes.length) {
          state.character.notes[index] = value;
          state.hasUnsavedChanges = true;
        }
      });
      debouncedSave(get().character);
    },

    addNote: () => {
      set((state) => {
        state.character.notes.push('');
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    removeNote: (index) => {
      set((state) => {
        if (index >= 0 && index < state.character.notes.length && state.character.notes.length > 1) {
          state.character.notes.splice(index, 1);
          state.hasUnsavedChanges = true;
        }
      });
      debouncedSave(get().character);
    },

    // === 问答 ===
    
    setQuestion: (key, value) => {
      set((state) => {
        state.character.questions[key] = value;
        state.hasUnsavedChanges = true;
      });
      debouncedSave(get().character);
    },

    // === 保存 ===
    
    save: () => {
      // 确保保存的是普通对象而不是 immer 代理
      const character = JSON.parse(JSON.stringify(get().character));
      storageService.saveCharacter(character);
      set((state) => {
        state.hasUnsavedChanges = false;
      });
    },

    // === 导入 ===
    
    importCharacter: (data) => {
      storageService.saveCharacter(data);
      storageService.setCurrentCharacterId(data.id);
      set((state) => {
        state.character = data;
        state.hasUnsavedChanges = false;
      });
    },
  }))
);
