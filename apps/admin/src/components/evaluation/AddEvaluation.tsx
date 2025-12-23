import clsx from 'clsx';
import { useState } from 'react';
import ModalComponent from '../ModalComponent';
import QuestionRow from './QuestionRow';

interface AddEvaluationProps {
  onClose: () => void;
  isEdit?: boolean;
  qusetionsData?: Question[];
  subjectiveData?: Question;
}

type Question = {
  id: string;
  text: string;
};

const AddEvaluation = ({
  onClose,
  isEdit,
  qusetionsData,
  subjectiveData,
}: AddEvaluationProps) => {
  // questions : 객관식/문항 리스트
  const [questions, setQuestions] = useState<Question[]>(
    qusetionsData ? qusetionsData : [{ id: '1', text: '' }]
  );
  // activeId : 포커스된 질문
  const [activeId, setActiveId] = useState<string | null>(null);

  // subjective : 정성평가 입력값
  const [subjective, setSubjective] = useState(
    subjectiveData?.text ? subjectiveData.text : ''
  );

  const addQuestion = () => {
    setQuestions((prev) => [...prev, { id: crypto.randomUUID(), text: '' }]);
  };

  const updateQuestion = (id: string, text: string) => {
    setQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, text } : q)));
  };

  const removeQuestion = (id: string) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <ModalComponent
      title="Folder Name"
      subtitle="평가문항"
      button={isEdit ? '저장' : '평가 생성'}
      onClose={onClose}
      onSubmit={onClose}
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
              active={activeId === q.id}
              onFocus={() => setActiveId(q.id)}
              onChange={(v) => updateQuestion(q.id, v)}
              onRemove={() => removeQuestion(q.id)}
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
          className="flex items-center gap-2.5"
        >
          <div
            className={clsx(
              'h-11 w-1 self-stretch rounded',
              activeId === 'subject' ? 'bg-primary-blue' : 'bg-system-lineGray'
            )}
          ></div>
          <span className="text-bold16 w-22">정성평가</span>
          <input
            value={subjective}
            onFocus={() => setActiveId('subject')}
            onChange={(e) => setSubjective(e.target.value)}
            placeholder="평가 질문을 적어주세요"
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2"
          />
        </div>
      </div>
    </ModalComponent>
  );
};
export default AddEvaluation;
