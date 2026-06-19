import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { LogoutResponse } from '../schemas/auth';
import { logout } from '../services/auth';
import { clearAuthCookies } from '../utils/cookies';

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<LogoutResponse, Error, void>({
    mutationFn: logout,
    onSuccess: () => {
      console.log('✅ 로그아웃 성공');

      // React Query 캐시 완전 초기화
      queryClient.clear();
      console.log('🔄 모든 캐시 초기화 완료');

      // 모든 인증 관련 쿠키 삭제
      clearAuthCookies();

      // 로그인 페이지로 리다이렉트
      router.push('/auth');
    },
    onError: (error) => {
      console.error('❌ 로그아웃 실패:', error);

      // 에러가 발생해도 캐시와 쿠키는 정리
      queryClient.clear();
      clearAuthCookies();

      router.push('/auth');
    },
  });
};
