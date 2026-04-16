type IndustryColumnDef = {
  key: string;
  header: string;
  thClassName: string;
  className: string;
  maxLength: number;
};

type VisualColumnDef = {
  key: string;
  header: string;
  thClassName: string;
  className: string;
  maxLength: number;
};

export const CATEGORY_FIELD_CONFIG = {
  visual: {
    POSTER: [
      { label: '부문·카테고리', key: 'sectorCategory' },
      { label: '년도', key: 'releaseYear' },
      { label: '국가', key: 'country' },
      { label: '클라이언트', key: 'clientName' },
      { label: '내용 유형', key: 'contentType' },
      { label: '시각 유형', key: 'visualType' },
      { label: '디자인 설명', key: 'designDescription' },
      { label: '웹사이트', key: 'referenceUrl', type: 'link' },
    ],

    COSMETIC: [
      { label: '부문·카테고리', key: 'sectorCategory' },
      { label: '대표 제품 카테고리', key: 'mainProductCategory' },
      { label: '대표 제품', key: 'mainProduct' },
      { label: '타겟(성별/연령)', key: 'target' },
      { label: '홈페이지', key: 'referenceUrl', type: 'link' },
    ],
    FB: [
      { label: '부문·카테고리', key: 'sectorCategory' },
      { label: '대표 제품 카테고리', key: 'mainProductCategory' },
      { label: '대표 제품', key: 'mainProduct' },
      { label: '타겟(성별/연령)', key: 'target' },
      { label: '홈페이지', key: 'referenceUrl', type: 'link' },
    ],
  },

  industry: {
    VACUUM_CLEANER: [
      // { label: '회사명', key: 'companyName' },
      { label: '모델명', key: 'modelName' },
      { label: '재질', key: 'material' },
      { label: '사이즈', key: 'size' },
      { label: '링크', key: 'referenceUrl', type: 'link' },
    ],
    AIR_PURIFIER: [
      // { label: '회사명', key: 'companyName' },
      { label: '모델명', key: 'modelName' },
      { label: '재질', key: 'material' },
      { label: '사이즈', key: 'size' },
      { label: '링크', key: 'referenceUrl', type: 'link' },
    ],
    HAIR_DRYER: [
      // { label: '회사명', key: 'companyName' },
      { label: '모델명', key: 'modelName' },
      { label: '재질', key: 'material' },
      { label: '사이즈', key: 'size' },
    ],

    HEADPHONE: [
      // { label: '회사명', key: 'companyName' },
      { label: '노이즈 캔슬링', key: 'noiseCancelling' },
      { label: '코덱', key: 'codec' },
      { label: '부가기능', key: 'extraFeatures' },
      { label: '컨트롤 방식', key: 'controlType' },
      { label: '최대 재생시간', key: 'maxPlayTime' },
      { label: '충전 시간', key: 'chargeTime' },
    ],

    EARPHONE: [
      // { label: '회사명', key: 'companyName' },
      { label: '노이즈 캔슬링', key: 'noiseCancelling' },
      { label: '코덱', key: 'codec' },
      { label: '부가기능', key: 'extraFeatures' },
      { label: '컨트롤 방식', key: 'controlType' },
      { label: '최대 재생시간', key: 'maxPlayTime' },
      { label: '충전 시간', key: 'chargeTime' },

      { label: '방수 기능', key: 'waterproof' },
      // { label: '쇼핑몰 URL', key: 'shoppingUrl', type: 'link' },
    ],

    BLUETOOTH_SPEAKER: [
      // { label: '회사명', key: 'companyName' },
      // { label: '노이즈 캔슬링', key: 'noiseCancelling' },
      { label: '사운드 출력', key: 'soundOutput' },
      { label: '코덱', key: 'codec' },
      { label: '부가기능', key: 'extraFeatures' },
      { label: '최대 재생시간', key: 'maxPlayTime' },
      { label: '충전 시간', key: 'chargeTime' },
      { label: '입출력', key: 'connectivity' },
    ],
  },
} as const;

export const INDUSTRY_DYNAMIC_COLUMN_MAP: Record<string, IndustryColumnDef> = {
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

export const VISUAL_DYNAMIC_COLUMN_MAP: Record<string, VisualColumnDef> = {
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
