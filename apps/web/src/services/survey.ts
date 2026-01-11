import { apiClient } from '@/lib/axios';
import { UserType } from '@/schemas/auth';
import {
  BrandSurveyDataSchema,
  ProductSurveyDataSchema,
  SurveyProductApiResponseSchema,
  SurveyResponseRequestSchema,
  type BrandSurveyDetailResponse,
  type ProductSurveyDetailResponse,
  type SurveyProductApiResponse,
  type SurveyResponseRequest,
} from '@/schemas/survey';
import {
  WeightedScoreApiResponseSchema,
  WeightedScoreRequest,
  WeightedScoreRequestSchema,
  type WeightedScoreApiResponse,
} from '@/schemas/weight-evaluation';
import { analyzeDataStructure, safeZodParse } from '@/utils/zod';

export const surveyService = {
  /**
   * 사용자에게 할당된 설문 제품 목록을 조회합니다.
   * @returns 설문 제품 목록
   */
  async getSurveyProducts({
    type,
  }: {
    type: UserType;
  }): Promise<SurveyProductApiResponse> {
    const response = await apiClient.get(
      `/api/v1/user/${type.toLowerCase()}/survey`
    );

    console.log('Survey List Response:', response.data);

    // Zod 스키마로 응답 검증
    return safeZodParse(SurveyProductApiResponseSchema, response.data, {
      operation: 'SurveyProductApiResponse validation',
      additionalInfo: {
        type,
        url: `/api/v1/user/${type.toLowerCase()}/survey`,
      },
    });
  },
  /**
   * 제품 설문 상세 조회
   */
  async getSurveyDetail({
    type,
    productResponseId,
  }: {
    type: UserType;
    productResponseId: number;
  }): Promise<ProductSurveyDetailResponse | BrandSurveyDetailResponse> {
    const response = await apiClient.get(
      `/api/v1/user/${type.toLowerCase()}/survey/${productResponseId}`
    );

    console.log(`${type} SurveyDetail Response:`, response.data);

    // type을 대문자로 정규화하여 비교
    const normalizedType = type.toUpperCase();

    // type에 따라 동적으로 스키마 선택
    if (normalizedType === 'INDUSTRY') {
      console.log('Validating with ProductSurveyDataSchema...');
      console.log('Raw response.data:', response.data);
      console.log('response.data.data:', response.data.result);

      // data 부분만 검증
      const validatedData = safeZodParse(
        ProductSurveyDataSchema,
        response.data.result, // data 부분만 검증
        {
          operation: 'ProductSurveyData validation',
          additionalInfo: {
            type,
            normalizedType,
            dataKeys: response.data?.result
              ? Object.keys(response.data.result)
              : 'no data',
            dataStructure: analyzeDataStructure(response.data?.result),
          },
        }
      );

      // productDataSetResponse는 화면 렌더링의 핵심 데이터이므로 여기서 필수 보장
      if (!validatedData.industryDataSetResponse) {
        throw new Error(
          'Missing productDataSetResponse in survey detail response'
        );
      }

      // 전체 응답 구조로 반환
      return {
        code: response.data.code,
        message: response.data.message,
        result: validatedData,
      };
    } else if (normalizedType === 'VISUAL') {
      console.log('Validating with BrandSurveyDataSchema...');
      console.log('Raw response.data:', response.data);
      console.log('response.data.data:', response.data.result);
      console.log(
        'response.data.data keys:',
        response.data?.result ? Object.keys(response.data.result) : 'no data'
      );
      console.log(
        'response.data.data.brandDatasetResponse:',
        response.data?.result?.visualDatasetResponse
      );
      console.log(
        'response.data.data.brandSurveyResponse:',
        response.data?.result?.visualDatasetResponse
      );

      // data 부분만 검증
      const validatedData = safeZodParse(
        BrandSurveyDataSchema,
        response.data.result, // data 부분만 검증
        {
          operation: 'BrandSurveyData validation',
          additionalInfo: {
            type,
            normalizedType,
            dataKeys: response.data?.result
              ? Object.keys(response.data.result)
              : 'no data',
            dataStructure: analyzeDataStructure(response.data?.result),
            brandDatasetResponseExists:
              !!response.data?.result?.visualDatasetResponse,
            brandDatasetResponseKeys: response.data?.result
              ?.visualDatasetResponse
              ? Object.keys(response.data.result.visualDatasetResponse)
              : 'no brandDatasetResponse',
          },
        }
      );

      // brandDatasetResponse는 화면 렌더링의 핵심 데이터이므로 여기서 필수 보장
      if (!validatedData.visualDatasetResponse) {
        throw new Error(
          'Missing brandDatasetResponse in survey detail response'
        );
      }

      // 전체 응답 구조로 반환
      return {
        code: response.data.code,
        message: response.data.message,
        result: validatedData,
      };
    } else {
      throw new Error(
        `Unsupported survey type: ${type} (normalized: ${normalizedType})`
      );
    }
  },

  /**
   * 설문 응답 저장 (정량 평가 또는 정성 평가)
   */
  async saveSurveyResponse({
    type,
    productResponseId,
    requestData,
  }: {
    type: UserType;
    productResponseId: number;
    requestData: SurveyResponseRequest;
  }): Promise<void> {
    // 요청 데이터 검증
    const validatedData = safeZodParse(
      SurveyResponseRequestSchema,
      requestData,
      {
        operation: 'SurveyResponseRequest validation',
        additionalInfo: {
          type,
          productResponseId,
        },
      }
    );

    const response = await apiClient.post(
      `/api/v1/user/${type.toLowerCase()}/survey/${productResponseId}`,
      validatedData
    );

    console.log('Survey Response Save:', {
      type,
      productResponseId,
      requestData: validatedData,
      response: response.data,
    });

    return response.data;
  },

  /**
   * 설문 제출 (완료)
   */
  async submitSurvey({
    type,
    responseId,
  }: {
    type: UserType;
    responseId: number;
  }): Promise<void> {
    const response = await apiClient.post(
      `/api/v1/user/${type.toLowerCase()}/survey/${responseId}/submit`
    );

    console.log('Survey Submit:', {
      type,
      responseId,
      response: response.data,
    });

    return response.data;
  },

  /**
   * 가중치 평가 점수 조회
   */
  async getWeightedScores(type: UserType): Promise<WeightedScoreApiResponse> {
    const response = await apiClient.get(
      `/api/v1/user/${type.toLowerCase()}/survey/weighted-score`
    );

    console.log('Weighted Scores Response:', response.data);

    // Zod 스키마로 응답 검증
    return safeZodParse(WeightedScoreApiResponseSchema, response.data, {
      operation: 'WeightedScoreApiResponse validation',
      additionalInfo: {
        url: `/api/v1/user/${type.toLowerCase()}/survey/weighted-score`,
      },
    });
  },

  /**
   * 가중치 평가 점수 제출 (수정/등록)
   */
  async submitWeightedScores(
    requestData: WeightedScoreRequest,
    type: UserType
  ): Promise<void> {
    // 요청 데이터 검증
    const validatedData = safeZodParse(
      WeightedScoreRequestSchema,
      requestData,
      {
        operation: 'WeightedScoreRequestArray validation',
      }
    );

    const response = await apiClient.post(
      `/api/v1/user/${type.toLowerCase()}/survey/weighted-score`,
      validatedData
    );

    console.log('Weighted Scores Submit:', {
      requestData: validatedData,
      response: response.data,
    });

    return response.data;
  },
};
