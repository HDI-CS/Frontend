'use client';

import { useParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import WeightEvaluationHeader from '@/components/weight-evaluation/WeightEvaluationHeader';
import WeightEvaluationNavigation from '@/components/weight-evaluation/WeightEvaluationNavigation';
import WeightEvaluationSuccess from '@/components/weight-evaluation/WeightEvaluationSuccess';
import WeightEvaluationTable from '@/components/weight-evaluation/WeightEvaluationTable';

import {
  useSubmitWeightedScores,
  useWeightedScores,
} from '@/hooks/useSurveyProducts';
import { UserType } from '@/schemas/auth';
import {
  type WeightedScoreResponse,
  WeightEvaluationCategoryType as ApiCategory,
} from '@/schemas/weight-evaluation';
import { clearSurveyProgressStorage } from '@/utils/survey';

// 타입별 가중치 평가 요소들 정의
const getWeightEvaluationFactors = (type: 'visual' | 'industry') => {
  const baseFactors = [
    {
      id: 'aesthetics',
      name: '심미성',
      description:
        type === 'visual'
          ? '로고 디자인이 주는 시각적 아름다움과 감성적 만족감에 대한 정도'
          : 'CMF(Color, Material, Finish)의 우수성, 제품 디자인이 주는 감성적 인상(고급스러움, 세련됨 등)',
    },
    {
      id: 'formative',
      name: '조형성',
      description:
        type === 'visual'
          ? '로고 디자인이 시각적으로 얼마나 균형있고 조화롭게 느끼는지에 대한 객관·주관적 평가'
          : '형태 문법의 우수성(부피감, 비례, 균형, 리듬, 선·면의 연속성, 실루엣, 부품 분할/조립선 배치, 디테일 해결 등)',
    },
    {
      id: 'originality',
      name: '독창성',
      description:
        type === 'visual'
          ? '로고가 브랜드의 고유성을 효과적으로 드러내고 모방 가능성을 최소화하면서도 새로운 미적·상징적 가치를 제시하는 정도'
          : '고유성을 표현하려는 창의적 시도로 소비자가 기존 제품과의 차별화를 바탕으로 새로움을 인지할 수 있는 정도',
    },
    {
      id: 'usability',
      name: '사용성',
      description:
        type === 'visual'
          ? '로고가 다양한 매체·환경에서 문제없이 변형 및 적용할 수 있는 정도'
          : '사용자가 의도된 사용 맥락에서 원하는 목표를 효과적, 효율적, 편리하게 달성할 수 있는 정도',
    },
    {
      id: 'functionality',
      name: '기능성',
      description:
        type === 'visual'
          ? '사용자가 로고를 직관적으로 이해하고 인식하며, 혼란 없이 받아들일 수 있는 정도'
          : '제품의 디자인이나 전체 시스템/기능이 목적에 맞게 완전성(completeness), 정확성(accuracy), 적절성(suitability)을 제공하는 정도',
    },
    {
      id: 'ethics',
      name: '윤리성',
      description:
        type === 'visual'
          ? '디자인이 사회·문화적 책임을 통합적으로 고려하며, 준법에 위배되지 않는 정도'
          : '사용자, 사회, 자연 간의 상호의존적 관계에서 올바르고 책임감 있는 행동 원칙을 바탕으로 지속가능한 발전을 이루는 정도',
    },
    {
      id: 'economy',
      name: '경제성',
      description:
        type === 'visual'
          ? '로고가 최소한의 색상·공정으로 제작 비용을 절감하면서도 추가 수정 없이 다양한 매체·크기·환경에 재사용·확장되어 운용 비용을 낮출 수 있는 정도'
          : '제품이 제조, 조립, 생애주기 전반에 걸쳐 전체 비용을 최소화하면서도 목표 성능과 품질을 유지하도록 설계된 정도',
    },
    {
      id: 'purpose',
      name: '목적성',
      description:
        type === 'visual'
          ? '브랜드 로고 또는 시각 시스템이 그 브랜드의 정체성, 가치, 사명, 혹은 의도된 메시지를 명확하고 의미 있게 전달한다고 인식하는 정도'
          : "사용자의 명시적, 암시적 목적과 요구사항을 만족시키기 위해 필요한 기능, 가치, 의도가 정확하게 제공되어 사용자가 의도한 '작업'을 달성할 수 있게 하는 정도",
    },
  ];

  return baseFactors;
};

// 타입별 카테고리 데이터 정의
const getWeightEvaluationCategories = (
  type: 'visual' | 'industry'
): Array<{
  id: string;
  name: string;
  weights: Record<string, number>;
  responseId?: number;
}> => {
  const categoryMap: Record<
    string,
    Array<{
      id: string;
      name: string;
      weights: Record<string, number>;
      responseId?: number;
    }>
  > = {
    visual: [
      {
        id: 'cosmetics',
        name: '코스메틱',
        weights: {
          aesthetics: 0,
          formative: 0,
          originality: 0,
          usability: 0,
          functionality: 0,
          ethics: 0,
          economy: 0,
          purpose: 0,
        },
      },
      {
        id: 'fnb',
        name: 'F&B',
        weights: {
          aesthetics: 0,
          formative: 0,
          originality: 0,
          usability: 0,
          functionality: 0,
          ethics: 0,
          economy: 0,
          purpose: 0,
        },
      },
    ],
    industry: [
      {
        id: 'vacuum',
        name: '핸디스틱청소기',
        weights: {
          aesthetics: 0,
          formative: 0,
          originality: 0,
          usability: 0,
          functionality: 0,
          ethics: 0,
          economy: 0,
          purpose: 0,
        },
      },
      {
        id: 'airpurifier',
        name: '공기청정기/가습기',
        weights: {
          aesthetics: 0,
          formative: 0,
          originality: 0,
          usability: 0,
          functionality: 0,
          ethics: 0,
          economy: 0,
          purpose: 0,
        },
      },
      {
        id: 'hairdryer',
        name: '헤어드라이기',
        weights: {
          aesthetics: 0,
          formative: 0,
          originality: 0,
          usability: 0,
          functionality: 0,
          ethics: 0,
          economy: 0,
          purpose: 0,
        },
      },
    ],
  };

  return categoryMap[type] ?? categoryMap.brand!;
};

// 카테고리 ID를 API 카테고리로 매핑하는 함수
const mapCategoryToApiCategory = (categoryId: string): ApiCategory => {
  console.log(categoryId);
  const categoryMap: Record<string, ApiCategory> = {
    cosmetics: 'COSMETIC',
    fnb: 'FB',
    vacuum: 'VACUUM_CLEANER',
    airpurifier: 'AIR_PURIFIER',
    hairdryer: 'HAIR_DRYER',
  };

  return categoryMap[categoryId] || 'COSMETIC';
};

// API 카테고리를 카테고리 ID로 역매핑하는 함수
const mapApiCategoryToCategoryId = (apiCategory: ApiCategory): string => {
  const categoryMap: Record<ApiCategory, string> = {
    COSMETIC: 'cosmetics',
    FB: 'fnb',
    VACUUM_CLEANER: 'vacuum',
    AIR_PURIFIER: 'airpurifier',
    HAIR_DRYER: 'hairdryer',
  };

  return categoryMap[apiCategory] || 'cosmetics';
};

// API 응답 데이터를 페이지 형식으로 변환하는 함수
const transformApiDataToCategories = (
  apiData: WeightedScoreResponse[],
  evaluationType: 'visual' | 'industry'
) => {
  const initialCategories = getWeightEvaluationCategories(evaluationType);

  // API 데이터가 없으면 초기 카테고리 반환
  if (!apiData || apiData.length === 0) {
    return initialCategories;
  }
  // API 데이터를 카테고리 형식으로 변환
  // ( 수정 : 배열 요청 -> 배열이 아닌 카테고리 별로 별도의 객체 API 요청 )
  const categoriesMap = new Map(
    initialCategories.map((cat) => [
      cat.id,
      { ...cat, responseId: undefined as number | undefined },
    ])
  );

  apiData.forEach((scoreData) => {
    const categoryId = mapApiCategoryToCategoryId(scoreData.category);
    const category = categoriesMap.get(categoryId);

    if (category) {
      const factorKeys = Object.keys(category.weights);

      // 타입 안전성을 위해 각 키의 존재를 확인하며 할당
      if (factorKeys.length >= 8) {
        category.weights = {
          [factorKeys[0]!]: scoreData.score1,
          [factorKeys[1]!]: scoreData.score2,
          [factorKeys[2]!]: scoreData.score3,
          [factorKeys[3]!]: scoreData.score4,
          [factorKeys[4]!]: scoreData.score5,
          [factorKeys[5]!]: scoreData.score6,
          [factorKeys[6]!]: scoreData.score7,
          [factorKeys[7]!]: scoreData.score8,
        };
        // API 응답의 id를 responseId로 저장
        category.responseId = scoreData.id;
      }
    }
  });

  return Array.from(categoriesMap.values());
};

// 가중치 데이터를 API 형식으로 변환하는 함수
const transformWeightsToApiFormat = (
  categories: Array<{
    id: string;
    name: string;
    weights: Record<string, number>;
    responseId?: number;
  }>
) => {
  return categories.map((category) => {
    const apiCategory = mapCategoryToApiCategory(category.id);
    const weights = Object.values(category.weights);

    return {
      id: category.responseId ?? null, // 기존 데이터면 responseId, 신규면 null
      category: apiCategory,
      score1: weights[0] || 0,
      score2: weights[1] || 0,
      score3: weights[2] || 0,
      score4: weights[3] || 0,
      score5: weights[4] || 0,
      score6: weights[5] || 0,
      score7: weights[6] || 0,
      score8: weights[7] || 0,
    };
  });
};

export default function WeightEvaluationPage() {
  const { type } = useParams();
  const evaluationType = type as 'visual' | 'industry';

  // 타입에 따른 데이터 가져오기
  const weightEvaluationFactors = getWeightEvaluationFactors(
    type as 'visual' | 'industry'
  );
  const initialCategories = getWeightEvaluationCategories(
    type as 'visual' | 'industry'
  );

  const [categories, setCategories] = useState<
    Array<{
      id: string;
      name: string;
      weights: Record<string, number>;
      responseId?: number;
    }>
  >(initialCategories || []);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});
  const [isCompleted, setIsCompleted] = useState(false);

  // Query hook으로 가중치 데이터 조회
  const { data: weightedScoresData, isLoading: isLoadingWeightedScores } =
    useWeightedScores(evaluationType.toUpperCase() as UserType);

  // Mutation hook 사용
  const submitWeightedScoresMutation = useSubmitWeightedScores(
    evaluationType.toUpperCase() as UserType
  );

  // 정성 평가 로컬스토리지 응답 데이터 제거
  useEffect(() => {
    clearSurveyProgressStorage();
  }, []);

  // 가중치 데이터를 불러와서 초기화
  useEffect(() => {
    if (weightedScoresData?.result) {
      const transformedCategories = transformApiDataToCategories(
        weightedScoresData.result,
        evaluationType
      );
      if (transformedCategories) {
        setCategories(transformedCategories);
      }
    }
  }, [weightedScoresData, evaluationType]);

  // 가중치 변경 핸들러 - useCallback으로 최적화
  const handleWeightChange = useCallback(
    (categoryId: string, factorId: string, value: number) => {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === categoryId
            ? {
                ...category,
                weights: { ...category.weights, [factorId]: value },
              }
            : category
        )
      );

      // 해당 카테고리의 검증 오류 제거
      setValidationErrors((prev) => {
        if (prev[categoryId]) {
          const newErrors = { ...prev };
          delete newErrors[categoryId];
          return newErrors;
        }
        return prev;
      });
    },
    []
  );

  // 가중치 검증 함수 - useCallback으로 최적화
  const validateWeights = useCallback(
    (category: {
      id: string;
      name: string;
      weights: Record<string, number>;
    }): boolean => {
      const total = Object.values(category.weights).reduce(
        (sum, weight) => sum + weight,
        0
      );
      return total === 100;
    },
    []
  );

  // 모든 카테고리가 유효한지 확인하는 메모이제이션된 값
  const isAllValid = useMemo(
    () => categories.every((category) => validateWeights(category)),
    [categories, validateWeights]
  );

  // 완료 핸들러 - useCallback으로 최적화
  const handleComplete = useCallback(async () => {
    if (isAllValid) {
      try {
        // API 형식으로 데이터 변환
        // (기존) 배열 형태 요청
        const apiDatas = transformWeightsToApiFormat(categories);

        // (수정) 개별로 요청
        for (const apiData of apiDatas) {
          await submitWeightedScoresMutation.mutateAsync(apiData);
        }
        //
        // API 호출

        console.log('가중치 평가 API 제출 완료:', apiDatas);

        // 성공 상태로 이동
        setIsCompleted(true);
      } catch (error) {
        console.error('가중치 평가 제출 실패:', error);
        // 에러 처리 - 사용자에게 알림 등
        alert('가중치 평가 제출에 실패했습니다. 다시 시도해주세요.');
      }
    }
  }, [categories, submitWeightedScoresMutation, isAllValid]);

  // 타입이 유효하지 않은 경우 처리
  if (!evaluationType || !['visual', 'industry'].includes(evaluationType)) {
    return (
      <div className="mx-auto h-full px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <div className="flex h-full flex-col items-center justify-center space-y-6 px-8 py-12">
            <div className="space-y-4 text-center">
              <h1 className="text-2xl font-bold text-gray-800">잘못된 접근</h1>
              <p className="text-lg text-gray-600">
                평가 타입이 올바르지 않습니다.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 로딩 중일 때
  if (isLoadingWeightedScores) {
    const skeletonFactors = Array(8).fill(null);
    const skeletonCategories =
      evaluationType === 'visual' ? Array(2).fill(null) : Array(3).fill(null);

    return (
      <div className="mx-auto h-full px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          {/* 헤더 스켈레톤 */}
          <div className="flex-shrink-0 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 px-6 py-4">
            <div className="h-6 w-64 animate-pulse rounded bg-gray-200"></div>
            <div className="mt-2 h-4 w-96 animate-pulse rounded bg-gray-200"></div>

            {/* 상태 색상 가이드 스켈레톤 */}
            <div className="mt-3 flex items-center gap-4">
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
              <div className="h-4 w-32 animate-pulse rounded bg-gray-200"></div>
            </div>
          </div>

          {/* 메인 콘텐츠 스켈레톤 */}
          <div className="flex-1 overflow-hidden p-4 sm:p-6">
            <div className="flex h-full flex-col space-y-4">
              {/* 가이드 텍스트 스켈레톤 */}
              <div className="flex-shrink-0 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex items-start space-x-3">
                  <div className="h-5 w-5 animate-pulse rounded-full bg-blue-200"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-32 animate-pulse rounded bg-blue-200"></div>
                    <div className="h-3 w-full animate-pulse rounded bg-blue-200"></div>
                  </div>
                </div>
              </div>

              {/* 평가요인 설명 스켈레톤 */}
              <div className="flex-shrink-0 space-y-3">
                <div className="h-5 w-32 animate-pulse rounded bg-gray-200"></div>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {skeletonFactors.map((_, index) => (
                    <div
                      key={index}
                      className="rounded-lg border border-gray-200 bg-gray-50 p-3"
                    >
                      <div className="h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                      <div className="mt-2 space-y-1">
                        <div className="h-3 w-full animate-pulse rounded bg-gray-200"></div>
                        <div className="h-3 w-full animate-pulse rounded bg-gray-200"></div>
                        <div className="h-3 w-3/4 animate-pulse rounded bg-gray-200"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 가중치 입력 테이블 스켈레톤 */}
              <div className="flex-1 overflow-hidden">
                <div className="h-full overflow-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead className="sticky top-0 z-10 bg-gray-100">
                      <tr>
                        <th className="border border-gray-300 px-2 py-2">
                          <div className="h-4 w-20 animate-pulse rounded bg-gray-200"></div>
                        </th>
                        {skeletonFactors.map((_, index) => (
                          <th
                            key={index}
                            className="border border-gray-300 px-1 py-2"
                          >
                            <div className="mx-auto h-3 w-12 animate-pulse rounded bg-gray-200"></div>
                          </th>
                        ))}
                        <th className="border border-gray-300 px-2 py-2">
                          <div className="mx-auto h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {skeletonCategories.map((_, rowIndex) => (
                        <tr key={rowIndex}>
                          <td className="border border-gray-300 px-2 py-2">
                            <div className="h-4 w-24 animate-pulse rounded bg-gray-200"></div>
                          </td>
                          {skeletonFactors.map((_, colIndex) => (
                            <td
                              key={colIndex}
                              className="border border-gray-300 px-1 py-1"
                            >
                              <div className="h-8 w-full animate-pulse rounded bg-gray-200"></div>
                            </td>
                          ))}
                          <td className="border border-gray-300 px-2 py-2">
                            <div className="mx-auto h-4 w-16 animate-pulse rounded bg-gray-200"></div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 네비게이션 스켈레톤 */}
          <div className="inset-shadow-sm flex-shrink-0 border-t border-gray-100 bg-gray-50/80 px-4 py-3 sm:px-6 sm:py-4">
            <div className="flex justify-end">
              <div className="h-9 w-32 animate-pulse rounded-lg bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 완료 상태일 때 성공 페이지 표시
  if (isCompleted) {
    return (
      <div className="mx-auto h-full px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
          <WeightEvaluationSuccess type={evaluationType} />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto h-full px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex h-full flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
        {/* 헤더 */}
        <WeightEvaluationHeader
          type={evaluationType as 'visual' | 'industry'}
        />

        {/* 메인 콘텐츠 */}
        <div className="flex-1 overflow-hidden p-4 sm:p-6">
          <WeightEvaluationTable
            factors={weightEvaluationFactors}
            categories={categories}
            validationErrors={validationErrors}
            onWeightChange={handleWeightChange}
          />
        </div>

        {/* 하단 네비게이션 */}
        <div className="inset-shadow-sm flex-shrink-0 border-t border-gray-100 bg-gray-50/80 px-4 py-3 sm:px-6 sm:py-4">
          <WeightEvaluationNavigation
            onComplete={handleComplete}
            canComplete={isAllValid}
            isLoading={submitWeightedScoresMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
