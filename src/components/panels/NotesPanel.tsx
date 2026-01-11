/**
 * 笔记面板组件
 * 专门用于管理角色笔记
 */
import React from 'react';
import { useCharacterStore } from '@/stores';
import { 
  Card, 
  CardHeader, 
  TextArea,
  Button,
} from '@/components/ui';

export const NotesPanel: React.FC = () => {
  const character = useCharacterStore((state) => state.character);
  const setNote = useCharacterStore((state) => state.setNote);
  const addNote = useCharacterStore((state) => state.addNote);
  const removeNote = useCharacterStore((state) => state.removeNote);

  return (
    <div className="space-y-6">
      {/* 笔记 */}
      <Card variant="bordered">
        <CardHeader 
          title="笔记" 
          subtitle="记录任何重要信息、剧情线索、NPC信息等"
          action={
            <Button
              variant="primary"
              size="sm"
              onClick={addNote}
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
                  onChange={(e) => setNote(index, e.target.value)}
                  placeholder={`记录任何重要信息...`}
                  rows={4}
                />
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => removeNote(index)}
                  className="absolute top-0 right-0"
                >
                  删除
                </Button>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* 快速参考提示 */}
      <Card variant="bordered">
        <CardHeader 
          title="笔记提示" 
          subtitle="有效使用笔记的建议"
        />
        
        <div className="text-sm text-theme-text-muted space-y-2">
          <p>• <strong>任务记录</strong>：记录当前任务目标、进度和关键信息</p>
          <p>• <strong>NPC 信息</strong>：记录遇到的重要人物及其特征</p>
          <p>• <strong>剧情线索</strong>：记录发现的线索和未解之谜</p>
          <p>• <strong>个人目标</strong>：记录角色的个人目标和动机</p>
          <p>• <strong>规则提醒</strong>：记录容易忘记的规则或特殊能力</p>
        </div>
      </Card>
    </div>
  );
};
