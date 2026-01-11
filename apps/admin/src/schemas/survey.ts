import { z } from 'zod';
import { BasicResponseWithResultSchema } from './auth';

// 사용자 역할 스키마
export const UserRoleSchema = z.enum(['USER', 'ADMIN']);
export const UserTypeSchema = z.enum([
  'PRODUCT',
  'BRAND',
  'VISUAL',
  'INDUSTRY',
]);

/**
 * null | undefined → '' 로 정규화
 * UI에서 항상 string으로 쓰기 위한 공통 스키마
 */
export const NullableString = z.preprocess((v) => v ?? '', z.string());

// 차수 정보 스키마
export const EvaluationRoundSchema = z.object({
  roundId: z.number().nullable(),
  folderName: NullableString,
  updatedAt: z.string().nullable(),
  createdAt: z.string().nullable(),
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
});

// 차수 정보 배열 스키마
export const RoundsSchema = z.array(EvaluationRoundSchema);

// 년도 정보 스키마
export const EvaluationYearSchema = z.object({
  yearId: z.number().nullable(),
  folderName: NullableString,
  updatedAt: z.string().nullable(),
  createdAt: z.string().nullable(),
  rounds: RoundsSchema,
});

// 년도 정보 배열 스키마
export const YearsSchema = z.array(EvaluationYearSchema);

// 전체 평가 조회 응답 스키마
export const EvaluationYearsResponseSchema = z.object({
  code: z.coerce.number(),
  message: z.string(),
  result: YearsSchema,
});

// 년도 평가 생성 응답 스키마
export const yearIdShcema = z.object({
  yearId: z.number(),
});

export const CreateEvaluationYearResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: yearIdShcema,
});

// 설문 문항 타입
export const SurveyQuestionTypeSchema = z.enum(['NUMBER', 'TEXT', 'SAMPLE']);

export type SurveyQuestionType = z.infer<typeof SurveyQuestionTypeSchema>;

// 개별 질문 스키마
export const SurveyQuestionSchema = z.object({
  id: z.number(),
  surveyNumber: z.number(),
  surveyCode: z.string(),
  surveyContent: z.string(),
});

export const SurveyQuestionByTypeSchema = z.object({
  type: SurveyQuestionTypeSchema,
  surveyNumber: z.number(),
  surveyCode: z.string(),
  surveyContent: z.string(),
});

// 년도 평가 설문 문항 생성 바뀐 리퀘스트 바디 대응 스키마
export const SurveyQuestionByTypeWithSampleTextSchema = z.object({
  type: SurveyQuestionTypeSchema,
  surveyNumber: z.number(),
  surveyCode: z.string(),
  surveyContent: z.string(),
  sampleText: z.string().nullable().optional(),
});

// 질문 배열 스키마
export const SurveyQuestionListSchema = z.array(SurveyQuestionSchema);
export const SurveyQuestionByTypeListSchema = z.array(
  SurveyQuestionByTypeSchema
);
export const SurveyQuestionByTypeWithSampleTextArraySchema = z.array(
  SurveyQuestionByTypeWithSampleTextSchema
);

// 타입별 질문 묶음  (NUMBER / TEXT / SAMPLE)
export const SurveyQuestionGroupSchema = z.object({
  type: SurveyQuestionTypeSchema,
  questions: SurveyQuestionListSchema,
});

// 설문 질문 그룹 배열
export const SurveyQuestionGroupsSchema = z.array(SurveyQuestionGroupSchema);

// 평가 년도 상세 result 요청 스키마
export const EvaluationSurveyResultSchema = z.object({
  // folderName: z.string(),
  questions: SurveyQuestionByTypeListSchema,
});

export const EvaluationSurveySchema = z.object({
  folderName: z.string(),
  surveyQuestions: SurveyQuestionGroupsSchema,
});

// 년도 평가 설문 문항 조회 응답 스키마
export const EvaluationSurveyResponseSchema = z.object({
  code: z.string(), // "1000"
  message: z.string(),
  result: EvaluationSurveySchema,
});

// 년도 평가 설문 문항 생성 응답 스키마
export const CreateEvaluationQuestionResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  result: null,
});

/////////////////////////
// 년도 평가 이름 수정
////////////////////////
export const FolderNameRequestSchema = z.object({
  folderName: z.string(),
});

// 차수 평가 생성 응답 스키마
export const RoundObjectSchema = z.object({
  roundId: z.number(),
});

export const CreateRoundEvaluationResponseSchema = z.object({
  code: z.string(),
  message: z.string(),
  result: RoundObjectSchema,
});

// 차수 기간 설정 요청 스키마
export const DurationRequestSchema = z.object({
  startDate: z.string().nullable(),
  endDate: z.string().nullable(),
});

export const CreateRoundEvaluationDurationResponseSchema =
  BasicResponseWithResultSchema;

// 타입 추출
export type EvaluationRound = z.infer<typeof EvaluationRoundSchema>;
export type RoundsSchema = z.infer<typeof RoundsSchema>;

export type EvaluationYear = z.infer<typeof EvaluationYearSchema>;
export type EvaluationYears = z.infer<typeof YearsSchema>;

export type EvaluationYearsResponse = z.infer<
  typeof EvaluationYearsResponseSchema
>;

export type SurveyQuestionByType = z.infer<typeof SurveyQuestionByTypeSchema>;
export type SurveyQuestionByTypeList = z.infer<
  typeof SurveyQuestionByTypeListSchema
>;
export type SurveyQuestionByTypeWithSampleText = z.infer<
  typeof SurveyQuestionByTypeWithSampleTextSchema
>;
export type SurveyQuestionByTypeWithSampleTextArray = z.infer<
  typeof SurveyQuestionByTypeWithSampleTextArraySchema
>;

export type SurveyQuestion = z.infer<typeof SurveyQuestionSchema>;
export type SurveyQuestionList = z.infer<typeof SurveyQuestionListSchema>;

export type SurveyQuestionGroups = z.infer<typeof SurveyQuestionGroupsSchema>;
export type EvaluationSurveyResult = z.infer<
  typeof EvaluationSurveyResultSchema
>;
export type SurveyQuestionGroup = z.infer<typeof SurveyQuestionGroupSchema>;
export type EvaluationSurveyResponse = z.infer<
  typeof EvaluationSurveyResponseSchema
>;

export type FolderNameRequest = z.infer<typeof FolderNameRequestSchema>;

export type CreateEvaluationQuestionResponse = z.infer<
  typeof CreateEvaluationQuestionResponseSchema
>;

export type RoundObject = z.infer<typeof RoundObjectSchema>;

export type CreateRoundEvaluationResponse = z.infer<
  typeof CreateRoundEvaluationResponseSchema
>;
export type DurationRequest = z.infer<typeof DurationRequestSchema>;
