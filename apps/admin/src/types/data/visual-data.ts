import { BaseDatasetItem } from '@/src/hooks/data/useCreateVisualDataset';
import {
  CreateIndustrialDatasetRequest,
  GetDetailIndustrialDataByCategoryResponse,
  GetIndustrialDataByCategoryResponse,
  GetIndustrialDataByKeywordyResponse,
  IndustrialDataItem,
  IndustryCategory,
  UpdateIndustrialDatasetRequest,
} from '@/src/schemas/industry-data';
import {
  CreateVisualDatasetRequest,
  GetDetailVisualDataByCategoryResponse,
  GetVisualDataByCategoryResponse,
  GetVisualDataByKeywordyResponse,
  UpdateVisualDatasetRequest,
  VisualCategory,
} from '@/src/schemas/visual-data';

export interface DatasetUIItem {
  id: number;
  code: string;
  referenceUrl?: string;
  _no?: number;
  // 정렬을 위한 필드 추가
  // visual
  name?: string;
  sectorCategory?: string;
  mainProductCategory?: string;
  mainProduct?: string;

  // industry
  productName?: string;
  companyName?: string;
  modelName?: string;
}

export const mapVisualToUIItem = (
  item: VisualDataItem,
  index: number,
  name: string,
  sectorCategory: string,
  mainProductCategory: string,
  mainProduct: string
): DatasetUIItem => ({
  ...item,
  _no: index + 1,
  name,
  sectorCategory,
  mainProductCategory,
  mainProduct,
});

export const mapIndustryToUIItem = (
  item: IndustrialDataItem,
  index: number,
  // 정렬을 위한 필드 추가
  productName: string,
  companyName: string,
  modelName: string
): DatasetUIItem => ({
  ...item,
  _no: index + 1,
  productName,
  companyName,
  modelName,
});

export type VisualDataItem = {
  id: number;
  code: string;
  name: string;
  sectorCategory: string;
  mainProductCategory: string;
  mainProduct: string;
  target: string;
  referenceUrl: string;
  logoImage: string | null;
};

export type VisualDataCategory = {
  categoryName: string;
  data: VisualDataItem[];
};

export type IndustriaDataCategory = {
  categoryName: string;
  data: IndustrialDataItem[];
};

export const mapVisualDatasetItem = (
  input: UpdateVisualDatasetRequest & { id: number }
): BaseDatasetItem & {
  name: string;
  sectorCategory: string;
  mainProductCategory: string;
  mainProduct: string;
  target: string;
  logoImage: string | null;
} => ({
  id: input.id,
  code: input.code ?? '',
  name: input.name ?? '',
  sectorCategory: input.sectorCategory ?? '',
  mainProductCategory: input.mainProductCategory ?? '',
  mainProduct: input.mainProduct ?? '',
  target: input.target ?? '',
  referenceUrl: input.referenceUrl ?? '',
  logoImage: input.originalLogoImage ?? null, // 쿼리 매핑
});

export const mapIndustrialDatasetItem = (
  input: UpdateIndustrialDatasetRequest & { id: number }
): BaseDatasetItem & {
  productName: string;
  companyName: string;
  modelName: string;
  productTypeName: string;
  detailImagePath: string;
  frontImagePath: string;
  sideImagePath: string;
} => ({
  id: input.id,
  code: input.code ?? '',
  referenceUrl: input.referenceUrl,

  // UI에서 당장 필요한 필드만
  productName: input.productName ?? '',
  companyName: input.companyName ?? '',
  modelName: input.modelName ?? '',
  productTypeName: input.productTypeName ?? '',
  detailImagePath: input.originalDetailImagePath ?? '',
  frontImagePath: input.originalFrontImagePath ?? '',
  sideImagePath: input.originalSideImagePath ?? '',
});

export interface DatasetCategory<TItem> {
  categoryName: string;
  data: TItem[];
}

export interface DatasetListCache<TItem> {
  result: DatasetCategory<TItem>[];
}

export type DatasetCacheItemByType = {
  VISUAL: ReturnType<typeof mapVisualDatasetItem>;
  INDUSTRY: ReturnType<typeof mapIndustrialDatasetItem>;
};

export type DatasetCategoryByType = {
  VISUAL: VisualCategory;
  INDUSTRY: IndustryCategory;
};

