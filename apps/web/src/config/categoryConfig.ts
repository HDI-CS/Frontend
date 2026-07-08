/**
 * 시각/산업 디자인 평가에 관련된 모든 카테고리 메타데이터를 관리하는 단일 파일.
 *
 * ⚠️ 새로운 차수/카테고리(예: 2026 3차 - 새 카테고리)가 생기면
 * VISUAL_CATEGORY_KEYS = 역대 모든 카테고리 (스키마 검증용)
 * 이 값 = "지금 이 차수에서 평가자가 채워야 하는" 활성 카테고리만 (가중치평가 완료 판정용)
 *
 * 새 차수를 오픈할 때마다 반드시 이 값을 갱신해야 합니다.
 * (백엔드에 "현재 활성 카테고리 목록" API가 생기면 이 하드코딩은 제거 가능)
 */

export type FieldMeta = {
  key: string;
  label: string;
  type?: 'link';
};

export type CategorySurveyInfo = {
  title: string;
  subTitle: string;
  surveyTitle: string;
  surveyDescription: string;
};

export type CategoryDefinition = {
  survey: CategorySurveyInfo;
  fields: FieldMeta[];
};

// ── VISUAL ──────────────────────────────────────────────
// 상세 정보 페이지에서 보여줄 데이터 필드와 설문 평가 페이지에서 보여줄 설문 정보(제목, 설명 등)를 정의합니다.
export const VISUAL_CATEGORY_CONFIG = {
  POSTER: {
    survey: {
      title: '포스터 정보',
      subTitle: '포스터 상세 정보',
      surveyTitle: '포스터 평가 설문',
      surveyDescription: '포스터 디자인에 대한 평가를 진행해주세요.',
    },
    fields: [
      { key: 'sectorCategory', label: '부문·카테고리' },
      { key: 'releaseYear', label: '년도' },
      { key: 'country', label: '국가' },
      { key: 'clientName', label: '클라이언트' },
      { key: 'contentType', label: '내용 유형' },
      { key: 'visualType', label: '시각 유형' },
      { key: 'designDescription', label: '디자인 설명' },
      { key: 'referenceUrl', label: '웹사이트', type: 'link' },
    ],
  },

  PACKAGE: {
    survey: {
      title: '패키지 정보',
      subTitle: '패키지 상세 정보',
      surveyTitle: '패키지 평가 설문',
      surveyDescription:
        '웹사이트에 있는 내용을 참고하되, 평가는 제시된 이미지만을 기준으로 평가해주세요.',
    },
    fields: [
      { key: 'sectorCategory', label: '부문·카테고리' },
      { key: 'title', label: '이름' },
      { key: 'visualType', label: '분류' },
      { key: 'clientName', label: '주체' },
      { key: 'designDescription', label: '내용' },
      // { key: 'originalDescription', label: '내용(원문)' },
      { key: 'referenceUrl', label: '웹사이트', type: 'link' },
    ],
  },

  COSMETIC: {
    survey: {
      title: '로고 정보',
      subTitle: '로고 상세 정보',
      surveyTitle: '로고 평가 설문',
      surveyDescription: '로고 디자인에 대한 평가를 진행해주세요.',
    },
    fields: [
      { key: 'sectorCategory', label: '부문·카테고리' },
      { key: 'mainProductCategory', label: '대표 제품 카테고리' },
      { key: 'mainProduct', label: '대표 제품' },
      { key: 'target', label: '타겟(성별/연령)' },
      { key: 'referenceUrl', label: '홈페이지', type: 'link' },
    ],
  },

  FB: {
    survey: {
      title: '로고 정보',
      subTitle: '로고 상세 정보',
      surveyTitle: '로고 평가 설문',
      surveyDescription: '로고 디자인에 대한 평가를 진행해주세요.',
    },
    fields: [
      { key: 'sectorCategory', label: '부문·카테고리' },
      { key: 'mainProductCategory', label: '대표 제품 카테고리' },
      { key: 'mainProduct', label: '대표 제품' },
      { key: 'target', label: '타겟(성별/연령)' },
      { key: 'referenceUrl', label: '홈페이지', type: 'link' },
    ],
  },
} as const satisfies Record<string, CategoryDefinition>;

// ── INDUSTRY ────────────────────────────────────────────

const ELECTRONICS_SURVEY_META = (title: string) => ({
  title: `${title} 정보`,
  subTitle: `${title} 상세 정보`,
  surveyTitle: `${title} 평가 설문`,
  surveyDescription: `${title} 디자인에 대한 평가를 진행해주세요.`,
});

const ELECTRONICS_FIELDS: FieldMeta[] = [
  // { key: 'companyName', label: '회사명' },
  { key: 'productPath', label: '카테고리' },
  { key: 'productTypeName', label: '유형' },
  { key: 'usage', label: '용도' },
  { key: 'weight', label: '무게' },
  { key: 'price', label: '가격' },
  { key: 'registeredAt', label: '출시일' },
  { key: 'referenceUrl', label: '구매 링크', type: 'link' },
];

