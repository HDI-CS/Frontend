// 전문가 성별
// export type ExpertGender = '남자' | '여자';

// 학계 / 실무계
// export type ExpertBackground = '학계' | '실무계';

// 나이대
// export type ExpertAgeGroup = '20대' | '30대' | '40대' | '50대';

// 전문가 기본 정보
export interface ExpertProfile {
  id: number; // 번호
  name: string; // 성함
  participation: string; // 참여 차수 (ex. 2025.03 (1차수))
  email: string; // 전문가 이메일
  phone: string; // 연락처
  gender: string; // 성별
  ageGroup: string; // 나이
  experience: string; // 경력 (ex. 5.5년)
  background: string; // 학계 / 실무계
  field: string; // 전문분야
  company: string; // 회사
}

export const DUMMY_EXPERTS: ExpertProfile[] = [
  {
    id: 1,
    name: '장혜선',
    participation: '2025.03 (1차수)',
    email: 'hyesun.jang@gmail.com',
    phone: '010-1234-5678',
    gender: '여자',
    ageGroup: '40대',
    experience: '5.5년',
    background: '학계',
    field: '그래픽디자인',
    company: '삼성',
  },
  {
    id: 2,
    name: '김도윤',
    participation: '2025.03 (1차수)',
    email: 'doyun.kim@gmail.com',
    phone: '010-2345-6789',
    gender: '남자',
    ageGroup: '30대',
    experience: '7년',
    background: '실무계',
    field: 'UX/UI 디자인',
    company: '네이버',
  },
  {
    id: 3,
    name: '이수민',
    participation: '2025.03 (1차수)',
    email: 'sumin.lee@gmail.com',
    phone: '010-3456-7890',
    gender: '여자',
    ageGroup: '30대',
    experience: '4년',
    background: '실무계',
    field: '서비스 디자인',
    company: '카카오',
  },
  {
    id: 4,
    name: '박준호',
    participation: '2025.03 (1차수)',
    email: 'junho.park@gmail.com',
    phone: '010-4567-8901',
    gender: '남자',
    ageGroup: '40대',
    experience: '10년',
    background: '학계',
    field: '산업디자인',
    company: '현대자동차',
  },
  {
    id: 5,
    name: '최유진',
    participation: '2025.03 (1차수)',
    email: 'yujin.choi@gmail.com',
    phone: '010-5678-9012',
    gender: '여자',
    ageGroup: '20대',
    experience: '3년',
    background: '실무계',
    field: '브랜드 디자인',
    company: '스타트업',
  },
  {
    id: 6,
    name: '정민수',
    participation: '2025.03 (1차수)',
    email: 'minsu.jung@gmail.com',
    phone: '010-6789-0123',
    gender: '남자',
    ageGroup: '50대',
    experience: '15년',
    background: '학계',
    field: '시각디자인',
    company: '대학교',
  },
  {
    id: 7,
    name: '한지은',
    participation: '2025.03 (1차수)',
    email: 'jieun.han@gmail.com',
    phone: '010-7890-1234',
    gender: '여자',
    ageGroup: '30대',
    experience: '6년',
    background: '실무계',
    field: '콘텐츠 디자인',
    company: 'CJ',
  },
  {
    id: 8,
    name: '오세훈',
    participation: '2025.03 (1차수)',
    email: 'sehun.oh@gmail.com',
    phone: '010-8901-2345',
    gender: '남자',
    ageGroup: '40대',
    experience: '8년',
    background: '실무계',
    field: '제품 디자인',
    company: 'LG',
  },
];

export type IdMappingFolder = {
  key: string;
  label: string;
  route: string;
  createdAt: string;
  lastModifiedAt: string;
  duration: string; // 서버에서 데이터 주는 방식에 따라 시작-끝 기간 나눌수도
};

export const ID_MAPPING_FOLDERS: IdMappingFolder[] = [
  {
    key: 'year1',
    label: '1차년도',
    route: '/index/expert/id-mapping/year1',
    createdAt: '2024-01-10 10:00',
    lastModifiedAt: '2024-06-01 10:00',
    duration: '2024.01 - 2024.12',
  },
  {
    key: 'year2',
    label: '2차년도',
    route: '/index/expert/id-mapping/year2',
    createdAt: '2025-01-05 10:00',
    lastModifiedAt: '2025-06-15 10:00',
    duration: '2025.01 - 2025.12',
  },
];

export const MAPPING_PHASE_FOLDER: IdMappingFolder[] = [
  {
    key: 'phase1',
    label: '1차수',
    route: '/index/expert/id-mapping/year1/phase1',
    createdAt: '2024-01-10 10:00',
    lastModifiedAt: '2024-06-01 10:00',
    duration: '2024.01 - 2024.12',
  },
];

///////////////////////////
// ID 매칭 1차수 더미 데이터
export type IdMappingType = {
  expertId: number;
  expertName: string;
  assignedProductIds: string[];
};
export const ID_MAPPING_DUMMY: IdMappingType[] = [
  {
    expertId: 1,
    expertName: '정혜성',
    assignedProductIds: ['0001', '0002', '0004', '0005', '0006', '0007'],
  },
  {
    expertId: 2,
    expertName: '김민준',
    assignedProductIds: ['0001', '0003', '0005', '0008'],
  },
  {
    expertId: 3,
    expertName: '이서연',
    assignedProductIds: ['0002', '0004', '0006', '0009', '0010'],
  },
  {
    expertId: 4,
    expertName: '박지훈',
    assignedProductIds: ['0001', '0002', '0003', '0004'],
  },
  {
    expertId: 5,
    expertName: '최유진',
    assignedProductIds: ['0005', '0006', '0007', '0008', '0009'],
  },
  {
    expertId: 6,
    expertName: '정우성',
    assignedProductIds: ['0002', '0003', '0006', '0010'],
  },
  {
    expertId: 7,
    expertName: '한지민',
    assignedProductIds: ['0001', '0004', '0007', '0008', '0009', '0010'],
  },
  {
    expertId: 8,
    expertName: '오세훈',
    assignedProductIds: ['0003', '0005', '0006', '0007'],
  },
];

// 1차수 수행 모든 아이디

export const ALL_IDS = [
  '0001',
  '0002',
  '0003',
  '0004',
  '0005',
  '0006',
  '0007',
  '0008',
  '0009',
  '0010',
  '0011',
  '0012',
  '0013',
  '0014',
  '0015',
  '0016',
  '0017',
  '0018',
  '0019',
  '0020',
  '0021',
  '0022',
  '0023',
  '0024',
  '0025',
  '0026',
  '0027',
  '0028',
  '0029',
  '0030',
  '0031',
  '0032',
  '0033',
  '0034',
  '0035',
  '0036',
  '0037',
  '0038',
  '0039',
  '0040',
  '0041',
  '0042',
  '0044',
  '0045',
  '0056',
  '0049',
];
