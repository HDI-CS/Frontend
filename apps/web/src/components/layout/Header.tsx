'use client';

import Image from 'next/image';

import { HongikUnivLogo } from '@hdi/ui';
import Link from 'next/link';

import { Button } from '@/components/Button';
import { useLogout } from '@/hooks/useLogout';
import { useMe } from '@/hooks/useMe';

export default function Header() {
  const logoutMutation = useLogout();

  // 로그아웃 중일 때는 useMe 훅 비활성화하여 불필요한 API 호출 방지
  const { data: meData, isLoading, error } = useMe(!logoutMutation.isPending);

  // React Query 캐시에서 사용자 정보 가져오기 (클라이언트 쿠키 의존성 제거)
  const isLoggedIn = !isLoading && !error && !!meData?.result;
  const user = meData?.result || null;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <header className="h-19 fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-gray-100 bg-white/80 px-8 backdrop-blur-xl">
      <Link href={`/inbox/${user?.userType.toLowerCase()}`}>
        <Image
          src={HongikUnivLogo}
          alt="홍익대학교 로고"
          width={120}
          className="h-auto object-contain"
          priority
        />
      </Link>

      {isLoggedIn && user && (
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            안녕하세요, <span className="font-bold">{user.name}</span>님
          </span>
          <Button
            text={logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
            onClick={handleLogout}
            className="bg-red-600 px-5 py-2 text-sm text-white hover:bg-red-700 disabled:bg-gray-400"
            disabled={logoutMutation.isPending}
          />
        </div>
      )}
    </header>
  );
}
