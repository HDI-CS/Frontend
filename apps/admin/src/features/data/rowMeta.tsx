import empty from '@/public/data/EmptyIMg.svg';
import { UserType } from '@/src/schemas/auth';
import { EvaluationYears, RoundsSchema } from '@/src/schemas/survey';
import {
  UpdateVisualDatasetRequest,
  VisualCategory,
  YearFolderArray,
} from '@/src/schemas/visual-data';
import { useSearchStore } from '@/src/store/searchStore';
import {
  ColumnDef,
  GetDetailResponseByType,
  IndustrialRow,
  VisualRow,
  WithIndex,
  Years,
} from '@/src/types/data/visual-data';
import { EvaluationYearFolder } from '@/src/types/evaluation';
import { renderCellText } from '@/src/utils/highlightText';
import { truncateText } from '@/src/utils/truncateText';
import Image from 'next/image';
import { CategoryByType } from './DataYearPage';
const getKeyword = () => useSearchStore.getState().keyword;

const toHttpUrl = (url?: string) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `https://${url}`;
};

type IndustryDynamicFieldKey =
  | 'productTypeName'
  | 'size'
  | 'material'
  | 'noiseCancelling'
  | 'codec'
  | 'extraFeatures'
  | 'controlType'
  | 'waterproof'
  | 'maxPlayTime'
  | 'chargeTime'
  | 'usage'
  | 'shoppingUrl'
  | 'connectivity'
  | 'soundOutput';

type VisualDynamicFieldKey =
  | 'sectorCategory'
  | 'mainProductCategory'
  | 'mainProduct'
  | 'target'
  | 'name'
  | 'title'
  | 'country'
  | 'clientName'
  | 'contentType'
  | 'visualType'
  | 'designDescription'
  | 'releaseYear'
  | 'referenceUrl';

type IndustryColumnDef = {
  key: IndustryDynamicFieldKey;
  header: string;
  thClassName: string;
  className: string;
  maxLength: number;
};

type VisualColumnDef = {
  key: VisualDynamicFieldKey;
  header: string;
  thClassName: string;
  className: string;
  maxLength: number;
};

const DISPLAY_META_BY_CATEGORY = {
  FB: {
    field: 'name',
    label: '브랜드명',
  },
  COSMETIC: {
    field: 'name',
    label: '브랜드명',
  },
  POSTER: {
    field: 'title',
    label: '제목',
  },
} as const;

const INDUSTRY_DYNAMIC_COLUMN_MAP: Record<
  IndustryDynamicFieldKey,
  IndustryColumnDef
> = {
  material: {
    key: 'material',
    header: '재질',
    thClassName: 'w-[120px]',
    className: 'w-[120px]',
    maxLength: 7,
  },
  productTypeName: {
    key: 'productTypeName',
    header: '제품 유형',
    thClassName: 'w-[120px]',
    className: 'w-[120px]',
    maxLength: 12,
  },
  usage: {
    key: 'usage',
    header: '용도',
    thClassName: 'w-[120px]',
    className: 'w-[120px]',
    maxLength: 10,
  },
  size: {
    key: 'size',
    header: '크기',
    thClassName: 'w-[120px]',
    className: 'w-[120px]',
    maxLength: 6,
  },
  soundOutput: {
    key: 'soundOutput',
    header: '사운드 출력',
    thClassName: 'w-[120px]',
    className: 'w-[120px]',
    maxLength: 10,
  },
  noiseCancelling: {
    key: 'noiseCancelling',
    header: '노이즈캔슬링',
    thClassName: 'w-[140px]',
    className: 'w-[140px]',
    maxLength: 10,
  },
  codec: {
    key: 'codec',
    header: '코덱',
    thClassName: 'w-[120px]',
    className: 'w-[120px]',
    maxLength: 8,
  },
  extraFeatures: {
    key: 'extraFeatures',
    header: '부가기능',
    thClassName: 'w-[160px]',
    className: 'w-[160px]',
    maxLength: 12,
  },
  controlType: {
    key: 'controlType',
    header: '컨트롤',
    thClassName: 'w-[120px]',
    className: 'w-[120px]',
    maxLength: 10,
  },
  waterproof: {
    key: 'waterproof',
    header: '방수기능',
    thClassName: 'w-[120px]',
    className: 'w-[120px]',
    maxLength: 10,
  },

  connectivity: {
    key: 'connectivity',
    header: '입출력',
    thClassName: 'w-[120px]',
    className: 'w-[120px]',
    maxLength: 10,
  },
  maxPlayTime: {
    key: 'maxPlayTime',
    header: '최대재생시간',
    thClassName: 'w-[140px]',
    className: 'w-[140px]',
    maxLength: 10,
  },
  chargeTime: {
    key: 'chargeTime',
    header: '충전시간',
    thClassName: 'w-[120px]',
    className: 'w-[120px]',
    maxLength: 10,
  },
  shoppingUrl: {
    key: 'shoppingUrl',
    header: '쇼핑몰 링크',
    thClassName: 'min-w-[180px]',
    className: 'min-w-[180px]',
    maxLength: 20,
  },
};

