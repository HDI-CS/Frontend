'use client';

import { useParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import ProductImage from '@/components/survey/ProductImage';
import ProductInfo from '@/components/survey/ProductInfo';
import QualitativeEvaluation from '@/components/survey/QualitativeEvaluation';
import SurveyHeader from '@/components/survey/SurveyHeader';
import SurveyNavigationWithArrows from '@/components/survey/SurveyNavigationWithArrows';
import SurveyQuestion from '@/components/survey/SurveyQuestion';
import { SURVEY_INFO_CONFIG } from '@/config/productInfoConfig';
import { PREFIX_TO_TYPE, QuestionType } from '@/config/surveyTypeMap';
import { useDirtyGuard } from '@/hooks/useDirtyGuard';
import { useSurveyNavigation } from '@/hooks/useSurveyNavigation';
import {
  useSaveAllSurveyResponses,
  useSubmitAllSurveyResponses,
} from '@/hooks/useSurveyProducts';
import { UserType } from '@/schemas/auth';
import {
  ProductSurveyQuestion,
  type BrandSurveyDetailResponse,
  type BrandSurveyQuestion,
} from '@/schemas/survey';
import { VisualCategory } from '@/schemas/weight-evaluation';
import {
  clearSurveyProgress,
  loadSurveyProgress,
  saveSurveyProgress,
} from '@/utils/survey';
import axios from 'axios';
import SurveyTypeHeader from './SurveyTypeHeader';

interface BrandSurveyProps {
  surveyId: string;
  detail: BrandSurveyDetailResponse;
  dataCode: string;
}

export default function BrandSurvey({
  surveyId,
  detail,
  dataCode,
}: BrandSurveyProps) {
  const { type } = useParams();
  const surveyType = (type as string).toUpperCase() as UserType;

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
  const [isSubmittedLocal, setIsSubmittedLocal] = useState(
    detail.result.brandSurveyResponse.isSubmitted
  );
  // 설문 제출 실패시 사용
  const [submitErrorMessage, setSubmitErrorMessage] = useState<string | null>(
    null
  );

  const [submitSuccessMessage, setSubmitSuccessMessage] = useState<
    string | null
  >(null);

  const saveAllMutation = useSaveAllSurveyResponses();
  const submitAllMutation = useSubmitAllSurveyResponses();

  const { isDirty, guardNavigation, setInitialValues, syncInitialValues } =
    useDirtyGuard({ answers, qualitativeAnswer, isSubmittedLocal });

  const brand = detail.result.visualDatasetResponse;
  const questions: BrandSurveyQuestion[] = useMemo(() => {
    return detail.result.brandSurveyResponse?.response ?? [];
  }, [detail]);

  const textSurveyId = detail.result.brandSurveyResponse.textResponse.surveyId;

  // 서버에서 받아온 데이터를 클라이언트 상태에 반영
  useEffect(() => {
    if (!detail.result.brandSurveyResponse?.response) return;
    const saved = loadSurveyProgress(surveyId);

    const serverAnswers: Record<string, number> = {};

    detail.result.brandSurveyResponse.response.forEach((question) => {
      if (question.response && question.response > 0 && question.surveyId) {
        serverAnswers[String(question.surveyId)] = question.response;
      }
    });

    setAnswers(serverAnswers);

    const serverQualitative =
      detail.result.brandSurveyResponse?.textResponse?.response ?? '';
    // 정성평가 응답도 서버 데이터에서 초기화
    // 300자 이하인 경우는 브라우저 우선
    if (saved?.qualitativeAnswer && saved.qualitativeAnswer.length < 300) {
      setQualitativeAnswer(saved.qualitativeAnswer);
    } else {
      setQualitativeAnswer(serverQualitative);
    }
    setInitialValues(serverAnswers, serverQualitative);
  }, [detail, surveyId, setInitialValues]);

  // buildAllResponses
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
            textResponse: qualitativeAnswer,
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

  // handleTempSave
  const handleTempSave = async () => {
    try {
      await saveAllMutation.mutateAsync({
        type: surveyType,
        dataId: Number(surveyId),
        requestData: buildAllResponses(),
      });
      syncInitialValues(answers, qualitativeAnswer);
      showSuccessMessage('임시저장되었습니다.');
    } catch {
      showTemporaryMessage('ERROR: 임시저장 중 오류가 발생했습니다.');
    }
  };

  // handleComplete (기존 대체)
  const handleComplete = async () => {
    try {
      await submitAllMutation.mutateAsync({
        type: surveyType,
        dataId: Number(surveyId),
        requestData: buildAllResponses(),
      });
      syncInitialValues(answers, qualitativeAnswer);
      setIsSubmittedLocal(true);
      clearSurveyProgress(surveyId);
      showSuccessMessage('평가가 성공적으로 제출되었습니다.');
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;
        if (status === 400) {
          showTemporaryMessage('ERROR: 아직 모든 문항에 응답하지 않았습니다.');
          return;
        }
        if (status === 409) {
          showTemporaryMessage(message ?? '이미 처리된 요청입니다.');
          return;
        }
      }
      showTemporaryMessage('ERROR: 설문 제출 중 오류가 발생했습니다.');
    }
  };

  // 정량평가 저장 핸들러
  // const handleQuantitativeSave = async (questionId: string, value: number) => {
  //   setSavingQuestions((prev) => new Set(prev).add(questionId));

  //   try {
  //     await saveSurveyResponseMutation.mutateAsync({
  //       type: surveyType,
  //       productResponseId: Number(surveyId), // API는 여전히 productResponseId 필드를 사용
  //       requestData: {
  //         surveyId: Number(questionId),
  //         response: value,
  //         textResponse: null,
  //       },
  //     });
  //   } catch (error) {
  //     console.error('정량평가 저장 실패:', error);
  //   } finally {
  //     setSavingQuestions((prev) => {
  //       const newSet = new Set(prev);
  //       newSet.delete(questionId);
  //       return newSet;
  //     });
  //   }
  // };

  // 정성평가 저장 핸들러
  // 수정:  300자 미만도 저장이 되도록, 대신 평가 완료 제출은 되지 않음

  // const handleQualitativeSave = async (textResponse: string) => {
  //   // if (textResponse.length < 300) {
  //   //   return;
  //   // }

  //   setIsSavingQualitative(true);

  //   try {
  //     await saveSurveyResponseMutation.mutateAsync({
  //       type: surveyType,
  //       productResponseId: Number(surveyId), // API는 여전히 productResponseId 필드를 사용
  //       requestData: {
  //         surveyId: textSurveyId,
  //         response: null,
  //         textResponse,
  //       },
  //     });

  //     // 제출 완료 후 로컬스토리지 draft 정리
  //     clearSurveyProgress(surveyId);
  //   } catch (error) {
  //     console.error('정성평가 저장 실패:', error);
  //   } finally {
  //     setIsSavingQualitative(false);
  //   }
  // };

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    if (isSubmittedLocal) setIsSubmittedLocal(false);

    // 로컬 스토리지에도 저장 (백업용)
    saveSurveyProgress(surveyId, {
      questionsAnswered: { ...answers, [questionId]: value },
      qualitativeAnswer,
    });
  };

  const handleQualitativeChange = (value: string) => {
    setQualitativeAnswer(value);
    if (isSubmittedLocal) setIsSubmittedLocal(false);
    // 로컬 스토리지에도 저장 (백업용)
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
  // detail.result.brandSurveyResponse?.textResponse?.response ||
  // qualitativeAnswer;
  const isQualitativeValid = qualitativeAnswer.length >= 300;

  const category = brand?.visualDataCategory;
  const visualCategory = category as VisualCategory;

  const surveyInfo = SURVEY_INFO_CONFIG.visual[visualCategory] ?? null;

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
    return questions.reduce<Record<QuestionType, BrandSurveyQuestion[]>>(
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

  return (
    <div className="mx-auto h-full px-8 py-6">
      <div className="grid h-full grid-cols-1 gap-6 lg:grid-cols-2">
        {/* 왼쪽 섹션 - 로고 정보 */}
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="flex-shrink-0 border-b border-gray-200 bg-blue-50 px-6 py-4">
            <h2 className="mb-1 text-lg font-semibold text-gray-800">
              {surveyInfo?.title || '로고 정보'}
            </h2>
            <p className="text-sm text-gray-600">
              {surveyInfo?.subTitle || '로고 상세 정보'}
            </p>
          </div>
          <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 flex-1 space-y-6 overflow-y-auto p-6">
            <ProductInfo type="visual" data={brand!} dataCode={dataCode} />

            {/* 브랜드 이미지 */}
            {brand?.image && (
              <div className="space-y-4">
                <ProductImage
                  imagePath={brand?.image}
                  type="VISUAL"
                  label="로고 이미지"
                />
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽 섹션 - 설문지 */}
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="flex-shrink-0 border-b border-gray-200 bg-blue-50 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800">
              {surveyInfo?.surveyTitle || '로고 평가 설문'}
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              {surveyInfo?.surveyDescription ||
                '로고 디자인에 대한 평가를 진행해주세요'}
            </p>
          </div>

          {/* 스크롤 가능한 설문 내용 영역 */}
          <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 flex-1 space-y-6 overflow-y-auto p-6 pb-8">
            <SurveyHeader type="visual" />

            <div className="space-y-8">
              <div className="flex flex-col gap-8">
                {Object.entries(groupedQuestions).map(([type, group]) => (
                  <div key={type} className="flex flex-col gap-6">
                    <div className="font-bold">
                      <SurveyTypeHeader
                        type={'visual'}
                        category={type as QuestionType}
                      />
                    </div>
                    <div className="flex flex-col gap-8 bg-gray-50">
                      {group.map((question) => {
                        const qId = String(question.surveyId);
                        const qIndex =
                          idToIndexMap[question.surveyId ?? 0] ?? '?';

                        // 문항 번호는 surveyId가 있을 때만 표시
                        const qText = String(question.survey ?? `문항 ${qId}`);
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
                            onChange={(value) => handleAnswerChange(qId, value)}
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
                surveyId={surveyId}
                value={qualitativeAnswer}
                onChange={handleQualitativeChange}
                // onSave={handleQualitativeSave}
                // isSaving={isSavingQualitative}
              />
            </div>
          </div>

          {/* 하단 고정 버튼 영역 */}
          <div className="inset-shadow-sm relative flex-shrink-0 border-t border-gray-100 bg-gray-50/80 px-6 py-4">
            {submitErrorMessage && (
              <div className="absolute bottom-20 right-5 rounded-md border border-red-500 bg-red-50 px-10 py-6 text-sm font-bold text-red-500 shadow-md">
                {submitErrorMessage}
              </div>
            )}
            {submitSuccessMessage && (
              <div className="absolute bottom-20 right-5 rounded-md border border-green-500 bg-green-50 px-10 py-6 text-sm font-bold text-green-500 shadow-md">
                {submitSuccessMessage}
              </div>
            )}
            <SurveyNavigationWithArrows
              onComplete={handleComplete}
              canComplete={isAllAnswered && isQualitativeValid}
              onTempSave={handleTempSave}
              canTempSave={isDirty}
              isSubmitted={isSubmittedLocal}
              onPrevious={() => guardNavigation(goToPrevious)}
              onNext={() => guardNavigation(goToNext)}
              canGoPrevious={canGoPrevious}
              canGoNext={canGoNext}
              currentStep={currentIndex + 1}
              totalSteps={totalSurveys}
              isLoading={submitAllMutation.isPending}
              isTempSaving={saveAllMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
