'use client';

import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import ProductImage from '@/components/survey/ProductImage';
import ProductInfo from '@/components/survey/ProductInfo';
import QualitativeEvaluation from '@/components/survey/QualitativeEvaluation';
import SurveyHeader from '@/components/survey/SurveyHeader';
import SurveyNavigationWithArrows from '@/components/survey/SurveyNavigationWithArrows';
import SurveyQuestion from '@/components/survey/SurveyQuestion';
import { PREFIX_TO_TYPE, QuestionType } from '@/config/surveyTypeMap';
import { useDirtyGuard } from '@/hooks/useDirtyGuard';
import { useSurveyNavigation } from '@/hooks/useSurveyNavigation';
import {
  useSaveAllSurveyResponses,
  useSubmitAllSurveyResponses,
} from '@/hooks/useSurveyProducts';
import { UserType } from '@/schemas/auth';
import {
  type ProductSurveyDetailResponse,
  type ProductSurveyQuestion,
} from '@/schemas/survey';
import {
  clearSurveyProgress,
  loadSurveyProgress,
  saveSurveyProgress,
} from '@/utils/survey';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import ConfirmModal from './ConfirmModal';
import SurveyTypeHeader from './SurveyTypeHeader';
import Toast from './Toast';

interface ProductSurveyProps {
  surveyId: string;
  detail: ProductSurveyDetailResponse;
  dataCode: string;
}

