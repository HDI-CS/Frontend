'use client';

import { useParams } from 'next/navigation';

import BrandSurvey from '@/components/survey/BrandSurvey';
import ProductSurvey from '@/components/survey/ProductSurvey';
import { useProductSurveyDetail } from '@/hooks/useSurveyProducts';
import { UserType } from '@/schemas/auth';
import {
  type BrandSurveyDetailResponse,
  type ProductSurveyDetailResponse,
} from '@/schemas/survey';

export default function SurveyPage() {
  const { id, type } = useParams();
  const surveyId = String(id);

  const {
    data: detail,
    isLoading,
    error,
  } = useProductSurveyDetail({
    type: type as UserType,
    productResponseId: Number(surveyId),
  });

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-gray-600">설문 데이터를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-red-500">
          설문 데이터를 불러오지 못했습니다.
        </p>
      </div>
    );
  }

  // 데이터가 없을 때 처리
  if (!detail) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <p className="mb-2 text-sm text-gray-600">
            설문 데이터를 찾을 수 없습니다.
          </p>
          <p className="text-xs text-gray-500">
            관리자에게 문의하거나 다시 시도해주세요.
          </p>
        </div>
      </div>
    );
  }

  // type에 따라 적절한 컴포넌트 렌더링
  const normalizedType = (type as string).toUpperCase() as UserType;

  if (
    normalizedType === 'INDUSTRY' &&
    'industryDataSetResponse' in detail.result
  ) {
    return (
      <ProductSurvey
        surveyId={surveyId}
        detail={detail as ProductSurveyDetailResponse}
      />
    );
  }

  if (normalizedType === 'VISUAL' && 'visualDatasetResponse' in detail.result) {
    return (
      <BrandSurvey
        surveyId={surveyId}
        detail={detail as BrandSurveyDetailResponse}
      />
    );
  }

  // 지원하지 않는 타입
  return (
    <div className="flex h-full items-center justify-center">
      <div className="text-center">
        <p className="mb-2 text-sm text-red-500">
          지원하지 않는 설문 타입입니다: {type}
        </p>
        <p className="text-xs text-gray-500">
          INDUSTRY 또는 VISUAL 타입만 지원됩니다.
        </p>
      </div>
    </div>
  );
}
