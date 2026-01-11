/**
 * 平衡工作与生活面板
 * 包含进度轨道和自定义进度轨道
 */
import React, { useState } from 'react';
import { useCharacterStore } from '@/stores';
import { 
  Card, 
  CardHeader, 
  ProgressTrack, 
  Button,
  Input,
} from '@/components/ui';

const TRACK_COLORS = [
  { value: 'red', label: '红色', class: 'bg-red-500' },
  { value: 'blue', label: '蓝色', class: 'bg-blue-500' },
  { value: 'yellow', label: '黄色', class: 'bg-yellow-500' },
  { value: 'green', label: '绿色', class: 'bg-green-500' },
  { value: 'purple', label: '紫色', class: 'bg-purple-500' },
  { value: 'orange', label: '橙色', class: 'bg-orange-500' },
] as const;

type TrackColor = 'red' | 'blue' | 'yellow' | 'green' | 'purple' | 'orange';

export const BalancePanel: React.FC = () => {
  const character = useCharacterStore((state) => state.character);
  const toggleProgressCell = useCharacterStore((state) => state.toggleProgressCell);
  const ignoreProgressCell = useCharacterStore((state) => state.ignoreProgressCell);
  const addCustomProgressTrack = useCharacterStore((state) => state.addCustomProgressTrack);
  const removeCustomProgressTrack = useCharacterStore((state) => state.removeCustomProgressTrack);
  const updateCustomProgressTrack = useCharacterStore((state) => state.updateCustomProgressTrack);
  const toggleCustomProgressCell = useCharacterStore((state) => state.toggleCustomProgressCell);

  // 新建自定义轨道的表单状态
  const [newTrackName, setNewTrackName] = useState('');
  const [newTrackColor, setNewTrackColor] = useState<TrackColor>('blue');
  const [newTrackMaxCells, setNewTrackMaxCells] = useState(5);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddTrack = () => {
    if (!newTrackName.trim()) return;
    
    addCustomProgressTrack(newTrackName.trim(), newTrackColor, newTrackMaxCells);
    setNewTrackName('');
    setNewTrackColor('blue');
    setNewTrackMaxCells(5);
    setShowAddForm(false);
  };

  const getColorClass = (color: TrackColor, filled: boolean) => {
    if (!filled) return 'bg-theme-hover border-theme-border';
    
    const colorMap: Record<TrackColor, string> = {
      red: 'bg-red-500 border-red-600',
      blue: 'bg-blue-500 border-blue-600',
      yellow: 'bg-yellow-500 border-yellow-600',
      green: 'bg-green-500 border-green-600',
      purple: 'bg-purple-500 border-purple-600',
      orange: 'bg-orange-500 border-orange-600',
    };
    return colorMap[color];
  };

  return (
    <div className="space-y-6">
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

      {/* 自定义进度轨道 */}
      <Card variant="bordered">
        <CardHeader 
          title="自定义进度轨道" 
          subtitle="创建您自己的进度轨道来追踪任何目标"
          action={
            !showAddForm && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowAddForm(true)}
              >
                + 新建轨道
              </Button>
            )
          }
        />
        
        {/* 添加表单 */}
        {showAddForm && (
          <div className="mb-6 p-4 bg-theme-hover rounded-lg border border-theme-border">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <Input
                label="轨道名称"
                value={newTrackName}
                onChange={(e) => setNewTrackName(e.target.value)}
                placeholder="例如：健身目标"
              />
              
              <div>
                <label className="block text-sm font-medium text-theme-text mb-2">
                  颜色
                </label>
                <div className="flex gap-2">
                  {TRACK_COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => setNewTrackColor(color.value)}
                      className={`w-8 h-8 rounded-full ${color.class} border-2 transition-all ${
                        newTrackColor === color.value 
                          ? 'border-white ring-2 ring-theme-accent scale-110' 
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                      title={color.label}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-theme-text mb-2">
                  最大格数 (1-20)
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={newTrackMaxCells}
                  onChange={(e) => setNewTrackMaxCells(Math.min(20, Math.max(1, parseInt(e.target.value) || 1)))}
                  className="w-full px-3 py-2 bg-theme-bg border border-theme-border rounded-lg text-theme-text focus:outline-none focus:ring-2 focus:ring-theme-accent"
                />
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowAddForm(false)}
              >
                取消
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleAddTrack}
                disabled={!newTrackName.trim()}
              >
                创建
              </Button>
            </div>
          </div>
        )}

        {/* 自定义轨道列表 */}
        <div className="space-y-4">
          {character.customProgressTracks.length === 0 && !showAddForm ? (
            <p className="text-center text-theme-text-muted py-8">
              还没有自定义轨道，点击上方按钮创建
            </p>
          ) : (
            character.customProgressTracks.map((track) => (
              <div 
                key={track.id}
                className="p-4 bg-theme-hover rounded-lg border border-theme-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={track.name}
                      onChange={(e) => updateCustomProgressTrack(track.id, { name: e.target.value })}
                      className="text-lg font-medium bg-transparent border-none outline-none text-theme-text"
                    />
                    <span className="text-sm text-theme-text-muted">
                      ({track.filled.length}/{track.max})
                    </span>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeCustomProgressTrack(track.id)}
                  >
                    删除
                  </Button>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {Array.from({ length: track.max }).map((_, index) => {
                    const isFilled = track.filled.includes(index);
                    return (
                      <button
                        key={index}
                        onClick={() => toggleCustomProgressCell(track.id, index)}
                        className={`w-8 h-8 rounded border-2 transition-all hover:scale-110 ${getColorClass(track.color as TrackColor, isFilled)}`}
                        title={isFilled ? '点击取消填充' : '点击填充'}
                      />
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};
