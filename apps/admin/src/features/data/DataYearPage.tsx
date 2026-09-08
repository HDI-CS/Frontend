'use client';

import excelIcon from '@/public/data/Excel.svg';
import sortIcon from '@/public/data/sortIcon.svg';
import imgDown from '@/public/data/zip-icon.png';
import CategoryTab from '@/src/components/data/CategoryTab';
import GalleryView from '@/src/components/data/GallerlyView';
import GridTable from '@/src/components/data/GridTable';
import SortModal from '@/src/components/data/SortModal';
import ViewToggle from '@/src/components/data/ViewToggle';
import { useSearchDatasets } from '@/src/hooks/data/useSearchDatasets';
import {
  IndustrialDataItem,
  IndustryCategory,
} from '@/src/schemas/industry-data';
import { VisualCategory, VisualDataItem } from '@/src/schemas/visual-data';
import { useSearchStore } from '@/src/store/searchStore';
import {
  ColumnDef,
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
import { useDatasetDownload } from '@/src/hooks/useDatasetDownload';
import { compareDatasetRows } from '@/src/hooks/useDatasetSort';
import useGridManager from '@/src/hooks/useGridManager';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import {
  CATEGORY_MAP,
  CategoryByType,
  getRowMetaAndFields,
} from './categoryMap';
import { GalleryFieldDef } from './uiDef';

type ItemByType = {
  VISUAL: VisualDataItem;
  INDUSTRY: IndustrialDataItem;
};

const DataPage = <T extends 'VISUAL' | 'INDUSTRY'>({
  type,
  yearId = 1,
  categories = [],
  yearName,
}: DataPageProps & { type: T }) => {
  // ── 현재 연도 폴더에서 보여줄 카테고리 탭 목록 ──────────────

  const categorieItem = useMemo(() => {
    if (!yearName) return [];

    const yearConfig = CATEGORY_MAP[yearName];
    if (!yearConfig) return [];

    return type === 'VISUAL'
      ? [...yearConfig.VISUAL]
      : [...yearConfig.INDUSTRY];
  }, [yearName, type]);

  const { orderBy, setOrderBy, sortType, setSortType } = useGridManager(type!);
  const [activeTab, setActiveTab] = useState<'grid' | 'gallery'>('grid');
  const [sortBtn, setSortBtn] = useState(false);
  const [activeCategory, setActiveCategory] = useState<
    VisualCategory | IndustryCategory | null
  >(null);
  const [isAdd, setIsAdd] = useState(false);
  const [rowIds, setRowIds] = useState<number[]>([]);

  // 카테고리 목록이 바뀌면(연도 변경 등) 활성 탭을 유효한 값으로 재조정
  useEffect(() => {
    setActiveCategory((prev) => {
      if (prev && categories.some((c) => c.categoryName === prev)) {
        return prev;
      }

      return categorieItem[0] as CategoryByType[T] | null;
    });
  }, [categorieItem, categories]);

  // ── 검색 ──────────────────────────────────────────────
  // const { activeIndex, setResultCount } = useSearchStore();
  const { keyword, setResultFromData, clear } = useSearchStore();
  const { data } = useSearchDatasets({
    type,
    keyword,
    category: activeCategory ?? undefined,
  });

  // 카테고리별 원본 데이터. 검색어가 있으면 활성 카테고리 데이터를 검색 결과로 교체
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

  // ── 화면에 보여줄 최종 row 목록 (정렬 + UI 아이템 매핑) ──────
  const displayRows = useMemo(() => {
    if (!activeCategory) return [];

    const activeData = localData[activeCategory] ?? [];
    const sorted = [...activeData].sort((a, b) =>
      compareDatasetRows(a, b, type, sortType, orderBy)
    );

    return sorted.map((item, idx) =>
      type === 'VISUAL'
        ? mapVisualToUIItem(
            item as ItemByType['VISUAL'],
            idx,
            item.name ?? null,
            item.sectorCategory ?? null,
            item.mainProductCategory ?? null,
            item.mainProduct ?? null
          )
        : mapIndustryToUIItem(
            item as ItemByType['INDUSTRY'],
            idx,
            item.productName ?? '',
            item.companyName ?? '',
            item.modelName ?? ''
          )
    );
  }, [localData, activeCategory, orderBy, type, sortType]);

  // 검색어가 있을 때만 검색창에 결과 개수 반영
  useEffect(() => {
    if (keyword.length > 0) {
      setResultFromData(displayRows);
    } else {
      clear();
    }
  }, [keyword, displayRows, setResultFromData, clear]);

  const lastIndex = displayRows?.length ?? 2 - 1;

  // ── 다운로드(엑셀/이미지 zip) ─────────────────────────────
  const { isDownload, handleDownload, handleImageDownload } =
    useDatasetDownload({
      type,
      yearId,
      activeCategory,
    });

  // ── 신규 데이터 생성 ───────────────────────────────────
  const handleAddRow = () => {
    if (!activeCategory) return;
    setIsAdd(true);
  };

  // 그리드/갤러리/생성모달이 공통으로 쓰는 컬럼 메타 + 상세 필드 목록
  const { rowMeta, fields } = getRowMetaAndFields(
    type,
    yearName,
    displayRows as WithIndex<VisualRow | IndustrialRow>[],
    activeCategory as CategoryByType[T] | null
  );

  return (
    <div className="min-h-screen bg-[#F4F7FF] px-2 pt-1.5">
      <div className="">
        {/* 상단 */}
        {/*
          카테고리 탭 / Grid-Gallery 토글 / 우측 버튼을 grid 3열로 배치한다.
          예전엔 토글을 absolute + left-1/2 로 중앙에 "얹어놓는" 방식이라
          화면이 좁아져 카테고리 탭 영역이 중앙까지 넓어지면 토글과 겹쳤다.
          좌우 열을 동일한 1fr로 맞춰 가운데 열(토글)이 바 전체의
          정확한 중앙에 오도록 하면서도, grid 트랙이 실제 공간을
          점유하므로 구조적으로 겹칠 수 없게 한다.
        */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-[#E5E5E5]">
          {/* 탭 영역: 넘치면 스크롤, 남은 공간만 차지 */}
          <div className="scrollbar-hidden min-w-0 max-w-[600px] overflow-x-auto overflow-y-hidden">
            <CategoryTab
              type={type}
              categories={categorieItem}
              activeKey={activeCategory!}
              onChange={setActiveCategory}
            />
          </div>

          {/* Grid / Gallery */}
          <div className="justify-self-center">
            <ViewToggle activeTab={activeTab} setActiveTab={setActiveTab} />
          </div>

          <div className="flex gap-3 justify-self-end">
            {/* 정렬 버튼 & 모달 */}
            <button
              className={clsx(
                'relative flex h-[32px] w-[32px] items-center justify-center rounded border border-[#E5E5E5] bg-white hover:opacity-50'
              )}
            >
              {activeTab === 'grid' ? (
                <Image
                  onClick={
                    isDownload
                      ? undefined
                      : () => handleImageDownload(rowIds, () => setRowIds([]))
                  }
                  src={imgDown}
                  alt="img-download"
                  width={16}
                  className="felx cursor-pointer items-center justify-center"
                />
              ) : (
                <Image
                  onClick={() => setSortBtn((prev) => !prev)}
                  src={sortIcon}
                  alt="sort"
                  className="hover:opacity-50"
                />
              )}
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
              type="VISUAL"
              rows={displayRows as WithIndex<VisualRow>[]}
              rowIds={rowIds}
              columns={
                rowMeta.columns as ColumnDef<
                  WithIndex<VisualRow | IndustrialRow>
                >[]
              }
              fields={fields}
              onAddRow={handleAddRow}
              orderBy={orderBy}
              setOrderBy={setOrderBy}
              setSortType={setSortType}
              lastIndex={lastIndex}
              activeCategory={activeCategory as VisualCategory}
              setRowIds={setRowIds}
            />
          ) : (
            <GridTable<IndustrialRow, 'INDUSTRY'>
              type="INDUSTRY"
              rows={displayRows as WithIndex<IndustrialRow>[]}
              rowIds={rowIds}
              columns={
                rowMeta.columns as ColumnDef<
                  WithIndex<IndustrialRow | VisualRow>
                >[]
              }
              fields={fields}
              onAddRow={handleAddRow}
              orderBy={orderBy}
              setOrderBy={setOrderBy}
              setSortType={setSortType}
              lastIndex={lastIndex}
              activeCategory={activeCategory as IndustryCategory}
              setRowIds={setRowIds}
            />
          )
        ) : (
          <div className="border border-t-0 border-[#E9E9E7] bg-white p-3">
            {type === 'VISUAL' ? (
              <GalleryView<VisualRow>
                type="VISUAL"
                rows={displayRows as WithIndex<VisualRow>[]}
                galleryFields={
                  rowMeta.galleryFields as GalleryFieldDef<
                    WithIndex<VisualRow>
                  >[]
                }
                fields={fields}
                onAdd={handleAddRow}
                orderBy={orderBy}
                setOrderBy={setOrderBy}
                lastIndex={lastIndex}
                activeCategory={activeCategory!}
              />
            ) : (
              <GalleryView<IndustrialRow>
                type="INDUSTRY"
                rows={displayRows as WithIndex<IndustrialRow>[]}
                galleryFields={
                  rowMeta.galleryFields as GalleryFieldDef<
                    WithIndex<IndustrialRow>
                  >[]
                }
                fields={fields}
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
              type="VISUAL"
              isEdit={true}
              isAdd={isAdd}
              fields={fields}
              activeCategory={activeCategory as VisualCategory}
              onClose={() => {
                setIsAdd(false);
              }}
              totalLength={displayRows?.length ?? 1}
            />
          ) : (
            <DataDetailModal<IndustrialRow, 'INDUSTRY'>
              type="INDUSTRY"
              isEdit={true}
              isAdd={isAdd}
              fields={fields}
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
