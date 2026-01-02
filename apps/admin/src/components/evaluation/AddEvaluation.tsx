import { useCreateQuestion } from '@/src/hooks/evaluation/useCreateQuestion';
import { useEvaluationQuestion } from '@/src/hooks/evaluation/useEvaluationQuestion';
import { UserType } from '@/src/schemas/auth';
import {
  SurveyQuestionByType,
  SurveyQuestionByTypeList,
} from '@/src/schemas/survey';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import ModalComponent from '../ModalComponent';
import QuestionRow from './QuestionRow';

interface AddEvaluationProps {
  onClose: () => void;
  type: UserType;
  yearId?: number;
  isEdit?: boolean;
  qusetionsData?: Question[];
  subjectiveData?: Question;
}

type Question = {
  id?: number; // 서버 id
  tempId?: string; // 프론트 전용 key
  text: string;
};

const AddEvaluation = ({
  onClose,
  type,
  yearId,
  isEdit,
  // qusetionsData,
  subjectiveData,
}: AddEvaluationProps) => {
  // questions : 객관식/문항 리스트
  const [questions, setQuestions] = useState<Question[]>([]);

  // activeId : 포커스된 질문
  const [activeId, setActiveId] = useState<string | null>(null);
  console.log(yearId);
  // subjective : 정성평가 입력값
  const [subjective, setSubjective] = useState(
    subjectiveData?.text ? subjectiveData.text : ''
  );

  const { data } = useEvaluationQuestion(type, yearId!);
  useEffect(() => {
    if (!data?.result) return;

    const groups = data.result.surveyQuestions ?? [];

    /** 1. 객관식(NUMBER) */
    const numberGroup = groups.find((g) => g.type === 'NUMBER');

    if (numberGroup) {
      setQuestions(
        numberGroup.questions.map((q) => ({
          id: q.id,
          tempId: String(q.id),
          text: q.surveyContent,
        }))
      );
    } else {
      setQuestions([]);
    }

    /** 2. 정성(TEXT) */
    const textGroup = groups.find((g) => g.type === 'TEXT');

    if (textGroup?.questions[0]) {
      setSubjective(textGroup.questions[0].surveyContent);
    } else {
      setSubjective('');
    }
  }, [data]);

  const addQuestion = () => {
    setQuestions((prev) => [...prev, { id: Date.now(), text: '' }]);
  };

  const updateQuestion = (id: number, text: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, text } : q)));
  };

  const removeQuestion = (id: number) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  //  설문 문항 수정 리퀘스트 바디

  const buildEvaluationRequestBody = ({
    // folderName,
    questions,
    subjective,
  }: {
    // folderName: string;
    questions: { text: string }[];
    subjective: string;
  }): SurveyQuestionByTypeList => {
    const result: SurveyQuestionByType[] = [];

    // 1.  객관식 (NUMBER)
    questions.forEach((q, index) => {
      if (!q.text.trim()) return;

      result.push({
        type: 'NUMBER',
        surveyNumber: index + 1,
        surveyCode: 'PR_FRM_QT',
        surveyContent: q.text,
      });
    });

    // 2. 정성 평가 (TEXT)
    if (subjective.trim()) {
      result.push({
        type: 'TEXT',
        surveyNumber: 1,
        surveyCode: 'PR_FRM_QT',
        surveyContent: subjective,
      });
    }

    // 3.  샘플 (SAMPLE) — 필요 시
    // result.push({
    //   type: 'SAMPLE',
    //   surveyNumber: 1,
    //   surveyCode: 'PR_FRM_QT',
    //   surveyContent: '샘플 텍스트',
    // });

    return result;
    // folderName,
  };

  const { mutate: createQuestion } = useCreateQuestion(type, yearId!);

  const handleSubmit = () => {
    const body = buildEvaluationRequestBody({
      // folderName: '1차년도',
      questions,
      subjective,
    });

    createQuestion(body);
  };

  return (
    <ModalComponent
      title="Folder Name"
      subtitle="평가문항"
      button={isEdit ? '저장' : '평가 생성'}
      onClose={onClose}
      onSubmit={handleSubmit}
    >
      <div onClick={() => setActiveId(null)} className="flex flex-col gap-5">
        <div className="mb-0 flex h-full w-full text-[#2D2E2E]">
          <div className="flex gap-2.5">
            <div className="bg-neutral-gray30 h-full w-1 rounded"></div>
            <p className="text-bold16 py-1">평가 문항 등록</p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {questions.map((q, idx) => (
            <QuestionRow
              key={q.id}
              index={idx}
              value={q.text}
              active={activeId === String(q.id)}
              onFocus={() => setActiveId(String(q.id))}
              onChange={(v) => updateQuestion(q.id!, v)}
              onRemove={() => removeQuestion(q.id!)}
            />
          ))}

          {/* 추가 버튼 */}
          <div className="flex items-center justify-center gap-2 text-center text-xl font-light text-[#4676FB]">
            <p
              onClick={addQuestion}
              className="bg-neutral-white border-1 shadow-card w-11 border-[#E9EFF4] pb-2 pt-1 hover:bg-[#4676FB] hover:text-[#ffffff]"
            >
              +
            </p>
          </div>
        </div>

        <div
          onClick={(e) => e.stopPropagation()}
          className="flex h-24 items-center gap-2.5"
        >
          <div
            className={clsx(
              'min-h-24 w-1 items-stretch rounded',
              activeId === 'subject' ? 'bg-primary-blue' : 'bg-system-lineGray'
            )}
          ></div>
          <span className="text-bold16 w-22">정성평가</span>
          <div className="flex flex-1 flex-col gap-2.5">
            <input
              value={subjective}
              onFocus={() => setActiveId('subject')}
              onChange={(e) => setSubjective(e.target.value)}
              placeholder="평가 질문을 적어주세요"
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2"
            />
            <input
              value={subjective}
              onFocus={() => setActiveId('subject')}
              onChange={(e) => setSubjective(e.target.value)}
              placeholder="샘플 텍스트를 적어주세요"
              className="flex-1 rounded-lg border border-gray-200 px-4 py-2"
            />
          </div>
        </div>
      </div>
    </ModalComponent>
  );
};
export default AddEvaluation;
