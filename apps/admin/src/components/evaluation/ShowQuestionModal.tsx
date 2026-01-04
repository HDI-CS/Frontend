import { useUpdateOirignalSurvey } from '@/src/hooks/evaluation/useUpdateSurvey';
import { UserType } from '@/src/schemas/auth';
import { Survey } from '@/src/schemas/evaluation';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import ModalComponent from '../ModalComponent';

interface ShowQuestionModalProps {
  type: UserType;
  subjectData: Survey;
  qusetionsData: Survey[];
  setShowQuestion: Dispatch<SetStateAction<boolean>>;
}

const ShowQuestionModal = ({
  type,
  subjectData,
  qusetionsData,
  setShowQuestion,
}: ShowQuestionModalProps) => {
  // isEdit : 더블 클릭 시 수정
  // const [isEdit, setIsEdit] = useState(false);

  // activeId : 포커스된 질문
  const [activeId, setActiveId] = useState<string | null>(null);

  /* ---------------- 원본 데이터 (비교용) ---------------- */
  const originalQuestions = useMemo(() => qusetionsData, [qusetionsData]);
  const originalSubject = useMemo(() => subjectData, [subjectData]);

  /* ---------------- 수정용 상태 ---------------- */
  const [questions, setQuestions] = useState<Survey[]>(qusetionsData);
  const [subject, setSubject] = useState<Survey>(subjectData);

  /* ---------------- 질문 수정 ---------------- */
  const updateQuestion = (surveyId: number, value: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.surveyId === surveyId ? { ...q, surveyContent: value } : q
      )
    );
  };

  /* ---------------- 변경된 것만 추출 ---------------- */
  const changedPayload = useMemo(() => {
    const changedQuestions = questions.filter((q) => {
      const origin = originalQuestions.find((o) => o.surveyId === q.surveyId);
      return origin?.surveyContent !== q.surveyContent;
    });

    const subjectChanged =
      subject.surveyContent !== originalSubject.surveyContent;

    return [
      ...changedQuestions.map((q) => ({
        surveyId: q.surveyId,
        surveyContent: q.surveyContent,
      })),
      ...(subjectChanged
        ? [
            {
              surveyId: subject.surveyId,
              surveyContent: subject.surveyContent,
            },
          ]
        : []),
    ];
  }, [questions, subject, originalQuestions, originalSubject]);

  /* ---------------- 저장 ---------------- */
  const handleSave = () => {
    if (changedPayload.length === 0) {
      setShowQuestion(false);
      return;
    }

    updateSurvey(changedPayload, {
      onSuccess: () => {
        setShowQuestion(false);
      },
      onError: (e) => {
        console.error('설문 문항 수정 실패', e);
      },
    });
  };

  /* ---------------- 수정 훅 ---------------- */

  const { mutate: updateSurvey } = useUpdateOirignalSurvey(type);
  const isSubjectEditing = activeId === 'subject';

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
      onSubmit={handleSave}
      button={activeId ? '저장' : undefined}
    >
      <div className="mt-0.5 flex flex-col gap-5 pr-0.5">
        {questions?.map((question, index) => {
          return (
            <LinedField
              key={question.surveyId}
              label={String(index + 1)} // 수정 필요
              value={question.surveyContent}
              isQustion={true}
              active={activeId === String(question.surveyId)}
              isEditing={activeId === String(question.surveyId)}
              onDoubleClick={() => {
                setActiveId(String(question.surveyId));
              }}
              onFocus={() => setActiveId(String(question.surveyId))}
              onChange={(v) => updateQuestion(question.surveyId, v)}
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
                value={subject.surveyContent}
                onFocus={() => setActiveId('subject')}
                onChange={(e) =>
                  setSubject((prev) => ({
                    ...prev,
                    surveyContent: e.target.value,
                  }))
                }
                placeholder="평가 질문을 적어주세요"
                className="min-w-135 flex-1 rounded-lg border border-gray-200 px-4 py-2"
              />
            </div>
          ) : (
            <p
              onDoubleClick={() => setActiveId('subject')}
              className="border-1 min-w-135 border-system-lineGray min-h-11.5 flex-1 rounded-lg p-2.5 text-[#2D2E2E]"
            >
              {subjectData.surveyContent}
            </p>
          )}
        </div>
      </div>
    </ModalComponent>
  );
};

export default ShowQuestionModal;

// 문항 원문 보기 & 더블클릭 시 수정
