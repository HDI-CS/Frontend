import empty from '@/public/data/EmptyIMg.svg';

import {
  DISPLAY_META_BY_CATEGORY,
  getIndustryFieldsForYear,
  INDUSTRY_DYNAMIC_COLUMN_MAP,
  VISUAL_CATEGORY_CONFIG,
  VisualCategory,
} from '@/src/config/adminCategoryConfig';

import { UserType } from '@/src/schemas/auth';
import {
  IndustryCategory,
  IndustryImageType,
} from '@/src/schemas/industry-data';
import { EvaluationYears, RoundsSchema } from '@/src/schemas/survey';
import { YearFolderArray } from '@/src/schemas/visual-data';
import { useImageVersionStore } from '@/src/store/imageVersionStore';
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
import { withCacheBust } from '@/src/utils/withCacheBust';
import Image from 'next/image';
import { CategoryByType } from './categoryMap';
const getKeyword = () => useSearchStore.getState().keyword;

const toHttpUrl = (url?: string) => {
  if (!url) return '';
  return url.startsWith('http') ? url : `https://${url}`;
};

// attributes(카테고리별 추가 스펙)는 키가 카테고리마다, 또 시간이 지나며
// 계속 늘어난다. 고정 컬럼으로 하드코딩하는 대신, 현재 보여줄 행들에
// 실제로 들어있는 키를 스캔해서 키 하나당 컬럼 하나씩 동적으로 만든다.
// 새 스펙을 추가해도 코드 수정 없이 "출시일"처럼 바로 컬럼이 생긴다.
const getAttributeKeys = (rows?: WithIndex<IndustrialRow>[]) => {
  const keys = new Set<string>();
  rows?.forEach((row) => {
    Object.keys(row.attributes ?? {}).forEach((key) => keys.add(key));
  });
  return Array.from(keys);
};

// 컬럼/필드 key 충돌을 피하려고 prefix를 붙인다. (buildFieldsFromColumns에서
// 이 prefix로 걸러내 모달의 범용 renderField 루프에 안 끼게 함)
const ATTRIBUTE_COLUMN_PREFIX = 'attr:';

// 백엔드 field spec(attributeLabelByKey)이 아직 없는 레거시 키들의 폴백 라벨.
// HEADPHONE 등 2026 1차 카테고리가 고정 컬럼에서 attributes로 옮겨왔는데
// DB에 아직 라벨이 안 채워진 경우 raw key 대신 이 한글 라벨을 보여준다.
const getFallbackAttributeLabel = (key: string) =>
  INDUSTRY_DYNAMIC_COLUMN_MAP[key]?.header;

const buildIndustryAttributeColumns = (
  rows?: WithIndex<IndustrialRow>[],
  attributeLabelByKey?: Map<string, string>
) =>
  getAttributeKeys(rows).map((attrKey) => ({
    key: `${ATTRIBUTE_COLUMN_PREFIX}${attrKey}`,
    header:
      attributeLabelByKey?.get(attrKey) ??
      getFallbackAttributeLabel(attrKey) ??
      attrKey,
    thClassName: 'w-[140px]',
    className: 'w-[140px]',
    cell: (row: IndustrialRow, isActiveRow: boolean) =>
      renderCellText(String(row.attributes?.[attrKey] ?? ''), getKeyword(), {
        active: isActiveRow,
        maxLength: 10,
      }),
  }));

// INDUSTRY 그리드가 카테고리 무관하게 항상 고정으로 그리는 컬럼의 key.
// 카테고리 설정(INDUSTRY_CATEGORY_CONFIG)에 같은 key로 필드를 또 정의해도
// 중복 컬럼(= React key 중복)이 생기지 않게 여기서 걸러낸다.
const FIXED_INDUSTRY_COLUMN_KEYS = new Set([
  '_no',
  'code',
  'productName',
  'productPath',
  'companyName',
  'price',
  'weight',
  'registeredAt',
  'referenceUrl',
  'detailImagePath',
  'frontImagePath',
  'sideImagePath',
  'side2ImagePath',
  'side3ImagePath',
]);

