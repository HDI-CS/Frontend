import { useCreateEvaluationYear } from '@/src/hooks/evaluation/useCreateEvaluationYear';
import { useCreateQuestion } from '@/src/hooks/evaluation/useCreateQuestion';
import { useEvaluationQuestion } from '@/src/hooks/evaluation/useEvaluationQuestion';
import { useUpdateSurvey } from '@/src/hooks/evaluation/useUpdateSurvey';
import { UserType } from '@/src/schemas/auth';
import {
  SurveyQuestionByTypeWithSampleText,
  SurveyQuestionByTypeWithSampleTextArray,
} from '@/src/schemas/survey';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import ModalComponent from '../ModalComponent';
import QuestionRow from './QuestionRow';

interface AddEvaluationProps {
  onClose: () => void;
  type: UserType;
  yearId?: number;
  addStep?: number;
  isEdit?: boolean;
  createdYearId?: number;
  setCreatedYearId?: (n: number) => void;
  editFolderName?: string;
  qusetionsData?: Question[];
  subjectiveData?: Question;
}

type Question = {
  id?: number; // 서버 id
  tempId?: string; // 프론트 전용 key
  text: string;
  surveyCode: string;
};

const AddEvaluation = ({
  onClose,
  type,
  yearId,
  setCreatedYearId,
  addStep,
  isEdit,
  editFolderName,
  // qusetionsData,
  subjectiveData,
}: AddEvaluationProps) => {
  // 바꿀 로직
  // 폴더 이름 모달 -> 평가설문 모달 -> 폴더 생성 (+ 폴더 이름 수정 + 설문 문항 생성)
  // 년도 평가 등록

  // 년도 폴더 이름 수정
  const { mutateAsync: createFolder } = useCreateEvaluationYear(
    type,
    (yearId) => {
      if(setCreatedYearId){
      setCreatedYearId(yearId);}
    }
  );
  const { mutateAsync: updateFolderName } = useUpdateSurvey(type);

  // 수정일 시에만 기존 데이터 가져옴
  // 수정이지만 동일 아이디로 새롭게 등록
  const [folderName, setFolderName] = useState('');

  // questions : 객관식/문항 리스트
  const [questions, setQuestions] = useState<Question[]>([]);

  // activeId : 포커스된 질문
  const [activeId, setActiveId] = useState<string | null>(null);
  // subjective : 정성평가 입력값
  const [subjective, setSubjective] = useState(
    subjectiveData?.text ? subjectiveData.text : ''
  );
  const [subjectiveCode, setSubjectiveCode] = useState<string>('');

  // sampleText : 샘플 텍스트
  const [sampleText, setSampleText] = useState<string>('');

  const { data } = useEvaluationQuestion(type, yearId!); // surveyCode도 받아서 그대로 넘겨주기
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
          surveyCode: q.surveyCode,
        }))
      );
    } else {
      setQuestions([]);
    }

    /** 2. 정성(TEXT) */
    const textGroup = groups.find((g) => g.type === 'TEXT');

    if (textGroup?.questions[0]) {
      setSubjective(textGroup.questions[0].surveyContent);
      setSubjectiveCode(textGroup.questions[0].surveyCode ?? '');
    } else {
      setSubjective('');
      setSubjectiveCode('');
    }

    /** 3. 샘플(SAMPLE) */
    const originalSampleText = groups.find((g) => g.type === 'SAMPLE');

    if (originalSampleText?.questions[0]) {
      setSampleText(originalSampleText.questions[0].surveyContent);
    } else {
      setSampleText('');
    }

    // 폴더 이름 기존 유지
    setFolderName(data.result.folderName ?? '');
  }, [data]);

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      { id: Date.now(), text: '', surveyCode: '' },
    ]);
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
    questions: { text: string; surveyCode: string }[];
    subjective: string;
  }): SurveyQuestionByTypeWithSampleTextArray => {
    const result: SurveyQuestionByTypeWithSampleText[] = [];

    // 1.  객관식 (NUMBER)
    questions.forEach((q, index) => {
      if (!q.text.trim()) return;

      result.push({
        type: 'NUMBER',
        surveyNumber: index + 1,
        surveyCode: q.surveyCode,
        surveyContent: q.text,
        sampleText: null,
      });
    });

    // 2. 정성 평가 (TEXT)
    if (subjective.trim()) {
      result.push({
        type: 'TEXT',
        surveyNumber: questions.length + 1,
        surveyCode: subjectiveCode,
        surveyContent: subjective,
        sampleText: sampleText,
      });
    }

    // 3.  샘플 (SAMPLE) — 필요 시
    // if (sampleText.trim()) {
    //   result.push({
    //     type: 'SAMPLE',
    //     surveyNumber: 1,
    //     surveyCode: 'PR_FRM_QT',
    //     surveyContent: sampleText,
    //   });
    // }

    return result;
    // folderName,
  };

  const { mutateAsync: createQuestion } = useCreateQuestion(type);

  const handlAddeSubmit = async () => {
    const body = buildEvaluationRequestBody({
      questions,
      subjective,
    });

    try {
      // 1 폴더 생성
      const createRes = await createFolder();
      const newYearId = createRes.result.yearId;

      // 2 생성 직후 → 바로 이름 수정
      await updateFolderName({
        yearId: newYearId,
        folderName: editFolderName ?? '',
      });

      // 3  설문문항 등록
      await createQuestion(
        { body, yearId: newYearId },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } catch (e) {
      console.error('폴더 생성 실패', e);
    }
  };

  const handleSubmit = () => {
    const body = buildEvaluationRequestBody({
      questions,
      subjective,
    });

    try {
      // 3  설문문항 등록
      createQuestion(
        { body, yearId: yearId ?? 1 },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } catch (e) {
      console.error('폴더 생성 실패', e);
    }
  };

  return (
    <ModalComponent
      title={folderName ?? ''}
      subtitle="평가문항"
      button={isEdit ? '저장' : '평가 생성'}
      onClose={onClose}
      onSubmit={addStep === 2 ? handlAddeSubmit : handleSubmit}
    >
      <div onClick={() => setActiveId(null)} className="flex flex-col gap-5">
        <div className="mb-0 flex h-full w-full text-[#2D2E2E]">
          <div className="flex gap-2.5">
            <div className="bg-neutral-gray30 h-full w-1 rounded"></div>
            <p className="text-bold16 py-1">
              평가 문항 {addStep === 2 ? '생성' : '수정'}
            </p>
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
              value={sampleText}
              onFocus={() => setActiveId('subject')}
              onChange={(e) => setSampleText(e.target.value)}
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
