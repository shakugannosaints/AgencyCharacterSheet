/**
 * 角色基础信息面板
 */
import React, { useRef } from 'react';
import { useCharacterStore } from '@/stores';
import { Input, Card, CardHeader, HybridSelect, Button } from '@/components/ui';
import { getAnomalyNames, getRealityNames, getFunctionNames } from '@/data';

export const ProfilePanel: React.FC = () => {
  const character = useCharacterStore((state) => state.character);
  const setName = useCharacterStore((state) => state.setName);
  const setPronouns = useCharacterStore((state) => state.setPronouns);
  const setGenderPronoun = useCharacterStore((state) => state.setGenderPronoun);
  const setPortrait = useCharacterStore((state) => state.setPortrait);
  const setAnomalyType = useCharacterStore((state) => state.setAnomalyType);
  const setRealityType = useCharacterStore((state) => state.setRealityType);
  const setFunctionType = useCharacterStore((state) => state.setFunctionType);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePortraitClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPortrait(result);
    };
    reader.readAsDataURL(file);
  };

  const anomalyOptions = getAnomalyNames().map(name => ({ value: name, label: name }));
  const realityOptions = getRealityNames().map(name => ({ value: name, label: name }));
  const functionOptions = getFunctionNames().map(name => ({ value: name, label: name }));

  return (
    <div className="space-y-6">
      {/* 头像和基本信息 */}
      <Card variant="bordered">
        <CardHeader title="基本信息" />
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* 头像 */}
          <div className="flex-shrink-0">
            <button
              type="button"
              onClick={handlePortraitClick}
              className="w-32 h-32 rounded-full border-2 border-dashed border-theme-border hover:border-theme-primary transition-colors overflow-hidden bg-theme-hover flex items-center justify-center"
            >
              {character.portrait ? (
                <img
                  src={character.portrait}
                  alt="头像"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-theme-text-muted text-sm text-center px-2">
                  点击上传头像
                </span>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {character.portrait && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPortrait('')}
                className="mt-2 w-full"
              >
                移除头像
              </Button>
            )}
          </div>

          {/* 表单字段 */}
          <div className="flex-1 space-y-4">
            <Input
              label="姓名"
              value={character.name}
              onChange={(e) => setName(e.target.value)}
              placeholder="输入角色姓名"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="代称"
                value={character.pronouns}
                onChange={(e) => setPronouns(e.target.value)}
                placeholder="例如：他们"
              />
              <Input
                label="性别代词"
                value={character.genderPronoun}
                onChange={(e) => setGenderPronoun(e.target.value)}
                placeholder="例如：她/她的"
              />
            </div>
          </div>
        </div>
      </Card>

      {/* 核心身份 */}
      <Card variant="bordered">
        <CardHeader 
          title="核心身份" 
          subtitle="选择角色的异常体、现实身份和职能"
        />
        
        <div className="space-y-4">
          <HybridSelect
            label="异常体"
            options={anomalyOptions}
            value={character.anomalyType}
            onChange={setAnomalyType}
            placeholder="选择或输入异常体类型"
          />
          
          <HybridSelect
            label="现实身份"
            options={realityOptions}
            value={character.realityType}
            onChange={setRealityType}
            placeholder="选择或输入现实身份"
          />
          
          <HybridSelect
            label="职能"
            options={functionOptions}
            value={character.functionType}
            onChange={(value) => setFunctionType(value, true)}
            placeholder="选择或输入职能"
          />
        </div>
      </Card>
    </div>
  );
};