const VISUAL_DYNAMIC_COLUMN_MAP: Record<
  VisualDynamicFieldKey,
  VisualColumnDef
> = {
  name: {
    key: 'name',
    header: '브랜드명',
    thClassName: 'w-[140px]',
    className: 'w-[140px] px-3',
    maxLength: 8,
  },
  sectorCategory: {
    key: 'sectorCategory',
    header: '부문·카테고리',
    thClassName: 'w-[140px]',
    className: 'w-[140px]',
    maxLength: 9,
  },
  mainProductCategory: {
    key: 'mainProductCategory',
    header: '대표 제품 카테고리',
    thClassName: 'w-[260px]',
    className: 'min-w-[260px]',
    maxLength: 20,
  },
  mainProduct: {
    key: 'mainProduct',
    header: '대표 제품',
    thClassName: 'min-w-[240px]',
    className: 'min-w-[240px]',
    maxLength: 16,
  },
  target: {
    key: 'target',
    header: '타겟(성별/연령)',
    thClassName: 'w-[160px]',
    className: 'w-[160px]',
    maxLength: 6,
  },

  releaseYear: {
    key: 'releaseYear',
    header: '년도',
    thClassName: 'w-[120px]',
    className: 'w-[120px]',
    maxLength: 6,
  },
  title: {
    key: 'title',
    header: '제목',
    thClassName: 'w-[200px]',
    className: 'w-[200px]',
    maxLength: 20,
  },
  country: {
    key: 'country',
    header: '국가',
    thClassName: 'w-[120px]',
    className: 'w-[120px]',
    maxLength: 6,
  },
  clientName: {
    key: 'clientName',
    header: '클라이언트',
    thClassName: 'w-[120px]',
    className: 'w-[120px]',
    maxLength: 8,
  },
  contentType: {
    key: 'contentType',
    header: '내용 유형',
    thClassName: 'w-[140px]',
    className: 'w-[140px]',
    maxLength: 10,
  },
  visualType: {
    key: 'visualType',
    header: '시각 유형',
    thClassName: 'w-[120px]',
    className: 'w-[120px]',
    maxLength: 10,
  },
  designDescription: {
    key: 'designDescription',
    header: '디자인 설명',
    thClassName: 'w-[200px]',
    className: 'w-[200px]',
    maxLength: 20,
  },

  referenceUrl: {
    key: 'referenceUrl',
    header: '홈페이지',
    thClassName: 'min-w-[180px]',
    className: 'min-w-[180px]',
    maxLength: 20,
  },
};

const buildDynamicColumns = (rows: IndustrialRow[]) => {
  if (!rows.length) return [];

  // 고정 필드
  const EXCLUDE_KEYS = [
    'id',
    '_no',
    'code',
    'productName',
    'modelName',
    'companyName',
    'price',
    'weight',
    'registeredAt',
    'productPath',
    'referenceUrl',
    'detailImagePath',
    'frontImagePath',
    'sideImagePath',
    'side2ImagePath',
    'side3ImagePath',
  ];

  const keySet = new Set<string>();

  rows.forEach((row) => {
    Object.entries(row).forEach(([key, value]) => {
      if (!EXCLUDE_KEYS.includes(key) && value != null) {
        keySet.add(key);
      }
    });
  });

  return Array.from(keySet).map((key) => {
    const meta = INDUSTRY_DYNAMIC_COLUMN_MAP[key as IndustryDynamicFieldKey];

    return {
      key,
      header: meta?.header || key,
      thClassName: meta?.thClassName || 'w-[120px]',
      className: meta?.className || 'w-[120px]',
      cell: (row: WithIndex<IndustrialRow>, isActiveRow: boolean) =>
        renderCellText(
          String(row[key as keyof IndustrialRow] ?? ''),
          getKeyword(),
          {
            active: isActiveRow,
            maxLength: meta?.maxLength || 10,
          }
        ),
    };
  });
};

