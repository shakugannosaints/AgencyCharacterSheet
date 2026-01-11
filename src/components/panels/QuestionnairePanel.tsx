/**
 * 入职问卷面板
 * 包含新特工入职时需要填写的问卷
 */
import React from 'react';
import { useCharacterStore } from '@/stores';
import { Card, CardHeader, TextArea } from '@/components/ui';

// 问卷问题配置
const QUESTIONS = [
  {
    key: 'q1' as const,
    question: '你是如何与你的异常体接触的？',
  },
  {
    key: 'q2' as const,
    question: '机构是如何找到你的？',
  },
  {
    key: 'q3' as const,
    question: '你的能力有独特的外在视觉表现吗？',
  },
  {
    key: 'q4' as const,
    question: '你喝咖啡有什么偏好？',
  },
  {
    key: 'q5' as const,
    question: '请描述你过往的工作经历。',
  },
  {
    key: 'q6' as const,
    question: '你对 Adobe、Excel 和 Google 套件的熟悉程度如何？',
  },
  {
    key: 'q7' as const,
    question: '在协作型工作环境中，你能做出什么贡献？',
  },
];

export const QuestionnairePanel: React.FC = () => {
  const character = useCharacterStore((state) => state.character);
  const setQuestion = useCharacterStore((state) => state.setQuestion);

  return (
    <div className="space-y-6">
      {/* 欢迎卡片 */}
      <Card variant="bordered">
        <div className="text-center py-4">
          <div className="text-4xl text-signal-red mb-4">▲</div>
          <h2 className="text-2xl font-bold text-theme-text mb-2">
            欢迎你，特工！
          </h2>
          <p className="text-theme-text-muted max-w-lg mx-auto">
            请尽可能如实回答以下问题，以便机构和你的同事能更多地了解你。
          </p>
        </div>
      </Card>

      {/* 问卷问题 */}
      <Card variant="bordered">
        <CardHeader 
          title="入职问卷" 
          subtitle="请认真填写每一项"
        />
        
        <div className="space-y-6">
          {QUESTIONS.map((item, index) => (
            <div key={item.key} className="space-y-2">
              <label className="block text-sm font-medium text-theme-text">
                <span className="text-signal-red mr-2">{index + 1}.</span>
                {item.question}
              </label>
              <TextArea
                value={character.questions[item.key]}
                onChange={(e) => setQuestion(item.key, e.target.value)}
                placeholder="请输入你的回答..."
                rows={3}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* 补充说明 */}
      <Card variant="bordered">
        <CardHeader 
          title="补充说明" 
          subtitle="如有其他需要补充的信息，请在此填写"
        />
        
        <TextArea
          value={character.questions.q8}
          onChange={(e) => setQuestion('q8', e.target.value)}
          placeholder="任何其他你想让机构了解的信息..."
          rows={4}
        />
      </Card>
    </div>
  );
};