const buildIndustryDynamicColumns = (
  category: IndustryCategory,
  yearName: Years | undefined // 파라미터 추가
) => {
  if (!category) return [];

  const fields = getIndustryFieldsForYear(yearName, category).filter(
    ({ key }) => !FIXED_INDUSTRY_COLUMN_KEYS.has(key)
  );

  return fields.map(({ key, label }) => {
    const meta = INDUSTRY_DYNAMIC_COLUMN_MAP[key];
    return {
      key,
      header: meta?.header || label || key,
      thClassName: meta?.thClassName || 'w-[120px]',
      className: meta?.className || 'w-[120px]',
      cell: (row: WithIndex<IndustrialRow>, isActiveRow: boolean) =>
        renderCellText(
          String(row[key as keyof IndustrialRow] ?? ''),
          getKeyword(),
          { active: isActiveRow, maxLength: meta?.maxLength || 10 }
        ),
    };
  });
};

const buildVisualDynamicColumns = (category: VisualCategory) => {
  if (!category) return [];

  const meta = VISUAL_CATEGORY_CONFIG[category];
  const fields = meta?.fields ?? [];

  return fields.map((meta) => ({
    key: meta.key,
    header: meta.label,
    thClassName: meta.thClassName || 'w-[120px]',
    className: meta.className || 'w-[120px]',
    cell: (row: WithIndex<VisualRow>, isActiveRow: boolean) =>
      renderCellText(
        String(row[meta.key as keyof VisualRow] ?? ''),
        getKeyword(),
        {
          active: isActiveRow,
          maxLength: meta.maxLength || 10,
        }
      ),
  }));
};

