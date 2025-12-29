import { z } from 'zod';

// 사용자 역할 스키마
export const UserRoleSchema = z.enum(['USER', 'ADMIN']);
export const UserTypeSchema = z.enum([
  'PRODUCT',
  'BRAND',
  'VISUAL',
  'INDUSTRY',
]);

// 차수 정보 스키마
export const EvaluationRoundSchema = z.object({
  roundId: z.number(),
  folderName: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
  startDate: z.string(),
  endDate: z.string(),
});

// 차수 정보 배열 스키마
export const RoundsSchema = z.array(EvaluationRoundSchema);

// 년도 정보 스키마
export const EvaluationYearSchema = z.object({
  yearId: z.number(),
  folderName: z.string(),
  updatedAt: z.string(),
  createdAt: z.string(),
  rounds: RoundsSchema,
});

// 년도 정보 배열 스키마
export const YearsSchema = z.array(EvaluationYearSchema);

// 전체 평가 조회 응답 스키마
export const EvaluationYearsResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: YearsSchema,
});

// 타입 추출
export type EvaluationRound = z.infer<typeof EvaluationRoundSchema>;
export type EvaluationYear = z.infer<typeof EvaluationYearSchema>;