const buildVisualDynamicColumns = (rows: VisualRow[]) => {
  if (!rows.length) return [];
  const EXCLUDE_KEYS = ['id', '_no', 'code', 'logoImage'];

  const keySet = new Set<string>();
  console.log('buildVisualDynamicColumns', { rows });
  rows.forEach((row) => {
    Object.entries(row).forEach(([key, value]) => {
      if (!EXCLUDE_KEYS.includes(key) && value != null) {
        keySet.add(key);
      }
    });
  });

  return Object.keys(VISUAL_DYNAMIC_COLUMN_MAP)
    .filter((key) => keySet.has(key))
    .map((key) => {
      const meta = VISUAL_DYNAMIC_COLUMN_MAP[key as VisualDynamicFieldKey];

      return {
        key,
        header: meta?.header || key,
        thClassName: meta?.thClassName || 'w-[120px]',
        className: meta?.className || 'w-[120px]',
        cell: (row: WithIndex<VisualRow>, isActiveRow: boolean) =>
          renderCellText(
            String(row[key as keyof VisualRow] ?? ''),
            getKeyword(),
            {
              active: isActiveRow,
              maxLength: meta?.maxLength || 10,
            }
          ),
      };
    });
};

export const getRowMeta = (
  type: 'VISUAL' | 'INDUSTRY',
  year?: Years,
  rows?: WithIndex<IndustrialRow | VisualRow>[],
  activeCategory?: VisualCategory
) => {
  const displayMeta =
    activeCategory && DISPLAY_META_BY_CATEGORY[activeCategory];

  if (type === 'VISUAL') {
    return {
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

          cell: (row: VisualRow, isActiveRow: boolean) =>
            renderCellText(row.code, getKeyword(), {
              active: isActiveRow,
              maxLength: 6,
            }),
        },

        ...buildVisualDynamicColumns(
          (rows as WithIndex<VisualRow>[]) ?? ([] as WithIndex<VisualRow>[])
        ),

        {
          key: 'logoImage',
          header: <span className="block text-center">이미지</span>,
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
        {
          label: '이미지',
          value: (row: VisualRow) => row.logoImage ?? '',
        }, //
        { label: 'ID', value: (row: VisualRow) => row.code },
        {
          label: displayMeta?.label ?? '대표값',
          value: (row: VisualRow) =>
            displayMeta?.field ? row[displayMeta.field as keyof VisualRow] : '',
        },
        {
          label: '부문·카테고리',
          value: (row: VisualRow) => row.sectorCategory,
        },
      ],
    };
  }

  return {
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
        cell: (row: IndustrialRow, isActiveRow: boolean) =>
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
        cell: (row: IndustrialRow, isActiveRow: boolean) =>
          renderCellText(row.productName, getKeyword(), {
            active: isActiveRow,
            maxLength: 21,
          }),
      },
      {
        key: 'productPath',
        header: '제품 카테고리',
        thClassName: 'w-[300px]',
        className: 'w-[120px]',
        cell: (row: IndustrialRow, isActiveRow: boolean) =>
          renderCellText(row.productPath, getKeyword(), {
            active: isActiveRow,
            maxLength: 20,
          }),
      },
      {
        key: 'companyName',
        header: '회사',
        thClassName: 'w-[150px]',
        className: 'w-[150px]',
        cell: (row: IndustrialRow, isActiveRow: boolean) =>
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
        cell: (row: IndustrialRow, isActiveRow: boolean) =>
          renderCellText(row.price, getKeyword(), {
            active: isActiveRow,
            maxLength: 7,
          }),
      },

      ...buildDynamicColumns(
        (rows as WithIndex<IndustrialRow>[]) ??
          ([] as WithIndex<IndustrialRow>[])
      ),

      {
        key: 'weight',
        header: '무게',
        thClassName: 'w-[120px]',
        className: 'w-[120px]',
        cell: (row: IndustrialRow, isActiveRow: boolean) =>
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
        cell: (row: IndustrialRow, isActiveRow: boolean) =>
          renderCellText(row.registeredAt, getKeyword(), {
            active: isActiveRow,
            maxLength: 10,
          }),
      },
      {
        key: 'referenceUrl',
        header: '홈페이지',
        thClassName: 'min-w-[180px]',
        className: 'min-w-[180px]',
        cell: (row: IndustrialRow) => {
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
            loading="lazy"
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
            loading="lazy"
          />
        ),
      },
      {
        key: 'sideImagePath',
        header: <span className="block text-center">서브이미지01</span>,
        thClassName: 'w-[120px]',
        className: 'w-[120px] text-center',
        cell: (row: IndustrialRow) => (
          <Image
            src={row.sideImagePath ? row.sideImagePath : empty}
            alt={`${row.modelName} logo`}
            className="mx-auto h-[44px] w-[44px] rounded object-cover"
            width={44}
            height={44}
            loading="lazy"
          />
        ),
      },
      {
        key: 'side2ImagePath',
        header: <span className="block text-center">서브이미지02</span>,
        thClassName: 'w-[120px]',
        className: 'w-[120px] text-center',
        cell: (row: IndustrialRow) => (
          <Image
            src={row.side2ImagePath ? row.side2ImagePath : empty}
            alt={`${row.modelName} logo`}
            className="mx-auto h-[44px] w-[44px] rounded object-cover"
            width={44}
            height={44}
            loading="lazy"
          />
        ),
      },
      {
        key: 'side3ImagePath',
        header: <span className="block text-center">서브이미지03</span>,
        thClassName: 'w-[120px]',
        className: 'w-[120px] text-center',
        cell: (row: IndustrialRow) => (
          <Image
            src={row.side3ImagePath ? row.side3ImagePath : empty}
            alt={`${row.modelName} logo`}
            className="mx-auto h-[44px] w-[44px] rounded object-cover"
            width={44}
            height={44}
            loading="lazy"
          />
        ),
      },
    ],

    galleryFields: [
      {
        label: '로고 이미지',
        value: (row: IndustrialRow) => row.frontImagePath,
      },
      { label: 'ID', value: (row: IndustrialRow) => row.code },
      { label: '제품명', value: (row: IndustrialRow) => row.productName },
      {
        label: '제품 카테고리',
        value: (row: IndustrialRow) => row.productPath,
      },
    ],
  };
};

