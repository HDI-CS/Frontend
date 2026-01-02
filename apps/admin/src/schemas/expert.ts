import { z } from 'zod';
import { BasicResponseWithResultSchema } from './auth';

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
});

// 전문가 인적사항 수정 응답 스키마
export const UpdateExpertMemberResponseShcema = BasicResponseWithResultSchema;

export type ExpertMember = z.infer<typeof ExpertMemberSchema>;
export type ExpertListResponse = z.infer<typeof ExpertListResponseSchema>;

export type CreateExpertMember = z.infer<typeof CreateExpertMemberSchema>;
export type UpdateExpertMember = z.infer<typeof UpdateExpertMemberSchema>;
export type UpdateExpertMemberResponse = z.infer<
  typeof UpdateExpertMemberResponseShcema
>;