export const INDUSTRY_CATEGORY_CONFIG = {
  VACUUM_CLEANER: {
    survey: {
      title: '진공청소기 정보',
      subTitle: '진공청소기 상세 정보',
      surveyTitle: '진공청소기 평가 설문',
      surveyDescription: '진공청소기 디자인에 대한 평가를 진행해주세요.',
    },
    fields: [
      { key: 'modelName', label: '모델명' },
      { key: 'material', label: '재질' },
      { key: 'size', label: '사이즈' },
      { key: 'referenceUrl', label: '링크', type: 'link' },
    ],
  },

  AIR_PURIFIER: {
    survey: {
      title: '공기청정기 정보',
      subTitle: '공기청정기 상세 정보',
      surveyTitle: '공기청정기 평가 설문',
      surveyDescription: '공기청정기 디자인에 대한 평가를 진행해주세요.',
    },
    fields: [
      { key: 'modelName', label: '모델명' },
      { key: 'material', label: '재질' },
      { key: 'size', label: '사이즈' },
      { key: 'referenceUrl', label: '링크', type: 'link' },
    ],
  },

  HAIR_DRYER: {
    survey: {
      title: '헤어드라이기 정보',
      subTitle: '헤어드라이기 상세 정보',
      surveyTitle: '헤어드라이기 평가 설문',
      surveyDescription: '헤어드라이기 디자인에 대한 평가를 진행해주세요.',
    },
    fields: [
      { key: 'modelName', label: '모델명' },
      { key: 'material', label: '재질' },
      { key: 'size', label: '사이즈' },
    ],
  },

  HEADPHONE: {
    survey: {
      title: '헤드폰 정보',
      subTitle: '헤드폰 상세 정보',
      surveyTitle: '헤드폰 평가 설문',
      surveyDescription: '헤드폰 디자인에 대한 평가를 진행해주세요.',
    },
    fields: [
      { key: 'noiseCancelling', label: '노이즈 캔슬링' },
      { key: 'codec', label: '코덱' },
      { key: 'extraFeatures', label: '부가기능' },
      { key: 'controlType', label: '컨트롤 방식' },
      { key: 'maxPlayTime', label: '최대 재생시간' },
      { key: 'chargeTime', label: '충전 시간' },
    ],
  },

  EARPHONE: {
    survey: {
      title: '이어폰 정보',
      subTitle: '이어폰 상세 정보',
      surveyTitle: '이어폰 평가 설문',
      surveyDescription: '이어폰 디자인에 대한 평가를 진행해주세요.',
    },
    fields: [
      { key: 'noiseCancelling', label: '노이즈 캔슬링' },
      { key: 'codec', label: '코덱' },
      { key: 'extraFeatures', label: '부가기능' },
      { key: 'controlType', label: '컨트롤 방식' },
      { key: 'maxPlayTime', label: '최대 재생시간' },
      { key: 'chargeTime', label: '충전 시간' },
      { key: 'waterproof', label: '방수 기능' },
    ],
  },

  BLUETOOTH_SPEAKER: {
    // survey: {
    //   title: '블루투스 스피커 정보',
    //   subTitle: '블루투스 스피커 상세 정보',
    //   surveyTitle: '블루투스 스피커 평가 설문',
    //   surveyDescription: '블루투스 스피커 디자인에 대한 평가를 진행해주세요.',
    // },
    // fields: [
    //   { key: 'soundOutput', label: '사운드 출력' },
    //   { key: 'codec', label: '코덱' },
    //   { key: 'extraFeatures', label: '부가기능' },
    //   { key: 'maxPlayTime', label: '최대 재생시간' },
    //   { key: 'chargeTime', label: '충전 시간' },
    //   { key: 'connectivity', label: '입출력' },
    // ],

    survey: ELECTRONICS_SURVEY_META('포터블 스피커'),
    fields: ELECTRONICS_FIELDS,
  },

  // 2026 2차

  WIRELESS_MOUSE: {
    survey: ELECTRONICS_SURVEY_META('무선 마우스'),
    fields: ELECTRONICS_FIELDS,
  },
  UMPC: {
    survey: ELECTRONICS_SURVEY_META('UMPC 무선게임기'),
    fields: ELECTRONICS_FIELDS,
  },
  CAMERA: {
    survey: ELECTRONICS_SURVEY_META('카메라'),
    fields: ELECTRONICS_FIELDS,
  },
  WEBCAM: {
    survey: ELECTRONICS_SURVEY_META('웹캠'),
    fields: ELECTRONICS_FIELDS,
  },
  PROJECTOR: {
    survey: ELECTRONICS_SURVEY_META('프로젝터'),
    fields: ELECTRONICS_FIELDS,
  },
} as const satisfies Record<string, CategoryDefinition>;

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