export type CreateMutationInput =
  | {
      type: 'VISUAL';
      yearId: number;
      categoryName?: string;
      requestData: CreateVisualDatasetRequest;
      logoFile?: File | null;
      detailFile?: File | null;
      frontFile?: File | null;
      sideFile?: File | null;
    }
  | {
      type: 'INDUSTRY';
      yearId: number;
      categoryName?: string;
      requestData: CreateIndustrialDatasetRequest;
      logoFile?: File | null;
      detailFile?: File | null;
      frontFile?: File | null;
      sideFile?: File | null;
    };

export type UpdateMutationInput =
  | {
      type: 'VISUAL';
      id: number;
      requestData: UpdateVisualDatasetRequest;
      logoFile?: File | null;
      detailFile?: File | null;
      frontFile?: File | null;
      sideFile?: File | null;
    }
  | {
      type: 'INDUSTRY';
      id: number;
      requestData: UpdateIndustrialDatasetRequest;
      logoFile?: File | null;
      detailFile?: File | null;
      frontFile?: File | null;
      sideFile?: File | null;
    };

// UI 공통 타입으로 평탄화해서 분기 제거
export type DatasetItems = DatasetUIItem[];
export type DatasetByCategory = Record<string, DatasetItems>;

export type CreateDatasetParams =
  | {
      type: 'VISUAL';
      yearId: number;
      requestData: CreateVisualDatasetRequest;
    }
  | {
      type: 'INDUSTRY';
      yearId: number;
      requestData: CreateIndustrialDatasetRequest;
    };

// grid table에서 사용할 타입

export type BaseRow = {
  id: number;
  code: string;
  referenceUrl?: string;
};

// 시각
export type VisualRow = BaseRow & {
  name: string;
  sectorCategory: string;
  mainProductCategory: string;
  mainProduct: string;
  target: string;
  logoImage: string | null;
};

// 산디
export type IndustrialRow = BaseRow & {
  productName: string;
  companyName: string;
  modelName: string;
  price: string;
  material: string;
  size: string;
  weight: string;
  registeredAt: string;
  productPath: string;
  productTypeName: string;
  detailImagePath: string;
  frontImagePath: string;
  sideImagePath: string;
};

// UI용 (번호 붙여서 쓰는 경우)
export type WithIndex<T> = T & { _no: number };

// ColumnDef 타입을 정식으로 정의
export type ColumnDef<T> = {
  key: string;
  header: React.ReactNode;
  thClassName?: string;
  className?: string;
  cell: (row: T, isActiveRow: boolean) => React.ReactNode;

  /*  헤더 우클릭 핸들러 */
  onHeaderContextMenu?: (e: React.MouseEvent) => void;
};

// 타입별 데이터 년도 조회 응답 타입
export type DatasetByYearResponse =
  | GetVisualDataByCategoryResponse
  | GetIndustrialDataByCategoryResponse;

// 타입별 데이터 상세 조회 응답 타입
export type DatasetByIdResponse =
  | GetDetailVisualDataByCategoryResponse
  | GetDetailIndustrialDataByCategoryResponse;

export type GetDetailResponseByType = {
  VISUAL: VisualDataItem;
  INDUSTRY: IndustrialDataItem;
};

// // 타입별 데이터 년도 수정 요청 타입
export type UpdateRequestByType = {
  VISUAL: UpdateVisualDatasetRequest;
  INDUSTRY: UpdateIndustrialDatasetRequest;
};

export type CreateForm =
  | CreateVisualDatasetRequest
  | CreateIndustrialDatasetRequest;

export type UpdateForm =
  | UpdateVisualDatasetRequest
  | UpdateIndustrialDatasetRequest;

// 검색
export type SearchDataResponse =
  | GetVisualDataByKeywordyResponse
  | GetIndustrialDataByKeywordyResponse;

export type VisualRowWithIndex = WithIndex<VisualDataItem>;
export type IndustryRowWithIndex = WithIndex<IndustrialDataItem>;
export type AnyRowWithIndex = VisualRowWithIndex | IndustryRowWithIndex;

export type DataDetailModalProps =
  | {
      type: 'VISUAL';
      row?: VisualRowWithIndex;
      /* 공통 props */
    }
  | {
      type: 'INDUSTRY';
      row?: IndustryRowWithIndex;
      /* 공통 props */
    };
