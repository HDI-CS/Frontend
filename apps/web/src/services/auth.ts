import { apiClient } from '@/lib/axios';
import {
  LoginRequest,
  LoginRequestSchema,
  LoginResponse,
  LoginResponseSchema,
  LogoutResponse,
  LogoutResponseSchema,
  MeResponse,
  MeResponseSchema,
} from '@/schemas/auth';

export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  // 요청 데이터 검증
  const validatedCredentials = LoginRequestSchema.parse(credentials);

  const response = await apiClient.post<LoginResponse>(
    '/user/auth/login',
    validatedCredentials
  );

  // 응답 데이터 검증
  return LoginResponseSchema.parse(response.data);
};

export const logout = async (): Promise<LogoutResponse> => {
  const response = await apiClient.post<LogoutResponse>('/api/v1/user/auth/logout');

  // 응답 데이터 검증
  return LogoutResponseSchema.parse(response.data);
};

export const getMe = async (): Promise<MeResponse> => {
  const response = await apiClient.get('/api/v1/user/auth/me');

  // 응답 데이터 검증
  return MeResponseSchema.parse(response.data);
};
