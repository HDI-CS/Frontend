export type AdminSectionType = 'DATA' | 'EVALUATION' | 'EXPERT';

export type AdminYear = {
  key: string;
  label: string;
  route: string;
  createdAt: string;
  lastModifiedAt: string;
  phases?: AdminEvaluationPhase[]; // 차수 평가
};

export type AdminSection = {
  key: string;
  label: string;
  route: string;
  createdAt: string;
  lastModifiedAt: string;
  years: AdminYear[];
};

export type AdminSections = Record<AdminSectionType, AdminSection>;

export type AdminEvaluationPhase = {
  key: string;
  label: string;
  route: string;
  createdAt: string;
  lastModifiedAt: string;
  startDate: string;
  endDate: string;
};

export const ADMIN_SECTIONS = {
  DATA: {
    key: 'DATA',
    label: '데이터 관리',
    route: '/data',
  },
  EVALUATION: {
    key: 'EVALUATION',
    label: '평가 관리',
    route: '/evaluation',
  },
  EXPERT: {
    key: 'EXPERT',
    label: '전문가 관리',
    route: '/expert',
  },
} as const;