export const getRowMeta = (
  type: 'VISUAL' | 'INDUSTRY',
  year?: Years,
  rows?: WithIndex<IndustrialRow | VisualRow>[],
  activeCategory?: VisualCategory | IndustryCategory,
  attributeLabelByKey?: Map<string, string>
) => {
  if (type === 'VISUAL') {
    const displayMeta = activeCategory
      ? DISPLAY_META_BY_CATEGORY[activeCategory as VisualCategory]
      : undefined;
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
          (activeCategory as VisualCategory) || 'POSTER'
        ),

        {
          key: 'VisualImage',
          header: <span className="block text-center">이미지</span>,
          thClassName: 'w-[120px]',
          className: 'w-[120px] text-center',
          cell: (row: VisualRow) => {
            const version = useImageVersionStore.getState().get(row.id);
            return (
              <Image
                src={
                  row.logoImage ? withCacheBust(row.logoImage, version) : empty
                }
                alt={`${row.name} logo`}
                className="mx-auto h-[44px] w-[44px] rounded object-cover"
                width={44}
                height={44}
              />
            );
          },
        },
      ],

      //  갤러리 카드에 보여줄 필드
      galleryFields: [
        {
          label: '로고 이미지',
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

  // INDUSTRY

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

      ...buildIndustryDynamicColumns(activeCategory as IndustryCategory, year),

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
      ...buildIndustryAttributeColumns(
        rows as WithIndex<IndustrialRow>[],
        attributeLabelByKey
      ),
      {
        key: 'detailImagePath',
        header: <span className="block text-center">상세이미지</span>,
        thClassName: 'w-[120px]',
        className: 'w-[120px] text-center',
        cell: (row: IndustrialRow) => {
          const version = useImageVersionStore.getState().get(row.id);
          return (
            <div className="mx-auto h-[44px] w-[44px] overflow-hidden rounded bg-gray-100">
              <Image
                src={
                  row.detailImagePath
                    ? withCacheBust(row.detailImagePath, version)
                    : empty
                }
                alt={`${row.productName} logo`}
                className="mx-auto h-[44px] w-[44px] rounded object-cover"
                width={44}
                height={44}
                unoptimized
              />
            </div>
          );
        },
      },
      {
        key: 'frontImagePath',
        header: <span className="block text-center">정면이미지</span>,
        thClassName: 'w-[120px]',
        className: 'w-[120px] text-center',
        cell: (row: IndustrialRow) => {
          const version = useImageVersionStore.getState().get(row.id);
          return (
            <div className="mx-auto h-[44px] w-[44px] overflow-hidden rounded bg-gray-100">
              <Image
                src={
                  row.frontImagePath
                    ? withCacheBust(row.frontImagePath, version)
                    : empty
                }
                alt={`${row.productName} logo`}
                className="mx-auto h-[44px] w-[44px] rounded object-cover"
                width={44}
                height={44}
                unoptimized
              />
            </div>
          );
        },
      },
      {
        key: 'sideImagePath',
        header: <span className="block text-center">서브이미지01</span>,
        thClassName: 'w-[120px]',
        className: 'w-[120px] text-center',
        cell: (row: IndustrialRow) => {
          const version = useImageVersionStore.getState().get(row.id);
          return (
            <div className="mx-auto h-[44px] w-[44px] overflow-hidden rounded bg-gray-100">
              <Image
                src={
                  row.sideImagePath
                    ? withCacheBust(row.sideImagePath, version)
                    : empty
                }
                alt={`${row.productName} logo`}
                className="mx-auto h-[44px] w-[44px] rounded object-cover"
                width={44}
                height={44}
                unoptimized
              />
            </div>
          );
        },
      },
      {
        key: 'side2ImagePath',
        header: <span className="block text-center">서브이미지02</span>,
        thClassName: 'w-[120px]',
        className: 'w-[120px] text-center',
        cell: (row: IndustrialRow) => {
          const version = useImageVersionStore.getState().get(row.id);
          return (
            <div className="mx-auto h-[44px] w-[44px] overflow-hidden rounded bg-gray-100">
              <Image
                src={
                  row.side2ImagePath
                    ? withCacheBust(row.side2ImagePath, version)
                    : empty
                }
                alt={`${row.productName} logo`}
                className="mx-auto h-[44px] w-[44px] rounded object-cover"
                width={44}
                height={44}
                unoptimized
              />
            </div>
          );
        },
      },
      {
        key: 'side3ImagePath',
        header: <span className="block text-center">서브이미지03</span>,
        thClassName: 'w-[120px]',
        className: 'w-[120px] text-center',
        cell: (row: IndustrialRow) => {
          const version = useImageVersionStore.getState().get(row.id);
          return (
            <div className="mx-auto h-[44px] w-[44px] overflow-hidden rounded bg-gray-100">
              <Image
                src={
                  row.side3ImagePath
                    ? withCacheBust(row.side3ImagePath, version)
                    : empty
                }
                alt={`${row.productName} logo`}
                className="mx-auto h-[44px] w-[44px] rounded object-cover"
                width={44}
                height={44}
                unoptimized
              />
            </div>
          );
        },
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
    originalDescription: detail.originalDescription ?? '',
    releaseYear: detail.releaseYear ?? '',

    visualDataCategory: category,
  }),

  INDUSTRY: (detail: GetDetailResponseByType['INDUSTRY']) => ({
    code: detail.code ?? '',
    productName: detail.productName ?? '',
    companyName: detail.companyName ?? '',
    price: detail.price ?? '',
    weight: detail.weight ?? '',
    referenceUrl: detail.referenceUrl ?? '',
    registeredAt: detail.registeredAt ?? '',
    productPath: detail.productPath ?? '',
    productTypeName: detail.productTypeName ?? '',
    usage: detail.usage ?? '',
    attributes: detail.attributes ?? null,

    originalDetailImagePath: null,
    originalFrontImagePath: null,
    originalSideImagePath: null,
    originalSide2ImagePath: null,
    originalSide3ImagePath: null,
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
  field?: IndustryImageType
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
    'VisualImage',
    'detailImagePath',
    'frontImagePath',
    'sideImagePath',
    'side2ImagePath',
    'side3ImagePath',
    // 모달에 이미 전용 key-value 입력 UI가 따로 있어 범용 renderField
    // 루프에는 끼면 안 됨 (object라 text input으로 못 다룸)
    'attributes',
  ];
  return columns
    .filter(
      (col) =>
        !EXCLUDE_KEYS.includes(col.key) &&
        !col.key.startsWith(ATTRIBUTE_COLUMN_PREFIX)
    )
    .map((col) => ({
      label: typeof col.header === 'string' ? col.header : col.key,
      field: col.key as keyof GetDetailResponseByType['VISUAL' | 'INDUSTRY'],
    }));
};