export default function ProductSurvey({
  surveyId,
  detail,
  dataCode,
}: ProductSurveyProps) {
  const { type } = useParams();
  const surveyType = (type as string).toUpperCase() as UserType;
  const router = useRouter();

  // 설문 네비게이션 훅 사용
  const {
    canGoPrevious,
    canGoNext,
    goToPrevious,
    goToNext,
    currentIndex,
    totalSurveys,
  } = useSurveyNavigation();

  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [qualitativeAnswer, setQualitativeAnswer] = useState<string>('');
  // 제출되지 않았고, 수정시에 이탈 방지용 상태
  const [isSubmittedLocal, setIsSubmittedLocal] = useState(
    detail.result.productSurveyResponse.isSubmitted
  );

  // const [savingQuestions, setSavingQuestions] = useState<Set<string>>(
  //   new Set()
  // );
  // const [isSavingQualitative, setIsSavingQualitative] = useState(false);

  // 설문 제출 실패시 사용
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(
    null
  );
  const [submitSuccessMessage, setSubmitSuccessMessage] = useState<
    string | null
  >(null);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  const [modal, setModal] = useState<{
    show: boolean;
    message: string;
    type: 'success' | 'warning';
    onConfirm: () => void;
  }>({ show: false, message: '', type: 'success', onConfirm: () => {} });

  const showModal = (
    message: string,
    type: 'success' | 'warning',
    onConfirm: () => void
  ) => {
    setModal({ show: true, message, type, onConfirm });
  };

  const hideModal = () => {
    setModal({
      show: false,
      message: '',
      type: 'success',
      onConfirm: () => {},
    });
  };

  const saveAllMutation = useSaveAllSurveyResponses();
  const submitAllMutation = useSubmitAllSurveyResponses();

  const { isDirty, guardNavigation, setInitialValues, syncInitialValues } =
    useDirtyGuard({ answers, qualitativeAnswer, isSubmittedLocal });

  // 마지막 제출(혹은 페이지 진입) 시점의 기준값
  // const initialAnswersRef = useRef<Record<string, number>>({});
  // const initialQualitativeRef = useRef<string>('');

  const product = detail.result.industryDataSetResponse;
  const questions: ProductSurveyQuestion[] = useMemo(() => {
    return detail.result.productSurveyResponse?.response ?? [];
  }, [detail]);

  const textSurveyId =
    detail.result.productSurveyResponse.textResponse?.surveyId;
  // const isSubmitted = detail.result.productSurveyResponse.isSubmitted;

  // 서버에서 받아온 데이터를 클라이언트 상태에 반영
  useEffect(() => {
    if (!detail.result.productSurveyResponse?.response) return;
    const saved = loadSurveyProgress(surveyId);

    const serverAnswers: Record<string, number> = {};

    detail.result.productSurveyResponse.response.forEach((question) => {
      if (question.response && question.response > 0) {
        serverAnswers[String(question.surveyId)] = question.response;
      }
    });

    setAnswers(serverAnswers);

    const serverQualitative =
      detail.result.productSurveyResponse.textResponse?.response ?? '';

    // 정성평가 응답도 서버 데이터에서 초기화
    if (saved?.qualitativeAnswer && saved?.qualitativeAnswer.length < 300) {
      setQualitativeAnswer(saved.qualitativeAnswer);
    } else {
      setQualitativeAnswer(serverQualitative);
    }
    setInitialValues(serverAnswers, serverQualitative);
  }, [detail, surveyId, setInitialValues]);

  // 정성평가 응답 비교
  // if (qualitativeAnswer !== initialQualitativeRef.current) {
  //   return true;
  // }

  // return false;

  // isDIrty 일 때 브라우저 이탈 방지 팝업 등록
  useEffect(() => {
    if (!isDirty) return; // isDirty=false일 때 리턴

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isDirty]); // 의존성 배열에 isDirty 추가

  // 공통으로 쓰는 응답 배열 생성 함수
  const buildAllResponses = () => [
    ...Object.entries(answers).map(([questionId, value]) => ({
      surveyId: Number(questionId),
      response: value,
      textResponse: null,
    })),
    ...(qualitativeAnswer
      ? [
          {
            surveyId: textSurveyId ?? 1,
            response: null,
            textResponse: qualitativeAnswer || '',
          },
        ]
      : []),
  ];

  const showTemporaryMessage = (message: string) => {
    setSubmitErrorMessage(message);
    setTimeout(() => setSubmitErrorMessage(null), 3000);
  };

  const showSuccessMessage = (message: string) => {
    setSubmitSuccessMessage(message);
    setTimeout(() => setSubmitSuccessMessage(null), 3000);
  };

  // 임시저장
  const handleTempSave = async () => {
    const serverHadQualitative =
      detail.result.productSurveyResponse.textResponse?.response;

    if (!qualitativeAnswer && serverHadQualitative) {
      showModal(
        '정성평가 내용이 비어있습니다.\n기존 내용이 삭제됩니다.',
        'warning',
        async () => {
          hideModal();
          await executeTempSave();
        }
      );
      return;
    }
    await executeTempSave();
  };

  const executeTempSave = async () => {
    try {
      await saveAllMutation.mutateAsync({
        type: surveyType,
        dataId: Number(surveyId),
        requestData: buildAllResponses(),
      });
      syncInitialValues(answers, qualitativeAnswer);
      const now = new Date();
      setLastSavedTime(
        `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`
      );
      showSuccessMessage('임시저장되었습니다.');
    } catch {
      showTemporaryMessage('ERROR: 임시저장 중 오류가 발생했습니다.');
    }
  };

  // 최종제출
  const handleComplete = async () => {
    // 정성평가 빈값 체크
    const serverHadQualitative =
      detail.result.productSurveyResponse.textResponse?.response;

    if (!qualitativeAnswer && serverHadQualitative) {
      showModal(
        '정성평가 내용이 비어있습니다.\n기존 내용이 삭제됩니다.',
        'warning',
        async () => {
          hideModal();
          await executeComplete();
        }
      );
      return;
    }
    await executeComplete();
  };

  // 실제 제출 로직 분리
  const executeComplete = async () => {
    try {
      await submitAllMutation.mutateAsync({
        type: surveyType,
        dataId: Number(surveyId),
        requestData: buildAllResponses(),
      });
      syncInitialValues(answers, qualitativeAnswer);
      setIsSubmittedLocal(true);
      clearSurveyProgress(surveyId);
      showModal('모든 평가가 완료되었습니다.', 'success', () => {
        hideModal();
        if (canGoNext) {
          goToNext(); // 다음 설문으로
        } else {
          router.push(`/inbox/${surveyType.toLowerCase()}`); // 마지막이면 리스트로
        }
      });
    } catch (error) {
      console.error('설문 제출 실패:', error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;
        if (status === 400) {
          showModal(
            '아직 모든 문항에 응답하지 않았습니다.',
            'warning',
            hideModal
          );
          return;
        }
        if (status === 409) {
          showModal(message ?? '이미 처리된 요청입니다.', 'warning', hideModal);
          return;
        }
      }
      showModal('설문 제출 중 오류가 발생했습니다.', 'warning', hideModal);
    }
  };

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    if (isSubmittedLocal) setIsSubmittedLocal(false);
    saveSurveyProgress(surveyId, {
      questionsAnswered: { ...answers, [questionId]: value },
      qualitativeAnswer,
    });
  };

  const handleQualitativeChange = (value: string) => {
    setQualitativeAnswer(value);
    if (isSubmittedLocal) setIsSubmittedLocal(false);
    saveSurveyProgress(surveyId, {
      questionsAnswered: answers,
      qualitativeAnswer: value,
    });
  };

  const isAllAnswered = questions.every((q) => {
    const key = String(q.surveyId);
    return (q.response && q.response > 0) || answers[key] !== undefined;
  });

  // 정성평가 유효성 검사
  // const currentQualitativeValue =
  // detail.result.productSurveyResponse?.textResponse?.response ||
  // qualitativeAnswer;
  const isQualitativeValid = qualitativeAnswer.length >= 300;

  // 제품 이미지들을 배열로 모음 (정면, 측면, 상세 순서)
  const imageMap = [
    { key: 'frontImagePath', label: '정면 이미지' },
    { key: 'sideImagePath', label: '측면 이미지' },
    { key: 'side2ImagePath', label: '측면 이미지02' },
    { key: 'side3ImagePath', label: '측면 이미지03' },
    { key: 'detailImagePath', label: '상세 이미지' },
  ];
  console.log('currentIndex:', currentIndex, 'totalSurveys:', totalSurveys);

  const productImages = [
    product.frontImagePath,
    product.sideImagePath,
    product.detailImagePath,
    product.side2ImagePath,
    product.side3ImagePath,
  ].filter(
    (imagePath): imagePath is string =>
      imagePath !== null && imagePath !== undefined
  );

  // 설문 문항 유형 결정 함수
  const getQuestionType = (surveyCode: string) => {
    const prefix = surveyCode.split('_').slice(0, 2).join('_');
    return PREFIX_TO_TYPE[prefix as keyof typeof PREFIX_TO_TYPE];
  };

  const idToIndexMap = useMemo(() => {
    const map: Record<number, number> = {};
    questions.forEach((q, i) => {
      map[q.surveyId ?? 0] = i + 1;
    });
    return map;
  }, [questions]);

  const groupedQuestions = useMemo(() => {
    return questions.reduce<Record<QuestionType, ProductSurveyQuestion[]>>(
      (acc, question) => {
        const type = getQuestionType(question?.surveyCode ?? '');

        if (!type) return acc;

        if (!acc[type]) acc[type] = [];
        acc[type].push(question);

        return acc;
      },
      {} as Record<QuestionType, ProductSurveyQuestion[]>
    );
  }, [questions]);

  // 배지 컴포넌트
  const SurveyStatusBadge = () => {
    const getBadgeStyle = () => {
      if (isSubmittedLocal && !isDirty) return 'bg-blue-400 text-white';
      if (lastSavedTime && !isDirty)
        return 'bg-white text-blue-500 border border-gray-200';
      return 'bg-white text-blue-500 border border-gray-200';
    };

    // 응답된 문항 수 계산
    const answeredCount =
      questions.filter((q) => {
        const key = String(q.surveyId);
        return (q.response && q.response > 0) || answers[key] !== undefined;
      }).length + (isQualitativeValid ? 1 : 0); // 정성평가 포함

    // 전체 문항 수 (정성평가 포함)
    const totalQuestions = questions.length + 1; // +1은 정성평가

    const getBadgeText = () => {
      if (isSubmittedLocal && !isDirty)
        return `${answeredCount}/${totalQuestions} 평가완료`;
      return `${answeredCount}/${totalQuestions} 평가중`;
    };

    const getSideMessage = () => {
      // 모두 답했지만 미제출
      if (isAllAnswered && isQualitativeValid && !isSubmittedLocal)
        return (
          <span className="text-right text-xs text-blue-400">
            평가 제출 버튼을 눌러
            <br />
            평가를 완료해주세요
          </span>
        );
      if (isDirty)
        return (
          <span className="text-right text-xs text-gray-400">
            변경사항이 있습니다.
            <br />
            임시저장 후 이동해주세요
          </span>
        );
      if (lastSavedTime && !isDirty)
        return (
          <span className="text-right text-xs text-gray-400">
            임시저장 완료 {lastSavedTime}
          </span>
        );
      return null;
    };

    return (
      <div className="flex items-center gap-3">
        {getSideMessage()}
        <div
          className={`lg:w-42 sm:w-35 flex items-center justify-center whitespace-nowrap rounded-xl px-4 py-3 text-sm font-medium ${getBadgeStyle()}`}
        >
          {getBadgeText()}
        </div>
      </div>
    );
  };

  return (
    <>
      <ConfirmModal
        show={modal.show}
        message={modal.message}
        type={modal.type}
        confirmLabel={modal.type === 'success' ? '다음으로' : '확인'}
        onConfirm={modal.onConfirm}
        cancelLabel="취소"
        onCancel={
          modal.type === 'warning' && modal.message.includes('삭제')
            ? hideModal
            : undefined
        }
      />
      <Toast
        message={submitErrorMessage}
        type="error"
        onClose={() => setSubmitErrorMessage(null)}
      />
      <Toast
        message={submitSuccessMessage}
        type="success"
        onClose={() => setSubmitSuccessMessage(null)}
      />
      <div className="mx-auto h-full px-8 py-6">
        <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-2">
          {/* 왼쪽 섹션 - 제품 정보 */}
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex-shrink-0 border-b border-gray-200 bg-blue-50 px-6 py-4">
              <h2 className="mb-1 text-lg font-semibold text-gray-800">
                제품 정보
              </h2>
              <p className="text-sm text-gray-600">브랜드 및 제품 상세 정보</p>
            </div>
            <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 flex-1 space-y-6 overflow-y-auto p-6">
              <ProductInfo type="industry" data={product} dataCode={dataCode} />

              {/* 제품 이미지들 */}
              {productImages.length > 0 && (
                <div className="space-y-4">
                  {imageMap.map(({ key, label }) => {
                    const imagePath = product[key as keyof typeof product];
                    if (!imagePath) return null;
                    return (
                      <ProductImage
                        key={key}
                        type="INDUSTRY"
                        imagePath={imagePath}
                        label={label}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* 오른쪽 섹션 - 설문지 */}
          <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
            <div className="flex flex-shrink-0 justify-between border-b border-gray-200 bg-blue-50 px-6 py-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  제품 평가 설문
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  제품 디자인에 대한 평가를 진행해주세요
                </p>
              </div>
              {/* 진행 상태 배지 */}

              <SurveyStatusBadge />
            </div>

            {/* 스크롤 가능한 설문 내용 영역 */}
            <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 flex-1 space-y-6 overflow-y-auto p-6 pb-8">
              <SurveyHeader type="industry" />

              <div className="space-y-8">
                <div className="flex flex-col gap-8">
                  {Object.entries(groupedQuestions).map(([type, group]) => (
                    <div key={type} className="flex flex-col gap-6">
                      <div className="font-bold">
                        <SurveyTypeHeader
                          type={'industry'}
                          category={type as QuestionType}
                        />
                      </div>
                      <div className="flex flex-col gap-8 bg-gray-50">
                        {group.map((question) => {
                          const qId = String(question.surveyId);
                          const qIndex =
                            idToIndexMap[question.surveyId ?? 0] ?? '?';
                          const qText = String(
                            question.survey ?? `문항 ${qId}`
                          );
                          const currentValue =
                            answers[qId] !== undefined
                              ? answers[qId]
                              : question.response && question.response > 0
                                ? question.response
                                : undefined;

                          return (
                            <SurveyQuestion
                              key={qId}
                              questionId={qId}
                              questionNumber={String(qIndex)}
                              question={qText}
                              value={currentValue}
                              onChange={(value) =>
                                handleAnswerChange(qId, value)
                              }
                              // onSave={handleQuantitativeSave}
                              // isSaving={savingQuestions.has(qId)}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 정성평가 섹션 */}
                <QualitativeEvaluation
                  value={qualitativeAnswer}
                  surveyId={surveyId}
                  onChange={handleQualitativeChange}
                  // onSave={handleQualitativeSave}
                  // isSaving={isSavingQualitative}
                />
              </div>
            </div>

            {/* 하단 고정 버튼 영역 */}
            <div className="inset-shadow-sm relative flex-shrink-0 border-t border-gray-100 bg-gray-50/80 px-6 py-4">
              <SurveyNavigationWithArrows
                onComplete={handleComplete}
                onTempSave={handleTempSave}
                canTempSave={isDirty}
                canComplete={isAllAnswered && isQualitativeValid}
                // isSubmitted={isSubmitted}
                isSubmitted={isSubmittedLocal}
                onPrevious={() => guardNavigation(goToPrevious)}
                onNext={() => guardNavigation(goToNext)}
                canGoPrevious={canGoPrevious}
                canGoNext={canGoNext}
                currentStep={currentIndex + 1}
                totalSteps={totalSurveys}
                isLoading={submitAllMutation.isPending}
                isTempSaving={saveAllMutation.isPending} // 임시저장 로딩
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
