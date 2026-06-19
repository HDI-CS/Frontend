export const SIDEBAR_MENU = [
  {
    label: '시각디자인',
    path: '/index',
    children: [
      {
        label: '데이터 관리',
        path: '/data',
        children: [
          { label: '1차년도', path: '/data/1' },
          { label: '2차년도', path: '/data/2' },
        ],
      },
    ],
  },
  {
    label: '평가 관리',
    path: '/evaluation',
    children: [
      { label: '1차년도', path: '/data/1' },
      { label: '2차년도', path: '/data/2' },
    ],
  },
  {
    label: '전문가 관리',
    path: '/expert',
  },
];
