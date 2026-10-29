import z from 'zod';

import type { CreateIndustrialDatasetRequest } from '../schemas/industry-data';
import { CreateVisualDatasetRequest } from '../schemas/visual-data';

export type VisualDatasetDefaults = Omit<
  CreateVisualDatasetRequest,
  'visualDataCategory'
>;

export type IndustryDatasetDefaults = Omit<
  CreateIndustrialDatasetRequest,
  'industryDataCategory'
>;

type IndustryColumnDef = {
  key: string;
  header: string;
  thClassName: string;
  className: string;
  maxLength: number;
};

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

// 2026-10-29: mainProductCategory/mainProduct/target/title/country/clientName/
// contentType/visualType/designDescription/originalDescription/releaseYear는
// 카테고리마다 쓰는 게 달라서 visual_category_field_spec(attributes 스펙)으로
// 마이그레이션했음. sectorCategory/referenceUrl은 전 카테고리 공통이라 그대로 둠.
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

// 백엔드 field spec(attributeLabelByKey)이 아직 없는 레거시 키들의 폴백 라벨.
// mainProductCategory 등이 고정 필드에서 attributes로 옮겨왔는데
// visual_category_field_spec에 아직 라벨이 안 채워진 경우 raw key 대신 보여준다.
export const VISUAL_DYNAMIC_ATTRIBUTE_LABEL_MAP: Record<string, string> = {
  mainProductCategory: '대표 제품 카테고리',
  mainProduct: '대표 제품',
  target: '타겟(성별/연령)',
  title: '제목',
  releaseYear: '년도',
  country: '국가',
  clientName: '클라이언트',
  contentType: '내용 유형',
  visualType: '시각 유형',
  designDescription: '내용(국문)',
  originalDescription: '내용(원문)',
};

// ── INDUSTRY_CATEGORY_CONFIG도 동일 원칙 적용 ──────────────
const ELECTRONICS_COMMON_FIELDS = [
  { key: 'productTypeName', label: '유형' },
  { key: 'usage', label: '용도' },
] as const;

export const INDUSTRY_CATEGORY_CONFIG = {
  // 2026-10-28: modelName/material/size는 청소기류 3개만 쓰는 필드라 industry_category_field_spec
  // (연도2 전용 스펙)으로 마이그레이션해서 비움. referenceUrl은 전 카테고리 공통이라 그대로 둠.
  VACUUM_CLEANER: [{ key: 'referenceUrl', label: '링크', type: 'link' }],
  AIR_PURIFIER: [{ key: 'referenceUrl', label: '링크', type: 'link' }],
  HAIR_DRYER: [],
  // 2026-10-28: 고정 필드 6개를 industry_category_field_spec(attributes 스펙)으로
  // 마이그레이션함. 여기 남겨두면 "추가 스펙" 섹션과 값이 중복 표시되어 비움.
  // (DB 레거시 컬럼 noise_cancelling 등은 과거 조회용으로 그대로 남아있음)
  HEADPHONE: [],
  // 2026-10-28: 고정 필드 7개를 industry_category_field_spec(attributes 스펙)으로 마이그레이션함.
  EARPHONE: [],

  // 2026-10-28: 2026(연도 10) 데이터의 고정 필드 6개를 industry_category_field_spec
  // (연도 10 전용 스펙)으로 마이그레이션해서 비움. 2026 2차(연도 13)는 아래
  // INDUSTRY_FIELD_OVERRIDES_BY_YEAR에서 ELECTRONICS_COMMON_FIELDS로 그대로 override.
  BLUETOOTH_SPEAKER: [],

  // 2026 2차 신규
  WIRELESS_MOUSE: ELECTRONICS_COMMON_FIELDS,
  UMPC: ELECTRONICS_COMMON_FIELDS,
  CAMERA: ELECTRONICS_COMMON_FIELDS,
  WEBCAM: ELECTRONICS_COMMON_FIELDS,
  PROJECTOR: ELECTRONICS_COMMON_FIELDS,

  // 2026 3차 신규 (전기전자제품)
  COFFEE_MACHINE: ELECTRONICS_COMMON_FIELDS,
  COFFEE_MAKER: ELECTRONICS_COMMON_FIELDS,
  COFFEE_GRINDER: ELECTRONICS_COMMON_FIELDS,
  PRESSURE_RICE_COOKER: ELECTRONICS_COMMON_FIELDS,
  MULTI_COOKER: ELECTRONICS_COMMON_FIELDS,
  AIR_FRYER: ELECTRONICS_COMMON_FIELDS,
  MIXER: ELECTRONICS_COMMON_FIELDS,
} as const satisfies Record<string, readonly AdminFieldMeta[]>;

export type IndustryCategory = keyof typeof INDUSTRY_CATEGORY_CONFIG;

// ⚠️ 같은 카테고리 enum이 회차마다 다른 속성을 채울 때만 쓰는 오버라이드.
// (BLUETOOTH_SPEAKER처럼 카테고리가 재사용되지만 실제 채우는 필드가 완전히 바뀐 경우)
export const INDUSTRY_FIELD_OVERRIDES_BY_YEAR: Record<
  string,
  Partial<Record<string, readonly AdminFieldMeta[]>>
> = {
  '2026 2차': {
    BLUETOOTH_SPEAKER: ELECTRONICS_COMMON_FIELDS,
  },
};

export const getIndustryFieldsForYear = (
  yearName: string | undefined,
  category: string
): readonly AdminFieldMeta[] => {
  const override = yearName
    ? INDUSTRY_FIELD_OVERRIDES_BY_YEAR[yearName]?.[category]
    : undefined;
  return (
    override ?? INDUSTRY_CATEGORY_CONFIG[category as IndustryCategory] ?? []
  );
};

// ── 도메인 전체에서 항상 필요한 core 필드 ──────
export const VISUAL_CORE_FIELDS = [
  'code',
  'name',
  'sectorCategory',
  'referenceUrl',
] as const;

// ── 도메인 전체에서 구조적으로 항상 필요한 "core" 필드 ──────
// (카테고리 무관하게 wide table 전체가 갖는 필드. Create 시 필수/기본값 '')
export const INDUSTRY_CORE_FIELDS = [
  'code',
  'productName',
  'companyName',
  'price',
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

export const VISUAL_CATEGORY_KEYS = Object.keys(
  VISUAL_CATEGORY_CONFIG
) as VisualCategory[];

export const INDUSTRY_CATEGORY_KEYS = Object.keys(
  INDUSTRY_CATEGORY_CONFIG
) as IndustryCategory[];

export const INDUSTRY_DYNAMIC_COLUMN_MAP: Record<string, IndustryColumnDef> = {
  modelName: {
    key: 'modelName',
    header: '모델명',
    thClassName: 'w-[120px]',
    className: 'w-[120px]',
    maxLength: 12,
  },
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