export const INDUSTRY_HIDDEN_SCHEMA_FIELDS = ['usage', 'shoppingUrl'] as const;

// ── 파생 값들 (다른 파일들이 여기서 가져다 씀) ────────────

export const VISUAL_CATEGORY_KEYS = Object.keys(
  VISUAL_CATEGORY_CONFIG
) as (keyof typeof VISUAL_CATEGORY_CONFIG)[];

export const INDUSTRY_CATEGORY_KEYS = Object.keys(
  INDUSTRY_CATEGORY_CONFIG
) as (keyof typeof INDUSTRY_CATEGORY_CONFIG)[];

export const ALL_WEIGHT_CATEGORY_KEYS = [
  ...VISUAL_CATEGORY_KEYS,
  ...INDUSTRY_CATEGORY_KEYS,
];

// ── ⚠️ 가중치평가 완료 판정용: "지금 활성화된" 카테고리만 ──
//
// VISUAL_CATEGORY_KEYS/INDUSTRY_CATEGORY_KEYS와는 다른 값입니다.
// 위 두 값은 "존재했던 모든 카테고리"(스키마 검증용)이고,
// 이 값은 "현재 차수에서 평가자가 실제로 채워야 하는" 카테고리만 담습니다.
//
// 새 차수를 오픈할 때마다 반드시 이 값을 갱신해야 합니다.
// (백엔드에 "현재 활성 카테고리 목록" 조회 API가 생기면
//  이 하드코딩은 API 응답 기반으로 대체 가능합니다.)

export const ACTIVE_WEIGHT_EVALUATION_CATEGORIES = {
  VISUAL: ['PACKAGE'] as const,
  INDUSTRY: [
    'WIRELESS_MOUSE',
    'UMPC',
    'CAMERA',
    'WEBCAM',
    'PROJECTOR',
    'BLUETOOTH_SPEAKER',
  ] as const,
};

// categoryConfig.ts에 추가

export type WeightCategoryMeta = { id: string; name: string };

export const WEIGHT_CATEGORY_META: Record<string, WeightCategoryMeta> = {
  COSMETIC: { id: 'cosmetics', name: '화장품' },
  FB: { id: 'fnb', name: 'F&B' },
  POSTER: { id: 'poster', name: '포스터' },
  PACKAGE: { id: 'package', name: '패키지' },

  VACUUM_CLEANER: { id: 'vacuum', name: '핸디스틱청소기' },
  AIR_PURIFIER: { id: 'airpurifier', name: '공기청정기/가습기' },
  HAIR_DRYER: { id: 'hairdryer', name: '헤어드라이기' },
  HEADPHONE: { id: 'headphone', name: '헤드폰' },
  EARPHONE: { id: 'earphone', name: '이어폰' },
  BLUETOOTH_SPEAKER: { id: 'bluetooth_speaker', name: '블루투스 스피커' },

  WIRELESS_MOUSE: { id: 'wireless_mouse', name: '무선 마우스' },
  UMPC: { id: 'umpc', name: 'UMPC 무선게임기' },
  CAMERA: { id: 'camera', name: '카메라' },
  WEBCAM: { id: 'webcam', name: '웹캠' },
  PROJECTOR: { id: 'projector', name: '프로젝터' },
};

const collectAllFieldKeys = <T extends Record<string, CategoryDefinition>>(
  config: T
) => {
  const keys = new Set<string>();
  Object.values(config).forEach((def) => {
    def.fields.forEach((f) => keys.add(f.key));
  });
  return Array.from(keys) as T[keyof T]['fields'][number]['key'][];
};

// 카테고리마다 필드가 달라도, 응답 스키마는 "존재 가능한 모든 필드"를
// nullable로 다 열어둬야 하므로 전체 카테고리의 필드 키를 합집합으로 모음
export const VISUAL_FIELD_KEYS = collectAllFieldKeys(VISUAL_CATEGORY_CONFIG);
export const INDUSTRY_FIELD_KEYS = collectAllFieldKeys(
  INDUSTRY_CATEGORY_CONFIG
);

// ── 파생: 카테고리 필드 키 합집합에서 core 필드 제외한 optional 키 ──
export const INDUSTRY_OPTIONAL_FIELD_KEYS = [
  ...INDUSTRY_FIELD_KEYS, // categoryConfig.ts에 이미 있는 값 (collectAllFieldKeys 결과)
  ...INDUSTRY_HIDDEN_SCHEMA_FIELDS,
].filter((k) => !(INDUSTRY_CORE_FIELDS as readonly string[]).includes(k));

export const INDUSTRY_ITEM_NULLABLE_KEYS = [
  ...INDUSTRY_CORE_FIELDS.filter((k) => k !== 'code'),
  ...INDUSTRY_OPTIONAL_FIELD_KEYS,
] as const;
