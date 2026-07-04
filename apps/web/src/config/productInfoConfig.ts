export type FieldConfig = {
  label: string;
  key: string;
  type?: 'link';
};

export const SURVEY_INFO_CONFIG = {
  visual: {
    PACKAGE: {
      title: '패키지 정보',
      subTitle: '패키지 상세 정보',
      surveyTitle: '패키지 평가 설문',
      surveyDescription:
        '웹사이트에 있는 내용을 참고하되, 평가는 제시된 이미지만을 기준으로 평가해주세요.',
    },

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
    PACKAGE: [
      { label: '부문·카테고리', key: 'sectorCategory' },
      { label: '이름', key: 'title' },
      { label: '분류', key: 'visualType' },
      { label: '주체', key: 'clientName' },
      { label: '내용', key: 'designDescription' },
      // { label: '내용(원문)', key: 'originalDescription' },
      { label: '웹사이트', key: 'referenceUrl', type: 'link' },
    ],

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
      // { label: '회사명', key: 'companyName' },
      { label: '모델명', key: 'modelName' },
      { label: '가격', key: 'price' },
      { label: '재질', key: 'material' },
      { label: '사이즈', key: 'size' },
      { label: '링크', key: 'referenceUrl', type: 'link' },
    ],

    HEADPHONE: [
      { label: '제품명', key: 'productName' },
      // { label: '회사명', key: 'companyName' },
      { label: '노이즈 캔슬링', key: 'noiseCancelling' },
      { label: '코덱', key: 'codec' },
      { label: '부가기능', key: 'extraFeatures' },
      { label: '컨트롤 방식', key: 'controlType' },
      { label: '최대 재생시간', key: 'maxPlayTime' },
      { label: '충전 시간', key: 'chargeTime' },
      { label: '링크', key: 'referenceUrl', type: 'link' },
    ],

    EARPHONE: [
      { label: '제품명', key: 'productName' },
      // { label: '회사명', key: 'companyName' },
      { label: '노이즈 캔슬링', key: 'noiseCancelling' },
      { label: '코덱', key: 'codec' },
      { label: '부가기능', key: 'extraFeatures' },
      { label: '컨트롤 방식', key: 'controlType' },
      { label: '최대 재생시간', key: 'maxPlayTime' },
      { label: '충전 시간', key: 'chargeTime' },

      { label: '방수 기능', key: 'waterproof' },
      { label: '무게', key: 'weight' },
      { label: '가격', key: 'price' },
      { label: '등록일', key: 'registeredAt' },
      { label: '링크', key: 'referenceUrl', type: 'link' },
      // { label: '쇼핑몰 URL', key: 'shoppingUrl', type: 'link' },
    ],

    BLUETOOTH_SPEAKER: [
      { label: '제품명', key: 'productName' },
      // { label: '회사명', key: 'companyName' },
      // { label: '노이즈 캔슬링', key: 'noiseCancelling' },
      { label: '사운드 출력', key: 'soundOutput' },
      { label: '코덱', key: 'codec' },
      { label: '부가기능', key: 'extraFeatures' },
      { label: '최대 재생시간', key: 'maxPlayTime' },
      { label: '충전 시간', key: 'chargeTime' },
      { label: '입출력', key: 'connectivity' },

      // { label: '방수 여부', key: 'waterproof' },
      { label: '무게', key: 'weight' },
      { label: '가격', key: 'price' },
      { label: '등록일', key: 'registeredAt' },
      { label: '링크', key: 'referenceUrl', type: 'link' },
    ],
  },
} as const;
