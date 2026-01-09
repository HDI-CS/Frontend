import downIcon from '@/public/common/search/downA.svg';
import searchIcon from '@/public/common/search/search.svg';
import upIcon from '@/public/common/search/upA.svg';
import Image from 'next/image';
import { useSearchStore } from '../store/searchStore';

const SearchInput = () => {
  const { keyword, setKeyword, activeIndex, setActiveIndex, resultCount } =
    useSearchStore();

  const lastIndex = resultCount ?? 0;

  const handleUp = () => {
    setActiveIndex(Math.max(1, activeIndex - 1));
  };

  const handleDown = () => {
    setActiveIndex(Math.min(resultCount, activeIndex + 1));
  };

  return (
    <div className="min-w-100 flex items-center justify-between rounded-full bg-[#F6F7F8] px-4 py-2.5">
      <div className="flex items-center gap-1.5">
        <Image src={searchIcon} alt="검색 아이콘" width={19} height={19} />
        <input
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
          }}
          placeholder="검색"
          className="flex-1 font-bold text-[#3A3A49] outline-none placeholder:font-light placeholder:text-[#8D8D8D]"
        />
      </div>
      <div>
        {resultCount > 0 && (
          <div className="flex gap-1">
            <span className="px-1 font-light text-[#A1A0A1]">
              {activeIndex} of {lastIndex}
            </span>
            <Image
              onClick={handleUp}
              src={upIcon}
              alt="up"
              width={15}
              className="cursor-pointer hover:opacity-80"
            />
            <Image
              onClick={handleDown}
              src={downIcon}
              alt="down"
              className="cursor-pointer hover:opacity-80"
            />
          </div>
        )}
      </div>
    </div>
  );
};
export default SearchInput;

// Debounce 후 자동 검색 요청
