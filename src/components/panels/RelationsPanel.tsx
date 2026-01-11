/**
 * 关系面板
 * 管理角色的人际关系
 */
import React, { useState } from 'react';
import { useCharacterStore } from '@/stores';
import { 
  Card, 
  CardHeader, 
  Button,
  Input,
  TextArea,
  HybridSelect,
  Counter,
} from '@/components/ui';
import { RELATIONSHIP_TYPES, findRealityByName, getRealityNames, getBonusOptions, bonuses } from '@/data';

export const RelationsPanel: React.FC = () => {
  const character = useCharacterStore((state) => state.character);
  const relationships = useCharacterStore((state) => state.character.relationships);
  const addRelationship = useCharacterStore((state) => state.addRelationship);
  const removeRelationship = useCharacterStore((state) => state.removeRelationship);
  const updateRelationship = useCharacterStore((state) => state.updateRelationship);
  
  // 现实身份相关
  const realities = useCharacterStore((state) => state.character.realities);
  const realitySlots = useCharacterStore((state) => state.character.realitySlots);
  const setRealitySlots = useCharacterStore((state) => state.setRealitySlots);
  const addReality = useCharacterStore((state) => state.addReality);
  const removeReality = useCharacterStore((state) => state.removeReality);
  const updateReality = useCharacterStore((state) => state.updateReality);

  const relationshipTypeOptions = RELATIONSHIP_TYPES.map(type => ({ 
    value: type, 
    label: type 
  }));

  const realityOptions = getRealityNames().map(name => ({ value: name, label: name }));
  
  // 连结奖励选项
  const bonusOptions = getBonusOptions();
  
  // 展开的奖励详情
  const [expandedBonusId, setExpandedBonusId] = useState<string | null>(null);

  // 获取主现实身份信息
  const mainRealityData = character.realityType 
    ? findRealityByName(character.realityType) 
    : null;

  return (
    <div className="space-y-6">
      {/* 主现实身份信息 */}
      {character.realityType && mainRealityData && (
        <Card variant="bordered">
          <CardHeader 
            title={`现实: ${character.realityType}`}
            subtitle="当前的现实身份"
          />
          
          <div className="space-y-4">
            <div className="p-4 bg-theme-hover rounded-lg">
              <h4 className="text-sm font-medium text-reality mb-2">触发条件</h4>
              <p className="text-theme-text whitespace-pre-wrap text-sm">
                {mainRealityData.trigger}
              </p>
            </div>
            
            <div className="p-4 bg-theme-hover rounded-lg">
              <h4 className="text-sm font-medium text-red-400 mb-2">过载效果</h4>
              <p className="text-theme-text whitespace-pre-wrap text-sm">
                {mainRealityData.overload}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* 额外现实身份 */}
      <Card variant="bordered">
        <CardHeader 
          title="额外现实身份" 
          subtitle="通过游戏进程获得的额外现实身份"
          action={
            <Counter
              value={realitySlots}
              onChange={setRealitySlots}
              min={1}
              max={5}
              label="槽位数"
              size="sm"
            />
          }
        />
        
        <div className="space-y-4">
          {realities.map((reality) => {
            const realityData = findRealityByName(reality.name);
            
            return (
              <div 
                key={reality.id}
                className="p-4 bg-theme-hover rounded-lg space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <HybridSelect
                      label="现实身份"
                      options={realityOptions}
                      value={reality.name}
                      onChange={(value) => updateReality(reality.id, { name: value })}
                    />
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeReality(reality.id)}
                    className="mt-6"
                  >
                    删除
                  </Button>
                </div>
                
                <TextArea
                  label="备注"
                  value={reality.notes}
                  onChange={(e) => updateReality(reality.id, { notes: e.target.value })}
                  placeholder="关于此现实身份的备注..."
                  rows={2}
                />
                
                {realityData && (
                  <div className="text-xs text-theme-text-muted">
                    触发: {realityData.trigger.split('\n')[0]}
                  </div>
                )}
              </div>
            );
          })}
          
          {realities.length < realitySlots && (
            <Button
              variant="secondary"
              onClick={() => addReality()}
              className="w-full"
            >
              + 添加现实身份
            </Button>
          )}
        </div>
      </Card>

      {/* 人际关系 */}
      <Card variant="bordered">
        <CardHeader 
          title="人际关系" 
          subtitle="与其他角色或NPC的关系"
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={addRelationship}
            >
              + 添加关系
            </Button>
          }
        />
        
        <div className="space-y-4">
          {relationships.length === 0 ? (
            <p className="text-center text-theme-text-muted py-8">
              还没有添加任何关系，点击上方按钮添加
            </p>
          ) : (
            relationships.map((rel) => (
              <div 
                key={rel.id}
                className="p-4 bg-theme-hover rounded-lg space-y-3"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Input
                      label="姓名"
                      value={rel.name}
                      onChange={(e) => updateRelationship(rel.id, { name: e.target.value })}
                      placeholder="关系人姓名"
                    />
                    
                    <HybridSelect
                      label="关系类型"
                      options={relationshipTypeOptions}
                      value={rel.type}
                      onChange={(value) => updateRelationship(rel.id, { type: value })}
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-theme-text-muted mb-1.5">
                        连结值
                      </label>
                      <input
                        type="number"
                        value={rel.bondValue ?? 0}
                        onChange={(e) => updateRelationship(rel.id, { bondValue: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-theme-surface border border-theme-border rounded text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeRelationship(rel.id)}
                    className="mt-6"
                  >
                    删除
                  </Button>
                </div>
                
                {/* 连结奖励选择 */}
                <div>
                  <label className="block text-sm font-medium text-theme-text-muted mb-1.5">
                    连结奖励
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={rel.bonusIndex ?? ''}
                      onChange={(e) => updateRelationship(rel.id, { 
                        bonusIndex: e.target.value === '' ? undefined : parseInt(e.target.value) 
                      })}
                      className="flex-1 px-3 py-2 bg-theme-surface border border-theme-border rounded text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                    >
                      <option value="">无奖励</option>
                      {bonusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    {rel.bonusIndex !== undefined && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setExpandedBonusId(expandedBonusId === rel.id ? null : rel.id)}
                      >
                        {expandedBonusId === rel.id ? '收起' : '详情'}
                      </Button>
                    )}
                  </div>
                  
                  {/* 奖励详情展开 */}
                  {rel.bonusIndex !== undefined && expandedBonusId === rel.id && (
                    <div className="mt-2 p-3 bg-theme-surface border border-theme-border rounded-lg text-sm text-theme-text">
                      {bonuses[rel.bonusIndex]}
                    </div>
                  )}
                </div>
                
                <TextArea
                  label="描述"
                  value={rel.description}
                  onChange={(e) => updateRelationship(rel.id, { description: e.target.value })}
                  placeholder="描述这段关系..."
                  rows={2}
                />
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
