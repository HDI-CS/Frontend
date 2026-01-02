import { z } from 'zod';

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
  note: z.string().nullable(), // 비고
});

export const ExpertListResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: z.array(ExpertMemberSchema),
});

export type ExpertMember = z.infer<typeof ExpertMemberSchema>;
export type ExpertListResponse = z.infer<typeof ExpertListResponseSchema>;
