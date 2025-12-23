import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { Dispatch, SetStateAction, useState } from 'react';
import ModalComponent from '../ModalComponent';
import { Question } from './ResultMoal';

interface ShowQuestionModalProps {
  subjectData: Question;
  qusetionsData: Question[];
  setShowQuestion: Dispatch<SetStateAction<boolean>>;
}

const ShowQuestionModal = ({
  subjectData,
  qusetionsData,
  setShowQuestion,
}: ShowQuestionModalProps) => {
  // isEdit : 더블 클릭 시 수정
  // const [isEdit, setIsEdit] = useState(false);

  // activeId : 포커스된 질문
  const [activeId, setActiveId] = useState<string | null>(null);

  // questions : 객관식/문항 리스트
  const [questionValue, setQuestionValue] = useState<Question[]>(qusetionsData);

  // subjective : 정성평가 입력값
  const [subjectiveValue, setSubjectiveValue] = useState(
    subjectData?.text ? subjectData.text : ''
  );

  const isSubjectEditing = activeId === 'subject';

  const updateQuestion = (id: string, text: string) => {
    setQuestionValue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, text } : q))
    );
  };

  const LinedField = ({
    value,
    label,
    isQustion,
    active,
    isEditing,
    onFocus,
    onChange,
    onDoubleClick,
  }: {
    value: string;
    label: string;
    isQustion: boolean;
    active?: boolean;
    isEditing?: boolean;

    onFocus?: () => void;
    onChange?: (v: string) => void;
    onDoubleClick?: () => void;
  }) => {
    return (
      <div onDoubleClick={onDoubleClick} className="flex items-center gap-2.5">
        <div
          className={clsx(
            'w-1 self-stretch rounded',
            active ? 'bg-primary-blue' : 'bg-system-lineGray'
          )}
        ></div>
        <span
          className={clsx(
            'text-bold16 w-22 text-[#2D2E2E]',
            isQustion && 'flex-1'
          )}
        >
          {label}
        </span>

        {isEditing && onChange ? (
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            autoFocus
            placeholder="평가 질문을 적어주세요"
            className={clsx(
              'placeholder:text-gray min-w-135 min-h-11.5 text-regular16 h-11 flex-1 rounded-lg border-[1px] p-2.5 px-3 py-3 text-[#2D2E2E] outline-none',
              active
                ? 'border-primary-blue ring-primary-blue ring-[1px]'
                : 'border-[#E5E5E5]'
            )}
          />
        ) : (
          <>
            <p
              className={clsx(
                'border-1 border-system-lineGray min-w-135 min-h-11.5 rounded-lg p-2.5 text-[#2D2E2E]',
                !isQustion && 'flex-1'
              )}
            >
              {value}
            </p>
          </>
        )}
      </div>
    );
  };

  // 경로로 '차평가'
  const params = useParams();
  const phase = params.phase;
  const phaseNumber = Number(String(phase).replace('phase', ''));
  return (
    <ModalComponent
      title={`${phaseNumber}차평가`}
      subtitle="설문 문항"
      onClose={() => setShowQuestion(false)}
      onSubmit={() => setShowQuestion(false)}
      button={activeId ? '저장' : undefined}
    >
      <div className="mt-0.5 flex flex-col gap-5 pr-0.5">
        {questionValue?.map((question, index) => {
          const currentQuestion = questionValue.find(
            (q) => q.id === question.id
          );

          return (
            <LinedField
              key={question.id}
              label={String(index + 1)} // 수정 필요
              value={currentQuestion ? currentQuestion?.text : question.text}
              isQustion={true}
              active={activeId === question.id}
              isEditing={activeId === question.id}
              onDoubleClick={() => {
                setActiveId(question.id);
              }}
              onFocus={() => setActiveId(question.id)}
              onChange={(v) => updateQuestion(question.id, v)}
            />
          );
        })}

        <div className="flex items-center gap-2.5">
          <div
            className={clsx(
              'h-11 w-1 self-stretch rounded',
              activeId === 'subject' ? 'bg-primary-blue' : 'bg-system-lineGray'
            )}
          ></div>
          <span className="text-bold16 w-22 text-[#2D2E2E]">정성평가</span>
          {isSubjectEditing ? (
            <div>
              <input
                value={subjectiveValue}
                onFocus={() => setActiveId('subject')}
                onChange={(e) => setSubjectiveValue(e.target.value)}
                placeholder="평가 질문을 적어주세요"
                className="min-w-135 flex-1 rounded-lg border border-gray-200 px-4 py-2"
              />
            </div>
          ) : (
            <p
              onDoubleClick={() => setActiveId('subject')}
              className="border-1 min-w-135 border-system-lineGray min-h-11.5 flex-1 rounded-lg p-2.5 text-[#2D2E2E]"
            >
              {subjectData.text}
            </p>
          )}
        </div>
      </div>
    </ModalComponent>
  );
};

export default ShowQuestionModal;

// 문항 원문 보기 & 더블클릭 시 수정
