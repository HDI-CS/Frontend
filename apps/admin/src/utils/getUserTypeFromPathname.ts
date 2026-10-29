import { UserType } from '@/src/schemas/auth';

/** 현재 경로가 /industry 로 시작하면 INDUSTRY, 아니면 VISUAL로 간주한다. */
export const getUserTypeFromPathname = (pathname: string): UserType =>
  pathname.startsWith('/industry') ? 'INDUSTRY' : 'VISUAL';
