/**
 * 职能面板组件
 * 包含资质属性、授权行为、资源等
 */
import React from 'react';
import { useCharacterStore } from '@/stores';
import { 
  Card, 
  CardHeader, 
  DotTracker, 
  Counter, 
  Input,
} from '@/components/ui';
import { ATTRIBUTE_NAMES } from '@/data';
import type { AttributeName } from '@/types';

export const AttributesPanel: React.FC = () => {
  const character = useCharacterStore((state) => state.character);
  const setAttributeCurrent = useCharacterStore((state) => state.setAttributeCurrent);
  const setAttributeMax = useCharacterStore((state) => state.setAttributeMax);
  const toggleAttributeMarked = useCharacterStore((state) => state.toggleAttributeMarked);
  const setCommendations = useCharacterStore((state) => state.setCommendations);
  const setReprimands = useCharacterStore((state) => state.setReprimands);
  const setPermission = useCharacterStore((state) => state.setPermission);
  const incrementPermissionCount = useCharacterStore((state) => state.incrementPermissionCount);
  const decrementPermissionCount = useCharacterStore((state) => state.decrementPermissionCount);

  return (
    <div className="space-y-6">
      {/* 资质属性 */}
      <Card variant="bordered">
        <CardHeader 
          title="资质属性" 
          subtitle="9大资质，点击圆点调整当前值"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ATTRIBUTE_NAMES.map((attrName) => {
            const attr = character.attributes[attrName as AttributeName];
            return (
              <div 
                key={attrName}
                className="flex flex-col gap-2 p-3 bg-theme-hover rounded-lg"
              >
                <span className="font-medium text-theme-text text-sm">{attrName}</span>
                <div className="flex items-center justify-center">
                  <DotTracker
                    current={attr.current}
                    max={attr.max}
                    marked={attr.marked}
                    onChange={(value) => setAttributeCurrent(attrName as AttributeName, value)}
                    onMaxChange={(value) => setAttributeMax(attrName as AttributeName, value)}
                    onToggleMarked={() => toggleAttributeMarked(attrName as AttributeName)}
                    size="md"
                    color="red"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* 指令（来自职能） */}
      <Card variant="bordered">
        <CardHeader
          title="指令"
          subtitle="职能赋予的指令描述"
        />

        <div className="p-4 bg-theme-hover rounded-lg">
          {character.functionDirective ? (
            <div className="whitespace-pre-wrap text-theme-text text-sm">{character.functionDirective}</div>
          ) : (
            <div className="text-theme-text-muted text-sm">未选择职能或无可用指令</div>
          )}
        </div>
      </Card>

      {/* 授权行为 */}
      <Card variant="bordered">
        <CardHeader 
          title="授权行为" 
          subtitle="职能赋予的授权行为"
        />
        
        <div className="space-y-4">
          {character.permissions.map((perm, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="flex-1">
                <Input
                  label={`授权 ${index + 1}`}
                  value={perm}
                  onChange={(e) => setPermission(index as 0 | 1 | 2, e.target.value)}
                  placeholder={`输入授权 ${index + 1}...`}
                />
              </div>
              <div className="pt-6">
                <Counter
                  value={Object.values(character.permissionCounts)[index]}
                  onChange={(value) => {
                    const current = Object.values(character.permissionCounts)[index];
                    if (value > current) {
                      incrementPermissionCount(index as 0 | 1 | 2);
                    } else {
                      decrementPermissionCount(index as 0 | 1 | 2);
                    }
                  }}
                  min={0}
                  label="已使用"
                  size="sm"
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 资源 */}
      <Card variant="bordered">
        <CardHeader title="资源" />
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-theme-hover rounded-lg">
            <Counter
              label="嘉奖"
              value={character.commendations}
              onChange={setCommendations}
              min={0}
            />
          </div>
          <div className="p-3 bg-theme-hover rounded-lg">
            <Counter
              label="申诫"
              value={character.reprimands}
              onChange={setReprimands}
              min={0}
            />
          </div>
          <div className="p-3 bg-theme-hover rounded-lg">
            <div className="text-sm text-theme-text-muted">MVP 次数</div>
            <div className="text-2xl font-bold text-theme-text">{character.mvpCount}</div>
          </div>
          <div className="p-3 bg-theme-hover rounded-lg">
            <div className="text-sm text-theme-text-muted">观察次数</div>
            <div className="text-2xl font-bold text-theme-text">{character.watchCount}</div>
          </div>
        </div>
      </Card>
    </div>
  );
};
