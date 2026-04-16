import { QUESTION_TYPE_META } from '@/config/surveyTypeMap';
type Category = keyof (typeof QUESTION_TYPE_META)['visual'];
type QuestionType = keyof typeof QUESTION_TYPE_META;

interface SurveyTypeHeaderProps {
  category: Category;
  type: QuestionType;
}

export default function SurveyTypeHeader({
  type,
  category,
}: SurveyTypeHeaderProps) {
  const meta = QUESTION_TYPE_META[type][category];

  return (
    <div className="flex gap-4 text-[16px] font-light text-[#7686FC]">
      <div className="w-1 flex-shrink-0 self-stretch rounded-full bg-[#DDE1FF]"></div>
      <div className="flex flex-col">
        <p>
          다음은 <span className="font-semibold">‘{meta.title}’</span> 에 관한
          평가 문항입니다.
        </p>
        <p>
          <span className="font-semibold">{meta.perspective.highlight}</span>
          {meta.perspective.suffix}{' '}
          <span className="font-semibold">{meta.description}</span>{' '}
          <span>평가해 주십시오.</span>
        </p>
      </div>
    </div>
  );
}
