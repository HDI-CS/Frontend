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
import {
  IndustrialDataItem,
  IndustryCategory,
} from '@/src/schemas/industry-data';
import { VisualCategory, VisualDataItem } from '@/src/schemas/visual-data';
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
import DataDetailModal from '@/src/components/data/DataDetailModal';
import useGridManager from '@/src/hooks/useGridManager';
import { sortByString } from '@/src/utils/sortByType';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { rowMeta } from './rowMeta';

export type CategoryByType = {
  VISUAL: VisualCategory;
  INDUSTRY: IndustryCategory;
};

type ItemByType = {
  VISUAL: VisualDataItem;
  INDUSTRY: IndustrialDataItem;
};

const DataPage = <T extends 'VISUAL' | 'INDUSTRY'>({
  type,
  yearId = 1,
  categories = [],
}: DataPageProps & { type: T }) => {
  const categorieItem = useMemo<CategoryByType[T][]>(() => {
    if (type === 'VISUAL') {
      return ['COSMETIC', 'FB'] as CategoryByType[T][];
    }

    return [
      'VACUUM_CLEANER',
      'AIR_PURIFIER',
      'HAIR_DRYER',
    ] as CategoryByType[T][];
  }, [type]);
  const { orderBy, setOrderBy, sortType, setSortType } = useGridManager(type!);
  const [activeTab, setActiveTab] = useState<'grid' | 'gallery'>('grid');
  const [sortBtn, setSortBtn] = useState(false);
  const [activeCategory, setActiveCategory] = useState<
    CategoryByType[T] | null
  >(null);
  const [isAdd, setIsAdd] = useState(false);

  useEffect(() => {
    setActiveCategory((prev) => {
      if (prev && categories.some((c) => c.categoryName === prev)) {
        return prev;
      }

      return categorieItem[0] as CategoryByType[T] | null;
    });
  }, [categorieItem, categories]);

  // Grid에서 “추가” 버튼 누르면 실제로 데이터 추가되게 (데모)
  // 검색어 관리
  // const { activeIndex, setResultCount } = useSearchStore();

  const { keyword, setResultFromData, clear } = useSearchStore();

  const { data } = useSearchDatasets({
    type,
    keyword,
    category: activeCategory ?? undefined,
  });

  {
    /* 초기 데이터 세팅 */
  } // 카테고리 단위 데이터는 “무조건 배열”로 고정

  const localData = useMemo<DatasetByCategory>(() => {
    const init: DatasetByCategory = {};

    for (const c of categories) {
      init[c.categoryName] = c.data ?? [];
    }

    if (!activeCategory) return init;

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

  const { mutate: createDataset } = useCreateDataset();

  // 생성
  const handleAddRow = () => {
    if (!activeCategory) return;
    setIsAdd(true);

    if (type === 'VISUAL') {
      const visualCategory = activeCategory as VisualCategory;

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
          visualDataCategory: visualCategory,
        },
      });
      return;
    }

    if (type === 'INDUSTRY') {
      const industryDataCategory = activeCategory as IndustryCategory;

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
          industryDataCategory: industryDataCategory,
        },
      });
      return;
    }
  };

  // 테이블 정리 함수
  const displayRows = useMemo(() => {
    if (!activeCategory) return [];

    const activeData = localData[activeCategory] ?? [];
    const sorted = [...activeData].sort((a, b) => {
      if (sortType === 'ID') {
        return sortByString(a.code, b.code, orderBy);
      }

      if (type === 'INDUSTRY') {
        switch (sortType) {
          case 'COMPANY':
            return sortByString(a.companyName, b.companyName, orderBy);
          case 'MODEL':
            return sortByString(a.modelName, b.modelName, orderBy);
          case 'PRODUCT':
            return sortByString(a.productName, b.productName, orderBy);
          default:
            return 0;
        }
      }
      if (type === 'VISUAL') {
        switch (sortType) {
          case 'NAME':
            return sortByString(a.name, b.name, orderBy);
          case 'SECTOR':
            return sortByString(a.sectorCategory, b.sectorCategory, orderBy);
          case 'MAINPRODUCT':
            return sortByString(a.mainProduct, b.mainProduct, orderBy);
          case 'MAINCATEGORY':
            return sortByString(
              a.mainProductCategory,
              b.mainProductCategory,
              orderBy
            );
          default:
            return 0;
        }
      }

      return 0;
    });
    return sorted.map((item, idx) =>
      type === 'VISUAL'
        ? mapVisualToUIItem(
            item as ItemByType['VISUAL'],
            idx,
            item.name ?? '',
            item.sectorCategory ?? '',
            item.mainProduct ?? '',
            item.mainProductCategory ?? ''
          )
        : mapIndustryToUIItem(
            item as ItemByType['INDUSTRY'],
            idx,
            item.productName ?? '',
            item.modelName ?? '',
            item.companyName ?? ''
          )
    );

    // return sorted.map((item, idx) =>
    //   type === 'VISUAL'
    //     ? mapVisualToUIItem(item as ItemByType['VISUAL'], idx)
    //     : mapIndustryToUIItem(
    //         item as ItemByType['INDUSTRY'],
    //         idx,
    //         item.productName ?? '',
    //         item.modelName ?? '',
    //         item.companyName ?? ''
    //       )
    // );
  }, [localData, activeCategory, orderBy, type, sortType]);

  useEffect(() => {
    // 검색어가 있을 때만 검색 결과 카운트 반영
    if (keyword.length > 0) {
      setResultFromData(displayRows);
    } else {
      clear(); // 검색어 없으면 초기화 (선택)
    }
  }, [keyword, displayRows, setResultFromData, clear]);

  // 화살표 disabled 관리
  const lastIndex = displayRows?.length ?? 2 - 1;

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
        <div className="relative flex items-center justify-between border-b border-[#E5E5E5]">
          <CategoryTab
            type={type}
            categories={categorieItem}
            activeKey={activeCategory!}
            onChange={setActiveCategory}
            onAdd={() => console.log('카테고리 추가')}
          />

          {/* Grid / Gallery */}
          {/* md 이상에서만 중앙 고정 */}

          <div className="hidden md:absolute md:left-1/2 md:block md:-translate-x-1/2">
            <ViewToggle activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          {/* 모바일용 위치 */}
          <div className="ml-auto md:hidden">
            <ViewToggle activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

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
              {sortBtn && <SortModal sort={orderBy} setSort={setOrderBy} />}
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
            <GridTable<VisualRow, 'VISUAL'>
              type={'VISUAL'}
              rows={displayRows as WithIndex<VisualRow>[]}
              columns={rowMeta.VISUAL.columns}
              onAddRow={handleAddRow}
              orderBy={orderBy}
              setOrderBy={setOrderBy}
              setSortType={setSortType}
              lastIndex={lastIndex}
              activeCategory={activeCategory as VisualCategory}
            />
          ) : (
            <GridTable<IndustrialRow, 'INDUSTRY'>
              type={'INDUSTRY'}
              rows={displayRows as WithIndex<IndustrialRow>[]}
              columns={rowMeta.INDUSTRY.columns}
              onAddRow={handleAddRow}
              orderBy={orderBy}
              setOrderBy={setOrderBy}
              setSortType={setSortType}
              lastIndex={lastIndex}
              activeCategory={activeCategory as IndustryCategory}
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
                orderBy={orderBy}
                setOrderBy={setOrderBy}
                lastIndex={lastIndex}
                activeCategory={activeCategory!}
              />
            ) : (
              <GalleryView<IndustrialRow>
                type={'INDUSTRY'}
                rows={displayRows as WithIndex<IndustrialRow>[]}
                galleryFields={rowMeta.INDUSTRY.galleryFields}
                orderBy={orderBy}
                setOrderBy={setOrderBy}
                onAdd={handleAddRow}
                lastIndex={lastIndex}
                activeCategory={activeCategory!}
              />
            )}
          </div>
        )}

        {isAdd &&
          activeCategory &&
          (type === 'VISUAL' ? (
            <DataDetailModal<VisualRow, 'VISUAL'>
              type={'VISUAL'}
              isEdit={true}
              isAdd={isAdd}
              activeCategory={activeCategory as VisualCategory}
              onClose={() => {
                setIsAdd(false);
              }}
              totalLength={displayRows?.length ?? 1}
            />
          ) : (
            <DataDetailModal
              type={'INDUSTRY'}
              isEdit={true}
              isAdd={isAdd}
              activeCategory={activeCategory as IndustryCategory}
              onClose={() => {
                setIsAdd(false);
              }}
              totalLength={displayRows?.length ?? 1}
            />
          ))}
      </div>
    </div>
  );
};

export default DataPage;
