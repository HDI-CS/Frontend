'use client';
import SearchInput from '../SearchInput';

interface HeaderProps {
  name: string;
  isInput?: boolean; // input창 필요 여부
}

const Header = ({ name, isInput }: HeaderProps) => {
  return (
    <div className="h-18 flex w-full items-center justify-between gap-5 border-b border-[#E9E9E7] px-10 py-4">
      <span className="text-xl font-bold text-[#001D6C]">{name}</span>
      <div>{isInput && <SearchInput resultCount={8} currentIndex={1} />}</div>
      <div className="cursor-pointer rounded bg-[#DA1E28] px-5 py-2 text-center text-[#ffffff] hover:opacity-80">
        로그아웃
      </div>
    </div>
  );
};

export default Header;
