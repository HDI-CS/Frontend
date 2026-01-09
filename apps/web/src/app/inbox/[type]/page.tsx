'use client';

import { Button } from '@/components/Button';
import SurveyCard from '@/components/SurveyCard';
import {
  SURVEY_STATUS_BUTTON_STYLES,
  SURVEY_STATUS_LABELS,
} from '@/constants/survey';
import { useMe } from '@/hooks/useMe';
import {
  useSurveyProducts,
  useWeightedScores,
} from '@/hooks/useSurveyProducts';
import { SurveyProductResponseStatus, SurveyResult } from '@/schemas/survey';
import { WeightedScoreResponse } from '@/schemas/weight-evaluation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function InboxPage() {
  const router = useRouter();
  const {
    data: userInfo,
    isLoading: isMeLoading,
    isFetching: isMeFetching,
    error: meError,
    refetch: refetchMe,
  } = useMe();
  const { userType, surveyDone } = userInfo?.result || {};
  const {
    data,
    isLoading,
    error,
    refetch,
    isFetching: isSurveyFetching,
  } = useSurveyProducts({
    type: userType,
  });
  const { data: weightedScoresData, isFetching: isWeightedScoresFetching } =
    useWeightedScores(userType ?? 'VISUAL');

  // 페이지 포커스 시 데이터 refetch
  useEffect(() => {
    const handleFocus = () => {
      if (userType) {
        refetch();
      }
      refetchMe();
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [refetch, refetchMe, userType]);

  // 페이지 진입 시 최신 사용자 정보 동기화
  useEffect(() => {
    refetchMe();
  }, [refetchMe]);

  // 모든 설문이 완료 상태인지 확인하는 로직
  const areAllSurveysCompleted = (() => {
    if (!data?.result || !Array.isArray(data.result)) return false;
    const surveys = data.result as SurveyResult[];
    return (
      surveys.length > 0 &&
      surveys.every((survey) => survey.responseStatus === 'DONE')
    );
  })();

  // 가중치 평가 수정 핸들러
  const handleEditWeightEvaluation = () => {
    router.push(`/weight-evaluation/${userType?.toLowerCase()}`);
  };

  // 사용자 정보 로딩 중
  if (isMeLoading) {
    return (
      <div className="space-y-6 p-8">
        {/* 페이지 헤더와 설문 진행 상황 섹션을 같은 줄에 배치 */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">설문함</h1>

          {/* 설문 진행 상황 및 전체 제출 섹션 - 사용자 정보 로딩 중 */}
          <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-6 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-gray-400">사용자 정보 로딩 중...</div>
            <div className="animate-pulse rounded-lg bg-gray-200 px-6 py-3">
              <div className="h-4 w-24 rounded bg-gray-300"></div>
            </div>
          </div>
        </div>

        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-gray-900"></div>
            <p className="text-gray-500">사용자 정보를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  // 사용자 정보 로딩 실패
  if (meError) {
    return (
      <div className="space-y-6 p-8">
        {/* 페이지 헤더와 설문 진행 상황 섹션을 같은 줄에 배치 */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">설문함</h1>

          {/* 설문 진행 상황 및 전체 제출 섹션 - 사용자 정보 로딩 실패 */}
          <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-6 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-gray-400">
              사용자 정보를 불러올 수 없습니다
            </div>
            <div className="text-sm text-red-500">오류 발생</div>
          </div>
        </div>

        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <p className="mb-2 text-red-500">
              사용자 정보를 불러올 수 없습니다.
            </p>
            <p className="text-sm text-gray-500">잠시 후 다시 시도해주세요.</p>
          </div>
        </div>
      </div>
    );
  }

  // 설문 데이터 로딩 중
  if (isLoading) {
    return (
      <div className="space-y-6 p-8">
        {/* 페이지 헤더와 설문 진행 상황 섹션을 같은 줄에 배치 */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">설문함</h1>

          {/* 설문 진행 상황 및 전체 제출 섹션 - 로딩 중 */}
          <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
              {/* 설문 개수 표시 스켈레톤 */}
              <div className="flex items-center gap-2 text-sm">
                <div className="animate-pulse">
                  <div className="h-4 w-20 rounded bg-gray-200"></div>
                </div>
                <span className="text-gray-400">•</span>
                <div className="animate-pulse">
                  <div className="h-4 w-16 rounded bg-gray-200"></div>
                </div>
              </div>
              {/* 진행률 표시 스켈레톤 */}
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 animate-pulse rounded-full bg-gray-200"></div>
                <div className="animate-pulse">
                  <div className="h-3 w-6 rounded bg-gray-200"></div>
                </div>
              </div>
            </div>
            {/* 전체 설문 제출 버튼 스켈레톤 */}
            <div className="animate-pulse rounded-lg bg-gray-200 px-6 py-3">
              <div className="h-4 w-24 rounded bg-gray-300"></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse rounded-lg border border-gray-200 bg-white p-4"
            >
              <div className="mb-3 h-4 w-8 rounded bg-gray-200"></div>
              <div className="mb-3 h-20 w-full rounded bg-gray-200"></div>
              <div className="mb-3 h-4 w-3/4 rounded bg-gray-200"></div>
              <div className="h-8 w-full rounded bg-gray-200"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 설문 데이터 로딩 실패
  if (error) {
    return (
      <div className="space-y-6 p-8">
        {/* 페이지 헤더와 설문 진행 상황 섹션을 같은 줄에 배치 */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">설문함</h1>

          {/* 설문 진행 상황 및 전체 제출 섹션 - 에러 상태 */}
          <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-6 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-gray-400">
              설문 정보를 불러올 수 없습니다
            </div>
            <div className="text-sm text-red-500">오류 발생</div>
          </div>
        </div>

        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <p className="mb-2 text-red-500">
              데이터를 불러오는 중 오류가 발생했습니다.
            </p>
            <p className="text-sm text-gray-500">잠시 후 다시 시도해주세요.</p>
          </div>
        </div>
      </div>
    );
  }

  // 설문 데이터가 없는 경우
  if (!data?.result || (data.result as SurveyResult[]).length === 0) {
    return (
      <div className="space-y-6 p-8">
        {/* 페이지 헤더와 설문 진행 상황 섹션을 같은 줄에 배치 */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">설문함</h1>

          {/* 설문 진행 상황 및 전체 제출 섹션 - 데이터가 없는 경우 */}
          <div className="flex flex-col gap-4 rounded-lg bg-gray-50 p-6 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>완료된 설문: 0개</span>
                <span>•</span>
                <span>전체 설문: 0개</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-24 rounded-full bg-gray-200">
                  <div className="h-full w-0 rounded-full bg-green-500"></div>
                </div>
                <span className="text-xs text-gray-500">0%</span>
              </div>
            </div>
            <div className="text-sm text-gray-400">
              설문이 할당되지 않았습니다
            </div>
          </div>
        </div>

        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <p className="mb-2 text-gray-500">할당된 설문이 없습니다.</p>
            <p className="text-sm text-gray-400">
              새로운 설문이 할당되면 여기에 표시됩니다.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 설문 개수 계산
  const surveys = data.result as SurveyResult[];
  const completedSurveysCount = surveys.filter(
    (survey) => survey.responseStatus === 'DONE'
  ).length;
  const totalSurveysCount = surveys.length;
  const weightEvaluationCategoriesByType: Record<
    string,
    Array<WeightedScoreResponse['category']>
  > = {
    INDUSTRY: ['VACUUM_CLEANER', 'AIR_PURIFIER', 'HAIR_DRYER'],
    VISUAL: ['COSMETIC', 'FB'],
  };
  const normalizedUserType = userType?.toUpperCase() ?? '';
  const requiredWeightCategories =
    weightEvaluationCategoriesByType[normalizedUserType] ?? [];
  const weightEvaluationData = (weightedScoresData?.result ??
    []) as WeightedScoreResponse[];
  const fallbackCategories = Array.from(
    new Set(weightEvaluationData.map((score) => score.category))
  );
  const categoriesToConsider =
    requiredWeightCategories.length > 0
      ? requiredWeightCategories
      : fallbackCategories;

  const categoryStatusMap = categoriesToConsider.reduce(
    (acc, category) => {
      acc[category] = 'NOT_STARTED';
      return acc;
    },
    {} as Record<string, SurveyProductResponseStatus>
  );

  weightEvaluationData.forEach((score) => {
    if (!categoriesToConsider.includes(score.category)) return;

    const total =
      score.score1 +
      score.score2 +
      score.score3 +
      score.score4 +
      score.score5 +
      score.score6 +
      score.score7 +
      score.score8;

    if (total === 0) {
      return;
    }

    if (total === 100) {
      categoryStatusMap[score.category] = 'DONE';
      return;
    }

    if (categoryStatusMap[score.category] !== 'DONE') {
      categoryStatusMap[score.category] = 'IN_PROGRESS';
    }
  });

  const categoryStatuses = Object.values(categoryStatusMap);
  const hasAnyWeightInput = categoryStatuses.some(
    (status) => status !== 'NOT_STARTED'
  );
  const isWeightEvaluationCompleted =
    categoryStatuses.length > 0 &&
    categoryStatuses.every((status) => status === 'DONE');
  const weightEvaluationStatus: SurveyProductResponseStatus =
    isWeightEvaluationCompleted
      ? 'DONE'
      : hasAnyWeightInput
        ? 'IN_PROGRESS'
        : 'NOT_STARTED';
  const showWeightEvaluationPending =
    surveyDone && weightEvaluationStatus !== 'DONE';
  const canAccessWeightEvaluation = areAllSurveysCompleted;
  const isStatusLoading =
    isMeFetching || isSurveyFetching || isWeightedScoresFetching;
  const headerStatus = (() => {
    if (surveyDone && weightEvaluationStatus === 'DONE') {
      return {
        wrapper: 'bg-green-50',
        dot: 'bg-green-500',
        textClass: 'text-green-700',
        label: '최종 제출 완료',
      };
    }

    if (showWeightEvaluationPending) {
      return {
        wrapper: 'bg-yellow-50',
        dot: 'bg-yellow-400',
        textClass: 'text-yellow-700',
        label: '가중치 평가 설문을 완료해주세요',
      };
    }

    if (areAllSurveysCompleted) {
      return {
        wrapper: 'bg-blue-100',
        dot: 'bg-blue-600',
        textClass: 'text-blue-700',
        label: '전체 설문 완료 - 가중치 평가를 진행해주세요',
      };
    }

    return {
      wrapper: 'bg-blue-100',
      dot: 'bg-blue-500',
      textClass: 'text-blue-700',
      label: '설문 진행 중',
    };
  })();

  return (
    <div className="space-y-6 p-8">
      {/* 페이지 헤더와 설문 진행 상황 섹션을 같은 줄에 배치 */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">설문함</h1>

        {/* 설문 진행 상황 및 전체 제출 섹션 */}
        <div className="flex flex-col gap-4 rounded-lg bg-gray-50 px-6 py-4 md:flex-row md:items-center md:justify-between">
          {/* 설문 개수 표시 */}
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <span className="text-gray-600">완료된 설문:</span>
                <span className="font-medium text-green-600">
                  {completedSurveysCount}개
                </span>
              </div>
              <span className="text-gray-400">•</span>
              <div className="flex items-center gap-1">
                <span className="text-gray-600">전체 설문:</span>
                <span className="font-medium text-gray-900">
                  {totalSurveysCount}개
                </span>
              </div>
            </div>
            {/* 진행률 표시 */}
            <div className="flex items-center gap-2">
              <div className="h-2 w-24 rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full bg-green-500 transition-all duration-300"
                  style={{
                    width: `${totalSurveysCount > 0 ? (completedSurveysCount / totalSurveysCount) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <span className="text-xs text-gray-500">
                {totalSurveysCount > 0
                  ? Math.round(
                      (completedSurveysCount / totalSurveysCount) * 100
                    )
                  : 0}
                %
              </span>
            </div>
          </div>

          {/* 전체 진행 상태 배지 */}
          {isStatusLoading ? (
            <div className="flex items-center gap-3 rounded-lg bg-gray-100 px-4 py-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-gray-300"></div>
              <span className="text-sm text-gray-500">
                상태를 갱신하는 중...
              </span>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-transparent"></div>
            </div>
          ) : (
            <div
              className={`flex items-center gap-2 rounded-lg px-4 py-2 ${headerStatus.wrapper}`}
            >
              <div className={`h-2 w-2 rounded-full ${headerStatus.dot}`}></div>
              <span className={`text-sm font-medium ${headerStatus.textClass}`}>
                {headerStatus.label}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* 그리드 뷰 */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
        {(data?.result as SurveyResult[]).map(
          (item: SurveyResult, index: number) => (
            <SurveyCard key={item.dataId} item={item} index={index} />
          )
        )}
        <div className="rounded-xl border border-gray-200 bg-white p-4 transition-shadow duration-300 ease-out hover:shadow-md">
          <span className="mb-3 block text-xs font-medium text-gray-500 sm:text-sm">
            {(totalSurveysCount + 1).toString().padStart(2, '0')}
          </span>
          <div className="relative mb-3 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded bg-gray-50">
            {canAccessWeightEvaluation ? (
              <span className="text-sm font-semibold text-gray-500">
                가중치 평가 설문
              </span>
            ) : (
              <span className="text-sm font-medium text-gray-500">
                다른 설문을 모두 완료하면 진행할 수 있어요.
              </span>
            )}
          </div>
          <span className="mb-4 mt-8 block text-center text-[13px] font-medium text-gray-900 sm:text-sm md:text-base">
            가중치 평가 설문
          </span>
          <Button
            text={
              canAccessWeightEvaluation
                ? SURVEY_STATUS_LABELS[weightEvaluationStatus]
                : '설문하러 가기'
            }
            onClick={handleEditWeightEvaluation}
            disabled={!canAccessWeightEvaluation}
            className={`w-full px-3 py-2.5 text-[13px] transition-colors md:py-2.5 md:text-sm ${
              canAccessWeightEvaluation
                ? SURVEY_STATUS_BUTTON_STYLES[weightEvaluationStatus]
                : 'pointer-events-none border border-gray-200 bg-gray-100 text-gray-400'
            }`}
            type="button"
          />
        </div>
      </div>
    </div>
  );
}
