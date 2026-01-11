/**
 * 异常体面板
 * 显示异常体信息和能力列表
 */
import React from 'react';
import { useCharacterStore } from '@/stores';
import { 
  Card, 
  CardHeader, 
  CollapsibleCard,
  Button,
  HybridSelect,
  TextArea,
  Counter,
} from '@/components/ui';
import { findAnomalyByName, getAnomalyNames } from '@/data';

export const AnomalyPanel: React.FC = () => {
  const character = useCharacterStore((state) => state.character);
  const anomalies = useCharacterStore((state) => state.character.anomalies);
  const anomalySlots = useCharacterStore((state) => state.character.anomalySlots);
  const setAnomalySlots = useCharacterStore((state) => state.setAnomalySlots);
  const addAnomaly = useCharacterStore((state) => state.addAnomaly);
  const removeAnomaly = useCharacterStore((state) => state.removeAnomaly);
  const updateAnomaly = useCharacterStore((state) => state.updateAnomaly);

  // 获取主异常体的能力信息
  const mainAnomalyData = character.anomalyType 
    ? findAnomalyByName(character.anomalyType) 
    : null;

  const anomalyOptions = getAnomalyNames().map(name => ({ value: name, label: name }));

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
                              <span className="text-xs px-1.5 py-0.5 bg-blue-500/20 text-blue-400 rounded">
                                {ability.t1v}
                              </span>
                              <span className="text-light-text">{ability.t1}</span>
                            </div>
                          )}
                          {ability.t2 && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs px-1.5 py-0.5 bg-orange-500/20 text-orange-400 rounded">
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

      {/* 额外异常体槽位 */}
      <Card variant="bordered">
        <CardHeader 
          title="额外异常体" 
          subtitle="通过游戏进程获得的额外异常体"
          action={
            <div className="flex items-center gap-2">
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
        
        <div className="space-y-4">
          {anomalies.map((anomaly) => {
            const anomalyData = findAnomalyByName(anomaly.name);
            
            return (
              <div 
                key={anomaly.id}
                className="p-4 bg-dark-hover rounded-lg space-y-3"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <HybridSelect
                      label="异常体类型"
                      options={anomalyOptions}
                      value={anomaly.name}
                      onChange={(value) => updateAnomaly(anomaly.id, { name: value })}
                    />
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeAnomaly(anomaly.id)}
                    className="mt-6"
                  >
                    删除
                  </Button>
                </div>
                
                <TextArea
                  label="备注"
                  value={anomaly.notes}
                  onChange={(e) => updateAnomaly(anomaly.id, { notes: e.target.value })}
                  placeholder="关于此异常体的备注..."
                  rows={2}
                />
                
                {/* 显示能力简要 */}
                {anomalyData && (
                  <div className="mt-2">
                    <span className="text-xs text-muted-text">能力：</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {anomalyData.abilities.map((ab, i) => (
                        <span 
                          key={i}
                          className="px-2 py-1 text-xs bg-anomaly/20 text-anomaly rounded"
                        >
                          {ab.name} ({ab.trig})
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          
          {anomalies.length < anomalySlots && (
            <Button
              variant="secondary"
              onClick={() => addAnomaly()}
              className="w-full"
            >
              + 添加异常体
            </Button>
          )}
          
          {anomalies.length >= anomalySlots && (
            <p className="text-center text-muted-text text-sm">
              已达到槽位上限，增加槽位数以添加更多异常体
            </p>
          )}
        </div>
      </Card>
    </div>
  );
};
