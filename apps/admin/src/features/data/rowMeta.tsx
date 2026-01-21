import empty from '@/public/data/EmptyIMg.svg';
import { UserType } from '@/src/schemas/auth';
import { EvaluationYears, RoundsSchema } from '@/src/schemas/survey';
import { UpdateVisualDatasetRequest, Years } from '@/src/schemas/visual-data';
import { useSearchStore } from '@/src/store/searchStore';
import {
  GetDetailResponseByType,
  IndustrialRow,
  VisualRow,
  WithIndex,
} from '@/src/types/data/visual-data';
import { EvaluationYearFolder } from '@/src/types/evaluation';
import { renderCellText } from '@/src/utils/highlightText';
import { truncateText } from '@/src/utils/truncateText';
import Image from 'next/image';
import { CategoryByType } from './DataYearPage';
import { MetaByType } from './uiDef';
const getKeyword = () => useSearchStore.getState().keyword;

const toHttpUrl = (url?: string) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `https://${url}`;
};

export const rowMeta: MetaByType = {
  VISUAL: {
    getImageSrc: (row: VisualRow) => row.logoImage,
    getImageAlt: (row: VisualRow) => row.name,
    getUrl: (row: VisualRow) => row.referenceUrl,

    // 테이블 컬럼 정의
    columns: [
      {
        key: '_no',
        header: '번호',
        thClassName: 'w-[64px]',
        className: 'w-[64px] text-center',
        cell: (row: WithIndex<VisualRow>) => row._no,
      },
      {
        key: 'code',
        header: 'ID',
        thClassName: 'w-[90px]',
        className: 'w-[90px] px-3',

        cell: (row, isActiveRow) =>
          renderCellText(row.code, getKeyword(), {
            active: isActiveRow,
            maxLength: 6,
          }),
      },
      {
        key: 'name',
        header: '브랜드명',
        thClassName: 'w-[140px]',
        className: 'w-[140px] px-3',

        cell: (row, isActiveRow) =>
          renderCellText(row.name, getKeyword(), {
            active: isActiveRow,
            maxLength: 8,
          }),
      },
      {
        key: 'sectorCategory',
        header: '부문·카테고리',
        thClassName: 'w-[140px]',
        className: 'w-[140px]',
        cell: (row, isActiveRow) =>
          renderCellText(row.sectorCategory, getKeyword(), {
            active: isActiveRow,
            maxLength: 9,
          }),
      },
      {
        key: 'mainProductCategory',
        header: '대표 제품 카테고리',
        thClassName: 'w-[260px]',
        className: 'min-w-[260px]',
        cell: (row, isActiveRow) =>
          renderCellText(row.mainProductCategory, getKeyword(), {
            active: isActiveRow,
            maxLength: 20,
          }),
      },
      {
        key: 'mainProduct',
        header: '대표 제품',
        thClassName: 'min-w-[240px]',
        className: 'min-w-[240px]',
        cell: (row, isActiveRow) =>
          renderCellText(row.mainProduct, getKeyword(), {
            active: isActiveRow,
            maxLength: 16,
          }),
      },
      {
        key: 'target',
        header: '타겟(성별/연령)',
        thClassName: 'w-[160px]',
        className: 'w-[160px]',
        cell: (row, isActiveRow) =>
          renderCellText(row.target, getKeyword(), {
            active: isActiveRow,
            maxLength: 6,
          }),
      },
      {
        key: 'referenceUrl',
        header: '홈페이지',
        thClassName: 'min-w-[180px]',
        className: 'min-w-[180px]',
        cell: (row: VisualRow) => {
          const href = toHttpUrl(row.referenceUrl);
          return (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-[#4B5563] underline-offset-2 hover:underline"
            >
              {truncateText(String(row.referenceUrl), 20)}
            </a>
          );
        },
      },
      {
        key: 'logoImage',
        header: <span className="block text-center">로고이미지</span>,
        thClassName: 'w-[120px]',
        className: 'w-[120px] text-center',
        cell: (row: VisualRow) => (
          <Image
            src={row.logoImage ? row.logoImage : empty}
            alt={`${row.name} logo`}
            className="mx-auto h-[44px] w-[44px] rounded object-cover"
            width={44}
            height={44}
          />
        ),
      },
    ],

    //  갤러리 카드에 보여줄 필드
    galleryFields: [
      { label: '로고 이미지', value: (row) => row.logoImage ?? '' }, //
      { label: 'ID', value: (row) => row.code },
      { label: '브랜드명', value: (row) => row.name },
      { label: '부문·카테고리', value: (row) => row.sectorCategory },
    ],
  },

  INDUSTRY: {
    getImageSrc: (row: IndustrialRow) =>
      row.frontImagePath || row.detailImagePath || null,
    getImageAlt: (row: IndustrialRow) =>
      row.productName || row.companyName || row.code,
    getUrl: (row: IndustrialRow) => row.referenceUrl,

    columns: [
      {
        key: '_no',
        header: '번호',
        thClassName: 'w-[64px]',
        className: 'w-[64px] text-center',
        cell: (row: WithIndex<IndustrialRow>) => row._no,
      },
      {
        key: 'code',
        header: 'ID',
        thClassName: 'w-[80px]',
        className: 'w-[80px] px-3',
        cell: (row, isActiveRow) =>
          renderCellText(row.code, getKeyword(), {
            active: isActiveRow,
            maxLength: 6,
          }),
      },
      {
        key: 'productName',
        header: '제품명',
        thClassName: 'min-w-[200px]',
        className: 'min-w-[200px]',
        cell: (row, isActiveRow) =>
          renderCellText(row.productName, getKeyword(), {
            active: isActiveRow,
            maxLength: 21,
          }),
      },
      {
        key: 'modelName',
        header: '모델',
        thClassName: 'w-[120px]',
        className: 'w-[120px]',
        cell: (row, isActiveRow) =>
          renderCellText(row.modelName, getKeyword(), {
            active: isActiveRow,
            maxLength: 6,
          }),
      },
      {
        key: 'companyName',
        header: '회사',
        thClassName: 'w-[150px]',
        className: 'w-[150px]',
        cell: (row, isActiveRow) =>
          renderCellText(row.companyName, getKeyword(), {
            active: isActiveRow,
            maxLength: 8,
          }),
      },
      {
        key: 'price',
        header: '가격',
        thClassName: 'w-[120px]',
        className: 'w-[120px]',
        cell: (row, isActiveRow) =>
          renderCellText(row.price, getKeyword(), {
            active: isActiveRow,
            maxLength: 7,
          }),
      },
      {
        key: 'material',
        header: '재질',
        thClassName: 'w-[120px]',
        className: 'w-[120px]',
        cell: (row, isActiveRow) =>
          renderCellText(row.material, getKeyword(), {
            active: isActiveRow,
            maxLength: 7,
          }),
      },
      {
        key: 'size',
        header: '크기',
        thClassName: 'w-[120px]',
        className: 'w-[120px]',
        cell: (row, isActiveRow) =>
          renderCellText(row.size, getKeyword(), {
            active: isActiveRow,
            maxLength: 6,
          }),
      },
      {
        key: 'weight',
        header: '무게',
        thClassName: 'w-[120px]',
        className: 'w-[120px]',
        cell: (row, isActiveRow) =>
          renderCellText(row.weight, getKeyword(), {
            active: isActiveRow,
            maxLength: 6,
          }),
      },
      {
        key: 'registeredAt',
        header: '출시일',
        thClassName: 'w-[120px]',
        className: 'w-[120px]',
        cell: (row, isActiveRow) =>
          renderCellText(row.registeredAt, getKeyword(), {
            active: isActiveRow,
            maxLength: 10,
          }),
      },
      {
        key: 'productPath',
        header: '제품 카테고리',
        thClassName: 'w-[300px]',
        className: 'w-[120px]',
        cell: (row, isActiveRow) =>
          renderCellText(row.productPath, getKeyword(), {
            active: isActiveRow,
            maxLength: 20,
          }),
      },
      {
        key: 'referenceUrl',
        header: '홈페이지',
        thClassName: 'min-w-[180px]',
        className: 'min-w-[180px]',
        cell: (row) => {
          const href = toHttpUrl(row.referenceUrl);
          return (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="text-[#4B5563] underline-offset-2 hover:underline"
            >
              {truncateText(String(row.referenceUrl), 20)}
            </a>
          );
        },
      },
      {
        key: 'detailImagePath',
        header: <span className="block text-center">상세이미지</span>,
        thClassName: 'w-[120px]',
        className: 'w-[120px] text-center',
        cell: (row: IndustrialRow) => (
          <Image
            src={row.detailImagePath ? row.detailImagePath : empty}
            alt={`${row.modelName} logo`}
            className="mx-auto h-[44px] w-[44px] rounded object-cover"
            width={44}
            height={44}
          />
        ),
      },
      {
        key: 'frontImagePath',
        header: <span className="block text-center">정면이미지</span>,
        thClassName: 'w-[120px]',
        className: 'w-[120px] text-center',
        cell: (row: IndustrialRow) => (
          <Image
            src={row.frontImagePath ? row.frontImagePath : empty}
            alt={`${row.modelName} logo`}
            className="mx-auto h-[44px] w-[44px] rounded object-cover"
            width={44}
            height={44}
          />
        ),
      },
      {
        key: 'sideImagePath',
        header: <span className="block text-center">측면이미지</span>,
        thClassName: 'w-[120px]',
        className: 'w-[120px] text-center',
        cell: (row: IndustrialRow) => (
          <Image
            src={row.sideImagePath ? row.sideImagePath : empty}
            alt={`${row.modelName} logo`}
            className="mx-auto h-[44px] w-[44px] rounded object-cover"
            width={44}
            height={44}
          />
        ),
      },
    ],

    galleryFields: [
      { label: '로고 이미지', value: (row) => row.frontImagePath },
      { label: 'ID', value: (row) => row.code },
      { label: '제품명', value: (row) => row.productName },
      { label: '제품 카테고리', value: (row) => row.productPath },
    ],
  },
};

export const getRowMeta = (type: 'VISUAL' | 'INDUSTRY') => rowMeta[type];

export const VISUAL_FIELDS = [
  { label: 'ID', field: 'code' },
  { label: '브랜드명', field: 'name' },
  { label: '부문·카테고리', field: 'sectorCategory' },
  { label: '대표 제품 카테고리', field: 'mainProductCategory' },
  { label: '대표 제품', field: 'mainProduct' },
  { label: '타겟(성별/연령)', field: 'target' },
  { label: '홈페이지', field: 'referenceUrl' },
] as const satisfies readonly {
  label: string;
  field: keyof UpdateVisualDatasetRequest;
}[];

export const INDUSTRY_FIELDS = [
  { label: 'ID', field: 'code' },
  { label: '제품명', field: 'productName' },
  { label: '회사명', field: 'companyName' },
  { label: '모델명', field: 'modelName' },
  { label: '가격', field: 'price' },
  { label: '재질', field: 'material' },
  { label: '크기', field: 'size' },
  { label: '무게', field: 'weight' },
  { label: '출시일', field: 'registeredAt' },
  { label: '제품 카테고리', field: 'productPath' },
  { label: '홈페이지', field: 'referenceUrl' },
] as const;

// get detail API → UpdateForm 변환 mapper
export const updateRequestMapper = {
  VISUAL: (
    detail: GetDetailResponseByType['VISUAL'],
    category: CategoryByType['VISUAL'] | null
  ) => ({
    code: detail.code ?? '',
    name: detail.name ?? '',
    sectorCategory: detail.sectorCategory ?? '',
    mainProductCategory: detail.mainProductCategory ?? '',
    mainProduct: detail.mainProduct ?? '',
    target: detail.target ?? '',
    referenceUrl: detail.referenceUrl ?? '',
    originalLogoImage: null,
    visualDataCategory: category,
  }),

  INDUSTRY: (detail: GetDetailResponseByType['INDUSTRY']) => ({
    code: detail.code ?? '',
    productName: detail.productName ?? '',
    companyName: detail.companyName ?? '',
    modelName: detail.modelName ?? '',
    price: detail.price ?? '',
    material: detail.material ?? '',
    size: detail.size ?? '',
    weight: detail.weight ?? '',
    referenceUrl: detail.referenceUrl ?? '',
    registeredAt: detail.registeredAt ?? '',
    productPath: detail.productPath ?? '',
    productTypeName: detail.productTypeName ?? '',
    originalDetailImagePath: null,
    originalFrontImagePath: null,
    originalSideImagePath: null,
  }),
} as const;

// 이미지 타입별 분리

export function normalizeImageUrl(url?: string | null): string | null {
  if (!url) return null;

  // 끝이 /null 이거나 null 문자열 포함 -> 이미지 없음으로 처리
  if (url.endsWith('/null') || url.includes('/null')) {
    return null;
  }

  return url;
}

export function getImageSrcByType(
  type: UserType,
  detail?: GetDetailResponseByType[keyof GetDetailResponseByType],
  field?:
    | 'originalDetailImagePath'
    | 'originalFrontImagePath'
    | 'originalSideImagePath'
): string | null {
  if (!detail) return null;

  if (type === 'VISUAL') {
    return normalizeImageUrl(
      (detail as GetDetailResponseByType['VISUAL']).logoImage
    );
  }
  const industry = detail as GetDetailResponseByType['INDUSTRY'];

  switch (field) {
    case 'originalDetailImagePath':
      return normalizeImageUrl(industry.detailImagePath);
    case 'originalFrontImagePath':
      return normalizeImageUrl(industry.frontImagePath);
    case 'originalSideImagePath':
      return normalizeImageUrl(industry.sideImagePath);
    default:
      return null;
  }
}

// 폴더 프롭으로 넘기기 위한 가공 함수
export const mapEvaluationYearsToFolders = (
  years: EvaluationYears,
  baseRoute: string // '/data'
): EvaluationYearFolder[] => {
  return years.map((year) => ({
    key: `${year.yearId}`,
    label: year.folderName,
    route: `${baseRoute}/${year.yearId}`,
    createdAt: year.createdAt ?? '',
    lastModifiedAt: year.updatedAt ?? '',
    duration: '',
  }));
};

export const mapEvaluationPhaseToFolders = (
  year: string,
  rounds: RoundsSchema,
  baseRoute: string // '/data'
): EvaluationYearFolder[] => {
  return rounds.map((round) => ({
    key: `${round.roundId}`,
    label: round.folderName,
    route: `${baseRoute}/${year}/${round.roundId}`,
    createdAt: round.createdAt ?? '',
    lastModifiedAt: round.updatedAt ?? '',
    startDate: round.startDate ?? '',
    endDate: round.endDate ?? '',
  }));
};

export const mapEvaluationYearsToFoldersForDataPage = (
  years: Years,
  baseRoute: string // '/data'
): EvaluationYearFolder[] => {
  return years.map((year) => ({
    key: `${year.yearId}`,
    label: `${year.folderName}`,
    route: `${baseRoute}/${year.yearId}`,
    createdAt: year.createdAt ?? '',
    lastModifiedAt: year.updatedAt ?? '',
  }));
};
