import { useUpdateOirignalSurvey } from '@/src/hooks/evaluation/useUpdateSurvey';
import { UserType } from '@/src/schemas/auth';
import { Survey } from '@/src/schemas/evaluation';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import { Dispatch, SetStateAction, useMemo, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import ModalComponent from '../ModalComponent';

interface ShowQuestionModalProps {
  type: UserType;
  subjectData: Survey;
  qusetionsData: Survey[];
  setShowQuestion: Dispatch<SetStateAction<boolean>>;
}

type FormValues = {
  questions: {
    surveyId: number;
    surveyContent: string;
  }[];
  subject: {
    surveyId: number;
    surveyContent: string;
  };
};

const ShowQuestionModal = ({
  type,
  subjectData,
  qusetionsData,
  setShowQuestion,
}: ShowQuestionModalProps) => {
  // isEdit : 더블 클릭 시 수정

  // activeId : 포커스된 질문
  const [activeId, setActiveId] = useState<string | null>(null);

  /* ---------------- 원본 데이터 (비교용) ---------------- */
  const originalQuestions = useMemo(() => qusetionsData, [qusetionsData]);
  const originalSubject = useMemo(() => subjectData, [subjectData]);

  /* ---------------- 수정용 상태  폼 ---------------- */

  /* ---------------- RHF ---------------- */
  const { control, handleSubmit } = useForm<FormValues>({
    defaultValues: {
      questions: qusetionsData.map((q) => ({
        surveyId: q.surveyId,
        surveyContent: q.surveyContent,
      })),
      subject: {
        surveyId: subjectData.surveyId,
        surveyContent: subjectData.surveyContent,
      },
    },
  });

  const { fields } = useFieldArray({
    control,
    name: 'questions',
  });

  const [isEditMode, setIsEditMode] = useState(false);

  /* ---------------- 질문 수정 ---------------- */

  //   질문 하나 입력
  // questions 전체 새 배열
  // 모든 LinedField가 새 props

  /* ---------------- 변경된 것만 추출 ---------------- */

  /* ---------------- 저장 ---------------- */
  // const handleSave = () => {
  //   if (changedPayload.length === 0) {
  //     setShowQuestion(false);
  //     return;
  //   }

  //   updateSurvey(changedPayload, {
  //     onSuccess: () => {
  //       setShowQuestion(false);
  //     },
  //     onError: (e) => {
  //       console.error('설문 문항 수정 실패', e);
  //     },
  //   });
  // };

  /* ---------------- 수정 훅 ---------------- */

  const resetEditState = () => {
    setIsEditMode(false);
    setActiveId(null);
  };

  const { mutate: updateSurvey } = useUpdateOirignalSurvey(type);

  const onSubmit = (data: FormValues) => {
    const changed = data.questions.filter(
      (q, i) => q.surveyContent !== originalQuestions[i]?.surveyContent
    );

    if (data.subject.surveyContent !== originalSubject.surveyContent) {
      changed.push(data.subject);
    }

    if (changed.length === 0) {
      setShowQuestion(false);
      return;
    }

    updateSurvey(changed, {
      onSuccess: () => {
        resetEditState();
        setShowQuestion(false);
      },
    });
  };

  const LinedField = ({
    label,
    isQustion,
    active,

    children,
    onClick,
    onDoubleClick,
  }: {
    label: string;
    isQustion?: boolean;
    active?: boolean;
    isEditing?: boolean;
    children: React.ReactNode;

    onFocus?: () => void;

    onClick?: () => void;
    onChange?: (v: string) => void;
    onDoubleClick?: () => void;
  }) => {
    return (
      <div
        onDoubleClick={onDoubleClick}
        onClick={onClick}
        className="flex items-center gap-2.5"
      >
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
        {children}
      </div>
    );
  };

  // 경로로 '차평가'
  const params = useParams();
  const phase = params.phase;
  const phaseNumber = Number(String(phase).replace('phase', ''));
  return (
    <ModalComponent
      title={`${phaseNumber}차평가`} // 폴더 이름으로 수정 필요
      subtitle="설문 문항"
      onClose={() => setShowQuestion(false)}
      onSubmit={handleSubmit(onSubmit)}
      button={isEditMode ? '저장' : undefined}
    >
      <div className="mt-0.5 flex flex-col gap-5 pr-0.5">
        {fields.map((field, index) => {
          const id = String(field.surveyId);

          return (
            <LinedField
              key={field.id}
              label={String(index + 1)} // 수정 필요
              active={activeId === id}
              isEditing={activeId === id}
              onDoubleClick={() => {
                setIsEditMode(true);
                setActiveId(id);
              }}
            >
              {' '}
              {activeId === id ? (
                <Controller
                  control={control}
                  name={`questions.${index}.surveyContent`}
                  render={({ field }) => (
                    <input
                      {...field}
                      autoFocus
                      onBlur={() => setActiveId(null)}
                      placeholder="평가 질문을 적어주세요"
                      className={clsx(
                        'placeholder:text-gray min-w-135 min-h-11.5 text-regular16 flex-1 rounded-lg border-[1px] p-2.5 px-3 py-3 text-[#2D2E2E] outline-none',
                        activeId === id
                          ? 'border-primary-blue ring-primary-blue ring-[1px]'
                          : 'border-[#E5E5E5]'
                      )}
                    />
                  )}
                />
              ) : (
                <Controller
                  control={control}
                  name={`questions.${index}.surveyContent`}
                  render={({ field }) => (
                    <p className="border-system-lineGray h-11.5 min-w-135 rounded-lg border p-2.5">
                      {field.value}
                    </p>
                  )}
                />
              )}
            </LinedField>
          );
        })}

        {/* ---------- subject ---------- */}

        <LinedField
          label="정성평가"
          active={activeId === 'subject'}
          isEditing={activeId === 'subject'}
          onDoubleClick={() => {
            setIsEditMode(true);
            setActiveId('subject');
          }}
        >
          {activeId === 'subject' ? (
            <Controller
              control={control}
              name="subject.surveyContent"
              render={({ field }) => (
                <input
                  {...field}
                  autoFocus
                  onBlur={() => setActiveId(null)}
                  placeholder="평가 질문을 적어주세요"
                  className="min-w-135 flex-1 rounded-lg border px-3 py-2 outline-none"
                />
              )}
            />
          ) : (
            <p className="border-system-lineGray min-w-135 rounded-lg border p-2.5">
              {subjectData.surveyContent}
            </p>
          )}
        </LinedField>
      </div>
    </ModalComponent>
  );
};

export default ShowQuestionModal;

// 문항 원문 보기 & 더블클릭 시 수정
