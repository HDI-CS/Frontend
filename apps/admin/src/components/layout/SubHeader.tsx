import { usePathname } from 'next/navigation';

const LABEL_MAP: Record<string, string> = {
  index: '시각디자인',
  data: '데이터 관리',
  evaluation: '평가 관리',
  expert: '전문가 관리',
  year1: '1차년도',
  year2: '2차년도',
};
const SubHeader = () => {
  const pathname = usePathname();

  // '/index/data/year1' → ['index', 'data', 'year1']
  const segments = pathname.split('/').filter(Boolean);

  const breadcrumb = segments
    .map((seg) => LABEL_MAP[seg])
    .filter(Boolean)
    .join(' / ');

  return (
    <div className="w-full bg-[#F4F7FF] px-8 py-4 text-xl font-bold text-[#001D6C]">
      <span>Home: </span>
      <span className="">{breadcrumb}</span>
    </div>
  );
};

export default SubHeader;
