import { z } from 'zod';
import { BasicResponseWithResultSchema } from './auth';

// profile //
/////////////////////////////////////////////////////////////////////////////////////////////

// 전문가 인적사항 스키마
export const ExpertMemberSchema = z.object({
  memberId: z.number(),
  name: z.string(),

  // 예: ["2025(1차수)", "2025(2차수)"]
  rounds: z.array(z.string()),

  email: z.string().nullable(),
  password: z.string().nullable(),

  phoneNumber: z.string().nullable(),
  gender: z.string().nullable(),
  age: z.string().nullable(),

  career: z.string().nullable(), // 경력
  academic: z.string().nullable(), // 학계
  expertise: z.string().nullable(), // 전문 분야
  company: z.string().nullable(), // 회사
  note: z.string().nullable(), // 비고란
});

export const ExpertListResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: z.array(ExpertMemberSchema),
});
// 전문가 인적사항 등록 요청 스키마
export const CreateExpertMemberSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),

  phoneNumber: z.string(),
  gender: z.string(),
  age: z.string(),

  career: z.string(), // 경력
  academic: z.string(), // 학계
  expertise: z.string(), // 전문 분야
  company: z.string(), // 회사
  note: z.string().nullable(), // 비고란
});

// 전문가 인적사항 등록 응답 스키마
export const CreateExpertMemberResponseShcema = BasicResponseWithResultSchema;

// 전문가 인적사항 수정 요청 스키마
export const UpdateExpertMemberSchema = z.object({
  name: z.string(),

  phoneNumber: z.string(),
  gender: z.string(),
  age: z.string(),

  career: z.string(), // 경력
  academic: z.string(), // 학계
  expertise: z.string(), // 전문 분야
  company: z.string(), // 회사
  note: z.string(),
});

// 전문가 인적사항 수정 응답 스키마
export const UpdateExpertMemberResponseShcema = BasicResponseWithResultSchema;

//  Mapping //
/////////////////////////////////////////////////////////////////////////////////////////////

export const expertDataSchema = z.object({
  datasetId: z.number(), // 서버용
  dataCode: z.string(), // 데이터아이디
});

export const expertDataArraySchema = z.array(expertDataSchema);

export const dataIdsSetShcema = z.object({
  memberId: z.number(), // 전문가 아디
  name: z.string(),
  dataIds: expertDataArraySchema,
});

export const dataIdsSetArrayShcema = z.array(dataIdsSetShcema);

// 전문가 할당 전체 조회 응답 스키마
export const ExpertAssignmentResponseShcema = z.object({
  code: z.number(),
  message: z.string(),
  result: dataIdsSetArrayShcema,
});
// 전문가 별 상세 매칭 데이터 조회 응답 스키마
export const OneExpertAssignmentResponseShcema = z.object({
  code: z.number(),
  message: z.string(),
  result: dataIdsSetShcema,
});

// 데이터셋 매칭 수정
export const IdsRequestSchema = z.object({
  ids: z.array(z.number().int()),
});

export const UpdateIdsResponseSchema = BasicResponseWithResultSchema;

// 평가에 참여할 전문가 후보 검색//
////////////////////////////////////////////////////////////////////////

// 전문가 기본 정보
export const ExpertBasicSchema = z.object({
  memberId: z.number(),
  name: z.string(),
});
export const ExpertBasicArraySchema = z.array(ExpertBasicSchema);

export const SearchExpertCandidateResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: ExpertBasicArraySchema,
});

// 전문가 ↔ 데이터셋 매칭 등록 요청 스키마
export const CreateExpertAssignmentRequestSchema = z.object({
  memberId: z.number(),
  datasetsIds: z.array(z.number()),
});

// 매칭 등록 응답 스키마
export const CreateExpertAssignmentResponseSchema =
  BasicResponseWithResultSchema;

export type ExpertMember = z.infer<typeof ExpertMemberSchema>;
export type ExpertListResponse = z.infer<typeof ExpertListResponseSchema>;
export type dataIdsSet = z.infer<typeof dataIdsSetShcema>;

export type dataIdsSetArray = z.infer<typeof dataIdsSetArrayShcema>;

export type CreateExpertMember = z.infer<typeof CreateExpertMemberSchema>;
export type UpdateExpertMember = z.infer<typeof UpdateExpertMemberSchema>;
export type UpdateExpertMemberResponse = z.infer<
  typeof UpdateExpertMemberResponseShcema
>;
export type ExpertAssignmentResponse = z.infer<
  typeof ExpertAssignmentResponseShcema
>;
export type OneExpertAssignmentResponse = z.infer<
  typeof OneExpertAssignmentResponseShcema
>;
export type IdsRequest = z.infer<typeof IdsRequestSchema>;
export type ExpertBasicArray = z.infer<typeof ExpertBasicArraySchema>;
export type SearchExpertCandidateResponse = z.infer<
  typeof SearchExpertCandidateResponseSchema
>;
export type CreateExpertAssignmentRequest = z.infer<
  typeof CreateExpertAssignmentRequestSchema
>;
export type CreateExpertAssignmentResponse = z.infer<
  typeof CreateExpertAssignmentResponseSchema
>;
