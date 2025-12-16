import { z } from 'zod';

// 사용자 역할 스키마
export const UserRoleSchema = z.enum(['USER', 'ADMIN']);
export const UserTypeSchema = z.enum(['PRODUCT', 'BRAND']);

// 사용자 정보 스키마
export const UserSchema = z.object({
  id: z.number(),
  email: z.email(),
  name: z.string(),
  role: UserRoleSchema,
  userType: UserTypeSchema,
  surveyDone: z.boolean(),
});

// 로그인 요청 스키마
export const LoginRequestSchema = z.object({
  email: z.email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string().min(1, '비밀번호를 입력해주세요.'),
});

// 로그인 응답 스키마
export const LoginResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: UserSchema,
});

// 로그아웃 응답 스키마
export const LogoutResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
});

// 내 정보 조회 응답 스키마
export const MeResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: UserSchema,
});

// 타입 추출
export type UserRole = z.infer<typeof UserRoleSchema>;
export type User = z.infer<typeof UserSchema>;
export type UserType = z.infer<typeof UserTypeSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type LogoutResponse = z.infer<typeof LogoutResponseSchema>;
export type MeResponse = z.infer<typeof MeResponseSchema>;
