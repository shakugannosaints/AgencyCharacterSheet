/**
 * 属性面板组件
 * 包含资质属性、进度轨道、资源等
 */
import React from 'react';
import { useCharacterStore } from '@/stores';
import { 
  Card, 
  CardHeader, 
  DotTracker, 
  Counter, 
  ProgressTrack, 
  CollapseProgress,
  TextArea,
  Input,
  Button,
} from '@/components/ui';
import { ATTRIBUTE_NAMES } from '@/data';
import type { AttributeName } from '@/types';

export const AttributesPanel: React.FC = () => {
  const character = useCharacterStore((state) => state.character);
  const setAttributeCurrent = useCharacterStore((state) => state.setAttributeCurrent);
  const setAttributeMax = useCharacterStore((state) => state.setAttributeMax);
  const toggleAttributeMarked = useCharacterStore((state) => state.toggleAttributeMarked);
  const toggleProgressCell = useCharacterStore((state) => state.toggleProgressCell);
  const ignoreProgressCell = useCharacterStore((state) => state.ignoreProgressCell);
  const toggleCollapseSlot = useCharacterStore((state) => state.toggleCollapseSlot);
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

      {/* 进度轨道 */}
      <Card variant="bordered">
        <CardHeader 
          title="进度轨道" 
          subtitle="填充一个轨道会自动忽略其他轨道的相同位置"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <ProgressTrack
            type="functional"
            filled={character.progressTracks.functional.filled}
            ignored={character.progressTracks.functional.ignored}
            onCellClick={(index) => toggleProgressCell('functional', index)}
            onCellRightClick={(index) => ignoreProgressCell('functional', index)}
          />
          
          <ProgressTrack
            type="reality"
            filled={character.progressTracks.reality.filled}
            ignored={character.progressTracks.reality.ignored}
            onCellClick={(index) => toggleProgressCell('reality', index)}
            onCellRightClick={(index) => ignoreProgressCell('reality', index)}
          />
          
          <ProgressTrack
            type="anomaly"
            filled={character.progressTracks.anomaly.filled}
            ignored={character.progressTracks.anomaly.ignored}
            onCellClick={(index) => toggleProgressCell('anomaly', index)}
            onCellRightClick={(index) => ignoreProgressCell('anomaly', index)}
          />
        </div>
      </Card>

      {/* 崩溃进度 */}
      <Card variant="bordered">
        <CardHeader 
          title="现实过载" 
          subtitle="当所有槽位填满时，必须选择新的现实"
        />
        
        <CollapseProgress
          slots={character.collapseProgress.slots}
          onToggle={toggleCollapseSlot}
        />
      </Card>

      {/* 笔记 */}
      <Card variant="bordered">
        <CardHeader 
          title="笔记" 
          subtitle="记录任何重要信息"
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={() => useCharacterStore.getState().addNote()}
            >
              + 添加笔记
            </Button>
          }
        />
        
        <div className="space-y-4">
          {character.notes.length === 0 ? (
            <p className="text-center text-theme-text-muted py-8">
              还没有添加任何笔记，点击上方按钮添加
            </p>
          ) : (
            character.notes.map((note, index) => (
              <div key={index} className="relative">
                <TextArea
                  label={`笔记 ${index + 1}`}
                  value={note}
                  onChange={(e) => useCharacterStore.getState().setNote(index, e.target.value)}
                  placeholder={`记录任何重要信息...`}
                  rows={3}
                />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => useCharacterStore.getState().removeNote(index)}
                  className="absolute top-0 right-0"
                >
                  删除
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
