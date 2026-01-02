// 전문가 성별
// export type ExpertGender = '남자' | '여자';

// 학계 / 실무계
// export type ExpertBackground = '학계' | '실무계';

// 나이대
// export type ExpertAgeGroup = '20대' | '30대' | '40대' | '50대';

// 전문가 기본 정보
export interface ExpertProfile {
  id?: number; // 번호
  name: string; // 성함
  participation: string; // 참여 차수 (ex. 2025.03 (1차수))
  email: string; // 전문가 이메일
  phone: string; // 연락처
  password: string;
  gender: string; // 성별
  ageGroup: string; // 나이
  experience: string; // 경력 (ex. 5.5년)
  background: string; // 학계 / 실무계
  field: string; // 전문분야
  company: string; // 회사
}

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
