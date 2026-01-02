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
import { IndustrialDataItem } from '@/src/schemas/industry-data';
import { VisualDataItem } from '@/src/schemas/visual-data';
import { downloadExcel } from '@/src/services/data/common';
import { useSearchStore } from '@/src/store/searchStore';
import {
  DatasetByCategory,
  DatasetItems,
  IndustrialRow,
  mapIndustryToUIItem,
  mapVisualToUIItem,
  VisualRow,
  WithIndex,
} from '@/src/types/data/visual-data';

import { DataPageProps } from '@/src/app/[type]/data/[year]/page';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { rowMeta } from './rowMeta';

const DataPage = ({ type, yearId = 1, categories = [] }: DataPageProps) => {
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
    type: type ?? 'VISUAL',
    keyword,
    category: activeCategory,
  });

  {
    /* 초기 데이터 세팅 */
  } // 카테고리 단위 데이터는 “무조건 배열”로 고정

  const localData = useMemo<DatasetByCategory>(() => {
    const init: DatasetByCategory = {};

    for (const c of categories) {
      init[c.categoryName] = c.data ?? [];
    }

    if (keyword.length && data?.result) {
      const normalizedSearchData: DatasetItems = Array.isArray(data.result)
        ? data.result
        : [data.result];

      return {
        ...init,
        [activeCategory]: normalizedSearchData,
      };
    }
    return init;
  }, [keyword, activeCategory, categories, data]);

  {
    // tabItems: CategoryTab 컴포넌트에 넘겨주기 위한 가공 데이터
    const tabItems = categories.map((c) => ({
      key: c.categoryName,
      label: c.categoryName,
    }));

    const { mutate: createDataset } = useCreateDataset();

    // 생성
    const handleAddRow = () => {
      if (type === 'VISUAL') {
        createDataset({
          type: 'VISUAL',
          yearId,
          categoryName: activeCategory,
          requestData: {
            code: '',
            name: '',
            sectorCategory: '',
            mainProductCategory: '',
            mainProduct: '',
            target: '',
            referenceUrl: '',
            originalLogoImage: null,
            visualDataCategory: activeCategory,
          },
        });
        return;
      }

      if (type === 'INDUSTRY') {
        createDataset({
          type: 'INDUSTRY',
          yearId,
          categoryName: activeCategory,
          requestData: {
            code: '',
            productName: '',
            companyName: '',
            modelName: '',
            price: '',
            material: '',
            size: '',
            weight: '',
            referenceUrl: '',
            registeredAt: '',
            productPath: '',
            productTypeName: '',
            // 이미지들은 초기엔 없음
            originalDetailImagePath: null,
            originalFrontImagePath: null,
            originalSideImagePath: null,
          },
        });
        return;
      }
    };

    // 테이블 정리 함수
    const displayRows = useMemo(() => {
      const activeData = localData[activeCategory] ?? [];

      const sorted = [...activeData].sort((a, b) => {
        if (!a.code && b.code) return 1;
        if (a.code && !b.code) return -1;

        return sort === 'first'
          ? a.code.localeCompare(b.code)
          : b.code.localeCompare(a.code);
      });

      return sorted.map((item, idx) =>
        type === 'VISUAL'
          ? mapVisualToUIItem(item as VisualDataItem, idx)
          : mapIndustryToUIItem(item as IndustrialDataItem, idx)
      );
    }, [localData, activeCategory, sort, type]);

    // 화살표 disabled 관리
    const lastIndex = displayRows.length - 1;

    {
      /* 엑셀 다운로드 */
    }
    const handleDownload = async () => {
      const res = await downloadExcel({ type: type ?? 'VISUAL', yearId });

      const blob = new Blob([res.data], {
        type: res.headers['content-type'],
      });

      // 파일명 추출 (서버가 내려준 filename 사용)
      const disposition = res.headers['content-disposition'];
      const filenameMatch = disposition?.match(/filename\*=UTF-8''(.+)/);
      const filename = filenameMatch
        ? decodeURIComponent(filenameMatch[1])
        : 'visual_data.xlsx';

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    };

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
              <button
                onClick={handleDownload}
                className="flex h-[32px] w-[32px] items-center justify-center rounded border border-[#E5E5E5] bg-white hover:opacity-50"
              >
                <Image src={excelIcon} alt="excel" width={16} height={16} />
              </button>
            </div>
          </div>

          {/* content */}
          {activeTab === 'grid' ? (
            type === 'VISUAL' ? (
              <GridTable<VisualRow>
                type={'VISUAL'}
                rows={displayRows as WithIndex<VisualRow>[]}
                columns={rowMeta.VISUAL.columns}
                onAddRow={handleAddRow}
                orderBy={sort}
                setOrderBy={setSort}
                lastIndex={lastIndex}
                activeCategory={activeCategory}
              />
            ) : (
              <GridTable<IndustrialRow>
                type={'INDUSTRY'}
                rows={displayRows as WithIndex<IndustrialRow>[]}
                columns={rowMeta.INDUSTRY.columns}
                onAddRow={handleAddRow}
                orderBy={sort}
                setOrderBy={setSort}
                lastIndex={lastIndex}
                activeCategory={activeCategory}
              />
            )
          ) : (
            <div className="border border-t-0 border-[#E9E9E7] bg-white p-3">
              {type === 'VISUAL' ? (
                <GalleryView<VisualRow>
                  type={'VISUAL'}
                  rows={displayRows as WithIndex<VisualRow>[]}
                  galleryFields={rowMeta.VISUAL.galleryFields}
                  onAdd={handleAddRow}
                  orderBy={sort}
                  setOrderBy={setSort}
                  lastIndex={lastIndex}
                  activeCategory={activeCategory}
                />
              ) : (
                <GalleryView<IndustrialRow>
                  type={'INDUSTRY'}
                  rows={displayRows as WithIndex<IndustrialRow>[]}
                  galleryFields={rowMeta.INDUSTRY.galleryFields}
                  orderBy={sort}
                  setOrderBy={setSort}
                  onAdd={handleAddRow}
                  lastIndex={lastIndex}
                  activeCategory={activeCategory}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
};
export default DataPage;
