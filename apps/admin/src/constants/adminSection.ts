export type AdminSectionType = 'DATA' | 'EVALUATION' | 'EXPERT';

export type AdminYear = {
  key: string;
  label: string;
  route: string;
  createdAt: string;
  lastModifiedAt: string;
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

export const ADMIN_SECTIONS: AdminSections = {
  DATA: {
    key: 'DATA',
    label: '데이터 관리',
    route: '/index/data',
    createdAt: '2021-11-03 22:00',
    lastModifiedAt: '2021-11-03 22:00',
    years: [
      {
        key: 'YEAR_1',
        label: '1차년도',
        route: '/data/year1',
        createdAt: '2021-11-03 22:00',
        lastModifiedAt: '2021-11-03 22:00',
      },
      {
        key: 'YEAR_2',
        label: '2차년도',
        route: '/data/year2',
        createdAt: '2021-11-03 22:00',
        lastModifiedAt: '2021-11-03 22:00',
      },
    ],
  },

  EVALUATION: {
    key: 'EVALUATION',
    label: '평가 관리',
    route: '/index/evaluation',
    createdAt: '2021-11-03 22:00',
    lastModifiedAt: '2021-11-03 22:00',
    years: [],
  },

  EXPERT: {
    key: 'EXPERT',
    label: '전문가 관리',
    route: '/index/expert',
    createdAt: '2021-11-03 22:00',
    lastModifiedAt: '2021-11-03 22:00',
    years: [],
  },
} as const;
