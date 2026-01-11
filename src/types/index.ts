/**
 * 三角机构角色卡系统 - 核心类型定义
 * 基于原始系统的数据结构完整重建
 */

// ============================================
// 游戏配置数据类型（静态数据）
// ============================================

/**
 * 异常体能力定义
 */
export interface AnomalyAbility {
  /** 能力名称 */
  name: string;
  /** 触发属性（用于判定） */
  trig: string;
  /** 资格/条件描述 */
  qual: string;
  /** 成功效果 */
  succ: string;
  /** 失败效果 */
  fail: string;
  /** 分支选择问题 */
  tdesc?: string;
  /** 分支选项1 */
  t1?: string;
  /** 分支选项2 */
  t2?: string;
  /** 分支选项1关联值（如 "T2" = 现实, "P4" = 职能）*/
  t1v?: string;
  /** 分支选项2关联值 */
  t2v?: string;
}

/**
 * 异常体类型定义
 */
export interface AnomalyType {
  /** 异常体名称 */
  name: string;
  /** 异常体能力列表 */
  abilities: AnomalyAbility[];
}

/**
 * 现实身份定义
 */
export interface RealityType {
  /** 现实身份名称 */
  name: string;
  /** 触发条件 */
  trigger: string;
  /** 过载效果 */
  overload: string;
}

/**
 * 职能物品定义
 */
export interface FunctionItem {
  /** 物品名称 */
  item: string;
  /** 物品效果 */
  eff: string;
}

/**
 * 职能定义
 */
export interface FunctionType {
  /** 职能名称 */
  name: string;
  /** 指令描述 */
  directive: string;
  /** 授权列表（通常3个） */
  perms: string[];
  /** 职能物品列表 */
  items: FunctionItem[];
}

// ============================================
// 角色卡数据类型（动态数据）
// ============================================

/**
 * 9大资质属性
 */
export type AttributeName = 
  | '专注' | '欺瞒' | '活力' 
  | '共情' | '主动' | '坚毅'
  | '气场' | '专业' | '诡秘';

/**
 * 属性值状态
 */
export interface AttributeValue {
  /** 当前值 */
  current: number;
  /** 最大值 */
  max: number;
  /** 是否标记（用于特殊状态） */
  marked: boolean;
}

/**
 * 9个资质属性集合
 */
export type Attributes = Record<AttributeName, AttributeValue>;

/**
 * 进度轨道单元格状态
 */
export type ProgressCellState = 'empty' | 'filled' | 'ignored';

/**
 * 进度轨道类型
 */
export type ProgressTrackType = 'functional' | 'reality' | 'anomaly';

/**
 * 进度轨道数据
 */
export interface ProgressTrack {
  /** 已填充的格子索引 */
  filled: number[];
  /** 被忽略的格子索引 */
  ignored: number[];
}

/**
 * 角色异常体条目
 */
export interface CharacterAnomaly {
  id: string;
  /** 异常体名称 */
  name: string;
  /** 备注 */
  notes: string;
}

/**
 * 角色现实条目
 */
export interface CharacterReality {
  id: string;
  /** 现实身份名称 */
  name: string;
  /** 备注 */
  notes: string;
}

/**
 * 关系类型
 */
export type RelationshipType = 
  | '同事' | '朋友' | '家人' 
  | '敌人' | '恋人' | '熟人'
  | '其他';

/**
 * 角色关系条目
 */
export interface CharacterRelationship {
  id: string;
  /** 关系对象名称 */
  name: string;
  /** 关系类型 */
  type: RelationshipType | string;
  /** 关系描述 */
  description: string;
  /** 连结值（整数，用户自定义） */
  bondValue?: number;
  /** 连结奖励（bonuses.json 中的索引） */
  bonusIndex?: number;
}

/**
 * 物品条目
 */
export interface CharacterItem {
  id: string;
  /** 物品名称 */
  name: string;
  /** 物品效果/描述 */
  effect: string;
  /** 物品来源 */
  source?: string;
  /** 是否为职能物品（自动获取） */
  isFromFunction?: boolean;
}

/**
 * 崩溃进度（现实过载）
 */
export interface CollapseProgress {
  /** 4个槽位的填充状态 */
  slots: boolean[];
}

/**
 * 自定义进度轨道
 */
