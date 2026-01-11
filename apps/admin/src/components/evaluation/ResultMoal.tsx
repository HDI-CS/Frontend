import { Survey, SurveyData } from '@/src/schemas/evaluation';
import clsx from 'clsx';
import ModalComponent from '../ModalComponent';

interface AddEvaluationProps {
  row: SurveyData | null;
  selectedIndex: string | null;
  currentIndex: number;
  totalLength: number;
  expertName: string;

  qusetionsData?: Survey[];
  subjectiveData?: Question;
  lastIndex: number | null;

  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export type Question = {
  id: string;
  text: string;
};

const ResultModal = ({
  row,
  selectedIndex,
  currentIndex,
  totalLength,
  expertName,

  qusetionsData,
  // subjectiveData,
  // lastIndex,
  onClose,
  onPrev,
  onNext,
}: AddEvaluationProps) => {
  // questions : 객관식/문항 리스트
  // const [questions, setQuestions] = useState<Question[]>(
  //   qusetionsData ? qusetionsData : [{ id: '1', text: '' }]
  // );

  // subjective : 정성평가 입력값
  // const [subjective, setSubjective] = useState(
  //   subjectiveData?.text ? subjectiveData.text : ''
  // );

  // 화살표 관리
  const isFirst = currentIndex <= 0;
  const isLast = currentIndex >= totalLength - 1;
  const quantitativeQuestions =
    qusetionsData?.filter((q) => q.surveyType !== 'TEXT') ?? [];

  const subjectiveQuestion = qusetionsData?.find(
    (q) => q.surveyType === 'TEXT'
  );

  const LinedField = ({
    value,
    label,
    isQustion,
  }: {
    value: string;
    label: string;
    isQustion: boolean;
  }) => {
    return (
      <div className="flex items-center gap-2.5">
        <div
          className={clsx('bg-system-lineGray w-1 self-stretch rounded')}
        ></div>
        <span
          className={clsx(
            'text-bold16 w-22 text-[#2D2E2E]',
            isQustion && 'flex-1'
          )}
        >
          {label}
        </span>
        <p
          className={clsx(
            'border-1 border-system-lineGray min-w-37 min-h-11.5 rounded-lg p-2.5 text-[#2D2E2E]',
            !isQustion && 'flex-1'
          )}
        >
          {value}
        </p>
      </div>
    );
  };

  return (
    <>
      <ModalComponent
        title={selectedIndex ?? ''}
        subtitle="설문 결과"
        onClose={onClose}
        onSubmit={onClose}
        allow={true}
        isPrevDisabled={isFirst}
        isNextDisabled={isLast}
        onPrev={onPrev}
        onNext={onNext}
      >
        <div className="mx-1 flex flex-col gap-5">
          {row && (
            <>
              <LinedField
                value={expertName}
                label="평가자명"
                isQustion={false}
              />
              <LinedField
                value={String(row.dataCode)} // 설문 데이터 코드
                label="아이디"
                isQustion={false}
              />
              {quantitativeQuestions?.map((question, index) => {
                // const score = row.quantitativeScores[index] a

                return (
                  <LinedField
                    key={index}
                    value={question.answerContent ?? ''}
                    label={question.surveyContent}
                    isQustion={true}
                  />
                );
              })}
              {subjectiveQuestion && (
                <div className="flex items-center gap-2.5">
                  <div
                    className={clsx(
                      'bg-system-lineGray w-1 self-stretch rounded'
                    )}
                  ></div>
                  <span className="text-bold16 w-22 text-[#2D2E2E]">
                    정성평가
                  </span>
                  <p className="border-1 w-134 border-system-lineGray min-h-11.5 flex-1 rounded-lg p-2.5 text-[#2D2E2E]">
                    {subjectiveQuestion.answerContent}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </ModalComponent>
    </>
  );
};
export default ResultModal;
