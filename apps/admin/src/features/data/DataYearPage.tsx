'use client';

import excelIcon from '@/public/data/Excel.svg';
import sortIcon from '@/public/data/sortIcon.svg';
import CategoryTab from '@/src/components/data/CategoryTab';
import GalleryView from '@/src/components/data/GallerlyView';
import GridTable from '@/src/components/data/GridTable';
import SortModal from '@/src/components/data/SortModal';
import ViewToggle from '@/src/components/data/ViewToggle';
import { useCreateDataset } from '@/src/hooks/data/useCreateVisualDataset';
import { useSearchDatasets } from '@/src/hooks/data/useSearchDatasets';
import { UserType } from '@/src/schemas/auth';
import {
  CreateDatasetRequest,
  DataCategoryGroups,
  DataItem,
  DataItems,
} from '@/src/schemas/data';
import { useSearchStore } from '@/src/store/searchStore';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

export interface DataItemWithIndex extends DataItem {
  _no: number;
}

interface DataPageProps {
  type: UserType;
  yearId: number;
  categories?: DataCategoryGroups;
}

const DataPage = ({
  type = 'VISUAL',
  yearId = 1,
  categories = [],
}: DataPageProps) => {
  const [activeTab, setActiveTab] = useState<'grid' | 'gallery'>('grid');
  const [sortBtn, setSortBtn] = useState(false);
  const [sort, setSort] = useState<'first' | 'last'>('first');
  const [activeCategory, setActiveCategory] = useState('');

  useEffect(() => {
    if (categories.length > 0) {
      setActiveCategory(categories[0]?.categoryName ?? '');
    }
  }, [categories]);

  // Grid에서 “추가” 버튼 누르면 실제로 데이터 추가되게 (데모)
  // 검색어 관리
  // const { activeIndex, setResultCount } = useSearchStore();

  const keyword = useSearchStore((s) => s.keyword);
  const { data } = useSearchDatasets({
    type,
    keyword,
    category: activeCategory,
  });

  // useEffect(() => {
  //   setResultCount(searchData.length);
  // }, [searchData, setResultCount]);

  {
    /* 초기 데이터 세팅 */
  }

  const localData = useMemo(() => {
    const searchData = data?.result ?? [];
    const init: Record<string, DataItems> = {};
    for (const c of categories) {
      init[c.categoryName] = c.data ?? [];
    }

    // 검색 중이면
    if (keyword && searchData) {
      return {
        ...init,
        [activeCategory]: searchData,
      };
    }

    // 기본 데이터
    return init;
  }, [keyword, activeCategory, categories, data]);

  {
    // tabItems: CategoryTab 컴포넌트에 넘겨주기 위한 가공 데이터
    const tabItems = categories.map((c) => ({
      key: c.categoryName,
      label: c.categoryName,
    }));

    const { mutate: createDataset } = useCreateDataset({
      type,
      yearId,
    });

    const handleAddRow = () => {
      const newItem: CreateDatasetRequest = {
        code: '',
        name: '',
        sectorCategory: '',
        mainProductCategory: '',
        mainProduct: '',
        target: '',
        referenceUrl: '',
        originalLogoImage: null,
        visualDataCategory: activeCategory,
      };

      createDataset(newItem);
    };

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

    // 화살표 disabled 관리
    const lastIndex = displayRows.length - 1;

    return (
      <div className="min-h-screen bg-[#F4F7FF] px-2 pt-1.5">
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
              {/* 정렬 버튼 & 모달 */}
              <button
                className={clsx(
                  'relative flex h-[32px] w-[32px] items-center justify-center rounded border border-[#E5E5E5] bg-white',
                  activeTab === 'gallery' ? 'visible' : 'invisible'
                )}
              >
                <Image
                  onClick={() => setSortBtn((prev) => !prev)}
                  src={sortIcon}
                  alt="sort"
                  className="hover:opacity-50"
                />
                {sortBtn && <SortModal sort={sort} setSort={setSort} />}
              </button>

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
              lastIndex={lastIndex}
            />
          ) : (
            <div className="border border-t-0 border-[#E9E9E7] bg-white p-3">
              <GalleryView
                rows={displayRows}
                onAdd={handleAddRow}
                lastIndex={lastIndex}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
};
export default DataPage;