export interface CustomProgressTrack {
  id: string;
  /** 轨道名称 */
  name: string;
  /** 轨道颜色（hex） */
  color: string;
  /** 最大格数 */
  max: number;
  /** 已填充的格子索引 */
  filled: number[];
}

/**
 * 授权使用计数
 */
export interface PermissionCounts {
  perm1: number;
  perm2: number;
  perm3: number;
}

/**
 * 问答记录（9个问题）
 */
export interface QuestionsAnswers {
  q1: string;
  q2: string;
  q3: string;
  q4: string;
  q5: string;
  q6: string;
  q7: string;
  q8: string;
  q9: string;
}

/**
 * 完整角色卡数据
 */
export interface CharacterData {
  /** 唯一标识符 */
  id: string;
  /** 版本号（用于数据迁移） */
  version: string;
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;

  // === 基础信息 ===
  /** 角色姓名 */
  name: string;
  /** 代称 */
  pronouns: string;
  /** 性别代词 */
  genderPronoun: string;
  /** 头像（Base64或URL） */
  portrait: string;

  // === 核心身份 ===
  /** 异常体类型 */
  anomalyType: string;
  /** 现实身份 */
  realityType: string;
  /** 职能 */
  functionType: string;

  // === 授权 ===
  /** 三个授权名称 */
  permissions: string[];
  /** 授权使用计数 */
  permissionCounts: PermissionCounts;

  // === 资源 ===
  /** 嘉奖数量 */
  commendations: number;
  /** 申诫数量 */
  reprimands: number;
  /** MVP计数 */
  mvpCount: number;
  /** 观察计数 */
  watchCount: number;

  // === 属性 ===
  attributes: Attributes;

  // === 进度轨道 ===
  progressTracks: {
    functional: ProgressTrack;
    reality: ProgressTrack;
    anomaly: ProgressTrack;
  };

  // === 崩溃进度 ===
  collapseProgress: CollapseProgress;

  // === 异常体槽位数 ===
  anomalySlots: number;
  /** 现实槽位数 */
  realitySlots: number;

  // === 异常体列表 ===
  anomalies: CharacterAnomaly[];

  // === 现实列表 ===
  realities: CharacterReality[];

  // === 关系列表 ===
  relationships: CharacterRelationship[];

  // === 物品列表 ===
  items: CharacterItem[];

  // === 笔记 ===
  notes: string[];

  // === 自定义进度轨道 ===
  customProgressTracks: CustomProgressTrack[];

  // === 问答 ===
  questions: QuestionsAnswers;
}

// ============================================
// 应用状态类型
// ============================================

/**
 * 标签页类型
 */
export type TabType = 'profile' | 'attributes' | 'anomaly' | 'relations' | 'items' | 'questionnaire' | 'balance' | 'notes';

/**
 * 模态框类型
 */
export type ModalType = 
  | 'none'
  | 'portrait'
  | 'export'
  | 'import'
  | 'share'
  | 'settings'
  | 'confirm';

/**
 * 通知类型
 */
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

/**
 * 应用UI状态
 */
export interface UIState {
  /** 当前激活的标签页 */
  activeTab: TabType;
  /** 当前打开的模态框 */
  activeModal: ModalType;
  /** 通知列表 */
  notifications: Notification[];
  /** 是否显示侧边栏 */
  sidebarOpen: boolean;
  /** 是否为移动端视图 */
  isMobile: boolean;
  /** 是否正在保存 */
  isSaving: boolean;
  /** 是否有未保存的更改 */
  hasUnsavedChanges: boolean;
}

// ============================================
// 导出/导入类型
// ============================================

/**
 * 导出格式
 */
export type ExportFormat = 'json' | 'html';

/**
 * 导出选项
 */
export interface ExportOptions {
  format: ExportFormat;
  includePortrait: boolean;
  compressed: boolean;
}

/**
 * 分享数据
 */
export interface ShareData {
  characterId: string;
  data: string; // 压缩后的角色数据
  createdAt: string;
}

// ============================================
// 游戏配置数据汇总
// ============================================

/**
 * 游戏配置数据（静态）
 */
export interface GameConfig {
  anomalies: AnomalyType[];
  realities: RealityType[];
  functions: FunctionType[];
}
