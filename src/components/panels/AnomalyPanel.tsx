/**
 * 异常体面板
 * 显示异常体信息和能力列表
 */
import React, { useState } from 'react';
import clsx from 'clsx';
import { useCharacterStore } from '@/stores';
import { 
  Card, 
  CardHeader, 
  CollapsibleCard,
  Button,
  TextArea,
  Input,
  Select,
  Counter,
} from '@/components/ui';
import { findAnomalyByName, ATTRIBUTE_NAMES } from '@/data';

const BRANCH_COLORS = [
  { value: 'blue', label: '蓝色' },
  { value: 'orange', label: '橙色' },
  { value: 'red', label: '红色' },
  { value: 'green', label: '绿色' },
  { value: 'purple', label: '紫色' },
  { value: 'yellow', label: '黄色' },
];

const getBranchColorClass = (color?: string, defaultColor: string = 'blue') => {
  const c = color || defaultColor;
  switch (c) {
    case 'orange': return 'bg-orange-500/20 text-orange-400';
    case 'red': return 'bg-red-500/20 text-red-400';
    case 'green': return 'bg-green-500/20 text-green-400';
    case 'purple': return 'bg-purple-500/20 text-purple-400';
    case 'yellow': return 'bg-yellow-500/20 text-yellow-400';
    case 'blue':
    default: return 'bg-blue-500/20 text-blue-400';
  }
};

