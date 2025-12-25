'use client';

import dior from '@/public/data/dior.svg';
import empty from '@/public/data/EmptyIMg.svg';
import excelIcon from '@/public/data/Excel.svg';
import sortIcon from '@/public/data/sortIcon.svg';
import CategoryTab from '@/src/components/data/CategoryTab';
import GalleryView from '@/src/components/data/GallerlyView';
import GridTable from '@/src/components/data/GridTable';
import SortModal from '@/src/components/data/SortModal';
import ViewToggle from '@/src/components/data/ViewToggle';
import { VisualDataItem } from '@/src/types/data/visual-data';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

interface VisualDataCategory {
  categoryName: string;
  data?: VisualDataItem[];
}

const DUMMY_CATEGORIES: VisualDataCategory[] = [
  {
    categoryName: 'BEAUTY',
  },
  {
    categoryName: 'FB',
    data: [
      {
        id: 1,
        code: '0101',
        name: '스타벅스',
        sectorCategory: 'cafe',
        mainProductCategory: '식품>음료>커피',
        mainProduct: '아메리카노',
        target: '전연령',
        referenceUrl: 'www.starbucks.co.kr',
        logoImage: dior,
      },
      {
        id: 2,
        code: '0102',
        name: '스타벅스',
        sectorCategory: 'cafe',
        mainProductCategory: '식품>음료>커피',
        mainProduct: '아메리카노',
        target: '전연령',
        referenceUrl: 'www.starbucks.co.kr',
        logoImage: dior,
      },
      {
        id: 3,
        code: '0103',
        name: '스타벅스',
        sectorCategory: 'cafe',
        mainProductCategory: '식품>음료>커피',
        mainProduct: '아메리카노',
        target: '전연령',
        referenceUrl: 'www.starbucks.co.kr',
        logoImage: dior,
      },
    ],
  },
];

const CATEGORY_LABEL_MAP: Record<string, string> = {
  BEAUTY: '뷰티로고',
  FB: 'F&B로고',
};

const DataPage = () => {
  const [categories, setCategories] = useState<VisualDataCategory[]>([]);
  const [activeCategory, setActiveCategory] = useState('BEAUTY');
  const [activeTab, setActiveTab] = useState<'grid' | 'gallery'>('grid');
  const [sortBtn, setSortBtn] = useState(false);
  const [sort, setSort] = useState<'first' | 'last'>('first');

  // Grid에서 “추가” 버튼 누르면 실제로 데이터 추가되게 (데모)
  const [localData, setLocalData] = useState<Record<string, VisualDataItem[]>>( // BEAUTY: VisualDataItem[],   FB: VisualDataItem[], ...
    {}
  );

  // tabItems: CategoryTab 컴포넌트에 넘겨주기 위한 가공 데이터
  const tabItems = categories.map((c) => ({
    key: c.categoryName,
    label: CATEGORY_LABEL_MAP[c.categoryName] ?? c.categoryName,
  }));

  /* 초기 데이터 세팅 */
  useEffect(() => {
    setCategories(DUMMY_CATEGORIES);

    const init: Record<string, VisualDataItem[]> = {};
    for (const c of DUMMY_CATEGORIES) {
      init[c.categoryName] = c.data ?? []; // 핵심
    }
    setLocalData(init);
  }, []);

  const handleAddRow = () => {
    setLocalData((prev) => {
      const current = prev[activeCategory] ?? [];

      return {
        ...prev,
        [activeCategory]: [...current, createEmptyRow()],
      };
    });
  };

  const createEmptyRow = (): VisualDataItem => ({
    id: Date.now(), // 임시 ID
    code: '',
    name: '',
    sectorCategory: '',
    mainProductCategory: '',
    mainProduct: '',
    target: '',
    referenceUrl: '',
    logoImage: empty,
  });

  // 테이블 정리 함수
  const displayRows = useMemo(() => {
    const activeData = localData[activeCategory] ?? [];

    const sorted = [...activeData].sort((a, b) => {
      // 1. code 없는 애는 무조건 뒤로
      if (!a.code && b.code) return 1;
      if (a.code && !b.code) return -1;

      // 2. 둘 다 있으면 기존 정렬
      return sort === 'first'
        ? a.code.localeCompare(b.code)
        : b.code.localeCompare(a.code);
    });

    return sorted.map((r, idx) => ({ ...r, _no: idx + 1 }));
  }, [localData, activeCategory, sort]);

  return (
    <div className=" bg-[#F4F7FF] px-2 pt-1.5">
      <div className="">
        {/* 상단 */}
        <div className="flex items-center justify-between border-b border-[#E5E5E5]">
          <CategoryTab
            categories={tabItems}
            activeKey={activeCategory}
            onChange={setActiveCategory}
            onAdd={() => console.log('카테고리 추가')}
          />

          {/* Grid / Gallery */}
          <ViewToggle activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="flex gap-3">
            {activeTab === 'gallery' && (
              <>
                <button className="relative flex h-[32px] w-[32px] items-center justify-center rounded border border-[#E5E5E5] bg-white">
                  <Image
                    onClick={() => setSortBtn((prev) => !prev)}
                    src={sortIcon}
                    alt="sort"
                    className="hover:opacity-50"
                  />
                  {sortBtn && <SortModal sort={sort} setSort={setSort} />}
                </button>
              </>
            )}
            {/* Excel */}
            <button className="flex h-[32px] w-[32px] items-center justify-center rounded border border-[#E5E5E5] bg-white hover:opacity-50">
              <Image src={excelIcon} alt="excel" width={16} height={16} />
            </button>
          </div>
        </div>

        {/* content */}
        {activeTab === 'grid' ? (
          <GridTable
            rows={displayRows}
            onAddRow={handleAddRow}
            orderBy={sort}
            setOrderBy={setSort}
          />
        ) : (
          <div className="border border-t-0 border-[#E9E9E7] bg-white p-3">
            <GalleryView items={displayRows} onAdd={handleAddRow} />
          </div>
        )}
      </div>
    </div>
  );
};

export default DataPage;
