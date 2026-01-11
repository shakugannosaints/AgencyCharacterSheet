/**
 * 物品面板
 * 管理角色的物品和装备
 */
import React from 'react';
import { useCharacterStore } from '@/stores';
import { 
  Card, 
  CardHeader, 
  Button,
  Input,
  TextArea,
  CollapsibleCard,
} from '@/components/ui';
import { findFunctionByName } from '@/data';

export const ItemsPanel: React.FC = () => {
  const character = useCharacterStore((state) => state.character);
  const items = useCharacterStore((state) => state.character.items);
  const addItem = useCharacterStore((state) => state.addItem);
  const removeItem = useCharacterStore((state) => state.removeItem);
  const updateItem = useCharacterStore((state) => state.updateItem);

  // 获取职能物品信息
  const functionData = character.functionType 
    ? findFunctionByName(character.functionType) 
    : null;

  // 分离职能物品和普通物品
  const functionItems = items.filter(item => item.isFromFunction);
  const regularItems = items.filter(item => !item.isFromFunction);

  return (
    <div className="space-y-6">
      {/* 职能信息 */}
      {character.functionType && functionData && (
        <Card variant="bordered">
          <CardHeader 
            title={`职能: ${character.functionType}`}
            subtitle="当前的工作职能"
          />
          
          <div className="space-y-4">
            {/* 指令 */}
            <div className="p-4 bg-theme-hover rounded-lg">
              <h4 className="text-sm font-medium text-functional mb-2">指令</h4>
              <p className="text-theme-text whitespace-pre-wrap text-sm">
                {functionData.directive}
              </p>
            </div>
            
            {/* 授权列表 */}
            <div className="p-4 bg-theme-hover rounded-lg">
              <h4 className="text-sm font-medium text-functional mb-2">授权</h4>
              <ul className="space-y-1">
                {functionData.perms.map((perm, i) => (
                  <li key={i} className="text-theme-text text-sm flex items-start gap-2">
                    <span className="text-functional">•</span>
                    {perm}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* 职能物品 */}
      {functionItems.length > 0 && (
        <Card variant="bordered">
          <CardHeader 
            title="职能物品" 
            subtitle="由职能自动获得的特殊物品"
          />
          
          <div className="space-y-4">
            {functionItems.map((item) => (
              <CollapsibleCard
                key={item.id}
                title={item.name}
                variant="bordered"
                padding="sm"
                badge={
                  <span className="px-2 py-0.5 text-xs bg-functional/20 text-functional rounded">
                    {item.source}
                  </span>
                }
              >
                <p className="text-theme-text text-sm whitespace-pre-wrap">
                  {item.effect}
                </p>
              </CollapsibleCard>
            ))}
          </div>
        </Card>
      )}

      {/* 普通物品 */}
      <Card variant="bordered">
        <CardHeader 
          title="物品栏" 
          subtitle="角色携带的物品和装备"
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => addItem()}
            >
              + 添加物品
            </Button>
          }
        />
        
        <div className="space-y-4">
          {regularItems.length === 0 ? (
            <p className="text-center text-theme-text-muted py-8">
              还没有添加任何物品，点击上方按钮添加
            </p>
          ) : (
            regularItems.map((item) => (
              <div 
                key={item.id}
                className="p-4 bg-theme-hover rounded-lg space-y-3"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      label="物品名称"
                      value={item.name}
                      onChange={(e) => updateItem(item.id, { name: e.target.value })}
                      placeholder="输入物品名称"
                    />
                    
                    <Input
                      label="来源"
                      value={item.source || ''}
                      onChange={(e) => updateItem(item.id, { source: e.target.value })}
                      placeholder="物品来源（可选）"
                    />
                  </div>
                  
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeItem(item.id)}
                    className="mt-6"
                  >
                    删除
                  </Button>
                </div>
                
                <TextArea
                  label="效果/描述"
                  value={item.effect}
                  onChange={(e) => updateItem(item.id, { effect: e.target.value })}
                  placeholder="描述物品的效果或用途..."
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
