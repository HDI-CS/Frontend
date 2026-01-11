import { z } from 'zod';

// ========================
// 가중치 평가 스키마
// ========================

// 가중치 평가 카테고리 enum
export const WeightEvaluationCategorySchema = z.enum([
  'COSMETIC',
  'FB',
  'VACUUM_CLEANER',
  'AIR_PURIFIER',
  'HAIR_DRYER',
]);

// 가중치 평가 요청 스키마
export const WeightedScoreRequestSchema = z.object({
  id: z.number().nullable(), // 수정 시 기존 id, 신규 등록 시 null
  category: WeightEvaluationCategorySchema,
  score1: z.int32(),
  score2: z.int32(),
  score3: z.int32(),
  score4: z.int32(),
  score5: z.int32(),
  score6: z.int32(),
  score7: z.int32(),
  score8: z.int32(),
});

// 가중치 평가 요청 배열 스키마 (API는 배열을 받음 -> 수정: 카테고리 별로 하나씩)
export const WeightedScoreRequestArraySchema = z.array(
  WeightedScoreRequestSchema
);

// 가중치 평가 응답 스키마
export const WeightedScoreResponseSchema = z.object({
  id: z.number(),
  category: WeightEvaluationCategorySchema,
  score1: z.int32(),
  score2: z.int32(),
  score3: z.int32(),
  score4: z.int32(),
  score5: z.int32(),
  score6: z.int32(),
  score7: z.int32(),
  score8: z.int32(),
});

// 가중치 평가 응답 데이터 스키마 (API 응답 구조)
export const WeightedScoreApiResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: z.array(WeightedScoreResponseSchema),
});

// 스키마에서 추출한 타입들
export type WeightEvaluationCategoryType = z.infer<
  typeof WeightEvaluationCategorySchema
>;
export type WeightedScoreRequest = z.infer<typeof WeightedScoreRequestSchema>;
export type WeightedScoreRequestArray = z.infer<
  typeof WeightedScoreRequestArraySchema
>;
export type WeightedScoreResponse = z.infer<typeof WeightedScoreResponseSchema>;
export type WeightedScoreApiResponse = z.infer<
  typeof WeightedScoreApiResponseSchema
>;
