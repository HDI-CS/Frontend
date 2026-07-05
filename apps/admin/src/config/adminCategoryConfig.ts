import z from 'zod';
import {
  CreateIndustrialDatasetRequest,
  IndustryCategorySchema,
} from '../schemas/industry-data';
import { CreateVisualDatasetRequest } from '../schemas/visual-data';

export type VisualDatasetDefaults = Omit<
  CreateVisualDatasetRequest,
  'visualDataCategory'
>;

export type IndustryDatasetDefaults = Omit<
  CreateIndustrialDatasetRequest,
  'industryDataCategory'
>;

export type AdminFieldMeta = {
  key: string;
  label: string;
  type?: 'link';
  thClassName?: string;
  className?: string;
  maxLength?: number;
};

// fields는 as const로 선언된 배열이 들어오므로 readonly로 받아야 함
export type VisualCategoryMeta = {
  fields: readonly AdminFieldMeta[];
  displayField: string;
  displayLabel: string;
};

// ── 카테고리별 필드 정의: 전부 as const satisfies로 선언 ──────

const COSMETIC_FIELDS = {
  displayField: 'name',
  displayLabel: '브랜드명',
  fields: [
    {
      key: 'sectorCategory',
      label: '부문·카테고리',
      thClassName: 'w-[140px]',
      className: 'w-[140px]',
      maxLength: 9,
    },
    {
      key: 'mainProductCategory',
      label: '대표 제품 카테고리',
      thClassName: 'w-[260px]',
      className: 'min-w-[260px]',
      maxLength: 20,
    },
    {
      key: 'mainProduct',
      label: '대표 제품',
      thClassName: 'min-w-[240px]',
      className: 'min-w-[240px]',
      maxLength: 16,
    },
    {
      key: 'target',
      label: '타겟(성별/연령)',
      thClassName: 'w-[160px]',
      className: 'w-[160px]',
      maxLength: 6,
    },
    {
      key: 'referenceUrl',
      label: '홈페이지',
      type: 'link',
      thClassName: 'min-w-[180px]',
      className: 'min-w-[180px]',
      maxLength: 20,
    },
  ],
} as const satisfies VisualCategoryMeta;

const POSTER_FIELDS = {
  displayField: 'title',
  displayLabel: '제목',
  fields: [
    {
      key: 'sectorCategory',
      label: '부문·카테고리',
      thClassName: 'w-[140px]',
      className: 'w-[140px]',
      maxLength: 9,
    },
    {
      key: 'releaseYear',
      label: '년도',
      thClassName: 'w-[120px]',
      className: 'w-[120px]',
      maxLength: 6,
    },
    {
      key: 'country',
      label: '국가',
      thClassName: 'w-[120px]',
      className: 'w-[120px]',
      maxLength: 6,
    },
    {
      key: 'clientName',
      label: '클라이언트',
      thClassName: 'w-[120px]',
      className: 'w-[120px]',
      maxLength: 8,
    },
    {
      key: 'contentType',
      label: '내용 유형',
      thClassName: 'w-[140px]',
      className: 'w-[140px]',
      maxLength: 10,
    },
    {
      key: 'visualType',
      label: '시각 유형',
      thClassName: 'w-[120px]',
      className: 'w-[120px]',
      maxLength: 10,
    },
    {
      key: 'designDescription',
      label: '디자인 설명',
      thClassName: 'w-[200px]',
      className: 'w-[200px]',
      maxLength: 20,
    },
    {
      key: 'referenceUrl',
      label: '웹사이트',
      type: 'link',
      thClassName: 'min-w-[180px]',
      className: 'min-w-[180px]',
      maxLength: 20,
    },
  ],
} as const satisfies VisualCategoryMeta;

const PACKAGE_FIELDS = {
  displayField: 'title',
  displayLabel: '제목',
  fields: [
    {
      key: 'sectorCategory',
      label: '부문',
      thClassName: 'w-[80px]',
      className: 'w-[80px]',
      maxLength: 6,
    },
    {
      key: 'title',
      label: '이름',
      thClassName: 'w-[80px]',
      className: 'w-[80px]',
      maxLength: 10,
    },
    {
      key: 'visualType',
      label: '분류',
      thClassName: 'w-[220px]',
      className: 'w-[220px]',
      maxLength: 24,
    },
    {
      key: 'clientName',
      label: '주체',
      thClassName: 'w-[160px]',
      className: 'w-[160px]',
      maxLength: 14,
    },
    {
      key: 'designDescription',
      label: '내용(번역본)',
      thClassName: 'w-[200px]',
      className: 'w-[200px]',
      maxLength: 20,
    },
    {
      key: 'originalDescription',
      label: '내용(원문)',
      thClassName: 'w-[200px]',
      className: 'w-[200px]',
      maxLength: 20,
    },
    {
      key: 'referenceUrl',
      label: '웹사이트',
      type: 'link',
      thClassName: 'min-w-[180px]',
      className: 'min-w-[180px]',
      maxLength: 20,
    },
  ],
} as const satisfies VisualCategoryMeta;

