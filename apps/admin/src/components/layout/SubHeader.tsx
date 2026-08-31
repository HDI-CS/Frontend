import { useSubHeaderStore } from '@/src/store/subHeaderStore';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

const TYPE_LABEL: Record<string, string> = {
  visual: '시각디자인',
  industry: '산업디자인',
};

const MENU_LABEL: Record<string, string> = {
  data: '데이터 관리',
  evaluation: '평가 관리',
  expert: '전문가 관리',
  'id-mapping': '평가 데이터 ID',
};
// const EXTRA_LABEL_MAP: Record<string, string> = {
//   'id-mapping': '평가 데이터 ID',
//   year1: '1차년도',
//   year2: '2차년도',
// };

const SubHeader = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const pathname = usePathname();
  const { extraLabel } = useSubHeaderStore();

  if (!mounted) {
    // ⭐️ SSR + hydration 단계에서는 Home만 렌더링
    return (
      <div className="w-full bg-[#F4F7FF] px-8 py-4 text-xl font-bold text-[#001D6C]">
        <span>Home: </span>
      </div>
    );
  }

  const segments = pathname.split('/').filter(Boolean);
  const [type, first, second] = segments;

  const breadcrumbParts: string[] = [];

  // 1️⃣ 타입 (industry / visual)
  if (type && TYPE_LABEL[type]) {
    breadcrumbParts.push(TYPE_LABEL[type]);
  }

  // 2️⃣ 1차 메뉴 (expert, data, evaluation)
  if (first && MENU_LABEL[first]) {
    breadcrumbParts.push(MENU_LABEL[first]);
  }

  // 3️⃣ 2차 메뉴 (id-mapping 등)
  if (second && MENU_LABEL[second]) {
    breadcrumbParts.push(MENU_LABEL[second]);
  }

  // 4️⃣ store 기반 추가 라벨
  if (extraLabel) {
    breadcrumbParts.push(extraLabel);
  }

  const breadcrumb = breadcrumbParts.join(' / ');

  return (
    <div className="text-bold20 w-full cursor-pointer bg-[#F4F7FF] px-8 py-4 text-[#001D6C]">
      <span>Home: </span>
      <span className="">{breadcrumb}</span>
    </div>
  );
};

export default SubHeader;
