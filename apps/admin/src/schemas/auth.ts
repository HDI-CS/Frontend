import { z } from 'zod';

export const BasicResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
});

export const BasicResponseWithResultSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: z.null(),
});

// 어드민 역할 스키마
export const UserRoleSchema = z.enum(['USER', 'ADMIN']);
export const UserTypeSchema = z.enum(['VISUAL', 'INDUSTRY']);

// 어드민 정보 스키마
export const UserSchema = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string(),
  role: UserRoleSchema,
  userType: UserTypeSchema,
  surveyDone: z.boolean().nullable(),
});

// 로그인 요청 스키마
export const LoginRequestSchema = z.object({
  email: z.email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

// 로그인 응답 스키마
export const LoginResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: UserSchema,
});

// 로그아웃 응답 스키마
export const LogoutResponseSchema = BasicResponseSchema;

// 내 정보 조회 응답 스키마
export const MeResponseSchema = z.object({
  code: z.number(),
  message: z.string(),
  result: UserSchema,
});

// 타입 추출
export type UserRole = z.infer<typeof UserRoleSchema>;
export type User = z.infer<typeof UserSchema>;
export type UserType = z.infer<typeof UserTypeSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type LogoutResponse = z.infer<typeof LogoutResponseSchema>;
export type MeResponse = z.infer<typeof MeResponseSchema>;