// export const getRowMeta = (type: 'VISUAL' | 'INDUSTRY') => rowMeta[type];

export const VISUAL_FIELDS = [
  { label: 'ID', field: 'code' },
  { label: '브랜드명', field: 'name' },
  { label: '부문·카테고리', field: 'sectorCategory' },
  { label: '대표 제품 카테고리', field: 'mainProductCategory' },
  { label: '대표 제품', field: 'mainProduct' },
  { label: '타겟(성별/연령)', field: 'target' },
  { label: '홈페이지', field: 'referenceUrl' },

  // 2026
  { label: '제목', field: 'title' },
  { label: '국가', field: 'country' },
  { label: '클라이언트', field: 'clientName' },
  { label: '내용 유형', field: 'contentType' },
  { label: '시각 유형', field: 'visualType' },
  { label: '디자인 설명', field: 'designDescription' },
  { label: '년도', field: 'releaseYear' },
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
  { label: '제품 유형', field: 'productTypeName' },
  { label: '홈페이지', field: 'referenceUrl' },

  // 2026
  { label: '용도', field: 'usage' },
  { label: '사운드 출력', field: 'soundOutput' },
  { label: '노이즈캔슬링', field: 'noiseCancelling' },
  { label: '코덱', field: 'codec' },
  { label: '부가기능', field: 'extraFeatures' },
  { label: '컨트롤', field: 'controlType' },
  { label: '방수기능', field: 'waterproof' },
  { label: '최대재생시간', field: 'maxPlayTime' },
  { label: '충전시간', field: 'chargeTime' },
  { label: '입출력', field: 'connectivity' },
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

    title: detail.title ?? '',
    country: detail.country ?? '',
    clientName: detail.clientName ?? '',
    contentType: detail.contentType ?? '',
    visualType: detail.visualType ?? '',
    designDescription: detail.designDescription ?? '',
    releaseYear: detail.releaseYear ?? '',

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
    noiseCancelling: detail.noiseCancelling ?? '',
    codec: detail.codec ?? '',
    extraFeatures: detail.extraFeatures ?? '',
    controlType: detail.controlType ?? '',
    waterproof: detail.waterproof ?? '',
    maxPlayTime: detail.maxPlayTime ?? '',
    chargeTime: detail.chargeTime ?? '',
    usage: detail.usage ?? '',
    connectivity: detail.connectivity ?? '',

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
    | 'originalSide2ImagePath'
    | 'originalSide3ImagePath'
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
    case 'originalSide2ImagePath':
      return normalizeImageUrl(industry.side2ImagePath);
    case 'originalSide3ImagePath':
      return normalizeImageUrl(industry.side3ImagePath);
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
  years: YearFolderArray,
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

export const buildFieldsFromColumns = (
  columns: ColumnDef<WithIndex<VisualRow | IndustrialRow>>[]
) => {
  const EXCLUDE_KEYS = [
    '_no',
    'logoImage',
    'detailImagePath',
    'frontImagePath',
    'sideImagePath',
    'side2ImagePath',
    'side3ImagePath',
  ];
  return columns
    .filter((col) => !EXCLUDE_KEYS.includes(col.key))
    .map((col) => ({
      label: typeof col.header === 'string' ? col.header : col.key,
      field: col.key as keyof GetDetailResponseByType['VISUAL' | 'INDUSTRY'],
    }));
};
