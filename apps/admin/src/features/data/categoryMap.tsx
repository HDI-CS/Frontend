import { IndustryCategory } from '@/src/schemas/industry-data';
import { VisualCategory } from '@/src/schemas/visual-data';
import {
  ColumnDef,
  IndustrialRow,
  VisualRow,
  WithIndex,
  Years,
} from '@/src/types/data/visual-data';
import { buildFieldsFromColumns, getRowMeta } from './rowMeta';

/** VISUAL/INDUSTRY 타입에 따라 실제 카테고리 스키마 타입을 매핑 */
export type CategoryByType = {
  VISUAL: VisualCategory;
  INDUSTRY: IndustryCategory;
};

/**
 * 연도(폴더)별로 어떤 카테고리 탭을 보여줄지 정의하는 설정.
 * 새로운 차수/연도 폴더가 생기면 여기에 한 줄만 추가하면 됨.
 * (Years 타입은 string이므로 백엔드가 내려주는 어떤 폴더명이든 키로 쓸 수 있음)
 */
export const CATEGORY_MAP: Record<
  string,
  {
    VISUAL: readonly VisualCategory[];
    INDUSTRY: readonly IndustryCategory[];
  }
> = {
  '2025': {
    VISUAL: ['COSMETIC', 'FB'],
    INDUSTRY: ['VACUUM_CLEANER', 'AIR_PURIFIER', 'HAIR_DRYER'],
  },
  '2026': {
    VISUAL: ['POSTER'],
    INDUSTRY: ['HEADPHONE', 'EARPHONE', 'BLUETOOTH_SPEAKER'],
  },
  '2026 2차': {
    VISUAL: ['PACKAGE'],
    INDUSTRY: [],
  },
} as const;

/**
 * 그리드/갤러리/생성모달이 공통으로 필요로 하는
 * 컬럼 메타데이터(rowMeta)와 상세 필드 목록(fields)을 한 번에 계산.
 * 세 화면에서 각각 계산하던 걸 여기 한 곳으로 모아 중복을 제거함.
 */
export const getRowMetaAndFields = <T extends 'VISUAL' | 'INDUSTRY'>(
  type: T,
  yearName: Years | undefined,
  displayRows: WithIndex<VisualRow | IndustrialRow>[],
  activeCategory: CategoryByType[T] | null
) => {
  const rowMeta = getRowMeta(
    type,
    (yearName ?? '2025') as Years,
    displayRows,
    activeCategory ?? undefined
  );

  const fields = buildFieldsFromColumns(
    rowMeta.columns as ColumnDef<WithIndex<VisualRow | IndustrialRow>>[]
  );

  return { rowMeta, fields };
};
