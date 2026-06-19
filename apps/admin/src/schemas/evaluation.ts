import { z } from 'zod';
import { BasicResponseWithResultSchema } from './auth';

// 평가 상태 enum 스키마
export const EvalTypeSchema = z.enum([
  'WEIGHTED', // 정량(가중치)
  'QUALITATIVE', // 정성
]);

export const EvalStatusSchema = z.enum([
  'DONE', // 완료
  'NOT_DONE', // 미완료
]);

// 개별 문항 평가 상태 스키마
export const EvalStatusItemSchema = z.object({
  evalId: z.number(),
  evalType: EvalTypeSchema,
  evalStatus: EvalStatusSchema,
});

// 전문가(멤버) 단위 결과 스키마
export const MemberEvaluationStatusSchema = z.object({
  memberId: z.number(),
  memberName: z.string(),
  totalCount: z.number(), // 전체 문항 수
  evaluatedCount: z.number(), // 완료된 문항 수
  evalStatuses: z.array(EvalStatusItemSchema),
});

// 전체 API 응답 스키마
export const EvaluationStatusResponseSchema = z.object({
  code: z.number(), // "1000"
  message: z.string(), // "OK"
  result: z.array(MemberEvaluationStatusSchema),
});

/////////////////////////
// 특정 전문가 응답 전체 조회
export const SurveyTypeEnum = z.enum(['NUMBER', 'TEXT', 'SAMPLE']);
export type SurveyType = z.infer<typeof SurveyTypeEnum>;
export const SurveySchema = z.object({
  surveyId: z.number(),
  surveyType: SurveyTypeEnum,
  surveyNumber: z.number(),
  surveyCode: z.string(),
  surveyContent: z.string(),
  answerContent: z.string().nullable(),
});

export type Survey = z.infer<typeof SurveySchema>;

export const SurveyDataSchema = z
  .object({
    dataId: z.number(),
    dataCode: z.string(),
    surveys: z.array(SurveySchema).optional(),
    surveyss: z.array(SurveySchema).optional(), // 서버 오타 대응
  })
  .transform((data) => ({
    dataId: data.dataId,
    dataCode: data.dataCode,
    surveys: data.surveys ?? data.surveyss ?? [],
  }));

export const MemberSurveyResultSchema = z.object({
  memberId: z.number(),
  memberName: z.string(),
  surveyDatas: z.array(SurveyDataSchema),
});

export const GetMemberSurveyResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: MemberSurveyResultSchema,
});

// 설문 문항 전체 수정 ( 생성, 삭제 불가 )
export const originalSurveySchema = z.object({
  surveyId: z.number(),
  surveyContent: z.string(),
});

export const originalSurveyArraySchema = z.array(originalSurveySchema);

export const UpdateOriginalSurveySchema = originalSurveyArraySchema;

export const UpdateOriginalSurveyResponseSchema = BasicResponseWithResultSchema;

export type GetMemberSurveyResponse = z.infer<
  typeof GetMemberSurveyResponseSchema
>;

export type MemberSurveyResult = z.infer<typeof MemberSurveyResultSchema>;

export type SurveyData = z.infer<typeof SurveyDataSchema>;

// 타입 추출
export type EvalType = z.infer<typeof EvalTypeSchema>;

export type EvalStatus = z.infer<typeof EvalStatusSchema>;
export type EvalStatusItem = z.infer<typeof EvalStatusItemSchema>;
export type MemberEvaluationStatus = z.infer<
  typeof MemberEvaluationStatusSchema
>;
export type EvaluationStatusResponse = z.infer<
  typeof EvaluationStatusResponseSchema
>;

export type UpdateOriginalSurvey = z.infer<typeof UpdateOriginalSurveySchema>;
