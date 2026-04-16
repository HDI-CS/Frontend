import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { LoginRequest, LoginResponse } from '@/schemas/auth';
import { getMe, login } from '@/services/auth';
import { deleteCookie } from '@/utils/cookies';

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: login,
    onSuccess: async (data) => {
      console.log('✅ 로그인 성공:', data);

      // 로그인 성공 직후 쿠키 상태 확인
      console.log('🍪 로그인 직후 모든 쿠키:', document.cookie);

      // 클라이언트 쿠키 저장 제거 - useMe 훅으로 통일된 상태 관리
      // 서버 HttpOnly 쿠키만으로 인증 관리, React Query 캐시로 사용자 정보 관리
      console.log('✅ 인증 완료 - useMe 훅으로 사용자 정보 관리');

      // 로그인 응답의 사용자 정보를 React Query 캐시에 직접 설정
      // 이렇게 하면 inbox 페이지에서 useMe() 호출 시 즉시 사용자 정보 사용 가능
      queryClient.setQueryData(['me'], {
        status: 200,
        message: 'OK',
        data: data.result,
      });
      console.log('✅ 사용자 정보 캐시에 직접 설정 완료');

      try {
        // 서버 세션이 실제로 활성화되었는지 재검증
        await queryClient.fetchQuery({
          queryKey: ['me'],
          queryFn: getMe,
          staleTime: 0,
        });
        console.log('🔄 서버 세션 동기화 완료');
      } catch (error) {
        console.error('⚠️ 로그인 후 사용자 정보 재검증 실패:', error);
        return;
      }

      // 성공 후 inbox로 리다이렉트
      router.push(`/inbox/${data.result.userType.toLowerCase()}`);
    },
    onError: (error) => {
      console.error('로그인 실패:', error);
      // 로그인 실패 시 기존 클라이언트 쿠키 정리 (혹시 남아있을 경우)
      deleteCookie('user');
    },
  });
};
