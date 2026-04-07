export type FieldConfig = {
  label: string;
  key: string;
  type?: 'link';
};

export const SURVEY_INFO_CONFIG = {
  visual: {
    POSTER: {
      title: '포스터 정보',
      subTitle: '포스터 상세 정보',
      surveyTitle: '포스터 평가 설문',
      surveyDescription: '포스터 디자인에 대한 평가를 진행해주세요.',
    },

    COSMETIC: {
      title: '로고 정보',
      subTitle: '로고 상세 정보',
      surveyTitle: '로고 평가 설문',
      surveyDescription: '로고 디자인에 대한 평가를 진행해주세요.',
    },
    FB: {
      title: '로고 정보',
      subTitle: '로고 상세 정보',
      surveyTitle: '로고 평가 설문',
      surveyDescription: '로고 디자인에 대한 평가를 진행해주세요.',
    },
  },

  industry: {
    PRODUCT: {
      title: '제품 정보',
      subTitle: '제품 상세 정보',
      surveyTitle: '제품 평가 설문',
      surveyDescription: '제품에 대한 평가를 진행해주세요.',
    },
  },
} as const;

export const PRODUCT_INFO_CONFIG = {
  visual: {
    POSTER: [
      { label: '부문·카테고리', key: 'sectorCategory' },
      { label: '년도', key: 'releaseYear' },
      { label: '국가', key: 'country' },
      { label: '클라이언트', key: 'clientName' },
      { label: '내용 유형', key: 'contentType' },
      { label: '시각 유형', key: 'visualType' },
      { label: '디자인 설명', key: 'designDescription' },
      { label: '홈페이지', key: 'referenceUrl', type: 'link' },
    ],

    LOGO: [
      { label: '부문·카테고리', key: 'sectorCategory' },
      { label: '대표 제품 카테고리', key: 'mainProductCategory' },
      { label: '대표 제품', key: 'mainProduct' },
      { label: '타겟(성별/연령)', key: 'target' },
      { label: '홈페이지', key: 'referenceUrl', type: 'link' },
    ],
  },

  industry: {
    PRODUCT: [
      { label: '제품명', key: 'productName' },
      { label: '회사명', key: 'companyName' },
      { label: '모델명', key: 'modelName' },
      { label: '가격', key: 'price' },
      { label: '재질', key: 'material' },
      { label: '사이즈', key: 'size' },
      { label: '홈페이지', key: 'referenceUrl', type: 'link' },
    ],

    HEADPHONE: [
      { label: '제품명', key: 'productName' },
      { label: '회사명', key: 'companyName' },
      { label: '노이즈 캔슬링', key: 'noiseCancelling' },
      { label: '코덱', key: 'codec' },
      { label: '부가기능', key: 'extraFeatures' },
      { label: '컨트롤 방식', key: 'controlType' },
      { label: '최대 재생시간', key: 'maxPlayTime' },
      { label: '충전 시간', key: 'chargeTime' },
      { label: '홈페이지', key: 'referenceUrl', type: 'link' },
    ],

    EARPHONE: [
      { label: '제품명', key: 'productName' },
      { label: '회사명', key: 'companyName' },
      { label: '노이즈 캔슬링', key: 'noiseCancelling' },
      { label: '코덱', key: 'codec' },
      { label: '부가기능', key: 'extraFeatures' },
      { label: '컨트롤 방식', key: 'controlType' },
      { label: '최대 재생시간', key: 'maxPlayTime' },
      { label: '충전 시간', key: 'chargeTime' },

      { label: '방수 여부', key: 'waterproof' },
      { label: '무게', key: 'weight' },
      { label: '가격', key: 'price' },
      { label: '등록일', key: 'registeredAt' },
      { label: '홈페이지', key: 'referenceUrl', type: 'link' },
      { label: '쇼핑 URL', key: 'shoppingUrl', type: 'link' },
    ],
  },
} as const;
