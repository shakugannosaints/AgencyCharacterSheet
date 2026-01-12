/**
 * 职能面板组件
 * 包含资质保证、授权行为、KPI考核等
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
import { ATTRIBUTE_NAMES, findFunctionByName } from '@/data';
import type { AttributeName } from '@/types';

export const AttributesPanel: React.FC = () => {
  const character = useCharacterStore((state) => state.character);
  const setAttributeCurrent = useCharacterStore((state) => state.setAttributeCurrent);
  const setAttributeMax = useCharacterStore((state) => state.setAttributeMax);
  const setCommendations = useCharacterStore((state) => state.setCommendations);
  const setReprimands = useCharacterStore((state) => state.setReprimands);
  const setFunctionDirective = useCharacterStore((state) => state.setFunctionDirective);
  const incrementDirectiveUsedCount = useCharacterStore((state) => state.incrementDirectiveUsedCount);
  const decrementDirectiveUsedCount = useCharacterStore((state) => state.decrementDirectiveUsedCount);
  const setPermission = useCharacterStore((state) => state.setPermission);
  const incrementPermissionCount = useCharacterStore((state) => state.incrementPermissionCount);
  const decrementPermissionCount = useCharacterStore((state) => state.decrementPermissionCount);
  const setSelfAssessmentAnswer = useCharacterStore((state) => state.setSelfAssessmentAnswer);
  const clearSelfAssessmentAnswer = useCharacterStore((state) => state.clearSelfAssessmentAnswer);

  // 获取当前职能的自我评估问题
  const currentFunction = character.functionType ? findFunctionByName(character.functionType) : null;
  const selfAssessment = currentFunction?.selfAssessment || [];

  // 处理自我评估答案变化
  const handleAssessmentChange = (questionIndex: number, optionIndex: number, attr: AttributeName) => {
    const currentAnswer = character.selfAssessmentAnswers?.[questionIndex];
    
    if (currentAnswer === optionIndex) {
      // 取消勾选：移除答案，减少属性当前值
      clearSelfAssessmentAnswer(questionIndex);
      setAttributeCurrent(attr, Math.max(0, character.attributes[attr].current - 3));
    } else {
      // 如果之前有其他选项被选中，先减去那个属性的当前值
      if (currentAnswer !== undefined && selfAssessment[questionIndex]) {
        const prevOption = selfAssessment[questionIndex].options[currentAnswer];
        if (prevOption) {
          setAttributeCurrent(prevOption.attr as AttributeName, 
            Math.max(0, character.attributes[prevOption.attr as AttributeName].current - 3));
        }
      }
      // 设置新答案，增加属性当前值
      setSelfAssessmentAnswer(questionIndex, optionIndex);
      setAttributeCurrent(attr, character.attributes[attr].current + 3);
    }
  };

  return (
    <div className="space-y-6">
      {/* 资质保证 */}
      <Card variant="bordered">
        <CardHeader 
          title="资质保证" 
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
                    onChange={(value) => setAttributeCurrent(attrName as AttributeName, value)}
                    onMaxChange={(value) => setAttributeMax(attrName as AttributeName, value)}
                    size="md"
                    color="red"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* KPI考核 */}
      <Card variant="bordered">
        <CardHeader title="KPI考核" />
        
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

      {/* 指令（来自职能，可编辑） */}
      <Card variant="bordered">
        <CardHeader
          title="指令"
          subtitle="职能赋予的指令描述"
        />

        <div className="p-4 bg-theme-hover rounded-lg">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <textarea
                className="w-full px-3 py-2 bg-theme-surface border rounded transition-colors duration-200 text-theme-text placeholder-theme-text-muted resize-none focus:outline-none focus:ring-2 focus:ring-theme-primary focus:border-transparent"
                value={character.functionDirective || ''}
                onChange={(e) => setFunctionDirective(e.target.value)}
                placeholder="职能指令..."
                rows={4}
              />
              {!character.functionDirective && (
                <p className="mt-1 text-sm text-theme-text-muted">未选择职能或无可用指令</p>
              )}
            </div>
            <div className="pt-2">
              <Counter
                value={character.directiveUsedCount || 0}
                onChange={(value) => {
                  const current = character.directiveUsedCount || 0;
                  if (value > current) {
                    incrementDirectiveUsedCount();
                  } else {
                    decrementDirectiveUsedCount();
                  }
                }}
                min={0}
                label="已使用"
                size="sm"
              />
            </div>
          </div>
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

      {/* 自我评估 */}
      {selfAssessment.length > 0 && (
        <Card variant="bordered">
          <CardHeader
            title="自我评估"
            subtitle="回答问题以获得资质保证"
          />

          <div className="space-y-4">
            {selfAssessment.map((question, qIndex) => (
              <div key={qIndex} className="p-4 bg-theme-hover rounded-lg">
                <p className="text-theme-text font-medium mb-3">
                  {qIndex + 1}. {question.question}
                </p>
                <div className="space-y-2">
                  {question.options.map((option, oIndex) => {
                    const isSelected = character.selfAssessmentAnswers?.[qIndex] === oIndex;
                    return (
                      <label
                        key={oIndex}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                          isSelected 
                            ? 'bg-theme-primary/20 border border-theme-primary' 
                            : 'bg-theme-surface hover:bg-theme-surface/80 border border-transparent'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleAssessmentChange(qIndex, oIndex, option.attr as AttributeName)}
                          className="w-5 h-5 rounded border-theme-border text-theme-primary focus:ring-theme-primary focus:ring-offset-0"
                        />
                        <span className="text-theme-text">{option.text}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

    </div>
  );
};
