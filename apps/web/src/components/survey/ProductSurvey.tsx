'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import ProductImage from '@/components/survey/ProductImage';
import ProductInfo from '@/components/survey/ProductInfo';
import QualitativeEvaluation from '@/components/survey/QualitativeEvaluation';
import SurveyHeader from '@/components/survey/SurveyHeader';
import SurveyNavigationWithArrows from '@/components/survey/SurveyNavigationWithArrows';
import SurveyQuestion from '@/components/survey/SurveyQuestion';
import { useSurveyNavigation } from '@/hooks/useSurveyNavigation';
import {
  useSaveSurveyResponse,
  useSubmitSurvey,
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

interface ProductSurveyProps {
  surveyId: string;
  detail: ProductSurveyDetailResponse;
}

export default function ProductSurvey({
  surveyId,
  detail,
}: ProductSurveyProps) {
  const router = useRouter();
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
  const [savingQuestions, setSavingQuestions] = useState<Set<string>>(
    new Set()
  );
  const [isSavingQualitative, setIsSavingQualitative] = useState(false);

  const product = detail.result.industryDataSetResponse;
  const questions: ProductSurveyQuestion[] =
    detail.result.productSurveyResponse?.response ?? [];
  const textSurveyId =
    detail.result.productSurveyResponse.textResponse?.surveyId;

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

    // 정성평가 응답도 서버 데이터에서 초기화
    if (saved?.qualitativeAnswer && saved?.qualitativeAnswer.length < 300) {
      setQualitativeAnswer(saved.qualitativeAnswer);
    } else if (detail.result.productSurveyResponse?.textResponse?.response) {
      setQualitativeAnswer(
        detail.result.productSurveyResponse.textResponse.response
      );
    }
  }, [detail, surveyId]);

  // 설문 응답 저장 mutation
  const saveSurveyResponseMutation = useSaveSurveyResponse();

  // 설문 제출 mutation
  const submitSurveyMutation = useSubmitSurvey();

  // 정량평가 저장 핸들러
  const handleQuantitativeSave = async (questionId: string, value: number) => {
    setSavingQuestions((prev) => new Set(prev).add(questionId));

    try {
      await saveSurveyResponseMutation.mutateAsync({
        type: surveyType,
        productResponseId: Number(surveyId),
        requestData: {
          surveyId: Number(questionId),
          response: value,
          textResponse: null,
        },
      });
    } catch (error) {
      console.error('정량평가 저장 실패:', error);
    } finally {
      setSavingQuestions((prev) => {
        const newSet = new Set(prev);
        newSet.delete(questionId);
        return newSet;
      });
    }
  };

  // 정성평가 저장 핸들러
  const handleQualitativeSave = async (textResponse: string) => {
    if (textResponse.length < 300) {
      return;
    }
    setIsSavingQualitative(true);

    try {
      await saveSurveyResponseMutation.mutateAsync({
        type: surveyType,
        productResponseId: Number(surveyId),
        requestData: {
          surveyId: textSurveyId ?? 1,
          response: null,
          textResponse,
        },
      });
      // 제출 완료 후 로컬스토리지 draft 정리
      clearSurveyProgress(surveyId);
    } catch (error) {
      console.error('정성평가 저장 실패:', error);
    } finally {
      setIsSavingQualitative(false);
    }
  };

  const handleAnswerChange = (questionId: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));

    // 로컬 스토리지에도 저장 (백업용)
    saveSurveyProgress(surveyId, {
      questionsAnswered: { ...answers, [questionId]: value },
      qualitativeAnswer,
    });
  };

  const handleQualitativeChange = (value: string) => {
    setQualitativeAnswer(value);

    // 로컬 스토리지에도 저장 (백업용)
    saveSurveyProgress(surveyId, {
      questionsAnswered: answers,
      qualitativeAnswer: value,
    });
  };

  const handleComplete = async () => {
    console.log('제품 설문 평가완료:', { answers, qualitativeAnswer });

    try {
      // 설문 제출 API 호출
      await submitSurveyMutation.mutateAsync({
        type: surveyType,
        responseId: Number(surveyId),
      });

      // 설문 진행 상태 저장
      if (surveyId) {
        saveSurveyProgress(surveyId, {
          questionsAnswered: answers,
          qualitativeAnswer,
        });
      }

      // 설문함 페이지로 돌아가기
      router.push(`/inbox/${surveyType.toLowerCase()}`);
    } catch (error) {
      console.error('설문 제출 실패:', error);
      // 에러 처리 로직 추가 가능
    }
  };

  const isAllAnswered = questions.every((q) => {
    const key = String(q.surveyId);
    return (q.response && q.response > 0) || answers[key] !== undefined;
  });

  // 정성평가 유효성 검사
  const currentQualitativeValue =
    detail.result.productSurveyResponse?.textResponse?.response ||
    qualitativeAnswer;
  const isQualitativeValid = currentQualitativeValue.length >= 300;

  // 제품 이미지들을 배열로 모음 (정면, 측면, 상세 순서)
  const productImages = [
    product.frontImagePath,
    product.sideImagePath,
    product.detailImagePath,
  ].filter(
    (imagePath): imagePath is string =>
      imagePath !== null && imagePath !== undefined
  );

  return (
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
            <ProductInfo type="industry" data={product} />

            {/* 제품 이미지들 */}
            {productImages.length > 0 && (
              <div className="space-y-4">
                {productImages.map((imagePath, index) => {
                  const labels = ['정면 이미지', '측면 이미지', '상세 이미지'];
                  return (
                    <ProductImage
                      key={`product-image-${index}`}
                      imagePath={imagePath}
                      label={labels[index]}
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* 오른쪽 섹션 - 설문지 */}
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="flex-shrink-0 border-b border-gray-200 bg-blue-50 px-6 py-4">
            <h2 className="text-lg font-semibold text-gray-800">
              제품 평가 설문
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              제품 디자인에 대한 평가를 진행해주세요
            </p>
          </div>

          {/* 스크롤 가능한 설문 내용 영역 */}
          <div className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 hover:scrollbar-thumb-gray-400 flex-1 space-y-6 overflow-y-auto p-6 pb-8">
            <SurveyHeader type="industry" />

            <div className="space-y-8">
              {questions.map((question, index) => {
                const qId = String(question.surveyId);
                const qIndex = String(index + 1);
                const qText = String(question.survey ?? `문항 ${qId}`);
                const currentValue =
                  question.response && question.response > 0
                    ? question.response
                    : answers[qId];

                return (
                  <SurveyQuestion
                    key={qId}
                    questionId={qId}
                    questionNumber={qIndex}
                    question={qText}
                    value={currentValue}
                    onChange={(value) => handleAnswerChange(qId, value)}
                    onSave={handleQuantitativeSave}
                    isSaving={savingQuestions.has(qId)}
                  />
                );
              })}

              {/* 정성평가 섹션 */}
              <QualitativeEvaluation
                value={qualitativeAnswer}
                surveyId={surveyId}
                onChange={handleQualitativeChange}
                onSave={handleQualitativeSave}
                isSaving={isSavingQualitative}
              />
            </div>
          </div>

          {/* 하단 고정 버튼 영역 */}
          <div className="inset-shadow-sm flex-shrink-0 border-t border-gray-100 bg-gray-50/80 px-6 py-4">
            <SurveyNavigationWithArrows
              onComplete={handleComplete}
              canComplete={isAllAnswered && isQualitativeValid}
              onPrevious={goToPrevious}
              onNext={goToNext}
              canGoPrevious={canGoPrevious}
              canGoNext={canGoNext}
              currentStep={currentIndex + 1}
              totalSteps={totalSurveys}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