// ── VISUAL_CATEGORY_CONFIG: Record<string, ...> 타입 어노테이션 제거 ──
// as const satisfies로 선언해야 키('POSTER' | 'PACKAGE' | 'COSMETIC' | 'FB')와
// 각 필드의 key 리터럴이 전부 보존됩니다.
export const VISUAL_CATEGORY_CONFIG = {
  POSTER: POSTER_FIELDS,
  PACKAGE: PACKAGE_FIELDS,
  COSMETIC: COSMETIC_FIELDS,
  FB: COSMETIC_FIELDS,
} as const satisfies Record<string, VisualCategoryMeta>;

export type VisualCategory = keyof typeof VISUAL_CATEGORY_CONFIG;

// ── INDUSTRY_CATEGORY_CONFIG도 동일 원칙 적용 ──────────────
export const INDUSTRY_CATEGORY_CONFIG = {
  VACUUM_CLEANER: [
    { key: 'modelName', label: '모델명' },
    { key: 'material', label: '재질' },
    { key: 'size', label: '사이즈' },
    { key: 'referenceUrl', label: '링크', type: 'link' },
  ],
  AIR_PURIFIER: [
    { key: 'modelName', label: '모델명' },
    { key: 'material', label: '재질' },
    { key: 'size', label: '사이즈' },
    { key: 'referenceUrl', label: '링크', type: 'link' },
  ],
  HAIR_DRYER: [
    { key: 'modelName', label: '모델명' },
    { key: 'material', label: '재질' },
    { key: 'size', label: '사이즈' },
  ],
  HEADPHONE: [
    { key: 'noiseCancelling', label: '노이즈 캔슬링' },
    { key: 'codec', label: '코덱' },
    { key: 'extraFeatures', label: '부가기능' },
    { key: 'controlType', label: '컨트롤 방식' },
    { key: 'maxPlayTime', label: '최대 재생시간' },
    { key: 'chargeTime', label: '충전 시간' },
  ],
  EARPHONE: [
    { key: 'noiseCancelling', label: '노이즈 캔슬링' },
    { key: 'codec', label: '코덱' },
    { key: 'extraFeatures', label: '부가기능' },
    { key: 'controlType', label: '컨트롤 방식' },
    { key: 'maxPlayTime', label: '최대 재생시간' },
    { key: 'chargeTime', label: '충전 시간' },
    { key: 'waterproof', label: '방수 기능' },
  ],
  BLUETOOTH_SPEAKER: [
    { key: 'soundOutput', label: '사운드 출력' },
    { key: 'codec', label: '코덱' },
    { key: 'extraFeatures', label: '부가기능' },
    { key: 'maxPlayTime', label: '최대 재생시간' },
    { key: 'chargeTime', label: '충전 시간' },
    { key: 'connectivity', label: '입출력' },
  ],
} as const satisfies Record<string, readonly AdminFieldMeta[]>;

export type IndustryCategory = keyof typeof INDUSTRY_CATEGORY_CONFIG;

// ── 도메인 전체에서 항상 필요한 core 필드 ──────
export const VISUAL_CORE_FIELDS = [
  'code',
  'name',
  'title',
  'sectorCategory',
  'mainProductCategory',
  'mainProduct',
  'target',
  'referenceUrl',
] as const;

// ── 도메인 전체에서 구조적으로 항상 필요한 "core" 필드 ──────
// (카테고리 무관하게 wide table 전체가 갖는 필드. Create 시 필수/기본값 '')
export const INDUSTRY_CORE_FIELDS = [
  'code',
  'productName',
  'companyName',
  'modelName',
  'price',
  'material',
  'size',
  'weight',
  'referenceUrl',
  'registeredAt',
  'productPath',
  'productTypeName',
] as const;

// ⚠️ 화면(카테고리 설정)엔 없지만 스키마엔 반드시 있어야 하는 숨은 필드
export const INDUSTRY_HIDDEN_SCHEMA_FIELDS = ['usage', 'shoppingUrl'] as const;

// ── 파생: 카테고리 전체에서 쓰이는 필드 key 리터럴 유니온 수집 ──
// 제네릭으로 받아서 T['key'] 리터럴을 그대로 살립니다.
const collectAllFieldKeys = <
  T extends Record<string, readonly { key: string }[]>,
>(
  config: T
): T[keyof T][number]['key'][] => {
  const keys = new Set<string>();
  Object.values(config).forEach((fields) =>
    fields.forEach((f) => keys.add(f.key))
  );
  return Array.from(keys) as T[keyof T][number]['key'][];
};

export const VISUAL_OPTIONAL_FIELD_KEYS = collectAllFieldKeys(
  Object.fromEntries(
    Object.entries(VISUAL_CATEGORY_CONFIG).map(([cat, meta]) => [
      cat,
      meta.fields,
    ])
  )
).filter((k) => !(VISUAL_CORE_FIELDS as readonly string[]).includes(k));