export const AnomalyPanel: React.FC = () => {
  const character = useCharacterStore((state) => state.character);
  const setAnomalySlots = useCharacterStore((state) => state.setAnomalySlots);
  const addAnomaly = useCharacterStore((state) => state.addAnomaly);
  const removeAnomaly = useCharacterStore((state) => state.removeAnomaly);
  const updateAnomaly = useCharacterStore((state) => state.updateAnomaly);
  const addAnomalyAbility = useCharacterStore((state) => state.addAnomalyAbility);
  const removeAnomalyAbility = useCharacterStore((state) => state.removeAnomalyAbility);
  const updateAnomalyAbility = useCharacterStore((state) => state.updateAnomalyAbility);
  
  const [isEditMode, setIsEditMode] = useState(false);

  const { anomalySlots, anomalies } = character;

  // 获取主异常体的能力信息
  const mainAnomalyData = character.anomalyType 
    ? findAnomalyByName(character.anomalyType) 
    : null;

  return (
    <div className="space-y-6">
      {/* 主异常体信息 */}
      {character.anomalyType && (
        <Card variant="bordered">
          <CardHeader 
            title={`异常体: ${character.anomalyType}`}
            subtitle="主要异常体能力"
          />
          
          {mainAnomalyData ? (
            <div className="space-y-4">
              {mainAnomalyData.abilities.map((ability, index) => (
                <CollapsibleCard
                  key={index}
                  title={ability.name}
                  variant="bordered"
                  padding="sm"
                  badge={
                    <span className="px-2 py-0.5 text-xs bg-anomaly/20 text-anomaly rounded">
                      {ability.trig}
                    </span>
                  }
                >
                  <div className="space-y-3 text-sm">
                    <div>
                      <span className="text-muted-text">条件：</span>
                      <span className="text-light-text">{ability.qual}</span>
                    </div>
                    
                    <div>
                      <span className="text-green-400 font-medium">成功：</span>
                      <p className="text-light-text whitespace-pre-wrap mt-1">{ability.succ}</p>
                    </div>
                    
                    <div>
                      <span className="text-red-400 font-medium">失败：</span>
                      <p className="text-light-text whitespace-pre-wrap mt-1">{ability.fail}</p>
                    </div>
                    
                    {ability.tdesc && (
                      <div className="mt-4 p-3 bg-dark-hover rounded">
                        <span className="text-muted-text block mb-2">{ability.tdesc}</span>
                        <div className="flex flex-col gap-2">
                          {ability.t1 && (
                            <div className="flex items-center gap-2">
                              <span className={clsx(
                                'text-xs px-1.5 py-0.5 rounded',
                                getBranchColorClass(ability.t1c, 'blue')
                              )}>
                                {ability.t1v}
                              </span>
                              <span className="text-light-text">{ability.t1}</span>
                            </div>
                          )}
                          {ability.t2 && (
                            <div className="flex items-center gap-2">
                              <span className={clsx(
                                'text-xs px-1.5 py-0.5 rounded',
                                getBranchColorClass(ability.t2c, 'orange')
                              )}>
                                {ability.t2v}
                              </span>
                              <span className="text-light-text">{ability.t2}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </CollapsibleCard>
              ))}
            </div>
          ) : (
            <p className="text-muted-text">未找到异常体数据</p>
          )}
        </Card>
      )}

      {/* 额外异常能力槽位 */}
      <Card variant="bordered">
        <CardHeader 
          title="额外异常能力" 
          subtitle="通过游戏进程获得的额外异常能力"
          action={
            <div className="flex items-center gap-4">
              <Button
                variant={isEditMode ? "primary" : "secondary"}
                size="sm"
                onClick={() => setIsEditMode(!isEditMode)}
              >
                {isEditMode ? "💾 保存/退出编辑" : "📝 开启编辑模式"}
              </Button>
              <div className="h-6 w-px bg-theme-border" />
              <Counter
                value={anomalySlots}
                onChange={setAnomalySlots}
                min={1}
                max={10}
                label="槽位数"
                size="sm"
              />
            </div>
          }
        />
        
        <div className="space-y-6">
          {anomalies.map((anomaly) => (
            <div 
              key={anomaly.id}
              className={clsx(
                "p-4 rounded-lg space-y-4 transition-colors",
                isEditMode ? "bg-dark-hover" : "bg-dark-surface/30 border border-theme-border/50"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {isEditMode ? (
                    <Input
                      label="能力来源 / 异常体名称"
                      value={anomaly.name || ''}
                      onChange={(e) => updateAnomaly(anomaly.id, { name: e.target.value })}
                      placeholder="输入此额外能力的来源..."
                    />
                  ) : (
                    <h3 className="text-xl font-bold text-anomaly">{anomaly.name || '未命名异常能力'}</h3>
                  )}
                </div>
                {isEditMode && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeAnomaly(anomaly.id)}
                    className="mt-7"
                  >
                    删除槽位
                  </Button>
                )}
              </div>

              {/* 能力列表 */}
              <div className={clsx(
                "space-y-4 pt-2",
                isEditMode && "border-t border-theme-border"
              )}>
                {isEditMode && (
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-theme-text opacity-80">能力列表</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => addAnomalyAbility(anomaly.id)}
                      className="text-xs h-7"
                    >
                      + 添加具体能力
                    </Button>
                  </div>
                )}

                {anomaly.abilities?.map((ability, idx) => (
                  isEditMode ? (
                    <CollapsibleCard
                      key={idx}
                      title={ability.name || '未命名能力'}
                      variant="bordered"
                      padding="sm"
                      badge={
                        <span className="px-2 py-0.5 text-xs bg-anomaly/20 text-anomaly rounded">
                          {ability.trig}
                        </span>
                      }
                      action={
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeAnomalyAbility(anomaly.id, idx);
                          }}
                          className="text-red-400 hover:text-red-300 h-6 w-6 p-0"
                        >
                          ×
                        </Button>
                      }
                    >
                      <div className="space-y-4">
                        {/* 编辑表单 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            label="能力名称"
                            value={ability.name || ''}
                            onChange={(e) => updateAnomalyAbility(anomaly.id, idx, { name: e.target.value })}
                          />
                          <Select
                            label="触发属性"
                            options={ATTRIBUTE_NAMES.map(n => ({ value: n, label: n }))}
                            value={ability.trig || '专注'}
                            onChange={(value) => updateAnomalyAbility(anomaly.id, idx, { trig: value })}
                          />
                        </div>

                        <TextArea
                          label="资格 / 条件"
                          value={ability.qual || ''}
                          onChange={(e) => updateAnomalyAbility(anomaly.id, idx, { qual: e.target.value })}
                          rows={1}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <TextArea
                            label="成功效果"
                            className="text-green-400"
                            value={ability.succ || ''}
                            onChange={(e) => updateAnomalyAbility(anomaly.id, idx, { succ: e.target.value })}
                            rows={2}
                          />
                          <TextArea
                            label="失败效果"
                            className="text-red-400"
                            value={ability.fail || ''}
                            onChange={(e) => updateAnomalyAbility(anomaly.id, idx, { fail: e.target.value })}
                            rows={2}
                          />
                        </div>

                        <div className="space-y-3 p-3 bg-dark-surface rounded border border-theme-border">
                          <div className="text-xs text-muted-text flex justify-between">
                            <span>分支选项 (可选)</span>
                          </div>
                          <Input
                            label="分支问题/描述"
                            value={ability.tdesc || ''}
                            onChange={(e) => updateAnomalyAbility(anomaly.id, idx, { tdesc: e.target.value })}
                          />
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Input
                                label="选项 1 内容"
                                value={ability.t1 || ''}
                                onChange={(e) => updateAnomalyAbility(anomaly.id, idx, { t1: e.target.value })}
                              />
                              <Input
                                label="选项 1 关联值"
                                value={ability.t1v || ''}
                                onChange={(e) => updateAnomalyAbility(anomaly.id, idx, { t1v: e.target.value })}
                                placeholder="如: T2 / 现实"
                              />
                              <Select
                                label="选项 1 颜色"
                                options={BRANCH_COLORS}
                                value={ability.t1c || 'blue'}
                                onChange={(value) => updateAnomalyAbility(anomaly.id, idx, { t1c: value })}
                              />
                            </div>
                            <div className="space-y-2">
                              <Input
                                label="选项 2 内容"
                                value={ability.t2 || ''}
                                onChange={(e) => updateAnomalyAbility(anomaly.id, idx, { t2: e.target.value })}
                              />
                              <Input
                                label="选项 2 关联值"
                                value={ability.t2v || ''}
                                onChange={(e) => updateAnomalyAbility(anomaly.id, idx, { t2v: e.target.value })}
                                placeholder="如: P4 / 职能"
                              />
                              <Select
                                label="选项 2 颜色"
                                options={BRANCH_COLORS}
                                value={ability.t2c || 'orange'}
                                onChange={(value) => updateAnomalyAbility(anomaly.id, idx, { t2c: value })}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </CollapsibleCard>
                  ) : (
                    <CollapsibleCard
                      key={idx}
                      title={ability.name}
                      variant="bordered"
                      padding="sm"
                      badge={
                        <span className="px-2 py-0.5 text-xs bg-anomaly/20 text-anomaly rounded">
                          {ability.trig}
                        </span>
                      }
                    >
                      <div className="space-y-3 text-sm">
                        <div>
                          <span className="text-muted-text">条件：</span>
                          <span className="text-light-text">{ability.qual}</span>
                        </div>
                        
                        <div>
                          <span className="text-green-400 font-medium">成功：</span>
                          <p className="text-light-text whitespace-pre-wrap mt-1">{ability.succ}</p>
                        </div>
                        
                        <div>
                          <span className="text-red-400 font-medium">失败：</span>
                          <p className="text-light-text whitespace-pre-wrap mt-1">{ability.fail}</p>
                        </div>
                        
                        {ability.tdesc && (
                          <div className="mt-4 p-3 bg-dark-hover rounded">
                            <span className="text-muted-text block mb-2">{ability.tdesc}</span>
                            <div className="flex flex-col gap-2">
                              {ability.t1 && (
                                <div className="flex items-center gap-2">
                                  <span className={clsx(
                                    'text-xs px-1.5 py-0.5 rounded',
                                    getBranchColorClass(ability.t1c, 'blue')
                                  )}>
                                    {ability.t1v}
                                  </span>
                                  <span className="text-light-text">{ability.t1}</span>
                                </div>
                              )}
                              {ability.t2 && (
                                <div className="flex items-center gap-2">
                                  <span className={clsx(
                                    'text-xs px-1.5 py-0.5 rounded',
                                    getBranchColorClass(ability.t2c, 'orange')
                                  )}>
                                    {ability.t2v}
                                  </span>
                                  <span className="text-light-text">{ability.t2}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </CollapsibleCard>
                  )
                ))}

                {(!anomaly.abilities || anomaly.abilities.length === 0) && (
                  <p className="text-center py-4 text-xs text-muted-text italic">
                    {isEditMode ? "暂无具体能力，点击上方按钮添加" : "尚未填入具体能力内容"}
                  </p>
                )}
              </div>
            </div>
          ))}
          
          {isEditMode && anomalies.length < anomalySlots && (
            <Button
              variant="secondary"
              onClick={() => addAnomaly()}
              className="w-full"
            >
              + 添加新额外能力来源
            </Button>
          )}
          
          {isEditMode && anomalies.length >= anomalySlots && (
            <p className="text-center text-muted-text text-sm">
              已达到槽位上限
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};
