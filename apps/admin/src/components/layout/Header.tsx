'use client';
import { useLogout } from '@/src/hooks/useLogout';
import { useMe } from '@/src/hooks/useMe';
import SearchInput from '../SearchInput';

interface HeaderProps {
  name: string;
  isInput?: boolean; // input창 필요 여부
}

const Header = ({ name, isInput }: HeaderProps) => {
  const logoutMutation = useLogout();

  // 로그아웃 중일 때는 useMe 훅 비활성화하여 불필요한 API 호출 방지
  // const { data: meData, isLoading, error } = useMe(!logoutMutation.isPending);

  // React Query 캐시에서 사용자 정보 가져오기 (클라이언트 쿠키 의존성 제거)
  // const isLoggedIn = !isLoading && !error && !!meData?.result;
  // const user = meData?.result || null;

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <div className="h-18 flex w-full items-center justify-between gap-5 border-b border-[#E9E9E7] px-10 py-4">
      <span className="text-xl font-bold text-[#001D6C]">{name}</span>
      <div>{isInput && <SearchInput />}</div>
      <div
        onClick={handleLogout}
        className="cursor-pointer rounded bg-[#DA1E28] px-5 py-2 text-center text-[#ffffff] hover:opacity-80"
      >
        로그아웃
      </div>
    </div>
  );
};

export default Header;
