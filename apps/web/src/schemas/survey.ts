import {
  INDUSTRY_ITEM_NULLABLE_KEYS,
  VISUAL_FIELD_KEYS,
} from '@/config/categoryConfig';
import { z } from 'zod';
import {
  IndustryCategorySchema,
  VisualCategorySchema,
} from './weight-evaluation';

// 설문 제품 응답 상태 스키마 (실제 API 스펙에 맞게 수정)
export const SurveyProductResponseStatusSchema = z.enum([
  'NOT_STARTED',
  'IN_PROGRESS',
  'DONE',
]);

// (기존) 설문 제품 스키마
export const SurveyProductSchema = z.object({
  name: z.string(),
  image: z.url(),
  responseStatus: SurveyProductResponseStatusSchema,
  responseId: z.int64(),
});

// (변경) 설문
export const SurveyResultSchema = z.object({
  name: z.string(),
  image: z.string().nullable(),
  responseStatus: SurveyProductResponseStatusSchema,
  dataId: z.number(),
});

// 설문 제품 API 응답 스키마 (임시로 유연하게 처리)
export const SurveyProductApiResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: z.array(SurveyResultSchema),
});

// 타입 추출
export type SurveyProductResponseStatus = z.infer<
  typeof SurveyProductResponseStatusSchema
>;

export type SurveyProduct = z.infer<typeof SurveyProductSchema>;
export type SurveyResult = z.infer<typeof SurveyResultSchema>;

export type SurveyProductApiResponse = z.infer<
  typeof SurveyProductApiResponseSchema
>;

// 카테고리별 필드 키 목록 → 전부 nullable string 스키마로 변환
const buildNullableStringShape = <K extends readonly string[]>(keys: K) =>
  Object.fromEntries(
    keys.map((key) => [key, z.string().nullable()] as const)
  ) as { [P in K[number]]: z.ZodNullable<z.ZodString> };

// ========================
// 상품 설문 상세 스키마
// ========================

// 응답의 정확한 스펙이 확정되기 전이므로 필수 최소 필드만 엄격 검증하고 나머지는 관대하게(pass through) 처리합니다.
export const ProductDataSetResponseSchema = z.object({
  // 백엔드가 숫자 혹은 문자열을 반환할 수 있어 유연하게 수용 후 문자열로 정규화
  id: z.string(),
  productName: z.string(),
  industryDataCategory: IndustryCategorySchema.nullable(),

  // 이미지 필드는 fields 레지스트리에 없는 "구조적" 필드라 별도 명시
  detailImagePath: z.string().nullable(),
  frontImagePath: z.string().nullable(),
  sideImagePath: z.string().nullable(),
  side2ImagePath: z.string().nullable(),
  side3ImagePath: z.string().nullable(),

  // 카테고리별 동적 필드는 레지스트리에서 자동 생성
  ...buildNullableStringShape(INDUSTRY_ITEM_NULLABLE_KEYS),
});

export const ProductSurveyQuestionSchema = z.object({
  surveyId: z.number().nullable(),
  surveyCode: z.string().nullable(),
  survey: z.string().nullable(),
  response: z.int32().nullable(),
});

export const ProductTextSurveyResponseSchema = z.object({
  surveyId: z.number().nullable(),
  survey: z.string().nullable(),
  sampleText: z.string().nullable(),
  response: z.string().nullable(),
});

// data 부분만 검증하는 스키마
export const ProductSurveyDataSchema = z.object({
  // 일부 응답에서 null이 올 수 있어 nullable로 허용하되, 서비스 레이어에서 필수 보장 처리
  industryDataSetResponse: ProductDataSetResponseSchema,
  productSurveyResponse: z.object({
    dataCode: z.string(),
    isSubmitted: z.boolean(),
    response: z.array(ProductSurveyQuestionSchema),
    textResponse: ProductTextSurveyResponseSchema.nullable(),
  }),
});

// 전체 응답 스키마 (타입 추출용)
export const ProductSurveyDetailResponseSchema = z.object({
  code: z.number(),
  message: z.string().nullable(),
  result: ProductSurveyDataSchema,
});

export type ProductSurveyDetailResponse = z.infer<
  typeof ProductSurveyDetailResponseSchema
>;
export type ProductDataSetResponse = z.infer<
  typeof ProductDataSetResponseSchema
>;
export type ProductSurveyQuestion = z.infer<typeof ProductSurveyQuestionSchema>;
export type ProductTextSurveyResponse = z.infer<
  typeof ProductTextSurveyResponseSchema
>;

// ========================
// 브랜드 설문 상세 스키마
// ========================

export const BrandDataSetResponseSchema = z.object({
  id: z.string(),
  name: z.string().nullable(),
  image: z.string().nullable(),
  visualDataCategory: VisualCategorySchema.nullable(),

  // 카테고리별 동적 필드는 레지스트리에서 자동 생성
  ...buildNullableStringShape(VISUAL_FIELD_KEYS),
});

export const BrandSurveyQuestionSchema = z.object({
  surveyId: z.number().nullable(),
  surveyCode: z.string().nullable(),
  survey: z.string().nullable(),
  response: z.int32().nullable(),
});

export const BrandTextSurveyResponseSchema = z.object({
  surveyId: z.number().nullable(),
  survey: z.string().nullable(),
  sampleText: z.string().nullable(),
  response: z.string().nullable(),
});

// data 부분만 검증하는 스키마
export const BrandSurveyDataSchema = z.object({
  visualDatasetResponse: BrandDataSetResponseSchema.optional(), // API 응답과 일치하도록 필드명 수정
  brandSurveyResponse: z.object({
    dataCode: z.string(),
    isSubmitted: z.boolean(),
    response: z.array(BrandSurveyQuestionSchema),
    textResponse: BrandTextSurveyResponseSchema,
  }),
});

// 전체 응답 스키마 (타입 추출용)
export const BrandSurveyDetailResponseSchema = z.object({
  code: z.number(),
  message: z.string().nullable(),
  result: BrandSurveyDataSchema,
});

export type BrandDataSetResponse = z.infer<typeof BrandDataSetResponseSchema>;
export type BrandSurveyDetailResponse = z.infer<
  typeof BrandSurveyDetailResponseSchema
>;
export type BrandSurveyQuestion = z.infer<typeof BrandSurveyQuestionSchema>;
export type BrandTextSurveyResponse = z.infer<
  typeof BrandTextSurveyResponseSchema
>;

// ========================
// 설문 응답 저장 요청 스키마
// ========================

// 설문 응답 저장 요청 DTO (정량 평가, 정성 평가 응답 제출)
export const SurveyResponseRequestSchema = z.object({
  surveyId: z.int32().nullable(),
  response: z.int32().nullable(),
  textResponse: z.string().nullable(),
});

export type SurveyResponseRequest = z.infer<typeof SurveyResponseRequestSchema>;