export const INDUSTRY_OPTIONAL_FIELD_KEYS = [
  ...collectAllFieldKeys(INDUSTRY_CATEGORY_CONFIG),
  ...INDUSTRY_HIDDEN_SCHEMA_FIELDS,
].filter((k) => !(INDUSTRY_CORE_FIELDS as readonly string[]).includes(k));

export const VISUAL_ITEM_NULLABLE_KEYS = [
  ...VISUAL_CORE_FIELDS.filter((k) => k !== 'code'),
  ...VISUAL_OPTIONAL_FIELD_KEYS,
] as const;



// ── 파생: schema에 필요한 전체 nullable 필드 키 (code 제외) ──
export const INDUSTRY_ITEM_NULLABLE_KEYS = [
  ...INDUSTRY_CORE_FIELDS.filter((k) => k !== 'code'),
  ...INDUSTRY_OPTIONAL_FIELD_KEYS,
] as const;

// ── buildNullableShape: 제네릭으로 키 타입 보존 ──────────────
export const buildNullableShape = <K extends readonly string[]>(keys: K) =>
  Object.fromEntries(keys.map((k) => [k, z.string().nullable()] as const)) as {
    [P in K[number]]: z.ZodNullable<z.ZodString>;
  };

// ── CATEGORY_FIELD_CONFIG (상세모달용) ──────
export const CATEGORY_FIELD_CONFIG = {
  visual: Object.fromEntries(
    Object.entries(VISUAL_CATEGORY_CONFIG).map(([cat, meta]) => [
      cat,
      (meta.fields as readonly AdminFieldMeta[]).map(
        ({ key, label, type }) => ({
          key,
          label,
          type,
        })
      ),
    ])
  ),
  industry: Object.fromEntries(
    Object.entries(INDUSTRY_CATEGORY_CONFIG).map(([cat, fields]) => [
      cat,
      (fields as readonly AdminFieldMeta[]).map(({ key, label, type }) => ({
        key,
        label,
        type,
      })),
    ])
  ),
};

// ── VISUAL_DYNAMIC_COLUMN_MAP (그리드용) ──────
export const VISUAL_DYNAMIC_COLUMN_MAP = Object.fromEntries(
  Object.entries(VISUAL_CATEGORY_CONFIG).map(([cat, meta]) => [
    cat,
    Object.fromEntries(
      meta.fields.map((f) => [
        f.key,
        {
          key: f.key,
          header: f.label,
          thClassName: f.thClassName ?? 'w-[120px]',
          className: f.className ?? 'w-[120px]',
          maxLength: f.maxLength ?? 10,
        },
      ])
    ),
  ])
);

// ── 갤러리 대표값 라벨: VISUAL_CATEGORY_CONFIG에서 직접 파생 ──
export const DISPLAY_META_BY_CATEGORY = Object.fromEntries(
  Object.entries(VISUAL_CATEGORY_CONFIG).map(([cat, meta]) => [
    cat,
    { field: meta.displayField, label: meta.displayLabel },
  ])
) as Record<VisualCategory, { field: string; label: string }>;

// ── EMPTY dataset 기본값 ──
export const EMPTY_VISUAL_DATASET = {
  ...Object.fromEntries(VISUAL_CORE_FIELDS.map((k) => [k, ''])),
  ...Object.fromEntries(VISUAL_OPTIONAL_FIELD_KEYS.map((k) => [k, null])),
  originalLogoImage: null,
} as VisualDatasetDefaults;

export const EMPTY_INDUSTRY_DATASET = {
  ...Object.fromEntries(INDUSTRY_CORE_FIELDS.map((k) => [k, ''])),
  ...Object.fromEntries(INDUSTRY_OPTIONAL_FIELD_KEYS.map((k) => [k, null])),
  originalDetailImagePath: null,
  originalFrontImagePath: null,
  originalSideImagePath: null,
} as IndustryDatasetDefaults;

// ── zod 스키마 ──
export const UpdateIndustrialDatasetRequestSchema = z
  .object({
    ...buildNullableShape(INDUSTRY_CORE_FIELDS),
    ...buildNullableShape(INDUSTRY_OPTIONAL_FIELD_KEYS),
    originalDetailImagePath: z.string().nullable(),
    originalFrontImagePath: z.string().nullable(),
    originalSideImagePath: z.string().nullable(),
    originalSide2ImagePath: z.string().nullable(),
    originalSide3ImagePath: z.string().nullable(),
    industryDataCategory: IndustryCategorySchema,
  })
  .partial();

export const VISUAL_CATEGORY_KEYS = Object.keys(
  VISUAL_CATEGORY_CONFIG
) as VisualCategory[];

export const INDUSTRY_CATEGORY_KEYS = Object.keys(
  INDUSTRY_CATEGORY_CONFIG
) as IndustryCategory[];
